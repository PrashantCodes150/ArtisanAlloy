import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Loader2, CheckCircle, Shield, AlertCircle } from 'lucide-react';
import { useCart, useAuth } from '../context';
import orderService from '../services/order.service';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, subtotal, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [address, setAddress] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('razorpay');

  const discount = cart?.discount || 0;
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shippingCost + tax - discount;

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = async () => {
      try {
        // Check if already loaded
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.setAttribute('data-no-service-worker', 'true'); // Prevent service worker interference

        const loadPromise = new Promise<boolean>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Razorpay script loading timeout'));
          }, 10000);

          script.onload = () => {
            clearTimeout(timeout);
            if (window.Razorpay) {
              setRazorpayLoaded(true);
              console.log('Razorpay SDK loaded successfully');
              resolve(true);
            } else {
              reject(new Error('Razorpay SDK not available after load'));
            }
          };

          script.onerror = (error) => {
            clearTimeout(timeout);
            console.error('Failed to load Razorpay SDK:', error);
            setRazorpayLoaded(false);
            reject(error);
          };
        });

        // Add script to document head (better than body for loading order)
        document.head.appendChild(script);
        await loadPromise;
      } catch (error) {
        console.error('Error loading Razorpay:', error);
        setRazorpayLoaded(false);
        setError('Payment system failed to load. Please refresh the page.');
      }
    };

    loadRazorpayScript();

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src*="razorpay"]');
      if (existingScript && !window.Razorpay) {
        existingScript.remove();
      }
    };
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode'];
    for (const field of required) {
      if (!address[field as keyof typeof address]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(address.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit Indian phone number');
      return false;
    }

    // Validate postal code
    if (!/^\d{6}$/.test(address.postalCode)) {
      setError('Please enter a valid 6-digit PIN code');
      return false;
    }

    setError('');
    return true;
  };

  const handleRazorpayPayment = async (orderId: string) => {
    // Double-check that Razorpay SDK is loaded
    if (!window.Razorpay) {
      setIsLoading(false);
      setError('Payment system is not ready. Please refresh the page and try again.');
      return;
    }

    console.log('Starting Razorpay payment for order:', orderId);

    try {
      // Create Razorpay order
      const razorpayResponse = await orderService.createRazorpayOrder(orderId);

      if (!razorpayResponse.data?.razorpayOrderId) {
        throw new Error('Failed to create payment order');
      }

      const { razorpayOrderId, razorpayKeyId, amount, prefill } = razorpayResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: Math.round(amount * 100), // Amount in paise (rounded to nearest integer)
        currency: 'INR',
        name: 'ArtisanAlloy',
        description: `Order Payment`,
        order_id: razorpayOrderId,
        prefill: {
          name: prefill?.name || address.fullName,
          email: prefill?.email || user?.email || '',
          contact: prefill?.contact || address.phone,
        },
        theme: {
          color: '#d4af37',
          backdrop_color: 'rgba(26, 26, 46, 0.9)',
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await orderService.verifyPayment({
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse.status === 'success') {
              setPlacedOrder(verifyResponse.data?.order);
              setOrderPlaced(true);
              await clearCart();
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (verifyError: any) {
            setError(verifyError.response?.data?.message || 'Payment verification failed');
          } finally {
            setIsLoading(false);
          }
        },
      };

      // Check if Razorpay is properly loaded before creating instance
      if (!(window as any).Razorpay) {
        setIsLoading(false);
        setError('Payment gateway not loaded. Please refresh the page and try again.');
        return;
      }

      const razorpay = new (window as any).Razorpay(options);

      // Attach event handlers
      razorpay.on('payment.failed', (response: any) => {
        setIsLoading(false);
        setError(`Payment failed: ${response.error?.description || 'Unknown error'}. Please try again.`);
      });

      // Open the payment modal
      razorpay.open();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    if (!user) {
      setError('Please login to place an order');
      navigate('/login-required', { state: { from: '/checkout' } });
      return;
    }

    if (cart?.items?.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (paymentMethod === 'razorpay' && !razorpayLoaded) {
      setError('Payment system is loading. Please wait and try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create order first
      const response = await orderService.createOrder({
        shippingAddress: address,
        paymentMethod
      });

      if (!response.data?.order) {
        throw new Error('Failed to create order');
      }

      const order = response.data.order;

      if (paymentMethod === 'razorpay') {
        // Check if Razorpay is loaded before proceeding with payment
        if (!window.Razorpay) {
          setIsLoading(false);
          setError('Payment system is not ready. Please refresh the page and try again.');
          return;
        }
        // Proceed with Razorpay payment
        await handleRazorpayPayment(order._id);
      } else {
        // COD - Order is already confirmed
        setPlacedOrder(order);
        setOrderPlaced(true);
        await clearCart();
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  // Order Success View
  if (orderPlaced) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="text-center glass rounded-3xl p-12 max-w-md w-full">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-jewelry-gold mb-2">Order Placed!</h1>
          {placedOrder?.orderNumber && (
            <p className="font-sans text-jewelry-cream/70 mb-2">
              Order #{placedOrder.orderNumber}
            </p>
          )}
          <p className="font-sans text-jewelry-cream/70 mb-8">
            {paymentMethod === 'razorpay'
              ? 'Payment successful! Thank you for your order.'
              : 'Thank you for your order. Pay on delivery.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full py-4 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/collection')}
              className="w-full py-4 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans font-semibold hover:bg-jewelry-gold/10 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart check
  if (!cart || cart.items?.length === 0) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="text-center glass rounded-3xl p-12 max-w-md">
          <AlertCircle className="w-16 h-16 text-jewelry-gold/50 mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-jewelry-cream mb-4">Your Cart is Empty</h1>
          <p className="font-sans text-jewelry-cream/70 mb-8">Add some beautiful jewelry to your cart first.</p>
          <button
            onClick={() => navigate('/collection')}
            className="px-8 py-4 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold"
          >
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-8">
          Checkout
        </h1>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 font-sans">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-jewelry-gold" />
                </div>
                <h2 className="font-display text-2xl text-jewelry-cream">Shipping Address</h2>
              </div>

              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">Full Name *</label>
                    <input
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">Phone *</label>
                    <input
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">Address Line 1 *</label>
                  <input
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    placeholder="House/Flat No., Building Name, Street"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">Address Line 2</label>
                  <input
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                    placeholder="Landmark, Area (Optional)"
                    className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">City *</label>
                    <input
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">State *</label>
                    <select
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-jewelry-cream/60 mb-1 font-sans">PIN Code *</label>
                    <input
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleAddressChange}
                      placeholder="400001"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-jewelry-gold" />
                </div>
                <h2 className="font-display text-2xl text-jewelry-cream">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'razorpay'
                    ? 'border-jewelry-gold bg-jewelry-gold/10'
                    : 'border-jewelry-gold/30 hover:border-jewelry-gold/50'
                    }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-jewelry-gold' : 'border-jewelry-cream/50'
                      }`}
                  >
                    {paymentMethod === 'razorpay' && (
                      <div className="w-3 h-3 rounded-full bg-jewelry-gold" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-sans text-jewelry-cream font-medium">Pay Online</span>
                    <p className="text-sm text-jewelry-cream/60">Cards, UPI, Net Banking, Wallets</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Secure</span>
                  </div>
                </label>

                {/* COD Option */}
                <label
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod'
                    ? 'border-jewelry-gold bg-jewelry-gold/10'
                    : 'border-jewelry-gold/30 hover:border-jewelry-gold/50'
                    }`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-jewelry-gold' : 'border-jewelry-cream/50'
                      }`}
                  >
                    {paymentMethod === 'cod' && (
                      <div className="w-3 h-3 rounded-full bg-jewelry-gold" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-sans text-jewelry-cream font-medium">Cash on Delivery</span>
                    <p className="text-sm text-jewelry-cream/60">Pay when you receive</p>
                  </div>
                </label>
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-400 font-medium">Secure Payment</p>
                  <p className="text-xs text-green-400/70">Your payment information is encrypted and secure. We never store your card details.</p>
                </div>
              </div>
            </div>

            {/* Place Order Button - Mobile */}
            <div className="lg:hidden">
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-gold text-jewelry-dark font-sans font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentMethod === 'razorpay' ? 'Processing...' : 'Placing Order...'}
                  </>
                ) : (
                  <>
                    {paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'} - ₹{total.toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="font-display text-xl text-jewelry-gold mb-6">Order Summary</h3>

              {/* Cart Items Preview */}
              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {cart?.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-jewelry-dark-light flex items-center justify-center overflow-hidden">
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-jewelry-gold text-xs">💎</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-jewelry-cream truncate">{item.product?.name || 'Product'}</p>
                      <p className="text-xs text-jewelry-cream/60">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-jewelry-cream">₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-jewelry-gold/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-jewelry-cream/70">Subtotal</span>
                  <span className="text-jewelry-cream">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-green-400">Discount</span>
                    <span className="text-green-400">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-jewelry-cream/70">Shipping</span>
                  <span className="text-jewelry-cream">
                    {shippingCost === 0 ? (
                      <span className="text-green-400">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-sans">
                  <span className="text-jewelry-cream/70">Tax (GST 18%)</span>
                  <span className="text-jewelry-cream">₹{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-jewelry-gold/20 pt-3 flex justify-between">
                  <span className="font-display text-lg text-jewelry-gold">Total</span>
                  <span className="font-display text-xl text-jewelry-gold">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order Button - Desktop */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="hidden lg:flex w-full mt-6 py-4 rounded-xl bg-gradient-gold text-jewelry-dark font-sans font-bold text-lg disabled:opacity-50 items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {paymentMethod === 'razorpay' ? 'Processing...' : 'Placing Order...'}
                  </>
                ) : (
                  paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'
                )}
              </button>

              {/* Free Shipping Note */}
              {subtotal < 999 && (
                <p className="mt-4 text-xs text-center text-jewelry-cream/60">
                  Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
