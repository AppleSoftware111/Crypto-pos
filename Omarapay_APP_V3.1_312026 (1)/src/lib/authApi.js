import axios from 'axios';
import { getPOSApiBaseUrl } from '@/config/posConfig';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || getPOSApiBaseUrl();

const defaultHeaders = { 'Content-Type': 'application/json' };
if (String(AUTH_API_BASE_URL).includes('ngrok')) {
  defaultHeaders['ngrok-skip-browser-warning'] = 'true';
}

let accessToken = null;
let isRefreshing = false;
let refreshPromise = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const authApi = axios.create({
  baseURL: AUTH_API_BASE_URL,
  timeout: 30000,
  headers: { ...defaultHeaders },
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const performRefresh = async () => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = authApi.post('/api/auth/refresh').then((res) => {
    const token = res.data?.accessToken || null;
    setAccessToken(token);
    return token;
  }).finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
};

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const url = String(originalRequest.url || '');
    const status = error.response?.status;
    const shouldSkip = url.includes('/api/auth/refresh') || url.includes('/api/auth/login') || url.includes('/api/auth/register') || url.includes('/api/auth/google');
    if (status === 401 && !originalRequest._retry && !shouldSkip) {
      try {
        originalRequest._retry = true;
        await performRefresh();
        if (accessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return authApi(originalRequest);
      } catch (_refreshErr) {
        clearAccessToken();
      }
    }
    return Promise.reject(error);
  }
);

export const registerWithEmail = async ({ email, password, name }) => {
  const res = await authApi.post('/api/auth/register', { email, password, name });
  setAccessToken(res.data?.accessToken || null);
  return res.data;
};

export const loginWithEmail = async ({ email, password }) => {
  const res = await authApi.post('/api/auth/login', { email, password });
  setAccessToken(res.data?.accessToken || null);
  return res.data;
};

export const loginWithGoogleToken = async (idToken) => {
  const res = await authApi.post('/api/auth/google', { idToken });
  setAccessToken(res.data?.accessToken || null);
  return res.data;
};

export const refreshSession = async () => {
  const token = await performRefresh();
  return token;
};

/** Single-flight bootstrap: refresh cookie → access token → /me. Avoids calling /me without a token (noisy 401 + retry spam). */
let bootstrapAuthPromise = null;
export async function bootstrapAuthSession() {
  if (!bootstrapAuthPromise) {
    bootstrapAuthPromise = (async () => {
      try {
        await performRefresh();
        if (!getAccessToken()) {
          return { user: null };
        }
        const res = await authApi.get('/api/auth/me');
        return { user: res.data?.user ?? null };
      } catch {
        clearAccessToken();
        return { user: null };
      }
    })().finally(() => {
      bootstrapAuthPromise = null;
    });
  }
  return bootstrapAuthPromise;
}

export const getCurrentUser = async () => {
  const res = await authApi.get('/api/auth/me');
  return res.data;
};

export const logoutSession = async () => {
  try {
    await authApi.post('/api/auth/logout');
  } finally {
    clearAccessToken();
  }
};

export default authApi;
