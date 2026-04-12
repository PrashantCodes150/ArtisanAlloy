import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Loader2,
  Package,
  Truck,
  MapPin,
  CreditCard,
  User
} from 'lucide-react';
import api from '../../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  user: { firstName: string; lastName: string; email: string; phone?: string };
  items: Array<{ name: string; quantity: number; price: number; totalPrice: number; image: string }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  payment: { method: string; status: string; transactionId?: string; paidAt?: string };
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  statusHistory: Array<{ status: string; timestamp: string; note?: string }>;
  tracking?: { carrier?: string; trackingNumber?: string; trackingUrl?: string };
  createdAt: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingInfo, setTrackingInfo] = useState({ carrier: '', trackingNumber: '', trackingUrl: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data.order);
      if (response.data.data.order.tracking) {
        setTrackingInfo(response.data.data.order.tracking);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      const payload: any = { status };
      if (status === 'shipped' && trackingInfo.trackingNumber) {
        payload.trackingNumber = trackingInfo.trackingNumber;
        payload.carrier = trackingInfo.carrier;
        payload.trackingUrl = trackingInfo.trackingUrl;
      }
      await api.patch(`/orders/${id}/status`, payload);
      fetchOrder();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
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

  if (error || !order) {
    return (
      <div className="glass rounded-xl p-6 text-center">
        <p className="text-red-400">{error || 'Order not found'}</p>
        <Link to="/admin/orders" className="mt-4 text-jewelry-gold hover:underline inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/orders')} className="p-2 rounded-lg hover:bg-jewelry-gold/10">
          <ArrowLeft className="w-6 h-6 text-jewelry-cream" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-jewelry-gold">
            Order #{order.orderNumber}
          </h1>
          <p className="text-jewelry-cream/60 font-sans text-sm">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg text-jewelry-cream mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-jewelry-gold" /> Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-lg bg-jewelry-dark-light/50">
                  <div className="w-16 h-16 rounded-lg bg-jewelry-dark overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-jewelry-gold/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-jewelry-cream font-medium">{item.name}</p>
                    <p className="text-jewelry-cream/60 text-sm">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                  </div>
                  <p className="text-jewelry-gold font-medium">₹{item.totalPrice.toLocaleString()}</p>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-jewelry-gold/20 space-y-2 font-sans">
              <div className="flex justify-between text-jewelry-cream/70">
                <span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-jewelry-cream/70">
                <span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-jewelry-cream/70">
                <span>Tax</span><span>₹{order.tax.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span><span>-₹{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-jewelry-gold font-display text-lg pt-2 border-t border-jewelry-gold/20">
                <span>Total</span><span>₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg text-jewelry-cream mb-4">Update Status</h2>
            {order.status === 'confirmed' || order.status === 'processing' ? (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    placeholder="Carrier (e.g., Delhivery)"
                    value={trackingInfo.carrier}
                    onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream text-sm"
                  />
                  <input
                    placeholder="Tracking Number"
                    value={trackingInfo.trackingNumber}
                    onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream text-sm"
                  />
                  <input
                    placeholder="Tracking URL"
                    value={trackingInfo.trackingUrl}
                    onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingUrl: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream text-sm"
                  />
                </div>
                <button
                  onClick={() => updateStatus('shipped')}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-500/30"
                >
                  <Truck className="w-5 h-5" />
                  {isUpdating ? 'Updating...' : 'Mark as Shipped'}
                </button>
              </div>
            ) : order.status === 'shipped' ? (
              <button
                onClick={() => updateStatus('delivered')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-400/30 hover:bg-green-500/30"
              >
                {isUpdating ? 'Updating...' : 'Mark as Delivered'}
              </button>
            ) : (
              <p className="text-jewelry-cream/50 text-sm">No actions available for this status.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg text-jewelry-cream mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-jewelry-gold" /> Customer
            </h2>
            <div className="space-y-2 font-sans text-sm">
              <p className="text-jewelry-cream">{order.user.firstName} {order.user.lastName}</p>
              <p className="text-jewelry-cream/70">{order.user.email}</p>
              {order.user.phone && <p className="text-jewelry-cream/70">{order.user.phone}</p>}
            </div>
          </div>

          {/* Shipping */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg text-jewelry-cream mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-jewelry-gold" /> Shipping Address
            </h2>
            <div className="font-sans text-sm text-jewelry-cream/80 space-y-1">
              <p className="text-jewelry-cream font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg text-jewelry-cream mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-jewelry-gold" /> Payment
            </h2>
            <div className="font-sans text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-jewelry-cream/70">Method</span>
                <span className="text-jewelry-cream capitalize">{order.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-jewelry-cream/70">Status</span>
                <span className={order.payment.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}>
                  {order.payment.status}
                </span>
              </div>
              {order.payment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-jewelry-cream/70">Transaction</span>
                  <span className="text-jewelry-cream text-xs">{order.payment.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tracking */}
          {order.tracking?.trackingNumber && (
            <div className="glass rounded-xl p-6">
              <h2 className="font-display text-lg text-jewelry-cream mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-jewelry-gold" /> Tracking
              </h2>
              <div className="font-sans text-sm space-y-2">
                <p className="text-jewelry-cream">{order.tracking.carrier}</p>
                <p className="text-jewelry-cream/70">{order.tracking.trackingNumber}</p>
                {order.tracking.trackingUrl && (
                  <a href={order.tracking.trackingUrl} target="_blank" className="text-jewelry-gold hover:underline">
                    Track Package →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
