import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut, 
  X,
  ChevronRight,
  Star,
  Gem,
  Calendar,
  Phone
} from 'lucide-react';
import { useEnhancedAuth } from '../context/EnhancedAuthContext';
import { useNavigate } from 'react-router-dom';

interface UserProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useEnhancedAuth();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Profile Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-jewelry-dark border-l border-jewelry-gold/20 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-jewelry-gold/10 to-jewelry-rose/10 border-b border-jewelry-gold/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-jewelry-cream/60 hover:text-jewelry-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* User Avatar and Info */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-jewelry-gold to-jewelry-rose flex items-center justify-center shadow-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-jewelry-dark">
                      {getInitials(user.firstName, user.lastName)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-jewelry-cream">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-sm text-jewelry-cream/70">{user.email}</p>
                  {user.phone && (
                    <p className="text-sm text-jewelry-cream/70 flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {user.phone}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <span className="px-2 py-1 bg-jewelry-gold/20 rounded-full text-xs text-jewelry-gold">
                      {user.role}
                    </span>
                    {user.isEmailVerified && (
                      <span className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-400">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Saved Preferences */}
              {user.preferences.onboardingCompleted && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-jewelry-gold flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Your Preferences
                  </h3>
                  
                  <div className="space-y-3">
                    {user.preferences.categories.length > 0 && (
                      <div>
                        <p className="text-sm text-jewelry-cream/60 mb-2">Favorite Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.categories.slice(0, 3).map((category) => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-jewelry-gold/10 rounded-full text-xs text-jewelry-gold"
                            >
                              {category}
                            </span>
                          ))}
                          {user.preferences.categories.length > 3 && (
                            <span className="px-3 py-1 bg-jewelry-gold/10 rounded-full text-xs text-jewelry-gold">
                              +{user.preferences.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {user.preferences.metalTypes.length > 0 && (
                      <div>
                        <p className="text-sm text-jewelry-cream/60 mb-2">Preferred Metals</p>
                        <div className="flex flex-wrap gap-2">
                          {user.preferences.metalTypes.slice(0, 2).map((metal) => (
                            <span
                              key={metal}
                              className="px-3 py-1 bg-jewelry-gold/10 rounded-full text-xs text-jewelry-gold"
                            >
                              {metal}
                            </span>
                          ))}
                          {user.preferences.metalTypes.length > 2 && (
                            <span className="px-3 py-1 bg-jewelry-gold/10 rounded-full text-xs text-jewelry-gold">
                              +{user.preferences.metalTypes.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {user.preferences.astrology.sunSign && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-jewelry-gold" />
                          <span className="text-sm text-jewelry-cream/80">Zodiac:</span>
                        </div>
                        <span className="px-3 py-1 bg-jewelry-gold/10 rounded-full text-xs text-jewelry-gold">
                          {user.preferences.astrology.sunSign}
                        </span>
                        {user.preferences.astrology.birthStone && (
                          <span className="px-3 py-1 bg-jewelry-gold/10 rounded-full text-xs text-jewelry-gold">
                            {user.preferences.astrology.birthStone}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleNavigation('/edit-preferences')}
                    className="w-full py-2 px-4 border border-jewelry-gold/30 rounded-lg text-jewelry-gold text-sm font-sans hover:bg-jewelry-gold/10 transition-all"
                  >
                    Edit Preferences
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-jewelry-gold">Quick Actions</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation('/orders')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-jewelry-dark/50 hover:bg-jewelry-dark/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5 text-jewelry-gold group-hover:scale-110 transition-transform" />
                      <span className="text-jewelry-cream">Order History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jewelry-cream/60" />
                  </button>

                  <button
                    onClick={() => handleNavigation('/wishlist')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-jewelry-dark/50 hover:bg-jewelry-dark/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-jewelry-rose group-hover:scale-110 transition-transform" />
                      <span className="text-jewelry-cream">Wishlist</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jewelry-cream/60" />
                  </button>

                  <button
                    onClick={() => handleNavigation('/addresses')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-jewelry-dark/50 hover:bg-jewelry-dark/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-jewelry-gold group-hover:scale-110 transition-transform" />
                      <span className="text-jewelry-cream">Address Book</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jewelry-cream/60" />
                  </button>

                  <button
                    onClick={() => handleNavigation('/payment-methods')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-jewelry-dark/50 hover:bg-jewelry-dark/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-jewelry-gold group-hover:scale-110 transition-transform" />
                      <span className="text-jewelry-cream">Payment Methods</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jewelry-cream/60" />
                  </button>
                </div>
              </div>

              {/* Recommended Section */}
              {user.preferences.onboardingCompleted && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-jewelry-gold flex items-center gap-2">
                    <Gem className="w-5 h-5" />
                    Recommended For You
                  </h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleNavigation('/recommended')}
                      className="w-full p-3 rounded-lg bg-gradient-to-r from-jewelry-gold/10 to-jewelry-rose/10 border border-jewelry-gold/30 hover:from-jewelry-gold/20 hover:to-jewelry-rose/20 transition-all"
                    >
                      <p className="text-jewelry-gold font-semibold">Personalized Picks</p>
                      <p className="text-xs text-jewelry-cream/70 mt-1">
                        Based on your preferences and astrology
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-jewelry-gold">Account</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-jewelry-dark/50 hover:bg-jewelry-dark/70 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-jewelry-cream/60 group-hover:text-jewelry-gold transition-colors" />
                      <span className="text-jewelry-cream">Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jewelry-cream/60" />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-jewelry-rose/10 hover:bg-jewelry-rose/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5 text-jewelry-rose group-hover:scale-110 transition-transform" />
                      <span className="text-jewelry-rose">Logout</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-jewelry-cream/60" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfilePanel;