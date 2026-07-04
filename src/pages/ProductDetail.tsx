import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, Loader2, ChevronLeft, ChevronRight, Share } from 'lucide-react';
import { useCart, useWishlist, useAuth } from '../context';
import { useAuthToast } from '../utils/authToast';
import { products } from '../data/products';
import SEO from '../components/SEO';
import TrustBadges from '../components/TrustBadges';
import RecentlyViewedSection, { addToRecentlyViewed } from '../components/RecentlyViewed';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, isLoading: cartLoading } = useCart();
  const { isInWishlist, toggleWishlist, isLoading: wishlistLoading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showLoginRequired } = useAuthToast();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Find product by slug after component mounts
  useEffect(() => {
    const foundProduct = products.find(p => p.slug === slug);
    setProduct(foundProduct);

    // Set loading to false after product is found/set
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0); // Use a timeout to move this to the next tick

    return () => clearTimeout(timer);
  }, [slug]);

  // Create an array with the product image as the first image, followed by advertisement images
  const adModelImages = product
    ? [
      product.image || '/placeholder.svg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_5jf6il5jf6il5jf6.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_f0f99mf0f99mf0f9.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_gkqygagkqygagkqy.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_n7g0vnn7g0vnn7g0.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_plqbh4plqbh4plqb.jpg'
    ]
    : [
      '/placeholder.svg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_5jf6il5jf6il5jf6.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_f0f99mf0f99mf0f9.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_gkqygagkqygagkqy.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_n7g0vnn7g0vnn7g0.jpg',
      '/assets/images/advertismnet_models/Gemini_Generated_Image_plqbh4plqbh4plqb.jpg'
    ];

  // Auto-scroll functionality - only if we have multiple images and product exists
  useEffect(() => {
    if (!product || adModelImages.length <= 1) return; // Don't auto-scroll if there's no product or only one image

    const interval = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % adModelImages.length);
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [product, adModelImages.length]);

  // Scroll functions for gallery
  const scrollLeft = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Track recently viewed products
  useEffect(() => {
    if (product) {
      addToRecentlyViewed({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product?.image || '/placeholder.svg',
      });
    }
  }, [product]);

  if (loading || !product) {
    if (!product && !loading) {
      // Product not found after loading
      return (
        <div className="pt-24 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-jewelry-cream mb-4">Product Not Found</h1>
            <Link to="/collection" className="text-jewelry-gold hover:underline">Browse Collection</Link>
          </div>
        </div>
      );
    }
    // Still loading
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-jewelry-gold animate-spin" />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showLoginRequired();
      return;
    }

    if (!product) {
      console.error('Product not available');
      return;
    }

    try {
      await addToCart(product.id, quantity, product.price);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      showLoginRequired();
      return;
    }

    if (!product) {
      console.error('Product not available');
      return;
    }

    try {
      await toggleWishlist(product.id);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const maxQuantity = 10; // Default to 10 if no stock limit

  return (
    <div className="pt-24 min-h-screen bg-gradient-jewelry-dark">
      <SEO
        title={`${product?.name || 'Product'} - Luxury Jewelry | ArtisanAlloy`}
        description={product?.description || `Buy ${product?.name || 'this product'} at ArtisanAlloy. Premium handcrafted jewelry with excellent craftsmanship.`}
        keywords={`${product?.name || ''}, jewelry, luxury jewelry, ${product?.category || ''}, ${product?.type || ''}, ${product?.metalType || ''}, ${product?.birthstone || ''}`}
      />

      {/* Back Button - Positioned between navbar and product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-start">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-jewelry-gold hover:text-jewelry-gold-light transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images - Using Advertisement Model Images */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="aspect-square rounded-2xl overflow-hidden glass relative">
              {/* Navigation Arrows */}
              {adModelImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : adModelImages.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-jewelry-dark/70 backdrop-blur-sm text-jewelry-cream hover:bg-jewelry-gold/20 transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev < adModelImages.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-jewelry-dark/70 backdrop-blur-sm text-jewelry-cream hover:bg-jewelry-gold/20 transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <img
                src={adModelImages[selectedImage] || '/placeholder.svg'}
                alt={product?.name || 'Product'}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>

            {/* Thumbnail Gallery - Horizontal Scrollable */}
            <div className="relative">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" ref={galleryRef}>
                {adModelImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden glass transition-all flex-shrink-0 ${selectedImage === index ? 'ring-2 ring-jewelry-gold scale-105' : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product?.name || 'Product'} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Scroll Indicators */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1">
                <button
                  onClick={scrollLeft}
                  className="p-1.5 rounded-full bg-jewelry-dark/70 backdrop-blur-sm text-jewelry-cream hover:bg-jewelry-gold/20 transition-colors"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollRight}
                  className="p-1.5 rounded-full bg-jewelry-dark/70 backdrop-blur-sm text-jewelry-cream hover:bg-jewelry-gold/20 transition-colors"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-4xl font-bold text-jewelry-cream mb-2">{product?.name || 'Product'}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product?.rating || 4)
                        ? 'fill-jewelry-gold text-jewelry-gold'
                        : 'text-jewelry-gold/30'
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-jewelry-cream/70">({product?.reviews || 12})</span>
                </div>
                <span className="text-jewelry-rose line-through text-jewelry-cream/50">
                  {product?.originalPrice ? `₹${product.originalPrice.toLocaleString()}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-jewelry-gold">₹{product?.price?.toLocaleString() || '0'}</span>
                {product?.originalPrice && (
                  <span className="text-lg text-green-400">
                    {product?.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) + '% OFF' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="prose prose-invert max-w-none">
              <h3 className="font-sans text-lg font-semibold text-jewelry-gold">Description</h3>
              <p className="font-sans text-jewelry-cream/80">{product?.description || 'No description available'}</p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-sans text-sm text-jewelry-cream/60">Occasion</h4>
                <p className="font-sans text-jewelry-cream">{product?.occasion?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-sans text-sm text-jewelry-cream/60">Personality</h4>
                <p className="font-sans text-jewelry-cream">{product?.personality?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-sans text-sm text-jewelry-cream/60">Material</h4>
                <p className="font-sans text-jewelry-cream">{product?.material?.join(', ') || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-sans text-sm text-jewelry-cream/60">Keywords</h4>
                <p className="font-sans text-jewelry-cream">{product?.keywords?.join(', ') || 'N/A'}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h4 className="font-sans text-sm text-jewelry-cream/60 mb-2">Quantity</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))}
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-jewelry-gold/10 transition-colors"
                >
                  <Minus className="w-5 h-5 text-jewelry-cream" />
                </button>
                <span className="w-16 text-center font-sans text-lg text-jewelry-cream">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, Number(q) + 1))} // Default to 10 max quantity
                  className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-jewelry-gold/10 transition-colors"
                >
                  <Plus className="w-5 h-5 text-jewelry-cream" />
                </button>
              </div>
              <p className="font-sans text-sm text-jewelry-cream/60 mt-2">
                {product?.inStock ? 'In stock' : 'Out of stock'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="flex-1 py-4 rounded-xl bg-gradient-gold text-jewelry-dark font-sans font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all disabled:opacity-50"
              >
                {cartLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : addedToCart ? (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading || !product}
                className="px-6 py-4 rounded-xl glass border border-jewelry-gold/30 text-jewelry-cream flex items-center justify-center gap-2 hover:bg-jewelry-gold/10 transition-colors disabled:opacity-50"
              >
                <Heart
                  className={`w-5 h-5 ${product && isInWishlist(product.id) ? 'fill-jewelry-rose text-jewelry-rose' : 'text-jewelry-cream'
                    }`}
                />
                {product && isInWishlist(product.id) ? 'Saved' : 'Save'}
              </button>

              <button className="px-6 py-4 rounded-xl glass border border-jewelry-gold/30 text-jewelry-cream flex items-center justify-center gap-2 hover:bg-jewelry-gold/10 transition-colors">
                <Share className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-jewelry-gold/20">
              <TrustBadges variant="horizontal" />
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-jewelry-gold/20">
            <nav className="-mb-px flex space-x-8">
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-jewelry-gold font-sans font-medium text-jewelry-cream">
                Details
              </button>
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-sans font-medium text-jewelry-cream/60 hover:text-jewelry-cream hover:border-jewelry-gold/50">
                Reviews
              </button>
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-sans font-medium text-jewelry-cream/60 hover:text-jewelry-cream hover:border-jewelry-gold/50">
                Shipping
              </button>
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-sans font-medium text-jewelry-cream/60 hover:text-jewelry-cream hover:border-jewelry-gold/50">
                Returns
              </button>
            </nav>
          </div>

          <div className="py-8">
            <h3 className="font-display text-2xl font-bold text-jewelry-cream mb-4">Product Details</h3>
            <div className="prose prose-invert max-w-none">
              <p className="font-sans text-jewelry-cream/80">{product?.description || 'No description available'}</p>

              <h4 className="font-sans text-lg font-semibold text-jewelry-gold">Features</h4>
              <ul className="font-sans text-jewelry-cream/80 list-disc pl-5 space-y-2">
                <li>Premium quality materials</li>
                <li>Handcrafted by skilled artisans</li>
                <li>Durable and long-lasting</li>
                <li>Perfect for special occasions</li>
              </ul>

              <h4 className="font-sans text-lg font-semibold text-jewelry-gold mt-6">Care Instructions</h4>
              <p className="font-sans text-jewelry-cream/80">
                To maintain the beauty of your jewelry, clean with a soft cloth and store in a dry place.
                Avoid contact with chemicals and perfumes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Section */}
      <RecentlyViewedSection excludeProductId={product?.id} />
    </div>
  );
};

export default ProductDetail;