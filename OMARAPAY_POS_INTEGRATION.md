# Omarapay + Crypto POS Integration

This document describes how the Crypto POS is integrated into the Omarapay platform.

## Overview

- **Crypto POS backend** (this repo: `server.js`, `routes/pos.js`, `routes/admin.js`): Handles company/cashier auth, coins, payment creation, status, and admin (coins, payments).
- **Omarapay web app** (Omarapay_APP_V3.1): User dashboard includes **Accept Payments (POS)** at `/wallet/pos`. Admin includes **Crypto POS** section (POS Coins, POS Payments) under `/admin/pos-coins` and `/admin/pos-payments`.
- **Crypto POS mobile app** (crypto-pos-mobile): Can point to the same backend via `EXPO_PUBLIC_API_BASE_URL` so that web and mobile share the same data.

## Architecture

```
[User] → Omarapay (omarapay.com) → Login → Wallet Dashboard
              → "Accept Payments (POS)" → /wallet/pos
                    → POSFlow (company/cashier login → methods → amount → display → success)
                    → API calls to Crypto POS backend

[Admin] → Omarapay Admin → Crypto POS → POS Coins / POS Payments
                    → API calls to Crypto POS backend (X-API-Key)

[Mobile] → Crypto POS app → same Crypto POS backend (optional)
```

## Setup

### 1. Crypto POS backend

- Run: `npm start` (port 4000).
- Set in `.env`:
  - `CORS_ORIGINS`: Comma-separated allowed origins, e.g. `https://app.omarapay.com,http://localhost:3000`.
  - `ADMIN_API_KEY`: Optional; same value as Omarapay’s `VITE_POS_ADMIN_API_KEY` so admin pages can call `/api/admin/*`.

### 2. Omarapay web app

- Set in `.env` (or build env):
  - `VITE_POS_API_BASE_URL`: Crypto POS backend URL (e.g. `http://localhost:4000` or `https://pos-api.omarapay.com`).
  - `VITE_POS_ADMIN_API_KEY`: Same as backend `ADMIN_API_KEY` if you use POS Coins/Payments in admin.
- Run: `npm run dev` (e.g. port 3000).
- User: Login → Wallet → **Accept Payments (POS)** or sidebar **Accept Payments (POS)**.
- Admin: Login → **Crypto POS** → **POS Coins** / **POS Payments**.

### 3. Mobile app

- Set `EXPO_PUBLIC_API_BASE_URL` to the same Crypto POS backend URL so web and mobile share coins and payments.

## Security

- Backend: Use HTTPS in production; set `CORS_ORIGINS` to real origins (no `*` in production).
- Admin API key: Only for server-to-server or trusted builds; do not expose in public frontend if possible. For production, prefer a backend proxy that adds the key.
- Rate limiting is enabled on `/api/*` (see `server.js`).

## Files reference

| Purpose | Location |
|--------|----------|
| POS backend CORS, rate limit, security | `server.js`, `middleware/auth.js` |
| Omarapay POS config | Omarapay `src/config/posConfig.js` |
| Omarapay POS API client | Omarapay `src/lib/posApi.js` |
| Omarapay POS flow UI | Omarapay `src/components/pos/POSFlow.jsx` |
| Omarapay POS page | Omarapay `src/pages/wallet/POSFlowPage.jsx` |
| Omarapay admin POS API | Omarapay `src/lib/posAdminApi.js` |
| Omarapay admin POS pages | Omarapay `src/pages/admin/AdminPOSCoinsPage.jsx`, `AdminPOSPaymentsPage.jsx` |
| Mobile config note | `crypto-pos-mobile/src/utils/dashboardConfig.js` |
