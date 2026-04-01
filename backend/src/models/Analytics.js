const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalRewrites: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgSeoScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    topKeywords: {
      type: [
        {
          keyword: { type: String, required: true },
          count: { type: Number, default: 1 },
        },
      ],
      default: [],
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    // Bonus tracking fields
    avgScoreBefore: { type: Number, default: 0 },
    avgScoreAfter: { type: Number, default: 0 },
    avgImprovement: { type: Number, default: 0 },
    totalScoreSum: { type: Number, default: 0 }, // for rolling avg calculation
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
analyticsSchema.index({ userId: 1 }, { unique: true });
analyticsSchema.index({ lastUsedAt: -1 });

// ─── Static: upsert analytics after a rewrite ────────────────────────────────
analyticsSchema.statics.recordRewrite = async function (userId, scoreBefore, scoreAfter, keyword) {
  const doc = await this.findOne({ userId });

  if (!doc) {
    // First rewrite — create fresh analytics
    const topKeywords = keyword ? [{ keyword, count: 1 }] : [];
    return this.create({
      userId,
      totalRewrites: 1,
      avgSeoScore: scoreAfter,
      avgScoreBefore: scoreBefore,
      avgScoreAfter: scoreAfter,
      avgImprovement: scoreAfter - scoreBefore,
      totalScoreSum: scoreAfter,
      topKeywords,
      lastUsedAt: new Date(),
    });
  }

  // Increment counters and recalculate averages
  const newTotal = doc.totalRewrites + 1;
  const newScoreSum = doc.totalScoreSum + scoreAfter;
  const newAvgScore = Math.round(newScoreSum / newTotal);
  const newAvgBefore = Math.round((doc.avgScoreBefore * doc.totalRewrites + scoreBefore) / newTotal);
  const newAvgAfter = Math.round((doc.avgScoreAfter * doc.totalRewrites + scoreAfter) / newTotal);

  // Update topKeywords array
  let topKeywords = doc.topKeywords || [];
  if (keyword) {
    const existing = topKeywords.find((k) => k.keyword === keyword);
    if (existing) {
      existing.count += 1;
    } else {
      topKeywords.push({ keyword, count: 1 });
    }
    // Keep top 20 sorted
    topKeywords = topKeywords.sort((a, b) => b.count - a.count).slice(0, 20);
  }

  return this.findByIdAndUpdate(
    doc._id,
    {
      totalRewrites: newTotal,
      avgSeoScore: newAvgScore,
      avgScoreBefore: newAvgBefore,
      avgScoreAfter: newAvgAfter,
      avgImprovement: newAvgAfter - newAvgBefore,
      totalScoreSum: newScoreSum,
      topKeywords,
      lastUsedAt: new Date(),
    },
    { new: true }
  );
};

/*
 * Sample Document:
 * {
 *   "_id": ObjectId("..."),
 *   "userId": ObjectId("<user_id>"),
 *   "totalRewrites": 12,
 *   "avgSeoScore": 74,
 *   "avgScoreBefore": 31,
 *   "avgScoreAfter": 74,
 *   "avgImprovement": 43,
 *   "totalScoreSum": 888,
 *   "topKeywords": [
 *     { "keyword": "seo strategy", "count": 4 },
 *     { "keyword": "content marketing", "count": 3 }
 *   ],
 *   "lastUsedAt": ISODate("2025-04-01T08:45:00.000Z"),
 *   "createdAt": ISODate("2025-04-01T06:15:00.000Z"),
 *   "updatedAt": ISODate("2025-04-01T08:45:00.000Z")
 * }
 */

module.exports = mongoose.model('Analytics', analyticsSchema);
