import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, GitBranch, Star, Heart, ShoppingCart, ArrowUpDown, Check } from 'lucide-react';
import { useCart, useWishlist, useAuth } from '../context';
import { useAuthToast } from '../utils/authToast';
import { toast } from 'react-toastify';
import { products, type Product } from '../data/products';

interface CompareProduct extends Product {
  addToCart?: (product: Product) => void;
  isInWishlist?: (productId: string) => boolean;
  toggleWishlist?: (productId: string) => void;
}

interface ComparisonFeature {
  name: string;
  key: keyof Product;
  importance: 'high' | 'medium' | 'low';
}

const comparisonFeatures: ComparisonFeature[] = [
  { name: 'Price', key: 'price', importance: 'high' },
  { name: 'Rating', key: 'rating', importance: 'high' },
  { name: 'Reviews', key: 'reviews', importance: 'medium' },
  { name: 'Material', key: 'material', importance: 'high' },
  { name: 'Occasion', key: 'occasion', importance: 'medium' },
  { name: 'Personality', key: 'personality', importance: 'medium' },
  { name: 'Style', key: 'viral', importance: 'low' },
  { name: 'Gifting', key: 'gifting', importance: 'low' },
];

export default function ProductComparison() {
  const { addToCart } = useCart();
  const { isInWishlist: isInWishlistLocal, toggleWishlist: toggleWishlistLocal } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showLoginRequired } = useAuthToast();

  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareProducts, setCompareProducts] = useState<CompareProduct[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [showDifferenceOnly, setShowDifferenceOnly] = useState(false);

  useEffect(() => {
    // Get comparison list from localStorage
    const saved = localStorage.getItem('compareList');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompareList(parsed);
    }
  }, []);

  useEffect(() => {
    // Fetch comparison products data
    const productsToCompare = products.filter(product =>
      compareList.includes(product.id)
    );

    const enhancedProducts: CompareProduct[] = productsToCompare.map(product => ({
      ...product,
      addToCart: () => {
        if (!isAuthenticated) {
          showLoginRequired();
          return;
        }
        addToCart(product.id, 1, product.price);
        toast.success(`${product.name} added to cart!`);
      },
      isInWishlist: isInWishlistLocal,
      toggleWishlist: (productId: string) => {
        if (!isAuthenticated) {
          showLoginRequired();
          return;
        }
        toggleWishlistLocal(productId);
      }
    }));

    setCompareProducts(prevProducts => {
      // Only update if the products have actually changed
      const currentIds = prevProducts.map(p => p.id);
      const newIds = enhancedProducts.map(p => p.id);

      if (JSON.stringify(currentIds) !== JSON.stringify(newIds)) {
        return enhancedProducts;
      }
      return prevProducts;
    });
  }, [compareList, addToCart, isInWishlistLocal, toggleWishlistLocal]);

  useEffect(() => {
    // Save comparison list to localStorage
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(id => id !== productId));
    toast.success('Product removed from comparison');
  };

  const clearComparison = () => {
    setCompareList([]);
    setCompareProducts([]);
    toast.success('Comparison cleared');
  };

  const sortProducts = (key: string) => {
    setSortBy(key);

    const sorted = [...compareProducts];
    switch (key) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep original order
        break;
    }

    setCompareProducts(sorted);
  };

  const renderFeatureValue = (product: CompareProduct, feature: ComparisonFeature) => {
    const value = product[feature.key];

    switch (feature.key) {
      case 'price':
        return (
          <div className="text-center">
            <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-sm text-green-600">
                Save ₹{(product.originalPrice - product.price).toLocaleString()}
              </div>
            )}
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
          </div>
        );

      case 'material':
      case 'occasion':
      case 'personality':
      case 'viral':
      case 'gifting':
        const arrayValue = value as string[];
        return (
          <div className="space-y-1">
            {arrayValue.map((item, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mr-1 mb-1"
              >
                {item.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        );

      case 'reviews':
        return (
          <div className="text-center">
            <span className="text-lg font-medium">{product.reviews}</span>
            <div className="text-sm text-gray-600">reviews</div>
          </div>
        );

      default:
        return <span className="text-gray-400">-</span>;
    }
  };

  const getBestProduct = (feature: keyof Product) => {
    if (feature === 'price') {
      return compareProducts.reduce((best, current) =>
        current.price < best.price ? current : best
      );
    }
    if (feature === 'rating') {
      return compareProducts.reduce((best, current) =>
        current.rating > best.rating ? current : best
      );
    }
    return null;
  };

  if (compareProducts.length === 0) {
    return (
      <div className="pt-24 min-h-screen px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products to Compare</h2>
          <p className="text-gray-600 mb-6">
            Add products to comparison list to see detailed comparisons
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Comparison</h1>
              <p className="text-gray-600">
                Comparing {compareProducts.length} product{compareProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {compareProducts.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDifferenceOnly(!showDifferenceOnly)}
                    className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showDifferenceOnly
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    {showDifferenceOnly ? 'Show All' : 'Show Differences'}
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => sortProducts(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="default">Sort by Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              )}

              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {/* Feature Labels Row */}
            <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
              <div className="p-4 font-medium text-gray-700">Feature</div>
              {compareProducts.map((product) => (
                <div key={product.id} className="p-4 text-center">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                    />
                    <div className="absolute top-0 right-0">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            {comparisonFeatures.map((feature) => {
              const bestProduct = showDifferenceOnly ? getBestProduct(feature.key) : null;

              return (
                <div key={feature.name} className="grid grid-cols-5 border-b border-gray-200">
                  <div className="p-4 font-medium text-gray-700 flex items-center">
                    {feature.name}
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${feature.importance === 'high' ? 'bg-red-100 text-red-700' :
                      feature.importance === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {feature.importance}
                    </span>
                  </div>

                  {compareProducts.map((product) => {
                    const isBest = bestProduct && bestProduct.id === product.id;
                    const shouldHighlight = showDifferenceOnly && isBest;

                    return (
                      <div
                        key={product.id}
                        className={`p-4 text-center border-l border-gray-200 ${shouldHighlight ? 'bg-green-50' : ''
                          }`}
                      >
                        {renderFeatureValue(product, feature)}

                        {shouldHighlight && (
                          <div className="mt-2">
                            <Check className="w-5 h-5 text-green-600 mx-auto" />
                            <span className="text-xs text-green-600 font-medium">Best</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Actions Row */}
            <div className="grid grid-cols-5 bg-gray-50 border-t border-gray-200">
              <div className="p-4 font-medium text-gray-700">Actions</div>
              {compareProducts.map((product) => (
                <div key={product.id} className="p-4 space-y-2">
                  <button
                    onClick={() => product.addToCart?.(product)}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={() => product.toggleWishlist?.(product.id)}
                    className={`w-full py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${product.isInWishlist?.(product.id)
                      ? 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                      : 'bg-pink-100 text-pink-700 border-pink-300 hover:bg-pink-200'
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${product.isInWishlist?.(product.id) ? 'fill-current' : ''
                        }`}
                    />
                    {product.isInWishlist?.(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Add Section */}
        {compareProducts.length < 4 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900">Compare More Products</h3>
                <p className="text-blue-700">Add up to {4 - compareProducts.length} more products</p>
              </div>

              <Link
                to="/collection"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}