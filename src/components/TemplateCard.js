'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './TemplateCard.module.css';

export default function TemplateCard({ template, onPremiumClick, index = 0 }) {
  const { user, isPremium } = useApp();
  const router = useRouter();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isLocked = template.isPremium && !isPremium;

  const handleClick = () => {
    if (isLocked) onPremiumClick(template);
    else router.push(`/editor/${template.id}`);
  };

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const delayStyle = { animationDelay: `${(index % 12) * 60}ms` };

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${template.isPremium ? styles.cardPremium : ''}`}
      onClick={handleClick}
      id={`template-${template.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      aria-label={`${template.name} – ${template.isPremium ? 'Premium' : 'Free'}`}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(-8px) scale(1.02)`
          : 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)',
        ...delayStyle,
      }}
    >
      <div className={styles.cardShine} />

      {template.isPremium && <div className={styles.premiumRing} />}

      <div className={styles.bg} style={{ background: template.gradient }}>

        <div className={styles.pattern} style={{ backgroundImage: template.pattern, backgroundSize: template.patternSize || '20px 20px' }} />

        <div className={styles.cardOrb} style={{ background: 'rgba(255,255,255,0.12)', top: '-30%', left: '-20%' }} />
        <div className={styles.cardOrb} style={{ background: 'rgba(255,255,255,0.08)', bottom: '-20%', right: '-10%', animationDelay: '-4s' }} />

        <div className={`${styles.emoji} ${styles[`emoji_${template.photoPosition?.replace('-', '_')}`]}`}>
          {template.emoji}
        </div>

        <div className={`${styles.photoOverlay} ${styles[`photo_${template.photoPosition?.replace('-', '_')}`]}`}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.userPhoto} />
          ) : (
            <div className={styles.userPhotoPlaceholder}>{initials}</div>
          )}
        </div>

        <div className={`${styles.textOverlay} ${styles[`text_${template.textAlign}`]}`} style={{ color: template.textColor }}>
          <p className={styles.userName}>{user?.name || 'Your Name'}</p>
          <p className={styles.message}>{template.message}</p>
        </div>

        {isLocked && (
          <div className={styles.lockOverlay}>
            <div className={styles.lockIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className={styles.lockLabel}>Premium</span>
            <span className={styles.lockSub}>Tap to unlock</span>
          </div>
        )}

        {!isLocked && isHovered && (
          <div className={styles.useOverlay}>
            <button className={`${styles.useBtn} btn btn-primary`}>
              ✨ Use Template
            </button>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div>
          <p className={styles.name}>{template.name}</p>
          <p className={styles.category}>{template.category}</p>
        </div>
        <span className={`badge ${template.isPremium ? 'badge-premium' : 'badge-free'}`}>
          {template.isPremium ? '👑 Premium' : '✓ Free'}
        </span>
      </div>
    </article>
  );
}
