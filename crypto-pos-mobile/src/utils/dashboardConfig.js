import { Platform } from 'react-native';

/**
 * Dashboard API Configuration
 * Configuration for connecting to Omarapay dashboard (app.omarapay.com)
 *
 * When client provides API credentials, update these values:
 * 1. Set USE_OMARAPAY_API to true
 * 2. Update OMARAPAY_API_BASE_URL
 * 3. Add authentication credentials
 * 4. Update endpoint mappings if needed
 *
 * Omarapay integration: POS is now embedded in Omarapay user dashboard (/wallet/pos).
 * This mobile app can use the same Crypto POS backend: set EXPO_PUBLIC_API_BASE_URL
 * to your deployed POS backend URL (e.g. https://pos-api.omarapay.com) so both
 * Omarapay web and this app share the same coins and payments.
 */

// Toggle between local backend and Omarapay API
export const USE_OMARAPAY_API = false; // Set to true when ready to use Omarapay API

// API Base URLs
// Priority:
// 1) EXPO_PUBLIC_API_BASE_URL (required for EAS preview/production; must match Vercel VITE_POS_API_BASE_URL origin)
// 2) __DEV__ only: emulator/simulator loopback (physical devices must set EXPO_PUBLIC_ or in-app Server URL)
const DEFAULT_ANDROID_EMULATOR_API = 'http://10.0.2.2:4000';
const DEFAULT_IOS_SIMULATOR_API = 'http://127.0.0.1:4000';

function resolveLocalApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  if (__DEV__) {
    return Platform.OS === 'android' ? DEFAULT_ANDROID_EMULATOR_API : DEFAULT_IOS_SIMULATOR_API;
  }
  // Release build without baked URL — warn; physical Android cannot use 10.0.2.2
  console.warn(
    '[Crypto POS] EXPO_PUBLIC_API_BASE_URL was not set at build time. Set it in EAS env or use Server URL on the login screen.'
  );
  return Platform.OS === 'android' ? DEFAULT_ANDROID_EMULATOR_API : DEFAULT_IOS_SIMULATOR_API;
}

export const LOCAL_API_BASE_URL = resolveLocalApiBaseUrl();
export const OMARAPAY_API_BASE_URL = 'https://app.omarapay.com/api'; // Omarapay API (update when provided)

// Get current API base URL
export const getApiBaseUrl = () => {
  return USE_OMARAPAY_API ? OMARAPAY_API_BASE_URL : LOCAL_API_BASE_URL;
};

// Authentication Configuration
export const OMARAPAY_AUTH = {
  // Update these when client provides credentials
  apiKey: process.env.OMARAPAY_API_KEY || '', // API key for Omarapay
  apiSecret: process.env.OMARAPAY_API_SECRET || '', // API secret (if required)
  token: process.env.OMARAPAY_TOKEN || '', // Bearer token (if using JWT)
  authType: 'api_key', // 'api_key', 'bearer_token', 'oauth', 'basic'
};

/**
 * API Endpoint Mappings
 * Maps local endpoints to Omarapay API endpoints
 * Update these based on actual Omarapay API documentation
 */
export const API_ENDPOINTS = {
  // Authentication
  COMPANY_LOGIN: USE_OMARAPAY_API
    ? '/auth/company/login'
    : '/api/pos/company/login',

  CASHIER_LIST: USE_OMARAPAY_API
    ? '/company/{companyId}/cashiers'
    : '/api/pos/company/{companyId}/cashiers',

  CASHIER_LOGIN: USE_OMARAPAY_API
    ? '/auth/cashier/login'
    : '/api/pos/cashier/login',

  AUTH_STATUS: USE_OMARAPAY_API
    ? '/auth/status'
    : '/api/pos/auth/status',

  LOGOUT: USE_OMARAPAY_API
    ? '/auth/logout'
    : '/api/pos/logout',

  // Payment Methods
  PAYMENT_METHODS: USE_OMARAPAY_API
    ? '/payment-methods'
    : '/api/coins',

  // Payments
  CREATE_PAYMENT: USE_OMARAPAY_API
    ? '/payments/create'
    : '/api/payment/create',

  PAYMENT_STATUS: USE_OMARAPAY_API
    ? '/payments/{paymentId}/status'
    : '/api/payment/status/{paymentId}',

  // Crypto Rates
  CRYPTO_RATE: USE_OMARAPAY_API
    ? '/crypto/rates/{methodCode}'
    : '/api/payment/crypto-rate/{methodCode}',

  // Security Code
  GENERATE_SECURITY_CODE: USE_OMARAPAY_API
    ? '/payments/generate-security-code'
    : '/api/payment/generate-security-code',

  VERIFY_SECURITY_CODE: USE_OMARAPAY_API
    ? '/payments/verify-security-code'
    : '/api/payment/verify-security-code',

  // Receipt
  RECEIPT_DATA: USE_OMARAPAY_API
    ? '/receipts/{paymentId}'
    : '/api/receipt/{paymentId}',

  // Transactions
  TRANSACTION_HISTORY: USE_OMARAPAY_API
    ? '/transactions'
    : '/api/transactions',

  TRANSACTION_DETAIL: USE_OMARAPAY_API
    ? '/transactions/{transactionId}'
    : '/api/transactions/{transactionId}',
};

/**
 * Get full endpoint URL
 */
export const getEndpointUrl = (endpointKey, params = {}) => {
  let endpoint = API_ENDPOINTS[endpointKey];

  if (!endpoint) {
    console.warn(`Endpoint ${endpointKey} not found in mapping`);
    return endpointKey;
  }

  // Replace path parameters
  Object.keys(params).forEach(key => {
    endpoint = endpoint.replace(`{${key}}`, params[key]);
  });

  // Add base URL if not already included
  if (!endpoint.startsWith('http')) {
    endpoint = getApiBaseUrl() + endpoint;
  }

  return endpoint;
};

/**
 * Get authentication headers for API requests
 */
export const getAuthHeaders = () => {
  if (!USE_OMARAPAY_API) {
    // Local API uses token headers (handled by apiClient)
    return {};
  }

  const headers = {};

  switch (OMARAPAY_AUTH.authType) {
    case 'api_key':
      if (OMARAPAY_AUTH.apiKey) {
        headers['X-API-Key'] = OMARAPAY_AUTH.apiKey;
      }
      if (OMARAPAY_AUTH.apiSecret) {
        headers['X-API-Secret'] = OMARAPAY_AUTH.apiSecret;
      }
      break;

    case 'bearer_token':
      if (OMARAPAY_AUTH.token) {
        headers['Authorization'] = `Bearer ${OMARAPAY_AUTH.token}`;
      }
      break;

    case 'basic':
      if (OMARAPAY_AUTH.apiKey && OMARAPAY_AUTH.apiSecret) {
        const credentials = Buffer.from(`${OMARAPAY_AUTH.apiKey}:${OMARAPAY_AUTH.apiSecret}`).toString('base64');
        headers['Authorization'] = `Basic ${credentials}`;
      }
      break;

    default:
      console.warn(`Unknown auth type: ${OMARAPAY_AUTH.authType}`);
  }

  return headers;
};

/**
 * Check if Omarapay API is configured
 */
export const isOmarapayConfigured = () => {
  if (!USE_OMARAPAY_API) {
    return false;
  }

  // Check if required credentials are set
  switch (OMARAPAY_AUTH.authType) {
    case 'api_key':
      return !!OMARAPAY_AUTH.apiKey;
    case 'bearer_token':
      return !!OMARAPAY_AUTH.token;
    case 'basic':
      return !!(OMARAPAY_AUTH.apiKey && OMARAPAY_AUTH.apiSecret);
    default:
      return false;
  }
};
