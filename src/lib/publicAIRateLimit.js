/**
 * Public AI Rate Limiting Utility
 * Manages usage limits for non-authenticated users based on browser storage
 * simulating IP-based restrictions for frontend-only environment.
 */

const STORAGE_KEY = 'omara_public_ai_usage';
const LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_MESSAGES = 10;

const getUsageData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { timestamps: [] };
  } catch (e) {
    return { timestamps: [] };
  }
};

const saveUsageData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const checkRateLimit = () => {
  const now = Date.now();
  const usage = getUsageData();
  
  // Filter out timestamps older than the window
  const activeTimestamps = usage.timestamps.filter(ts => now - ts < LIMIT_WINDOW);
  
  // Update storage if we cleaned up old timestamps
  if (activeTimestamps.length !== usage.timestamps.length) {
    saveUsageData({ timestamps: activeTimestamps });
  }

  const allowed = activeTimestamps.length < MAX_MESSAGES;
  const remaining = Math.max(0, MAX_MESSAGES - activeTimestamps.length);
  
  // Calculate reset time (time until the oldest message expires)
  let resetTime = 0;
  if (activeTimestamps.length > 0) {
    const oldestTimestamp = Math.min(...activeTimestamps);
    resetTime = Math.max(0, (oldestTimestamp + LIMIT_WINDOW) - now);
  }

  return {
    allowed,
    remaining,
    resetTime
  };
};

export const recordMessage = () => {
  const usage = getUsageData();
  const now = Date.now();
  usage.timestamps.push(now);
  saveUsageData(usage);
};

export const getRemainingMessages = () => {
  const { remaining } = checkRateLimit();
  return remaining;
};