import { useState, useCallback } from 'react';
import { useAuth } from '../context';
import type { UserPreferences } from '../types/user.types';

interface OnboardingData {
  categories: string[];
  bodyParts: string[];
  metalTypes: string[];
  designStyles: string[];
  astrology: {
    sunSign: string;
    birthMonth: string;
    birthStone: string;
    nakshatra?: string;
  };
}

export const useOnboarding = () => {
  const { completeOnboarding, isLoading } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    categories: [],
    bodyParts: [],
    metalTypes: [],
    designStyles: [],
    astrology: {
      sunSign: '',
      birthMonth: '',
      birthStone: '',
      nakshatra: ''
    }
  });

  const totalSlides = 6;

  const updateSlideData = useCallback((slide: number, data: any) => {
    setOnboardingData(prev => {
      const updated = { ...prev };

      switch (slide) {
        case 3:
          updated.categories = data;
          break;
        case 4:
          updated.bodyParts = data;
          break;
        case 5:
          updated.metalTypes = data.metalTypes || [];
          updated.designStyles = data.designStyles || [];
          break;
        case 6:
          updated.astrology = { ...updated.astrology, ...data };
          break;
      }

      return updated;
    });
  }, []);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const goToSlide = useCallback((slide: number) => {
    if (slide >= 0 && slide < totalSlides) {
      setCurrentSlide(slide);
    }
  }, []);

  const completeOnboardingFlow = useCallback(async () => {
    try {
      const preferences: UserPreferences = {
        ...onboardingData,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
        lastUpdated: new Date()
      };

      await completeOnboarding(preferences);
      return true;
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      return false;
    }
  }, [onboardingData, completeOnboarding]);

  const resetOnboarding = useCallback(() => {
    setCurrentSlide(0);
    setOnboardingData({
      categories: [],
      bodyParts: [],
      metalTypes: [],
      designStyles: [],
      astrology: {
        sunSign: '',
        birthMonth: '',
        birthStone: '',
        nakshatra: ''
      }
    });
  }, []);

  return {
    currentSlide,
    totalSlides,
    onboardingData,
    isLoading,
    nextSlide,
    prevSlide,
    goToSlide,
    updateSlideData,
    completeOnboarding: completeOnboardingFlow,
    resetOnboarding
  };
};