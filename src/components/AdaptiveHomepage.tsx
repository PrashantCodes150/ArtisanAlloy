import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  Calendar,
  Gem,
  Eye,
  ShoppingCart
} from 'lucide-react';
import { useEnhancedAuth } from '../context/EnhancedAuthContext';
import { recommendationEngine } from '../services/recommend.engine';
import { products } from '../data/products';
import type { RecommendationScore } from '../services/recommend.engine';

interface HomePageSection {
  id: string;
  title: string;
  subtitle: string;
  products: RecommendationScore[];
  icon: React.ComponentType<any>;
}

const AdaptiveHomepage: React.FC = () => {
  const { user, isAuthenticated, isFirstTimeUser } = useEnhancedAuth();
  const [sections, setSections] = useState<HomePageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePersonalizedSections = () => {
      if (!isAuthenticated || !user?.preferences.onboardingCompleted) {
        return getDefaultSections();
      }

      const personalizedSections: HomePageSection[] = [];

      // Section 1: Top Picks For You (based on all preferences)
      const topPicks = recommendationEngine.getPersonalizedRecommendations(
        products,
        user.preferences,
        8
      );
      personalizedSections.push({
        id: 'top-picks',
        title: 'Top Picks For You',
        subtitle: 'Based on your preferences and astrology',
        products: topPicks,
        icon: Star
      });

      // Section 2: Recommended Metals
      if (user.preferences.metalTypes.length > 0) {
        const metalProducts = products.filter(product => 
          user.preferences.metalTypes.includes(product.metalType)
        );
        const metalRecommendations = recommendationEngine.getCategoryRecommendations(
          metalProducts,
          user.preferences.metalTypes,
          6
        );
        personalizedSections.push({
          id: 'recommended-metals',
          title: `Your Favorite ${user.preferences.metalTypes.slice(0, 2).join(' & ')} Jewellery`,
          subtitle: 'Handpicked based on your metal preferences',
          products: metalRecommendations,
          icon: Gem
        });
      }

      // Section 3: Your Design Style
      if (user.preferences.designStyles.length > 0) {
        const styleProducts = products.filter(product => 
          user.preferences.designStyles.includes(product.designStyle)
        );
        const styleRecommendations = recommendationEngine.getCategoryRecommendations(
          styleProducts,
          user.preferences.designStyles,
          6
        );
        personalizedSections.push({
          id: 'your-design-style',
          title: `${user.preferences.designStyles[0]} Style Collection`,
          subtitle: `Curated ${user.preferences.designStyles[0]} pieces for you`,
          products: styleRecommendations,
          icon: Sparkles
        });
      }

      // Section 4: Astrology Based
      if (user.preferences.astrology.sunSign || user.preferences.astrology.birthStone) {
        const astroProducts = recommendationEngine.getAstrologyRecommendations(
          products,
          user.preferences.astrology,
          6
        );
        personalizedSections.push({
          id: 'astrology-based',
          title: `${user.preferences.astrology.birthStone || user.preferences.astrology.sunSign} Collection`,
          subtitle: `Astrologically recommended for ${user.preferences.astrology.sunSign || 'you'}`,
          products: astroProducts,
          icon: Calendar
        });
      }

      // Section 5: Trending (always included)
      const trending = recommendationEngine.getTrendingRecommendations(products, 8);
      personalizedSections.push({
        id: 'trending',
        title: 'Trending Now',
        subtitle: 'Popular pieces this season',
        products: trending,
        icon: TrendingUp
      });

      // Section 6: Based on Your Categories
      if (user.preferences.categories.length > 0) {
        const categoryProducts = products.filter(product => 
          user.preferences.categories.includes(product.category)
        );
        const categoryRecommendations = recommendationEngine.getCategoryRecommendations(
          categoryProducts,
          user.preferences.categories,
          8
        );
        personalizedSections.push({
          id: 'category-based',
          title: `${user.preferences.categories[0]} Jewellery`,
          subtitle: `More ${user.preferences.categories[0]} pieces you might like`,
          products: categoryRecommendations,
          icon: Eye
        });
      }

      return personalizedSections;
    };

    const getDefaultSections = () => {
      return [
        {
          id: 'trending',
          title: 'Trending Now',
          subtitle: 'Popular pieces this season',
          products: recommendationEngine.getTrendingRecommendations(products, 8),
          icon: TrendingUp
        },
        {
          id: 'featured',
          title: 'Featured Collections',
          subtitle: 'Handpicked by our experts',
          products: products.slice(0, 8).map((product, index) => ({
            productId: product.id,
            score: 80 - index * 5, // Decreasing scores for featured items
            reasons: ['Featured Collection']
          })),
          icon: Star
        },
        {
          id: 'new-arrivals',
          title: 'New Arrivals',
          subtitle: 'Fresh designs just launched',
          products: products.slice(-8).map((product, index) => ({
            productId: product.id,
            score: 75 - index * 3,
            reasons: ['New Arrival']
          })),
          icon: Sparkles
        }
      ];
    };

    setTimeout(() => {
      const generatedSections = generatePersonalizedSections();
      setSections(generatedSections);
      setLoading(false);
    }, 1000);
  }, [user, isAuthenticated]);

  const renderProductCard = (score: RecommendationScore, index: number) => {
    const product = products.find(p => p.id === score.productId);
    if (!product) return null;

    return (
      <motion.div
        key={score.productId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group glass rounded-xl overflow-hidden hover:shadow-xl hover:shadow-jewelry-gold/20 transition-all duration-300"
      >
        <div className="relative aspect-widescreen overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          {/* Score indicator */}
          {score.score > 70 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-jewelry-gold rounded-full">
              <span className="text-xs font-bold text-jewelry-dark">
                {Math.round(score.score)}% Match
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <button className="absolute top-2 right-2 p-2 bg-jewelry-dark/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-4 h-4 text-jewelry-cream" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-display text-lg font-bold text-jewelry-cream mb-2 line-clamp-2 group-hover:text-jewelry-gold transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-jewelry-gold text-jewelry-gold'
                      : 'text-jewelry-gold/30'
                  }`}
                />
              ))}
              <span className="text-sm text-jewelry-cream/70 ml-1">
                ({product.rating})
              </span>
            </div>
            
            <div className="text-right">
              <span className="font-display text-xl text-jewelry-gold font-bold">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-jewelry-cream/50 line-through ml-2">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Recommendation reasons */}
          {score.reasons.length > 0 && (
            <div className="space-y-1 mb-3">
              {score.reasons.slice(0, 2).map((reason, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-jewelry-cream/60">
                  <div className="w-1.5 h-1.5 bg-jewelry-gold rounded-full"></div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          )}

          <button className="w-full py-2 bg-gradient-gold text-jewelry-dark font-sans font-semibold rounded-lg hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all duration-300 flex items-center justify-center gap-2 group">
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add to Cart
          </button>
        </div>
      </motion.div>
    );
  };

  const renderSection = (section: HomePageSection, sectionIndex: number) => {
    const IconComponent = section.icon;
    
    return (
      <motion.section
        key={section.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: sectionIndex * 0.2, duration: 0.6 }}
        className="mb-12"
      >
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-jewelry-gold to-jewelry-rose flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-jewelry-dark" />
          </div>
          
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold text-jewelry-cream mb-1">
              {section.title}
            </h2>
            <p className="text-jewelry-cream/70 font-sans">
              {section.subtitle}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {section.products.map((productScore, index) => 
            renderProductCard(productScore, index)
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 border border-jewelry-gold/30 text-jewelry-gold font-sans font-semibold rounded-lg hover:bg-jewelry-gold/10 transition-all">
            View All {section.title.split(' ')[0]} Items
          </button>
        </div>
      </motion.section>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-jewelry-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-jewelry-cream font-sans">Personalizing your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Message */}
        {isAuthenticated && user?.preferences.onboardingCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-jewelry-cream mb-4">
              Welcome back, {user.firstName}! ✨
            </h1>
            <p className="text-jewelry-cream/80 font-sans text-lg">
              We've curated some beautiful pieces based on your preferences
            </p>
          </motion.div>
        )}

        {/* Personalized Sections */}
        {sections.map((section, index) => 
          renderSection(section, index)
        )}
      </div>
    </div>
  );
};

export default AdaptiveHomepage;