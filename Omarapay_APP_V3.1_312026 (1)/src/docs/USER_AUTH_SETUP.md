# User Auth Setup (Email + Google)

This app now uses backend-driven authentication for user email/password and Google sign-in.

## Frontend Environment

Set in frontend `.env`:

- `VITE_POS_API_BASE_URL=http://localhost:4000`
- `VITE_AUTH_API_BASE_URL=http://localhost:4000` (optional; defaults to POS API base URL)
- `VITE_GOOGLE_OAUTH_CLIENT_ID=<google_web_client_id>`

## Backend Environment

Set in backend `.env`:

- `JWT_ACCESS_SECRET=<strong_random_secret>`
- `JWT_REFRESH_SECRET=<strong_random_secret>`
- `JWT_ACCESS_TTL=15m`
- `JWT_REFRESH_TTL=7d`
- `GOOGLE_OAUTH_CLIENT_ID=<same_google_web_client_id>`

## Flow Summary

- Email login/register: frontend calls `/api/auth/login` and `/api/auth/register`.
- Google login: frontend sends Google `id_token` to `/api/auth/google`.
- Access token is kept in memory by frontend API client.
- Refresh token is stored in HttpOnly cookie (`omara_refresh_token`) and rotated on refresh.
- Session bootstrap on reload uses `/api/auth/me` and `/api/auth/refresh`.
