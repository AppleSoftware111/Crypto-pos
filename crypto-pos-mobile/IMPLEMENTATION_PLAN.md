# Implementation Plan – Client Requirements

## Overview

- **Done:** Auth, crypto payment flow, receipt generation, SmartPOS printer integration (code + SDK libs), dashboard config, in-app server URL.
- **To do:** Omarapay go-live, device UAT, production hardening, and (if in scope) Card/QR and EMV.

---

## Phase 1: Unblock and Confirm (Before More Build)

| # | Task | Owner | Outcome |
|---|------|--------|--------|
| 1.1 | **Get Omarapay API package from client** | You | Base URL, auth type, credentials, endpoint list/docs (Postman/Swagger). |
| 1.2 | **Confirm scope for this release** | You | Printer only, or printer + EMV/PIN/NFC? Card and QR Wallet in scope or next phase? |
| 1.3 | **Get test accounts** | You | Company + cashier (and Omarapay test credentials if different). |
| 1.4 | **Confirm UAT approach** | You | Who runs UAT (you vs client), on what device, and sign-off process. |

---

## Phase 2: Omarapay Dashboard Integration

*Depends on: Phase 1.1 (API details).*

| # | Task | Details |
|---|------|--------|
| 2.1 | Update `dashboardConfig.js` | Set `USE_OMARAPAY_API = true`, set `OMARAPAY_API_BASE_URL`, fill `OMARAPAY_AUTH` (apiKey/token, authType). |
| 2.2 | Align endpoint mapping | Map each local endpoint in `API_ENDPOINTS` to Omarapay paths and methods from client docs. |
| 2.3 | Wire auth headers | Ensure `getAuthHeaders()` and `apiClient` use the agreed auth (e.g. API key, Bearer, Basic). |
| 2.4 | Test auth flow | Company login → cashier list → cashier login against Omarapay; fix response shape if needed. |
| 2.5 | Test payment + receipt | Create payment, status poll, receipt data against Omarapay; confirm IDs and field names. |
| 2.6 | Optional env-based config | Move credentials to `.env` (e.g. `OMARAPAY_API_KEY`) and read in `dashboardConfig.js` for production. |

---

## Phase 3: Device and Printer UAT

*Can run in parallel with Phase 2 if backend stays local for UAT.*

| # | Task | Details |
|---|------|--------|
| 3.1 | Resolve device/network | Fix device date (cert validity); use “Set server URL” with PC IP on physical device; ensure backend runs and is reachable. |
| 3.2 | Full flow on device | Company login → Cashier → Payment method → Crypto flow → Payment display → wait/confirm → Success. |
| 3.3 | Receipt print on hardware | Tap Print on Payment display and Success; confirm paper output, layout, and no crash. |
| 3.4 | Error cases | Test once: paper out (if possible), wrong password, server off; confirm messages and no crash. |
| 3.5 | Document + evidence | Short UAT report: steps, pass/fail, screenshots/video; attach printed receipt sample. |

---

## Phase 4: Production Readiness

*After UAT and before client sign-off.*

| # | Task | Details |
|---|------|--------|
| 4.1 | Replace default credentials | New company and cashier passwords; remove or lock test accounts in backend/DB. |
| 4.2 | Lock production API config | Ensure production build uses Omarapay (or agreed backend) and no dev URLs/keys in repo. |
| 4.3 | Security pass | Token storage, HTTPS for Omarapay, no secrets in logs; fix any findings. |
| 4.4 | Build and deliver | Release APK/AAB; hand over with short “Run & config” note (server URL only if still needed). |

---

## Phase 5: Optional / Next Phase (Only If Client Confirms)

| # | Task | When |
|---|------|------|
| 5.1 | **Card payment** | Implement card flow end-to-end (screens + gateway/SmartPOS EMV if in scope). |
| 5.2 | **QR Wallet** | Implement wallet flow (screens + wallet API). |
| 5.3 | **EMV/PIN/NFC** | Use SmartPOS SDK for card read + PIN; integrate with your auth/transaction flow. |
| 5.4 | **Transaction history** | List/detail screens and sync with Omarapay if required. |

---

## Suggested Order of Work

1. **Phase 1** (all items) – get API details, scope, test accounts, UAT plan.
2. **Phase 3.1–3.3** – get one successful run on device (local backend + print).
3. **Phase 2** – implement and test Omarapay integration using Phase 1 deliverables.
4. **Phase 3.4–3.5** – finish UAT and collect evidence.
5. **Phase 4** – production hardening and delivery.
6. **Phase 5** – only for items client explicitly includes in this release.

---

## One-Line Status per Requirement

| Requirement | Plan phase | Status |
|-------------|------------|--------|
| SmartPOS printer | 3.3, 3.5 | Implemented; UAT on device pending. |
| Receipt content & flow | 3.2, 3.3 | Done; verify on device. |
| Two-level auth | 2.4, 4.1 | Done; verify with Omarapay + change defaults. |
| Crypto payment | 3.2, 2.5 | Done; verify locally then with Omarapay. |
| Omarapay dashboard | 2.x | Config ready; implement when 1.1 done. |
| Card/QR Wallet | 5.1, 5.2 | Placeholder; implement if scope confirmed. |
| EMV/PIN/NFC | 5.3 | Not started; only if client confirms. |
