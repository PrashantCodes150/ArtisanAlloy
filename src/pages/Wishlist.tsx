import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Share2 } from 'lucide-react';
import { useWishlist, useCart } from '../context';
import { products } from '../data/products';
import WishlistShare from '../components/WishlistShare';
import React from 'react';

const Wishlist = () => {
  const { effectiveWishlist, removeFromWishlist, itemCount, isLoading } = useWishlist();
  const { addToCart } = useCart();
  const [showShareModal, setShowShareModal] = React.useState(false);

  // Get wishlist products from effective state
  const wishlistProducts = effectiveWishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is any => Boolean(p));

  const handleAddToCart = async (productId: string, price: number) => {
    try {
      await addToCart(productId, 1, price);
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="w-24 h-24 text-jewelry-gold/30 mx-auto mb-6" />
          <h1 className="font-display text-4xl font-bold text-jewelry-gold mb-4">Your Wishlist is Empty</h1>
          <p className="font-sans text-jewelry-cream/70 mb-8">
            Save your favorite items here to buy them later.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300"
          >
            Explore Collection
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 min-h-screen px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            My Wishlist ({itemCount} items)
          </h1>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass-light hover:bg-jewelry-gold/10 transition-colors"
          >
            <Share2 className="w-5 h-5 text-jewelry-cream" />
            <span className="font-sans text-jewelry-cream hidden sm:inline">Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => {
            if (!product) return null;

            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-jewelry-gold/20 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-jewelry-dark-light">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark via-transparent opacity-60"></div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={isLoading}
                    className="absolute top-4 right-4 p-2 rounded-full glass-light text-jewelry-rose hover:bg-jewelry-rose/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-green-500/80 text-white text-xs font-sans">
                      {discount}% OFF
                    </div>
                  )}

                  {/* Stock Status */}
                  {!product.inStock && (
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-red-500/80 text-white text-xs font-sans">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-display text-lg text-jewelry-cream mb-2 group-hover:text-jewelry-gold transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-sans text-jewelry-gold text-xl font-semibold">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="font-sans text-jewelry-cream/50 line-through text-sm">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id, product.price)}
                    disabled={isLoading || !product.inStock}
                    className="w-full py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 transition-all"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Wishlist Share Modal */}
      {showShareModal && (
        <WishlistShare
          wishlistId="current-user-wishlist"
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default Wishlist;
