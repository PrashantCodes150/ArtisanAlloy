import { Router } from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  refreshToken,
  getMe,
  updatePassword,
  getVerificationStatus,
  enableTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  verifyTwoFactorLogin,
  generateBackupCodes,
  googleAuth,
  googleAuthCallback,
} from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa-login', verifyTwoFactorLogin);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/refresh-token', refreshToken);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.patch('/update-password', updatePassword);
router.get('/verification-status', getVerificationStatus);

// 2FA routes
router.post('/enable-2fa', enableTwoFactor);
router.post('/verify-2fa-setup', verifyTwoFactorSetup);
router.post('/disable-2fa', disableTwoFactor);
router.post('/generate-backup-codes', generateBackupCodes);

export default router;
