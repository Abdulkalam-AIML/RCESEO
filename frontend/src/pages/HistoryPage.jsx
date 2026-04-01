import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Trash2, Clock, ChevronLeft, ChevronRight, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../lib/api';
import ErrorFallback from '../components/ErrorFallback';

const PER_PAGE = 8;

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get('/rewrite/history');
      if (data.success) setHistory(data.data);
      setError(false);
    } catch { setError(true); }
    finally { setLoading(false); setRetrying(false); }
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const del = async (id) => {
    try {
      await api.delete(`/rewrite/${id}`);
      setHistory(p => p.filter(h => h._id !== id));
      showToast('Record deleted successfully', 'success');
    } catch { showToast('Could not delete record', 'error'); }
  };

  const filtered = history.filter(h =>
    h.targetKeyword?.toLowerCase().includes(search.toLowerCase()) ||
    h.rewrittenContent?.toLowerCase().includes(search.toLowerCase())
  );
  const pages = Math.ceil(filtered.length / PER_PAGE);
  const rows  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ maxWidth: 1200, paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <span className="badge badge-cyan" style={{ display: 'inline-flex', marginBottom: 14 }}><History size={10} /> Vault</span>
        <h1 className="t-h2" style={{ marginBottom: 6 }}>Rewrite <span style={{ color: 'var(--primary)' }}>History</span></h1>
        <p style={{ fontSize: 14, color: 'var(--muted)' }}>{history.length} optimization{history.length !== 1 ? 's' : ''} recorded</p>
      </motion.div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={15} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', pointerEvents: 'none', zIndex: 1 }} />
        <input type="text" placeholder="Search by keyword or content…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="input" style={{ paddingLeft: 44 }} />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.msg}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 16px', marginBottom: 16, borderRadius: 12,
              background: toast.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.22)'}`,
              color: toast.type === 'success' ? 'var(--success)' : '#ef4444',
              fontSize: 13, fontWeight: 600,
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, gap: 16 }}>
          <div className="spinner" />
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading history…</p>
        </div>
      ) : error ? (
        <ErrorFallback type="data" onRetry={() => { setLoading(true); setRetrying(true); setError(false); load(); }} retrying={retrying} />
      ) : rows.length === 0 ? (
        <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
          <History size={36} style={{ color: 'var(--primary)', opacity: 0.35, display: 'block', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
            {search ? `No results for "${search}"` : 'No history yet'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>{search ? 'Try a different search term.' : 'Start optimizing to build your history.'}</p>
        </div>
      ) : (
        <>
          <div className="glass" style={{ overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 48px', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {['Keyword / Date', 'Before', 'After', 'Gain', ''].map((h, i) => (
                <div key={i} className="t-label" style={{ textAlign: i > 0 ? 'center' : 'left' }}>{h}</div>
              ))}
            </div>

            {rows.map((item, i) => {
              const gain = (item.seoScoreAfter || 0) - (item.seoScoreBefore || 0);
              return (
                <motion.div key={item._id || i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.035 }}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 48px',
                    gap: 12, padding: '16px 20px',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                  whileHover={{ backgroundColor: 'var(--card-hover)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <FileText size={15} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}>
                        {item.targetKeyword || 'Untitled'}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, fontWeight: 500 }}>
                        <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--muted)', alignSelf: 'center', fontFamily: 'Outfit, sans-serif' }}>{item.seoScoreBefore ?? '—'}</div>
                  <div style={{ textAlign: 'center', fontSize: 15, fontWeight: 800, color: 'var(--primary)', alignSelf: 'center', fontFamily: 'Outfit, sans-serif' }}>{item.seoScoreAfter ?? '—'}</div>
                  <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 800, color: gain > 0 ? 'var(--success)' : gain < 0 ? '#ef4444' : 'var(--muted)', alignSelf: 'center', fontFamily: 'Outfit, sans-serif' }}>
                    {gain > 0 ? `+${gain}` : gain || '—'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button title="Delete" onClick={() => del(item._id)} className="btn-icon" style={{ width: 32, height: 32, borderRadius: 8 }}
                      onMouseOver={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 }}>
              <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft size={14} /> Prev
              </button>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>Page {page} of {pages}</span>
              <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }} disabled={page === pages} onClick={() => setPage(p => p + 1)}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryPage;
