import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import advertisement images
import model1 from '../assets/images/advertismnet_models/Gemini_Generated_Image_5jf6il5jf6il5jf6.jpg';
import model2 from '../assets/images/advertismnet_models/Gemini_Generated_Image_f0f99mf0f99mf0f9.jpg';
import model3 from '../assets/images/advertismnet_models/Gemini_Generated_Image_n7g0vnn7g0vnn7g0.jpg';
import model4 from '../assets/images/advertismnet_models/Gemini_Generated_Image_xkeowrxkeowrxkeo.jpg';
import model5 from '../assets/images/advertismnet_models/Gemini_Generated_Image_plqbh4plqbh4plqb.jpg';
import model6 from '../assets/images/advertismnet_models/Gemini_Generated_Image_gkqygagkqygagkqy.jpg';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link?: string;
}

const AutoScrollBanner: React.FC = () => {
  // Advertisement images with promotional text
  const bannerItems: BannerItem[] = [
    {
      id: 'adv-1',
      title: 'Exclusive Diamond Collection',
      subtitle: 'Limited Time Offer - Up to 50% Off',
      imageUrl: model1,
      link: '/collection?category=diamond'
    },
    {
      id: 'adv-2',
      title: 'Bridal Special Sets',
      subtitle: 'Complete Your Wedding Look',
      imageUrl: model2,
      link: '/collection?category=bridal'
    },
    {
      id: 'adv-3',
      title: 'Gold Plated Elegance',
      subtitle: 'Premium Quality at Affordable Prices',
      imageUrl: model3,
      link: '/collection?category=gold-plated'
    },
    {
      id: 'adv-4',
      title: 'Oxidized Fashion Trends',
      subtitle: 'New Arrivals - Modern & Traditional',
      imageUrl: model4,
      link: '/collection?category=oxidized'
    },
    {
      id: 'adv-5',
      title: 'Pearl Collection',
      subtitle: 'Timeless Beauty for Every Occasion',
      imageUrl: model5,
      link: '/collection?category=pearls'
    },
    {
      id: 'adv-6',
      title: 'Men\'s Exclusive Line',
      subtitle: 'Sophisticated Designs for Him',
      imageUrl: model6,
      link: '/collection?category=mens'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality (every 10 seconds as requested)
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % bannerItems.length);
      }, 10000); // 10 seconds as requested
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, bannerItems.length]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? bannerItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === bannerItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div
      className="relative w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Main Banner Item */}
        <div className="flex justify-center">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-7xl mx-auto relative group"
          >
            {/* Premium Cinematic Banner with Dynamic Image Handling */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-jewelry-gold/20">
              {/* Dynamic Image Container with Intelligent Cropping */}
              <div className="relative aspect-video w-full bg-jewelry-dark-light">
                <img
                  src={bannerItems[currentIndex].imageUrl}
                  alt={bannerItems[currentIndex].title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />

                {/* Luxurious Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-jewelry-dark/90 via-jewelry-dark/70 to-jewelry-dark/90"></div>

                {/* Soft Spotlight Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-jewelry-gold/5"></div>

                {/* Adaptive Text Zone - Automatically positions based on image aspect ratio */}
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                  <div className="max-w-3xl text-center z-10">
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-jewelry-cream mb-4 drop-shadow-2xl"
                    >
                      {bannerItems[currentIndex].title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="font-sans text-lg md:text-xl text-jewelry-cream/90 mb-8 max-w-2xl mx-auto drop-shadow-lg"
                    >
                      {bannerItems[currentIndex].subtitle}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <a
                        href={bannerItems[currentIndex].link || '#'}
                        className="inline-block px-8 py-4 bg-gradient-gold text-jewelry-dark rounded-xl font-sans font-bold text-lg hover:shadow-xl hover:shadow-jewelry-gold/30 transition-all transform hover:scale-105"
                      >
                        Shop Now
                      </a>
                    </motion.div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-jewelry-gold/20 transition-all shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-jewelry-cream" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-jewelry-gold/20 transition-all shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-jewelry-cream" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-jewelry-gold w-8'
                  : 'bg-jewelry-cream/50 hover:bg-jewelry-cream/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="absolute top-6 right-6 z-20 flex items-center text-jewelry-cream/70 text-sm bg-jewelry-dark/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <div className={`w-2 h-2 rounded-full mr-2 ${!isPaused ? 'bg-jewelry-gold animate-pulse' : 'bg-jewelry-cream/50'}`}></div>
          {!isPaused ? 'Auto-playing' : 'Paused'}
        </div>
      </div>
    </div>
  );
};

export default AutoScrollBanner;