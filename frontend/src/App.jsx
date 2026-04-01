import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

/* ── Lazy-loaded pages ── */
const LandingPage    = lazy(() => import('./pages/LandingPage'));
const Dashboard      = lazy(() => import('./pages/Dashboard'));
const RewritePage    = lazy(() => import('./pages/RewritePage'));
const AnalyticsPage  = lazy(() => import('./pages/AnalyticsPage'));
const HistoryPage    = lazy(() => import('./pages/HistoryPage'));
const SettingsPage   = lazy(() => import('./pages/SettingsPage'));
const GoogleSuccess  = lazy(() => import('./pages/GoogleSuccess'));

/* ── Components ── */
const SplashScreen  = lazy(() => import('./components/SplashScreen'));
const AuthModal     = lazy(() => import('./components/AuthModal'));
const DashboardLayout = lazy(() => import('./components/DashboardLayout'));

/* ── Page transition variants ── */
const PAGE = {
  initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.28, ease: 'easeIn' } },
};

/* ── Loading fallback ── */
const PageSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
    <div className="spinner" />
  </div>
);

/* ── Protected Route ── */
const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageSpinner />;
  return user ? children : <Navigate to="/" replace />;
};

/* ── Routes ── */
const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={PAGE} initial="initial" animate="animate" exit="exit">
        <Suspense fallback={<PageSpinner />}>
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LandingPage />} />
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/dashboard"  element={<Protected><DashboardLayout><Dashboard /></DashboardLayout></Protected>} />
            <Route path="/rewrite"    element={<Protected><DashboardLayout><RewritePage /></DashboardLayout></Protected>} />
            <Route path="/analytics"  element={<Protected><DashboardLayout><AnalyticsPage /></DashboardLayout></Protected>} />
            <Route path="/history"    element={<Protected><DashboardLayout><HistoryPage /></DashboardLayout></Protected>} />
            <Route path="/settings"   element={<Protected><DashboardLayout><SettingsPage /></DashboardLayout></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Inner App (has auth context) ── */
const AppInner = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { authModal, closeAuth } = useAuth();

  const handleSplashDone = () => {
    setShowSplash(false);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', transition: 'background 0.4s ease, color 0.4s ease' }}>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Suspense fallback={null}>
            <SplashScreen key="splash" onComplete={handleSplashDone} />
          </Suspense>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <AppRoutes />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global AuthModal */}
      <Suspense fallback={null}>
        <AuthModal isOpen={authModal.open} onClose={closeAuth} initialMode={authModal.mode} />
      </Suspense>
    </div>
  );
};

/* ── Root App ── */
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
