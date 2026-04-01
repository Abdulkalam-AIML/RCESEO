import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Target, ArrowRight, Copy, CheckCircle, ChevronDown, ChevronUp, Hash, BarChart2, Lightbulb, FileText, AlertTriangle, Zap } from 'lucide-react';
import api from '../lib/api';
import ScoreRing from '../components/ScoreRing';
import ErrorFallback from '../components/ErrorFallback';

/* ── Typing animation hook ── */
const useTyping = (text, active, chunk = 20, delay = 7) => {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active || !text) { setOut(text || ''); setDone(true); return; }
    setOut(''); setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i += chunk;
      setOut(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setOut(text); setDone(true); }
    }, delay);
    return () => clearInterval(id);
  }, [text, active]);
  return { out, done };
};

const TONES = ['professional', 'casual', 'persuasive', 'informative', 'creative'];
const AUDIENCES = ['general', 'technical', 'business', 'millennials', 'students'];

const RewritePage = () => {
  const [form, setForm] = useState({ content: '', keyword: '', tone: 'professional', audience: 'general' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiErr, setApiErr] = useState(false);
  const [copied, setCopied] = useState('');
  const [showSugg, setShowSugg] = useState(true);
  const [typingActive, setTypingActive] = useState(false);
  const [typingText, setTypingText] = useState('');
  const { out: aiOut, done: aiDone } = useTyping(typingText, typingActive);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!form.content.trim() || !form.keyword.trim()) { setError('Content and keyword are required.'); return; }
    setLoading(true); setError(''); setApiErr(false); setResult(null); setTypingActive(false); setTypingText('');
    try {
      const { data } = await api.post('/rewrite', { originalContent: form.content, targetKeyword: form.keyword, tone: form.tone, audience: form.audience, contentType: 'blog' });
      setResult(data.data);
      setTypingText(data.data?.rewrittenContent || '');
      setTimeout(() => setTypingActive(true), 100);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (!msg || err.code === 'ECONNABORTED' || (err.response?.status || 0) >= 500) setApiErr(true);
      else setError(msg);
    } finally { setLoading(false); }
  };

  const gain = result ? result.seoScoreAfter - result.seoScoreBefore : 0;

  const panelHead = (title, icon, action) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <span style={{ color: 'var(--primary)', display: 'flex' }}>{icon}</span>
      <span className="t-label" style={{ flex: 1, color: 'var(--text-2)' }}>{title}</span>
      {action}
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <span className="badge badge-orange" style={{ marginBottom: 14, display: 'inline-flex' }}><Wand2 size={10} /> AI Rewrite Engine</span>
        <h1 className="t-h2" style={{ marginBottom: 8 }}>Rewrite <span style={{ color: 'var(--primary)' }}>Workspace</span></h1>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Powered by GPT-4o · Real-time SEO Scoring</p>
      </motion.div>

      {/* Form */}
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="glass" style={{ marginBottom: 20, padding: 28 }}>
          <div style={{ marginBottom: 18 }}>
            <label className="t-label" style={{ display: 'block', marginBottom: 10 }}>Source Content</label>
            <textarea rows={9} placeholder="Paste your content here (50+ words recommended for best results)..."
              value={form.content}
              onChange={e => { setForm(p => ({ ...p, content: e.target.value })); setError(''); }}
              className="input" style={{ resize: 'vertical', lineHeight: 1.75, padding: '16px 18px', borderRadius: 16 }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
            <div>
              <label className="t-label" style={{ display: 'block', marginBottom: 8 }}>Target Keyword</label>
              <div style={{ position: 'relative' }}>
                <Target size={15} style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', zIndex: 1 }} />
                <input type="text" placeholder="e.g. SEO optimization" value={form.keyword}
                  onChange={e => setForm(p => ({ ...p, keyword: e.target.value }))}
                  className="input" style={{ paddingLeft: 44 }} />
              </div>
            </div>
            <div>
              <label className="t-label" style={{ display: 'block', marginBottom: 8 }}>Tone</label>
              <select value={form.tone} onChange={e => setForm(p => ({ ...p, tone: e.target.value }))} className="input" style={{ cursor: 'pointer' }}>
                {TONES.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="t-label" style={{ display: 'block', marginBottom: 8 }}>Target Audience</label>
              <select value={form.audience} onChange={e => setForm(p => ({ ...p, audience: e.target.value }))} className="input" style={{ cursor: 'pointer' }}>
                {AUDIENCES.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#ef4444', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                <AlertTriangle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 14 }}>
            {loading ? <><div className="spinner-sm" /> Generating…</> : <><Zap size={17} /> Run AI Optimization <ArrowRight size={15} /></>}
          </button>
        </div>
      </motion.form>

      {apiErr && <ErrorFallback type="ai" onRetry={() => { setApiErr(false); submit(); }} />}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Score row */}
            <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, alignItems: 'center' }}>
                <ScoreRing score={result.seoScoreBefore} label="Before" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: gain > 0 ? 'var(--success)' : '#ef4444', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.04em' }}>{gain > 0 ? '+' : ''}{gain}</div>
                  <div className="t-label">Score Gain</div>
                </div>
                <ScoreRing score={result.seoScoreAfter} label="After" />
                <ScoreRing score={result.readabilityScore} label="Readability" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--purple)', fontFamily: 'Outfit, sans-serif' }}>{result.keywordDensity}</div>
                  <div className="t-label">Keyword Density</div>
                </div>
              </div>
            </div>

            {/* Side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div className="glass" style={{ overflow: 'hidden' }}>
                {panelHead('Original', <FileText size={14} />)}
                <div style={{ padding: 20, maxHeight: 380, overflowY: 'auto', fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{form.content}</div>
              </div>
              <div className="glass" style={{ overflow: 'hidden' }}>
                {panelHead('AI Output', <Sparkles size={14} />,
                  <button onClick={() => copy(result.rewrittenContent, 'main')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    {copied === 'main' ? <><CheckCircle size={11} style={{ color: 'var(--success)' }} /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>
                )}
                <div style={{ padding: 20, maxHeight: 380, overflowY: 'auto', fontSize: 13, color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {aiOut || result.rewrittenContent}
                  {!aiDone && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.65, repeat: Infinity }} style={{ display: 'inline-block', width: 2, height: 16, background: 'var(--primary)', marginLeft: 2, verticalAlign: 'middle', boxShadow: '0 0 8px var(--primary)' }} />}
                </div>
              </div>
            </div>

            {/* Meta tags */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
              {[{ k: 'title', label: 'SEO Title', val: result.seoTitle }, { k: 'meta', label: 'Meta Description', val: result.metaDescription }].map(m => (
                <div key={m.k} className="glass" style={{ overflow: 'hidden' }}>
                  {panelHead(m.label, null,
                    <button onClick={() => copy(m.val, m.k)} style={{ padding: '4px 10px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 100, color: 'var(--muted)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      {copied === m.k ? '✓' : 'Copy'}
                    </button>
                  )}
                  <div style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Suggestions toggle */}
            {(result.headingSuggestions?.length > 0 || result.suggestedKeywords?.length > 0 || result.titleSuggestions?.length > 0) && (
              <>
                <button onClick={() => setShowSugg(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', paddingBottom: 12, fontFamily: 'Outfit, sans-serif' }}>
                  {showSugg ? <ChevronUp size={15} /> : <ChevronDown size={15} />} AI Suggestions
                </button>
                <AnimatePresence>
                  {showSugg && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                        {[
                          { icon: BarChart2, label: 'Heading Structure', items: result.headingSuggestions },
                          { icon: Hash, label: 'Keywords', items: result.suggestedKeywords },
                          { icon: Lightbulb, label: 'Title Ideas', items: result.titleSuggestions },
                        ].map((s, si) => s.items?.length > 0 && (
                          <div key={si} className="glass" style={{ overflow: 'hidden' }}>
                            {panelHead(s.label, <s.icon size={13} />)}
                            <ul style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {s.items.map((item, i) => (
                                <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.55 }}>
                                  <span style={{ color: 'var(--primary)', fontWeight: 800, flexShrink: 0 }}>›</span> {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !loading && !apiErr && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="glass" style={{ padding: 60, textAlign: 'center', borderStyle: 'dashed' }}>
          <Wand2 size={36} style={{ color: 'var(--primary)', opacity: 0.4, margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>Ready to Optimize</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>Paste your content, enter a keyword, and let the AI work its magic.</p>
        </motion.div>
      )}
    </div>
  );
};

export default RewritePage;
