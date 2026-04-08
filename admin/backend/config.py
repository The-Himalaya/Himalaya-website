import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./himalaya_admin.db"
    UPLOAD_DIR: str = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "static", "uploads"
    )

    # Comma-separated list of admin e-mails allowed to access the panel
    ADMIN_EMAILS: str = os.getenv("ADMIN_EMAILS", "admin@thehimalaya.com")

    # Comma-separated list of IPs allowed to access /admin routes
    # Use "*" to allow all IPs (development mode)
    ALLOWED_ADMIN_IPS: str = os.getenv("ALLOWED_ADMIN_IPS", "*")

    # Firebase web app config (used in login.html)
    FIREBASE_API_KEY: str = os.getenv("FIREBASE_API_KEY", "")
    FIREBASE_AUTH_DOMAIN: str = os.getenv("FIREBASE_AUTH_DOMAIN", "")
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")


settings = Settings()
