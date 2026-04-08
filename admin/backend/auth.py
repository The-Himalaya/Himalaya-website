"""
Authentication helpers using Firebase Admin SDK.
Session cookies (not JWTs) are used so sessions can be revoked server-side.
"""

from fastapi import Depends, HTTPException, Request, status
from firebase_admin import auth as firebase_auth

from config import settings


# ---------------------------------------------------------------------------
# Session cookie helpers
# ---------------------------------------------------------------------------

SESSION_COOKIE = "fb_session"
SESSION_MAX_AGE = 60 * 60 * 24 * 5  # 5 days in seconds


def create_session_cookie(id_token: str) -> str:
    """Exchange a short-lived Firebase ID token for a 5-day session cookie."""
    from datetime import timedelta
    return firebase_auth.create_session_cookie(
        id_token,
        expires_in=timedelta(seconds=SESSION_MAX_AGE),
    )


def verify_session_cookie(session_cookie: str) -> dict:
    """
    Verify a Firebase session cookie and return the decoded claims.
    Raises firebase_admin.auth.InvalidSessionCookieError on failure.
    """
    return firebase_auth.verify_session_cookie(session_cookie, check_revoked=True, clock_skew_seconds=10)


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------

def get_current_admin(request: Request) -> dict:
    """
    FastAPI dependency. Returns the decoded Firebase token claims if the
    session cookie is valid and belongs to an authorised admin e-mail.
    Redirects to /admin/login otherwise.
    """
    cookie = request.cookies.get(SESSION_COOKIE)
    if not cookie:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            headers={"Location": "/admin/login"},
        )

    try:
        claims = verify_session_cookie(cookie)
    except Exception as e:
        import logging
        logging.error("verify_session_cookie failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            headers={"Location": "/admin/login"},
        )

    # Only allow the configured admin e-mail(s)
    allowed = [e.strip().lower() for e in settings.ADMIN_EMAILS.split(",")]
    if claims.get("email", "").lower() not in allowed:
        raise HTTPException(
            status_code=status.HTTP_303_SEE_OTHER,
            headers={"Location": "/admin/login"},
        )

    return claims


# Alias used across all admin route files
admin_required = get_current_admin
