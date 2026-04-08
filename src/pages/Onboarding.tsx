import React, { useState } from 'react';
import { ArrowRight, Star, Heart, ShoppingCart, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = React.useState({
    jewelryType: '',
    budget: '',
    occasion: '',
    style: ''
  });
  
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding and redirect to home
      navigate('/');
    }
  };

  const handleSkip = () => {
    // Skip onboarding and go to home
    navigate('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-jewelry-dark via-jewelry-dark/95 to-jewelry-dark-light">
        <div className="w-full max-w-md glass rounded-2xl p-8 border border-jewelry-gold/20 shadow-2xl shadow-jewelry-gold/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-jewelry-dark" />
            </div>
            <h1 className="font-display text-3xl font-bold text-jewelry-cream mb-4">
              Welcome to F Jewelry!
            </h1>
            <p className="font-sans text-jewelry-cream/80 mb-6">
              Let's personalize your experience. We'll help you discover jewelry that matches your style.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-jewelry-dark-light">
              <div className="w-8 h-8 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-jewelry-gold" />
              </div>
              <span className="font-sans text-jewelry-cream">Personalized Recommendations</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-jewelry-dark-light">
              <div className="w-8 h-8 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-jewelry-gold" />
              </div>
              <span className="font-sans text-jewelry-cream">Exclusive Offers & Discounts</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-jewelry-dark-light">
              <div className="w-8 h-8 rounded-full bg-jewelry-gold/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-jewelry-gold" />
              </div>
              <span className="font-sans text-jewelry-cream">Early Access to New Collections</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Jewelry Type Preference
  if (step === 2) {
    const jewelryTypes = [
      { id: 'necklaces', name: 'Necklaces', icon: '💎' },
      { id: 'earrings', name: 'Earrings', icon: '👂' },
      { id: 'rings', name: 'Rings', icon: '💍' },
      { id: 'bracelets', name: 'Bracelets', icon: '⌚' },
      { id: 'anklets', name: 'Anklets', icon: '👣' },
      { id: 'sets', name: 'Sets', icon: '🎁' }
    ];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-jewelry-dark via-jewelry-dark/95 to-jewelry-dark-light">
        <div className="w-full max-w-md glass rounded-2xl p-8 border border-jewelry-gold/20 shadow-2xl shadow-jewelry-gold/20">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-jewelry-gold/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">1</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-jewelry-cream mb-2">
              What Type of Jewelry Interests You Most?
            </h2>
            <p className="font-sans text-jewelry-cream/60">
              Select your preferred jewelry type
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {jewelryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleInputChange('jewelryType', type.id)}
                className={`p-4 rounded-xl border transition-all ${
                  preferences.jewelryType === type.id
                    ? 'border-jewelry-gold bg-jewelry-gold/10'
                    : 'border-jewelry-gold/20 hover:border-jewelry-gold/40'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-sans text-sm text-jewelry-cream">{type.name}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!preferences.jewelryType}
              className={`flex-1 py-3 rounded-lg font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                preferences.jewelryType
                  ? 'bg-gradient-gold text-jewelry-dark hover:shadow-lg hover:shadow-jewelry-gold/30'
                  : 'bg-jewelry-dark-light text-jewelry-cream/50 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Budget Preference
  if (step === 3) {
    const budgets = [
      { id: 'under-5k', name: 'Under ₹5,000', range: '<5000' },
      { id: '5k-10k', name: '₹5,000 - ₹10,000', range: '5000-10000' },
      { id: '10k-25k', name: '₹10,000 - ₹25,000', range: '10000-25000' },
      { id: '25k-50k', name: '₹25,000 - ₹50,000', range: '25000-50000' },
      { id: 'above-50k', name: 'Above ₹50,000', range: '>50000' }
    ];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-jewelry-dark via-jewelry-dark/95 to-jewelry-dark-light">
        <div className="w-full max-w-md glass rounded-2xl p-8 border border-jewelry-gold/20 shadow-2xl shadow-jewelry-gold/20">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-jewelry-gold/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">2</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-jewelry-cream mb-2">
              What's Your Preferred Budget Range?
            </h2>
            <p className="font-sans text-jewelry-cream/60">
              Helps us recommend suitable products
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {budgets.map((budget) => (
              <button
                key={budget.id}
                onClick={() => handleInputChange('budget', budget.range)}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  preferences.budget === budget.range
                    ? 'border-jewelry-gold bg-jewelry-gold/10'
                    : 'border-jewelry-gold/20 hover:border-jewelry-gold/40'
                }`}
              >
                <div className="font-sans text-jewelry-cream font-medium">{budget.name}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!preferences.budget}
              className={`flex-1 py-3 rounded-lg font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                preferences.budget
                  ? 'bg-gradient-gold text-jewelry-dark hover:shadow-lg hover:shadow-jewelry-gold/30'
                  : 'bg-jewelry-dark-light text-jewelry-cream/50 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Occasion & Style
  if (step === 4) {
    const occasions = [
      { id: 'daily', name: 'Daily Wear', icon: '☀️' },
      { id: 'wedding', name: 'Wedding', icon: '💒' },
      { id: 'festival', name: 'Festivals', icon: '🎉' },
      { id: 'party', name: 'Parties', icon: '🥳' },
      { id: 'formal', name: 'Formal Events', icon: '👔' },
      { id: 'casual', name: 'Casual', icon: '👕' }
    ];

    const styles = [
      { id: 'traditional', name: 'Traditional', icon: '🏛️' },
      { id: 'modern', name: 'Modern', icon: '✨' },
      { id: 'minimal', name: 'Minimal', icon: '🔸' },
      { id: 'vintage', name: 'Vintage', icon: '🕰️' },
      { id: 'bohemian', name: 'Bohemian', icon: '🌿' },
      { id: 'contemporary', name: 'Contemporary', icon: '🎨' }
    ];

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-jewelry-dark via-jewelry-dark/95 to-jewelry-dark-light">
        <div className="w-full max-w-md glass rounded-2xl p-8 border border-jewelry-gold/20 shadow-2xl shadow-jewelry-gold/20">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-jewelry-gold/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">3</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-jewelry-cream mb-2">
              When & How Do You Wear Jewelry?
            </h2>
            <p className="font-sans text-jewelry-cream/60 mb-6">
              Select occasions and styles you prefer
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-sans font-semibold text-jewelry-cream mb-3">Occasions</h3>
            <div className="grid grid-cols-3 gap-2">
              {occasions.map((occasion) => (
                <button
                  key={occasion.id}
                  onClick={() => handleInputChange('occasion', occasion.id)}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    preferences.occasion === occasion.id
                      ? 'border-jewelry-gold bg-jewelry-gold/10'
                      : 'border-jewelry-gold/20 hover:border-jewelry-gold/40'
                  }`}
                >
                  <div className="text-lg">{occasion.icon}</div>
                  <div className="font-sans mt-1">{occasion.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-sans font-semibold text-jewelry-cream mb-3">Styles</h3>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleInputChange('style', style.id)}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    preferences.style === style.id
                      ? 'border-jewelry-gold bg-jewelry-gold/10'
                      : 'border-jewelry-gold/20 hover:border-jewelry-gold/40'
                  }`}
                >
                  <div className="text-lg">{style.icon}</div>
                  <div className="font-sans mt-1">{style.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans hover:bg-jewelry-gold/10 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
            >
              Complete Setup
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final step - should not reach here
  return null;
};

export default OnboardingFlow;