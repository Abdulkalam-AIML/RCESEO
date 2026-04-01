require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const connectDB = require('./src/config/db');
require('./src/config/passport');

const authRoutes = require('./src/routes/authRoutes');
const rewriteRoutes = require('./src/routes/rewriteRoutes');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// ── Connect Database ───────────────────────────────────────────────────────────
connectDB();

// ── Security Middleware ────────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 500,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ── CORS — allow local + production Vercel URL ─────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://rceseo.vercel.app',
  'https://rceseo-optimize.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl / Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(passport.initialize());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rewrite', rewriteRoutes);

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }[dbState] || 'unknown';

  res.json({
    status: 'ok',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'production',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    version: '1.1.0', // Incremented version for serverless fix
  });
});

// ── Debug Route (URGENT FIX) ──────────────────────────────────────────────────
app.get('/api/debug', async (req, res) => {
  try {
    await connectDB();
    res.json({
      mongo: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
      jwt: !!process.env.JWT_SECRET,
      google: !!process.env.GOOGLE_CLIENT_ID,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      client: process.env.CLIENT_URL,
      node_env: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(500).json({
      crash: error.message,
      stack: isProd ? 'HIDDEN' : error.stack,
    });
  }
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  if (!isProd) console.error('💥 Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: isProd ? 'Internal server error' : err.message,
  });
});

// ── Start Server (Local Development ONLY) ─────────────────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
