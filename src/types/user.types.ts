export interface UserPreferences {
  // Slide 3: Category Preferences
  categories: string[];
  
  // Slide 4: Body Part Preferences
  bodyParts: string[];
  
  // Slide 5: Metal + Design Preferences
  metalTypes: string[];
  designStyles: string[];
  
  // Slide 6: Astrology Preferences
  astrology: {
    sunSign: string;
    birthMonth: string;
    birthStone: string;
    nakshatra?: string;
  };
  
  // Metadata
  onboardingCompleted: boolean;
  onboardingCompletedAt?: Date;
  lastUpdated: Date;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'manager';
  isEmailVerified: boolean;
  addresses: Address[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isFirstTimeUser: boolean;
}