import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, Gem, Heart, Star, Crown, Sun, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Background images from assets
import bg1 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-25.jpg';
import bg2 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-31.jpg';
import bg3 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-30.jpg';
import bg4 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-29.jpg';
import bg5 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-28.jpg';
import bg6 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-26.jpg';

interface OnboardingData {
  categories: string[];
  bodyParts: string[];
  metalTypes: string[];
  designStyles: string[];
  astrology: {
    sunSign?: string;
    birthMonth?: string;
    birthStone?: string;
    nakshatra?: string;
  };
}

const OnboardingPage: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    categories: [],
    bodyParts: [],
    metalTypes: [],
    designStyles: [],
    astrology: {}
  });

  const slides = useMemo(() => [
    {
      id: 'categories',
      title: 'Define Your Style',
      subtitle: 'Which jewelry collections speak to your soul?',
      icon: <Gem className="w-12 h-12" />,
      bg: bg1,
      options: [
        { id: 'rings', label: 'Rings', icon: '💍' },
        { id: 'necklaces', label: 'Necklaces', icon: '📿' },
        { id: 'earrings', label: 'Earrings', icon: '👂' },
        { id: 'bracelets', label: 'Bracelets', icon: '⌚' },
        { id: 'pendants', label: 'Pendants', icon: '🔷' },
        { id: 'bangles', label: 'Bangles', icon: '⭕' },
        { id: 'chains', label: 'Chains', icon: '⛓️' },
        { id: 'anklets', label: 'Anklets', icon: '🦶' }
      ],
      field: 'categories' as keyof OnboardingData
    },
    {
      id: 'bodyParts',
      title: 'The Art of Adornment',
      subtitle: 'Where do you envision your next statement piece?',
      icon: <Heart className="w-12 h-12" />,
      bg: bg2,
      options: [
        { id: 'ears', label: 'Ears', icon: '👂' },
        { id: 'neck', label: 'Neck', icon: '🦶' },
        { id: 'wrist', label: 'Wrist', icon: '⌚' },
        { id: 'fingers', label: 'Fingers', icon: '💍' },
        { id: 'ankles', label: 'Ankles', icon: '🦶' },
        { id: 'nose', label: 'Nose', icon: '👃' },
        { id: 'hair', label: 'Hair', icon: '👑' },
        { id: 'waist', label: 'Waist', icon: '🎗️' }
      ],
      field: 'bodyParts' as keyof OnboardingData
    },
    {
      id: 'metalTypes',
      title: 'Noble Foundations',
      subtitle: 'Select the precious metals that grace your collection',
      icon: <Crown className="w-12 h-12" />,
      bg: bg3,
      options: [
        { id: 'gold', label: 'Gold', icon: '🥇' },
        { id: 'silver', label: 'Silver', icon: '🥈' },
        { id: 'rose-gold', label: 'Rose Gold', icon: '🌹' },
        { id: 'platinum', label: 'Platinum', icon: '⚪' },
        { id: 'white-gold', label: 'White Gold', icon: '⚪' },
        { id: 'brass', label: 'Brass', icon: '🟡' },
        { id: 'copper', label: 'Copper', icon: '🔶' },
        { id: 'titanium', label: 'Titanium', icon: '🔷' }
      ],
      field: 'metalTypes' as keyof OnboardingData
    },
    {
      id: 'designStyles',
      title: 'Signature Aesthetics',
      subtitle: 'What design philosophy resonates with you?',
      icon: <Sparkles className="w-12 h-12" />,
      bg: bg4,
      options: [
        { id: 'traditional', label: 'Traditional', icon: '🏛️' },
        { id: 'modern', label: 'Modern', icon: '🏙️' },
        { id: 'minimalist', label: 'Minimalist', icon: '⭕' },
        { id: 'vintage', label: 'Vintage', icon: '📻' },
        { id: 'bohemian', label: 'Bohemian', icon: '🌸' },
        { id: 'luxury', label: 'Luxury', icon: '👑' },
        { id: 'casual', label: 'Casual', icon: '😊' },
        { id: 'ethnic', label: 'Ethnic', icon: '🌏' }
      ],
      field: 'designStyles' as keyof OnboardingData
    },
    {
      id: 'astrology',
      title: 'Celestial Connection',
      subtitle: 'Align your jewelry with the stars',
      icon: <Star className="w-12 h-12" />,
      bg: bg5,
      options: [
        { id: 'aries', label: 'Aries', icon: '♈' },
        { id: 'taurus', label: 'Taurus', icon: '♉' },
        { id: 'gemini', label: 'Gemini', icon: '♊' },
        { id: 'cancer', label: 'Cancer', icon: '♋' },
        { id: 'leo', label: 'Leo', icon: '♌' },
        { id: 'virgo', label: 'Virgo', icon: '♍' },
        { id: 'libra', label: 'Libra', icon: '♎' },
        { id: 'scorpio', label: 'Scorpio', icon: '♏' },
        { id: 'sagittarius', label: 'Sagittarius', icon: '♐' },
        { id: 'capricorn', label: 'Capricorn', icon: '♑' },
        { id: 'aquarius', label: 'Aquarius', icon: '♒' },
        { id: 'pisces', label: 'Pisces', icon: '♓' }
      ],
      field: 'astrology.sunSign' as keyof OnboardingData
    },
    {
      id: 'birthMonth',
      title: 'Birthstone Legacy',
      subtitle: 'Discover the gem of your birth',
      icon: <Sun className="w-12 h-12" />,
      bg: bg6,
      options: [
        { id: 'january', label: 'January', icon: '❄️' },
        { id: 'february', label: 'February', icon: '💝' },
        { id: 'march', label: 'March', icon: '🌸' },
        { id: 'april', label: 'April', icon: '💎' },
        { id: 'may', label: 'May', icon: '🌺' },
        { id: 'june', label: 'June', icon: '🌻' },
        { id: 'july', label: 'July', icon: '🔥' },
        { id: 'august', label: 'August', icon: '💚' },
        { id: 'september', label: 'September', icon: '🍁' },
        { id: 'october', label: 'October', icon: '🎃' },
        { id: 'november', label: 'November', icon: '🍂' },
        { id: 'december', label: 'December', icon: '⛄' }
      ],
      field: 'astrology.birthMonth' as keyof OnboardingData
    }
  ], []);

  const handleOptionToggle = useCallback((optionId: string, field: string) => {
    setOnboardingData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        const parentKey = parent as keyof OnboardingData;
        const currentData = prev[parentKey] as any;

        return {
          ...prev,
          [parentKey]: {
            ...currentData,
            [child]: currentData[child] === optionId ? undefined : optionId
          }
        };
      }

      const fieldKey = field as keyof Omit<OnboardingData, 'astrology'>;
      const currentArray = prev[fieldKey] as string[];
      const isSelected = currentArray.includes(optionId);

      return {
        ...prev,
        [fieldKey]: isSelected
          ? currentArray.filter(item => item !== optionId)
          : [...currentArray, optionId]
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  }, [currentSlide, slides.length]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding(onboardingData);
      toast.success('Welcome! Your preferences have been saved successfully.');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [onboardingData, completeOnboarding]);

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;
  const canProceed = currentSlideData.field.includes('.')
    ? true // Single selection fields are optional
    : (onboardingData[currentSlideData.field as keyof Omit<OnboardingData, 'astrology'>] as string[])?.length > 0;

  return (
    <div className="relative min-h-screen bg-jewelry-dark overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Backgrounds with Ken Burns Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={currentSlideData.bg}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jewelry-dark via-jewelry-dark/60 to-jewelry-dark" />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl glass-light rounded-[3rem] border border-jewelry-gold/20 shadow-2xl overflow-hidden backdrop-blur-xl"
      >
        {/* Progress Overlay */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-jewelry-cream/5">
          <motion.div
            className="h-full bg-gradient-gold"
            initial={{ width: 0 }}
            animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        <div className="p-8 md:p-12 lg:p-16">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              key={`icon-${currentSlide}`}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="inline-flex p-5 rounded-full bg-jewelry-gold/10 text-jewelry-gold mb-6 border border-jewelry-gold/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
            >
              {currentSlideData.icon}
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-jewelry-cream mb-4 tracking-tight">
              {currentSlideData.title}
            </h1>
            <p className="font-sans text-jewelry-cream/60 text-lg max-w-xl mx-auto leading-relaxed">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Slide Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {currentSlideData.options.map((option) => {
                  const isSelected = currentSlideData.field.includes('.')
                    ? (onboardingData.astrology as any)[currentSlideData.field.split('.')[1]] === option.id
                    : (onboardingData[currentSlideData.field as keyof Omit<OnboardingData, 'astrology'>] as string[])?.includes(option.id);

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionToggle(option.id, currentSlideData.field)}
                      className={`group relative p-8 rounded-3xl border transition-all duration-500 flex flex-col items-center justify-center text-center gap-4 ${isSelected
                          ? 'border-jewelry-gold bg-jewelry-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.15)] ring-1 ring-jewelry-gold/50'
                          : 'border-jewelry-gold/10 hover:border-jewelry-gold/30 bg-jewelry-cream/5 hover:bg-jewelry-cream/10'
                        }`}
                    >
                      <span className="text-4xl filter grayscale-[0.2] transition-all group-hover:scale-110 group-hover:grayscale-0">
                        {option.icon}
                      </span>
                      <span className={`font-sans font-medium text-sm transition-colors ${isSelected ? 'text-jewelry-gold' : 'text-jewelry-cream/70 group-hover:text-jewelry-cream'
                        }`}>
                        {option.label}
                      </span>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-jewelry-gold rounded-full flex items-center justify-center shadow-lg"
                        >
                          <Check className="w-4 h-4 text-jewelry-dark stroke-[3]" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              {[...Array(slides.length)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-10 bg-jewelry-gold' : 'w-2 bg-jewelry-gold/20'
                    }`}
                />
              ))}
              <span className="ml-4 font-sans text-sm text-jewelry-cream/40 font-medium uppercase tracking-[0.2em]">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {currentSlide > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  className="flex-1 md:flex-none px-8 py-4 rounded-2xl border border-jewelry-gold/30 text-jewelry-gold font-sans font-semibold hover:bg-jewelry-gold/10 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isLastSlide ? handleSubmit : handleNext}
                disabled={!isLastSlide && !canProceed}
                className={`flex-1 md:min-w-[200px] px-10 py-4 rounded-2xl font-sans font-bold transition-all flex items-center justify-center gap-3 shadow-lg ${isLastSlide
                    ? 'bg-gradient-gold text-jewelry-dark shadow-jewelry-gold/20'
                    : !canProceed
                      ? 'bg-jewelry-cream/5 text-jewelry-cream/20 cursor-not-allowed border border-jewelry-cream/10'
                      : 'bg-jewelry-cream text-jewelry-dark hover:shadow-jewelry-cream/20'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-jewelry-dark border-t-transparent rounded-full animate-spin" />
                    Completing...
                  </>
                ) : isLastSlide ? (
                  <>
                    Step Into Luxury
                    <Crown className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;