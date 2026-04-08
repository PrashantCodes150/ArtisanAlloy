import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart, useWishlist, useAuth } from '../context';
import { useAuthToast } from '../utils/authToast';
import LazyImage from './LazyImage';

interface ProductCardProps {
  product: any; // Using any for now, but in a real app you'd have a Product type
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showLoginRequired } = useAuthToast();
  const [addingToCart, setAddingToCart] = React.useState(false);

  const handleAddToCart = async () => {
    const productId = product._id || product.id;
    if (!isAuthenticated) {
      showLoginRequired();
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(productId, 1);
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      // Show user-friendly error message
      if (err.message) {
        // You could add a toast notification here
        console.error('Cart error:', err.message);
      }
    } finally {
      setTimeout(() => setAddingToCart(false), 1000);
    }
  };

  const handleWishlistToggle = () => {
    const productId = product._id || product.id;
    if (!isAuthenticated) {
      showLoginRequired();
      return;
    }
    toggleWishlist(productId);
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-jewelry-gold/20 transition-all duration-500 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-72 overflow-hidden bg-jewelry-dark-light video-like-image">
        <LazyImage
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-[20s] ease-in-out ${product.name.length % 3 === 0 ? 'ken-burns-effect' :
            product.name.length % 3 === 1 ? 'slow-pan' :
              'subtle-zoom'
            }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark via-transparent opacity-60 z-10 pointer-events-none"></div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 left-4 p-2 rounded-full glass-light hover:bg-jewelry-rose/30 transition-all z-20 ${isInWishlist(product._id || product.id) ? 'bg-jewelry-rose/20' : ''}`}
        >
          <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product._id || product.id) ? 'fill-jewelry-rose text-jewelry-rose' : 'text-jewelry-cream hover:text-jewelry-rose'}`} />
        </button>

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-jewelry-rose/80 text-white text-xs font-sans z-20">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
          <div className="flex gap-3">
            <Link
              to={`/product/${product.slug}`}
              className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans text-center hover:bg-jewelry-gold/10 transition-all duration-300"
            >
              View Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className={`px-4 py-3 rounded-lg font-sans transition-all duration-300 ${addingToCart ? 'bg-green-500 text-white' : 'bg-gradient-gold text-jewelry-dark hover:shadow-lg hover:shadow-jewelry-gold/30'}`}
            >
              {addingToCart ? '✓' : <ShoppingCart className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-lg text-jewelry-cream mb-2 group-hover:text-jewelry-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-jewelry-gold text-jewelry-gold' : 'text-jewelry-gold/30'}`}
            />
          ))}
          <span className="font-sans text-xs text-jewelry-cream/50 ml-1">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-sans text-jewelry-gold text-xl font-semibold">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="font-sans text-jewelry-cream/50 line-through text-sm">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;