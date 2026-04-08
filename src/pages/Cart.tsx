import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useCart, useAuth } from '../context';
import type { Product } from '../services/product.service';

const Cart = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { cart, effectiveItems: items, itemCount, subtotal, updateQuantity, removeItem, applyCoupon, removeCoupon, isLoading } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login');
    }
  };

  const discount = cart?.discount || 0;
  const shippingCost = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingCost - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message);
    }
  };

  const getProductData = (item: any): { name: string; image: string; price: number } => {
    if (typeof item.product === 'object') {
      const product = item.product as Product;
      return { name: product.name, image: product.images?.[0]?.url || '/placeholder.svg', price: product.price };
    }
    return { name: 'Product', image: '/placeholder.svg', price: item.price };
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-jewelry-gold/30 mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold text-jewelry-gold mb-4">Your Cart is Empty</h1>
          <p className="font-sans text-jewelry-cream/70 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/collection" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-8">Shopping Cart ({itemCount} items)</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const { name, image, price } = getProductData(item);
              return (
                <div key={item._id} className="glass rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg md:text-xl text-jewelry-cream mb-2 truncate">{name}</h3>
                    <p className="font-sans text-jewelry-gold text-xl font-semibold mb-4">₹{price.toLocaleString()}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-jewelry-dark-light rounded-lg p-1">
                        <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} disabled={isLoading || item.quantity <= 1} className="p-2 rounded hover:bg-jewelry-gold/10 text-jewelry-cream disabled:opacity-50"><Minus className="w-4 h-4" /></button>
                        <span className="font-sans text-jewelry-cream w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={isLoading} className="p-2 rounded hover:bg-jewelry-gold/10 text-jewelry-cream disabled:opacity-50"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeItem(item._id)} disabled={isLoading} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-jewelry-cream/60 text-sm">Total</p>
                    <p className="font-sans text-jewelry-gold text-xl font-semibold">₹{item.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h2 className="font-display text-2xl text-jewelry-gold mb-6">Order Summary</h2>
              {isAuthenticated && (
                <div className="mb-6">
                  {cart?.discountCode ? (
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-green-400" /><span className="font-sans text-green-400 text-sm">{cart.discountCode}</span></div>
                      <button onClick={() => removeCoupon()} className="text-green-400 hover:text-green-300"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon Code" className="flex-1 px-4 py-2 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans placeholder:text-jewelry-cream/40 focus:outline-none focus:border-jewelry-gold text-sm" />
                        <button onClick={handleApplyCoupon} disabled={isLoading} className="px-4 py-2 rounded-lg border border-jewelry-gold text-jewelry-gold font-sans text-sm hover:bg-jewelry-gold/10">Apply</button>
                      </div>
                      {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-sans text-jewelry-cream/70"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between font-sans text-green-400"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between font-sans text-jewelry-cream/70"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
                {subtotal < 999 && <p className="text-xs text-jewelry-gold/70">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!</p>}
                <div className="border-t border-jewelry-gold/20 pt-3 flex justify-between font-display text-xl text-jewelry-gold"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
              </div>
              {isAuthenticated ? (
                <Link to="/checkout" className="block w-full py-4 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold text-center hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all">
                  Proceed to Checkout
                </Link>
              ) : (
                <button onClick={handleCheckoutClick} className="block w-full py-4 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold text-center hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all">
                  Login to Checkout
                </button>
              )}
              <Link to="/collection" className="block w-full mt-4 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans text-center hover:bg-jewelry-gold/10">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Cart;
