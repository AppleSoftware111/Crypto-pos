import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Secure Storage Utilities
 * Handles secure storage of authentication tokens and session data
 */

const STORAGE_KEYS = {
  COMPANY_TOKEN: '@crypto_pos:company_token',
  COMPANY_DATA: '@crypto_pos:company_data',
  CASHIER_TOKEN: '@crypto_pos:cashier_token',
  CASHIER_DATA: '@crypto_pos:cashier_data',
  SESSION_DATA: '@crypto_pos:session_data',
  SERVER_URL_OVERRIDE: '@crypto_pos:server_url_override',
};

/**
 * Store company authentication data
 */
export const storeCompanyAuth = async (token, companyData) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.COMPANY_TOKEN, token],
      [STORAGE_KEYS.COMPANY_DATA, JSON.stringify(companyData)],
    ]);
    return true;
  } catch (error) {
    console.error('Error storing company auth:', error);
    return false;
  }
};

/**
 * Get company authentication data
 */
export const getCompanyAuth = async () => {
  try {
    const [token, data] = await AsyncStorage.multiGet([
      STORAGE_KEYS.COMPANY_TOKEN,
      STORAGE_KEYS.COMPANY_DATA,
    ]);
    return {
      token: token[1],
      companyData: data[1] ? JSON.parse(data[1]) : null,
    };
  } catch (error) {
    console.error('Error getting company auth:', error);
    return { token: null, companyData: null };
  }
};

/**
 * Store cashier authentication data
 */
export const storeCashierAuth = async (token, cashierData) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.CASHIER_TOKEN, token],
      [STORAGE_KEYS.CASHIER_DATA, JSON.stringify(cashierData)],
    ]);
    return true;
  } catch (error) {
    console.error('Error storing cashier auth:', error);
    return false;
  }
};

/**
 * Get cashier authentication data
 */
export const getCashierAuth = async () => {
  try {
    const [token, data] = await AsyncStorage.multiGet([
      STORAGE_KEYS.CASHIER_TOKEN,
      STORAGE_KEYS.CASHIER_DATA,
    ]);
    return {
      token: token[1],
      cashierData: data[1] ? JSON.parse(data[1]) : null,
    };
  } catch (error) {
    console.error('Error getting cashier auth:', error);
    return { token: null, cashierData: null };
  }
};

/**
 * Store complete session data
 */
export const storeSession = async (sessionData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error('Error storing session:', error);
    return false;
  }
};

/**
 * Get complete session data
 */
export const getSession = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Clear all authentication data (logout)
 */
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.COMPANY_TOKEN,
      STORAGE_KEYS.COMPANY_DATA,
      STORAGE_KEYS.CASHIER_TOKEN,
      STORAGE_KEYS.CASHIER_DATA,
      STORAGE_KEYS.SESSION_DATA,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing auth:', error);
    return false;
  }
};

/**
 * Clear only cashier data (for cashier logout, keep company logged in)
 */
export const clearCashierAuth = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CASHIER_TOKEN,
      STORAGE_KEYS.CASHIER_DATA,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing cashier auth:', error);
    return false;
  }
};

/**
 * Get stored server URL override (for dev: physical device / different host)
 */
export const getServerUrlOverride = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.SERVER_URL_OVERRIDE);
  } catch (error) {
    console.error('Error getting server URL override:', error);
    return null;
  }
};

/**
 * Set server URL override (e.g. http://192.168.1.100:4000 for physical device)
 */
export const setServerUrlOverride = async (url) => {
  try {
    if (url == null || url.trim() === '') {
      await AsyncStorage.removeItem(STORAGE_KEYS.SERVER_URL_OVERRIDE);
      return true;
    }
    const trimmed = url.trim().replace(/\/+$/, '');
    await AsyncStorage.setItem(STORAGE_KEYS.SERVER_URL_OVERRIDE, trimmed);
    return true;
  } catch (error) {
    console.error('Error setting server URL override:', error);
    return false;
  }
};
