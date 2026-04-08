import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  Package, 
  MapPin, 
  CreditCard, 
  MessageSquare, 
  HelpCircle, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context';
import { toast } from 'react-toastify';

interface ProfileMenuProps {
  user?: any;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const menuItems = [
    {
      label: 'User Dashboard',
      icon: User,
      href: '/dashboard',
      description: 'Account overview and statistics'
    },
    {
      label: 'My Profile',
      icon: User,
      href: '/profile',
      description: 'Personal information and settings'
    },
    {
      label: 'Liked Items',
      icon: Heart,
      href: '/wishlist',
      description: 'Products you\'ve saved for later'
    },
    {
      label: 'Order History',
      icon: Package,
      href: '/orders',
      description: 'View all your orders'
    },
    {
      label: 'Orders Placed',
      icon: Package,
      href: '/orders/active',
      description: 'Active and pending orders'
    },
    {
      label: 'Addresses',
      icon: MapPin,
      href: '/addresses',
      description: 'Manage delivery addresses'
    },
    {
      label: 'Payment Methods',
      icon: CreditCard,
      href: '/payment-methods',
      description: 'Saved payment options'
    },
    {
      label: 'Feedback',
      icon: MessageSquare,
      href: '/feedback',
      description: 'Send us your feedback'
    },
    {
      label: 'Help',
      icon: HelpCircle,
      href: '/help',
      description: 'Get help and support'
    },
    {
      label: 'Logout',
      icon: LogOut,
      action: handleLogout,
      description: 'Sign out of your account'
    }
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-jewelry-gold/10 transition-colors"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-jewelry-gold to-jewelry-rose flex items-center justify-center">
            <span className="text-jewelry-dark font-semibold text-sm">
              {getInitials(user?.firstName, user?.lastName)}
            </span>
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-jewelry-cream transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-xl z-50 border border-jewelry-gold/20">
          {/* User Info Header */}
          <div className="p-6 border-b border-jewelry-gold/20">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-jewelry-gold to-jewelry-rose flex items-center justify-center">
                  <span className="text-jewelry-dark font-semibold">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-sans font-semibold text-jewelry-cream">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="font-sans text-sm text-jewelry-cream/60">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 max-h-96 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isLogout = item.label === 'Logout';
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.href) {
                      navigate(item.href);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                    isLogout 
                      ? 'text-red-400 hover:bg-red-500/10' 
                      : 'text-jewelry-cream hover:bg-jewelry-gold/10'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isLogout ? 'text-red-400' : 'text-jewelry-gold'}`} />
                  <div className="flex-1 text-left">
                    <p className="font-sans font-medium text-sm">{item.label}</p>
                    <p className="font-sans text-xs opacity-60">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;