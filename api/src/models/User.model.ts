import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Interface for User Preferences
export interface IUserPreferences {
  categories: string[];
  bodyParts: string[];
  metalTypes: string[];
  designStyles: string[];
  astrology: {
    sunSign?: string;
    birthMonth?: string;
    birthStone?: string;
    nakshatra?: string;
  };
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;
  lastUpdated: Date;
}

// Interface for User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirm?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'manager';
  isActive: boolean;
  isEmailVerified: boolean;
  addresses: IAddress[];
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  refreshTokens: string[];
  lastLogin?: Date;
  
  // Two-Factor Authentication fields
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
  twoFactorTemporaryToken?: string;
  twoFactorTemporaryTokenExpires?: Date;
  
  // User preferences and onboarding
  preferences: IUserPreferences;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
  createEmailVerificationToken(): string;
  createTwoFactorSecret(): string;
  generateBackupCodes(): string[];
  verifyTwoFactorToken(token: string): boolean;
  createTemporaryTwoFactorToken(): string;
  fullName: string;
}

// Interface for Address subdocument
export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Address Schema
const addressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home',
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required for address'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required for address'],
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    default: 'India',
    trim: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// User Schema
const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s-]{10,}$/, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(this: IUser, el: string): boolean {
          return el === this.password;
        },
        message: 'Passwords do not match',
      },
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'manager'],
      default: 'customer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [addressSchema],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    refreshTokens: [String],
    lastLogin: Date,
    
    // Two-Factor Authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false, // Don't include in queries by default
    },
    twoFactorBackupCodes: {
      type: [String],
      select: false,
    },
    twoFactorTemporaryToken: {
      type: String,
      select: false,
    },
    twoFactorTemporaryTokenExpires: {
      type: Date,
      select: false,
    },
    
    // User preferences and onboarding
    preferences: {
      categories: [String],
      bodyParts: [String],
      metalTypes: [String],
      designStyles: [String],
      astrology: {
        sunSign: String,
        birthMonth: String,
        birthStone: String,
        nakshatra: String,
      },
      onboardingCompleted: {
        type: Boolean,
        default: false,
      },
      onboardingCompletedAt: Date,
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser): string {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better query performance (email index already created by unique constraint)
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre<IUser>('save', async function(next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  
  next();
});

// Pre-save middleware to set passwordChangedAt
userSchema.pre<IUser>('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // Subtract 1 second to ensure token is created after password change
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number): boolean {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token expires in 10 minutes
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

// Instance method to create email verification token
userSchema.methods.createEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Token expires in 24 hours
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return verificationToken;
};

// Instance method to create 2FA secret
userSchema.methods.createTwoFactorSecret = function(): string {
  const speakeasy = require('speakeasy');
  const secret = speakeasy.generateSecret({
    name: `artisan-alloy (${this.email})`,
    issuer: 'artisan-alloy',
    length: 32,
  });
  
  this.twoFactorSecret = secret.base32;
  this.twoFactorBackupCodes = this.generateBackupCodes();
  
  return secret.otpauth_url;
};

// Instance method to generate backup codes
userSchema.methods.generateBackupCodes = function(): string[] {
  const crypto = require('crypto');
  const backupCodes = [];
  
  for (let i = 0; i < 10; i++) {
    backupCodes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  
  return backupCodes;
};

// Instance method to verify 2FA token
userSchema.methods.verifyTwoFactorToken = function(token: string): boolean {
  const speakeasy = require('speakeasy');
  
  return speakeasy.totp.verify({
    secret: this.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 2, // Allow 2 steps of clock drift
  });
};

// Instance method to create temporary 2FA token for login
userSchema.methods.createTemporaryTwoFactorToken = function(): string {
  const crypto = require('crypto');
  const tempToken = crypto.randomBytes(32).toString('hex');
  
  this.twoFactorTemporaryToken = crypto
    .createHash('sha256')
    .update(tempToken)
    .digest('hex');
  
  // Token expires in 5 minutes
  this.twoFactorTemporaryTokenExpires = new Date(Date.now() + 5 * 60 * 1000);
  
  return tempToken;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
