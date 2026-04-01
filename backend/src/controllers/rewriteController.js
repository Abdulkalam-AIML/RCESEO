const Rewrite = require('../models/Rewrite');
const Analytics = require('../models/Analytics');
const { generateAIRewrite } = require('../services/aiService');

// ─── LOCAL FALLBACK UTILITIES ─────────────────────────────────────────────────
// Used when AI is unavailable or returns an error

const calculateSEOScore = (content, keyword) => {
  if (!content || !keyword) return 0;
  let score = 0;
  const lower = content.toLowerCase();
  const kw = keyword.toLowerCase();
  const words = content.split(/\s+/).filter(Boolean);
  const wc = words.length;
  const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const occ = (lower.match(new RegExp(esc, 'g')) || []).length;
  const density = wc > 0 ? (occ / wc) * 100 : 0;

  if (lower.includes(kw)) score += 25;
  if (density >= 1 && density <= 3) score += 20; else if (density > 0) score += 10;
  if (wc >= 300) score += 20; else if (wc >= 150) score += 10; else score += 5;
  if (content.split(/[.!?]+/).filter(Boolean).length >= 5) score += 15; else score += 5;
  if (/\d/.test(content)) score += 10;
  if (content.includes('\n')) score += 5;
  return Math.min(score, 100);
};

const calculateReadability = (content) => {
  const s = content.split(/[.!?]+/).filter(Boolean).length || 1;
  const w = content.split(/\s+/).filter(Boolean).length || 1;
  const syl = content.replace(/[^aeiouyAEIOUY]/g, '').length || 1;
  return Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (w / s) - 84.6 * (syl / w))));
};

const getKeywordDensity = (content, keyword) => {
  const w = content.split(/\s+/).filter(Boolean).length;
  const esc = keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const occ = (content.toLowerCase().match(new RegExp(esc, 'g')) || []).length;
  return `${((occ / w) * 100).toFixed(2)}%`;
};

const extractSecondaryKeywords = (content, primary) => {
  const stop = new Set(['the','a','an','and','or','but','in','on','at','to','for','is','are','was','were','be','been','have','has','do','does','with','by','from','of','this','that','it','its','we','you','they','he','she','i','not','can','will','all','into','about','up','which','when','there']);
  const words = content.toLowerCase().split(/\W+/).filter(w => w.length > 4 && !stop.has(w) && w !== primary.toLowerCase());
  const freq = words.reduce((a, w) => { a[w] = (a[w] || 0) + 1; return a; }, {});
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
};

const localRewrite = (content, keyword, tone, audience, contentType) => {
  const toneIntro = {
    professional: `In a comprehensive professional analysis of ${keyword},`,
    casual: `Here's the real deal about ${keyword} —`,
    persuasive: `If you want results with ${keyword}, this is what you need to know:`,
    informative: `Research shows that ${keyword} plays a critical role:`,
    creative: `Picture this: the world of ${keyword} is changing fast.`,
  }[tone] || `Exploring ${keyword} in depth:`;

  const sentences = content.split('. ').map((s, i) => {
    if (i === 0) return `${toneIntro} ${s}`;
    if (i % 3 === 0 && !s.toLowerCase().includes(keyword.toLowerCase())) return `${s} — directly related to ${keyword}`;
    return s;
  });

  return sentences.join('. ') +
    `\n\n**Strategic Insight:** This ${contentType} has been optimized for "${keyword}" to help you rank higher on Google while delivering value to your ${audience} audience.`;
};

const generateLocalTitle = (keyword, contentType) => {
  const templates = [
    `The Ultimate Guide to ${keyword} (2025 Edition)`,
    `How to Master ${keyword}: A Complete ${contentType} Strategy`,
    `${keyword}: Everything You Need to Know Today`,
    `Boost Your Results with ${keyword} — Expert Breakdown`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const generateLocalMeta = (keyword, content) =>
  `Learn about ${keyword}. ${content.split('. ')[0]?.substring(0, 100) || ''}... Discover proven strategies for ${keyword}.`;

const generateHeadings = (keyword, contentType) => [
  `What Is ${keyword} and Why Does It Matter?`,
  `Top ${keyword} Strategies That Work in 2025`,
  `How to Implement ${keyword} for Your ${contentType}`,
  `Common ${keyword} Mistakes to Avoid`,
  `Measuring the Impact of ${keyword} on Rankings`,
];

const generateTitles = (keyword) => [
  `The Definitive ${keyword} Guide for 2025`,
  `${keyword}: A Step-by-Step Proven Framework`,
  `Mastering ${keyword} — Expert Tips & Tactics`,
  `Why ${keyword} Is the #1 Priority for Content Creators`,
];

// ─── MAIN CONTROLLER ─────────────────────────────────────────────────────────

// @route   POST /api/rewrite
// @desc    Rewrite content with AI (falls back to local engine if AI unavailable)
const rewriteContent = async (req, res) => {
  try {
    const { originalContent, targetKeyword, tone = 'professional', audience = 'general', contentType = 'blog' } = req.body;

    if (!originalContent || !targetKeyword) {
      return res.status(400).json({ success: false, message: 'Content and target keyword are required' });
    }

    // ── 1. Calculate BEFORE score using local engine ──────────────────────────
    const seoScoreBefore = calculateSEOScore(originalContent, targetKeyword);

    // ── 2. Try AI rewrite first ───────────────────────────────────────────────
    let aiResult = null;
    try {
      console.log(`[AI] Calling OpenRouter for keyword: "${targetKeyword}"`);
      aiResult = await generateAIRewrite(originalContent, targetKeyword, tone, audience, contentType);
      if (aiResult) console.log(`[AI] ✅ Success — SEO score: ${aiResult.seoScore}`);
    } catch (err) {
      console.error('[AI] Failed, using local fallback:', err.message);
    }

    // ── 3. Build final output (AI or local fallback) ──────────────────────────
    let rewrittenContent, seoScoreAfter, readabilityScore, keywordDensity;
    let seoTitle, metaDescription, headingSuggestions, titleSuggestions, suggestedKeywords;

    if (aiResult) {
      // ── AI path ─────────────────────────────────────────────────────────────
      rewrittenContent  = aiResult.rewrittenContent;
      seoScoreAfter     = aiResult.seoScore;
      readabilityScore  = aiResult.readabilityScore;
      seoTitle          = aiResult.seoTitle;
      metaDescription   = aiResult.metaDescription;
      suggestedKeywords = aiResult.suggestedKeywords;
      headingSuggestions = aiResult.headingSuggestions;
      keywordDensity    = aiResult.keywordDensity;
      titleSuggestions  = generateTitles(targetKeyword);
    } else {
      // ── Local fallback path ──────────────────────────────────────────────────
      rewrittenContent  = localRewrite(originalContent, targetKeyword, tone, audience, contentType);
      seoScoreAfter     = calculateSEOScore(rewrittenContent, targetKeyword);
      readabilityScore  = calculateReadability(rewrittenContent);
      keywordDensity    = getKeywordDensity(rewrittenContent, targetKeyword);
      seoTitle          = generateLocalTitle(targetKeyword, contentType);
      metaDescription   = generateLocalMeta(targetKeyword, rewrittenContent);
      headingSuggestions = generateHeadings(targetKeyword, contentType);
      titleSuggestions  = generateTitles(targetKeyword);
      const secondary   = extractSecondaryKeywords(rewrittenContent, targetKeyword);
      suggestedKeywords = [...secondary, `best ${targetKeyword}`, `${targetKeyword} tips`].slice(0, 8);
    }

    // ── 4. Save to rewrites collection ───────────────────────────────────────
    const rewrite = await Rewrite.create({
      userId: req.user._id,
      originalContent,
      rewrittenContent,
      seoTitle,
      metaDescription,
      primaryKeyword:   targetKeyword,
      secondaryKeywords: suggestedKeywords,
      seoScoreBefore,
      seoScoreAfter,
      readabilityScore,
      keywordDensity,
      tone,
      audience,
      contentType,
    });

    // ── 5. Update analytics (non-blocking) ───────────────────────────────────
    Analytics.recordRewrite(req.user._id, seoScoreBefore, seoScoreAfter, targetKeyword)
      .catch(err => console.error('[Analytics] Update error:', err.message));

    // ── 6. Return structured response ─────────────────────────────────────────
    res.status(201).json({
      success: true,
      aiPowered: !!aiResult, // lets frontend show "AI Powered" badge
      data: {
        _id: rewrite._id,
        rewrittenContent,
        seoTitle,
        metaDescription,
        seoScore:          seoScoreAfter,
        seoScoreBefore,
        seoScoreAfter,
        readabilityScore,
        keywordDensity,
        suggestedKeywords,
        titleSuggestions,
        headingSuggestions,
        scoreBreakdown:    aiResult?.scoreBreakdown || null,
        keywords: { primary: targetKeyword, secondary: suggestedKeywords },
        createdAt: rewrite.createdAt,
      },
    });
  } catch (error) {
    console.error('[Rewrite] Fatal error:', error);
    res.status(500).json({ success: false, message: 'Server error during rewrite' });
  }
};

// @route   GET /api/rewrite/history
const getHistory = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const [rewrites, total] = await Promise.all([
      Rewrite.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Rewrite.countDocuments({ userId: req.user._id }),
    ]);
    const normalized = rewrites.map(r => ({
      ...r,
      keywords: { primary: r.primaryKeyword, secondary: r.secondaryKeywords || [] },
    }));
    res.json({ success: true, data: normalized, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};

// @route   GET /api/rewrite/:id
const getRewrite = async (req, res) => {
  try {
    const rewrite = await Rewrite.findOne({ _id: req.params.id, userId: req.user._id });
    if (!rewrite) return res.status(404).json({ success: false, message: 'Rewrite not found' });
    res.json({ success: true, data: rewrite });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route   GET /api/rewrite/analytics
const getAnalytics = async (req, res) => {
  try {
    const [analyticsDoc, rewrites] = await Promise.all([
      Analytics.findOne({ userId: req.user._id }).lean(),
      Rewrite.find({ userId: req.user._id }).sort({ createdAt: 1 }).lean(),
    ]);
    const scoreHistory = rewrites.map((r, i) => ({
      index: i + 1,
      date: new Date(r.createdAt).toLocaleDateString(),
      scoreBefore: r.seoScoreBefore,
      scoreAfter:  r.seoScoreAfter,
      readability: r.readabilityScore,
    }));
    if (analyticsDoc) {
      return res.json({
        success: true,
        data: {
          totalRewrites:    analyticsDoc.totalRewrites,
          avgScoreBefore:   analyticsDoc.avgScoreBefore,
          avgScoreAfter:    analyticsDoc.avgSeoScore,
          avgImprovement:   analyticsDoc.avgImprovement,
          keywordFrequency: analyticsDoc.topKeywords.map(k => ({ keyword: k.keyword, count: k.count })),
          scoreHistory,
        },
      });
    }
    const avg = arr => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
    const kwMap = {};
    rewrites.forEach(r => { if (r.primaryKeyword) kwMap[r.primaryKeyword] = (kwMap[r.primaryKeyword] || 0) + 1; });
    res.json({
      success: true,
      data: {
        totalRewrites:  rewrites.length,
        avgScoreBefore: avg(rewrites.map(r => r.seoScoreBefore)),
        avgScoreAfter:  avg(rewrites.map(r => r.seoScoreAfter)),
        avgImprovement: avg(rewrites.map(r => r.seoScoreAfter - r.seoScoreBefore)),
        keywordFrequency: Object.entries(kwMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([keyword, count]) => ({ keyword, count })),
        scoreHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching analytics' });
  }
};

// @route   DELETE /api/rewrite/:id
const deleteRewrite = async (req, res) => {
  try {
    const r = await Rewrite.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!r) return res.status(404).json({ success: false, message: 'Rewrite not found' });
    res.json({ success: true, message: 'Rewrite deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { rewriteContent, getHistory, getRewrite, getAnalytics, deleteRewrite };
