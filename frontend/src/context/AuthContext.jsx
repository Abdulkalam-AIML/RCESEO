import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rce_user')) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('rce_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('rce_token');
        localStorage.removeItem('rce_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userObj) => {
    localStorage.setItem('rce_token', token);
    localStorage.setItem('rce_user', JSON.stringify(userObj));
    setUser(userObj);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('rce_token');
    localStorage.removeItem('rce_user');
    setUser(null);
  }, []);

  const loginWithGoogle = useCallback(() => {
    // Production Vercel URL or local fallback
    const isProd = !window.location.hostname.includes('localhost');
    const apiBase = isProd 
      ? 'https://rceseo-api.vercel.app/api'
      : (import.meta.env.VITE_API_URL || 'http://localhost:5001/api');
      
    const cleanBase = apiBase.replace(/\/$/, '');
    window.location.href = `${cleanBase}/auth/google`;
  }, []);

  const openAuth = useCallback((mode = 'login') => {
    setAuthModal({ open: true, mode });
  }, []);
  const closeAuth = useCallback(() => {
    setAuthModal(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, loginWithGoogle,
      authModal, openAuth, closeAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
