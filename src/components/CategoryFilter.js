'use client';
import { CATEGORIES } from '@/data/templates';
import styles from './CategoryFilter.module.css';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Template categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`cat-${cat.toLowerCase().replace(' ', '-')}`}
          role="tab"
          aria-selected={active === cat}
          className={`${styles.chip} ${active === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
