'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './page.module.css';

export default function LoginPage() {
  const { isLoggedIn, user, login, loginAsGuest } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState('home'); // home | email | signup
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(user?.profileComplete ? '/home' : '/profile');
    }
  }, [isLoggedIn, user, router]);

  const handleGoogle = async () => {
    setLoading('google');
    await new Promise((r) => setTimeout(r, 1000));
    const u = login({ name: 'Google User', email: 'googleuser@gmail.com', avatar: null, provider: 'google' });
    router.push(u.profileComplete ? '/home' : '/profile');
    setLoading('');
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading('email');
    await new Promise((r) => setTimeout(r, 800));
    const u = login({ name: form.name || form.email.split('@')[0], email: form.email, avatar: null, provider: 'email' });
    router.push(u.profileComplete ? '/home' : '/profile');
    setLoading('');
  };

  const handleGuest = async () => {
    setLoading('guest');
    await new Promise((r) => setTimeout(r, 500));
    loginAsGuest();
    router.push('/profile');
    setLoading('');
  };

  return (
    <main className={styles.main}>
      {/* Animated Background */}
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>✨</div>
          <h1 className={styles.brandName}>Wishify</h1>
          <p className={styles.brandTagline}>Create beautiful personalized greeting cards</p>
        </div>

        {mode === 'home' && (
          <div className={styles.authOptions}>
            {/* Google */}
            <button
              id="login-google-btn"
              className={styles.socialBtn}
              onClick={handleGoogle}
              disabled={!!loading}
            >
              {loading === 'google' ? <span className={styles.spin} /> : (
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.4 0 6.3 1.2 8.6 3.1l6.4-6.4C34.9 2.7 29.8.5 24 .5 14.8.5 6.9 6 3.2 13.9l7.5 5.8C12.5 13.4 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.5 5.8C43.8 37.4 46.5 31.4 46.5 24.5z"/><path fill="#FBBC05" d="M10.7 28.3A14.5 14.5 0 0 1 9.5 24c0-1.5.3-3 .7-4.3L2.7 13.9A23.5 23.5 0 0 0 .5 24c0 3.8.9 7.3 2.2 10.5l8-6.2z"/><path fill="#34A853" d="M24 47.5c5.8 0 10.7-1.9 14.3-5.2l-7.5-5.8c-2 1.3-4.4 2-6.8 2-6.2 0-11.5-4-13.3-9.4l-8 6.1C6.9 42 14.8 47.5 24 47.5z"/></svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="divider">or</div>

            {/* Email */}
            <button
              id="login-email-btn"
              className={`btn btn-outline ${styles.fullBtn}`}
              onClick={() => setMode('email')}
              disabled={!!loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/></svg>
              Continue with Email
            </button>

            {/* Guest */}
            <button
              id="login-guest-btn"
              className={`btn btn-ghost ${styles.fullBtn}`}
              onClick={handleGuest}
              disabled={!!loading}
            >
              {loading === 'guest' ? <span className={styles.spin} /> : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              )}
              Continue as Guest
            </button>
          </div>
        )}

        {(mode === 'email' || mode === 'signup') && (
          <form className={styles.emailForm} onSubmit={handleEmail} noValidate>
            <button type="button" className={styles.backBtn} onClick={() => { setMode('home'); setError(''); }}>
              ← Back
            </button>
            <h2 className={styles.formTitle}>{mode === 'signup' ? 'Create Account' : 'Sign In'}</h2>

            {mode === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input id="input-name" className="input" type="text" placeholder="John Doe"
                  value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input id="input-email" className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input id="input-password" className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button id="email-submit-btn" type="submit" className={`btn btn-primary ${styles.fullBtn}`} disabled={loading === 'email'}>
              {loading === 'email' ? <span className={styles.spin} /> : mode === 'signup' ? 'Create Account' : 'Sign In'}
            </button>
            <button type="button" className={`btn btn-ghost btn-sm ${styles.fullBtn}`}
              onClick={() => setMode(mode === 'email' ? 'signup' : 'email')}>
              {mode === 'email' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </form>
        )}

        <p className={styles.terms}>
          By continuing, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span>
        </p>
      </div>
    </main>
  );
}
