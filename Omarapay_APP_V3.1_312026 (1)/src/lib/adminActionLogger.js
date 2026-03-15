const STORAGE_KEY = 'omara_admin_logs';

/**
 * Logs sensitive admin actions to secure local storage
 * @param {string} walletAddress - The admin wallet address
 * @param {string} actionType - The type of action performed
 * @param {object} details - Additional context details
 */
export const logAdminAction = (walletAddress, actionType, details = {}) => {
  if (!walletAddress) return;

  // SENSITIVE: Do not log full wallet address to console in production
  const maskedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  
  const newLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    admin: maskedAddress, // Store masked or hash in real prod, keeping simple here for MVP
    action: actionType,
    details: details
  };

  try {
    const existingLogs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    // Keep last 1000 logs to prevent storage overflow
    const updatedLogs = [newLog, ...existingLogs].slice(0, 1000);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    
    // Dev only log
    // console.log(`[Admin Audit] ${actionType}`); 
  } catch (error) {
    console.error('Failed to save admin log');
  }
};

export const getAdminLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
};

export const clearAdminLogs = () => {
    localStorage.removeItem(STORAGE_KEY);
};