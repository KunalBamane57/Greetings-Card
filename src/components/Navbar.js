'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useApp();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <button className={styles.logo} onClick={() => router.push('/home')} id="nav-logo">
          <span className={styles.logoIcon}>✨</span>
          <span className={styles.logoText}>Wishify</span>
        </button>

        {/* Nav links (desktop) */}
        <div className={styles.links}>
          <button className={styles.link} onClick={() => router.push('/home')} id="nav-home">Home</button>
          <button className={styles.link} onClick={() => router.push('/home?cat=Birthday')} id="nav-birthday">Birthday</button>
          <button className={styles.link} onClick={() => router.push('/home?cat=Festivals')} id="nav-festivals">Festivals</button>
          <button className={styles.link} onClick={() => router.push('/home?cat=Anniversary')} id="nav-anniversary">Anniversary</button>
        </div>

        {/* User menu */}
        <div className={styles.userArea} ref={menuRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setMenuOpen((o) => !o)}
            id="nav-avatar-btn"
            aria-label="Open user menu"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>{initials}</div>
            )}
            <span className={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownName}>{user?.name}</p>
                <p className={styles.dropdownEmail}>{user?.email}</p>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={() => { router.push('/profile'); setMenuOpen(false); }} id="nav-edit-profile">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Edit Profile
              </button>
              <button className={styles.dropdownItem} onClick={() => { router.push('/home'); setMenuOpen(false); }} id="nav-templates">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Templates
              </button>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={handleLogout} id="nav-logout" style={{ color: '#ef4444' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
