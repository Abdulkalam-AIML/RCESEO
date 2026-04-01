import { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, Zap, Target, BarChart3, Shield,
  TrendingUp, Users, Star, CheckCircle, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

/* ═══════════════════════════════════
   CONSTANTS
═══════════════════════════════════ */
const FEATURES = [
  {
    icon: Zap, color: 'var(--primary)', alpha: 'var(--primary-alpha)',
    title: 'AI-Powered Rewrites',
    desc: 'Transform any content in seconds. GPT-4o understands context, intent, and brand voice at scale.',
  },
  {
    icon: Target, color: 'var(--cyan)', alpha: 'var(--cyan-alpha)',
    title: 'Keyword Intelligence',
    desc: 'Preserve target keywords with surgical precision while boosting readability and engagement.',
  },
  {
    icon: BarChart3, color: 'var(--purple)', alpha: 'var(--purple-alpha)',
    title: 'Real-time SEO Scoring',
    desc: 'Instant before/after scoring with granular insights across 14 optimization dimensions.',
  },
  {
    icon: Shield, color: 'var(--success)', alpha: 'rgba(16,185,129,0.1)',
    title: 'Plagiarism Shield',
    desc: 'Every generated output is 100% unique and guaranteed safe for publishing anywhere.',
  },
  {
    icon: TrendingUp, color: '#f59e0b', alpha: 'rgba(245,158,11,0.1)',
    title: 'Rank Trajectory',
    desc: 'Visual analytics dashboard showing your ranking progression week over week.',
  },
  {
    icon: Users, color: '#ec4899', alpha: 'rgba(236,72,153,0.1)',
    title: 'Team Collaboration',
    desc: 'Shared workspace with version history, comment threads, and role-based access.',
  },
];

const STATS = [
  { value: '10K+', label: 'Active Users' },
  { value: '98%', label: 'Satisfaction' },
  { value: '2.4M', label: 'Articles Optimized' },
  { value: '#1', label: 'Avg Ranking Gain' },
];

const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: Math.random() * 2.5 + 0.5,
  c: i % 3 === 0 ? '#ff7a00' : i % 3 === 1 ? '#00e5ff' : '#7c3aed',
  dur: Math.random() * 8 + 5,
  del: Math.random() * 6,
}));

/* ═══════════════════════════════════
   HERO DASHBOARD — DARK GLASS PANEL
   (Always dark regardless of theme)
═══════════════════════════════════ */
const HeroDashboard = () => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const rotX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-11, 11]);

  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ perspective: 1100, position: 'relative', cursor: 'default' }}
      initial={{ opacity: 0, x: 60 }}
      animate={{
        opacity: 1, x: 0,
        y: [0, -16, 0],
      }}
      transition={{
        opacity: { duration: 0.8, delay: 0.5 },
        x: { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
      }}
    >
      {/* Background halo */}
      <div style={{
        position: 'absolute', inset: -30, borderRadius: 60,
        background: 'radial-gradient(ellipse at center, rgba(255,122,0,0.18) 0%, rgba(124,58,237,0.10) 50%, transparent 80%)',
        filter: 'blur(40px)',
        animation: 'pulse-glow 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}>
        {/* ─ Main Panel ─ */}
        <div style={{
          background: 'rgba(5, 7, 13, 0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 28,
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          padding: 28,
          width: 'min(460px, 90vw)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.75), 0 0 80px rgba(255,122,0,0.10), inset 0 1px 0 rgba(255,255,255,0.10)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Scan lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.014) 3px, rgba(255,255,255,0.014) 4px)',
            pointerEvents: 'none', zIndex: 1, borderRadius: 'inherit',
          }} />
          {/* Glass reflection */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '35%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent)',
            pointerEvents: 'none', zIndex: 2, borderRadius: '28px 28px 0 0',
          }} />

          <div style={{ position: 'relative', zIndex: 3 }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 4 }}>
                  SEO Intelligence
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
                  Dashboard
                </div>
              </div>
              {/* Live dot */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 100, background: 'rgba(255,122,0,0.15)', border: '1px solid rgba(255,122,0,0.35)' }}>
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff7a00', boxShadow: '0 0 8px #ff7a00' }}
                />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#ff7a00', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
              </div>
            </div>

            {/* 3 metric cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
              {[
                { val: '96', label: 'SEO Score', color: '#ff7a00' },
                { val: 'A+', label: 'Readability', color: '#00e5ff' },
                { val: '142', label: 'Keywords', color: '#7c3aed' },
              ].map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${m.color}25`,
                    borderRadius: 14, padding: '14px 10px', textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 900, color: m.color, letterSpacing: '-0.03em', textShadow: `0 0 20px ${m.color}88`, fontFamily: 'Outfit, sans-serif' }}>{m.val}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.38)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{m.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Progress bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Technical SEO', pct: 92, color: '#ff7a00' },
                { label: 'Content Quality', pct: 87, color: '#7c3aed' },
                { label: 'Keyword Density', pct: 74, color: '#00e5ff' },
              ].map((b, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{b.label}</span>
                    <span style={{ fontSize: 10, color: b.color, fontWeight: 800 }}>{b.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ duration: 1.2, delay: 1.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${b.color}, ${b.color}88)`, boxShadow: `0 0 10px ${b.color}55` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Activity bars */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 32 }}>
              {[40, 65, 45, 80, 55, 90, 60, 75, 50, 85].map((h, i) => (
                <motion.div key={i}
                  animate={{ height: [h * 0.3, h * 0.32, h * 0.3] }}
                  transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
                  style={{
                    flex: 1, borderRadius: 3,
                    background: i % 2 === 0 ? 'rgba(255,122,0,0.65)' : 'rgba(124,58,237,0.45)',
                  }}
                />
              ))}
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginLeft: 4, fontWeight: 600, whiteSpace: 'nowrap', alignSelf: 'center' }}>AI ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Floating badge — +240% traffic */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: -24, right: -24,
            background: 'rgba(124,58,237,0.18)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 16, backdropFilter: 'blur(16px)',
            padding: '13px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
          }}
        >
          <TrendingUp size={18} style={{ color: '#7c3aed' }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>+240%</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Organic Traffic</div>
          </div>
        </motion.div>

        {/* Floating badge — Rank #1 */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute', top: -18, left: -22,
            background: 'rgba(255,122,0,0.14)',
            border: '1px solid rgba(255,122,0,0.35)',
            borderRadius: 14, backdropFilter: 'blur(16px)',
            padding: '9px 14px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <CheckCircle size={14} style={{ color: '#10b981' }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>Rank #1</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Google SERP</div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════
   FEATURE CARD
═══════════════════════════════════ */
const FeatureCard = ({ f, i }) => (
  <motion.div
    className="glass"
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
    style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}
  >
    <div className="icon-box" style={{ background: f.alpha, color: f.color }}>
      <f.icon size={22} />
    </div>
    <div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.015em', fontFamily: 'Outfit, sans-serif' }}>
        {f.title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
        {f.desc}
      </p>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: f.color, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
      Learn more <ChevronRight size={14} />
    </div>
  </motion.div>
);

/* ═══════════════════════════════════
   MAIN LANDING PAGE
═══════════════════════════════════ */
const LandingPage = () => {
  const { user, openAuth, loginWithGoogle } = useAuth();

  return (
    <div className="page" style={{ overflowX: 'hidden' }}>
      <Navbar />

      {/* ─────────────── HERO ─────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 'clamp(90px, 12vw, 130px)', paddingBottom: 'clamp(60px, 8vw, 100px)', overflow: 'hidden' }}>

        {/* Animated mesh blobs */}
        <div className="mesh-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        {/* Particles */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {PARTICLES.map(p => (
            <motion.div key={p.id}
              animate={{ y: [0, -70, 0], opacity: [0, 0.75, 0] }}
              transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
                width: p.s, height: p.s, borderRadius: '50%',
                background: p.c,
              }}
            />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: 'clamp(60px, 8vw, 100px)',
            alignItems: 'center',
          }}>
            {/* ── LEFT: Copy ── */}
            <div style={{ maxWidth: 620 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} style={{ marginBottom: 24 }}>
                <span className="badge badge-orange">
                  <Sparkles size={10} /> AI-Powered SEO Engine · v2.0
                </span>
              </motion.div>

              <motion.h1
                className="t-display"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 24 }}
              >
                Content That{' '}
                <span className="gradient-text">Ranks &amp;</span>
                <br />
                <span className="gradient-text">Converts.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 44, maxWidth: 520 }}
              >
                Transform any article into a high-ranking SEO powerhouse with AI-powered rewriting, real-time scoring, and keyword intelligence — in seconds.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 52 }}
              >
                {!user ? (
                  <>
                    <button className="btn-primary" style={{ padding: '16px 36px', fontSize: 15 }} onClick={() => openAuth('signup')}>
                      Start Free <ArrowRight size={16} />
                    </button>
                    <button className="btn-ghost" style={{ padding: '16px 28px', fontSize: 14 }} onClick={loginWithGoogle}>
                      <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                  </>
                ) : (
                  <Link to="/dashboard" className="btn-primary" style={{ padding: '16px 36px', fontSize: 15 }}>
                    Go to Dashboard <ArrowRight size={16} />
                  </Link>
                )}
              </motion.div>

              {/* Social proof */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
                {/* Avatars */}
                <div style={{ display: 'flex' }}>
                  {['#ff7a00','#7c3aed','#00e5ff','#10b981','#ec4899'].map((cl, i) => (
                    <div key={i} style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: cl, border: '2px solid var(--bg)',
                      marginLeft: i > 0 ? -10 : 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 900, color: '#fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    }}>
                      {['A','R','S','M','K'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    <span style={{ color: 'var(--primary)' }}>10,000+</span> creators
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>already ranking higher</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 18, borderLeft: '1px solid var(--border)' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                  <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6, fontWeight: 600 }}>4.9 / 5</span>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: 3D Dashboard ── */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="hidden lg:flex">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── STATS BAR ─────────────── */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: 'clamp(28px, 4vw, 44px) 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24 }}>
            {STATS.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'var(--primary)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'Outfit, sans-serif' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURES ─────────────── */}
      <section id="features" style={{ padding: 'clamp(80px, 10vw, 140px) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 80px)' }}>
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="badge badge-cyan" style={{ marginBottom: 20 }}>
                <Sparkles size={10} /> Everything You Need
              </span>
              <h2 className="t-h1" style={{ marginTop: 12, marginBottom: 20 }}>
                Built for{' '}
                <span className="gradient-text-purple">Modern SEO</span>
              </h2>
              <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--muted)', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
                A complete AI toolkit that goes beyond keyword stuffing — it understands semantic relevance, reader intent, and Google's evolving algorithms.
              </p>
            </motion.div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
            {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* ─────────────── CTA SECTION ─────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 0', background: 'var(--surface)' }}>
        <div className="container-sm">
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              padding: 'clamp(48px, 7vw, 88px)',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(255,122,0,0.2)',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, var(--primary-alpha) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <h2 className="t-h1" style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
              Ready to <span className="gradient-text">Dominate</span> Search?
            </h2>
            <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 44, lineHeight: 1.7, position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto 44px' }}>
              Join 10,000+ agencies and content creators who rely on RCE SEO for top-ranking results.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              {!user ? (
                <>
                  <button className="btn-primary" style={{ fontSize: 15, padding: '16px 40px' }} onClick={() => openAuth('signup')}>
                    Start Free Today <ArrowRight size={16} />
                  </button>
                  <button className="btn-ghost" style={{ fontSize: 14, padding: '15px 32px' }} onClick={() => openAuth('login')}>
                    Log In
                  </button>
                </>
              ) : (
                <Link to="/dashboard" className="btn-primary" style={{ fontSize: 15, padding: '16px 40px' }}>
                  Go to Dashboard <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: 'clamp(24px, 4vw, 40px) 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, overflow: 'hidden', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255,122,0,0.2)' }}>
              <img src="/logo.png" alt="RCE" width={30} height={30} style={{ objectFit: 'contain', display: 'block' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', fontFamily: 'Outfit, sans-serif' }}>RCE SEO Optimizer</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>© 2026 RCE. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
