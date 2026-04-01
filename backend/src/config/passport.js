const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken } = require('../middleware/auth');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.VERCEL
        ? "https://rceseo-api.vercel.app/api/auth/google/callback"
        : process.env.GOOGLE_CALLBACK_URL || "http://localhost:5001/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const profileImage = profile.photos?.[0]?.value || '';

        // 1. User already has Google linked
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Email exists — link Google account
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          user.profileImage = user.profileImage || profileImage;
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // 3. Brand new user — create from Google profile
        user = await User.create({
          fullName: profile.displayName,
          email,
          googleId: profile.id,
          profileImage,
        });

        // 4. Record session
        const token = generateToken(user._id);
        await Session.createSession(user._id, token, 'google').catch(() => {});

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
