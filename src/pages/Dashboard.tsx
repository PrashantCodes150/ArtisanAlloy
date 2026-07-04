import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Heart,
  MapPin,
  TrendingUp,
  Clock,
  ShoppingBag,
  Star,
  User,
  Crown,
  Sparkles,
  Settings
} from 'lucide-react';
import { useAuth } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  wishlistItems: number;
  savedAddresses: number;
  recentOrders: any[];
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    wishlistItems: 0,
    savedAddresses: 0,
    recentOrders: []
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login-required');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, wishlistRes, userRes] = await Promise.all([
        axios.get('/api/v1/orders', { withCredentials: true }),
        axios.get('/api/v1/wishlist', { withCredentials: true }),
        axios.get('/api/v1/users/me', { withCredentials: true })
      ]);

      const orders = ordersRes.data.data?.orders || [];
      const activeOrders = orders.filter((order: any) =>
        !['delivered', 'cancelled'].includes(order.status)
      ).length;

      setStats({
        totalOrders: orders.length,
        activeOrders,
        wishlistItems: wishlistRes.data.data?.length || 0,
        savedAddresses: userRes.data.data?.user?.addresses?.length || 0,
        recentOrders: orders.slice(0, 5)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jewelry-gold"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: Package,
      color: 'from-blue-500 to-purple-600',
      href: '/orders'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      href: '/orders/active'
    },
    {
      title: 'Wishlist Items',
      value: stats.wishlistItems,
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      href: '/wishlist'
    },
    {
      title: 'Saved Addresses',
      value: stats.savedAddresses,
      icon: MapPin,
      color: 'from-orange-500 to-yellow-600',
      href: '/addresses'
    }
  ];

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="font-sans text-jewelry-cream/60">
            Here's an overview of your ArtisanAlloy account
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(stat.href)}
                className="glass rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-jewelry-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-jewelry-cream">
                  {stat.value}
                </h3>
                <p className="font-sans text-jewelry-cream/60 text-sm">
                  {stat.title}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 mb-8 border border-jewelry-gold/10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-jewelry-gold" />
              </div>
              <div>
                <h2 className="font-display text-2xl text-jewelry-cream">Your Personal Style</h2>
                <p className="font-sans text-jewelry-cream/60 text-sm">Tailored recommendations based on your unique taste</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/edit-preferences')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-jewelry-gold/30 text-jewelry-gold hover:bg-jewelry-gold hover:text-jewelry-dark transition-all duration-300 font-sans font-medium"
            >
              <Settings className="w-4 h-4" />
              Edit Preferences
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-widest text-jewelry-gold/60 font-bold">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {user?.preferences?.categories?.length ? (
                  user.preferences.categories.map((cat: string) => (
                    <span key={cat} className="px-3 py-1 rounded-full bg-jewelry-dark-light text-jewelry-cream/80 text-xs border border-jewelry-gold/10 capitalize">
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-jewelry-cream/40 text-xs italic">No categories selected</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-widest text-jewelry-gold/60 font-bold">Design Styles</h3>
              <div className="flex flex-wrap gap-2">
                {user?.preferences?.designStyles?.length ? (
                  user.preferences.designStyles.map((style: string) => (
                    <span key={style} className="px-3 py-1 rounded-full bg-jewelry-dark-light text-jewelry-cream/80 text-xs border border-jewelry-gold/10 capitalize">
                      {style}
                    </span>
                  ))
                ) : (
                  <span className="text-jewelry-cream/40 text-xs italic">No styles selected</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-widest text-jewelry-gold/60 font-bold">Metal Types</h3>
              <div className="flex flex-wrap gap-2">
                {user?.preferences?.metalTypes?.length ? (
                  user.preferences.metalTypes.map((metal: string) => (
                    <span key={metal} className="px-3 py-1 rounded-full bg-jewelry-dark-light text-jewelry-cream/80 text-xs border border-jewelry-gold/10 capitalize">
                      {metal}
                    </span>
                  ))
                ) : (
                  <span className="text-jewelry-cream/40 text-xs italic">No metals selected</span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-sans uppercase tracking-widest text-jewelry-gold/60 font-bold">Astrology</h3>
              <div className="flex flex-col gap-2">
                {user?.preferences?.astrology?.sunSign || user?.preferences?.astrology?.birthMonth ? (
                  <>
                    {user.preferences.astrology.sunSign && (
                      <div className="flex items-center gap-2 text-jewelry-cream/80 text-sm">
                        <Sparkles className="w-3.5 h-3.5 text-jewelry-gold" />
                        <span className="capitalize">{user.preferences.astrology.sunSign}</span>
                      </div>
                    )}
                    {user.preferences.astrology.birthMonth && (
                      <div className="flex items-center gap-2 text-jewelry-cream/80 text-sm">
                        <Star className="w-3.5 h-3.5 text-jewelry-gold" />
                        <span className="capitalize">{user.preferences.astrology.birthMonth}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-jewelry-cream/40 text-xs italic">Celestial data not set</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-jewelry-cream">Recent Orders</h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-jewelry-gold hover:text-jewelry-gold-light font-sans text-sm"
                >
                  View All
                </button>
              </div>

              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-jewelry-cream/20 mx-auto mb-4" />
                  <p className="font-sans text-jewelry-cream/60">No orders yet</p>
                  <button
                    onClick={() => navigate('/collection')}
                    className="mt-4 px-6 py-2 bg-jewelry-gold text-jewelry-dark rounded-lg font-sans font-medium hover:bg-jewelry-gold-light"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentOrders.map((order: any) => (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="flex items-center justify-between p-4 bg-jewelry-dark-light rounded-lg cursor-pointer hover:bg-jewelry-gold/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-jewelry-gold/20 flex items-center justify-center">
                          <Package className="w-6 h-6 text-jewelry-gold" />
                        </div>
                        <div>
                          <p className="font-sans text-jewelry-cream font-medium">
                            Order #{order._id?.slice(-8).toUpperCase()}
                          </p>
                          <p className="font-sans text-jewelry-cream/60 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-jewelry-cream font-semibold">
                          ₹{order.totalAmount}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : order.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-xl text-jewelry-cream mb-6">Quick Actions</h2>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-jewelry-gold/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-sans text-jewelry-cream font-medium">Edit Profile</p>
                    <p className="font-sans text-jewelry-cream/60 text-xs">Update your information</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/addresses')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-jewelry-gold/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-sans text-jewelry-cream font-medium">Manage Addresses</p>
                    <p className="font-sans text-jewelry-cream/60 text-xs">Delivery locations</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-jewelry-gold/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="font-sans text-jewelry-cream font-medium">View Wishlist</p>
                    <p className="font-sans text-jewelry-cream/60 text-xs">Saved items</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/feedback')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-jewelry-gold/10 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-sans text-jewelry-cream font-medium">Send Feedback</p>
                    <p className="font-sans text-jewelry-cream/60 text-xs">Help us improve</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;