"""
Firebase Admin SDK initialisation — called once at startup.

Credentials are loaded from the environment (in order of preference):
  1. FIREBASE_SERVICE_ACCOUNT_PATH  →  path to serviceAccountKey.json  (recommended)
  2. FIREBASE_SERVICE_ACCOUNT_JSON  →  JSON string of the key file
"""

import json
import os

import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

# Ensure .env is loaded before reading env vars
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def init_firebase() -> None:
    if firebase_admin._apps:
        return  # already initialised

    # 1. Try file path first (avoids newline/escaping issues with JSON strings)
    sa_path = os.environ.get(
        "FIREBASE_SERVICE_ACCOUNT_PATH",
        os.path.join(os.path.dirname(__file__), "serviceAccountKey.json"),
    )
    if os.path.exists(sa_path):
        cred = credentials.Certificate(sa_path)
        firebase_admin.initialize_app(cred)
        return

    # 2. Fall back to inline JSON string
    sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
    if sa_json:
        try:
            cred = credentials.Certificate(json.loads(sa_json))
            firebase_admin.initialize_app(cred)
            return
        except json.JSONDecodeError as e:
            raise RuntimeError(
                f"FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: {e}\n"
                "Tip: use FIREBASE_SERVICE_ACCOUNT_PATH pointing to the downloaded .json file instead."
            )

    raise RuntimeError(
        "Firebase credentials not found.\n"
        "Add FIREBASE_SERVICE_ACCOUNT_PATH=serviceAccountKey.json to admin/backend/.env "
        "and place the downloaded service account JSON file at that path."
    )
