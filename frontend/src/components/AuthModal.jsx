import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertTriangle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

/** Premium AuthModal — 3D card flip on mode switch */
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Sync mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setForm({ name: '', email: '', password: '' });
    }
  }, [isOpen, initialMode]);

  const switchMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { data } = await api.post('/auth/register', { fullName: form.name, email: form.email, password: form.password });
        if (data.success) { login(data.token, data.user); onClose(); navigate('/dashboard'); }
      } else {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
        if (data.success) { login(data.token, data.user); onClose(); navigate('/dashboard'); }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const INPUT_STYLE = {
    width: '100%', padding: '14px 18px 14px 48px',
    background: 'var(--input-bg)', border: '1px solid var(--input-border)',
    borderRadius: 14, color: 'var(--text)',
    fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 400,
    outline: 'none', transition: 'all 0.25s ease',
  };

  const onFocus = (e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 4px var(--primary-alpha)'; };
  const onBlur  = (e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none'; };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.86, opacity: 0, y: 48 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.86, opacity: 0, y: 48 }}
            transition={{ type: 'spring', damping: 24, stiffness: 240 }}
            style={{
              position: 'relative', width: '100%', maxWidth: 460,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 28, overflow: 'hidden',
              boxShadow: '0 40px 120px rgba(0,0,0,0.5), 0 0 80px rgba(255,122,0,0.06)',
            }}
          >
            {/* Top ambient */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 280, height: 100, background: 'radial-gradient(ellipse, var(--primary-alpha) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Header */}
            <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px var(--primary-glow)' }}>
                  <Zap size={17} color="#fff" fill="#fff" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em' }}>
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1, fontWeight: 400 }}>
                    {mode === 'login' ? 'Sign in to your dashboard' : 'Start optimizing for free'}
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={onClose} style={{ flexShrink: 0 }}><X size={16} /></button>
            </div>

            {/* 3D Flip Form Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ rotateY: mode === 'signup' ? 90 : -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: mode === 'signup' ? -90 : 90, opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                style={{ padding: '24px 28px 28px', transformStyle: 'preserve-3d' }}
              >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  {/* Name (signup only) */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        key="name-field"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ position: 'relative' }}>
                          <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', zIndex: 1 }} />
                          <input type="text" placeholder="Full Name" required value={form.name}
                            onChange={e => { setForm(p => ({ ...p, name: e.target.value })); setError(''); }}
                            style={INPUT_STYLE} onFocus={onFocus} onBlur={onBlur}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', zIndex: 1 }} />
                    <input type="email" placeholder="Email Address" required value={form.email}
                      onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setError(''); }}
                      style={INPUT_STYLE} onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>

                  {/* Password */}
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', zIndex: 1 }} />
                    <input type={showPass ? 'text' : 'password'} placeholder="Password" required value={form.password}
                      onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setError(''); }}
                      style={{ ...INPUT_STYLE, paddingRight: 48 }} onFocus={onFocus} onBlur={onBlur}
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', padding: 4 }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#ef4444', fontSize: 13, fontWeight: 600 }}
                      >
                        <AlertTriangle size={14} style={{ flexShrink: 0 }} /> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: 14, marginTop: 4 }}>
                    {loading ? <div className="spinner-sm" /> : <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>}
                  </button>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="divider" style={{ flex: 1 }} />
                    <span className="t-label" style={{ fontSize: 10 }}>or</span>
                    <div className="divider" style={{ flex: 1 }} />
                  </div>

                  {/* Google */}
                  <button type="button" onClick={() => { loginWithGoogle(); onClose(); }}
                    className="btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* Switch mode */}
                  <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button type="button" onClick={switchMode}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      {mode === 'login' ? 'Sign up free' : 'Sign in'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
