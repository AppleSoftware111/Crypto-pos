import apiClient from './apiClient';

/**
 * API Endpoints
 * All API calls to the backend server
 */

const createIdempotencyKey = (prefix = 'pay') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

/**
 * Get all enabled coins/payment methods
 * @returns {Promise<Array>} Array of enabled coins
 */
export const getCoins = async () => {
  try {
    const response = await apiClient.get('/api/coins');
    return response.data.coins || [];
  } catch (error) {
    console.error('Error fetching coins:', error);
    
    // Better error messages
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;
      
      if (status === 418) {
        throw new Error('Server configuration error. Please check backend server.');
      }
      
      throw new Error(message || `Server error (${status}). Please check your backend.`);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Cannot connect to server. Make sure the backend is running on port 4000.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Failed to fetch payment methods');
    }
  }
};

/**
 * Create a new payment request
 * @param {string} method - Payment method code (e.g., 'btc', 'usdt-avax')
 * @param {number} amount - Payment amount
 * @returns {Promise<Object>} Payment data with paymentId, address, qrData
 */
export const createPayment = async (method, amount) => {
  try {
    if (!method || !amount || amount <= 0) {
      throw new Error('Invalid payment method or amount');
    }

    const response = await apiClient.post('/api/payment/create', {
      method,
      amount: parseFloat(amount),
    });

    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error(error.response?.data?.error || 'Failed to create payment request');
  }
};

/**
 * Check payment status
 * @param {string} paymentId - Payment ID to check
 * @returns {Promise<Object>} Payment status with confirmed flag
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    const response = await apiClient.get(`/api/payment/status/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw new Error(error.response?.data?.error || 'Failed to check payment status');
  }
};

/**
 * Simulate payment confirmation (dev only). Marks payment as confirmed with a fake txHash.
 * @param {string} paymentId - Payment ID to simulate
 * @returns {Promise<Object>} Updated payment status
 */
export const simulatePaymentConfirm = async (paymentId) => {
  try {
    if (!paymentId) throw new Error('Payment ID is required');
    const response = await apiClient.post(`/api/payment/${paymentId}/simulate-confirm`);
    return response.data;
  } catch (error) {
    console.error('Simulate payment confirm failed:', error);
    throw new Error(error.response?.data?.error || 'Simulate confirm failed');
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Server health status
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Server is not available');
  }
};

/**
 * Authentication Endpoints
 */

/**
 * Company login
 * @param {string} password - Company password
 * @returns {Promise<Object>} Company data and token
 */
export const loginCompany = async (password) => {
  try {
    if (!password) {
      throw new Error('Company password is required');
    }

    const response = await apiClient.post('/api/pos/company/login', {
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Error logging in company:', error);
    throw new Error(error.response?.data?.error || 'Failed to login company');
  }
};

/**
 * Get cashiers for a company
 * @param {string} companyId - Company ID
 * @returns {Promise<Array>} Array of cashiers
 */
export const getCashiers = async (companyId) => {
  try {
    if (!companyId) {
      throw new Error('Company ID is required');
    }

    const response = await apiClient.get(`/api/pos/company/${companyId}/cashiers`);
    return response.data.cashiers || [];
  } catch (error) {
    console.error('Error fetching cashiers:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch cashiers');
  }
};

/**
 * Cashier login
 * @param {string} companyId - Company ID
 * @param {string} cashierId - Cashier ID
 * @param {string} password - Cashier password
 * @returns {Promise<Object>} Cashier data and token
 */
export const loginCashier = async (companyId, cashierId, password) => {
  try {
    if (!companyId || !cashierId || !password) {
      throw new Error('Company ID, Cashier ID, and password are required');
    }

    const response = await apiClient.post('/api/pos/cashier/login', {
      companyId,
      cashierId,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Error logging in cashier:', error);
    throw new Error(error.response?.data?.error || 'Failed to login cashier');
  }
};

/**
 * Check authentication status
 * @returns {Promise<Object>} Auth status
 */
export const checkAuthStatus = async () => {
  try {
    const response = await apiClient.get('/api/pos/auth/status');
    return response.data;
  } catch (error) {
    console.error('Error checking auth status:', error);
    throw new Error(error.response?.data?.error || 'Failed to check auth status');
  }
};

/**
 * Logout
 * @returns {Promise<Object>} Logout confirmation
 */
export const logout = async () => {
  try {
    const response = await apiClient.post('/api/pos/logout');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw new Error(error.response?.data?.error || 'Failed to logout');
  }
};

/**
 * Transaction history (recent payments)
 * @param {number} limit - Max items (default 50)
 * @param {number} offset - Pagination offset
 * @returns {Promise<{ success: boolean, transactions: Array }>}
 */
export const getTransactionHistory = async (limit = 50, offset = 0) => {
  try {
    const response = await apiClient.get('/api/pos/transactions', {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch transactions');
  }
};

/**
 * Payment Flow Endpoints
 */

/**
 * Get crypto rate
 * @param {string} methodCode - Payment method code (e.g., 'btc', 'eth')
 * @param {number} amount - Amount in USD
 * @returns {Promise<Object>} Rate data with crypto amount and USD rate
 */
export const getCryptoRate = async (methodCode, amount = 100) => {
  try {
    if (!methodCode) {
      throw new Error('Cryptocurrency method code is required');
    }

    const encodedMethodCode = encodeURIComponent(String(methodCode));
    const response = await apiClient.get(`/api/payment/crypto-rate/${encodedMethodCode}`, {
      params: { amount },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto rate:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch crypto rate');
  }
};

/**
 * Generate security code
 * @param {string} phoneNumber - Customer phone number
 * @returns {Promise<Object>} Security code data
 */
export const generateSecurityCode = async (phoneNumber) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const response = await apiClient.post('/api/payment/generate-security-code', {
      phoneNumber,
    });

    return response.data;
  } catch (error) {
    console.error('Error generating security code:', error);
    throw new Error(error.response?.data?.error || 'Failed to generate security code');
  }
};

/**
 * Create payment with enhanced data
 * @param {string} method - Payment method code
 * @param {number} amount - Payment amount
 * @param {Object} metadata - Additional payment metadata (phoneNumber, securityCode, etc.)
 * @returns {Promise<Object>} Payment data
 */
export const createPaymentWithMetadata = async (method, amount, metadata = {}) => {
  try {
    if (!method || !amount || amount <= 0) {
      throw new Error('Invalid payment method or amount');
    }

    const response = await apiClient.post(
      '/api/payment/create',
      {
        method,
        amount: parseFloat(amount),
        ...metadata,
      },
      {
        headers: {
          'X-Idempotency-Key': metadata.idempotencyKey || createIdempotencyKey('crypto'),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw new Error(error.response?.data?.error || 'Failed to create payment request');
  }
};

/**
 * Create card payment
 * @param {string} method - Card method code (e.g., 'visa', 'mastercard')
 * @param {number} amount - Amount in USD
 * @param {Object} cardData - Card payload
 * @returns {Promise<Object>} Card payment result
 */
export const createCardPayment = async (method, amount, cardData = {}) => {
  try {
    if (!method || !amount || amount <= 0) {
      throw new Error('Invalid card method or amount');
    }

    const response = await apiClient.post(
      '/api/card/payment/create',
      {
        method,
        amount: parseFloat(amount),
        ...cardData,
      },
      {
        headers: {
          'X-Idempotency-Key': cardData.idempotencyKey || createIdempotencyKey('card'),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating card payment:', error);
    throw new Error(error.response?.data?.error || 'Failed to process card payment');
  }
};

/**
 * Create QR wallet payment
 * @param {string} method - QR wallet method code (e.g., 'gcash', 'gpay')
 * @param {number} amount - Amount in USD
 * @param {Object} metadata - Additional payload (phoneNumber, note, etc.)
 * @returns {Promise<Object>} QR wallet payment result
 */
export const createQRWalletPayment = async (method, amount, metadata = {}) => {
  try {
    if (!method || !amount || amount <= 0) {
      throw new Error('Invalid QR wallet method or amount');
    }

    const response = await apiClient.post(
      '/api/qr/payment/create',
      {
        method,
        amount: parseFloat(amount),
        ...metadata,
      },
      {
        headers: {
          'X-Idempotency-Key': metadata.idempotencyKey || createIdempotencyKey('qr'),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating QR wallet payment:', error);
    throw new Error(error.response?.data?.error || 'Failed to create QR wallet payment');
  }
};

/**
 * Get receipt data for a payment
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Receipt data
 */
export const getReceiptData = async (paymentId) => {
  try {
    if (!paymentId) {
      throw new Error('Payment ID is required');
    }

    const response = await apiClient.get(`/api/receipt/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching receipt data:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch receipt data');
  }
};

