const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, fullName, email, password } = req.body;
    const displayName = fullName || name;

    if (!displayName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ fullName: displayName, email, password });
    const token = generateToken(user._id);

    // Record session
    await Session.createSession(user._id, token, 'email').catch(() => {});

    res.status(201).json({ success: true, token, user: user.toPublic() });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Record session
    await Session.createSession(user._id, token, 'email').catch(() => {});

    res.json({ success: true, token, user: user.toPublic() });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  const user = req.user;
  res.json({
    success: true,
    user: user.toPublic ? user.toPublic() : {
      _id: user._id,
      fullName: user.fullName,
      name: user.fullName,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Google OAuth callback — generate JWT and redirect with token
// @route   GET /api/auth/google/callback
const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user._id);

    // Record session for Google login
    await Session.createSession(req.user._id, token, 'google').catch(() => {});

    // Redirect to frontend Google success page with token in query string
    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

// @desc    Logout — revoke all sessions for user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    await Session.revokeAllForUser(req.user._id).catch(() => {});
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.json({ success: true, message: 'Logged out' });
  }
};

module.exports = { register, login, getMe, googleCallback, logout };
