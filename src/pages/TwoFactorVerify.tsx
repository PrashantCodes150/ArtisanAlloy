import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function TwoFactorVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempToken, setTempToken] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login-required');
    } else {
      setTempToken(token);
    }
  }, [searchParams, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = useBackupCode ? backupCode : verificationCode;

    if (!code) {
      toast.error(useBackupCode ? 'Please enter a backup code' : 'Please enter a verification code');
      return;
    }

    try {
      setIsLoading(true);
      const payload: any = { tempToken };

      if (useBackupCode) {
        payload.backupCode = code;
      } else {
        payload.twoFactorToken = code;
      }

      const response = await axios.post('/api/v1/auth/verify-2fa-login', payload, {
        withCredentials: true
      });

      // Store tokens in local storage
      if (response.data.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }

      toast.success('Login successful!');

      // Redirect to intended page or dashboard
      const redirectTo = searchParams.get('redirect') || '/profile';
      navigate(redirectTo);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login-required');
  };

  const toggleCodeType = () => {
    setVerificationCode('');
    setBackupCode('');
    setUseBackupCode(!useBackupCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-amber-100 relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={handleBackToLogin}
            className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-rose-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your authentication code to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                {useBackupCode ? 'Backup Code' : 'Verification Code'}
              </label>
              <button
                type="button"
                onClick={toggleCodeType}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                {useBackupCode ? 'Use App Code' : 'Use Backup Code'}
              </button>
            </div>

            {useBackupCode ? (
              <input
                type="text"
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                placeholder="Enter 8-character backup code"
                maxLength={8}
              />
            ) : (
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl font-mono"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
            )}
          </div>

          {useBackupCode && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Backup codes can only be used once. Keep them safe!
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (!verificationCode && !backupCode)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 text-white rounded-lg hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Key className="w-5 h-5" />
                Verify & Login
              </>
            )}
          </button>
        </form>

        {/* Help Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Can't access your authenticator app?
            </p>
            <button
              onClick={() => setUseBackupCode(true)}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Use a backup code
            </button>
          </div>
        </div>

        {/* Instructions */}
        {!useBackupCode && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">How to get your code:</h3>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Open your authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>2. Find the entry for "artisan-alloy"</li>
              <li>3. Enter the 6-digit code shown</li>
            </ol>
          </div>
        )}
      </motion.div>
    </div>
  );
}