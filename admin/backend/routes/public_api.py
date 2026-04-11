"""
Public JSON API endpoints — reads directly from Firestore.
No authentication required. No SQLite / SQLAlchemy dependency.
Render only handles admin writes; Firestore serves all public GET traffic.
"""

import logging
from fastapi import APIRouter

router = APIRouter()


def _fs():
    from firebase_admin import firestore as fb_firestore
    return fb_firestore.client()


def _format_date(val) -> str:
    """Convert a Firestore Timestamp or datetime to YYYY-MM-DD string."""
    if val is None:
        return ""
    if hasattr(val, "strftime"):
        return val.strftime("%Y-%m-%d")
    return str(val)[:10]


# ── Field transformers ──────────────────────────────────

def _clean_category(d: dict) -> dict:
    """Strip timestamps and map snake_case → camelCase for frontend Category type."""
    d.pop("updated_at", None)
    d.pop("created_at", None)
    d["productCount"] = d.pop("product_count", 0)
    return d


def _clean_product(d: dict) -> dict:
    """Strip timestamps and map snake_case → camelCase for frontend Product type."""
    d.pop("updated_at", None)
    d.pop("created_at", None)
    d.pop("category_id", None)
    d["category"] = d.pop("category_name", "")
    d["categorySlug"] = d.pop("category_slug", "")
    d["loadClass"] = d.pop("load_class", "")
    return d


# ── Categories ──────────────────────────────────────────

@router.get("/categories")
def api_categories():
    try:
        docs = _fs().collection("categories").get()
        result = [_clean_category(doc.to_dict()) for doc in docs]
        return sorted(result, key=lambda x: x.get("name", ""))
    except Exception as e:
        logging.warning(f"[api] /categories failed: {e}")
        return []


@router.get("/categories/{slug}")
def api_category_by_slug(slug: str):
    try:
        docs = _fs().collection("categories").where("slug", "==", slug).limit(1).get()
        if not docs:
            return None
        return _clean_category(docs[0].to_dict())
    except Exception as e:
        logging.warning(f"[api] /categories/{slug} failed: {e}")
        return None


@router.get("/categories/{slug}/products")
def api_category_products(slug: str):
    try:
        docs = _fs().collection("products").where("category_slug", "==", slug).get()
        result = [_clean_product(doc.to_dict()) for doc in docs]
        return sorted(result, key=lambda x: x.get("name", ""))
    except Exception as e:
        logging.warning(f"[api] /categories/{slug}/products failed: {e}")
        return []


# ── Products ────────────────────────────────────────────
# NOTE: /products/featured must be defined BEFORE /products/{slug}

@router.get("/products")
def api_products():
    try:
        docs = _fs().collection("products").get()
        result = [_clean_product(doc.to_dict()) for doc in docs]
        return sorted(result, key=lambda x: x.get("name", ""))
    except Exception as e:
        logging.warning(f"[api] /products failed: {e}")
        return []


@router.get("/products/featured")
def api_featured_products():
    try:
        docs = _fs().collection("products").where("featured", "==", True).get()
        result = [_clean_product(doc.to_dict()) for doc in docs]
        return sorted(result, key=lambda x: x.get("name", ""))
    except Exception as e:
        logging.warning(f"[api] /products/featured failed: {e}")
        return []


@router.get("/products/{slug}")
def api_product_by_slug(slug: str):
    try:
        docs = _fs().collection("products").where("slug", "==", slug).limit(1).get()
        if not docs:
            return None
        return _clean_product(docs[0].to_dict())
    except Exception as e:
        logging.warning(f"[api] /products/{slug} failed: {e}")
        return None


# ── Blog ────────────────────────────────────────────────

@router.get("/blog-posts")
def api_blog_posts():
    try:
        docs = _fs().collection("blog_posts").where("published", "==", True).get()
        result = []
        for doc in docs:
            d = doc.to_dict()
            d["date"] = _format_date(d.get("updated_at") or d.get("created_at"))
            # Remove raw timestamp objects so JSON serialisation doesn't fail
            d.pop("updated_at", None)
            d.pop("created_at", None)
            result.append(d)
        # Most-recent first
        return sorted(result, key=lambda x: x.get("date", ""), reverse=True)
    except Exception as e:
        logging.warning(f"[api] /blog-posts failed: {e}")
        return []


@router.get("/blog-posts/{slug}")
def api_blog_post_by_slug(slug: str):
    try:
        docs = (
            _fs().collection("blog_posts")
            .where("slug", "==", slug)
            .where("published", "==", True)
            .limit(1)
            .get()
        )
        if not docs:
            return None
        d = docs[0].to_dict()
        d["date"] = _format_date(d.get("updated_at") or d.get("created_at"))
        d.pop("updated_at", None)
        d.pop("created_at", None)
        return d
    except Exception as e:
        logging.warning(f"[api] /blog-posts/{slug} failed: {e}")
        return None


# ── Jobs ────────────────────────────────────────────────

@router.get("/job-openings")
def api_job_openings():
    try:
        col = _fs().collection("job_details").document("main").collection("openings")
        docs = col.where("is_active", "==", True).get()
        result = []
        for doc in docs:
            d = doc.to_dict()
            # Frontend expects "type" key, Firestore stores "job_type"
            d["type"] = d.get("job_type", "Full-time")
            d.pop("updated_at", None)
            result.append(d)
        return result
    except Exception as e:
        logging.warning(f"[api] /job-openings failed: {e}")
        return []


# ── Projects ───────────────────────────────────────────

@router.get("/projects")
def api_projects():
    try:
        docs = _fs().collection("projects").get()
        result = []
        for doc in docs:
            d = doc.to_dict()
            # Frontend expects "products" key, Firestore stores "products_used"
            d["products"] = d.get("products_used", [])
            d.pop("updated_at", None)
            result.append(d)
        # Most-recent year first
        return sorted(result, key=lambda x: x.get("year", 0), reverse=True)
    except Exception as e:
        logging.warning(f"[api] /projects failed: {e}")
        return []


# ── Testimonials ───────────────────────────────────────

@router.get("/testimonials")
def api_testimonials():
    try:
        docs = _fs().collection("testimonials").where("is_active", "==", True).get()
        result = []
        for doc in docs:
            d = doc.to_dict()
            d.pop("updated_at", None)
            result.append(d)
        return result
    except Exception as e:
        logging.warning(f"[api] /testimonials failed: {e}")
        return []


# ── Site Settings ──────────────────────────────────────

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


@router.get("/site-settings")
def api_site_settings():
    try:
        doc = _fs().collection("site_settings").document("config").get()
        if doc.exists:
            return {**_SETTINGS_DEFAULTS, **doc.to_dict()}
    except Exception:
        pass
    return _SETTINGS_DEFAULTS
