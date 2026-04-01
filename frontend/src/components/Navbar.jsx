import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, openAuth, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      }}>
        <div className="container" style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, overflow: 'hidden',
              background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 12px rgba(255,122,0,0.25)',
              flexShrink: 0,
            }}>
              <img src="/logo.png" alt="RCE SEO" width={38} height={38} style={{ objectFit: 'contain', display: 'block' }} />
            </div>
            <div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                RCE<span style={{ color: 'var(--primary)' }}> SEO</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden lg:flex">
            {['Features', 'Pricing', 'About'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                padding: '8px 16px', borderRadius: 10,
                color: 'var(--muted)', fontFamily: 'Outfit, sans-serif',
                fontWeight: 500, fontSize: 14, textDecoration: 'none',
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--card)'; }}
              onMouseOut={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {l}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title={isDark ? 'Switch to light' : 'Switch to dark'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={17} />
                  </motion.span>
                ) : (
                  <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={17} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Auth buttons */}
            {!user ? (
              <div style={{ display: 'flex', gap: 8 }} className="hidden md:flex">
                <button className="btn-ghost" style={{ padding: '9px 20px', fontSize: 13 }} onClick={() => openAuth('login')}>
                  Sign In
                </button>
                <button className="btn-primary" style={{ padding: '9px 20px', fontSize: 13 }} onClick={() => openAuth('signup')}>
                  Get Started
                </button>
              </div>
            ) : (
              /* Profile dropdown */
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--purple))',
                    border: '2px solid var(--border-2)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                    fontSize: 14, color: '#fff',
                    boxShadow: '0 2px 12px var(--primary-glow)',
                    flexShrink: 0,
                  }}
                >
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                          width: 220, background: 'var(--surface)', border: '1px solid var(--border)',
                          borderRadius: 18, boxShadow: 'var(--shadow-xl)', zIndex: 99,
                          overflow: 'hidden', padding: 8,
                        }}
                      >
                        <div style={{ padding: '10px 12px 14px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{user.fullName}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                        </div>
                        {[
                          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                          { icon: Settings, label: 'Settings', path: '/settings' },
                        ].map(item => (
                          <button key={item.path}
                            onClick={() => { navigate(item.path); setProfileOpen(false); }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                              padding: '10px 12px', borderRadius: 10, background: 'none', border: 'none',
                              color: 'var(--text-2)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                              fontFamily: 'Outfit, sans-serif', transition: 'background 0.15s',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'var(--card)'}
                            onMouseOut={e => e.currentTarget.style.background = 'none'}
                          >
                            <item.icon size={15} style={{ color: 'var(--muted)' }} /> {item.label}
                          </button>
                        ))}
                        <div style={{ margin: '6px 0', height: 1, background: 'var(--border)' }} />
                        <button
                          onClick={() => { setProfileOpen(false); setLogoutOpen(true); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                            padding: '10px 12px', borderRadius: 10, background: 'none', border: 'none',
                            color: '#ef4444', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif', transition: 'background 0.15s',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                          onMouseOut={e => e.currentTarget.style.background = 'none'}
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="btn-icon lg:hidden" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: 'hidden', background: 'var(--nav-bg)',
                backdropFilter: 'blur(20px)', borderTop: '1px solid var(--nav-border)',
              }}
            >
              <div className="container" style={{ padding: '16px clamp(20px, 4vw, 80px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Features', 'Pricing', 'About'].map(l => (
                  <a key={l} href={`#${l.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    style={{ padding: '10px 12px', borderRadius: 10, color: 'var(--text-2)', fontFamily: 'Outfit, sans-serif', fontWeight: 500, fontSize: 15, textDecoration: 'none' }}
                  >{l}</a>
                ))}
                {!user && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { openAuth('login'); setMobileOpen(false); }}>Sign In</button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => { openAuth('signup'); setMobileOpen(false); }}>Get Started</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
};

export default Navbar;
