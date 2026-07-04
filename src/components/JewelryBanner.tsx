import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import advertisement images
import model1 from '../assets/images/advertismnet_models/Gemini_Generated_Image_5jf6il5jf6il5jf6.jpg';
import model2 from '../assets/images/advertismnet_models/Gemini_Generated_Image_f0f99mf0f99mf0f9.jpg';
import model3 from '../assets/images/advertismnet_models/Gemini_Generated_Image_gkqygagkqygagkqy.jpg';
import model4 from '../assets/images/advertismnet_models/Gemini_Generated_Image_n7g0vnn7g0vnn7g0.jpg';
import model5 from '../assets/images/advertismnet_models/Gemini_Generated_Image_plqbh4plqbh4plqb.jpg';
import model6 from '../assets/images/advertismnet_models/Gemini_Generated_Image_xkeowrxkeowrxkeo.jpg';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  cta: string;
  imageUrl: string;
  link?: string;
}

const JewelryBanner: React.FC = () => {
  // Add the CSS animation to the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes shine {
        0% {
          background-position: -200% 0%;
        }
        100% {
          background-position: 200% 0%;
        }
      }

      .parallax-element {
        transition: transform 0.1s ease-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Advertisement images with promotional text
  const bannerItems: BannerItem[] = [
    {
      id: 'adv-1',
      title: 'Exclusive Diamond Collection',
      subtitle: 'Limited Time Offer - Up to 50% Off',
      tagline: 'Crafted with Precision',
      cta: 'Shop Now',
      imageUrl: model1,
      link: '/collection?category=diamond'
    },
    {
      id: 'adv-2',
      title: 'Bridal Special Sets',
      subtitle: 'Complete Your Wedding Look',
      tagline: 'Timeless Elegance',
      cta: 'Discover More',
      imageUrl: model2,
      link: '/collection?category=bridal'
    },
    {
      id: 'adv-3',
      title: 'Gold Plated Elegance',
      subtitle: 'Premium Quality at Affordable Prices',
      tagline: 'Luxury Redefined',
      cta: 'Explore Collection',
      imageUrl: model3,
      link: '/collection?category=gold-plated'
    },
    {
      id: 'adv-4',
      title: 'Ruby & Sapphire Specials',
      subtitle: 'Vibrant Gemstone Collections',
      tagline: 'Colors That Captivate',
      cta: 'View Gems',
      imageUrl: model4,
      link: '/collection?category=gemstones'
    },
    {
      id: 'adv-5',
      title: 'Silver Statement Pieces',
      subtitle: 'Bold & Contemporary Designs',
      tagline: 'Modern Sophistication',
      cta: 'Explore Silver',
      imageUrl: model5,
      link: '/collection?category=silver'
    },
    {
      id: 'adv-6',
      title: 'Custom Design Service',
      subtitle: 'Create Your Dream Jewelry Piece',
      tagline: 'Personalized Excellence',
      cta: 'Design Now',
      imageUrl: model6,
      link: '/custom-design'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Preload all images for instant transitions with higher priority
  useEffect(() => {
    const preloadLinks: HTMLLinkElement[] = [];

    bannerItems.forEach(item => {
      const img = new Image();
      img.src = item.imageUrl;
      img.fetchPriority = 'high'; // Higher fetch priority
      img.loading = 'eager'; // Load images eagerly for immediate display
      img.decoding = 'sync'; // Synchronize decoding for smoother transitions

      // Also preload with link element for better browser optimization
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = item.imageUrl;
      document.head.appendChild(link);
      preloadLinks.push(link);
    });

    // Cleanup function to remove preload links
    return () => {
      preloadLinks.forEach(link => {
        document.head.removeChild(link);
      });
    };
  }, []);

  // Auto-scroll functionality (every 5 seconds)
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % bannerItems.length);
      }, 5000); // 5 seconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
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

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/src/assets/images/hero.png')",
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-jewelry-dark/70"></div>
      </div>

      {/* Banner Container */}
      <div className="relative w-screen max-w-7xl mx-auto px-4 py-4 md:py-6 flex justify-center">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-jewelry-gold/20" style={{ width: '1400px', height: '600px' }}>
          {/* Dynamic Image with Consistent Positioning and Fast 3D Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bannerItems[currentIndex].id}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
              className="relative w-full h-full video-like-image"
            >
              <img
                src={bannerItems[currentIndex].imageUrl}
                alt={bannerItems[currentIndex].title}
                className={`w-full h-full object-cover brightness-75 transition-transform duration-500 ${currentIndex % 3 === 0 ? 'ken-burns-effect' :
                    currentIndex % 3 === 1 ? 'slow-pan' :
                      'subtle-zoom'
                  }`}
                style={
                  bannerItems[currentIndex].id === 'adv-4' ||
                    bannerItems[currentIndex].id === 'adv-5' ||
                    bannerItems[currentIndex].id === 'adv-2'
                    ? { objectPosition: 'center 20%' }
                    : { objectPosition: 'center top' }
                }
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />


              {/* Dark Overlay - Only applies if we want a darkened effect */}
              <div className="absolute inset-0 bg-black/40 opacity-0"></div>
            </motion.div>
          </AnimatePresence>

          {/* Text positioned at the lower left corner of the banner for all slides */}
          <div
            className="absolute bottom-0 left-0 w-2/5 p-6 md:p-8"
            style={{
              background: 'linear-gradient(to right, rgba(26,26,46,0.9) 70%, transparent)'
            }}
          >
            <div className="text-left pl-0">
              {/* Title - Positioned at lower left */}
              <motion.h1
                key={`title-${bannerItems[currentIndex].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-title text-2xl md:text-4xl lg:text-5xl font-bold text-jewelry-cream mb-1 drop-shadow-lg text-left"
              >
                {bannerItems[currentIndex].title}
              </motion.h1>

              {/* Subtitle - Positioned at lower left */}
              <motion.p
                key={`subtitle-${bannerItems[currentIndex].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-subtitle text-sm md:text-base text-jewelry-cream/90 mb-1 max-w-full drop-shadow-md text-left"
              >
                {bannerItems[currentIndex].subtitle}
              </motion.p>

              {/* Tagline - Positioned at lower left */}
              <motion.p
                key={`tagline-${bannerItems[currentIndex].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="font-subtitle text-xs md:text-sm text-jewelry-gold/90 mb-3 max-w-full drop-shadow-md text-left"
              >
                {bannerItems[currentIndex].tagline}
              </motion.p>

              {/* CTA Button - Positioned at lower left */}
              <motion.div
                key={`cta-${bannerItems[currentIndex].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-left"
              >
                <a
                  href={bannerItems[currentIndex].link || '#'}
                  className="inline-block px-6 py-3 bg-gradient-gold text-jewelry-dark rounded-lg font-sans font-bold text-base hover:shadow-xl hover:shadow-jewelry-gold/30 transition-all transform hover:scale-105 text-left"
                >
                  {bannerItems[currentIndex].cta}
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-[20px] top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-jewelry-gold/20 transition-all shadow-lg"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 text-jewelry-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-[20px] top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full glass hover:bg-jewelry-gold/20 transition-all shadow-lg"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 text-jewelry-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-[24px] left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-jewelry-gold w-8'
                  : 'bg-jewelry-cream/50 hover:bg-jewelry-cream/70'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JewelryBanner;