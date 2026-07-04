import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Eye,
  Loader2
} from 'lucide-react';
import api from '../../services/api';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  byStatus: Array<{ _id: string; count: number; totalRevenue: number }>;
  recentOrders: Array<any>;
  dailyStats: Array<{ _id: string; orders: number; revenue: number }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/orders/stats/overview');
      setStats(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400 bg-yellow-400/10',
      confirmed: 'text-blue-400 bg-blue-400/10',
      processing: 'text-purple-400 bg-purple-400/10',
      shipped: 'text-cyan-400 bg-cyan-400/10',
      delivered: 'text-green-400 bg-green-400/10',
      cancelled: 'text-red-400 bg-red-400/10',
      refunded: 'text-orange-400 bg-orange-400/10',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-jewelry-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchStats} className="mt-4 text-jewelry-gold hover:underline">
          Try Again
        </button>
      </div>
    );
  }

  const pendingOrders = stats?.byStatus.find(s => s._id === 'pending')?.count || 0;
  const deliveredOrders = stats?.byStatus.find(s => s._id === 'delivered')?.count || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-jewelry-gold">Dashboard</h1>
        <p className="text-jewelry-cream/60 font-sans mt-1">Welcome to ArtisanAlloy Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <span className="flex items-center text-green-400 text-sm font-sans">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </span>
          </div>
          <p className="text-jewelry-cream/60 text-sm font-sans">Total Revenue</p>
          <p className="text-2xl font-display font-bold text-jewelry-cream">
            ₹{(stats?.totalRevenue || 0).toLocaleString()}
          </p>
        </div>

        {/* Total Orders */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
            <span className="flex items-center text-blue-400 text-sm font-sans">
              <ArrowUpRight className="w-4 h-4" />
              8%
            </span>
          </div>
          <p className="text-jewelry-cream/60 text-sm font-sans">Total Orders</p>
          <p className="text-2xl font-display font-bold text-jewelry-cream">
            {stats?.totalOrders || 0}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <p className="text-jewelry-cream/60 text-sm font-sans">Pending Orders</p>
          <p className="text-2xl font-display font-bold text-jewelry-cream">
            {pendingOrders}
          </p>
        </div>

        {/* Delivered Orders */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-jewelry-cream/60 text-sm font-sans">Delivered</p>
          <p className="text-2xl font-display font-bold text-jewelry-cream">
            {deliveredOrders}
          </p>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-display text-xl text-jewelry-cream mb-4">Orders by Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((status) => {
            const statusData = stats?.byStatus.find(s => s._id === status);
            return (
              <div key={status} className={`rounded-lg p-4 ${getStatusColor(status)}`}>
                <p className="text-2xl font-bold">{statusData?.count || 0}</p>
                <p className="text-sm capitalize">{status}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-jewelry-cream">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-sm text-jewelry-gold hover:underline font-sans"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-jewelry-cream/60 text-sm font-sans border-b border-jewelry-gold/20">
                <th className="pb-3 pr-4">Order</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="font-sans">
              {stats?.recentOrders?.slice(0, 5).map((order: any) => (
                <tr key={order._id} className="border-b border-jewelry-gold/10">
                  <td className="py-4 pr-4">
                    <span className="text-jewelry-gold font-medium">#{order.orderNumber}</span>
                  </td>
                  <td className="py-4 pr-4 text-jewelry-cream">
                    {order.user?.firstName} {order.user?.lastName}
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-jewelry-cream">
                    ₹{order.total?.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-jewelry-gold hover:text-jewelry-gold/80"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-jewelry-cream/50">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
