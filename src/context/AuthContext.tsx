import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import type { User, LoginCredentials, RegisterData } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  authModalView: 'login' | 'signup';
  login: (credentials: LoginCredentials) => Promise<User | null>;
  register: (data: RegisterData) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
  openAuthModal: (view?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  completeOnboarding: (preferences: any) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize from localStorage synchronously to prevent flash
    return authService.getStoredUser();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');

  // Verify token on mount (optional - only if backend is running)
  useEffect(() => {
    const verifyAuth = async () => {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        try {
          const response = await authService.getMe();
          if (response.data?.user) {
            setUser(response.data.user);
          }
        } catch (err) {
          // Token expired or backend not running - keep local user for now
          console.log('Auth verification skipped - backend may not be running');
        }
      }
    };

    verifyAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    console.log('🔐 Login attempt:', credentials.email);
    try {
      const response = await authService.login(credentials);
      console.log('✅ Login response:', response);
      if (response.data?.user) {
        setUser(response.data.user);
        console.log('👤 User set in context:', response.data.user);
        return response.data.user;
      }
      return null;
    } catch (err: any) {
      console.error('❌ Login error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    console.log('🔐 Register attempt:', data.email);
    try {
      const response = await authService.register(data);
      console.log('✅ Register response:', response);
      if (response.data?.user) {
        setUser(response.data.user);
        console.log('👤 User set in context:', response.data.user);
        return response.data.user;
      }
      return null;
    } catch (err: any) {
      console.error('❌ Register error:', err);
      const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      // Clear all tokens and user data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tempToken');
      setUser(null);
    } catch (err) {
      // Logout locally even if API fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('tempToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const openAuthModal = useCallback((view: 'login' | 'signup' = 'login') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const completeOnboarding = useCallback(async (preferences: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.completeOnboarding(preferences);
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to complete onboarding.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (preferences: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.updatePreferences(preferences);
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to update preferences.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isAuthModalOpen,
    authModalView,
    login,
    register,
    logout,
    updateUser,
    clearError,
    openAuthModal,
    closeAuthModal,
    completeOnboarding,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
