# Google OAuth Setup for HydroLens

This document explains how to set up Google OAuth client ID and secret for the HydroLens application.

## Steps to Configure OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

2. Create a new OAuth 2.0 Client ID credential:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`

3. Download the `client_secret.json` file.

4. Place the `client_secret.json` file in the `hydrolensBE/` directory of the project.

5. Alternatively, you can set environment variables instead of using the file:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

6. Restart the backend server to apply changes.

## Frontend

- The Google Sign-In button is available on the homepage navigation bar.
- Clicking the button will redirect to the OAuth login flow.

## Notes

- The OAuth flow is handled by the Python FastAPI backend running on port 8000.
- The main frontend runs on port 3000.
- Make sure to allow insecure transport only for local development (`OAUTHLIB_INSECURE_TRANSPORT=1`).

## Troubleshooting

- If the sign-in button does not appear, ensure you have the `.btn.google` button in `index.html`.
- Check console logs for errors during OAuth flow.
