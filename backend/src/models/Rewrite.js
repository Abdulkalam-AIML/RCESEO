const mongoose = require('mongoose');

const rewriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'], // indexed via schema.index() below
    },
    originalContent: {
      type: String,
      required: [true, 'Original content is required'],
      minlength: [10, 'Content must be at least 10 characters'],
    },
    rewrittenContent: {
      type: String,
      required: [true, 'Rewritten content is required'],
    },
    seoTitle: {
      type: String,
      default: '',
      maxlength: [160, 'SEO title should not exceed 160 characters'],
    },
    metaDescription: {
      type: String,
      default: '',
      maxlength: [320, 'Meta description should not exceed 320 characters'],
    },
    // Flat keyword fields (matches user spec)
    primaryKeyword: {
      type: String,
      required: [true, 'Primary keyword is required'],
      trim: true,
    },
    secondaryKeywords: {
      type: [String],
      default: [],
    },
    seoScoreBefore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    seoScoreAfter: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    readabilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    keywordDensity: {
      type: String, // stored as "2.30%" string per spec
      default: '0%',
    },
    tone: {
      type: String,
      enum: ['professional', 'casual', 'persuasive', 'informative', 'creative'],
      default: 'professional',
    },
    audience: {
      type: String,
      enum: ['general', 'technical', 'business', 'millennials', 'students'],
      default: 'general',
    },
    contentType: {
      type: String,
      enum: ['blog', 'product', 'landing-page', 'social-media', 'email'],
      default: 'blog',
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
rewriteSchema.index({ userId: 1, createdAt: -1 }); // user history sorted by newest
rewriteSchema.index({ primaryKeyword: 1 });          // keyword frequency analytics
rewriteSchema.index({ seoScoreAfter: -1 });          // top-scoring rewrites

// ─── Virtual: score improvement ──────────────────────────────────────────────
rewriteSchema.virtual('scoreImprovement').get(function () {
  return this.seoScoreAfter - this.seoScoreBefore;
});

/*
 * Sample Document:
 * {
 *   "_id": ObjectId("..."),
 *   "userId": ObjectId("<user_id>"),
 *   "originalContent": "SEO is important for websites...",
 *   "rewrittenContent": "In a comprehensive analysis, SEO is critical...",
 *   "seoTitle": "The Ultimate Guide to SEO in 2025",
 *   "metaDescription": "Discover SEO strategies that rank. ...",
 *   "primaryKeyword": "seo strategy",
 *   "secondaryKeywords": ["ranking", "content", "google"],
 *   "seoScoreBefore": 28,
 *   "seoScoreAfter": 76,
 *   "readabilityScore": 64,
 *   "keywordDensity": "2.10%",
 *   "tone": "professional",
 *   "audience": "general",
 *   "contentType": "blog",
 *   "createdAt": ISODate("2025-04-01T07:00:00.000Z")
 * }
 */

module.exports = mongoose.model('Rewrite', rewriteSchema);
