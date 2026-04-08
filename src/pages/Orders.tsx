import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context';
import orderService from '../services/order.service';
import type { Order } from '../services/order.service';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  processing: 'bg-purple-500/20 text-purple-400',
  shipped: 'bg-cyan-500/20 text-cyan-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login-required', { state: { from: { pathname: '/orders' } } });
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        if (response.data?.orders) setOrders(response.data.orders);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div className="pt-32 min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-jewelry-gold animate-spin" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-jewelry-gold/30 mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold text-jewelry-gold mb-4">No Orders Yet</h1>
          <p className="font-sans text-jewelry-cream/70 mb-8">Start shopping to see your orders here.</p>
          <Link to="/collection" className="inline-block px-8 py-4 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-8">My Orders</h1>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-sans text-jewelry-cream/60 text-sm">Order #{order.orderNumber}</p>
                  <p className="font-sans text-jewelry-cream/60 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-sans capitalize ${statusColors[order.status]}`}>{order.status}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-jewelry-dark">
                      <img src={item.image || '/placeholder.svg'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 3 && <div className="w-12 h-12 rounded-lg bg-jewelry-dark-light border-2 border-jewelry-dark flex items-center justify-center"><span className="font-sans text-jewelry-cream text-xs">+{order.items.length - 3}</span></div>}
                </div>
                <div className="flex-1">
                  <p className="font-sans text-jewelry-cream">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <p className="font-sans text-jewelry-gold font-semibold">₹{order.total.toLocaleString()}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-jewelry-cream/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
