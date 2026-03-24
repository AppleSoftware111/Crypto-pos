# Omara User Auth API Contract

This contract defines the user-facing auth endpoints implemented under `/api/auth`.

## Auth Model

- Access token: short-lived JWT returned in response body as `accessToken`.
- Refresh token: long-lived JWT stored as HttpOnly cookie `omara_refresh_token`.
- Refresh strategy: refresh token rotation on every successful `/api/auth/refresh`.

## Endpoints

### `POST /api/auth/register`

Request:

```json
{ "email": "user@example.com", "password": "StrongPass1", "name": "User Name" }
```

Success:

```json
{
  "success": true,
  "accessToken": "<jwt>",
  "tokenType": "Bearer",
  "user": {
    "id": "user_xxx",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "provider": "email",
    "emailVerified": false
  }
}
```

### `POST /api/auth/login`

Request:

```json
{ "email": "user@example.com", "password": "StrongPass1" }
```

Success shape matches register response.

### `POST /api/auth/google`

Request:

```json
{ "idToken": "<google_id_token>" }
```

Success shape matches register response (`provider` is `google` or `email_google`).

### `POST /api/auth/refresh`

Request:

- No body required when cookie is present.
- Optional fallback body: `{ "refreshToken": "<jwt>" }`

Success:

```json
{ "success": true, "accessToken": "<jwt>", "tokenType": "Bearer" }
```

### `POST /api/auth/logout`

Request:

- No body required when cookie is present.
- Optional fallback body: `{ "refreshToken": "<jwt>" }`

Success:

```json
{ "success": true }
```

### `GET /api/auth/me`

Headers:

- `Authorization: Bearer <accessToken>`

Success:

```json
{
  "success": true,
  "user": {
    "id": "user_xxx",
    "email": "user@example.com",
    "role": "user",
    "provider": "email",
    "name": "User Name"
  }
}
```

## Error Contract

All auth endpoints return:

```json
{ "error": "Human readable message" }
```

with appropriate HTTP status codes (`400`, `401`, `409`, `429`, `500`).
