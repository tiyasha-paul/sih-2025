from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
import os
import json

router = APIRouter()

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # Only for local dev

GOOGLE_CLIENT_SECRETS_FILE = "hydrolensBE/client_secret.json"
SCOPES = ["https://www.googleapis.com/auth/userinfo.email", "openid"]
REDIRECT_URI = "http://localhost:8000/auth/callback"

def load_client_config():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if client_id and client_secret:
        # Build client config dict dynamically
        return {
            "web": {
                "client_id": client_id,
                "project_id": "your_project_id_here",
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_secret": client_secret,
                "redirect_uris": [
                    REDIRECT_URI
                ]
            }
        }
    else:
        # Load from file as fallback
        try:
            with open(GOOGLE_CLIENT_SECRETS_FILE, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            # Return a placeholder config if file doesn't exist
            return {
                "web": {
                    "client_id": "placeholder_client_id",
                    "project_id": "placeholder_project_id",
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_secret": "placeholder_client_secret",
                    "redirect_uris": [
                        REDIRECT_URI
                    ]
                }
            }

client_config = load_client_config()

def create_flow():
    return Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=REDIRECT_URI
    )

@router.get("/login")
def login():
    flow = create_flow()
    auth_url, _ = flow.authorization_url(prompt='consent')
    print(f"OAuth URL generated: {auth_url}")  # Add logging to verify the URL
    return RedirectResponse(auth_url)

@router.get("/callback")
def callback(request: Request):
    try:
        flow = create_flow()
        flow.fetch_token(authorization_response=str(request.url))
        credentials = flow.credentials
        id_token = credentials.id_token
        # You can verify the token here if needed
        # TODO: decode id_token and create session or JWT for frontend
        return RedirectResponse(url="https://tiyasha-paul.github.io/sih-2025/chat.html")
    except Exception as e:
        return {"error": "Authentication failed", "details": str(e)}
