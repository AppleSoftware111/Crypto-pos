/**
 * Admin API client for Crypto POS backend.
 * Used by Omarapay admin pages (POS Coins, POS Payments).
 */
import axios from 'axios';
import { getPOSApiBaseUrl } from '@/config/posConfig';

const adminApiKey = import.meta.env.VITE_POS_ADMIN_API_KEY || '';

const adminClient = axios.create({
  baseURL: getPOSApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    ...(adminApiKey ? { 'X-API-Key': adminApiKey } : {}),
  },
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

export const isPOSAdminConfigured = () => !!adminApiKey;

export default adminClient;
