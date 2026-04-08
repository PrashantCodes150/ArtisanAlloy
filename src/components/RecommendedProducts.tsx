import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useCart, useWishlist, useAuth } from '../context';
import { useAuthToast } from '../utils/authToast';
import { products } from '../data/products';

interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface RecommendedProductsProps {
  userId?: string;
  category?: string;
  limit?: number;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ 
  userId, 
  category, 
  limit = 4 
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showLoginRequired } = useAuthToast();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (productId: string, price: number) => {
    if (!isAuthenticated) {
      showLoginRequired();
      return;
    }
    addToCart(productId, 1, price);
  };

  const handleWishlistToggle = (productId: string) => {
    if (!isAuthenticated) {
      showLoginRequired();
      return;
    }
    toggleWishlist(productId);
  };

  useEffect(() => {
    // Simulate fetching recommended products based on user preferences
    const fetchRecommendedProducts = () => {
      // In a real app, this would come from an API call to the recommendation service
      // For now, we'll return trending products or products in the same category
      let filteredProducts = [...products];
      
      if (category) {
        filteredProducts = filteredProducts.filter(p => 
          p.occasion?.includes(category) || p.personality?.includes(category) || p.material?.includes(category)
        );
      }
      
      // Sort by rating and popularity
      filteredProducts.sort((a, b) => b.rating - a.rating);
      
      setRecommendedProducts(filteredProducts.slice(0, limit));
      setLoading(false);
    };

    fetchRecommendedProducts();
  }, [userId, category, limit]);

  if (loading || recommendedProducts.length === 0) {
    return null; // Don't show anything if loading or no recommendations
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-jewelry-dark to-jewelry-dark-deep">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-jewelry-cream mb-4">
            Recommended For <span className="bg-gradient-gold bg-clip-text text-transparent">You</span>
          </h2>
          <p className="font-sans text-jewelry-cream/70 max-w-2xl mx-auto">
            Based on your preferences and browsing history
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="group glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-jewelry-gold/20 transition-all duration-500 flex flex-col h-full">
              {/* Product Image */}
              <div className="relative h-72 overflow-hidden bg-jewelry-dark-light">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark via-transparent opacity-60"></div>

                {/* Wishlist Button */}
                <button
                  onClick={() => handleWishlistToggle(product.id)}
                  className={`absolute top-4 left-4 p-2 rounded-full glass-light hover:bg-jewelry-rose/30 transition-all ${isInWishlist(product.id) ? 'bg-jewelry-rose/20' : ''}`}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isInWishlist(product.id) ? 'fill-jewelry-rose text-jewelry-rose' : 'text-jewelry-cream hover:text-jewelry-rose'}`} />
                </button>

                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-jewelry-rose/80 text-white text-xs font-sans">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="flex gap-3">
                    <Link
                      to={`/product/${product.slug}`}
                      className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans text-center hover:bg-jewelry-gold/10 transition-all duration-300"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id, product.price)}
                      className="px-4 py-3 rounded-lg font-sans bg-gradient-gold text-jewelry-dark hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5" />
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedProducts;