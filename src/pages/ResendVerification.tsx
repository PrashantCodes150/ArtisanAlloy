import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import authService from '../services/auth.service';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resendVerificationEmail(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-jewelry-cream mb-4">
              Check Your Email
            </h1>
            <p className="text-jewelry-cream/70 font-sans mb-2">
              If an account exists with <span className="text-jewelry-gold">{email}</span> and it's not yet verified, you'll receive a verification link shortly.
            </p>
            <p className="text-jewelry-cream/50 text-sm font-sans mb-8">
              Don't forget to check your spam folder!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
                className="w-full py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans font-semibold hover:bg-jewelry-gold/10 transition-all"
              >
                Send to Different Email
              </button>
              <Link
                to="/"
                className="block w-full py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-jewelry-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-jewelry-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold text-jewelry-cream mb-2">
              Resend Verification Email
            </h1>
            <p className="text-jewelry-cream/70 font-sans text-sm">
              Enter your email address and we'll send you a new verification link.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-sm font-sans">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-jewelry-cream/60 mb-2 font-sans">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-jewelry-dark-light border border-jewelry-gold/30 text-jewelry-cream font-sans focus:outline-none focus:border-jewelry-gold transition-colors"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Verification Email
                </>
              )}
            </button>
          </form>

          {/* Back Link */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-jewelry-cream/60 hover:text-jewelry-gold transition-colors font-sans text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
