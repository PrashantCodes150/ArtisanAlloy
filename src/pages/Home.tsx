import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero.png';

import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import StatsSection from '../components/StatsSection';
import SEO from '../components/SEO';
import TrustBadges from '../components/TrustBadges';
import RecommendedProducts from '../components/RecommendedProducts';

const Home = () => {
    const testimonials = [
        {
            name: 'Priya Sharma',
            rating: 5,
            text: 'Absolutely stunning craftsmanship! The attention to detail is remarkable.',
            location: 'Mumbai',
            verified: true,
        },
        {
            name: 'Rahul Verma',
            rating: 5,
            text: 'Perfect engagement ring. My fiancée loves it!',
            location: 'Delhi',
            verified: true,
        },
        {
            name: 'Ananya Patel',
            rating: 5,
            text: 'Luxurious quality at reasonable prices. Highly recommended!',
            location: 'Bangalore',
            verified: true,
        },
    ];

    const features = [
        { icon: Heart, title: 'Premium Quality', description: 'Only the finest materials' },
        { icon: Sparkles, title: 'Supporting Artisans', description: 'Empowering local craftspersons and small jewelry businesses' },
        { icon: Heart, title: 'Handcrafted Excellence', description: 'Preserving traditional jewelry making techniques' },
    ];

    return (
        <div className="pt-24">
            <SEO
                title="F Jewelry - Luxury Handcrafted Jewelry | Timeless Elegance"
                description="Discover exquisite handcrafted jewelry at F Jewelry. Shop premium gold, diamond, and silver jewelry for weddings, engagements, and special occasions. Free shipping on orders over ₹999."
                keywords="jewelry, gold jewelry, diamond jewelry, silver jewelry, wedding jewelry, engagement rings, necklaces, earrings, bracelets, Indian jewelry"
            />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImg}
                        alt="Luxury Jewelry Collection"
                        className="w-full h-full object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Main Heading */}
                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                            <span className="block text-jewelry-cream">
                                Where Elegance
                            </span>
                            <span className="block bg-gradient-gold bg-clip-text text-transparent">
                                Meets Perfection
                            </span>
                        </h1>

                        <p className="font-sans text-lg md:text-xl text-jewelry-cream/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Discover exquisite handcrafted jewelry that tells your unique story.
                            Each piece is a masterpiece of art, passion, and timeless beauty.
                        </p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Link
                                to="/collection"
                                className="group px-10 py-4 rounded-full bg-gradient-to-r from-jewelry-gold via-jewelry-gold-light to-jewelry-gold text-jewelry-dark font-sans font-semibold text-lg hover:shadow-2xl hover:shadow-jewelry-gold/50 transition-all duration-300 flex items-center gap-2"
                            >
                                Shop Collection
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/about"
                                className="px-10 py-4 rounded-full glass border border-jewelry-gold/30 text-jewelry-cream font-sans font-semibold text-lg hover:bg-jewelry-gold/10 hover:border-jewelry-gold transition-all duration-300"
                            >
                                Our Legacy
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Features Bar */}
            <section className="py-6 bg-gradient-to-r from-jewelry-gold via-jewelry-gold-light to-jewelry-gold">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-center gap-3 text-jewelry-dark">
                                <feature.icon className="w-6 h-6" />
                                <div>
                                    <p className="font-sans font-semibold text-sm">{feature.title}</p>
                                    <p className="font-sans text-xs opacity-80">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <FeaturedProducts />

            {/* Stats Section */}
            <StatsSection />

            {/* Category Showcase */}
            <CategoryShowcase />

            {/* Brand Story */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-jewelry-dark via-jewelry-dark-deep to-jewelry-dark" />

                <div className="relative max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-jewelry-gold/10 text-jewelry-gold text-sm font-sans mb-6">
                                Our Heritage
                            </span>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-cream mb-6">
                                Crafted with <span className="bg-gradient-gold bg-clip-text text-transparent">Passion</span>
                            </h2>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-6">
                                Every piece of jewelry we create is a testament to our commitment to excellence.
                                With over three decades of craftsmanship and artistry, we bring you timeless designs
                                that celebrate your special moments.
                            </p>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-8">
                                From traditional techniques to modern innovation, our artisans pour their heart
                                into every detail, ensuring that each piece becomes a cherished heirloom.
                            </p>
                            <p className="font-sans text-jewelry-cream/80 leading-relaxed mb-8">
                                We are committed to supporting local artisans and preserving traditional jewelry making techniques.
                            </p>
                            <Link
                                to="/about"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-jewelry-gold via-jewelry-gold-light to-jewelry-gold text-jewelry-dark font-sans font-semibold hover:shadow-2xl hover:shadow-jewelry-gold/50 transition-all duration-300 group"
                            >
                                Discover Our Story
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                                <img
                                    src={heroImg}
                                    alt="Jewelry Craftsmanship"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark via-transparent to-transparent opacity-60"></div>
                            </div>

                            {/* Stats Badge */}
                            <div className="glass rounded-2xl p-6 shadow-xl">
                                <div className="text-jewelry-gold font-display text-4xl font-bold">30+</div>
                                <div className="text-jewelry-cream/70 text-sm font-sans">Years of Excellence</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 bg-gradient-to-b from-jewelry-dark to-jewelry-dark-deep">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-jewelry-gold/10 text-jewelry-gold text-sm font-sans mb-4">
                            ❤️ Customer Love
                        </span>
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-cream mb-4">
                            What Our <span className="bg-gradient-gold bg-clip-text text-transparent">Clients</span> Say
                        </h2>
                        <p className="font-sans text-jewelry-cream/70 max-w-2xl mx-auto">
                            Trusted by thousands of satisfied customers across India
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="relative glass rounded-2xl p-8 hover:shadow-xl hover:shadow-jewelry-gold/10 transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-jewelry-gold text-jewelry-gold" />
                                    ))}
                                </div>
                                <p className="font-sans text-jewelry-cream/80 italic mb-6 leading-relaxed relative z-10">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-jewelry-gold via-jewelry-gold-light to-jewelry-gold flex items-center justify-center text-jewelry-dark font-bold font-sans">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-sans text-jewelry-gold font-semibold flex items-center gap-2">
                                            {testimonial.name}
                                            {testimonial.verified && (
                                                <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                                    ✓ Verified
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-jewelry-cream/50 text-sm font-sans">{testimonial.location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recommended Products */}
            <RecommendedProducts />

            {/* Trust Badges Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-jewelry-gold text-center mb-10">
                        Why Choose F Jewelry?
                    </h2>
                    <TrustBadges variant="horizontal" showLabels={true} />
                </div>
            </section>
        </div>
    );
};

export default Home;