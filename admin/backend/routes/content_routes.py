import json
import os
import re
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, Request, Form, File, UploadFile
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import (
    BlogPost, JobOpening, ProjectShowcase, Testimonial,
    ContactSubmission, BulkOrderInquiry, SiteSetting,
)

_UPLOAD_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static", "uploads")

_CONTENT_TYPES = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
}


def _upload_to_firebase(content: bytes, path: str, ext: str) -> str | None:
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


async def _save_files(files: Optional[List[UploadFile]], subfolder: str) -> List[str]:
    """Upload files to Firebase Storage and return their public URLs."""
    if not files:
        return []
    paths = []
    for f in files:
        if not f or not f.filename:
            continue
        ext = os.path.splitext(f.filename)[1].lower()
        filename = f"{uuid.uuid4().hex}{ext}"
        content = await f.read()

        url = _upload_to_firebase(content, f"uploads/{subfolder}/{filename}", ext)
        if url:
            paths.append(url)
            continue

        # Fallback: save locally if Firebase Storage is not configured
        target = os.path.join(_UPLOAD_BASE, subfolder)
        os.makedirs(target, exist_ok=True)
        with open(os.path.join(target, filename), "wb") as out:
            out.write(content)
        paths.append(f"/admin/static/uploads/{subfolder}/{filename}")
    return paths

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text


# ---- Blog Posts ----

@router.get("/blog", response_class=HTMLResponse)
async def list_blog(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return templates.TemplateResponse("blog/list.html", {
        "request": request, "admin": admin, "posts": posts,
    })


@router.get("/blog/new", response_class=HTMLResponse)
async def new_blog_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    return templates.TemplateResponse("blog/form.html", {
        "request": request, "admin": admin, "post": None, "editing": False,
    })


def _sync_blog_to_firestore(post: "BlogPost") -> None:
    """Mirror a blog post to Firestore blog_posts/{id}."""
    import logging
    try:
        from firebase_admin import firestore as fb_firestore
        _fs().collection("blog_posts").document(str(post.id)).set({
            "id": str(post.id),
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt or "",
            "content": post.content or "",
            "category": post.category or "",
            "author": post.author or "",
            "image": post.image or "",
            "images": post.images if isinstance(post.images, list) else [],
            "featured": bool(post.featured),
            "published": bool(post.published),
            "updated_at": fb_firestore.SERVER_TIMESTAMP,
        }, merge=True)
        logging.info(f"[Firestore] Synced blog post {post.id} to blog_posts")
    except Exception as e:
        logging.error(f"[Firestore] Failed to sync blog post {post.id}: {e}")


@router.post("/blog/new")
async def create_blog(
    title: str = Form(...),
    excerpt: str = Form(""),
    content: str = Form(""),
    category: str = Form(""),
    author: str = Form(""),
    featured: str = Form("off"),
    published: str = Form("off"),
    new_images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    images = await _save_files(new_images, "blog/images")
    post = BlogPost(
        title=title, slug=slugify(title), excerpt=excerpt, content=content,
        category=category, author=author,
        image=images[0] if images else "",
        images=images, videos=[],
        featured=featured == "on", published=published == "on",
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    _sync_blog_to_firestore(post)
    return RedirectResponse(url="/admin/blog", status_code=303)


@router.get("/blog/{post_id}/edit", response_class=HTMLResponse)
async def edit_blog_form(
    post_id: int, request: Request,
    db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        return RedirectResponse(url="/admin/blog", status_code=303)
    return templates.TemplateResponse("blog/form.html", {
        "request": request, "admin": admin, "post": post, "editing": True,
    })


@router.post("/blog/{post_id}/edit")
async def update_blog(
    post_id: int,
    title: str = Form(...),
    excerpt: str = Form(""),
    content: str = Form(""),
    category: str = Form(""),
    author: str = Form(""),
    featured: str = Form("off"),
    published: str = Form("off"),
    keep_images: Optional[List[str]] = Form(None),
    new_images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        return RedirectResponse(url="/admin/blog", status_code=303)
    saved_images = await _save_files(new_images, "blog/images")
    images = (keep_images or []) + saved_images
    post.title = title
    post.slug = slugify(title)
    post.excerpt = excerpt
    post.content = content
    post.category = category
    post.author = author
    post.images = images
    post.image = images[0] if images else ""
    post.featured = featured == "on"
    post.published = published == "on"
    db.commit()
    db.refresh(post)
    _sync_blog_to_firestore(post)
    return RedirectResponse(url="/admin/blog", status_code=303)


@router.post("/blog/{post_id}/delete")
async def delete_blog(
    post_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        post_id_str = str(post.id)
        db.delete(post)
        db.commit()
        try:
            _fs().collection("blog_posts").document(post_id_str).delete()
        except Exception:
            pass
    return RedirectResponse(url="/admin/blog", status_code=303)


# ---- Job Openings ----

_JOBS_PARENT = ("job_details", "main")


def _openings_col():
    return _fs().collection(_JOBS_PARENT[0]).document(_JOBS_PARENT[1]).collection("openings")


def _applications_col():
    return _fs().collection(_JOBS_PARENT[0]).document(_JOBS_PARENT[1]).collection("applications")


def _sync_job_to_firestore(job: "JobOpening") -> None:
    """Mirror a job opening to Firestore job_details/main/openings/{id}."""
    import logging
    try:
        from firebase_admin import firestore as fb_firestore
        _openings_col().document(str(job.id)).set({
            "id": str(job.id),
            "title": job.title,
            "department": job.department or "",
            "location": job.location or "",
            "job_type": job.job_type or "Full-time",
            "experience": job.experience or "",
            "description": job.description or "",
            "requirements": job.requirements if isinstance(job.requirements, list) else [],
            "is_active": bool(job.is_active),
            "updated_at": fb_firestore.SERVER_TIMESTAMP,
        }, merge=True)
        logging.info(f"[Firestore] Synced job {job.id} to job_details/main/openings")
    except Exception as e:
        logging.error(f"[Firestore] Failed to sync job {job.id}: {e}")


@router.get("/jobs", response_class=HTMLResponse)
async def list_jobs(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    jobs = db.query(JobOpening).order_by(JobOpening.created_at.desc()).all()
    import logging
    try:
        docs = _applications_col().order_by("created_at", direction="DESCENDING").get()
        applications = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            applications.append(data)
    except Exception as e:
        logging.error(f"[Firestore] Failed to fetch applications: {e}")
        applications = []
    return templates.TemplateResponse("jobs/list.html", {
        "request": request, "admin": admin, "jobs": jobs, "applications": applications,
    })


@router.get("/jobs/new", response_class=HTMLResponse)
async def new_job_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    return templates.TemplateResponse("jobs/form.html", {
        "request": request, "admin": admin, "job": None, "editing": False,
    })


@router.post("/jobs/new")
async def create_job(
    title: str = Form(...),
    department: str = Form(""),
    location: str = Form(""),
    job_type: str = Form("Full-time"),
    experience: str = Form(""),
    description: str = Form(""),
    requirements: str = Form(""),
    is_active: str = Form("on"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    req_list = [r.strip() for r in requirements.split("\n") if r.strip()]
    job = JobOpening(
        title=title, department=department, location=location,
        job_type=job_type, experience=experience, description=description,
        requirements=req_list, is_active=is_active == "on",
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    _sync_job_to_firestore(job)
    return RedirectResponse(url="/admin/jobs", status_code=303)


@router.get("/jobs/{job_id}/edit", response_class=HTMLResponse)
async def edit_job_form(
    job_id: int, request: Request,
    db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        return RedirectResponse(url="/admin/jobs", status_code=303)
    return templates.TemplateResponse("jobs/form.html", {
        "request": request, "admin": admin, "job": job, "editing": True,
    })


@router.post("/jobs/{job_id}/edit")
async def update_job(
    job_id: int,
    title: str = Form(...),
    department: str = Form(""),
    location: str = Form(""),
    job_type: str = Form("Full-time"),
    experience: str = Form(""),
    description: str = Form(""),
    requirements: str = Form(""),
    is_active: str = Form("off"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if not job:
        return RedirectResponse(url="/admin/jobs", status_code=303)
    req_list = [r.strip() for r in requirements.split("\n") if r.strip()]
    job.title = title
    job.department = department
    job.location = location
    job.job_type = job_type
    job.experience = experience
    job.description = description
    job.requirements = req_list
    job.is_active = is_active == "on"
    db.commit()
    db.refresh(job)
    _sync_job_to_firestore(job)
    return RedirectResponse(url="/admin/jobs", status_code=303)


@router.post("/jobs/{job_id}/delete")
async def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    job = db.query(JobOpening).filter(JobOpening.id == job_id).first()
    if job:
        db.delete(job)
        db.commit()
        try:
            _openings_col().document(str(job_id)).delete()
        except Exception:
            pass
    return RedirectResponse(url="/admin/jobs", status_code=303)


# ---- Projects ----

@router.get("/projects", response_class=HTMLResponse)
async def list_projects(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    projects = db.query(ProjectShowcase).order_by(ProjectShowcase.year.desc()).all()
    return templates.TemplateResponse("projects/list.html", {
        "request": request, "admin": admin, "projects": projects,
    })


@router.get("/projects/new", response_class=HTMLResponse)
async def new_project_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    return templates.TemplateResponse("projects/form.html", {
        "request": request, "admin": admin, "project": None, "editing": False,
    })


@router.post("/projects/new")
async def create_project(
    name: str = Form(...),
    client: str = Form(""),
    location: str = Form(""),
    year: int = Form(2026),
    products_used: str = Form(""),
    quantity: str = Form(""),
    description: str = Form(""),
    new_images: Optional[List[UploadFile]] = File(None),
    new_videos: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    prod_list = [p.strip() for p in products_used.split(",") if p.strip()]
    images = await _save_files(new_images, "projects/images")
    videos = await _save_files(new_videos, "projects/videos")
    project = ProjectShowcase(
        name=name, client=client, location=location, year=year,
        products_used=prod_list, quantity=quantity, description=description,
        image=images[0] if images else "",
        images=images, videos=videos,
    )
    db.add(project)
    db.commit()
    return RedirectResponse(url="/admin/projects", status_code=303)


@router.get("/projects/{proj_id}/edit", response_class=HTMLResponse)
async def edit_project_form(
    proj_id: int, request: Request,
    db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    project = db.query(ProjectShowcase).filter(ProjectShowcase.id == proj_id).first()
    if not project:
        return RedirectResponse(url="/admin/projects", status_code=303)
    return templates.TemplateResponse("projects/form.html", {
        "request": request, "admin": admin, "project": project, "editing": True,
    })


@router.post("/projects/{proj_id}/edit")
async def update_project(
    proj_id: int,
    name: str = Form(...),
    client: str = Form(""),
    location: str = Form(""),
    year: int = Form(2026),
    products_used: str = Form(""),
    quantity: str = Form(""),
    description: str = Form(""),
    keep_images: Optional[List[str]] = Form(None),
    keep_videos: Optional[List[str]] = Form(None),
    new_images: Optional[List[UploadFile]] = File(None),
    new_videos: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    project = db.query(ProjectShowcase).filter(ProjectShowcase.id == proj_id).first()
    if not project:
        return RedirectResponse(url="/admin/projects", status_code=303)
    prod_list = [p.strip() for p in products_used.split(",") if p.strip()]
    saved_images = await _save_files(new_images, "projects/images")
    saved_videos = await _save_files(new_videos, "projects/videos")
    images = (keep_images or []) + saved_images
    videos = (keep_videos or []) + saved_videos
    project.name = name
    project.client = client
    project.location = location
    project.year = year
    project.products_used = prod_list
    project.quantity = quantity
    project.description = description
    project.images = images
    project.videos = videos
    project.image = images[0] if images else ""
    db.commit()
    return RedirectResponse(url="/admin/projects", status_code=303)


@router.post("/projects/{proj_id}/delete")
async def delete_project(
    proj_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    project = db.query(ProjectShowcase).filter(ProjectShowcase.id == proj_id).first()
    if project:
        db.delete(project)
        db.commit()
    return RedirectResponse(url="/admin/projects", status_code=303)


# ---- Testimonials ----

@router.get("/testimonials", response_class=HTMLResponse)
async def list_testimonials(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    testimonials = db.query(Testimonial).order_by(Testimonial.created_at.desc()).all()
    return templates.TemplateResponse("testimonials/list.html", {
        "request": request, "admin": admin, "testimonials": testimonials,
    })


@router.get("/testimonials/new", response_class=HTMLResponse)
async def new_testimonial_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    return templates.TemplateResponse("testimonials/form.html", {
        "request": request, "admin": admin, "testimonial": None, "editing": False,
    })


@router.post("/testimonials/new")
async def create_testimonial(
    name: str = Form(...),
    position: str = Form(""),
    company: str = Form(""),
    content: str = Form(""),
    rating: int = Form(5),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    testimonial = Testimonial(
        name=name, position=position, company=company,
        content=content, rating=rating,
    )
    db.add(testimonial)
    db.commit()
    return RedirectResponse(url="/admin/testimonials", status_code=303)


@router.get("/testimonials/{test_id}/edit", response_class=HTMLResponse)
async def edit_testimonial_form(
    test_id: int, request: Request,
    db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    testimonial = db.query(Testimonial).filter(Testimonial.id == test_id).first()
    if not testimonial:
        return RedirectResponse(url="/admin/testimonials", status_code=303)
    return templates.TemplateResponse("testimonials/form.html", {
        "request": request, "admin": admin, "testimonial": testimonial, "editing": True,
    })


@router.post("/testimonials/{test_id}/edit")
async def update_testimonial(
    test_id: int,
    name: str = Form(...),
    position: str = Form(""),
    company: str = Form(""),
    content: str = Form(""),
    rating: int = Form(5),
    is_active: str = Form("on"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    testimonial = db.query(Testimonial).filter(Testimonial.id == test_id).first()
    if not testimonial:
        return RedirectResponse(url="/admin/testimonials", status_code=303)
    testimonial.name = name
    testimonial.position = position
    testimonial.company = company
    testimonial.content = content
    testimonial.rating = rating
    testimonial.is_active = is_active == "on"
    db.commit()
    return RedirectResponse(url="/admin/testimonials", status_code=303)


@router.post("/testimonials/{test_id}/delete")
async def delete_testimonial(
    test_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    testimonial = db.query(Testimonial).filter(Testimonial.id == test_id).first()
    if testimonial:
        db.delete(testimonial)
        db.commit()
    return RedirectResponse(url="/admin/testimonials", status_code=303)


# ---- Inquiries (Contact + Bulk Orders) — stored in Firestore ----

def _fs():
    from firebase_admin import firestore as fb_firestore
    return fb_firestore.client()


def _docs_to_list(collection_name: str, order_field: str = "created_at") -> list:
    """Fetch all documents from a Firestore collection as dicts with 'id' set."""
    try:
        docs = _fs().collection(collection_name).order_by(
            order_field, direction="DESCENDING"
        ).get()
        result = []
        for doc in docs:
            data = doc.to_dict()
            data["id"] = doc.id
            result.append(data)
        return result
    except Exception:
        return []


@router.get("/contacts", response_class=HTMLResponse)
async def list_contacts(
    request: Request, admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    contacts = _docs_to_list("contact_submissions")
    return templates.TemplateResponse("inquiries/contacts.html", {
        "request": request, "admin": admin, "contacts": contacts,
    })


@router.post("/contacts/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    status: str = Form("read"),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    _fs().collection("contact_submissions").document(contact_id).update({"status": status})
    return RedirectResponse(url="/admin/contacts", status_code=303)


@router.post("/contacts/{contact_id}/delete")
async def delete_contact(
    contact_id: str,
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    _fs().collection("contact_submissions").document(contact_id).delete()
    return RedirectResponse(url="/admin/contacts", status_code=303)


@router.get("/bulk-orders", response_class=HTMLResponse)
async def list_bulk_orders(
    request: Request, admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    orders = _docs_to_list("bulk_order_inquiries")
    return templates.TemplateResponse("inquiries/bulk_orders.html", {
        "request": request, "admin": admin, "orders": orders,
    })


@router.post("/bulk-orders/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str = Form("contacted"),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    _fs().collection("bulk_order_inquiries").document(order_id).update({"status": status})
    return RedirectResponse(url="/admin/bulk-orders", status_code=303)


@router.post("/bulk-orders/{order_id}/delete")
async def delete_order(
    order_id: str,
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    _fs().collection("bulk_order_inquiries").document(order_id).delete()
    return RedirectResponse(url="/admin/bulk-orders", status_code=303)


# ---- Career Applications ----

@router.post("/jobs/applications/{app_id}/delete")
async def delete_application(
    app_id: str,
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    _applications_col().document(app_id).delete()
    return RedirectResponse(url="/admin/jobs", status_code=303)


# ---- Site Settings ----

_SETTINGS_DOC = ("site_settings", "config")

_SETTINGS_DEFAULTS = {
    "company_name": "The Himalaya",
    "tagline": "Built to Last. Built for India.",
    "phone": "+91 98765 43210",
    "phone2": "",
    "whatsapp": "+919876543210",
    "email": "info@thehimalaya.co.in",
    "address": "Industrial Area, Phase 2",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380001",
    "country": "India",
    "gst": "24AAAAA0000A1Z5",
    "established_year": "2004",
    "linkedin": "https://www.linkedin.com/company/himalaya-composites-precast-pvt-ltd/",
    "facebook": "https://facebook.com",
    "instagram": "https://www.instagram.com/thehimalaya_",
    "map_embed_url": "",
}


def _get_settings() -> dict:
    doc = _fs().collection(_SETTINGS_DOC[0]).document(_SETTINGS_DOC[1]).get()
    data = doc.to_dict() if doc.exists else {}
    # Merge with defaults so every key is always present
    return {**_SETTINGS_DEFAULTS, **data}


@router.get("/settings", response_class=HTMLResponse)
async def site_settings(
    request: Request, admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    settings = _get_settings()
    return templates.TemplateResponse("settings.html", {
        "request": request, "admin": admin, "settings": settings,
    })


@router.post("/settings")
async def update_settings(
    request: Request,
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    form = await request.form()
    data = {k: v for k, v in form.items() if k in _SETTINGS_DEFAULTS}
    try:
        _fs().collection(_SETTINGS_DOC[0]).document(_SETTINGS_DOC[1]).set(data, merge=True)
    except Exception as e:
        settings = {**_SETTINGS_DEFAULTS, **data}
        return templates.TemplateResponse("settings.html", {
            "request": request,
            "admin": admin,
            "settings": settings,
            "error": f"Failed to save settings: {e}",
        })
    return RedirectResponse(url="/admin/settings?saved=1", status_code=303)
