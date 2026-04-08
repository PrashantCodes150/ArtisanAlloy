import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gem,
  Heart,
  Star,
  Moon,
  Sun,
  Hand,
  Check,
  Crown
} from 'lucide-react';
import { useOnboarding } from '../hooks/useOnboarding';
import {
  JEWELLERY_CATEGORIES,
  BODY_PARTS,
  METAL_TYPES,
  DESIGN_STYLES,
  ZODIAC_SIGNS,
  BIRTH_MONTHS,
  BIRTH_STONES,
  NAKSHATRAS,
  HERITAGE_ARTS
} from '../data/onboarding.data';

// Background images for flow
import bg1 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-25.jpg';
import bg2 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-31.jpg';
import bg3 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-30.jpg';
import bg4 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-29.jpg';
import bg5 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-28.jpg';
import bg6 from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-26.jpg';

interface OnboardingFlowProps {
  isEditMode?: boolean;
  onSave?: (preferences: any) => Promise<void>;
}

const bgs = [bg1, bg2, bg3, bg4, bg5, bg6];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isEditMode = false, onSave }) => {
  const {
    currentSlide,
    totalSlides,
    onboardingData,
    isLoading,
    nextSlide,
    prevSlide,
    updateSlideData,
    completeOnboarding
  } = useOnboarding();

  const handleSelection = (slide: number, category: string, value: string, multiSelect: boolean = true) => {
    const currentSelections = (onboardingData as any)[category] || [];
    let newSelections: string | string[];

    if (multiSelect) {
      if (currentSelections.includes(value)) {
        newSelections = currentSelections.filter((item: string) => item !== value);
      } else {
        newSelections = [...currentSelections, value];
      }
    } else {
      newSelections = value;
    }

    updateSlideData(slide, { [category]: newSelections });
  };

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="text-center space-y-8 py-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-40 h-40 mx-auto bg-gradient-gold rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)] border-4 border-jewelry-cream/20"
            >
              <Hand className="w-20 h-20 text-jewelry-dark" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-jewelry-cream tracking-tight">
                Namaste 🙏
              </h1>
              <p className="text-xl text-jewelry-cream/60 font-sans max-w-lg mx-auto leading-relaxed">
                Welcome to a sanctuary of heritage and handcrafted elegance. Let's curate your personal style.
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto text-jewelry-gold"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-jewelry-cream tracking-wide">
                Heritage & Artistry
              </h2>
              <p className="text-jewelry-cream/60 max-w-md mx-auto">We preserve endangered Indian craftsmanship through modern artificial jewelry.</p>
            </div>

            <div className="grid gap-4">
              {HERITAGE_ARTS.slice(0, 3).map((art, index) => (
                <motion.div
                  key={art.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-light rounded-3xl p-6 border border-jewelry-gold/10 hover:border-jewelry-gold/30 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-jewelry-gold mb-1">{art.name}</h4>
                      <p className="font-sans text-sm text-jewelry-cream/70 leading-relaxed mb-2">{art.description}</p>
                      <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold">
                        <span className="text-jewelry-gold/60">Origin: {art.origin}</span>
                        <span className="text-jewelry-rose/60">Status: {art.status}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-jewelry-gold/10 flex items-center justify-center shrink-0">
                      <Crown className="w-6 h-6 text-jewelry-gold/60" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <Gem className="w-16 h-16 text-jewelry-gold mx-auto" />
              <h2 className="text-3xl font-display font-bold text-jewelry-cream">Curated Categories</h2>
              <p className="text-jewelry-cream/60">Which silhouettes define your essence?</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {JEWELLERY_CATEGORIES.map((category) => {
                const isSelected = onboardingData.categories?.includes(category);
                return (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelection(2, 'categories', category)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-500 text-sm font-bold tracking-wide ${isSelected
                      ? 'border-jewelry-gold bg-jewelry-gold/10 text-jewelry-gold shadow-lg shadow-jewelry-gold/10'
                      : 'border-jewelry-gold/10 bg-jewelry-cream/5 text-jewelry-cream/60 hover:border-jewelry-gold/30 hover:text-jewelry-cream'
                      }`}
                  >
                    {category}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <Heart className="w-16 h-16 text-jewelry-gold mx-auto" />
              <h2 className="text-3xl font-display font-bold text-jewelry-cream">Styling Preferences</h2>
              <p className="text-jewelry-cream/60">Where do you love to place your adornments?</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {BODY_PARTS.map((part) => {
                const isSelected = onboardingData.bodyParts?.includes(part);
                return (
                  <motion.button
                    key={part}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelection(3, 'bodyParts', part)}
                    className={`p-5 rounded-2xl border-2 transition-all duration-500 text-sm font-bold tracking-wide ${isSelected
                      ? 'border-jewelry-gold bg-jewelry-gold/10 text-jewelry-gold'
                      : 'border-jewelry-gold/10 bg-jewelry-cream/5 text-jewelry-cream/60 hover:border-jewelry-gold/30'
                      }`}
                  >
                    {part}
                  </motion.button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <Star className="w-16 h-16 text-jewelry-gold mx-auto" />
              <h2 className="text-3xl font-display font-bold text-jewelry-cream">Metals & Styles</h2>
              <p className="text-jewelry-cream/60">Fine-tune your aesthetic foundations.</p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-jewelry-gold mb-6 border-l-2 border-jewelry-gold pl-4">Metals</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {METAL_TYPES.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => handleSelection(4, 'metalTypes', metal)}
                      className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${onboardingData.metalTypes?.includes(metal)
                        ? 'border-jewelry-gold bg-jewelry-gold/20 text-jewelry-gold'
                        : 'border-jewelry-gold/10 bg-jewelry-dark/40 text-jewelry-cream/50 hover:border-jewelry-gold/30'
                        }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-jewelry-gold mb-6 border-l-2 border-jewelry-gold pl-4">Design Philosophy</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DESIGN_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => handleSelection(4, 'designStyles', style)}
                      className={`p-3 rounded-xl border text-[11px] font-bold uppercase tracking-wider transition-all ${onboardingData.designStyles?.includes(style)
                        ? 'border-jewelry-gold bg-jewelry-gold/20 text-jewelry-gold'
                        : 'border-jewelry-gold/10 bg-jewelry-dark/40 text-jewelry-cream/50 hover:border-jewelry-gold/30'
                        }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <Moon className="w-16 h-16 text-jewelry-gold mx-auto" />
              <h2 className="text-3xl font-display font-bold text-jewelry-cream">Cosmic Alignment</h2>
              <p className="text-jewelry-cream/60">Connect your style with your celestial birth.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-jewelry-gold">Sun Sign</label>
                <select
                  className="w-full p-4 rounded-2xl bg-jewelry-dark/60 border border-jewelry-gold/20 text-jewelry-cream focus:border-jewelry-gold transition-all outline-none backdrop-blur-md"
                  value={onboardingData.astrology?.sunSign || ''}
                  onChange={(e) => updateSlideData(5, { astrology: { ...onboardingData.astrology, sunSign: e.target.value } })}
                >
                  <option value="" className="bg-jewelry-dark">Select Zodiac</option>
                  {ZODIAC_SIGNS.map(sign => <option key={sign} value={sign} className="bg-jewelry-dark">{sign}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-jewelry-gold">Birth Month</label>
                <select
                  className="w-full p-4 rounded-2xl bg-jewelry-dark/60 border border-jewelry-gold/20 text-jewelry-cream focus:border-jewelry-gold transition-all outline-none backdrop-blur-md"
                  value={onboardingData.astrology?.birthMonth || ''}
                  onChange={(e) => {
                    const month = e.target.value;
                    const stone = BIRTH_STONES[month as keyof typeof BIRTH_STONES] || '';
                    updateSlideData(5, {
                      astrology: {
                        ...onboardingData.astrology,
                        birthMonth: month,
                        birthStone: stone
                      }
                    });
                  }}
                >
                  <option value="" className="bg-jewelry-dark">Select Month</option>
                  {BIRTH_MONTHS.map(month => <option key={month} value={month} className="bg-jewelry-dark">{month}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-jewelry-gold">Nakshatra (Vedic Star)</label>
                <select
                  className="w-full p-4 rounded-2xl bg-jewelry-dark/60 border border-jewelry-gold/20 text-jewelry-cream focus:border-jewelry-gold transition-all outline-none backdrop-blur-md"
                  value={onboardingData.astrology?.nakshatra || ''}
                  onChange={(e) => updateSlideData(5, { astrology: { ...onboardingData.astrology, nakshatra: e.target.value } })}
                >
                  <option value="" className="bg-jewelry-dark">Optional</option>
                  {NAKSHATRAS.map(n => <option key={n} value={n} className="bg-jewelry-dark">{n}</option>)}
                </select>
              </div>
            </div>

            {onboardingData.astrology?.birthStone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-jewelry-gold/5 border border-jewelry-gold/20 text-center"
              >
                <p className="text-sm font-sans italic text-jewelry-cream/80">
                  Your guardian stone is identified as <span className="text-jewelry-gold font-bold">{onboardingData.astrology.birthStone}</span>
                </p>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[700px] flex flex-col justify-center overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={bgs[currentSlide] || bg1}
            className="w-full h-full object-cover"
            alt="Decoration"
          />
          <div className="absolute inset-0 bg-jewelry-dark/80" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full">
        {/* Progress Tracker */}
        <div className="mb-12 flex justify-center items-center gap-4">
          {[...Array(totalSlides)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-700 ${i <= currentSlide ? 'bg-jewelry-gold' : 'bg-jewelry-gold/10'
                } ${i === currentSlide ? 'w-12' : 'w-3'}`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {renderSlideContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border ${currentSlide === 0
              ? 'opacity-0 pointer-events-none'
              : 'border-jewelry-gold/20 text-jewelry-cream hover:bg-jewelry-gold/10'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (currentSlide === totalSlides - 1) {
                if (isEditMode && onSave) {
                  onSave(onboardingData);
                } else {
                  completeOnboarding();
                }
              } else {
                nextSlide();
              }
            }}
            disabled={isLoading}
            className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-gradient-gold text-jewelry-dark font-black uppercase tracking-widest text-sm shadow-xl shadow-jewelry-gold/20"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-jewelry-dark border-t-transparent rounded-full animate-spin" />
            ) : currentSlide === totalSlides - 1 ? (
              <>
                {isEditMode ? 'Save Preferences' : 'Reveal My Style'}
                <Sparkles className="w-5 h-5" />
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
  );
};

export default OnboardingFlow;