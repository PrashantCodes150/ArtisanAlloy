import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import type { User, LoginCredentials, RegisterData } from '../services/auth.service';

// ============================================
// CONTEXT TYPE
// ============================================

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

// ============================================
// PROVIDER
// ============================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const hasToken = authService.isAuthenticated();

      if (storedUser && hasToken) {
        try {
          // Verify token is still valid
          const response = await authService.getMe();
          if (response.data?.user) {
            setUser(response.data.user);
          } else {
            // Token invalid, clear storage
            authService.clearTokens();
          }
        } catch (err) {
          console.warn('Auth verification failed:', authService.getErrorMessage(err));
          // Keep user in UI but token might be expired - will be caught on next API call
        }
      } else {
        // No valid auth, clear everything
        authService.clearTokens();
      }

      setIsInitialized(true);
    };

    initAuth();
  }, []);

  // ============================================
  // AUTH ACTIONS
  // ============================================

  const login = useCallback(async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      if (response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }

      throw new Error('Login failed: No user data returned');
    } catch (err: any) {
      const message = authService.getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);

      if (response.data?.user) {
        setUser(response.data.user);
        return response.data.user;
      }

      throw new Error('Registration failed: No user data returned');
    } catch (err: any) {
      const message = authService.getErrorMessage(err);
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
    } catch (err) {
      console.warn('Logout API failed, clearing locally anyway');
    } finally {
      authService.clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const clearError = useCallback(() => setError(null), []);

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
      const message = authService.getErrorMessage(err);
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
      const message = authService.getErrorMessage(err);
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // CONTEXT VALUE
  // ============================================

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

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-jewelry-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-jewelry-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-jewelry-cream/60">Loading...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
