import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  user: { firstName: string; lastName: string; email: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  payment: { method: string; status: string };
  createdAt: string;
  shippingAddress: { city: string; state: string };
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = `/orders?page=${page}&limit=${limit}&sort=-createdAt`;
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      const response = await api.get(url);
      setOrders(response.data.data.orders);
      setTotal(response.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
      confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      processing: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
      shipped: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      delivered: 'text-green-400 bg-green-400/10 border-green-400/30',
      cancelled: 'text-red-400 bg-red-400/10 border-red-400/30',
      refunded: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10 border-gray-400/30';
  };

  const totalPages = Math.ceil(total / limit);

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(query) ||
      order.user?.email?.toLowerCase().includes(query) ||
      `${order.user?.firstName} ${order.user?.lastName}`.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-jewelry-gold">Orders</h1>
          <p className="text-jewelry-cream/60 font-sans mt-1">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-jewelry-cream/50" />
          <input
            type="text"
            placeholder="Search by order #, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-jewelry-cream/50" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-jewelry-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchOrders} className="mt-4 text-jewelry-gold hover:underline">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-jewelry-cream/60 text-sm font-sans bg-jewelry-dark-light/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-sans">
                  {filteredOrders.map((order) => {
                    return (
                      <tr key={order._id} className="border-t border-jewelry-gold/10 hover:bg-jewelry-gold/5">
                        <td className="p-4">
                          <span className="text-jewelry-gold font-medium">#{order.orderNumber}</span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-jewelry-cream">
                              {order.user?.firstName} {order.user?.lastName}
                            </p>
                            <p className="text-jewelry-cream/50 text-sm">{order.user?.email}</p>
                          </div>
                        </td>
                        <td className="p-4 text-jewelry-cream">
                          {order.items?.length || 0} items
                        </td>
                        <td className="p-4 text-jewelry-cream font-medium">
                          ₹{order.total?.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-jewelry-cream capitalize">{order.payment?.method}</p>
                            <p className={`text-sm capitalize ${
                              order.payment?.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {order.payment?.status}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`px-3 py-1 rounded-lg border text-sm font-medium cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-jewelry-cream/70 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-4">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="p-2 rounded-lg hover:bg-jewelry-gold/10 text-jewelry-gold inline-flex"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-jewelry-cream/50">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-jewelry-gold/10">
                <p className="text-jewelry-cream/60 text-sm font-sans">
                  Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} orders
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream disabled:opacity-50 disabled:cursor-not-allowed hover:bg-jewelry-gold/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-jewelry-cream font-sans px-4">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream disabled:opacity-50 disabled:cursor-not-allowed hover:bg-jewelry-gold/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersManagement;
