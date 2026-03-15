import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'omara_user_id';

/**
 * Manages a persistent User ID in LocalStorage.
 * This allows the application to function without a backend authentication provider,
 * maintaining user identity across page reloads for local-only mode.
 */
export const userIdManager = {
  /**
   * Retrieves the current user ID from local storage.
   * If one does not exist, it generates a new UUID and saves it.
   * @returns {string} The persistent user ID
   */
  getUserId: () => {
    let userId = localStorage.getItem(STORAGE_KEY);
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(STORAGE_KEY, userId);
      console.log(`[UserIdManager] Generated new local User ID: ${userId}`);
    }
    return userId;
  },

  /**
   * Checks if a user ID exists without generating one.
   * @returns {string|null}
   */
  getExistingUserId: () => {
    return localStorage.getItem(STORAGE_KEY);
  },

  /**
   * Resets the user ID (effectively "logging out" or clearing identity in local mode)
   */
  clearUserId: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};