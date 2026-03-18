# Omarapay & Crypto POS – Project Guide (Client)

## 1. Project overview

- **Omarapay** – Web app (dashboard, wallet, business features) where users and admins access the POS.
- **Crypto POS backend** – API server that handles POS login, payment methods (crypto + card), payment creation, and status. Runs separately and is used by both the Omarapay web app and the mobile app.
- **Integration** – Omarapay talks to the Crypto POS backend so that:
  - **Users** can use “Accept Payments (POS)” (company/cashier login → select method → create payment → QR/address or card flow).
  - **Admins** can manage POS Coins and view POS Payments (and receipts) from the Omarapay admin panel.

Optional components: **crypto-pos-mobile** (React Native app using the same backend), and **Google Maps** (Business Locator / location picker in Omarapay).

---

## 2. Prerequisites

- **Node.js** 14+ (recommend 18+)
- **npm** (or yarn)
- For **Google Maps** features: a Google Maps API key (create/restrict in Google Cloud Console)

---

## 3. Quick start (local run)

### Step 1: Crypto POS backend

```bash
# From project root (where server.js and package.json are)
npm install
cp .env.example .env
# Edit .env if needed (see Section 4)
npm start
```

- Backend runs at **http://localhost:4000** (or the `PORT` in `.env`).
- Admin panel: **http://localhost:4000/admin**

### Step 2: Omarapay web app

```bash
# From Omarapay app folder (e.g. Omarapay_APP_V3.1_312026 (1))
npm install
cp .env.example .env
# Edit .env so it points to the backend (see Section 4)
npm run dev
```

- Omarapay runs at **http://localhost:3000**.

Both must be running for full POS integration (user flow and admin POS Coins/Payments).

---

## 4. Environment configuration

### Crypto POS backend (`.env` in project root)

| Variable | Purpose |
|----------|---------|
| **PORT** | Server port (default **4000**; Omarapay expects this unless overridden). |
| **COMPANY_PASSWORD**, **CASHIER_PASSWORD** | Default POS login (e.g. `company123`, `cashier123`); change in production. |
| **CORS_ORIGINS** | Allowed origins for Omarapay (e.g. `http://localhost:3000`). |
| **ADMIN_API_KEY** | Must match the value used in Omarapay for admin POS (e.g. `demo-admin-key`). |
| **BTC_WALLET_ADDRESS**, **AVALANCHE_WALLET_ADDRESS** | For crypto payment methods. |
| **STRIPE_*** | For card payments (if used). |

### Omarapay web app (`.env` in Omarapay folder)

| Variable | Purpose |
|----------|---------|
| **VITE_POS_API_BASE_URL** | Crypto POS backend URL (e.g. `http://localhost:4000`). |
| **VITE_POS_ADMIN_API_KEY** | Same as backend `ADMIN_API_KEY` (for POS Coins and POS Payments in admin). |
| **VITE_SHOW_POS** | `true` to show “Accept Payments (POS)” in the dashboard/sidebar. |
| **VITE_GOOGLE_MAPS_API_KEY** | Optional; for Business Locator and location picker. Set in Google Cloud Console; do not commit the key. |

---

## 5. User flow (Accept Payments – POS)

1. Open **http://localhost:3000** (or your Omarapay URL).
2. Log in (e.g. wallet connect or demo admin: **admin@omara.com** / **admin123**).
3. Go to **Wallet** (sidebar) or the main dashboard.
4. Click **“Accept Payments (POS)”** (sidebar or dashboard card).
5. **POS login:**
   - Company password: **company123** (or value from backend `COMPANY_PASSWORD`).
   - Cashier password: **cashier123** (or value from backend `CASHIER_PASSWORD`).
6. Select payment method (crypto or card: Visa, Mastercard, UnionPay).
7. Enter amount (USD) and complete the flow:
   - **Crypto:** QR code / payment address and status.
   - **Card:** Card form and processor flow (if configured).

If you see payment methods, can create a payment, and see QR/address (or card flow), the **user ↔ Crypto POS** integration is working.

---

## 6. Admin flow (Crypto POS in Omarapay)

1. Log in as admin (e.g. **admin@omara.com** / **admin123**).
2. In the sidebar, open **Crypto POS**:
   - **POS Coins** – List, add, edit, enable/disable payment methods (crypto).
   - **POS Payments** – List of payments and **Receipt** for each payment.
3. Ensure **VITE_POS_ADMIN_API_KEY** in Omarapay matches backend **ADMIN_API_KEY**; otherwise these pages will show a configuration message.

If POS Coins loads and you can add/edit, and POS Payments shows payments and receipts, the **admin ↔ Crypto POS** integration is working.

---

## 7. Demo / test credentials

| Purpose        | Credential                          | Where used                    |
|----------------|-------------------------------------|-------------------------------|
| Omarapay admin | **admin@omara.com** / **admin123**  | Web app login                 |
| POS company    | **company123**                      | POS company login screen     |
| POS cashier    | **cashier123**                      | POS cashier login screen     |
| Admin API      | **demo-admin-key**                  | Backend `ADMIN_API_KEY` and Omarapay `VITE_POS_ADMIN_API_KEY` |

Change all of these for production.

---

## 8. Integration verification checklist

**User side**

- [ ] Omarapay loads at configured URL (e.g. http://localhost:3000).
- [ ] After login, “Accept Payments (POS)” is visible (Wallet sidebar or dashboard).
- [ ] Clicking it opens the POS flow (company then cashier login).
- [ ] Company/cashier login succeeds with the configured passwords.
- [ ] Payment methods (coins and cards) appear; a payment can be created; for crypto, QR/address and status are shown.

**Admin side**

- [ ] Admin login works.
- [ ] **Crypto POS → POS Coins** loads and allows add/edit.
- [ ] **Crypto POS → POS Payments** loads and shows payments and Receipt.

**Backend**

- [ ] Crypto POS backend is running (e.g. port 4000) and reachable from Omarapay (check `VITE_POS_API_BASE_URL` and CORS).

---

## 9. Optional features

- **Chain selection** – After wallet connect, users may see “Select Your Network” (e.g. Ethereum, BNB, Polygon, etc.). This is part of the Omarapay wallet flow.
- **Google Maps** – Business Locator and location picker need **VITE_GOOGLE_MAPS_API_KEY** set in Omarapay `.env`. Create and restrict the key in Google Cloud Console; do not commit it.
- **Mobile app** – If the client uses **crypto-pos-mobile**, it uses the same Crypto POS backend; configure its base URL to point to the same backend (e.g. `http://localhost:4000` for dev, or the deployed backend URL).

---

## 10. Security and production

- Do **not** commit `.env` files or API keys (e.g. Google Maps, Stripe, Snowtrace).
- **Revoke and rotate** any key that was ever committed or leaked.
- Use strong, unique passwords and **ADMIN_API_KEY** in production.
- Use HTTPS and proper CORS in production.
- Restrict Google Maps API key by referrer and APIs used.

---

## 11. Support and troubleshooting

| Issue | What to check |
|-------|----------------|
| “Accept Payments (POS)” not visible | Set `VITE_SHOW_POS=true` in Omarapay `.env`. |
| POS login fails | Backend running; `COMPANY_PASSWORD` / `CASHIER_PASSWORD` match what you enter. |
| Admin POS Coins/Payments not loading | `VITE_POS_ADMIN_API_KEY` (Omarapay) equals `ADMIN_API_KEY` (backend); backend reachable. |
| Maps not loading | Set `VITE_GOOGLE_MAPS_API_KEY` in Omarapay `.env`; key valid and restricted. |

For deployment, use a process manager (e.g. PM2), reverse proxy (e.g. Nginx), and replace in-memory storage with a database as described in the main Crypto POS README.
