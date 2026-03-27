import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "himalaya-admin-super-secret-key-change-in-production-2026"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    DATABASE_URL: str = "sqlite:///./himalaya_admin.db"
    UPLOAD_DIR: str = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "static", "uploads"
    )
    ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "himalaya@2026")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@thehimalaya.com")

    # Comma-separated list of IPs allowed to access /admin routes
    # Set via ALLOWED_ADMIN_IPS env var, e.g. "203.0.113.50,192.168.1.100"
    # Use "*" to allow all IPs (development mode)
    ALLOWED_ADMIN_IPS: str = os.getenv("ALLOWED_ADMIN_IPS", "*")


settings = Settings()
