import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setError('Authentication token missing. Please try signing in again.');
      return;
    }

    // Small delay for cinematic transition
    const timer = setTimeout(() => {
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => {
          if (data.success && data.user) {
            login(token, data.user);
            navigate('/dashboard', { replace: true });
          } else {
            setError('Account verification failed. Please try again.');
          }
        })
        .catch((err) => {
          console.error('Verify error:', err);
          setError(err.response?.data?.message || 'Verification server error.');
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, login]);

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass"
        style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '100%', borderRadius: 28, border: '1px solid var(--border)' }}
      >
        {!error ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(16,185,129,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(16,185,129,0.2)', boxShadow: '0 12px 40px rgba(16,185,129,0.15)' }}
            >
              <CheckCircle size={32} style={{ color: 'var(--success)' }} />
            </motion.div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>Login Successful</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6 }}>Establishing secure session and syncing your personalized dashboard…</p>
            <div className="spinner" style={{ margin: '32px auto 0', width: 36, height: 36, borderWidth: 3 }} />
          </>
        ) : (
          <>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <AlertTriangle size={32} style={{ color: '#ef4444' }} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>Auth Failed</h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>{error}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: 14 }}
            >
              <ArrowLeft size={18} /> Return Home
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default GoogleSuccess;
