import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';

interface RecentProduct {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
    viewedAt: number;
}

const STORAGE_KEY = 'f_jewelry_recently_viewed';
const MAX_ITEMS = 10;

// Add a product to recently viewed
export const addToRecentlyViewed = (product: Omit<RecentProduct, 'viewedAt'>) => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let items: RecentProduct[] = stored ? JSON.parse(stored) : [];

        // Remove if already exists
        items = items.filter(item => item.id !== product.id);

        // Add to beginning with timestamp
        items.unshift({
            ...product,
            viewedAt: Date.now(),
        });

        // Keep only MAX_ITEMS
        items = items.slice(0, MAX_ITEMS);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Failed to save recently viewed:', error);
    }
};

// Get recently viewed products
export const getRecentlyViewed = (): RecentProduct[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Failed to get recently viewed:', error);
        return [];
    }
};

// Clear recently viewed
export const clearRecentlyViewed = () => {
    localStorage.removeItem(STORAGE_KEY);
};

// Hook to use recently viewed products
export const useRecentlyViewed = () => {
    const [items, setItems] = useState<RecentProduct[]>([]);

    useEffect(() => {
        const items = getRecentlyViewed();
        setItems(items);
    }, []);

    const add = (product: Omit<RecentProduct, 'viewedAt'>) => {
        addToRecentlyViewed(product);
        setItems(getRecentlyViewed());
    };

    const clear = () => {
        clearRecentlyViewed();
        setItems([]);
    };

    return { items, add, clear };
};

// Recently Viewed Section Component
interface RecentlyViewedSectionProps {
    excludeProductId?: string;
    title?: string;
    maxItems?: number;
}

const RecentlyViewedSection = ({
    excludeProductId,
    title = 'Recently Viewed',
    maxItems = 4,
}: RecentlyViewedSectionProps) => {
    const [recentItems, setRecentItems] = useState<RecentProduct[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let items = getRecentlyViewed();

        // Exclude current product if specified
        if (excludeProductId) {
            items = items.filter(item => item.id !== excludeProductId);
        }

        // Limit to maxItems
        const limitedItems = items.slice(0, maxItems);

        setRecentItems(limitedItems);
    }, [excludeProductId, maxItems]);

    if (!isVisible || recentItems.length === 0) {
        return null;
    }

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-jewelry-gold" />
                        <h2 className="font-display text-2xl font-bold text-jewelry-gold">
                            {title}
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-jewelry-cream/50 hover:text-jewelry-cream transition-colors"
                        aria-label="Hide recently viewed"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentItems.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            className="group glass rounded-xl overflow-hidden hover:shadow-lg hover:shadow-jewelry-gold/20 transition-all"
                        >
                            <div className="h-36 overflow-hidden bg-jewelry-dark-light">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                                    }}
                                />
                            </div>
                            <div className="p-3">
                                <h3 className="font-sans text-sm text-jewelry-cream group-hover:text-jewelry-gold transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="font-sans text-jewelry-gold font-semibold text-sm mt-1">
                                    ₹{product.price.toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RecentlyViewedSection;
