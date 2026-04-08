import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context';
import { useAuthToast } from '../utils/authToast';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  redirectTo = '/login-required' 
}) => {
  const { isAuthenticated } = useAuth();
  const { showLoginRequired } = useAuthToast();

  if (!isAuthenticated) {
    showLoginRequired();
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;