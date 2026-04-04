import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils';

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      passReqToCallback: true,
    },
    async (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          // User exists, update avatar if not set
          if (!user.avatar && profile.photos?.[0].value) {
            user.avatar = profile.photos[0].value;
            await user.save({ validateBeforeSave: false });
          }

          // Check if user is active
          if (!user.isActive) {
            return done(new Error('Your account has been deactivated. Please contact support.'), null);
          }

          return done(null, user);
        }

        // Create new user from Google profile
        user = await User.create({
          firstName: profile.name?.givenName || 'User',
          lastName: profile.name?.familyName || '',
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
          password: Math.random().toString(36).slice(-8), // Random password for Google users
          passwordConfirm: Math.random().toString(36).slice(-8),
          isEmailVerified: true, // Google accounts are pre-verified
          loginMethod: 'google',
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;