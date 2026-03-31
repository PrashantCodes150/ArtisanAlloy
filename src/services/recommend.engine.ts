import type { UserPreferences } from '../types/user.types';

export interface RecommendationScore {
  productId: string;
  score: number;
  reasons: string[];
}

export interface RecommendationFilters {
  categories?: string[];
  bodyParts?: string[];
  metalTypes?: string[];
  designStyles?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  astrology?: {
    sunSign?: string;
    birthStone?: string;
    birthMonth?: string;
  };
}

export class RecommendationEngine {
  private static instance: RecommendationEngine;

  public static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  /**
   * Calculate recommendation score based on user preferences
   */
  public calculateRecommendationScore(
    product: any,
    userPreferences: UserPreferences
  ): RecommendationScore {
    let score = 0;
    const reasons: string[] = [];

    // Category matching (30% weight)
    if (product.category && userPreferences.categories.includes(product.category)) {
      score += 30;
      reasons.push(`Matches your favorite category: ${product.category}`);
    }

    // Metal type matching (20% weight)
    if (product.metalType && userPreferences.metalTypes.includes(product.metalType)) {
      score += 20;
      reasons.push(`Preferred metal: ${product.metalType}`);
    }

    // Design style matching (20% weight)
    if (product.designStyle && userPreferences.designStyles.includes(product.designStyle)) {
      score += 20;
      reasons.push(`Your favorite design: ${product.designStyle}`);
    }

    // Body part matching (15% weight)
    if (product.bodyPart && userPreferences.bodyParts.includes(product.bodyPart)) {
      score += 15;
      reasons.push(`Perfect for ${product.bodyPart}`);
    }

    // Astrology matching (10% weight)
    const astrologyScore = this.calculateAstrologyScore(product, userPreferences.astrology);
    if (astrologyScore > 0) {
      score += astrologyScore;
      reasons.push('Astrologically recommended for you');
    }

    // Price preference (5% weight)
    if (product.price && this.isInPreferredPriceRange(product.price)) {
      score += 5;
      reasons.push('Within your preferred price range');
    }

    return {
      productId: product.id,
      score: Math.min(score, 100), // Cap at 100
      reasons
    };
  }

  /**
   * Get personalized recommendations for a user
   */
  public getPersonalizedRecommendations(
    products: any[],
    userPreferences: UserPreferences,
    limit: number = 10
  ): RecommendationScore[] {
    const scoredProducts = products.map(product => 
      this.calculateRecommendationScore(product, userPreferences)
    );

    // Sort by score (highest first) and limit results
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get astrology-based recommendations
   */
  public getAstrologyRecommendations(
    products: any[],
    astrology: UserPreferences['astrology'],
    limit: number = 5
  ): RecommendationScore[] {
    return products
      .map(product => {
        const score = this.calculateAstrologyScore(product, astrology);
        return {
          productId: product.id,
          score,
          reasons: score > 0 ? ['Astrologically recommended'] : []
        };
      })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Get category-based recommendations
   */
  public getCategoryRecommendations(
    products: any[],
    categories: string[],
    limit: number = 8
  ): RecommendationScore[] {
    return products
      .filter(product => product.category && categories.includes(product.category))
      .map(product => ({
        productId: product.id,
        score: 75, // Base score for category match
        reasons: [`Matches your interest in ${product.category}`]
      }))
      .slice(0, limit);
  }

  /**
   * Get trending recommendations (based on popularity, ratings, etc.)
   */
  public getTrendingRecommendations(
    products: any[],
    limit: number = 10
  ): RecommendationScore[] {
    return products
      .map(product => {
        let score = 50; // Base trending score
        
        // Boost for high ratings
        if (product.rating && product.rating > 4.5) {
          score += (product.rating - 4.5) * 20;
        }

        // Boost for high review count
        if (product.reviewCount && product.reviewCount > 100) {
          score += Math.min(product.reviewCount / 100, 10);
        }

        // Boost for recent items
        if (product.createdAt) {
          const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceCreated < 30) {
            score += 10;
          }
        }

        return {
          productId: product.id,
          score: Math.min(score, 90),
          reasons: score > 70 ? ['Trending & Popular'] : ['Popular Choice']
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate astrology-based score
   */
  private calculateAstrologyScore(product: any, astrology: UserPreferences['astrology']): number {
    let score = 0;

    // Birth stone matching
    if (product.stone && astrology.birthStone && 
        product.stone.toLowerCase().includes(astrology.birthStone.toLowerCase())) {
      score += 8;
    }

    // Zodiac sign matching (if product has zodiac associations)
    if (product.zodiacSigns && astrology.sunSign && 
        product.zodiacSigns.includes(astrology.sunSign)) {
      score += 7;
    }

    // Month-based recommendations
    if (product.recommendedMonths && astrology.birthMonth && 
        product.recommendedMonths.includes(astrology.birthMonth)) {
      score += 5;
    }

    return score;
  }

  /**
   * Check if product is in preferred price range
   */
  private isInPreferredPriceRange(price: number): boolean {
    // This could be enhanced to store user's price preferences
    // For now, just check if it's a reasonable range
    return price >= 500 && price <= 50000;
  }

  /**
   * Get similar products based on attributes
   */
  public getSimilarProducts(
    targetProduct: any,
    allProducts: any[],
    limit: number = 5
  ): RecommendationScore[] {
    return allProducts
      .filter(product => product.id !== targetProduct.id)
      .map(product => {
        let score = 0;
        const reasons: string[] = [];

        // Same category
        if (product.category === targetProduct.category) {
          score += 25;
          reasons.push('Same category');
        }

        // Same metal type
        if (product.metalType === targetProduct.metalType) {
          score += 20;
          reasons.push('Same metal type');
        }

        // Same design style
        if (product.designStyle === targetProduct.designStyle) {
          score += 20;
          reasons.push('Same design style');
        }

        // Similar price range
        if (product.price && targetProduct.price) {
          const priceDiff = Math.abs(product.price - targetProduct.price) / targetProduct.price;
          if (priceDiff < 0.3) { // Within 30% price range
            score += 15;
            reasons.push('Similar price range');
          }
        }

        // Same body part
        if (product.bodyPart === targetProduct.bodyPart) {
          score += 20;
          reasons.push('Same body part');
        }

        return {
          productId: product.id,
          score,
          reasons
        };
      })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

// Export singleton instance
export const recommendationEngine = RecommendationEngine.getInstance();