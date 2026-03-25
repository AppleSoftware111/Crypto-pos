/**
 * Admin API client for Crypto POS backend.
 * Used by Omarapay admin pages (POS Coins, POS Payments).
 */
import axios from 'axios';
import { getPOSApiBaseUrl } from '@/config/posConfig';

const adminApiKey = import.meta.env.VITE_POS_ADMIN_API_KEY || '';
const baseURL = getPOSApiBaseUrl();
const defaultHeaders = {
  'Content-Type': 'application/json',
  ...(adminApiKey ? { 'X-API-Key': adminApiKey } : {}),
};
if (String(baseURL).includes('ngrok')) {
  defaultHeaders['ngrok-skip-browser-warning'] = 'true';
}

const adminClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: defaultHeaders,
  withCredentials: true,
});

// Coins
export const getPOSAdminCoins = () =>
  adminClient.get('/api/admin/coins').then((r) => r.data.coins || []);

export const getPOSAdminCoin = (id) =>
  adminClient.get(`/api/admin/coins/${id}`).then((r) => r.data.coin);

export const createPOSCoin = (data) =>
  adminClient.post('/api/admin/coins', data).then((r) => r.data.coin);

export const updatePOSCoin = (id, data) =>
  adminClient.put(`/api/admin/coins/${id}`, data).then((r) => r.data.coin);

export const deletePOSCoin = (id) =>
  adminClient.delete(`/api/admin/coins/${id}`).then((r) => r.data);

export const togglePOSCoin = (id, enabled) =>
  adminClient.post(`/api/admin/coins/${id}/toggle`, { enabled }).then((r) => r.data.coin);

// Payments
export const getPOSAdminPayments = (params = {}) =>
  adminClient.get('/api/admin/payments', { params }).then((r) => r.data.payments || []);

/** Receipt is public API (no admin auth required) */
export const getPOSReceipt = (paymentId) =>
  adminClient.get(`/api/receipt/${paymentId}`).then((r) => r.data);

const POS_ADMIN_SESSION_FLAG = 'omara_crypto_pos_admin';

/** API key (server-to-server) or Crypto POS admin session (after /api/admin/login). */
export const isPOSAdminConfigured = () =>
  !!adminApiKey ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(POS_ADMIN_SESSION_FLAG) === '1');

export const setPOSAdminSessionFlag = (active) => {
  if (typeof sessionStorage === 'undefined') return;
  if (active) sessionStorage.setItem(POS_ADMIN_SESSION_FLAG, '1');
  else sessionStorage.removeItem(POS_ADMIN_SESSION_FLAG);
};

// App users (Crypto POS user auth store)
export const getAdminUsers = (params = {}) =>
  adminClient.get('/api/admin/users', { params }).then((r) => r.data);

export const getAdminUser = (id) =>
  adminClient.get(`/api/admin/users/${encodeURIComponent(id)}`).then((r) => r.data.user);

export const createAdminUser = (data) =>
  adminClient.post('/api/admin/users', data).then((r) => r.data.user);

export const updateAdminUser = (id, data) =>
  adminClient.patch(`/api/admin/users/${encodeURIComponent(id)}`, data).then((r) => r.data.user);

export const deactivateAdminUser = (id) =>
  adminClient.delete(`/api/admin/users/${encodeURIComponent(id)}`).then((r) => r.data);

/** Crypto POS panel login (session cookie). Backend expects `username` + `password`. */
export const loginCryptoPOSAdmin = (username, password) =>
  adminClient.post('/api/admin/login', { username, password }).then((r) => r.data);

export const getCryptoPOSAdminAuthStatus = () =>
  adminClient.get('/api/admin/auth/status').then((r) => r.data);

export const logoutCryptoPOSAdmin = () =>
  adminClient.post('/api/admin/logout').then((r) => r.data);

export default adminClient;
