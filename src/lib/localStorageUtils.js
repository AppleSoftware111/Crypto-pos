/**
 * LocalStorage Utility Functions
 * Provides safe wrappers for localStorage operations with error handling and quota management.
 */

export const STORAGE_KEYS = {
  BUSINESSES: 'omara_businesses',
  SELECTED_BUSINESS: 'omara_selected_business',
  ACCOUNT_TYPE: 'omara_account_type',
  USER_DATA: 'omara_user_data'
};

/**
 * Safely saves data to localStorage
 * @param {string} key 
 * @param {any} data 
 * @returns {boolean} success status
 */
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      console.error('LocalStorage quota exceeded:', error);
      // Attempt to clear old data or notify user could happen here
      return false;
    }
    console.error(`Error saving to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Safely retrieves data from localStorage
 * @param {string} key 
 * @param {any} defaultValue 
 * @returns {any} parsed data or default value
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely removes item from localStorage
 * @param {string} key 
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

/**
 * Checks if localStorage is available and has space
 * @returns {object} status object
 */
export const checkStorageQuota = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return { available: true, error: null };
  } catch (e) {
    return { 
      available: false, 
      error: e.name === 'QuotaExceededError' ? 'Storage Full' : 'Storage Unavailable' 
    };
  }
};

/**
 * Clears data that might be considered expired or temporary
 * (Implementation depends on specific data structures, here generic)
 */
export const clearExpiredData = () => {
  // Placeholder for future cleanup logic
  console.log('Checking for expired local data...');
};