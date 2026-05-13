'use client';
import { useState } from 'react';
import styles from './ShareModal.module.css';

const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366', emoji: '💬', url: (txt) => `https://wa.me/?text=${encodeURIComponent(txt)}` },
  { id: 'instagram', label: 'Instagram', color: '#E1306C', emoji: '📸', url: () => null },
  { id: 'twitter', label: 'Twitter', color: '#1DA1F2', emoji: '🐦', url: (txt) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}` },
  { id: 'email', label: 'Email', color: '#EA4335', emoji: '✉️', url: (txt) => `mailto:?subject=A%20Greeting%20For%20You&body=${encodeURIComponent(txt)}` },
  { id: 'telegram', label: 'Telegram', color: '#0088cc', emoji: '✈️', url: (txt) => `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(txt)}` },
];

export default function ShareModal({ onClose, onDownload, onShare, cardRef, templateName }) {
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDownload = async () => {
    setLoading('download');
    try { await onDownload(); showToast('✅ Card downloaded!'); }
    catch { showToast('❌ Download failed'); }
    setLoading('');
  };

  const handleNativeShare = async () => {
    setLoading('share');
    try {
      const result = await onShare();
      showToast(result === 'shared' ? '✅ Card shared!' : '✅ Card downloaded!');
    } catch { showToast('❌ Share failed'); }
    setLoading('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Link copied!'));
  };

  const handlePlatform = (platform) => {
    const text = `Check out this beautiful greeting card I made on Wishify! 🎉✨`;
    if (platform.id === 'instagram') {
      handleDownload().then(() => showToast('📸 Download done – open Instagram to share!'));
      return;
    }
    const url = platform.url(text);
    if (url) window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" id="share-modal">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Share Your Card</h2>
          <p className={styles.sub}>{templateName}</p>
          <button className={styles.closeBtn} onClick={onClose} id="share-close-btn" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {/* Social Platforms */}
          <p className={styles.sectionLabel}>Share on</p>
          <div className={styles.platforms}>
            {PLATFORMS.map((p) => (
              <button key={p.id} className={styles.platformBtn} onClick={() => handlePlatform(p)} id={`share-${p.id}`}>
                <span className={styles.platformIcon} style={{ background: p.color + '22', border: `1px solid ${p.color}44` }}>
                  {p.emoji}
                </span>
                <span className={styles.platformLabel}>{p.label}</span>
              </button>
            ))}
          </div>

          <div className="divider">or</div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button
              className={`btn btn-primary ${styles.actionBtn}`}
              onClick={handleNativeShare}
              disabled={loading === 'share'}
              id="share-native-btn"
            >
              {loading === 'share' ? (
                <><span className={styles.spin} /> Sharing…</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Share Card</>
              )}
            </button>
            <button
              className={`btn btn-outline ${styles.actionBtn}`}
              onClick={handleDownload}
              disabled={loading === 'download'}
              id="share-download-btn"
            >
              {loading === 'download' ? (
                <><span className={styles.spin} /> Saving…</>
              ) : (
                <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PNG</>
              )}
            </button>
            <button className={`btn btn-ghost ${styles.actionBtn}`} onClick={handleCopyLink} id="share-copy-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Link
            </button>
          </div>
        </div>

        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    </div>
  );
}
