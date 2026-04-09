from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from config import settings


class AdminIPRestrictionMiddleware(BaseHTTPMiddleware):
    """Restricts /admin/* routes to specific IP addresses."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Static uploads (product/category images) are public — never IP-restrict them
        if request.url.path.startswith("/admin") and not request.url.path.startswith("/admin/static"):
            allowed = settings.ALLOWED_ADMIN_IPS.strip()

            # "*" means allow all (dev mode)
            if allowed != "*":
                allowed_ips = {ip.strip() for ip in allowed.split(",") if ip.strip()}

                # Get real client IP (supports reverse proxy X-Forwarded-For)
                client_ip = request.headers.get("X-Forwarded-For", "").split(",")[0].strip()
                if not client_ip:
                    client_ip = request.client.host if request.client else ""

                if client_ip not in allowed_ips:
                    return Response("403 Forbidden", status_code=403)

        return await call_next(request)
