'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { templates, getTemplatesByCategory } from '@/data/templates';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import TemplateCard from '@/components/TemplateCard';
import PremiumModal from '@/components/PremiumModal';
import styles from './home.module.css';

function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 137.508;
    stars.push({
      id: i,
      w: ((seed * 1.1) % 2) + 1,
      left: ((seed * 3.7) % 100),
      top: ((seed * 5.3) % 100),
      dur: (((seed * 2.1) % 6) + 4).toFixed(1),
      delay: -((seed * 0.7) % 6).toFixed(1),
    });
  }
  return stars;
}
const STARS = generateStars(80);

const TICKER_ITEMS = [
  '🎂 Birthday Cards', '💍 Anniversary Cards', '🎊 Festival Cards',
  '🎓 Congratulations', '💌 Thank You Cards', '❤️ Love Cards',
  '🌟 Premium Templates', '✨ Share Instantly',
];

function HomeContent() {
  const { user, loading, isPremium } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('cat') || 'All');
  const [search, setSearch] = useState('');
  const [premiumTemplate, setPremiumTemplate] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user, router]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!user) return null;

  const filtered = getTemplatesByCategory(category).filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const freeCount = templates.filter((t) => !t.isPremium).length;
  const premiumCount = templates.filter((t) => t.isPremium).length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user.name?.split(' ')[0] || 'there';

  return (
    <>
      <div className={styles.page}>
        {mounted && (
          <div className={styles.starField} aria-hidden="true">
            {STARS.map((s) => (
              <div
                key={s.id}
                className={styles.star}
                style={{
                  width: s.w,
                  height: s.w,
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  animationDuration: `${s.dur}s`,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}
          </div>
        )}

        <Navbar />

        <section className={styles.hero}>
          <div className={styles.heroBg} aria-hidden="true">
            <div className={`${styles.heroOrb} ${styles.heroOrb1}`} />
            <div className={`${styles.heroOrb} ${styles.heroOrb2}`} />
            <div className={`${styles.heroOrb} ${styles.heroOrb3}`} />
          </div>

          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroText}>
              <span className={styles.heroEyebrow}>✨ {greeting()}, {firstName}!</span>

              <h1 className={styles.heroTitle}>
                Create Cards That <span className="gradient-text">Touch Hearts</span>
              </h1>

              <p className={styles.heroSub}>
                Pick a stunning template, overlay your photo & name, and share moments that matter — in seconds.
              </p>

              <div className={styles.heroActions}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => document.getElementById('template-grid-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  🎨 Browse Templates
                </button>
                {!isPremium && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setPremiumTemplate(templates.find(t => t.isPremium))}
                  >
                    👑 Go Premium
                  </button>
                )}
              </div>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>{freeCount}</span>
                  <span className={styles.statLabel}>Free</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={`${styles.statNum} gradient-text-gold`}>{premiumCount}</span>
                  <span className={styles.statLabel}>Premium</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.stat}>
                  <span className={styles.statNum}>6</span>
                  <span className={styles.statLabel}>Categories</span>
                </div>
              </div>
            </div>

            <div className={styles.heroCards} aria-hidden="true">
              {templates.slice(0, 3).map((t, i) => (
                <div
                  key={t.id}
                  className={styles.heroCardPreview}
                  style={{
                    background: t.gradient,
                    transform: `rotate(${(i - 1) * 7}deg) translateY(${i === 1 ? '-10px' : '6px'})`,
                    zIndex: i === 1 ? 3 : i === 0 ? 2 : 1,
                  }}
                  onClick={() => router.push(`/editor/${t.id}`)}
                >
                  <span className={styles.heroCardEmoji}>{t.emoji}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.greetBanner} aria-hidden="true">
          <div className={styles.greetScroll}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className={styles.greetItem}>
                {item} &nbsp;&nbsp;·
              </span>
            ))}
          </div>
        </div>

        <div className={`container ${styles.content}`} id="template-grid-section">

          {!isPremium && (
            <div className={styles.premiumBanner}>
              <div className={styles.premiumBannerIcon}>👑</div>
              <div className={styles.premiumBannerText}>
                <p className={styles.premiumBannerTitle}>Unlock All Premium Templates</p>
                <p className={styles.premiumBannerSub}>Remove the watermark, unlock exclusive designs, advanced colors, fonts & decorations. Starting at ₹99/mo.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setPremiumTemplate(templates.find(t => t.isPremium))}
              >
                Upgrade Now
              </button>
            </div>
          )}

          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="home-search"
                className={styles.searchInput}
                type="text"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.clearSearch} onClick={() => setSearch('')} aria-label="Clear search">✕</button>
              )}
            </div>
          </div>

          <CategoryFilter active={category} onChange={(c) => { setCategory(c); setSearch(''); }} />

          <div className={styles.resultsBar}>
            <p className={styles.resultCount}>
              {filtered.length} template{filtered.length !== 1 ? 's' : ''} {category !== 'All' ? `in ${category}` : ''}
            </p>
            {search && <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>Clear search</button>}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyEmoji}>🔍</span>
              <p className={styles.emptyTitle}>No templates found</p>
              <p className={styles.emptySub}>Try a different search or category</p>
              <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory('All'); }}>Browse All</button>
            </div>
          ) : (
            <div className={`${styles.gridWrap} template-grid`}>
              {filtered.map((t, i) => (
                <TemplateCard key={t.id} template={t} onPremiumClick={setPremiumTemplate} index={i} />
              ))}
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          made by kunal❤️
        </footer>
      </div>


      {premiumTemplate && (
        <PremiumModal template={premiumTemplate} onClose={() => setPremiumTemplate(null)} />
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="page-loader"><div className="spinner" /></div>}>
      <HomeContent />
    </Suspense>
  );
}
