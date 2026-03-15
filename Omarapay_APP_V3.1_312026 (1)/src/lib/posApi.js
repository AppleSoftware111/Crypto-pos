import axios from 'axios';
import { getPOSApiBaseUrl } from '@/config/posConfig';

const posApi = axios.create({
  baseURL: getPOSApiBaseUrl(),
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Request interceptor: add POS tokens if present
posApi.interceptors.request.use((config) => {
  const companyToken = typeof window !== 'undefined' && window.__POS_COMPANY_TOKEN__;
  const cashierToken = typeof window !== 'undefined' && window.__POS_CASHIER_TOKEN__;
  if (companyToken) config.headers['X-Company-Token'] = companyToken;
  if (cashierToken) config.headers['X-Cashier-Token'] = cashierToken;
  return config;
});

export const getCoins = () => posApi.get('/api/coins').then((r) => r.data.coins || []);
export const createPayment = (method, amount, body = {}) =>
  posApi.post('/api/payment/create', { method, amount: parseFloat(amount), ...body }).then((r) => r.data);
export const createCardPayment = (method, amount, cardData = {}) =>
  posApi.post('/api/card/payment/create', {
    method,
    amount: parseFloat(amount),
    cardNumber: cardData.cardNumber,
    expiryMonth: cardData.expiryMonth,
    expiryYear: cardData.expiryYear,
    cvv: cardData.cvv,
    cardholderName: cardData.cardholderName,
  }).then((r) => r.data);
export const checkPaymentStatus = (paymentId) =>
  posApi.get(`/api/payment/status/${paymentId}`).then((r) => r.data);
export const simulatePaymentConfirm = (paymentId) =>
  posApi.post(`/api/payment/${paymentId}/simulate-confirm`).then((r) => r.data);
export const getCryptoRate = (methodCode, amount = 100) =>
  posApi.get(`/api/payment/crypto-rate/${encodeURIComponent(methodCode)}`, { params: { amount } }).then((r) => r.data);
export const getReceipt = (paymentId) => posApi.get(`/api/receipt/${paymentId}`).then((r) => r.data);
export const companyLogin = (password) => posApi.post('/api/pos/company/login', { password }).then((r) => r.data);
export const getCashiers = (companyId) =>
  posApi.get(`/api/pos/company/${companyId}/cashiers`, {
    headers: { 'X-Company-Token': window.__POS_COMPANY_TOKEN__ },
  }).then((r) => r.data.cashiers || []);
export const cashierLogin = (companyId, cashierId, password) =>
  posApi.post('/api/pos/cashier/login', { companyId, cashierId, password }).then((r) => r.data);
export const posAuthStatus = () => posApi.get('/api/pos/auth/status').then((r) => r.data);
export const posLogout = () => posApi.post('/api/pos/logout').then((r) => r.data);
export const getTransactions = (limit = 50, offset = 0) =>
  posApi.get('/api/pos/transactions', { params: { limit, offset } }).then((r) => r.data);
export const healthCheck = () => posApi.get('/api/health').then((r) => r.data);

export default posApi;
