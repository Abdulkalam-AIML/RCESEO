const express = require('express');
const passport = require('passport');
const { register, login, getMe, googleCallback, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Email/Password auth
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  googleCallback
);

module.exports = router;
