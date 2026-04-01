import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Activity, Award, Calendar, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import api from '../lib/api';
import ErrorFallback from '../components/ErrorFallback';

const TooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  boxShadow: 'var(--shadow-lg)',
  padding: '12px 16px',
  fontFamily: 'Outfit, sans-serif',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text)',
};

const AnalyticsPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/rewrite/history');
      if (data.success) setHistory(data.data);
      setError(false);
    } catch { setError(true); }
    finally { setLoading(false); setRetrying(false); }
  };
  useEffect(() => { load(); }, []);

  const chart = history.slice(-12).map((h, i) => ({
    name: `R${i + 1}`,
    after:  h.seoScoreAfter || 0,
    before: h.seoScoreBefore || 0,
    gain:   (h.seoScoreAfter || 0) - (h.seoScoreBefore || 0),
  }));

  const avg  = history.length ? Math.round(history.reduce((a, h) => a + ((h.seoScoreAfter || 0) - (h.seoScoreBefore || 0)), 0) / history.length) : 0;
  const peak = history.length ? Math.max(...history.map(h => h.seoScoreAfter || 0)) : 0;

  return (
    <div style={{ maxWidth: 1200, paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: 14, display: 'inline-flex' }}><Sparkles size={10} /> Performance Hub</span>
          <h1 className="t-h2">Analytics <span style={{ color: 'var(--primary)' }}>Dashboard</span></h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>SEO trajectory and performance insights</p>
        </div>
        <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13, gap: 8 }}>
          <Calendar size={14} /> Last 30 Days <ChevronDown size={13} />
        </button>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading analytics…</p>
        </div>
      ) : error ? (
        <ErrorFallback type="data" onRetry={() => { setLoading(true); setRetrying(true); setError(false); load(); }} retrying={retrying} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { val: `+${avg}`, label: 'Avg Improvement', sub: 'Per rewrite', icon: TrendingUp, color: 'var(--primary)' },
              { val: history.length, label: 'Total Rewrites', sub: 'Dataset volume', icon: Activity, color: 'var(--purple)' },
              { val: `${peak}/100`, label: 'Peak Score', sub: 'Best optimization', icon: Award, color: 'var(--success)' },
            ].map((s, i) => (
              <motion.div key={i} className="glass" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ padding: 28 }}>
                <div className="icon-box" style={{ background: `${s.color}14`, color: s.color, marginBottom: 18 }}><s.icon size={20} /></div>
                <div style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 900, color: s.color, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{s.val}</div>
                <div className="t-label">{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          {history.length === 0 ? (
            <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
              <Activity size={40} style={{ color: 'var(--primary)', opacity: 0.35, display: 'block', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>No analytics yet</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>Complete a rewrite to generate data.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
              {/* Area chart */}
              <div className="glass" style={{ padding: 24 }}>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>Score Trajectory</h4>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>Before vs after optimization</p>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'Outfit' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'Outfit' }} />
                      <Tooltip contentStyle={TooltipStyle} itemStyle={{ color: 'var(--muted)' }} labelStyle={{ color: 'var(--muted)', fontWeight: 700 }} />
                      <Area type="monotone" dataKey="after" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#grad1)" animationDuration={1500} />
                      <Area type="monotone" dataKey="before" stroke="var(--muted)" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar chart */}
              <div className="glass" style={{ padding: 24 }}>
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>Improvement Delta</h4>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>Points gained per rewrite</p>
                </div>
                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'Outfit' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'Outfit' }} />
                      <Tooltip contentStyle={TooltipStyle} cursor={{ fill: 'var(--primary-alpha)' }} />
                      <Bar dataKey="gain" radius={[8, 8, 0, 0]} animationDuration={1200}>
                        {chart.map((e, i) => <Cell key={i} fill={e.gain > avg ? 'var(--primary)' : 'var(--purple)'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsPage;
