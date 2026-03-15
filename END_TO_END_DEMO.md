# End-to-End Demo — Show Client

This guide lets you run and demonstrate the full project: **Crypto POS backend** + **Omarapay** (user dashboard with Accept Payments + admin with POS management).

---

## Prerequisites

- **Node.js** (v14+)
- **npm** installed
- Two terminal windows

---

## 1. Start the Crypto POS backend

**Terminal 1:**

```bash
cd "D:\Work\crypto pos"
npm start
```

- Server runs at **http://localhost:4000**
- Wait for: `Server running on port 4000` (or your `PORT`)

**Optional for admin demo:** In `D:\Work\crypto pos\.env` add:

```env
ADMIN_API_KEY=demo-admin-key
```

(Use the same value in Omarapay `.env` as `VITE_POS_ADMIN_API_KEY` so POS Coins/Payments work in Omarapay admin.)

---

## 2. Start the Omarapay web app

**Terminal 2:**

```bash
cd "D:\Work\crypto pos\Omarapay_APP_V3.1_312026 (1)"
npm run dev
```

- App runs at **http://localhost:3000** (or the port Vite shows)
- Open in browser: **http://localhost:3000**

**Optional for POS and admin:** Create or edit `.env` in the Omarapay folder:

```env
VITE_POS_API_BASE_URL=http://localhost:4000
VITE_POS_ADMIN_API_KEY=demo-admin-key
```

Restart `npm run dev` after changing `.env`.

---

## 3. Demo script (what to show the client)

### A. User flow — Accept Payments (POS)

1. **Open** http://localhost:3000  
2. **Login**  
   - Use **Connect Wallet** (e.g. MetaMask) and sign, **or**  
   - If the app supports email mock login, use that.  
3. **Go to Wallet**  
   - After login you should land on chain selection or wallet.  
   - Select a chain if asked, then go to **Wallet** (or **Overview**).  
4. **Open POS**  
   - Click **Accept Payments (POS)** in the sidebar, or the **Accept Payments (POS)** card on Overview.  
5. **POS login**  
   - **Company password:** `company123`  
   - **Cashier:** select the cashier, **Password:** `cashier123`  
   - (These are the defaults from the Crypto POS backend.)  
6. **Create a payment**  
   - Choose a coin (e.g. BTC, USDT).  
   - Enter amount in USD, click **Create payment request**.  
   - Show the **QR code and address** and that the page polls for confirmation.  
7. **Complete the demo**  
   - Click **Simulate paid (demo)** to mark the payment as confirmed without sending real crypto, then show **Payment received** and **New payment**.

### B. Admin flow — POS management in Omarapay

1. **Login as admin**  
   - Go to **http://localhost:3000/admin/login**  
   - Connect the **admin whitelist wallet** (see Omarapay `adminConfig.js`) or use the app’s admin login if available.  
2. **POS Coins**  
   - In the sidebar open **Crypto POS** → **POS Coins**.  
   - Show the list.  
   - **Add coin:** click **Add coin**, fill form (ID, name, symbol, method code, wallet address, etc.), save.  
   - **Edit / Enable/Disable / Delete** from the table.  
3. **POS Payments**  
   - Open **Crypto POS** → **POS Payments**.  
   - Show the list, use **Status** and **Method** filters, click **Receipt** on a payment to show receipt details.

---

## 4. Default credentials (Crypto POS backend)

| Purpose        | Value          | Where used                          |
|----------------|----------------|-------------------------------------|
| Company login  | `company123`   | POS flow — company password         |
| Cashier login  | `cashier123`   | POS flow — cashier password         |
| Admin (HTML)   | `admin` / `admin123` | Standalone POS admin at http://localhost:4000/admin |

Omarapay admin uses its own auth (wallet whitelist or email); POS Coins/Payments in Omarapay use `VITE_POS_ADMIN_API_KEY` = backend `ADMIN_API_KEY`.

---

## 5. Optional: mobile app (same backend)

- In **crypto-pos-mobile** set `.env`:  
  `EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_IP:4000`  
  (e.g. your LAN IP so the device can reach the backend.)
- Run: `npx expo start -c` and open on device/emulator.
- Use same company/cashier credentials; payments and coins are shared with the web POS.

---

## 6. Troubleshooting

| Issue | Check |
|-------|--------|
| **401 on POS company login** | Use company password `company123` (or whatever is in backend `.env` as `COMPANY_PASSWORD`). If it still fails, **sync credentials to .env**: `POST http://localhost:4000/api/admin/sync-default-credentials` with header `X-API-Key: <ADMIN_API_KEY>` (same value as in backend `.env`). This updates the stored passwords to match `.env` without deleting data. Alternatively, stop the backend, delete `data.json`, then restart to recreate the default company/cashier. |
| Omarapay can’t load payment methods | Backend is running on port 4000; Omarapay `.env` has `VITE_POS_API_BASE_URL=http://localhost:4000`. |
| POS Coins/Payments in admin show “Not configured” | Omarapay `.env` has `VITE_POS_ADMIN_API_KEY` and backend `.env` has the same value in `ADMIN_API_KEY`. Restart both after changing `.env`. |
| CORS errors | Backend: in `.env` set `CORS_ORIGINS=http://localhost:3000` (or leave empty for dev to allow all). Restart backend. |

---

## Quick reference — run order

1. **Terminal 1:** `cd "D:\Work\crypto pos"` → `npm start`  
2. **Terminal 2:** `cd "D:\Work\crypto pos\Omarapay_APP_V3.1_312026 (1)"` → `npm run dev`  
3. Browser: **http://localhost:3000** → Login → Wallet → **Accept Payments (POS)**  
4. Admin: **http://localhost:3000/admin** (with admin wallet/login) → **Crypto POS** → **POS Coins** / **POS Payments**
