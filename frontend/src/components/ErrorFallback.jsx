import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCcw, ServerCrash, WifiOff, Lock, BrainCircuit } from 'lucide-react';

const TYPES = {
  data:   { icon: WifiOff,       color: '#f59e0b', title: 'Failed to Load Data',     msg: 'We couldn\'t reach the server. Check your connection and try again.' },
  ai:     { icon: BrainCircuit,  color: 'var(--primary)', title: 'AI Engine Unavailable', msg: 'The AI service is warming up. Please retry in a moment.' },
  server: { icon: ServerCrash,   color: '#ef4444', title: 'Server Error',             msg: 'An unexpected error occurred on our end. Our team has been notified.' },
  auth:   { icon: Lock,          color: 'var(--purple)', title: 'Session Expired',       msg: 'Your session has expired. Please sign in again to continue.' },
};

const ErrorFallback = ({ type = 'data', onRetry, retrying = false, message }) => {
  const t = TYPES[type];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass"
      style={{ padding: 'clamp(40px, 6vw, 64px)', textAlign: 'center', maxWidth: 460, margin: '0 auto' }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
          background: `${t.color}16`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${t.color}28`,
          boxShadow: `0 0 40px ${t.color}18`,
        }}
      >
        <t.icon size={30} style={{ color: t.color }} />
      </motion.div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 10, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.015em' }}>
        {t.title}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
        {message || t.msg}
      </p>
      {onRetry && (
        <button className="btn-primary" onClick={onRetry} style={{ padding: '12px 28px', fontSize: 13 }}>
          {retrying ? <div className="spinner-sm" /> : <><RefreshCcw size={14} /> Try Again</>}
        </button>
      )}
    </motion.div>
  );
};

export default ErrorFallback;
