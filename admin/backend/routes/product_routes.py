import json
import os
import re
import uuid

from fastapi import APIRouter, Depends, Request, Form, UploadFile, File
from typing import List
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from auth import admin_required
from models import Product, Category

router = APIRouter()
templates = Jinja2Templates(directory="templates")

UPLOAD_DIR = settings.UPLOAD_DIR
ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
ALLOWED_DOC_EXTS = {".pdf"}


def _fs():
    from firebase_admin import firestore as fb_firestore
    return fb_firestore.client()


def _is_remote_url(url: str) -> bool:
    """Return True only if the URL is a proper http(s) URL (Firebase Storage, CDN, etc.)."""
    return isinstance(url, str) and url.startswith("http")


def _sync_category_to_firestore(cat: "Category") -> None:
    """Mirror a category to Firestore categories/{id}.
    Image is only written if it is a remote URL — local /admin/static/ paths and
    empty values are skipped so existing Firebase Storage URLs are never overwritten.
    """
    import logging
    try:
        from firebase_admin import firestore as fb_firestore
        data = {
            "id": str(cat.id),
            "name": cat.name,
            "slug": cat.slug,
            "description": cat.description or "",
            "advantages": cat.advantages if isinstance(cat.advantages, list) else [],
            "product_count": cat.product_count or 0,
            "updated_at": fb_firestore.SERVER_TIMESTAMP,
        }
        if _is_remote_url(cat.image):
            data["image"] = cat.image
        _fs().collection("categories").document(str(cat.id)).set(data, merge=True)
        logging.info(f"[Firestore] Synced category {cat.id} to categories")
    except Exception as e:
        logging.error(f"[Firestore] Failed to sync category {cat.id}: {e}")


def _sync_product_to_firestore(prod: "Product") -> None:
    """Mirror a product to Firestore products/{id}.
    image / images / datasheet are only written when they contain remote URLs so
    existing Firebase Storage URLs are never overwritten by stale local paths.
    """
    import logging
    try:
        from firebase_admin import firestore as fb_firestore
        data = {
            "id": str(prod.id),
            "name": prod.name,
            "slug": prod.slug,
            "category_id": prod.category_id,
            "category_name": prod.category_name or "",
            "category_slug": prod.category_slug or "",
            "load_class": prod.load_class or "",
            "standard": prod.standard or "",
            "description": prod.description or "",
            "specs": _parse_specs_str(prod.specs),
            "applications": prod.applications if isinstance(prod.applications, list) else [],
            "installation": prod.installation if isinstance(prod.installation, list) else [],
            "featured": bool(prod.featured),
            "updated_at": fb_firestore.SERVER_TIMESTAMP,
        }
        if _is_remote_url(prod.image):
            data["image"] = prod.image
        remote_images = [u for u in (prod.images or []) if _is_remote_url(u)]
        if remote_images:
            data["images"] = remote_images
        if _is_remote_url(prod.datasheet):
            data["datasheet"] = prod.datasheet
        _fs().collection("products").document(str(prod.id)).set(data, merge=True)
        logging.info(f"[Firestore] Synced product {prod.id} to products")
    except Exception as e:
        logging.error(f"[Firestore] Failed to sync product {prod.id}: {e}")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[/\\]', '-', text)   # replace slashes with hyphens before stripping
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text


def ensure_upload_dirs():
    """Create upload subdirectories if they don't exist."""
    for sub in ("images", "models"):
        os.makedirs(os.path.join(UPLOAD_DIR, sub), exist_ok=True)


def _parse_specs_str(value) -> dict:
    """Parse specs stored as JSON text in the DB into a dict for Firestore sync."""
    if isinstance(value, dict):
        return value
    if isinstance(value, str) and value.strip():
        try:
            return json.loads(value)
        except Exception:
            pass
    return {}


_CONTENT_TYPES = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
}


def _upload_to_firebase(content: bytes, path: str, ext: str) -> str | None:
    """Upload bytes to Firebase Storage and return the public URL, or None on failure."""
    try:
        from firebase_admin import storage as fb_storage
        bucket = fb_storage.bucket()
        blob = bucket.blob(path)
        blob.upload_from_string(content, content_type=_CONTENT_TYPES.get(ext, "application/octet-stream"))
        blob.make_public()
        return blob.public_url
    except Exception as e:
        import logging
        logging.warning(f"[Storage] Firebase upload failed: {e}")
        return None


async def save_upload(file: UploadFile, storage_folder: str, allowed_exts: set) -> str | None:
    """Upload a file to Firebase Storage and return its public URL, or None if invalid.

    storage_folder: full folder path inside bucket, e.g. 'categories/frp-grp-products'
                    or 'products/frp-manhole-cover/images'
    """
    if not file or not file.filename:
        return None

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        return None

    unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
    storage_path = f"{storage_folder}/{unique_name}"
    content = await file.read()

    url = _upload_to_firebase(content, storage_path, ext)
    if url:
        return url

    # Fallback: save locally if Firebase Storage is not configured
    local_dir = os.path.join(UPLOAD_DIR, storage_folder)
    os.makedirs(local_dir, exist_ok=True)
    dest = os.path.join(local_dir, unique_name)
    with open(dest, "wb") as f:
        f.write(content)
    return f"/admin/static/uploads/{storage_folder}/{unique_name}"


# --- Categories ---

@router.get("/categories", response_class=HTMLResponse)
async def list_categories(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    categories = db.query(Category).order_by(Category.name).all()
    return templates.TemplateResponse("categories/list.html", {
        "request": request,
        "admin": admin,
        "categories": categories,
    })


@router.get("/categories/new", response_class=HTMLResponse)
async def new_category_form(
    request: Request,
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    return templates.TemplateResponse("categories/form.html", {
        "request": request,
        "admin": admin,
        "category": None,
        "editing": False,
    })


@router.post("/categories/new")
async def create_category(
    request: Request,
    name: str = Form(...),
    description: str = Form(""),
    advantages: str = Form(""),
    image_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    adv_list = [a.strip() for a in advantages.split("\n") if a.strip()]
    cat_slug = slugify(name)
    image_url = await save_upload(image_file, f"categories/{cat_slug}", ALLOWED_IMAGE_EXTS) or ""
    category = Category(
        name=name,
        slug=cat_slug,
        description=description,
        image=image_url,
        advantages=adv_list,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    _sync_category_to_firestore(category)
    return RedirectResponse(url="/admin/categories", status_code=303)


@router.get("/categories/{cat_id}/edit", response_class=HTMLResponse)
async def edit_category_form(
    cat_id: int,
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    category = db.query(Category).filter(Category.id == cat_id).first()
    if not category:
        return RedirectResponse(url="/admin/categories", status_code=303)

    return templates.TemplateResponse("categories/form.html", {
        "request": request,
        "admin": admin,
        "category": category,
        "editing": True,
    })


@router.post("/categories/{cat_id}/edit")
async def update_category(
    cat_id: int,
    name: str = Form(...),
    description: str = Form(""),
    advantages: str = Form(""),
    keep_image: str = Form(""),
    image_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    category = db.query(Category).filter(Category.id == cat_id).first()
    if not category:
        return RedirectResponse(url="/admin/categories", status_code=303)

    adv_list = [a.strip() for a in advantages.split("\n") if a.strip()]
    new_slug = slugify(name)
    new_image = await save_upload(image_file, f"categories/{new_slug}", ALLOWED_IMAGE_EXTS)
    if new_image:
        category.image = new_image
    elif not keep_image:
        category.image = ""

    category.name = name
    category.slug = new_slug
    category.description = description
    category.advantages = adv_list
    db.commit()
    db.refresh(category)
    _sync_category_to_firestore(category)
    return RedirectResponse(url="/admin/categories", status_code=303)


@router.post("/categories/{cat_id}/delete")
async def delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    category = db.query(Category).filter(Category.id == cat_id).first()
    if category:
        cat_id_str = str(category.id)
        db.delete(category)
        db.commit()
        try:
            _fs().collection("categories").document(cat_id_str).delete()
        except Exception as e:
            import logging
            logging.error(f"[Firestore] Failed to delete category {cat_id_str}: {e}")
    return RedirectResponse(url="/admin/categories", status_code=303)


# --- Firestore re-sync ---

@router.post("/resync-firestore")
async def resync_firestore(
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    """Push all categories and products from SQLite → Firestore with correct slugs."""
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    categories = db.query(Category).all()
    for cat in categories:
        _sync_category_to_firestore(cat)

    products = db.query(Product).all()
    for prod in products:
        _sync_product_to_firestore(prod)

    return RedirectResponse(url="/admin/categories", status_code=303)


# --- Products ---

@router.get("/products", response_class=HTMLResponse)
async def list_products(
    request: Request,
    category: str = "",
    search: str = "",
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    from sqlalchemy import case
    frp_first = case(
        (Product.category_slug.like("frp%"), 0),
        else_=1,
    )
    query = db.query(Product)
    if category:
        query = query.filter(Product.category_id == int(category))
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    products = query.order_by(frp_first, Product.category_name, Product.name).all()
    categories = db.query(Category).order_by(Category.name).all()

    return templates.TemplateResponse("products/list.html", {
        "request": request,
        "admin": admin,
        "products": products,
        "categories": categories,
        "current_category": category,
        "search": search,
    })


@router.get("/products/new", response_class=HTMLResponse)
async def new_product_form(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    categories = db.query(Category).order_by(Category.name).all()
    return templates.TemplateResponse("products/form.html", {
        "request": request,
        "admin": admin,
        "product": None,
        "categories": categories,
        "editing": False,
    })


@router.post("/products/new")
async def create_product(
    request: Request,
    name: str = Form(...),
    category_id: int = Form(...),
    load_class: str = Form(""),
    standard: str = Form(""),
    description: str = Form(""),
    specs: str = Form(""),
    applications: str = Form(""),
    installation: str = Form(""),
    featured: str = Form("off"),
    image_files: List[UploadFile] = File(default=[]),
    datasheet_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    cat = db.query(Category).filter(Category.id == category_id).first()

    app_list = [a.strip() for a in applications.split("\n") if a.strip()]
    inst_list = [i.strip() for i in installation.split("\n") if i.strip()]

    # Handle multiple image uploads
    prod_slug = slugify(name)
    image_urls = []
    for f in image_files:
        url = await save_upload(f, f"products/{prod_slug}/images", ALLOWED_IMAGE_EXTS)
        if url:
            image_urls.append(url)
    primary_image = image_urls[0] if image_urls else ""
    datasheet_url = await save_upload(datasheet_file, f"products/{prod_slug}/datasheets", ALLOWED_DOC_EXTS) or ""

    product = Product(
        name=name,
        slug=prod_slug,
        category_id=category_id,
        category_name=cat.name if cat else "",
        category_slug=cat.slug if cat else "",
        load_class=load_class,
        standard=standard,
        image=primary_image,
        images=image_urls,
        datasheet=datasheet_url,
        description=description,
        specs=specs,
        applications=app_list,
        installation=inst_list,
        featured=featured == "on",
    )
    db.add(product)
    if cat:
        cat.product_count = db.query(Product).filter(Product.category_id == cat.id).count() + 1
    db.commit()
    db.refresh(product)
    _sync_product_to_firestore(product)
    # Update category product_count in Firestore too
    if cat:
        db.refresh(cat)
        _sync_category_to_firestore(cat)
    return RedirectResponse(url="/admin/products", status_code=303)


@router.get("/products/{prod_id}/edit", response_class=HTMLResponse)
async def edit_product_form(
    prod_id: int,
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    product = db.query(Product).filter(Product.id == prod_id).first()
    if not product:
        return RedirectResponse(url="/admin/products", status_code=303)

    # Normalize: if images list is missing/empty but primary image exists, populate it
    imgs = product.images if isinstance(product.images, list) else []
    if not imgs and product.image:
        product.images = [product.image]
        db.commit()
        db.refresh(product)

    categories = db.query(Category).order_by(Category.name).all()
    return templates.TemplateResponse("products/form.html", {
        "request": request,
        "admin": admin,
        "product": product,
        "categories": categories,
        "editing": True,
    })


@router.post("/products/{prod_id}/edit")
async def update_product(
    prod_id: int,
    name: str = Form(...),
    category_id: int = Form(...),
    load_class: str = Form(""),
    standard: str = Form(""),
    description: str = Form(""),
    specs: str = Form(""),
    applications: str = Form(""),
    installation: str = Form(""),
    featured: str = Form("off"),
    image_files: List[UploadFile] = File(default=[]),
    datasheet_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    product = db.query(Product).filter(Product.id == prod_id).first()
    if not product:
        return RedirectResponse(url="/admin/products", status_code=303)

    cat = db.query(Category).filter(Category.id == category_id).first()

    app_list = [a.strip() for a in applications.split("\n") if a.strip()]
    inst_list = [i.strip() for i in installation.split("\n") if i.strip()]

    # Append newly uploaded images to existing list.
    # Use list() to create a new object — SQLAlchemy won't detect in-place
    # mutations of the same JSON list instance, so we must reassign a new list.
    existing_images = list(product.images) if isinstance(product.images, list) else []
    for f in image_files:
        url = await save_upload(f, f"products/{product.slug}/images", ALLOWED_IMAGE_EXTS)
        if url:
            existing_images.append(url)
    product.images = existing_images  # always reassign (even if unchanged)
    product.image = existing_images[0] if existing_images else ""

    new_datasheet = await save_upload(datasheet_file, f"products/{product.slug}/datasheets", ALLOWED_DOC_EXTS)
    if new_datasheet:
        product.datasheet = new_datasheet

    product.name = name
    product.slug = slugify(name)
    product.category_id = category_id
    product.category_name = cat.name if cat else ""
    product.category_slug = cat.slug if cat else ""
    product.load_class = load_class
    product.standard = standard
    product.description = description
    product.specs = specs
    product.applications = app_list
    product.installation = inst_list
    product.featured = featured == "on"
    db.commit()
    db.refresh(product)
    _sync_product_to_firestore(product)
    return RedirectResponse(url="/admin/products", status_code=303)


@router.post("/products/{prod_id}/delete")
async def delete_product(
    prod_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    product = db.query(Product).filter(Product.id == prod_id).first()
    if product:
        prod_id_str = str(product.id)
        cat_id_ref = product.category_id
        db.delete(product)
        db.commit()
        try:
            _fs().collection("products").document(prod_id_str).delete()
        except Exception as e:
            import logging
            logging.error(f"[Firestore] Failed to delete product {prod_id_str}: {e}")
        # Update product_count on category
        cat = db.query(Category).filter(Category.id == cat_id_ref).first()
        if cat:
            cat.product_count = db.query(Product).filter(Product.category_id == cat.id).count()
            db.commit()
            db.refresh(cat)
            _sync_category_to_firestore(cat)
    return RedirectResponse(url="/admin/products", status_code=303)


@router.post("/products/{prod_id}/remove-image/{index}")
async def remove_product_image(
    prod_id: int,
    index: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    product = db.query(Product).filter(Product.id == prod_id).first()
    if product:
        imgs = list(product.images) if isinstance(product.images, list) else []
        if 0 <= index < len(imgs):
            imgs.pop(index)
        product.images = imgs  # new list object → SQLAlchemy detects change
        product.image = imgs[0] if imgs else ""
        db.commit()
        db.refresh(product)
        _sync_product_to_firestore(product)
    return RedirectResponse(url=f"/admin/products/{prod_id}/edit", status_code=303)


@router.post("/products/{prod_id}/clear-images")
async def clear_product_images(
    prod_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    product = db.query(Product).filter(Product.id == prod_id).first()
    if product:
        product.images = []
        product.image = ""
        db.commit()
        db.refresh(product)
        _sync_product_to_firestore(product)
    return RedirectResponse(url=f"/admin/products/{prod_id}/edit", status_code=303)


@router.post("/products/{prod_id}/remove-datasheet")
async def remove_product_datasheet(
    prod_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    product = db.query(Product).filter(Product.id == prod_id).first()
    if product:
        product.datasheet = ""
        db.commit()
    return RedirectResponse(url=f"/admin/products/{prod_id}/edit", status_code=303)
