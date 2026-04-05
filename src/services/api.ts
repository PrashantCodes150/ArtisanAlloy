import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Normalize base URL to prevent duplicate paths
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  // If it's a relative URL (starts with /), use as-is
  if (envUrl.startsWith('/')) {
    // In production, if VITE_BACKEND_URL is set, use it as the base
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (backendUrl) {
      return `${backendUrl}${envUrl}`;
    }
    // For monolith deployments (same domain), keep relative path
    return envUrl;
  }

  // If it's an absolute URL, return as-is
  return envUrl;
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000, // 30 second timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // We'll handle credentials manually
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      // Add cache control headers to prevent service worker interference
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 errors - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${getBaseURL()}/auth/refresh-token`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
              },
              timeout: 10000,
            }
          );

          const accessToken = response?.data?.data?.accessToken;
          if (!accessToken) {
            throw new Error('No access token received');
          }
          localStorage.setItem('accessToken', accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login-required';
      }
    }

    // Log network errors for debugging
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.error('Network error detected. This might be caused by service worker interference.');
    }

    return Promise.reject(error);
  }
);

export default api;

// Type for API responses
export interface ApiResponse<T> {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T;
  results?: number;
  total?: number;
}
