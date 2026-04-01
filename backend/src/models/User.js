const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // index created via schema.index() below
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    googleId: {
      type: String,
    },
    profileImage: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // createdAt + updatedAt auto-managed
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// email: unique index auto-created from schema definition
userSchema.index({ googleId: 1 }, { sparse: true }); // sparse unique for optional field
userSchema.index({ createdAt: -1 });

// ─── Virtual: alias name → fullName for backward compat ──────────────────────
userSchema.virtual('name').get(function () { return this.fullName; });

// ─── Pre-save: hash password ──────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Method: compare password ─────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Method: safe public profile (no password/googleId) ──────────────────────
userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    fullName: this.fullName,
    email: this.email,
    profileImage: this.profileImage,
    role: this.role,
    createdAt: this.createdAt,
  };
};

/*
 * Sample Document:
 * {
 *   "_id": ObjectId("..."),
 *   "fullName": "Abdul Kalam",
 *   "email": "abdulkalam@rce.edu.in",
 *   "googleId": null,
 *   "profileImage": "",
 *   "role": "user",
 *   "createdAt": ISODate("2025-04-01T06:15:00.000Z"),
 *   "updatedAt": ISODate("2025-04-01T06:15:00.000Z")
 * }
 */

module.exports = mongoose.model('User', userSchema);
