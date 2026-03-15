export const validateWalletAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const validateBankAccount = (number, bankCode) => {
  // Simplified validation - in production use rigorous checks per bank format
  if (!number) return false;
  const cleanNumber = number.replace(/[-\s]/g, '');
  return cleanNumber.length >= 8 && cleanNumber.length <= 20 && /^\d+$/.test(cleanNumber);
};

export const validateEWallet = (identifier) => {
  // Basic phone number or email check depending on wallet type
  if (!identifier) return false;
  // Assuming phone numbers for most PH wallets
  const phoneRegex = /^(09|\+639)\d{9}$/;
  return phoneRegex.test(identifier);
};

export const validateQRPhData = (data) => {
  return data && data.name && data.id && data.merchantName;
};