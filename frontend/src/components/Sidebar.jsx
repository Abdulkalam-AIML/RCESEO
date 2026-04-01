import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wand2, BarChart3, History, Settings,
  LogOut, ArrowUpRight, X, Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard',  color: '#ff7a00' },
  { icon: Wand2,           label: 'AI Rewrite',  path: '/rewrite',    color: '#7c3aed' },
  { icon: BarChart3,       label: 'Analytics',  path: '/analytics',  color: '#00e5ff' },
  { icon: History,         label: 'History',    path: '/history',    color: '#10b981' },
  { icon: Settings,        label: 'Settings',   path: '/settings',   color: '#94a3b8' },
];

const SidebarContent = ({ onNav }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const go = (path) => { navigate(path); onNav?.(); };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px 16px' }}>
        {/* Logo in sidebar header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, overflow: 'hidden',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(255,122,0,0.22)', flexShrink: 0,
          }}>
            <img src="/logo.png" alt="RCE" width={36} height={36} style={{ objectFit: 'contain', display: 'block' }} />
          </div>
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 14, color: 'var(--text)', letterSpacing: '-0.02em' }}>
              RCE<span style={{ color: 'var(--primary)' }}> SEO</span>
            </span>
          </div>
        </div>

        {/* Section label */}
        <div className="t-label" style={{ paddingLeft: 12, marginBottom: 8 }}>Navigation</div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {NAV.map((item, i) => {
            const active = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => go(item.path)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={!active ? { x: 3 } : {}}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 14,
                  border: active ? `1px solid ${item.color}28` : '1px solid transparent',
                  background: active ? `${item.color}12` : 'transparent',
                  color: active ? item.color : 'var(--muted)',
                  fontFamily: 'Outfit, sans-serif', fontWeight: active ? 700 : 500,
                  fontSize: 14, cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'all 0.2s ease', position: 'relative',
                }}
                onMouseOver={e => { if (!active) { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--text)'; }}}
                onMouseOut={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}}
              >
                {/* Icon + pulse */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <item.icon size={17} />
                  {active && (
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2.8, opacity: 0 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      style={{ position: 'absolute', inset: -2, borderRadius: '50%', background: item.color, opacity: 0.25 }}
                    />
                  )}
                </div>
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="dot"
                    transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                    style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}`, flexShrink: 0 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Pro upgrade card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            margin: '16px 0', padding: 20, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--primary-alpha), var(--purple-alpha))',
            border: '1px solid rgba(255,122,0,0.16)',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -12, right: -12, width: 60, height: 60, background: 'radial-gradient(circle, rgba(255,122,0,0.22) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <motion.div animate={{ rotate: [0, 15, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--primary)" xmlns="http://www.w3.org/2000/svg"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </motion.div>
            <span className="t-label" style={{ color: 'var(--primary)' }}>Pro Tier</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.55, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>
            Unlock unlimited AI rewrites, advanced analytics, and team features.
          </p>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: 12 }}>
            Upgrade Now <ArrowUpRight size={13} />
          </button>
        </motion.div>

        {/* User row + logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 4px', borderTop: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 13, color: '#fff', flexShrink: 0, boxShadow: '0 2px 10px var(--primary-glow)' }}>
              {user.fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
            <button className="btn-icon"
              onClick={() => setLogoutOpen(true)}
              style={{ flexShrink: 0 }} title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted)', fontFamily: 'Outfit, sans-serif', letterSpacing: '0.06em', marginTop: 8 }}>
          v2.0 · Production
        </div>
      </div>

      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
};

export default SidebarContent;
