import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const getBaseURL = (): string => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  // If empty or missing, use localhost
  if (!envUrl) return 'http://localhost:5000/api/v1';

  // If it's a relative URL (starts with /), keep it as-is for Vercel
  if (envUrl.startsWith('/')) return envUrl;

  // If it's a full URL, return as-is
  try {
    new URL(envUrl);
    return envUrl;
  } catch {
    // Invalid URL, treat as path
    return envUrl.startsWith('/') ? envUrl : `/${envUrl}`;
  }
};

// ============================================
// AXIOS INSTANCE
// ============================================

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 seconds for slow connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// REQUEST INTERCEPTOR - Add auth token
// ============================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// RESPONSE INTERCEPTOR - Handle errors & refresh
// ============================================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - try token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const response = await axios.post(
            `${getBaseURL()}/auth/refresh-token`,
            { refreshToken },
            { timeout: 10000 }
          );

          const newAccessToken = response.data.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.warn('Token refresh failed, redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login-required';
      }
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

// ============================================
// TYPES
// ============================================

export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  results?: number;
  total?: number;
}
