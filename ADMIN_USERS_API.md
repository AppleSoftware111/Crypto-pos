# Admin User Management API

All routes require the same authentication as other admin JSON APIs: **session** (`req.session.adminId`) or **`X-API-Key`** header matching `ADMIN_API_KEY` (see [`middleware/auth.js`](middleware/auth.js)).

Base path: `/api/admin` (mounted before the legacy admin router in [`server.js`](server.js)).

## Endpoints

### `GET /api/admin/users`

Query parameters (all optional):

| Param    | Description                                      |
|----------|--------------------------------------------------|
| `search` | Substring match on email or name (case-insensitive) |
| `role`   | Exact: `user`, `admin`                         |
| `provider` | Substring match on `provider` (e.g. `google`) |
| `status` | Exact: `active`, `inactive`, `suspended`       |
| `limit`  | Default 100, max 500                           |
| `offset` | Pagination offset, default 0                   |

Response:

```json
{
  "users": [ { "id", "email", "name", "role", "provider", "hasGoogleLink", "email_verified", "status", "created_at", "updated_at", "last_login" } ],
  "total": 0,
  "limit": 100,
  "offset": 0
}
```

Password hashes and raw `google_id` are never returned.

### `GET /api/admin/users/:id`

Returns `{ "user": { ... } }` or `404`.

### `POST /api/admin/users`

Create an email/password user.

Body:

```json
{
  "email": "user@example.com",
  "password": "StrongPass1",
  "name": "Optional Name",
  "role": "user",
  "email_verified": false
}
```

Password policy: at least 8 characters, uppercase, lowercase, and a digit.

Response: `201` with `{ "user": { ... } }`.

### `PATCH /api/admin/users/:id`

Partial update. Allowed fields: `name`, `email`, `role`, `status`, `email_verified`, `password` (optional; sets new bcrypt hash).

When `status` changes from `active` to inactive or suspended, all refresh tokens for that user are revoked.

### `DELETE /api/admin/users/:id`

Soft delete: sets `status` to `inactive` and revokes refresh tokens.

Response: `{ "success": true, "user": { ... } }`.

## Manual test checklist

1. Set `ADMIN_API_KEY` on the server and `VITE_POS_ADMIN_API_KEY` on the Omarapay frontend.
2. `GET /api/admin/users` with header `X-API-Key: <key>` returns 200.
3. Create user → appears in list; user can sign in via `/api/auth/login` if active.
4. Deactivate user → `GET /api/auth/login` fails for that account; refresh tokens revoked.
5. Existing `/api/admin/coins` and `/api/admin/payments` still work (same auth).
