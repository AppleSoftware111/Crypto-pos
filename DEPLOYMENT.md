# Deployment: canonical apps in this repository

This repo contains **two deployable surfaces**. Use this as the single source of truth for what to build and ship.

## 1. Omara dashboard (primary SPA)

- **Path:** [`Omarapay_APP_V3.1_312026 (1)/`](./Omarapay_APP_V3.1_312026%20(1)/)
- **Stack:** Vite + React (`package.json` name: `omara-payments`)
- **Commands:** `cd "Omarapay_APP_V3.1_312026 (1)" && npm install && npm run build`
- **Output:** `Omarapay_APP_V3.1_312026 (1)/dist/`
- **Role:** Super Admin (`/admin/*`), user wallet, merchant portal (`/merchant/*`), POS/cashier flows integrated in this app.

Do **not** treat the duplicate [`src/`](./src/) tree at the repository root as the shipping frontend unless you have explicitly migrated features into it; it can drift from the Vite app. The **canonical customer-facing web app** for this project is the Omarapay V3.1 folder above.

## 2. Crypto POS API (Node backend)

- **Path:** repository root — [`server.js`](./server.js), [`database.js`](./database.js), [`routes/`](./routes/)
- **Stack:** Express (`package.json` name: `crypto-pos`)
- **Commands:** `npm install && npm start` (default port from `.env`, often `4000`)
- **Role:** POS REST API, company/cashier auth, admin session endpoints consumed by the Vite app via `VITE_POS_API_BASE_URL`.

Point the SPA at the API with `VITE_POS_API_BASE_URL` in the Omarapay app’s `.env` (see [`ADMIN_SETUP.md`](./ADMIN_SETUP.md) for Super Admin env vars).

## Production: Vercel frontend + tunneled or hosted API

Typical setup: Omara SPA on **Vercel** (`https://your-app.vercel.app`) and the Express **Crypto POS API** on a public URL (e.g. **ngrok** `https://xxxx.ngrok-free.dev` or a VPS).

1. **Vercel (Omarapay build)** — In project **Environment Variables**, set `VITE_POS_API_BASE_URL` to the **API origin only** (no `/api` path), e.g. `https://xxxx.ngrok-free.dev`. Redeploy after any change; Vite bakes `VITE_*` in at build time.
2. **Backend `.env`** — Set `CORS_ORIGINS` to a comma-separated list that includes your exact frontend origin, e.g. `https://omara-frontend.vercel.app` (see [`.env.example`](./.env.example)). Free ngrok URLs change when the tunnel restarts — update both CORS (if you lock origins) and Vercel’s `VITE_POS_API_BASE_URL`, then rebuild the SPA.
3. **Behind ngrok** — Set `TRUST_PROXY=1` (or the correct hop count) so rate limiting and `req.ip` work with `X-Forwarded-For` (see comments in [`.env.example`](./.env.example)).
4. **Cross-site admin cookies** — If you use Crypto POS admin login from the SPA on another origin, follow the `SESSION_CROSS_SITE` / `AUTH_COOKIE_CROSS_SITE` notes in [`.env.example`](./.env.example).

5. **Wagmi / RPC (browser CORS)** — The Omara app sets explicit JSON-RPC URLs in [`wagmi.js`](./Omarapay_APP_V3.1_312026%20(1)/src/wagmi.js) so the SPA does not rely on viem defaults that may point at hosts blocking `https://omara-frontend.vercel.app`. Optional per-chain overrides: `VITE_RPC_MAINNET`, `VITE_RPC_POLYGON`, etc. (see Omarapay [`.env.example`](./Omarapay_APP_V3.1_312026%20(1)/.env.example)).
