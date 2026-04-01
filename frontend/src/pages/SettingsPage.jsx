import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Palette, ChevronRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Section = ({ title, children }) => (
  <div className="glass" style={{ overflow: 'hidden', marginBottom: 20 }}>
    <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>{title}</h3>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const Field = ({ label, sub, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'Outfit, sans-serif', marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>}
    </div>
    {children}
  </div>
);

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const toggleStyle = (on) => ({
    width: 48, height: 26, borderRadius: 100, border: 'none', cursor: 'pointer',
    background: on ? 'var(--primary)' : 'var(--border-2)',
    position: 'relative', transition: 'background 0.3s',
    boxShadow: on ? '0 0 12px var(--primary-glow)' : 'none',
    flexShrink: 0,
  });

  const knobStyle = (on) => ({
    width: 20, height: 20, borderRadius: '50%', background: '#fff',
    position: 'absolute', top: 3,
    left: on ? 25 : 3,
    transition: 'left 0.3s cubic-bezier(0.22,1,0.36,1)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  });

  return (
    <div style={{ maxWidth: 760, paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <span className="badge badge-purple" style={{ display: 'inline-flex', marginBottom: 14 }}><Settings size={10} /> Configuration</span>
        <h1 className="t-h2" style={{ marginBottom: 6 }}>Settings <span style={{ color: 'var(--primary)' }}>Panel</span></h1>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <Section title="Profile">
        {user && (
          <>
            <Field label="Name" sub="Your display name">
              <input defaultValue={user.fullName} className="input" style={{ width: 220 }} />
            </Field>
            <Field label="Email Address" sub="Used for sign-in and notifications">
              <input defaultValue={user.email} className="input" style={{ width: 220 }} disabled />
            </Field>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" style={{ padding: '11px 24px', fontSize: 13 }}>Save Changes</button>
            </div>
          </>
        )}
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <Field label="Theme" sub="Choose between dark and light interface">
          <button onClick={toggleTheme} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 20px', borderRadius: 100,
            background: 'var(--card)', border: '1px solid var(--border)',
            color: 'var(--text)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
            fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
          }}>
            {isDark ? <><Sun size={14} style={{ color: '#f59e0b' }} /> Light Mode</> : <><Moon size={14} style={{ color: 'var(--purple)' }} /> Dark Mode</>}
          </button>
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Field label="Rewrite Alerts" sub="Get notified when your rewrite is complete">
          <button style={toggleStyle(notifications)} onClick={() => setNotifications(n => !n)}>
            <div style={knobStyle(notifications)} />
          </button>
        </Field>
        <Field label="Marketing Emails" sub="Tips, feature updates, and best practices">
          <button style={toggleStyle(marketing)} onClick={() => setMarketing(n => !n)}>
            <div style={knobStyle(marketing)} />
          </button>
        </Field>
      </Section>

      {/* Security */}
      <Section title="Security">
        <Field label="Change Password" sub="Use a strong, unique password">
          <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13 }}>Update Password</button>
        </Field>
        <Field label="Two-Factor Auth" sub="Add an extra layer of security">
          <button className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13 }}>Configure 2FA</button>
        </Field>
      </Section>

      {/* Danger zone */}
      <div className="glass" style={{ overflow: 'hidden', border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.04)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', fontFamily: 'Outfit, sans-serif' }}>Danger Zone</h3>
        </div>
        <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>Delete Account</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Permanently remove your account and all data. This action is irreversible.</div>
          </div>
          <button style={{
            padding: '11px 20px', borderRadius: 100, border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontFamily: 'Outfit, sans-serif',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
          }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
