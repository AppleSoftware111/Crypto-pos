import axios from 'axios';
import { getPOSApiBaseUrl } from '@/config/posConfig';
import { getAccessToken } from '@/lib/authApi';

const baseURL = getPOSApiBaseUrl();
const defaultHeaders = { 'Content-Type': 'application/json' };
if (String(baseURL).includes('ngrok')) {
  defaultHeaders['ngrok-skip-browser-warning'] = 'true';
}

const userPosApi = axios.create({
  baseURL,
  timeout: 30000,
  headers: defaultHeaders,
  withCredentials: false,
});

userPosApi.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (String(baseURL).includes('ngrok')) {
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Link Omarapay user (JWT) to POS company after verifying company password.
 */
export const linkUserPosAccount = (companyPassword) =>
  userPosApi.post('/api/user/pos/link', { companyPassword }).then((r) => r.data);

/**
 * Read-only POS transactions for the linked company (JWT only).
 */
export const fetchUserPosTransactions = (limit = 50, offset = 0, signal = null) =>
  userPosApi
    .get('/api/user/pos/transactions', { params: { limit, offset }, signal })
    .then((r) => r.data);

export default userPosApi;
