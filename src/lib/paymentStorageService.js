const KEYS = {
  PAYOUT: 'omara_payout_details',
  BANK: 'omara_bank_details',
  EWALLET: 'omara_ewallets',
  QRPH: 'omara_qrph'
};

const get = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Error reading ${key}`, e);
    return [];
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Error saving ${key}`, e);
    return false;
  }
};

export const paymentStorage = {
  // Payout Details
  getPayoutDetails: () => get(KEYS.PAYOUT),
  savePayoutDetails: (details) => save(KEYS.PAYOUT, details),
  
  // Bank Details
  getBankDetails: () => get(KEYS.BANK),
  saveBankDetails: (details) => save(KEYS.BANK, details),
  
  // E-Wallets
  getEWallets: () => get(KEYS.EWALLET),
  saveEWallets: (wallets) => save(KEYS.EWALLET, wallets),
  
  // QR Ph
  getQRPhCodes: () => get(KEYS.QRPH),
  saveQRPhCodes: (codes) => save(KEYS.QRPH, codes),
};