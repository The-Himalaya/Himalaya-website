import json
import re

from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import (
    BlogPost, JobOpening, ProjectShowcase, Testimonial,
    ContactSubmission, BulkOrderInquiry, SiteSetting,
)

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


@router.post("/blog/new")
async def create_blog(
    title: str = Form(...),
    excerpt: str = Form(""),
    content: str = Form(""),
    category: str = Form(""),
    author: str = Form(""),
    image: str = Form(""),
    featured: str = Form("off"),
    published: str = Form("off"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = BlogPost(
        title=title, slug=slugify(title), excerpt=excerpt, content=content,
        category=category, author=author, image=image,
        featured=featured == "on", published=published == "on",
    )
    db.add(post)
    db.commit()
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
    image: str = Form(""),
    featured: str = Form("off"),
    published: str = Form("off"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        return RedirectResponse(url="/admin/blog", status_code=303)
    post.title = title
    post.slug = slugify(title)
    post.excerpt = excerpt
    post.content = content
    post.category = category
    post.author = author
    post.image = image
    post.featured = featured == "on"
    post.published = published == "on"
    db.commit()
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
        db.delete(post)
        db.commit()
    return RedirectResponse(url="/admin/blog", status_code=303)


# ---- Job Openings ----

@router.get("/jobs", response_class=HTMLResponse)
async def list_jobs(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    jobs = db.query(JobOpening).order_by(JobOpening.created_at.desc()).all()
    return templates.TemplateResponse("jobs/list.html", {
        "request": request, "admin": admin, "jobs": jobs,
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
    image: str = Form(""),
    description: str = Form(""),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    prod_list = [p.strip() for p in products_used.split(",") if p.strip()]
    project = ProjectShowcase(
        name=name, client=client, location=location, year=year,
        products_used=prod_list, quantity=quantity, image=image,
        description=description,
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
    image: str = Form(""),
    description: str = Form(""),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    project = db.query(ProjectShowcase).filter(ProjectShowcase.id == proj_id).first()
    if not project:
        return RedirectResponse(url="/admin/projects", status_code=303)
    prod_list = [p.strip() for p in products_used.split(",") if p.strip()]
    project.name = name
    project.client = client
    project.location = location
    project.year = year
    project.products_used = prod_list
    project.quantity = quantity
    project.image = image
    project.description = description
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


# ---- Inquiries (Contact + Bulk Orders) ----

@router.get("/contacts", response_class=HTMLResponse)
async def list_contacts(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    contacts = db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()
    return templates.TemplateResponse("inquiries/contacts.html", {
        "request": request, "admin": admin, "contacts": contacts,
    })


@router.post("/contacts/{contact_id}/status")
async def update_contact_status(
    contact_id: int,
    status: str = Form("read"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    contact = db.query(ContactSubmission).filter(ContactSubmission.id == contact_id).first()
    if contact:
        contact.status = status
        db.commit()
    return RedirectResponse(url="/admin/contacts", status_code=303)


@router.post("/contacts/{contact_id}/delete")
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    contact = db.query(ContactSubmission).filter(ContactSubmission.id == contact_id).first()
    if contact:
        db.delete(contact)
        db.commit()
    return RedirectResponse(url="/admin/contacts", status_code=303)


@router.get("/bulk-orders", response_class=HTMLResponse)
async def list_bulk_orders(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    orders = db.query(BulkOrderInquiry).order_by(BulkOrderInquiry.created_at.desc()).all()
    return templates.TemplateResponse("inquiries/bulk_orders.html", {
        "request": request, "admin": admin, "orders": orders,
    })


@router.post("/bulk-orders/{order_id}/status")
async def update_order_status(
    order_id: int,
    status: str = Form("contacted"),
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    order = db.query(BulkOrderInquiry).filter(BulkOrderInquiry.id == order_id).first()
    if order:
        order.status = status
        db.commit()
    return RedirectResponse(url="/admin/bulk-orders", status_code=303)


@router.post("/bulk-orders/{order_id}/delete")
async def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    order = db.query(BulkOrderInquiry).filter(BulkOrderInquiry.id == order_id).first()
    if order:
        db.delete(order)
        db.commit()
    return RedirectResponse(url="/admin/bulk-orders", status_code=303)


# ---- Site Settings ----

@router.get("/settings", response_class=HTMLResponse)
async def site_settings(
    request: Request, db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    settings_list = db.query(SiteSetting).order_by(SiteSetting.key).all()
    return templates.TemplateResponse("settings.html", {
        "request": request, "admin": admin, "settings": settings_list,
    })


@router.post("/settings")
async def update_settings(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    form = await request.form()
    for key, value in form.items():
        setting = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if setting:
            setting.value = value
        else:
            db.add(SiteSetting(key=key, value=value))
    db.commit()
    return RedirectResponse(url="/admin/settings", status_code=303)
