from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import (
    Product, Category, BlogPost, JobOpening, ProjectShowcase,
    ContactSubmission, BulkOrderInquiry, Testimonial,
)

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(
    request: Request,
    db: Session = Depends(get_db),
    admin=Depends(admin_required),
):
    if not admin:
        return RedirectResponse(url="/admin/login", status_code=303)

    stats = {
        "products": db.query(Product).count(),
        "categories": db.query(Category).count(),
        "blog_posts": db.query(BlogPost).count(),
        "jobs": db.query(JobOpening).filter(JobOpening.is_active).count(),
        "projects": db.query(ProjectShowcase).count(),
        "contacts_new": db.query(ContactSubmission).filter(
            ContactSubmission.status == "new"
        ).count(),
        "bulk_orders_new": db.query(BulkOrderInquiry).filter(
            BulkOrderInquiry.status == "new"
        ).count(),
        "testimonials": db.query(Testimonial).count(),
    }

    recent_contacts = (
        db.query(ContactSubmission)
        .order_by(ContactSubmission.created_at.desc())
        .limit(5)
        .all()
    )
    recent_orders = (
        db.query(BulkOrderInquiry)
        .order_by(BulkOrderInquiry.created_at.desc())
        .limit(5)
        .all()
    )

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "admin": admin,
        "stats": stats,
        "recent_contacts": recent_contacts,
        "recent_orders": recent_orders,
    })
