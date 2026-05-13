'use client';
import { useApp } from '@/context/AppContext';
import styles from './PremiumModal.module.css';

const FEATURES = [
  'Access all 24+ premium templates',
  'HD quality card downloads',
  'Remove Wishify watermark',
  'Exclusive festival & anniversary designs',
  'Priority new template releases',
];

export default function PremiumModal({ template, onClose }) {
  const { upgradeToPremium } = useApp();

  const handleUpgrade = (plan) => {
    upgradeToPremium();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" id="premium-modal">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.crownWrap}>
            <span className={styles.crown}>👑</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close" id="premium-close-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <h2 className={styles.title}>Unlock Premium</h2>
          <p className={styles.subtitle}>
            {template ? `"${template.name}" is a Premium template.` : 'Get full access to all premium content.'}
          </p>
        </div>

        {/* Features */}
        <div className={styles.features}>
          {FEATURES.map((f) => (
            <div key={f} className={styles.featureRow}>
              <span className={styles.check}>✓</span>
              <span className={styles.featureText}>{f}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className={styles.plans}>
          <button className={styles.planCard} onClick={() => handleUpgrade('monthly')} id="plan-monthly">
            <div className={styles.planLabel}>Monthly</div>
            <div className={styles.planPrice}>₹99<span>/mo</span></div>
            <div className={styles.planNote}>Billed monthly</div>
          </button>
          <button className={`${styles.planCard} ${styles.planCardPopular}`} onClick={() => handleUpgrade('annual')} id="plan-annual">
            <div className={styles.popularBadge}>Best Value</div>
            <div className={styles.planLabel}>Annual</div>
            <div className={styles.planPrice}>₹499<span>/yr</span></div>
            <div className={styles.planNote}>Save 58% – ₹42/mo</div>
          </button>
        </div>

        {/* CTA */}
        <div className={styles.footer}>
          <button className={`btn btn-primary btn-lg ${styles.ctaBtn}`} onClick={() => handleUpgrade('annual')} id="premium-upgrade-btn">
            🚀 Unlock Premium Now
          </button>
          <button className={`btn btn-ghost btn-sm`} onClick={onClose} id="premium-maybe-later">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
