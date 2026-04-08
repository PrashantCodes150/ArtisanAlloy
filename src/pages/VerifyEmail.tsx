import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import authService from '../services/auth.service';
import { useAuth } from '../context';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 text-center">
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 bg-jewelry-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-jewelry-gold animate-spin" />
              </div>
              <h1 className="font-display text-2xl font-bold text-jewelry-cream mb-4">
                Verifying Your Email
              </h1>
              <p className="text-jewelry-cream/70 font-sans">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-green-400 mb-4">
                Email Verified!
              </h1>
              <p className="text-jewelry-cream/70 font-sans mb-8">
                {message}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (isAuthenticated && user && !user.preferences?.onboardingCompleted) {
                      navigate('/onboarding');
                    } else {
                      navigate('/dashboard');
                    }
                  }}
                  className="w-full py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all"
                >
                  {isAuthenticated && user && !user.preferences?.onboardingCompleted ? 'Complete Your Profile' : 'Go to Dashboard'}
                </button>
                <button
                  onClick={() => navigate('/collection')}
                  className="w-full py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans font-semibold hover:bg-jewelry-gold/10 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="font-display text-2xl font-bold text-red-400 mb-4">
                Verification Failed
              </h1>
              <p className="text-jewelry-cream/70 font-sans mb-8">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/resend-verification"
                  className="w-full py-3 rounded-lg bg-gradient-gold text-jewelry-dark font-sans font-semibold hover:shadow-lg hover:shadow-jewelry-gold/30 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Resend Verification Email
                </Link>
                <Link
                  to="/"
                  className="block w-full py-3 rounded-lg border border-jewelry-gold/30 text-jewelry-cream font-sans font-semibold hover:bg-jewelry-gold/10 transition-all"
                >
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
