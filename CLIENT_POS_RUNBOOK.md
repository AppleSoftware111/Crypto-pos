# Client runbook: Android POS app and API alignment

Use this with **Crypto POS** (`server.js`) and the **Omarapay** web app (`Omarapay_APP_V3.1_312026 (1)/`) or **crypto-pos-mobile** (Expo).

## One API URL for everyone

- **Vercel (web):** `VITE_POS_API_BASE_URL` = API origin only, e.g. `https://your-tunnel.ngrok-free.dev` (no trailing path).
- **Android / EAS build:** `EXPO_PUBLIC_API_BASE_URL` must be the **same** origin as above.
- If the tunnel URL changes, update **both** and rebuild the web app; update the mobile env and rebuild the app (or set Server URL in-app — see below).

## Android: emulator vs physical device

| Environment | Default loopback | Notes |
|-------------|------------------|--------|
| **Android Emulator** | `http://10.0.2.2:4000` | Reaches host machine `localhost:4000`. |
| **Physical Android device** | Not `10.0.2.2` | Use your PC’s LAN IP (`http://192.168.x.x:4000`) or **HTTPS** tunnel (ngrok). Same Wi‑Fi as the dev machine if using LAN. |

Physical devices cannot reach `10.0.2.2`; that address is emulator-only.

**Emulators (e.g. LD Player, Android Studio AVD)** use **x86_64** (or x86) Android, not ARM. The app must include those native libraries or the process can exit immediately after launch. This repo’s `crypto-pos-mobile/android/gradle.properties` sets `reactNativeArchitectures=arm64-v8a,x86_64` so one APK works on **phones and PC emulators**. Rebuild the APK after changing ABIs.

## Setting the API URL on mobile

1. **Build-time (recommended for staging/production):** Set `EXPO_PUBLIC_API_BASE_URL` in EAS secrets or `.env` before `eas build`. See `crypto-pos-mobile/.env.example`.
2. **Runtime:** On the company login screen, open **Server URL** (or equivalent), enter the full API origin (`https://...` or `http://...:port`), save, then log in again.

Prefer **HTTPS** (ngrok or a real host) for tests that mirror production.

## POS terminals vs “machines”

In this product, a **POS terminal** in the cashier flow is a **cashier** record tied to the company. The default database seeds **one** company and **one** cashier until you add more (admin API or ops process). Expecting multiple terminals requires multiple cashier records.

## Merchant dashboard “live” data

The **Omarapay merchant** login and **POS** login are separate systems today:

- **Wallet / merchant account** — session for business profile and wallet features (Omarapay auth).
- **POS (Crypto POS)** — company + cashier tokens issued by `POST /api/pos/company/login` and `POST /api/pos/cashier/login`.

Live merchant analytics call the same **`VITE_POS_API_BASE_URL`** as the mobile app. To see **live** transactions you need at least one of:

1. **Cashier / POS screen** — complete company (and usually cashier) login in the web app; tokens persist in the browser (`posSessionStorage`).
2. **Connect POS** — enter the **company password** once in the merchant area; stores a company token for read-only transaction lists.
3. **Account link (JWT)** — while signed in to Omarapay, use Connect POS or `POST /api/user/pos/link` with the company password; then `GET /api/user/pos/transactions` can load data with the Omarapay **Bearer** token only (no POS tokens in storage required for that path).

If live mode shows empty data or a banner, the product is usually not “broken”—the dashboard is waiting for POS auth or a link, not only a prior wallet login.

**Env:** `VITE_POS_DEFAULT_COMPANY_ID` (e.g. `company_1`) is for UI hints in single-company UAT; the real identifier comes from POS after login.

Tokens are persisted for the same site origin so refresh does not drop a POS session (see `posSessionStorage` in the Omarapay app).

## Add cashier terminals (API)

The default database seeds one cashier. To register more terminals, call the admin API after logging into `POST /api/admin/login` (session cookie):

`POST /api/admin/pos/cashiers` with JSON body `{ "companyId": "company_1", "name": "Front desk", "password": "your-secure-password" }`.

## Troubleshooting

- **Login fails / “not connected”:** Wrong API URL, tunnel down, or phone on a different network than the API host (for LAN).
- **401 on POS endpoints:** Complete company + cashier login, or ensure company token is valid for read-only endpoints where supported.
- **CORS:** Backend `CORS_ORIGINS` must include your Vercel origin exactly.

For full deployment steps, see [DEPLOYMENT.md](./DEPLOYMENT.md).
