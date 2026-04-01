import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * AnimatedBackground — subtle floating particles for dashboard pages.
 * Uses CSS variables for theme compatibility. No hardcoded dark colors.
 */
const PARTICLE_COUNT = 25;

const AnimatedBackground = ({ subtle = false }) => {
  // Stable random values using useMemo to prevent re-renders
  const particles = useMemo(
    () => Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      color: i % 3 === 0
        ? 'rgba(255,122,0,0.35)'
        : i % 3 === 1
          ? 'rgba(0,229,255,0.25)'
          : 'rgba(139,92,246,0.25)',
      duration: Math.random() * 12 + 16,
      xRange: (Math.random() - 0.5) * 20,
      yRange: (Math.random() - 0.5) * 20,
    })),
    []
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      background: 'var(--bg)',
      pointerEvents: 'none',
    }}>
      {/* Top-left ambient glow */}
      <div style={{
        position: 'absolute',
        top: '-15%', left: '-10%',
        width: '50%', height: '50%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'drift1 18s ease-in-out infinite alternate',
      }} />

      {/* Bottom-right ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '-15%', right: '-10%',
        width: '50%', height: '50%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,122,0,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'drift2 22s ease-in-out infinite alternate',
      }} />

      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
        opacity: subtle ? 0.4 : 0.7,
      }} />

      {/* Floating particles */}
      {!subtle && particles.map(p => (
        <motion.div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: [0, p.xRange, 0],
            y: [0, p.yRange, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
