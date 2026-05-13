'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { getTemplateById } from '@/data/templates';
import { downloadCard, shareCard } from '@/utils/imageUtils';
import Navbar from '@/components/Navbar';
import ShareModal from '@/components/ShareModal';
import PremiumModal from '@/components/PremiumModal';
import styles from './editor.module.css';

export default function EditorPage() {
  const { user, loading, isPremium } = useApp();
  const router = useRouter();
  const params = useParams();
  const cardRef = useRef(null);

  const template = getTemplateById(params.id);

  const [customName, setCustomName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [toast, setToast] = useState('');
  
  // Customization States
  const [nameFont, setNameFont] = useState('Playfair Display');
  const [cardColor, setCardColor] = useState('');
  const [msgFontSize, setMsgFontSize] = useState(13);
  const [msgFontWeight, setMsgFontWeight] = useState(400);
  const [decoration, setDecoration] = useState('none');

  useEffect(() => {
    if (!loading && !user) { router.replace('/'); return; }
    if (user) {
      setCustomName(user.name || '');
      setCustomMessage(template?.message || '');
      setCardColor(template?.gradient || '#8b5cf6');
    }
  }, [loading, user, router, template]);

  useEffect(() => {
    if (!loading && !template) router.replace('/home');
  }, [loading, template, router]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!user || !template) return null;

  const initials = customName
    ? customName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    await downloadCard(cardRef.current, `wishify-${template.id}.png`);
    showToast('✅ Card downloaded!');
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    const result = await shareCard(cardRef.current, `My ${template.category} Greeting`);
    return result;
  };

  const handlePremiumAction = (action) => {
    if (!isPremium) {
      setShowPremium(true);
      return;
    }
    action();
  };

  const textAlign = template.textAlign || 'center';
  const photoPos = template.photoPosition || 'top-center';

  const PRESET_COLORS = [
    '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#6366f1',
    'linear-gradient(135deg, #8b5cf6, #ec4899)',
    'linear-gradient(135deg, #3b82f6, #10b981)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #000, #434343)',
  ];

  return (
    <>
    <div className={styles.page}>
      <Navbar />

      <div className={`container ${styles.layout}`}>
        {/* Back */}
        <button className={styles.backBtn} onClick={() => router.back()} id="editor-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Templates
        </button>

        <div className={styles.editorFlex}>
          {/* ── Card Preview (Capturable) ── */}
          <div className={styles.previewWrap}>
            <p className={styles.previewLabel}>Live Preview</p>
            <div
              ref={cardRef}
              id="card-canvas"
              className={styles.cardCanvas}
              style={{
                background: cardColor,
                '--msg-font-size': `${msgFontSize}px`,
                '--msg-font-weight': msgFontWeight,
              }}
            >
              {/* Glossy Shine */}
              <div className={styles.cardShine} />

              {/* Animated BG Orbs */}
              <div className={styles.cardBgAnim}>
                <div className={`${styles.orb} ${styles.orb1}`} />
                <div className={`${styles.orb} ${styles.orb2}`} />
              </div>

              {/* Decoration Layer */}
              {decoration !== 'none' && (
                <div className={`${styles.decorationLayer} ${styles[`decoration_${decoration}`]}`} />
              )}

              {/* Pattern */}
              <div className={styles.canvasPattern} style={{
                backgroundImage: template.pattern,
                backgroundSize: template.patternSize || '20px 20px',
              }} />

              {/* Floating Emoji */}
              <div className={`${styles.canvasEmoji} ${styles[`emoji_${photoPos.replace('-','_')}`]}`}>
                {template.emoji}
              </div>

              {/* User Photo */}
              <div className={`${styles.photoWrap} ${styles[`photo_${photoPos.replace('-','_')}`]}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={customName} className={styles.photoImg} crossOrigin="anonymous" />
                ) : (
                  <div className={styles.photoPlaceholder}>{initials}</div>
                )}
              </div>

              {/* Text Overlay */}
              <div
                key={`${customName}-${customMessage}`} // Force re-animate on change
                className={`${styles.textOverlay} ${styles[`text_${textAlign}`]}`}
                style={{ color: template.textColor }}
              >
                <p className={styles.cardName} style={{ fontFamily: nameFont }}>{customName || 'Your Name'}</p>
                <p className={styles.cardMessage}>{customMessage || template.message}</p>
              </div>

              {/* Watermark (Hidden for premium) */}
              {!isPremium && <div className={styles.watermark}>Made with Wishify ✨</div>}
            </div>
            
            {!isPremium && (
              <div className="card-hint" style={{ fontSize: '11px', color: '#475569', textAlign: 'center', marginTop: '8px' }}>
                👑 Upgrade to Premium to remove the watermark
              </div>
            )}
          </div>

          {/* ── Controls Panel ── */}
          <div className={styles.controls}>
            {/* Basic Info */}
            <div className={styles.controlCard}>
              <h2 className={styles.controlTitle}>✏️ Basic Details</h2>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Your Name on Card</label>
                <input
                  id="editor-name-input"
                  className="input"
                  type="text"
                  placeholder="Enter your name…"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={30}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Greeting Message</label>
                <textarea
                  id="editor-message-input"
                  className={`input ${styles.textarea}`}
                  placeholder="Type your message…"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={3}
                  maxLength={150}
                />
                <span className={styles.charCount}>{customMessage.length}/150</span>
              </div>
            </div>

            {/* Premium Styles */}
            <div className={styles.controlCard}>
              <h2 className={styles.controlTitle}>
                👑 Premium Styles 
                {!isPremium && <span className={styles.premiumBadge}>Locked</span>}
              </h2>

              {/* Color Picker */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>
                  Background Theme
                  <span>{isPremium ? 'Unlocked' : 'Premium Only'}</span>
                </label>
                <div className={styles.colorGrid}>
                  {PRESET_COLORS.map((c) => (
                    <div
                      key={c}
                      className={`${styles.colorCircle} ${cardColor === c ? styles.colorActive : ''}`}
                      style={{ background: c }}
                      onClick={() => handlePremiumAction(() => setCardColor(c))}
                    />
                  ))}
                </div>
              </div>

              {/* Font Settings */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Message Font Size</label>
                <div className={styles.toggleGroup}>
                  {[12, 13, 15, 18].map((s) => (
                    <button
                      key={s}
                      className={`${styles.toggleBtn} ${msgFontSize === s ? styles.toggleActive : ''}`}
                      onClick={() => handlePremiumAction(() => setMsgFontSize(s))}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Weight */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Font Weight</label>
                <div className={styles.toggleGroup}>
                  {[400, 500, 700, 900].map((w) => (
                    <button
                      key={w}
                      className={`${styles.toggleBtn} ${msgFontWeight === w ? styles.toggleActive : ''}`}
                      onClick={() => handlePremiumAction(() => setMsgFontWeight(w))}
                    >
                      {w === 400 ? 'Regular' : w === 700 ? 'Bold' : w === 900 ? 'Black' : 'Medium'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorations */}
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Decorations</label>
                <div className={styles.toggleGroup}>
                  {['none', 'sparkles', 'confetti'].map((d) => (
                    <button
                      key={d}
                      className={`${styles.toggleBtn} ${decoration === d ? styles.toggleActive : ''}`}
                      onClick={() => handlePremiumAction(() => setDecoration(d))}
                    >
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Name Font</label>
                <div className={styles.fontPicker}>
                  {['Playfair Display','Inter','Georgia','cursive'].map((f) => (
                    <button
                      key={f}
                      id={`font-${f.replace(' ','-').toLowerCase()}`}
                      className={`${styles.fontBtn} ${nameFont === f ? styles.fontActive : ''}`}
                      onClick={() => setNameFont(f)}
                      style={{ fontFamily: f }}
                    >
                      Aa
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                id="editor-share-btn"
                className={`btn btn-primary ${styles.actionBtn}`}
                onClick={() => setShowShare(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share Card
              </button>
              <button
                id="editor-download-btn"
                className={`btn btn-outline ${styles.actionBtn}`}
                onClick={handleDownload}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download PNG
              </button>
              <button
                id="editor-browse-btn"
                className={`btn btn-ghost ${styles.actionBtn}`}
                onClick={() => router.push('/home')}
              >
                Browse More Templates
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

      {/* Modals outside .page so position:fixed is viewport-relative */}
      {showShare && (
        <ShareModal
          templateName={template.name}
          onClose={() => setShowShare(false)}
          onDownload={handleDownload}
          onShare={handleShare}
          cardRef={cardRef}
        />
      )}

      {showPremium && (
        <PremiumModal onClose={() => setShowPremium(false)} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
