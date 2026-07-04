import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Check, Eye, EyeOff, Copy, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface TwoFactorSetup {
  qrCode: string;
  secret: string;
  backupCodes: string[];
}

export default function TwoFactorSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [setupData, setSetupData] = useState<TwoFactorSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setupTwoFactor();
  }, []);

  const setupTwoFactor = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/v1/auth/enable-2fa', {}, {
        withCredentials: true
      });
      setSetupData(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to setup 2FA');
      navigate('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  const verifySetup = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/v1/auth/verify-2fa-setup', {
        token: verificationCode
      }, {
        withCredentials: true
      });

      toast.success('Two-factor authentication enabled successfully!');
      setStep(3);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = async () => {
    if (!setupData) return;

    const codesText = setupData.backupCodes.join('\n');
    try {
      await navigator.clipboard.writeText(codesText);
      setCopiedCodes(true);
      toast.success('Backup codes copied to clipboard!');
      setTimeout(() => setCopiedCodes(false), 3000);
    } catch (error) {
      toast.error('Failed to copy backup codes');
    }
  };

  const downloadBackupCodes = () => {
    if (!setupData) return;

    const codesText = setupData.backupCodes.join('\n');
    const blob = new Blob([`artisan-alloy 2FA Backup Codes\n\n${codesText}`], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Artisan-Alloy-2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!setupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="animate-pulse text-center">
          <Shield className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Setting up Two-Factor Authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-600">
            {step === 1 && "Scan the QR code with your authenticator app"}
            {step === 2 && "Enter the verification code from your app"}
            {step === 3 && "2FA setup complete!"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${s <= step
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                  }`}
              >
                {s < step ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{s}</span>
                )}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 transition-colors ${s < step ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: QR Code */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex justify-center mb-4">
                {setupData.qrCode && (
                  <img
                    src={setupData.qrCode}
                    alt="QR Code"
                    className="w-48 h-48 rounded-lg shadow-md"
                  />
                )}
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Can't scan? Use this secret key:
                </p>
                <div className="bg-white p-3 rounded-lg font-mono text-sm break-all select-all">
                  {setupData.secret}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-medium text-amber-900 mb-2">
                Save your backup codes
              </h3>
              <p className="text-sm text-amber-700 mb-3">
                These codes can be used if you lose access to your authenticator app.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  {showBackupCodes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
                </button>
                <button
                  onClick={copyBackupCodes}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiedCodes ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadBackupCodes}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              {showBackupCodes && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    {setupData.backupCodes.map((code, index) => (
                      <div key={index} className="text-gray-700">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Continue to Verification
            </button>
          </motion.div>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-gray-50 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit verification code
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl font-mono"
                placeholder="000000"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Back
              </button>
              <button
                onClick={verifySetup}
                disabled={verificationCode.length !== 6 || isLoading}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Verify & Enable'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                2FA Enabled Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Your account is now protected with two-factor authentication.
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Back to Profile
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}