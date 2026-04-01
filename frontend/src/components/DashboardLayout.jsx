import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';

const SIDEBAR_W = 268;

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Desktop Sidebar ── */}
      <aside style={{
        width: SIDEBAR_W, flexShrink: 0,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100, overflowY: 'auto',
        display: 'none',  // hidden on mobile via class
        flexDirection: 'column',
      }} className="lg:flex">
        <Sidebar />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            />
            <motion.aside
              initial={{ x: -SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_W }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0, width: SIDEBAR_W, zIndex: 201,
                background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)',
                overflowY: 'auto',
              }}
            >
              <Sidebar onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="lg:ml-[268px]">

        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 99,
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          height: 64, display: 'flex', alignItems: 'center',
          padding: '0 clamp(16px, 3vw, 32px)',
          gap: 16,
        }}>
          {/* Mobile hamburger */}
          <button className="btn-icon lg:hidden" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={17} /> : <Menu size={17} />}
          </button>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Theme toggle */}
          <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
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
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 'clamp(24px, 3.5vw, 48px)', maxWidth: '100%', overflowX: 'hidden' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
