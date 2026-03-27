import json
import os
import re
import uuid

from fastapi import APIRouter, Depends, Request, Form, UploadFile, File
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
ALLOWED_3D_EXTS = {".glb", ".gltf"}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text


def ensure_upload_dirs():
    """Create upload subdirectories if they don't exist."""
    for sub in ("images", "models"):
        os.makedirs(os.path.join(UPLOAD_DIR, sub), exist_ok=True)


async def save_upload(file: UploadFile, subfolder: str, allowed_exts: set) -> str | None:
    """Save an uploaded file and return its URL path, or None if invalid."""
    if not file or not file.filename:
        return None

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_exts:
        return None

    ensure_upload_dirs()
    unique_name = f"{uuid.uuid4().hex[:12]}{ext}"
    dest = os.path.join(UPLOAD_DIR, subfolder, unique_name)

    content = await file.read()
    with open(dest, "wb") as f:
        f.write(content)

    return f"/admin/static/uploads/{subfolder}/{unique_name}"


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
    image: str = Form(""),
    advantages: str = Form(""),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    adv_list = [a.strip() for a in advantages.split("\n") if a.strip()]
    category = Category(
        name=name,
        slug=slugify(name),
        description=description,
        image=image,
        advantages=adv_list,
    )
    db.add(category)
    db.commit()
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
    image: str = Form(""),
    advantages: str = Form(""),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    category = db.query(Category).filter(Category.id == cat_id).first()
    if not category:
        return RedirectResponse(url="/admin/categories", status_code=303)

    adv_list = [a.strip() for a in advantages.split("\n") if a.strip()]
    category.name = name
    category.slug = slugify(name)
    category.description = description
    category.image = image
    category.advantages = adv_list
    db.commit()
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
        db.delete(category)
        db.commit()
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

    query = db.query(Product)
    if category:
        query = query.filter(Product.category_id == int(category))
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    products = query.order_by(Product.name).all()
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
    specs_json: str = Form("{}"),
    applications: str = Form(""),
    installation: str = Form(""),
    featured: str = Form("off"),
    image_file: UploadFile = File(None),
    model_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    cat = db.query(Category).filter(Category.id == category_id).first()

    try:
        specs = json.loads(specs_json)
    except json.JSONDecodeError:
        specs = {}

    app_list = [a.strip() for a in applications.split("\n") if a.strip()]
    inst_list = [i.strip() for i in installation.split("\n") if i.strip()]

    # Handle file uploads
    image_url = await save_upload(image_file, "images", ALLOWED_IMAGE_EXTS) or ""
    model_url = await save_upload(model_file, "models", ALLOWED_3D_EXTS) or ""

    product = Product(
        name=name,
        slug=slugify(name),
        category_id=category_id,
        category_name=cat.name if cat else "",
        category_slug=cat.slug if cat else "",
        load_class=load_class,
        standard=standard,
        image=image_url,
        model_3d=model_url,
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
    specs_json: str = Form("{}"),
    applications: str = Form(""),
    installation: str = Form(""),
    featured: str = Form("off"),
    image_file: UploadFile = File(None),
    model_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    product = db.query(Product).filter(Product.id == prod_id).first()
    if not product:
        return RedirectResponse(url="/admin/products", status_code=303)

    cat = db.query(Category).filter(Category.id == category_id).first()

    try:
        specs = json.loads(specs_json)
    except json.JSONDecodeError:
        specs = product.specs or {}

    app_list = [a.strip() for a in applications.split("\n") if a.strip()]
    inst_list = [i.strip() for i in installation.split("\n") if i.strip()]

    # Handle file uploads — only overwrite if a new file was provided
    new_image = await save_upload(image_file, "images", ALLOWED_IMAGE_EXTS)
    if new_image:
        product.image = new_image

    new_model = await save_upload(model_file, "models", ALLOWED_3D_EXTS)
    if new_model:
        product.model_3d = new_model

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
        db.delete(product)
        db.commit()
    return RedirectResponse(url="/admin/products", status_code=303)


@router.post("/products/{prod_id}/remove-image")
async def remove_product_image(
    prod_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    product = db.query(Product).filter(Product.id == prod_id).first()
    if product:
        product.image = ""
        db.commit()
    return RedirectResponse(url=f"/admin/products/{prod_id}/edit", status_code=303)


@router.post("/products/{prod_id}/remove-model")
async def remove_product_model(
    prod_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    product = db.query(Product).filter(Product.id == prod_id).first()
    if product:
        product.model_3d = ""
        db.commit()
    return RedirectResponse(url=f"/admin/products/{prod_id}/edit", status_code=303)
