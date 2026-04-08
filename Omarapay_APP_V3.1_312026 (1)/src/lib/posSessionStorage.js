/**
 * Persist POS company/cashier tokens so merchant live mode and refresh keep working.
 * Tokens are also mirrored on window for existing posApi interceptors.
 */
const K_COMPANY_TOKEN = 'omara_pos_company_token';
const K_CASHIER_TOKEN = 'omara_pos_cashier_token';
const K_COMPANY_SNAPSHOT = 'omara_pos_company_snapshot';

function safeParse(json) {
  try {
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function hydratePosTokensFromStorage() {
  if (typeof window === 'undefined') return;
  const ct = localStorage.getItem(K_COMPANY_TOKEN);
  const rt = localStorage.getItem(K_CASHIER_TOKEN);
  if (ct) window.__POS_COMPANY_TOKEN__ = ct;
  if (rt) window.__POS_CASHIER_TOKEN__ = rt;
}

export function persistPosCompanyToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(K_COMPANY_TOKEN, token);
    window.__POS_COMPANY_TOKEN__ = token;
  } else {
    localStorage.removeItem(K_COMPANY_TOKEN);
    window.__POS_COMPANY_TOKEN__ = null;
  }
}

export function persistPosCashierToken(token) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(K_CASHIER_TOKEN, token);
    window.__POS_CASHIER_TOKEN__ = token;
  } else {
    localStorage.removeItem(K_CASHIER_TOKEN);
    window.__POS_CASHIER_TOKEN__ = null;
  }
}

/** Store { id, name } for API calls that need companyId without full POS UI mounted. */
export function persistPosCompanySnapshot(company) {
  if (typeof window === 'undefined') return;
  if (company?.id) {
    localStorage.setItem(K_COMPANY_SNAPSHOT, JSON.stringify({ id: company.id, name: company.name || '' }));
  } else {
    localStorage.removeItem(K_COMPANY_SNAPSHOT);
  }
}

export function getPersistedPosCompanySnapshot() {
  if (typeof window === 'undefined') return null;
  return safeParse(localStorage.getItem(K_COMPANY_SNAPSHOT));
}

export function clearPersistedPosSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(K_COMPANY_TOKEN);
  localStorage.removeItem(K_CASHIER_TOKEN);
  localStorage.removeItem(K_COMPANY_SNAPSHOT);
  window.__POS_COMPANY_TOKEN__ = null;
  window.__POS_CASHIER_TOKEN__ = null;
}

/** True when company or cashier POS token exists (live merchant can call POS APIs). */
export function hasPersistedPosTokens() {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(K_COMPANY_TOKEN) || localStorage.getItem(K_CASHIER_TOKEN));
}
