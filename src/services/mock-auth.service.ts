import type { User, LoginCredentials, RegisterData, AuthResponse } from './auth.service';
import type { ApiResponse } from './api';

// Mock user preferences
const defaultPreferences = {
  categories: [],
  bodyParts: [],
  metalTypes: [],
  designStyles: [],
  astrology: {
    sunSign: '',
    birthMonth: '',
    birthStone: '',
    nakshatra: '',
  },
  onboardingCompleted: false,
  onboardingCompletedAt: undefined,
  lastUpdated: new Date(),
};

// Mock user data for testing
const mockUsers: User[] = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    avatar: '',
    role: 'customer',
    isEmailVerified: true,
    addresses: [],
    preferences: { ...defaultPreferences },
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2', 
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    avatar: '',
    role: 'customer',
    isEmailVerified: true,
    addresses: [],
    preferences: { ...defaultPreferences },
    createdAt: new Date().toISOString(),
  }
];

// Generate mock tokens
const generateMockTokens = () => ({
  accessToken: `mock-access-token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
  refreshToken: `mock-refresh-token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
});

const mockAuthService = {
  // Register new user
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      _id: (mockUsers.length + 1).toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      avatar: '',
      role: 'customer',
      isEmailVerified: false,
      addresses: [],
      preferences: { ...defaultPreferences },
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    
    const tokens = generateMockTokens();
    const authResponse = {
      user: newUser,
      ...tokens,
      isFirstTimeUser: true,
    };

    // Store in localStorage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    return {
      status: 'success',
      message: 'Registration successful',
      data: authResponse,
    };
  },

  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // In a real app, you'd verify password here
    // For mock, we'll accept any password for existing users
    
    const tokens = generateMockTokens();
    const authResponse = {
      user,
      ...tokens,
      isFirstTimeUser: !user.preferences.onboardingCompleted,
    };

    // Store in localStorage
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      status: 'success',
      message: 'Login successful',
      data: authResponse,
    };
  },

  // Logout user
  async logout(): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  async getMe(): Promise<ApiResponse<{ user: User }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('No user found');
    }

    const user = JSON.parse(userStr);
    
    return {
      status: 'success',
      data: { user },
    };
  },

  // Update password
  async updatePassword(currentPassword: string, newPassword: string, newPasswordConfirm: string): Promise<ApiResponse<AuthResponse>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (newPassword !== newPasswordConfirm) {
      throw new Error('New passwords do not match');
    }

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not found');
    }

    const user = JSON.parse(userStr);
    const tokens = generateMockTokens();
    
    const authResponse: AuthResponse = {
      user,
      ...tokens,
    };

    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return {
      status: 'success',
      message: 'Password updated successfully',
      data: authResponse,
    };
  },

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('User with this email does not exist');
    }

    return {
      status: 'success',
      message: 'Password reset email sent',
    };
  },

  // Reset password
  async resetPassword(token: string, password: string, passwordConfirm: string): Promise<ApiResponse<AuthResponse>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (password !== passwordConfirm) {
      throw new Error('Passwords do not match');
    }

    // In a real app, you'd verify the token and find the user
    // For mock, we'll just return success
    const user = mockUsers[0]; // Mock user
    const tokens = generateMockTokens();
    
    const authResponse: AuthResponse = {
      user,
      ...tokens,
    };

    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      status: 'success',
      message: 'Password reset successful',
      data: authResponse,
    };
  },

  // Verify email
  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: 'success',
      message: 'Email verified successfully',
    };
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<ApiResponse<null>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: 'success',
      message: 'Verification email sent',
    };
  },

  // Helper methods (same as original)
  setTokens(data: AuthResponse): void {
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
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },

  // Mock refresh token
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAccessToken = `mock-refreshed-access-token-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('accessToken', newAccessToken);
    
    return {
      status: 'success',
      data: { accessToken: newAccessToken },
    };
  },

  // Mock verification status
  async getVerificationStatus(): Promise<ApiResponse<{ isEmailVerified: boolean; email: string; twoFactorEnabled: boolean }>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      status: 'success',
      data: {
        isEmailVerified: user?.isEmailVerified || false,
        email: user?.email || '',
        twoFactorEnabled: false,
      },
    };
  },

  // Complete onboarding
  async completeOnboarding(preferences: any): Promise<ApiResponse<{ user: User }>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not found');
    }

    const user = JSON.parse(userStr);
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        lastUpdated: new Date(),
      }
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    return {
      status: 'success',
      message: 'Onboarding completed successfully!',
      data: { user: updatedUser },
    };
  },

  // Update preferences
  async updatePreferences(preferences: any): Promise<ApiResponse<{ user: User }>> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User not found');
    }

    const user = JSON.parse(userStr);
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
        lastUpdated: new Date(),
      }
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    return {
      status: 'success',
      message: 'Preferences updated successfully',
      data: { user: updatedUser },
    };
  },

  // Mock 2FA methods (return not implemented)
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; secret: string; backupCodes: string[] }>> {
    throw new Error('Two-factor authentication not implemented in mock mode');
  },

  async verifyTwoFactorSetup(token: string): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> {
    throw new Error('Two-factor authentication not implemented in mock mode');
  },

  async disableTwoFactor(password: string): Promise<ApiResponse<{ twoFactorEnabled: boolean }>> {
    throw new Error('Two-factor authentication not implemented in mock mode');
  },

  async generateBackupCodes(password: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    throw new Error('Two-factor authentication not implemented in mock mode');
  },

  async verifyTwoFactorLogin(tempToken: string, twoFactorToken?: string, backupCode?: string): Promise<ApiResponse<AuthResponse>> {
    throw new Error('Two-factor authentication not implemented in mock mode');
  },
};

export default mockAuthService;