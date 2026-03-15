import axios from 'axios';
import { getCompanyAuth, getCashierAuth } from '../utils/storage';
import { getApiBaseUrl, getAuthHeaders, isOmarapayConfigured } from '../utils/dashboardConfig';

// Create axios instance with default configuration
// Base URL is dynamically determined by dashboardConfig
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for authentication and logging
apiClient.interceptors.request.use(
  async (config) => {
    // Add Omarapay API authentication headers if configured
    if (isOmarapayConfigured()) {
      const omarapayHeaders = getAuthHeaders();
      Object.assign(config.headers, omarapayHeaders);
    } else {
      // Add local API authentication tokens if available
      try {
        const companyAuth = await getCompanyAuth();
        const cashierAuth = await getCashierAuth();

        // Add company token if available
        if (companyAuth.token) {
          config.headers['X-Company-Token'] = companyAuth.token;
        }

        // Add cashier token if available
        if (cashierAuth.token) {
          config.headers['X-Cashier-Token'] = cashierAuth.token;
        }
      } catch (error) {
        console.error('[API] Error getting auth tokens:', error);
      }
    }

    // Logging (development only)
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      if (isOmarapayConfigured()) {
        console.log('[API] Using Omarapay API');
      }
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      console.error('[API Error Response]', {
        status: status,
        data: data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      
      // Handle specific error codes
      if (status === 418) {
        console.error('[418 Error] This usually indicates a server configuration issue');
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('[API Network Error]', {
        message: 'No response from server',
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout,
      });
    } else {
      // Something else happened
      console.error('[API Error]', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Set base URL at runtime (e.g. after loading stored override or user input)
 */
export const setApiBaseURL = (url) => {
  if (url && typeof url === 'string') {
    apiClient.defaults.baseURL = url.replace(/\/+$/, '');
    if (__DEV__) console.log('[API] Base URL set to', apiClient.defaults.baseURL);
  }
};

/**
 * Get current base URL (for display in dev UI)
 */
export const getApiBaseURL = () => apiClient.defaults.baseURL;

export default apiClient;
