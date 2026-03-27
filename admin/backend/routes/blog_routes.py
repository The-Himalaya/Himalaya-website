import re
from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import BlogPost

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    return re.sub(r'-+', '-', text)


@router.get("/blog", response_class=HTMLResponse)
async def list_posts(request: Request, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    posts = db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()
    return templates.TemplateResponse("blog/list.html", {
        "request": request, "admin": admin, "posts": posts, "page_title": "Blog Posts",
    })


@router.get("/blog/create", response_class=HTMLResponse)
async def create_post_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    return templates.TemplateResponse("blog/form.html", {
        "request": request, "admin": admin, "post": None, "page_title": "New Blog Post",
    })


@router.post("/blog/create")
async def create_post(
    title: str = Form(...), excerpt: str = Form(""), content: str = Form(""),
    category: str = Form(""), author: str = Form(""), image: str = Form(""),
    featured: bool = Form(False), published: bool = Form(True),
    db: Session = Depends(get_db), admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = BlogPost(
        title=title, slug=slugify(title), excerpt=excerpt, content=content,
        category=category, author=author, image=image, featured=featured, published=published,
    )
    db.add(post)
    db.commit()
    return RedirectResponse(url="/admin/blog", status_code=303)


@router.get("/blog/{post_id}/edit", response_class=HTMLResponse)
async def edit_post_form(post_id: int, request: Request, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        return RedirectResponse(url="/admin/blog", status_code=303)
    return templates.TemplateResponse("blog/form.html", {
        "request": request, "admin": admin, "post": post, "page_title": f"Edit: {post.title}",
    })


@router.post("/blog/{post_id}/edit")
async def update_post(
    post_id: int, title: str = Form(...), excerpt: str = Form(""), content: str = Form(""),
    category: str = Form(""), author: str = Form(""), image: str = Form(""),
    featured: bool = Form(False), published: bool = Form(True),
    db: Session = Depends(get_db), admin=Depends(admin_required),
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
    post.featured = featured
    post.published = published
    db.commit()
    return RedirectResponse(url="/admin/blog", status_code=303)


@router.post("/blog/{post_id}/delete")
async def delete_post(post_id: int, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        db.delete(post)
        db.commit()
    return RedirectResponse(url="/admin/blog", status_code=303)
