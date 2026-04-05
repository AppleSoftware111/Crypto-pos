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
