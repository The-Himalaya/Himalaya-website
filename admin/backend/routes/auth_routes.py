from fastapi import APIRouter, Request, Form
from fastapi.responses import JSONResponse, RedirectResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from firebase_admin import auth as firebase_auth

from auth import SESSION_COOKIE, SESSION_MAX_AGE, create_session_cookie
from config import settings

router = APIRouter()
templates = Jinja2Templates(directory="templates")


@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {
        "request": request,
        "firebase_api_key": settings.FIREBASE_API_KEY,
        "firebase_auth_domain": settings.FIREBASE_AUTH_DOMAIN,
        "firebase_project_id": settings.FIREBASE_PROJECT_ID,
    })


@router.post("/session")
async def create_session(request: Request, id_token: str = Form(...)):
    """
    Called from the login page JS after Firebase signs the user in.
    Exchanges the short-lived ID token for an HTTP-only session cookie.
    """
    allowed = [e.strip().lower() for e in settings.ADMIN_EMAILS.split(",")]

    try:
        decoded = firebase_auth.verify_id_token(id_token, clock_skew_seconds=10)
    except Exception as e:
        import logging
        logging.error("verify_id_token failed: %s", e)
        return JSONResponse({"error": "Invalid token"}, status_code=401)

    if decoded.get("email", "").lower() not in allowed:
        return JSONResponse({"error": "Not authorised"}, status_code=403)

    try:
        session_cookie = create_session_cookie(id_token)
    except Exception as e:
        import logging
        logging.error("create_session_cookie failed: %s", e)
        return JSONResponse({"error": "Could not create session"}, status_code=500)

    response = JSONResponse({"status": "ok"})
    response.set_cookie(
        key=SESSION_COOKIE,
        value=session_cookie,
        httponly=True,
        secure=False,   # set True in production (HTTPS)
        samesite="lax",
        max_age=SESSION_MAX_AGE,
    )
    return response


@router.get("/logout")
async def logout():
    response = RedirectResponse(url="/admin/login", status_code=303)
    response.delete_cookie(SESSION_COOKIE)
    return response
