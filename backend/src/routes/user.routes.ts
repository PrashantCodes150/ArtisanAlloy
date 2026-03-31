import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUserStats,
  getCompleteProfile,
  updatePreferences,
  completeOnboarding,
} from '../controllers/user.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(protect);

// User routes (for logged-in users)
router.get('/me', updateMe); // Get current user - handled by auth
router.patch('/update-me', updateMe);
router.delete('/delete-me', deleteMe);
router.get('/stats', getUserStats);
router.get('/profile-complete', getCompleteProfile);
router.patch('/preferences', updatePreferences);
router.patch('/complete-onboarding', completeOnboarding);

// Address management
router.post('/addresses', addAddress);
router.patch('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);
router.patch('/addresses/:addressId/set-default', setDefaultAddress);

// Admin only routes
router.use(restrictTo('admin', 'manager'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
