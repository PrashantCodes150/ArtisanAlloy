import api from './api';
import type { ApiResponse } from './api';
import mockAuthService from './mock-auth.service';

// Flag to use mock service when backend is not available
const USE_MOCK_SERVICE = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !import.meta.env.VITE_API_URL;

export interface UserPreferences {
  categories: string[];
  bodyParts: string[];
  metalTypes: string[];
  designStyles: string[];
  astrology: {
    sunSign?: string;
    birthMonth?: string;
    birthStone?: string;
    nakshatra?: string;
  };
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;
  lastUpdated: Date;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'manager';
  isEmailVerified: boolean;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
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
  passwordConfirm: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authService = {
  // Register new user
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.register(data);
    }
    
    const response = await api.post('/auth/register', data);
    if (response?.data?.data) {
      this.setTokens(response.data.data);
    }
    return response?.data;
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.login(credentials);
    }
    
    const response = await api.post('/auth/login', credentials);
    if (response?.data?.data) {
      this.setTokens(response.data.data);
    }
    return response?.data;
  },

// Logout user
  async logout(): Promise<void> {
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.logout();
    }
    
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } finally {
      this.clearTokens();
    }
  },

  // Get current user
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.getMe();
    }
    
    const response = await api.get('/auth/me');
    return response?.data;
  },

  // Update password
  async updatePassword(currentPassword: string, newPassword: string, newPasswordConfirm: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.patch('/auth/update-password', {
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });
    if (response?.data?.data) {
      this.setTokens(response.data.data);
    }
    return response?.data;
  },

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/forgot-password', { email });
    return response?.data;
  },

  // Reset password
  async resetPassword(token: string, password: string, passwordConfirm: string): Promise<ApiResponse<AuthResponse>> {
    const response = await api.patch(`/auth/reset-password/${token}`, {
      password,
      passwordConfirm,
    });
    return response?.data;
  },

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response?.data;
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/resend-verification', { email });
    return response?.data;
  },

// Helper: Set tokens in localStorage
  setTokens(data: AuthResponse): void {
    try {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Tokens stored successfully');
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  },

  // Helper: Clear tokens from localStorage
  clearTokens(): void {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.log('Tokens cleared successfully');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  // Helper: Get stored user
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  },

// Helper: Check if user is authenticated
  isAuthenticated(): boolean {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return false;
      
      // Basic token validation (check if it's JWT format)
      const parts = token.split('.');
      return parts.length === 3;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  },

  // Refresh access token
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await api.post('/auth/refresh-token', { refreshToken });
    if (response?.data?.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    return response?.data;
  },

  // Get verification status
  async getVerificationStatus(): Promise<ApiResponse<{ isEmailVerified: boolean; email: string; twoFactorEnabled: boolean }>> {
    const response = await api.get('/auth/verification-status');
    return response?.data;
  },

  // Two-Factor Authentication methods
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; secret: string; backupCodes: string[] }>> {
    const response = await api.post('/auth/enable-2fa');
    return response?.data;
  },

  async verifyTwoFactorSetup(token: string): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> {
    const response = await api.post('/verify-2fa-setup', { token });
    return response?.data;
  },

  async disableTwoFactor(password: string): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> {
    const response = await api.post('/auth/disable-2fa', { password });
    return response?.data;
  },

  async generateBackupCodes(password: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    const response = await api.post('/auth/generate-backup-codes', { password });
    return response?.data;
  },

  async verifyTwoFactorLogin(tempToken: string, twoFactorToken?: string, backupCode?: string): Promise<ApiResponse<AuthResponse>> {
    const payload: any = { tempToken };
    if (twoFactorToken) payload.twoFactorToken = twoFactorToken;
    if (backupCode) payload.backupCode = backupCode;
    
    const response = await api.post('/auth/verify-2fa-login', payload);
    if (response?.data?.data) {
      this.setTokens(response.data.data);
    }
    return response?.data;
  },

  // Onboarding methods
  async completeOnboarding(preferences: Partial<UserPreferences>): Promise<ApiResponse<{ user: User }>> {
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.completeOnboarding(preferences);
    }
    
    const response = await api.patch('/users/complete-onboarding', preferences);
    if (response?.data?.data) {
      // Update stored user with new preferences
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response?.data;
  },

  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<{ user: User }>> {
    if (USE_MOCK_SERVICE) {
      return await mockAuthService.updatePreferences(preferences);
    }
    
    const response = await api.patch('/users/preferences', preferences);
    if (response?.data?.data) {
      // Update stored user with new preferences
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response?.data;
  },
};

export default authService;
