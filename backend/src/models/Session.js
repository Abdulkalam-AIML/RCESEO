const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    loginMethod: {
      type: String,
      enum: ['email', 'google'],
      required: true,
      default: 'email',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userAgent: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound Indexes ─────────────────────────────────────────────────────────
sessionSchema.index({ userId: 1, isRevoked: 1 });
sessionSchema.index({ token: 1 }, { unique: true });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-cleanup

// ─── Static: create new session ───────────────────────────────────────────────
sessionSchema.statics.createSession = function (userId, token, loginMethod, expiresInDays = 7) {
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  return this.create({ userId, token, loginMethod, expiresAt });
};

// ─── Static: revoke all sessions for user (logout all devices) ───────────────
sessionSchema.statics.revokeAllForUser = function (userId) {
  return this.updateMany({ userId, isRevoked: false }, { isRevoked: true });
};

// ─── Static: validate a token ────────────────────────────────────────────────
sessionSchema.statics.validateToken = function (token) {
  return this.findOne({
    token,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).populate('userId');
};

/*
 * Sample Document:
 * {
 *   "_id": ObjectId("..."),
 *   "userId": ObjectId("<user_id>"),
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "loginMethod": "google",
 *   "expiresAt": ISODate("2025-04-08T06:15:00.000Z"),
 *   "userAgent": "Mozilla/5.0 ...",
 *   "ipAddress": "192.168.1.1",
 *   "isRevoked": false,
 *   "createdAt": ISODate("2025-04-01T06:15:00.000Z")
 * }
 *
 * MongoDB TTL Index:
 *   db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
 *   → Automatically deletes documents after expiresAt passes
 */

module.exports = mongoose.model('Session', sessionSchema);
