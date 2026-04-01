import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
          />
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="glass"
            style={{ position: 'relative', width: '100%', maxWidth: 400, padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center' }}
          >
            <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(239,68,68,0.18)' }}>
              <LogOut size={18} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 10, marginTop: 8, fontFamily: 'Outfit, sans-serif' }}>Sign Out?</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.65 }}>
              You'll need to sign in again to access your dashboard and rewrites.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-ghost" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleLogout} style={{
                flex: 1, padding: '13px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff',
                fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 14,
                boxShadow: '0 8px 24px rgba(239,68,68,0.32)', transition: 'all 0.2s',
              }}>
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;
