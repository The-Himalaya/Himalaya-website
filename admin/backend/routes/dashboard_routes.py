import logging
from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from database import get_db
from auth import admin_required
from models import Product, Category, BlogPost, JobOpening, ProjectShowcase, Testimonial, Certificate

router = APIRouter()
templates = Jinja2Templates(directory="templates")


def _fs():
    from firebase_admin import firestore as fb_firestore
    return fb_firestore.client()


def _fmt(ts) -> str:
    """Format a Firestore Timestamp or datetime to a readable string."""
    if ts is None:
        return ""
    if hasattr(ts, "strftime"):
        return ts.strftime("%b %d, %Y %H:%M")
    return str(ts)[:16]


def _fetch_firestore_collection(collection: str, limit: int = 5, status_filter: str = None):
    """Fetch recent docs from a Firestore collection, optionally filtered by status."""
    try:
        ref = _fs().collection(collection)
        if status_filter:
            ref = ref.where("status", "==", status_filter)
        docs = ref.order_by("created_at", direction="DESCENDING").limit(limit).get()
        result = []
        for doc in docs:
            d = doc.to_dict()
            d["id"] = doc.id
            d["created_at_fmt"] = _fmt(d.get("created_at"))
            result.append(d)
        return result
    except Exception as e:
        logging.warning(f"[Dashboard] Failed to fetch {collection}: {e}")
        return []


def _count_firestore(collection: str, status_filter: str = None) -> int:
    """Count docs in a Firestore collection, optionally filtered by status."""
    try:
        ref = _fs().collection(collection)
        if status_filter:
            ref = ref.where("status", "==", status_filter)
        docs = ref.get()
        return len(docs)
    except Exception as e:
        logging.warning(f"[Dashboard] Failed to count {collection}: {e}")
        return 0


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
        "testimonials": db.query(Testimonial).count(),
        "certificates": db.query(Certificate).filter(Certificate.is_active).count(),
        "contacts_new": _count_firestore("contact_submissions", status_filter="new"),
        "bulk_orders_new": _count_firestore("bulk_order_inquiries", status_filter="new"),
    }

    recent_contacts = _fetch_firestore_collection("contact_submissions", limit=5)
    recent_orders = _fetch_firestore_collection("bulk_order_inquiries", limit=5)

    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "admin": admin,
        "stats": stats,
        "recent_contacts": recent_contacts,
        "recent_orders": recent_orders,
    })
