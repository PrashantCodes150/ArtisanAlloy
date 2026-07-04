import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { products, type Product } from '../data/products';
import SEO from '../components/SEO';
import JewelryBanner from '../components/JewelryBanner';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ProductGrid from '../components/ProductGrid';

interface Filters {
    categories?: string[];
    priceRange?: [number, number];
    materials?: string[];
    stones?: string[];
    colors?: string[];
    bestsellers?: boolean;
    newArrivals?: boolean;
}

const Collection = () => {
    const location = useLocation();
    const [selectedFilters, setSelectedFilters] = useState<Filters>({});
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Parse URL parameters on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newFilters: Filters = {};

        // Handle search parameter
        const searchQuery = params.get('search');
        if (searchQuery) {
            setSearchQuery(searchQuery);
            // Filter products based on search query
            const searchResults = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
                product.occasion.some((occ: string) => occ.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredProducts(searchResults);
            return; // Skip other filtering if search is active
        }

        // Handle category parameter
        const categoryParam = params.get('category');
        if (categoryParam) {
            newFilters.categories = [categoryParam];
        }

        if (Object.keys(newFilters).length > 0) {
            setSelectedFilters(newFilters);
        }
    }, [location.search]);

    // Filter products when filters or search query change
    useEffect(() => {
        let result = [...products];

        // Apply search filter
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Apply category filter
        if (selectedFilters.categories?.length) {
            result = result.filter(product =>
                selectedFilters.categories!.some(category =>
                    product.occasion.includes(category) ||
                    product.material.includes(category) ||
                    product.personality.includes(category) ||
                    product.outfit.includes(category)
                )
            );
        }

        if (selectedFilters.priceRange) {
            const [min, max] = selectedFilters.priceRange;
            result = result.filter(product => product.price >= min && product.price <= max);
        }

        if (selectedFilters.materials?.length) {
            result = result.filter(product =>
                selectedFilters.materials!.some(material => product.material.includes(material))
            );
        }

        if (selectedFilters.bestsellers) {
            result = result.filter(product => product.isBestseller);
        }

        if (selectedFilters.newArrivals) {
            result = result.filter(product => product.isNew);
        }

        setFilteredProducts(result);
    }, [searchQuery, selectedFilters]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleApplyFilters = (filters: Filters) => {
        setSelectedFilters(filters);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setSelectedFilters({});
        setSearchQuery('');
    };

    const hasActiveFilters = Object.values(selectedFilters).some(v => v &&
        ((Array.isArray(v) && v.length > 0) ||
            (typeof v === 'boolean' && v) ||
            (Array.isArray(v) && v.length > 0 && typeof v[0] === 'number')));

    return (
        <div className="pt-24 min-h-screen">
            <SEO
                title="Jewelry Collection - Shop Gold, Diamond & Silver Jewelry | ArtisanAlloy"
                description="Explore our exquisite collection of handcrafted jewelry. Shop rings, necklaces, earrings, bracelets in gold, diamond, and silver with exceptional quality."
                keywords="jewelry collection, gold jewelry, diamond jewelry, silver jewelry, rings, necklaces, earrings, bracelets, buy jewelry online, ArtisanAlloy"
                url="https://Artisan-Alloy.com/collection"
            />

            {/* Premium Jewelry Banner */}
            <JewelryBanner />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search Bar and Filter Button */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <button
                        onClick={() => setShowFilters(true)}
                        className="flex items-center justify-center gap-2 px-6 py-4 glass rounded-xl text-jewelry-cream min-w-[150px]"
                    >
                        <Filter className="w-5 h-5" />
                        <span className="font-sans">Filters</span>
                        {hasActiveFilters && (
                            <span className="w-2 h-2 bg-jewelry-gold rounded-full"></span>
                        )}
                    </button>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="font-sans text-jewelry-cream/60">
                        Showing {filteredProducts.length} products
                        {searchQuery && ` for "${searchQuery}"`}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="font-sans text-sm text-jewelry-rose hover:text-jewelry-gold transition-colors"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                <ProductGrid products={filteredProducts} />

                {/* Filter Panel */}
                <FilterPanel
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                    onApplyFilters={handleApplyFilters}
                    initialFilters={selectedFilters}
                />
            </div>
        </div>
    );
};

export default Collection;