import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { APIFeatures } from '../utils/apiFeatures';

// Helper to filter allowed fields
const filterObj = (obj: Record<string, any>, ...allowedFields: string[]) => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

/**
 * Get all users (Admin only)
 * GET /api/v1/users
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  const total = await User.countDocuments();

  res.status(200).json({
    status: 'success',
    results: users.length,
    total,
    data: { users },
  });
});

/**
 * Get single user (Admin only)
 * GET /api/v1/users/:id
 */
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

/**
 * Update user (Admin only)
 * PATCH /api/v1/users/:id
 */
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Don't allow password update through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

/**
 * Delete user (Admin only)
 * DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Update current user profile
 * PATCH /api/v1/users/update-me
 */
export const updateMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Don't allow password update through this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Use /update-password.', 400));
  }

  // Filter out unwanted fields
  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'phone', 'avatar');

  const updatedUser = await User.findByIdAndUpdate(req.user!._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

/**
 * Deactivate current user account
 * DELETE /api/v1/users/delete-me
 */
export const deleteMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await User.findByIdAndUpdate(req.user!._id, { isActive: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

/**
 * Add new address
 * POST /api/v1/users/addresses
 */
export const addAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // If this is the first address or marked as default, set it as default
  if (user.addresses.length === 0 || req.body.isDefault) {
    // Reset all other addresses to non-default
    user.addresses.forEach((addr) => (addr.isDefault = false));
    req.body.isDefault = true;
  }

  user.addresses.push(req.body);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    message: 'Address added successfully',
    data: { addresses: user.addresses },
  });
});

/**
 * Update address
 * PATCH /api/v1/users/addresses/:addressId
 */
export const updateAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const addressIndex = user.addresses.findIndex(
    (addr) => addr._id?.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }

  // If setting as default, reset others
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  // Update the address
  Object.assign(user.addresses[addressIndex], req.body);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Address updated successfully',
    data: { addresses: user.addresses },
  });
});

/**
 * Delete address
 * DELETE /api/v1/users/addresses/:addressId
 */
export const deleteAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const addressIndex = user.addresses.findIndex(
    (addr) => addr._id?.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }

  const wasDefault = user.addresses[addressIndex].isDefault;
  user.addresses.splice(addressIndex, 1);

  // If deleted address was default, set first address as default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully',
    data: { addresses: user.addresses },
  });
});

/**
 * Set address as default
 * PATCH /api/v1/users/addresses/:addressId/set-default
 */
export const setDefaultAddress = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const addressIndex = user.addresses.findIndex(
    (addr) => addr._id?.toString() === req.params.addressId
  );

  if (addressIndex === -1) {
    return next(new AppError('Address not found', 404));
  }

  // Reset all addresses and set the selected one as default
  user.addresses.forEach((addr) => (addr.isDefault = false));
  user.addresses[addressIndex].isDefault = true;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Default address updated',
    data: { addresses: user.addresses },
  });
});

/**
 * Get user statistics for dashboard
 * GET /api/v1/users/stats
 */
export const getUserStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user's orders count (simplified for demo)
  const ordersCount = 0; // Would normally fetch from orders collection
  
  // Calculate account age
  const accountAge = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = {
    totalOrders: ordersCount,
    activeOrders: 0, // Would be calculated from orders
    wishlistItems: 0, // Would be fetched from wishlist
    savedAddresses: user.addresses?.length || 0,
    accountAge: accountAge,
    isEmailVerified: user.isEmailVerified,
    memberSince: user.createdAt,
    totalSpent: 0, // Would be calculated from orders
  };

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

/**
 * Get user's complete profile for dashboard
 * GET /api/v1/users/profile-complete
 */
export const getCompleteProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { 
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        preferences: user.preferences,
        createdAt: user.createdAt,
        addresses: user.addresses || [],
      }
    },
  });
});

/**
 * Update user preferences
 * PATCH /api/v1/users/preferences
 */
export const updatePreferences = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Update preferences with new data
  const updatedPreferences = {
    ...user.preferences,
    ...req.body,
    lastUpdated: new Date(),
  };

  user.preferences = updatedPreferences;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Preferences updated successfully',
    data: { user },
  });
});

/**
 * Complete onboarding
 * PATCH /api/v1/users/complete-onboarding
 */
export const completeOnboarding = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.user!._id);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Update preferences with onboarding completion
  user.preferences = {
    ...user.preferences,
    ...req.body,
    onboardingCompleted: true,
    onboardingCompletedAt: new Date(),
    lastUpdated: new Date(),
  };

  await user.save({ validateBeforeSave: false });

  logger.info(`Onboarding completed for user: ${user.email}`);

  res.status(200).json({
    status: 'success',
    message: 'Onboarding completed successfully!',
    data: { user },
  });
});