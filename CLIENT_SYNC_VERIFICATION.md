# Client sync verification checklist

Use this before recording or sending a build to the client. The goal is to prove that **Admin**, **Merchant Live**, **POS**, and **Wallet** are not showing disconnected or mock-only data.

## Environment

- Confirm the Omarapay web app uses the same API as the POS app:
  - `VITE_POS_API_BASE_URL=<live-or-staging-backend-origin>`
- Confirm Super Admin POS pages can authenticate:
  - `VITE_POS_ADMIN_API_KEY` in the web build matches backend `ADMIN_API_KEY`, or
  - Log in with the Crypto POS admin session before opening POS pages.
- Confirm Android POS points to the same backend URL as the web app.

## Recording script

1. Open **Super Admin → Crypto POS → POS Management**.
   - Show the POS company list.
   - Expand a company and show cashier terminals.
   - Open **Settlements** and explain that POS receive wallets can be different from the main account wallet.

2. Open **Super Admin → Crypto POS → POS Payments**.
   - Show the summary cards and the source label: real backend payments from `/api/admin/payments`.
   - If there are no rows, say: “No live POS payments exist on this backend yet.”

3. Create one POS payment from web POS or Android POS.
   - Keep the generated payment ID visible.
   - If possible, confirm or simulate confirmation.

4. Return to **Super Admin → POS Payments**.
   - Refresh.
   - Confirm the same payment ID appears.

5. Open **Merchant → Transactions** in **Live** mode.
   - Show the source badge:
     - `User-linked POS`
     - `POS token session`
     - or `POS not connected`
   - If connected, confirm the same payment ID appears.

6. Open **Wallet Dashboard**.
   - Explain: wallet ledger and POS sales ledger are connected through the account/business flow, but they are separate datasets.
   - Explain: stablecoin minting is a separate token/contract milestone unless already deployed.

## Client-facing rule

When the client asks “are admin, merchant, user wallet all sync?” answer:

> POS sales use one backend POS payments ledger. Super Admin POS Payments and Merchant Live show that POS ledger when pointed at the same API and connected/authenticated. Wallet activity is a separate wallet ledger; POS settlement wallets can be configured separately from the main account wallet.
