// Configuration file for API endpoints and app settings

// IMPORTANT: API Base URL is now managed by dashboardConfig.js
// For local development: Uses LOCAL_API_BASE_URL
// For Omarapay integration: Set USE_OMARAPAY_API = true in dashboardConfig.js
// This will be dynamically set by apiClient.js to avoid circular dependencies
export const API_BASE_URL = 'http://192.168.139.90:4000'; // Default, will be overridden by dashboardConfig
// Payment monitoring configuration
export const PAYMENT_CHECK_INTERVAL = 2000; // 2 seconds (matches web app)
export const MAX_RETRIES = 450; // 15 minutes (450 * 2 seconds = 900 seconds)
export const TIMEOUT_MINUTES = 15;

// QR Code configuration
export const QR_CODE_SIZE = 300;

// App theme colors
export const COLORS = {
    primary: '#2775CA',
    primaryDark: '#1E5A9E',
    secondary: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#333333',
    textSecondary: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
};

// Font sizes
export const FONT_SIZES = {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 24,
    title: 28,
};

