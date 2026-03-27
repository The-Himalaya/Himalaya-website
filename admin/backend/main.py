import os
import sys

from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

# Ensure backend directory is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import settings
from database import engine
from middleware import AdminIPRestrictionMiddleware
from models import Base
from seed_data import seed

from routes.auth_routes import router as auth_router
from routes.dashboard_routes import router as dashboard_router
from routes.product_routes import router as product_router
from routes.content_routes import router as content_router
from routes.public_api import router as public_api_router

# Create tables and seed data
Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(title="The Himalaya", docs_url="/admin/api/docs")

# --- IP restriction middleware (must be added before routes) ---
app.add_middleware(AdminIPRestrictionMiddleware)

# --- Admin static files ---
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
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

# --- Public JSON API (no auth, no IP restriction) ---
app.include_router(public_api_router, prefix="/api")


@app.get("/admin")
async def admin_root():
    return RedirectResponse(url="/admin/dashboard")


# --- Serve the React frontend (built Vite output) ---
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "dist")

if os.path.exists(DIST_DIR):
    # Mount Vite's static assets (JS, CSS, images with hashed filenames)
    vite_assets = os.path.join(DIST_DIR, "assets-web")
    if os.path.exists(vite_assets):
        app.mount("/assets-web", StaticFiles(directory=vite_assets), name="vite_assets")

    # Catch-all: serve index.html for any non-API, non-admin route (SPA routing)
    @app.get("/{full_path:path}")
    async def serve_frontend(request: Request, full_path: str):
        # Try to serve the exact file from dist/ first (e.g. favicon.ico, robots.txt)
        file_path = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Otherwise serve index.html for SPA client-side routing
        index_path = os.path.join(DIST_DIR, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path)
        return RedirectResponse(url="/admin/login")
else:
    @app.get("/")
    async def root():
        return RedirectResponse(url="/admin/login")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
