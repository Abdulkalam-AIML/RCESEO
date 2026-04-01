import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) { navigate('/'); return; }

    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        login(token, data.user);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => navigate('/', { replace: true }));
  }, []);

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: 56, textAlign: 'center', maxWidth: 360 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6 }}
          style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(16,185,129,0.25)', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}
        >
          <CheckCircle size={28} style={{ color: 'var(--success)' }} />
        </motion.div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 10, fontFamily: 'Outfit, sans-serif' }}>Google Sign-In Successful</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Redirecting to your dashboard…</p>
        <div className="spinner" style={{ margin: '24px auto 0', width: 32, height: 32, borderWidth: 2 }} />
      </motion.div>
    </div>
  );
};

export default GoogleSuccess;
