'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState('free');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('greetings_user');
      const savedSub = localStorage.getItem('greetings_subscription');
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedSub) setSubscription(savedSub);
    } catch (e) {}
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    const newUser = { ...userData, id: Date.now().toString(), profileComplete: false, createdAt: new Date().toISOString() };
    setUser(newUser);
    localStorage.setItem('greetings_user', JSON.stringify(newUser));
    return newUser;
  }, []);

  const loginAsGuest = useCallback(() => {
    const guest = { id: 'guest_' + Date.now(), name: 'Guest User', email: 'guest@wishify.app', avatar: null, isGuest: true, profileComplete: false };
    setUser(guest);
    localStorage.setItem('greetings_user', JSON.stringify(guest));
    return guest;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSubscription('free');
    localStorage.removeItem('greetings_user');
    localStorage.removeItem('greetings_subscription');
  }, []);

  const updateProfile = useCallback((profileData) => {
    setUser((prev) => {
      const updated = { ...prev, ...profileData, profileComplete: true };
      localStorage.setItem('greetings_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const upgradeToPremium = useCallback(() => {
    setSubscription('premium');
    localStorage.setItem('greetings_subscription', 'premium');
  }, []);

  return (
    <AppContext.Provider value={{ user, loading, subscription, isPremium: subscription === 'premium', isLoggedIn: !!user, login, loginAsGuest, logout, updateProfile, upgradeToPremium }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
