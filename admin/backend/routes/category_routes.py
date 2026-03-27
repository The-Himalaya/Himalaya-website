import re
from fastapi import APIRouter, Depends, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import Category, Product

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    return re.sub(r'-+', '-', text)


@router.get("/categories", response_class=HTMLResponse)
async def list_categories(request: Request, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    categories = db.query(Category).order_by(Category.created_at.desc()).all()
    return templates.TemplateResponse("categories/list.html", {
        "request": request,
        "admin": admin,
        "categories": categories,
        "page_title": "Categories",
    })


@router.get("/categories/create", response_class=HTMLResponse)
async def create_category_form(request: Request, admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    return templates.TemplateResponse("categories/form.html", {
        "request": request,
        "admin": admin,
        "category": None,
        "page_title": "Add Category",
    })


@router.post("/categories/create")
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
async def edit_category_form(cat_id: int, request: Request, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    category = db.query(Category).filter(Category.id == cat_id).first()
    if not category:
        return RedirectResponse(url="/admin/categories", status_code=303)

    return templates.TemplateResponse("categories/form.html", {
        "request": request,
        "admin": admin,
        "category": category,
        "page_title": f"Edit: {category.name}",
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
async def delete_category(cat_id: int, db: Session = Depends(get_db), admin=Depends(admin_required)):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    category = db.query(Category).filter(Category.id == cat_id).first()
    if category:
        db.delete(category)
        db.commit()
    return RedirectResponse(url="/admin/categories", status_code=303)
