import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OnboardingPage from '../pages/OnboardingPage';

const OnboardingGuard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login-required" replace />;
  }

  // Check if user has completed onboarding
  if (user?.preferences?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OnboardingPage />;
};

export default OnboardingGuard;