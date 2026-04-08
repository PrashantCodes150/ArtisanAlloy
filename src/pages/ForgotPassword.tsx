import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import authService from '../services/auth.service';

const ForgotPassword = () => {
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
      await authService.forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-amber-100">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-green-600 bg-clip-text text-transparent mb-4">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-2">
              If an account exists with <span className="text-amber-600 font-semibold">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              The link will expire in 10 minutes. Don't forget to check your spam folder!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
                className="w-full py-3 rounded-lg border border-amber-300 text-amber-700 font-semibold hover:bg-amber-50 transition-all"
              >
                Try Different Email
              </button>
              <Link
                to="/"
                className="block w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 text-white font-semibold hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 shadow-lg transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-rose-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-sm">
              No worries! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 shadow-lg transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back Link */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-amber-600 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
