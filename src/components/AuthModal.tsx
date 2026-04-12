import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import jewelryAuthBg from '../assets/images/new_jewel imag/photo_2026-01-16_19-07-25.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { toast } from 'react-toastify';

const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthModalOpen, authModalView, closeAuthModal, login, register, isLoading } = useAuth();
  const [view, setView] = useState<'login' | 'signup'>(authModalView);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Sync internal view with context view when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setView(authModalView);
    }
  }, [isAuthModalOpen, authModalView]);

  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login(loginData);
      toast.success('Welcome back to the elite circle.');
      closeAuthModal();

      // Check if user needs onboarding (default to true for new/missing preferences)
      const needsOnboarding = !user?.preferences?.onboardingCompleted;
      if (needsOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'The gates remain closed. Please verify your credentials.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Excellence');
      return;
    }

    try {
      // Backend expects passwordConfirm, frontend has confirmPassword
      // Map confirmPassword to passwordConfirm before sending
      const { confirmPassword, ...restData } = signupData;
      const registerData = {
        ...restData,
        passwordConfirm: confirmPassword,
      };
      
      const user = await register(registerData);
      toast.success('Welcome to the elite circle of connoisseurs.');
      closeAuthModal();

      // New users always need onboarding
      navigate('/onboarding');
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.message || 'Registration failed. We were unable to create your identity.');
    }
  };

  const handleGoogleAuth = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    setSignupData({ ...signupData, phone: numericValue });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Auth Card Container */}
      <div
        className="relative w-full max-w-[500px] overflow-hidden rounded-[2.5rem] border border-jewelry-gold/30 shadow-2xl shadow-jewelry-gold/20 flex flex-col animate-in zoom-in-95 duration-500"
        style={{ minHeight: '600px' }}
      >
        {/* Jewelry Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={jewelryAuthBg}
            alt="Jewelry Background"
            className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-10000 ease-linear"
          />
          <div className="absolute inset-0 bg-jewelry-dark/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-jewelry-dark/40 via-jewelry-dark/60 to-jewelry-dark/95"></div>
        </div>

        {/* Card Content Overlay */}
        <div className="relative z-10 flex flex-col h-full p-8 md:p-10 pt-16">
          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-6 right-6 p-2 rounded-full glass-light hover:bg-jewelry-rose/20 transition-all z-20 group"
          >
            <X className="w-6 h-6 text-jewelry-cream group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent mb-2">
              {view === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="font-sans text-jewelry-cream/60 text-sm">
              {view === 'login'
                ? 'Login to manage your premium collections'
                : 'Join our elite circle of fine jewelry connoisseurs'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* Login Form */}
            {view === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jewelry-gold/50 group-focus-within:text-jewelry-gold transition-colors" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-2 focus:ring-jewelry-gold/30 focus:border-jewelry-gold/30 backdrop-blur-md transition-all"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jewelry-gold/50 group-focus-within:text-jewelry-gold transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-2 focus:ring-jewelry-gold/30 focus:border-jewelry-gold/30 backdrop-blur-md transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-jewelry-cream/40 hover:text-jewelry-gold transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center px-1">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 rounded-md border border-jewelry-gold/40 bg-jewelry-dark/40 appearance-none checked:bg-jewelry-gold transition-all cursor-pointer"
                      />
                      {rememberMe && <X className="absolute inset-0 w-3.5 h-3.5 m-auto text-jewelry-dark stroke-[4]" />}
                    </div>
                    <span className="font-sans text-xs text-jewelry-cream/60 group-hover:text-jewelry-cream transition-colors">Remember me</span>
                  </label>
                  <button type="button" className="font-sans text-xs text-jewelry-gold hover:text-jewelry-gold-light transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-gold text-jewelry-dark font-sans font-bold shadow-lg shadow-jewelry-gold/20 hover:shadow-jewelry-gold/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-jewelry-dark border-t-transparent rounded-full animate-spin"></div>
                      Authenticating...
                    </div>
                  ) : 'Sign In'}
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-jewelry-gold/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-transparent text-jewelry-cream/40 uppercase tracking-widest">Or Securely</span>
                  </div>
                </div>

                <GoogleAuthButton onClick={handleGoogleAuth} loading={isLoading} />

                <p className="text-center font-sans text-sm text-jewelry-cream/60 pt-2">
                  New to F Jewelry?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className="text-jewelry-gold font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </form>
            )}

            {/* Signup Form */}
            {view === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jewelry-gold/50 transition-colors" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={signupData.firstName}
                      onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-1 focus:ring-jewelry-gold/40 backdrop-blur-md transition-all text-sm"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-1 focus:ring-jewelry-gold/40 backdrop-blur-md transition-all text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jewelry-gold/50 transition-colors" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-1 focus:ring-jewelry-gold/40 backdrop-blur-md transition-all text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jewelry-gold/50 transition-colors" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={signupData.phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-1 focus:ring-jewelry-gold/40 backdrop-blur-md transition-all text-sm"
                    pattern="[0-9]*"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jewelry-gold/50 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-1 focus:ring-jewelry-gold/40 backdrop-blur-md transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-jewelry-cream/30"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-jewelry-gold/50 transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-jewelry-dark/40 border border-jewelry-gold/20 text-jewelry-cream placeholder-jewelry-cream/30 focus:outline-none focus:ring-1 focus:ring-jewelry-gold/40 backdrop-blur-md transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-jewelry-cream/30"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-start gap-2.5 px-1 py-1">
                  <input
                    type="checkbox"
                    id="modal-terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-sm border border-jewelry-gold/40 bg-jewelry-dark/40 transition-all cursor-pointer"
                    required
                  />
                  <label htmlFor="modal-terms" className="font-sans text-[11px] text-jewelry-cream/50 leading-tight">
                    By joining, I agree to the <span className="text-jewelry-gold underline cursor-pointer">Terms of Excellence</span> and <span className="text-jewelry-gold underline cursor-pointer">Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl bg-gradient-gold text-jewelry-dark font-sans font-bold shadow-lg shadow-jewelry-gold/20 hover:shadow-jewelry-gold/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-jewelry-dark border-t-transparent rounded-full animate-spin"></div>
                      Creating Identity...
                    </div>
                  ) : 'Create Your Identity'}
                </button>

                <GoogleAuthButton onClick={handleGoogleAuth} loading={isLoading} />

                <p className="text-center font-sans text-xs text-jewelry-cream/60 pt-1">
                  Already an elite member?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-jewelry-gold font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;