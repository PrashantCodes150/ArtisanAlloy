// Temporarily disabled to fix build issues
// import { Router } from 'express';
// import {
//   scheduleRecoveryEmail,
//   getAbandonedCartAnalytics,
//   trackEmailEvent,
// } from '../controllers/abandonedCart.controller';
// import { protect, restrictTo } from '../middleware/auth.middleware';

// const router = Router();

// TODO: Fix and re-enable these routes
// router.post('/schedule-recovery', protect, restrictTo('admin'), scheduleRecoveryEmail);
// router.get('/analytics', protect, restrictTo('admin'), getAbandonedCartAnalytics);
// router.post('/track-email-event', trackEmailEvent);

export default {} as any;