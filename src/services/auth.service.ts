import api from './api';
import type { ApiResponse } from './api';

// ============================================
// TYPES
// ============================================

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'manager';
  isEmailVerified: boolean;
  isActive: boolean;
  preferences: {
    onboardingCompleted: boolean;
    [key: string]: any;
  };
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  phone?: string;
}

// ============================================
// AUTH SERVICE
// ============================================

const authService = {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/register', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      password: data.password,
      passwordConfirm: data.passwordConfirm || data.password,
      phone: data.phone,
    });

    if (response.data.data) {
      this.setTokens(response.data.data);
    }

    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post('/auth/login', {
      email: credentials.email.toLowerCase(),
      password: credentials.password,
    });

    if (response.data.data) {
      this.setTokens(response.data.data);
    }

    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearTokens();
    }
  },

  /**
   * Get current user
   */
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, password: string, passwordConfirm: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.patch(`/auth/reset-password/${token}`, {
      password,
      passwordConfirm,
    });
    return response.data;
  },

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await api.post('/auth/refresh-token', { refreshToken });
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      return response.data.data.accessToken;
    }
    throw new Error('Failed to refresh token');
  },

  // ============================================
  // TOKEN HELPERS
  // ============================================

  setTokens(data: AuthResponse): void {
    if (!data.accessToken || !data.refreshToken) {
      throw new Error('Invalid auth response: missing tokens');
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    // Basic JWT format check
    const parts = token.split('.');
    return parts.length === 3;
  },

  /**
   * Get formatted error message from API response
   */
  getErrorMessage(error: any): string {
    // Axios error
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Network error
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    }

    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      return 'Network error. Please check your internet connection.';
    }

    // Generic error
    return error.message || 'An unexpected error occurred. Please try again.';
  },
};

export default authService;
