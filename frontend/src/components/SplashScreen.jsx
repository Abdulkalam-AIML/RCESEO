import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   STABLE DATA — generated once, never on re-render
═══════════════════════════════════════════════════════ */

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: Math.random() * 1.8 + 0.3,
  o: Math.random() * 0.55 + 0.15,
  d: Math.random() * 4 + 2,
  del: Math.random() * 5,
}));

const DUST = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  s: Math.random() * 0.9 + 0.2,
  dur: Math.random() * 8 + 5,
  del: Math.random() * 8,
}));

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3.5 + 1,
  color: i % 3 === 0
    ? `rgba(255,122,0,${(Math.random() * 0.5 + 0.3).toFixed(2)})`
    : i % 3 === 1
      ? `rgba(0,229,255,${(Math.random() * 0.4 + 0.2).toFixed(2)})`
      : `rgba(124,58,237,${(Math.random() * 0.4 + 0.2).toFixed(2)})`,
  dur: Math.random() * 7 + 5,
  del: Math.random() * 6,
}));

/* ═══════════════════════════════════════════════════════
   LETTER DEFINITIONS WITH CINEMATIC ENTRY VECTORS
   Each letter flies from a unique direction/corner
═══════════════════════════════════════════════════════ */

// Line 1: "RCE SEO"
const LINE1 = [
  { char: 'R', dx: -960, dy: -600, i: 0  },   // top-left corner
  { char: 'C', dx:  920, dy: -580, i: 1  },   // top-right corner
  { char: 'E', dx: -880, dy:  560, i: 2  },   // bottom-left corner
  { char: ' ', dx:    0, dy:    0, i: -1 },   // space (no anim)
  { char: 'S', dx: -980, dy:   80, i: 3  },   // left edge
  { char: 'E', dx:  960, dy:  -60, i: 4  },   // right edge
  { char: 'O', dx:   80, dy: -680, i: 5  },   // top edge center
];

// Line 2: "OPTIMIZER"
const LINE2 = [
  { char: 'O', dx: -820, dy:  720, i: 6  },   // bottom-left
  { char: 'P', dx:  760, dy:  700, i: 7  },   // bottom-right
  { char: 'T', dx:  -60, dy:  780, i: 8  },   // bottom center
  { char: 'I', dx:  800, dy: -500, i: 9  },   // top-right
  { char: 'M', dx: -680, dy: -460, i: 10 },   // top-left
  { char: 'I', dx:  900, dy:  240, i: 11 },   // right edge
  { char: 'Z', dx: -860, dy:  280, i: 12 },   // left edge
  { char: 'E', dx:  580, dy:  740, i: 13 },   // bottom-right
  { char: 'R', dx:   40, dy:  800, i: 14 },   // bottom edge
];

/* ═══════════════════════════════════════════════════════
   PHASE TIMING (ms) — Total: 4.5 seconds
═══════════════════════════════════════════════════════ */
const T = {
  AMBIENT:    450,
  FLY:        750,
  ASSEMBLED: 2100,
  LOGO_BLOB: 2400,
  LOGO_SHARP:2700,
  SWEEP:     3060,
  ZOOM:      3360,
  SHOCKWAVE: 3360,
  EXIT:      3780,
  DONE:      4500,
};

/* ═══════════════════════════════════════════════════════
   SPRING CONFIG
═══════════════════════════════════════════════════════ */
const SPRING = { type: 'spring', stiffness: 120, damping: 15 };
const SPRING_SLOW = { type: 'spring', stiffness: 90, damping: 20 };

/* ═══════════════════════════════════════════════════════
   INDIVIDUAL LETTER COMPONENT
═══════════════════════════════════════════════════════ */
const FlyLetter = ({ char, dx, dy, letterIndex, fly, assembled, large }) => {
  const delay = letterIndex * 0.038;

  return (
    <motion.span
      initial={{ x: dx, y: dy, opacity: 0, filter: 'blur(14px)', scale: 0.75 }}
      animate={fly ? {
        x: 0,
        y: 0,
        opacity: 1,
        filter: assembled ? 'blur(0px)' : 'blur(2px)',
        scale: 1,
        textShadow: assembled
          ? '0 0 30px rgba(255,122,0,0.6), 0 0 80px rgba(255,122,0,0.18)'
          : '0 0 18px rgba(255,122,0,0.2)',
      } : {}}
      transition={{
        ...SPRING,
        delay,
        opacity: { duration: 0.25, delay },
        filter:  { duration: 0.4, delay: delay + 0.1 },
      }}
      style={{
        display: 'inline-block',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 900,
        fontSize: large ? 'clamp(42px, 6.5vw, 80px)' : 'clamp(26px, 4.2vw, 54px)',
        lineHeight: 1,
        color: '#ffffff',
        letterSpacing: large ? '-0.02em' : '0.18em',
        willChange: 'transform',
        userSelect: 'none',
      }}
    >
      {char}
    </motion.span>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN SPLASH SCREEN
═══════════════════════════════════════════════════════ */
const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), T.AMBIENT),
      setTimeout(() => setPhase(2), T.FLY),
      setTimeout(() => setPhase(3), T.ASSEMBLED),
      setTimeout(() => setPhase(4), T.LOGO_BLOB),
      setTimeout(() => setPhase(5), T.LOGO_SHARP),
      setTimeout(() => setPhase(6), T.SWEEP),
      setTimeout(() => setPhase(7), T.ZOOM),
      setTimeout(() => setPhase(8), T.EXIT),
      setTimeout(() => onComplete(), T.DONE),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const fly      = phase >= 2;
  const assembled = phase >= 3;
  const logoBlob = phase >= 4;
  const logoSharp = phase >= 5;
  const sweep    = phase === 6;
  const zoom     = phase >= 7;
  const exit     = phase >= 8;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: exit ? 0.55 : 0.4, ease: 'easeInOut' }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#030409',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: exit ? 'none' : 'all',
      }}
    >

      {/* ─── 1. CENTER AMBIENT GLOW ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={phase >= 1 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,122,0,0.10) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ─── 2. RGB AMBIENT BLOBS ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : {}}
        transition={{ duration: 2.0 }}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      >
        {/* Orange blob */}
        <motion.div
          animate={{ x: [0, 30, -15, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: 600, height: 600,
            top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(255,122,0,0.14) 0%, transparent 65%)',
            filter: 'blur(40px)', borderRadius: '50%',
          }}
        />
        {/* Purple blob */}
        <motion.div
          animate={{ x: [0, -25, 20, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', width: 550, height: 550,
            bottom: '-10%', right: '-8%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.13) 0%, transparent 65%)',
            filter: 'blur(50px)', borderRadius: '50%',
          }}
        />
        {/* Cyan blob */}
        <motion.div
          animate={{ x: [0, 15, -30, 0], y: [0, -30, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          style={{
            position: 'absolute', width: 450, height: 450,
            top: '30%', right: '10%',
            background: 'radial-gradient(circle, rgba(0,229,255,0.09) 0%, transparent 65%)',
            filter: 'blur(45px)', borderRadius: '50%',
          }}
        />
      </motion.div>

      {/* ─── 3. STAR DUST ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : {}}
        transition={{ duration: 1.2 }}
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      >
        {STARS.map(s => (
          <motion.div
            key={s.id}
            animate={{ opacity: [s.o * 0.3, s.o, s.o * 0.2, s.o], scale: [1, 1.3, 1] }}
            transition={{ duration: s.d, delay: s.del, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${s.x}%`, top: `${s.y}%`,
              width: s.s, height: s.s,
              borderRadius: '50%',
              background: '#ffffff',
            }}
          />
        ))}
      </motion.div>

      {/* ─── 4. FLOATING PARTICLES ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={phase >= 1 ? { opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      >
        {PARTICLES.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -80, 0], opacity: [0, 0.9, 0] }}
            transition={{ duration: p.dur, delay: p.del, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, borderRadius: '50%',
              background: p.color,
              filter: `blur(${p.size > 2.5 ? 1 : 0}px)`,
            }}
          />
        ))}
      </motion.div>

      {/* ─── 5. VIGNETTE ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* ─── 6. MAIN CONTENT — CAMERA ZOOM WRAPPER ───────── */}
      <motion.div
        animate={zoom ? { scale: [1, 1.04, 1] } : { scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
        }}
      >

        {/* ── 6a. LOGO ────────────────────────────────────── */}
        <AnimatePresence>
          {logoBlob && (
            <motion.div
              key="logo-wrap"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.01 }}
              style={{ position: 'relative', marginBottom: 28 }}
            >
              {/* Shockwave ring — expands on logo lock */}
              <AnimatePresence>
                {zoom && (
                  <motion.div
                    key="shockwave"
                    initial={{ scale: 0.7, opacity: 0.45 }}
                    animate={{ scale: 3.5, opacity: 0 }}
                    transition={{ duration: 0.95, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      width: 110, height: 110,
                      marginTop: -55, marginLeft: -55,
                      borderRadius: '50%',
                      border: '1.5px solid rgba(255,122,0,0.75)',
                      pointerEvents: 'none', zIndex: 50,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Second ring (slight delay) */}
              <AnimatePresence>
                {zoom && (
                  <motion.div
                    key="shockwave2"
                    initial={{ scale: 0.7, opacity: 0.25 }}
                    animate={{ scale: 5, opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.12 }}
                    style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      width: 110, height: 110,
                      marginTop: -55, marginLeft: -55,
                      borderRadius: '50%',
                      border: '1px solid rgba(255,122,0,0.45)',
                      pointerEvents: 'none', zIndex: 49,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Glow orb (appears first) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.3 }}
                animate={logoBlob ? { opacity: logoSharp ? 0 : [0, 0.9, 0.7], scale: logoSharp ? 0.95 : [0.3, 1.2, 1.0] } : {}}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  position: 'absolute', inset: -20,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,122,0,0.6) 0%, rgba(255,122,0,0.2) 40%, transparent 70%)',
                  filter: 'blur(20px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Logo container */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0, filter: 'blur(30px)' }}
                animate={logoSharp
                  ? { scale: 1, opacity: 1, filter: 'blur(0px)' }
                  : logoBlob
                    ? { scale: 0.7, opacity: 0.6, filter: 'blur(16px)' }
                    : {}
                }
                transition={logoSharp
                  ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                  : { duration: 0.3, ease: 'easeOut' }
                }
              >
                {/* Breathing animation wrapper */}
                <motion.div
                  animate={logoSharp ? { scale: [1, 1.03, 1] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  style={{
                    width: 100, height: 100, borderRadius: 26,
                    background: '#ffffff',
                    overflow: 'hidden',
                    boxShadow: logoSharp
                      ? '0 0 40px rgba(255,122,0,0.45), 0 0 80px rgba(255,122,0,0.2), 0 12px 48px rgba(0,0,0,0.7)'
                      : '0 0 20px rgba(255,122,0,0.2)',
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="RCE SEO"
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain', display: 'block' }}
                  />
                </motion.div>
              </motion.div>

              {/* Persistent ambient glow behind logo */}
              <motion.div
                animate={logoSharp ? { opacity: [0.4, 0.9, 0.4] } : {}}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: -30, borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,122,0,0.25) 0%, transparent 70%)',
                  filter: 'blur(16px)', pointerEvents: 'none',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 6b. LIGHT SWEEP CONTAINER ───────────────────── */}
        <div style={{ position: 'relative' }}>
          {/* Light sweep diagonal */}
          <AnimatePresence>
            {sweep && (
              <motion.div
                key="sweep"
                initial={{ x: '-130%', skewX: -12 }}
                animate={{ x: '230%' }}
                transition={{ duration: 0.52, ease: [0.45, 0, 0.55, 1] }}
                style={{
                  position: 'absolute',
                  top: '-40px', left: '-30px',
                  width: '55%', height: 'calc(100% + 80px)',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,154,56,0.55) 40%, rgba(255,255,255,0.15) 50%, rgba(255,122,0,0.35) 60%, transparent 100%)',
                  pointerEvents: 'none', zIndex: 20,
                  filter: 'blur(4px)',
                }}
              />
            )}
          </AnimatePresence>

          {/* ── 6c. LETTER GROUP ──────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>

            {/* LINE 1: RCE SEO */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {LINE1.map((l, i) =>
                l.char === ' ' ? (
                  <span key={`sp-${i}`} style={{ display: 'inline-block', width: 'clamp(16px, 2.5vw, 28px)' }} />
                ) : (
                  <FlyLetter
                    key={`l1-${i}`}
                    char={l.char}
                    dx={l.dx}
                    dy={l.dy}
                    letterIndex={l.i}
                    fly={fly}
                    assembled={assembled}
                    large={true}
                  />
                )
              )}
            </div>

            {/* LINE 2: OPTIMIZER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {LINE2.map((l, i) => (
                <FlyLetter
                  key={`l2-${i}`}
                  char={l.char}
                  dx={l.dx}
                  dy={l.dy}
                  letterIndex={l.i}
                  fly={fly}
                  assembled={assembled}
                  large={false}
                />
              ))}
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={assembled ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
              style={{
                marginTop: 12,
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(9px, 1.1vw, 12px)',
                fontWeight: 500,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
              }}
            >
              Powered by Generative AI
            </motion.div>

            {/* Underline accent */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={assembled ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 1, width: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,122,0,0.55), rgba(0,229,255,0.35), transparent)',
                transformOrigin: 'center', marginTop: 4,
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* ─── 7. CINEMATIC CORNER FLARES ─────────────────────── */}
      <AnimatePresence>
        {assembled && (
          <>
            {[
              { top: 0, left: 0, tl: true },
              { top: 0, right: 0, tr: true },
              { bottom: 0, left: 0, bl: true },
              { bottom: 0, right: 0, br: true },
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0] }}
                transition={{ duration: 1.2, delay: i * 0.05 }}
                style={{
                  position: 'absolute', zIndex: 3,
                  width: 120, height: 120,
                  ...pos,
                  background: 'radial-gradient(circle at corner, rgba(255,122,0,0.18) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ─── 8. HORIZONTAL SCAN LINE (assembled moment) ─────── */}
      <AnimatePresence>
        {assembled && (
          <motion.div
            key="scanline"
            initial={{ scaleX: 0, opacity: 0.8 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', zIndex: 15, height: 1,
              left: 0, right: 0, top: '50%',
              background: 'linear-gradient(90deg, transparent, rgba(255,122,0,0.7), rgba(0,229,255,0.5), rgba(255,122,0,0.7), transparent)',
              pointerEvents: 'none', transformOrigin: 'center',
            }}
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SplashScreen;
