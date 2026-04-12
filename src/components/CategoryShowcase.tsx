import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/swiper-bundle.css';

import { topNavCategories } from '../data/categories';

const CategoryShowcase: React.FC = () => {
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-jewelry-dark-deep to-jewelry-dark-light">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-jewelry-gold mb-4">
                        Discover Our Strategic Collections
                    </h2>
                    <p className="font-sans text-jewelry-cream/70 max-w-2xl mx-auto">
                        Explore curated collections designed to match your mood, occasion, and style.
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                    }}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    pagination={{ clickable: true }}
                    navigation={true}
                    className="category-swiper" // Custom class for styling
                >
                    {topNavCategories.map((category) => (
                        <SwiperSlide key={category.id}>
                            <Link to={`/collection?category=${category.slug}`} className="group block">
                                <motion.div
                                    whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(246, 214, 131, 0.2)" }}
                                    transition={{ duration: 0.3 }}
                                    className="relative rounded-xl overflow-hidden shadow-lg border border-jewelry-gold/20 bg-jewelry-dark-light h-80"
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark-deep/80 via-transparent to-transparent flex items-end p-6">
                                        <h3 className="font-display text-2xl font-bold text-jewelry-cream group-hover:text-jewelry-gold transition-colors duration-300">
                                            {category.name}
                                        </h3>
                                    </div>
                                    <div className="absolute top-12 right-4 px-3 py-1 rounded-full bg-jewelry-dark/70 text-jewelry-gold text-xs font-sans font-semibold border border-jewelry-gold/30">
                                        {category.type.charAt(0).toUpperCase() + category.type.slice(1)}
                                    </div>
                                </motion.div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryShowcase;
