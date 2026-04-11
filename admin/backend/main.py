import os
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

# Ensure backend directory is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import settings
from database import engine
from firebase_init import init_firebase
from middleware import AdminIPRestrictionMiddleware
from models import Base
from seed_data import seed

# Initialise Firebase Admin SDK before anything else
init_firebase()

from routes.auth_routes import router as auth_router
from routes.dashboard_routes import router as dashboard_router
from routes.product_routes import router as product_router
from routes.content_routes import router as content_router
from routes.certificate_routes import router as certificate_router
from routes.public_api import router as public_api_router

# Create tables and run migrations for new columns
Base.metadata.create_all(bind=engine)

def _run_migrations():
    from sqlalchemy import text
    new_cols = [
        ("blog_posts",  "images",    "TEXT DEFAULT '[]'"),
        ("blog_posts",  "videos",    "TEXT DEFAULT '[]'"),
        ("projects",    "images",    "TEXT DEFAULT '[]'"),
        ("projects",    "videos",    "TEXT DEFAULT '[]'"),
        ("products",    "datasheet", "VARCHAR(500) DEFAULT ''"),
        ("products",    "images",    "TEXT DEFAULT '[]'"),
    ]
    with engine.connect() as conn:
        for table, col, typedef in new_cols:
            try:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col} {typedef}"))
                conn.commit()
            except Exception:
                pass  # column already exists

_run_migrations()

# Attempt to seed database, but don't fail if it errors
try:
    seed()
except Exception as e:
    import logging
    logging.warning(f"[Warning] Database seeding failed: {e}")
    # Continue anyway — the app can still work with an empty database

app = FastAPI(title="The Himalaya", docs_url="/admin/api/docs")

# --- CORS (allow Next.js dev server and production domain) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.environ.get("FRONTEND_URL", ""),
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# --- IP restriction middleware (must be added before routes) ---
app.add_middleware(AdminIPRestrictionMiddleware)

# --- Admin static files ---
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/admin/static", StaticFiles(directory=static_dir), name="admin_static")

# Mount the main website's assets for favicon/logo
assets_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# --- Admin routers (IP-restricted via middleware) ---
app.include_router(auth_router, prefix="/admin")
app.include_router(dashboard_router, prefix="/admin")
app.include_router(product_router, prefix="/admin")
app.include_router(content_router, prefix="/admin")
app.include_router(certificate_router, prefix="/admin")

# --- Public JSON API (no auth, no IP restriction) ---
app.include_router(public_api_router, prefix="/api")


@app.get("/admin")
async def admin_root():
    return RedirectResponse(url="/admin/dashboard")


@app.get("/")
async def root():
    return RedirectResponse(url="/admin/login")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
