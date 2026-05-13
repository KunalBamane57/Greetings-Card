'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { compressImage } from '@/utils/imageUtils';
import styles from './profile.module.css';

const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🦋', '🐬', '🦄', '🐙'];

export default function ProfilePage() {
  const { user, updateProfile } = useApp();
  const router = useRouter();
  const fileRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return; }
    try {
      const compressed = await compressImage(file, 300);
      setAvatar(compressed);
      setSelectedEmoji('');
      setError('');
    } catch { setError('Failed to process image. Try another.'); }
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setAvatar(null);
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setLoading(true);

    let finalAvatar = avatar;
    if (!finalAvatar && selectedEmoji) {
      const canvas = document.createElement('canvas');
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(100, 100, 10, 100, 100, 100);
      gradient.addColorStop(0, '#8b5cf6'); gradient.addColorStop(1, '#ec4899');
      ctx.fillStyle = gradient; ctx.beginPath();
      ctx.arc(100, 100, 100, 0, Math.PI * 2); ctx.fill();
      ctx.font = '100px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(selectedEmoji, 100, 105);
      finalAvatar = canvas.toDataURL('image/png');
    }

    updateProfile({ name: name.trim(), avatar: finalAvatar });
    setLoading(false);
    router.push('/home');
  };

  const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <main className={styles.main}>
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} /><div className={styles.orb2} />
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Set Up Your Profile</h1>
          <p className={styles.subtitle}>Your name and photo will appear on every greeting card you create.</p>
        </div>

        <div className={styles.avatarSection}>
          <div className={styles.avatarWrap} onClick={() => fileRef.current?.click()} id="profile-avatar-click" title="Click to upload photo">
            {avatar ? (
              <img src={avatar} alt="Profile" className={styles.avatarImg} />
            ) : selectedEmoji ? (
              <div className={styles.avatarEmoji}>{selectedEmoji}</div>
            ) : (
              <div className={styles.avatarPlaceholder}>{initials}</div>
            )}
            <div className={styles.avatarOverlay}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhotoUpload} id="profile-photo-input" />
          <button className={`btn btn-outline btn-sm`} onClick={() => fileRef.current?.click()} id="profile-upload-btn">
            Upload Photo
          </button>
        </div>

        <div className={styles.emojiSection}>
          <p className={styles.emojiLabel}>Or choose an avatar</p>
          <div className={styles.emojiGrid}>
            {AVATARS.map((e) => (
              <button
                key={e} id={`avatar-emoji-${e}`}
                className={`${styles.emojiBtn} ${selectedEmoji === e ? styles.emojiActive : ''}`}
                onClick={() => handleEmojiSelect(e)}
              >{e}</button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-name-input">Your Name</label>
          <input
            id="profile-name-input"
            className="input"
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            maxLength={40}
          />
          <span className={styles.charCount}>{name.length}/40</span>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          id="profile-save-btn"
          className={`btn btn-primary ${styles.saveBtn}`}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <span className={styles.spin} /> : '🎉 Let\'s Go!'}
        </button>

        {user?.profileComplete && (
          <button className={`btn btn-ghost btn-sm ${styles.skipBtn}`} onClick={() => router.push('/home')} id="profile-skip-btn">
            Skip for now
          </button>
        )}
      </div>

      <footer className={styles.footer}>
        made by kunal❤️
      </footer>
    </main>
  );
}

