import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { products } from '../data/products';

const FeaturedProducts = () => {
    // Get top 4 featured products
    const featuredProducts = products
        .filter(p => p.rating >= 4.5)
        .slice(0, 4);

    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-jewelry-gold/10 text-jewelry-gold text-sm font-sans mb-4">
                        ✨ Bestsellers
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-cream mb-4">
                        Featured <span className="bg-gradient-gold bg-clip-text text-transparent">Collection</span>
                    </h2>
                    <p className="font-sans text-jewelry-cream/70 max-w-2xl mx-auto">
                        Discover our most loved pieces, handpicked for their exceptional craftsmanship and timeless beauty
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                            <Link
                                to={`/product/${product.slug}`}
                                className="group block"
                            >
                                <div className="relative glass rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-jewelry-gold/20 transition-all duration-500">
                                    {/* Image */}
                                    <div className="relative h-72 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark via-transparent opacity-60" />

                                        {/* Badge */}
                                        {product.originalPrice && (
                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-jewelry-rose text-white text-xs font-sans font-semibold">
                                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                            </div>
                                        )}

                                        {/* Quick view overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="px-6 py-3 rounded-full bg-jewelry-gold text-jewelry-dark font-sans font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                View Details
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-display text-lg text-jewelry-cream mb-2 group-hover:text-jewelry-gold transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-jewelry-gold text-jewelry-gold' : 'text-jewelry-gold/30'}`}
                                                />
                                            ))}
                                            <span className="text-xs text-jewelry-cream/50 ml-1">({product.reviews})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2">
                                            <span className="font-sans text-jewelry-gold text-xl font-bold">
                                                ₹{product.price.toLocaleString()}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="font-sans text-jewelry-cream/40 line-through text-sm">
                                                    ₹{product.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        to="/collection"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-jewelry-gold text-jewelry-gold font-sans font-semibold hover:bg-jewelry-gold hover:text-jewelry-dark transition-all duration-300 group"
                    >
                        View All Collection
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
