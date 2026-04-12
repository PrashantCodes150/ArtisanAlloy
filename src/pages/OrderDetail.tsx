import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  CheckCircle,
  Truck,
  ArrowLeft,
  Download,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context';
import { toast } from 'react-toastify';
import axios from 'axios';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  metal?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login-required');
      return;
    }

    if (!id) {
      navigate('/orders');
      return;
    }

    fetchOrderDetails();
  }, [id, isAuthenticated, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/orders/${id}`, {
        withCredentials: true
      });
      setOrder(response.data.data?.order || null);
    } catch (error: any) {
      console.error('Failed to fetch order details:', error);
      toast.error(error.response?.data?.message || 'Failed to load order details');
      navigate('/orders');
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

  if (!order) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-jewelry-cream mb-4">
            Order not found
          </h2>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-jewelry-gold text-jewelry-dark rounded-lg font-sans font-medium"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'shipped', label: 'Shipped', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    const status = order.status.toLowerCase();
    if (status === 'cancelled') return -1;
    const index = statusSteps.findIndex(step => step.key === status);
    return index >= 0 ? index : 0;
  };

  const currentStep = getCurrentStepIndex();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-jewelry-cream/60 hover:text-jewelry-cream mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-jewelry-cream mb-2">
                Order #{order.orderNumber}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="font-sans text-jewelry-cream/60 text-sm">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Invoice
              </button>
              <button className="px-4 py-2 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Help
              </button>
            </div>
          </div>
        </motion.div>

        {/* Order Tracking */}
        {order.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <h2 className="font-display text-xl text-jewelry-cream mb-6">Order Tracking</h2>

            <div className="relative">
              <div className="absolute left-6 top-6 bottom-0 w-0.5 bg-jewelry-gold/20"></div>

              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index <= currentStep;
                const isCurrentStep = index === currentStep;

                return (
                  <div key={step.key} className="relative flex items-center mb-8 last:mb-0">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${isActive
                      ? 'bg-jewelry-gold text-jewelry-dark'
                      : 'bg-jewelry-dark-light text-jewelry-cream/50'
                      }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="ml-4">
                      <p className={`font-sans font-medium ${isActive ? 'text-jewelry-cream' : 'text-jewelry-cream/50'
                        }`}>
                        {step.label}
                      </p>
                      {isCurrentStep && order.status !== 'delivered' && (
                        <p className="font-sans text-jewelry-cream/60 text-sm mt-1">
                          Currently processing...
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-jewelry-dark-light rounded-lg">
                <p className="font-sans text-jewelry-cream/60 text-sm">Tracking Number</p>
                <p className="font-sans text-jewelry-cream font-mono">{order.trackingNumber}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="font-display text-xl text-jewelry-cream mb-6">Order Items</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 bg-jewelry-dark-light rounded-lg">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-jewelry-dark">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-sans text-jewelry-cream font-medium">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="font-sans text-jewelry-cream/60 text-sm">
                      Qty: {item.quantity}
                    </span>
                    {item.size && (
                      <span className="font-sans text-jewelry-cream/60 text-sm">
                        Size: {item.size}
                      </span>
                    )}
                    {item.metal && (
                      <span className="font-sans text-jewelry-cream/60 text-sm">
                        Metal: {item.metal}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-sans text-jewelry-gold font-semibold">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="font-sans text-jewelry-cream/60 text-sm">
                    ₹{item.price.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="font-display text-xl text-jewelry-cream mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>

            <div className="space-y-2">
              <p className="font-sans text-jewelry-cream font-medium">
                {order.shippingAddress.fullName}
              </p>
              <p className="font-sans text-jewelry-cream/60">
                {order.shippingAddress.addressLine1}
              </p>
              <p className="font-sans text-jewelry-cream/60">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="font-sans text-jewelry-cream/60">
                {order.shippingAddress.country}
              </p>
              <p className="font-sans text-jewelry-cream/60">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="font-display text-xl text-jewelry-cream mb-6">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between font-sans text-jewelry-cream/60">
                <span>Subtotal</span>
                <span>₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-sans text-jewelry-cream/60">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-sans text-jewelry-cream/60">
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="pt-3 border-t border-jewelry-gold/20">
                <div className="flex justify-between font-sans text-jewelry-cream font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-jewelry-gold">₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-jewelry-gold/20">
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-jewelry-cream/60">Payment Method</span>
                  <span className="text-jewelry-cream capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-sans text-sm mt-1">
                  <span className="text-jewelry-cream/60">Payment Status</span>
                  <span className={`capitalize ${order.paymentStatus === 'paid'
                    ? 'text-green-400'
                    : 'text-yellow-400'
                    }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;