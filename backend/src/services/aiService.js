/**
 * OpenRouter AI Service — Enhanced SEO Rewrite Engine
 */
const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o';

const buildPrompt = (content, keyword, tone, audience, contentType) => `
You are an elite SEO content strategist and AI writing assistant. Rewrite and optimize the following content for maximum Google search ranking potential.

ORIGINAL CONTENT:
"""
${content}
"""

OPTIMIZATION PARAMETERS:
- Primary Keyword: "${keyword}"
- Tone: ${tone}
- Target Audience: ${audience}
- Content Type: ${contentType}

YOUR OPTIMIZATION TASKS:
1. Rewrite the content for SEO excellence — place "${keyword}" naturally in first 100 words, use 1-3% keyword density
2. Improve readability: short sentences, active voice, clear structure
3. Add power words and persuasive language appropriate for ${tone} tone
4. Preserve original meaning and facts
5. Structure with logical paragraph flow
6. Ensure the content is ${audience}-friendly

RETURN ONLY a valid JSON object (no markdown, no preamble):
{
  "rewrittenContent": "Full optimized text with multiple paragraphs...",
  "seoScore": <integer 0-100>,
  "readabilityScore": <integer 0-100>,
  "keywordDensity": "<e.g. 2.30%>",
  "titleSuggestion": "The best SEO-optimized title",
  "metaDescription": "Compelling 150-155 character meta description with ${keyword}",
  "keywordSuggestions": ["term1", "term2", "term3", "term4", "term5", "term6"],
  "headingSuggestions": [
    "What Is ${keyword} and Why Does It Matter?",
    "Top ${keyword} Strategies for 2025",
    "How to Implement ${keyword} Effectively",
    "Common ${keyword} Mistakes to Avoid",
    "Measuring Your ${keyword} Success"
  ],
  "callToAction": "One compelling CTA sentence relevant to the content",
  "seoIssues": [
    "Issue or warning 1 if any detected",
    "Issue or warning 2 if any detected"
  ],
  "scoreBreakdown": {
    "keywordUsage": <0-20>,
    "headingQuality": <0-20>,
    "paragraphStructure": <0-20>,
    "readability": <0-20>,
    "seoFriendliness": <0-20>
  }
}

SCORING CRITERIA:
- keywordUsage (0-20): keyword in title, first paragraph, body, natural density
- headingQuality (0-20): relevant headings suggested, keyword in at least one
- paragraphStructure (0-20): short paragraphs, clear flow, logical order
- readability (0-20): Flesch equivalent, simple words, active voice
- seoFriendliness (0-20): strong meta, title length, content depth, CTA present
`.trim();

const parseAIResponse = (text) => {
  try {
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse AI JSON response');
  }
};

const callOpenRouter = async (prompt, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        OPENROUTER_URL,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a professional SEO content optimization engine. Always return valid JSON only. Never include markdown or explanations outside the JSON object.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.65,
          max_tokens: 2500,
          response_format: { type: 'json_object' },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'RCE SEO Optimizer',
          },
          timeout: 45000,
        }
      );
      const raw = response.data?.choices?.[0]?.message?.content;
      if (!raw) throw new Error('Empty AI response');
      return parseAIResponse(raw);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
};

const generateAIRewrite = async (content, keyword, tone, audience, contentType) => {
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('[AI] OPENROUTER_API_KEY not set — using local fallback');
    return null;
  }
  try {
    const prompt = buildPrompt(content, keyword, tone, audience, contentType);
    const result = await callOpenRouter(prompt);
    if (!result.rewrittenContent || typeof result.seoScore !== 'number') {
      throw new Error('AI response missing required fields');
    }
    return {
      rewrittenContent:   result.rewrittenContent,
      seoScore:           Math.min(100, Math.max(0, Math.round(result.seoScore))),
      readabilityScore:   Math.min(100, Math.max(0, Math.round(result.readabilityScore ?? 70))),
      seoTitle:           result.titleSuggestion || '',
      metaDescription:    result.metaDescription || '',
      suggestedKeywords:  Array.isArray(result.keywordSuggestions) ? result.keywordSuggestions.slice(0, 8) : [],
      headingSuggestions: Array.isArray(result.headingSuggestions) ? result.headingSuggestions.slice(0, 5) : [],
      callToAction:       result.callToAction || '',
      seoIssues:          Array.isArray(result.seoIssues) ? result.seoIssues : [],
      keywordDensity:     result.keywordDensity || '—',
      scoreBreakdown:     result.scoreBreakdown || null,
    };
  } catch (err) {
    console.error('[AI] OpenRouter error:', err.response?.data?.error?.message || err.message);
    return null;
  }
};

module.exports = { generateAIRewrite };
