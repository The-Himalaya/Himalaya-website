"""
Public JSON API endpoints — no auth required.
Serves data from the database for the React frontend.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import (
    Category, Product, BlogPost, JobOpening,
    ProjectShowcase, Testimonial,
)

router = APIRouter()


def product_to_dict(p: Product) -> dict:
    return {
        "id": str(p.id),
        "name": p.name,
        "slug": p.slug,
        "category": p.category_name,
        "categorySlug": p.category_slug,
        "loadClass": p.load_class or "",
        "standard": p.standard or "",
        "image": p.image or "",
        "images": p.images if isinstance(p.images, list) else [],
        "datasheet": p.datasheet or "",
        "description": p.description or "",
        "specs": p.specs or "",
        "applications": p.applications if isinstance(p.applications, list) else [],
        "installation": p.installation if isinstance(p.installation, list) else [],
        "featured": bool(p.featured),
    }


def category_to_dict(c: Category) -> dict:
    return {
        "id": str(c.id),
        "name": c.name,
        "slug": c.slug,
        "description": c.description or "",
        "productCount": c.product_count or 0,
        "image": c.image or "",
        "advantages": c.advantages if isinstance(c.advantages, list) else [],
    }


# ── Categories ──────────────────────────────────────────

@router.get("/categories")
async def api_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).order_by(Category.id).all()
    return [category_to_dict(c) for c in cats]


@router.get("/categories/{slug}")
async def api_category_by_slug(slug: str, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.slug == slug).first()
    if not cat:
        return None
    return category_to_dict(cat)


@router.get("/categories/{slug}/products")
async def api_category_products(slug: str, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.category_slug == slug).order_by(Product.name).all()
    return [product_to_dict(p) for p in products]


# ── Products ────────────────────────────────────────────

@router.get("/products")
async def api_products(db: Session = Depends(get_db)):
    products = db.query(Product).order_by(Product.name).all()
    return [product_to_dict(p) for p in products]


@router.get("/products/featured")
async def api_featured_products(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.featured == True).order_by(Product.name).all()
    return [product_to_dict(p) for p in products]


@router.get("/products/{slug}")
async def api_product_by_slug(slug: str, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.slug == slug).first()
    if not p:
        return None
    return product_to_dict(p)


# ── Blog ────────────────────────────────────────────────

@router.get("/blog-posts")
async def api_blog_posts(db: Session = Depends(get_db)):
    posts = db.query(BlogPost).filter(BlogPost.published == True).order_by(BlogPost.created_at.desc()).all()
    return [
        {
            "id": str(p.id),
            "title": p.title,
            "slug": p.slug,
            "excerpt": p.excerpt or "",
            "content": p.content or "",
            "category": p.category or "",
            "author": p.author or "",
            "date": p.created_at.strftime("%Y-%m-%d") if p.created_at else "",
            "image": p.image or "",
            "images": p.images if isinstance(p.images, list) else [],
            "featured": bool(p.featured),
        }
        for p in posts
    ]


@router.get("/blog-posts/{slug}")
async def api_blog_post_by_slug(slug: str, db: Session = Depends(get_db)):
    p = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.published == True).first()
    if not p:
        return None
    return {
        "id": str(p.id),
        "title": p.title,
        "slug": p.slug,
        "excerpt": p.excerpt or "",
        "content": p.content or "",
        "category": p.category or "",
        "author": p.author or "",
        "date": p.created_at.strftime("%Y-%m-%d") if p.created_at else "",
        "image": p.image or "",
        "images": p.images if isinstance(p.images, list) else [],
        "featured": bool(p.featured),
    }


# ── Jobs ────────────────────────────────────────────────

@router.get("/job-openings")
async def api_job_openings(db: Session = Depends(get_db)):
    jobs = db.query(JobOpening).filter(JobOpening.is_active == True).order_by(JobOpening.created_at.desc()).all()
    return [
        {
            "id": str(j.id),
            "title": j.title,
            "department": j.department or "",
            "location": j.location or "",
            "type": j.job_type or "Full-time",
            "experience": j.experience or "",
            "description": j.description or "",
            "requirements": j.requirements if isinstance(j.requirements, list) else [],
        }
        for j in jobs
    ]


# ── Projects ───────────────────────────────────────────

@router.get("/projects")
async def api_projects(db: Session = Depends(get_db)):
    projs = db.query(ProjectShowcase).order_by(ProjectShowcase.year.desc()).all()
    return [
        {
            "id": str(p.id),
            "name": p.name,
            "client": p.client or "",
            "location": p.location or "",
            "year": p.year or 0,
            "products": p.products_used if isinstance(p.products_used, list) else [],
            "quantity": p.quantity or "",
            "image": p.image or "",
            "images": p.images if isinstance(p.images, list) else [],
            "videos": p.videos if isinstance(p.videos, list) else [],
            "description": p.description or "",
        }
        for p in projs
    ]


# ── Site Settings ──────────────────────────────────────

@router.get("/site-settings")
async def api_site_settings():
    try:
        from firebase_admin import firestore as fb_firestore
        doc = fb_firestore.client().collection("site_settings").document("config").get()
        if doc.exists:
            return doc.to_dict()
    except Exception:
        pass
    return {
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


# ── Testimonials ───────────────────────────────────────

@router.get("/testimonials")
async def api_testimonials(db: Session = Depends(get_db)):
    items = db.query(Testimonial).filter(Testimonial.is_active == True).order_by(Testimonial.created_at.desc()).all()
    return [
        {
            "name": t.name,
            "position": t.position or "",
            "company": t.company or "",
            "content": t.content or "",
            "rating": t.rating or 5,
        }
        for t in items
    ]
