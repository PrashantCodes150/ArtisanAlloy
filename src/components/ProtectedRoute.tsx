import React from 'react';
import { useAuth } from '../context';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Lock, ArrowRight, Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jewelry-gold border-t-transparent"></div>
      </div>
    );
  }

  // If authenticated but not onboarded, redirect to onboarding
  if (isAuthenticated && user && !user.preferences?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // If not authenticated, show premium popup instead of hard redirect
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-jewelry-gold/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-jewelry-rose/10 rounded-full blur-[100px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass rounded-[2.5rem] p-10 text-center border border-jewelry-gold/20 relative"
        >
          <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-jewelry-gold/20">
            <Lock className="w-10 h-10 text-jewelry-dark" />
          </div>

          <h2 className="font-display text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-4">
            Members Only
          </h2>

          <p className="font-sans text-jewelry-cream/70 mb-8 leading-relaxed">
            Discover our exclusive collections and enjoy a personalized experience. Please sign in to access this feature.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => openAuthModal('login')}
              className="w-full py-4 rounded-2xl bg-gradient-gold text-jewelry-dark font-sans font-bold shadow-lg shadow-jewelry-gold/20 hover:shadow-jewelry-gold/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              Sign In to Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => openAuthModal('signup')}
              className="w-full py-4 rounded-2xl border border-jewelry-gold/30 text-jewelry-gold font-sans font-semibold hover:bg-jewelry-gold/10 transition-all"
            >
              Create Premium Account
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-jewelry-cream/40 uppercase tracking-widest font-medium">
            <Sparkles className="w-3 h-3" />
            Experience Excellence
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;