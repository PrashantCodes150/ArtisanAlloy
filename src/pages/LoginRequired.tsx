import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShoppingBag, Heart, ArrowRight, User, Mail } from 'lucide-react';
import { useAuth } from '../context';

const LoginRequired: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(-1); // Go back to previous page
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-jewelry-dark">
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center">

          {/* Left Side - Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-jewelry-gold to-jewelry-yellow mb-6 lg:mb-8"
              >
                <Lock className="w-10 h-10 text-jewelry-dark" />
              </motion.div>

              <h1 className="text-4xl lg:text-5xl font-display font-bold text-jewelry-cream mb-4">
                Login to Continue
              </h1>

              <p className="text-lg text-jewelry-cream/80 mb-8 leading-relaxed">
                Sign in or create your account to access your cart and wishlist.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              <motion.div
                className="flex items-center gap-3 text-jewelry-cream/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ShoppingBag className="w-5 h-5 text-jewelry-gold" />
                <span>Add items to your cart</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 text-jewelry-cream/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Heart className="w-5 h-5 text-jewelry-gold" />
                <span>Save favorites to your wishlist</span>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 text-jewelry-cream/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <User className="w-5 h-5 text-jewelry-gold" />
                <span>Track orders and manage account</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold text-lg hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
              >
                Login
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('signup')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-jewelry-gold text-jewelry-gold font-sans font-semibold text-lg hover:bg-jewelry-gold/10 transition-all"
              >
                <Mail className="w-5 h-5" />
                Create Account
              </motion.button>
            </div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-jewelry-gold/20 to-jewelry-yellow/20 rounded-3xl blur-3xl"></div>

              {/* Main Visual */}
              <div className="relative glass rounded-3xl p-8 border border-jewelry-gold/20">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jewelry-gold/10 mb-4">
                      <ShoppingBag className="w-8 h-8 text-jewelry-gold" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-jewelry-cream mb-2">
                      Premium Shopping
                    </h3>
                    <p className="text-jewelry-cream/70">
                      Get exclusive access to features
                    </p>
                  </div>

                  {/* Animated Icons */}
                  <div className="flex justify-center gap-4">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                      className="w-12 h-12 rounded-full bg-jewelry-rose/20 flex items-center justify-center"
                    >
                      <Heart className="w-6 h-6 text-jewelry-rose" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-12 h-12 rounded-full bg-jewelry-gold/20 flex items-center justify-center"
                    >
                      <Lock className="w-6 h-6 text-jewelry-gold" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="w-12 h-12 rounded-full bg-jewelry-blue/20 flex items-center justify-center"
                    >
                      <User className="w-6 h-6 text-jewelry-blue" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginRequired;