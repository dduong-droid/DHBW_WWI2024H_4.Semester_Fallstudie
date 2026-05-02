"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Utensils, ShoppingBag, Bell, Check, LayoutDashboard, User
} from 'lucide-react';
import styles from './Navbar.module.css';
import { recoveryApi } from '@/services/apiClient';
import type { DashboardData } from '@/services/mockApi';
import CartNavIcon from './CartNavIcon';

const Navbar = () => {
  const pathname = usePathname();
  const [data, setData] = useState<DashboardData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    recoveryApi.fetchDashboardData().then(setData).catch(console.error);
  }, []);

  // Don't show navbar on landing page or login (optional, but usually better)
  const noNavPages = ['/', '/login'];
  if (noNavPages.includes(pathname)) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/dashboard" className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <Utensils size={20} strokeWidth={2.5} />
            </div>
            <span className={styles.logoText}>Food 4 Recovery</span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') ? styles.navLinkActive : ''}`}>
              Dashboard
            </Link>
            <Link href="/profile" className={`${styles.navLink} ${isActive('/profile') ? styles.navLinkActive : ''}`}>
              Profil
            </Link>
            <Link href="/recipes" className={`${styles.navLink} ${isActive('/recipes') ? styles.navLinkActive : ''}`}>
              Rezepte
            </Link>
            <Link href="/shop" className={`${styles.navLink} ${isActive('/shop') ? styles.navLinkActive : ''}`}>
              Shop
            </Link>
          </div>

          <div className={styles.userArea}>
            <div style={{ position: 'relative' }}>
              <button 
                className={styles.iconBtn} 
                aria-label="Benachrichtigungen"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
              </button>
              {showNotifications && (
                <div className={styles.notificationsDropdown}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text)' }}>Benachrichtigungen</p>
                  <div style={{ padding: '0.75rem', background: 'rgba(51, 199, 88, 0.1)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text)', borderLeft: '4px solid var(--color-primary)' }}>
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Check size={16} /> Bestellbestätigung
                    </strong>
                    Deine Bestellung wurde erfolgreich erfasst und ist auf dem Weg!
                  </div>
                </div>
              )}
            </div>
            <CartNavIcon />
            <Link href="/onboarding" className={styles.avatar}>
              <div
                className={styles.avatarImg}
                style={{ backgroundImage: `url('${data?.avatarUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}')` }}
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        <Link href="/dashboard" className={`${styles.mobileNavItem} ${isActive('/dashboard') ? styles.mobileNavItemActive : ''}`}>
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </Link>
        <Link href="/profile" className={`${styles.mobileNavItem} ${isActive('/profile') ? styles.mobileNavItemActive : ''}`}>
          <User size={24} />
          <span>Profil</span>
        </Link>
        <Link href="/recipes" className={`${styles.mobileNavItem} ${isActive('/recipes') ? styles.mobileNavItemActive : ''}`}>
          <Utensils size={24} />
          <span>Rezepte</span>
        </Link>
        <Link href="/shop" className={`${styles.mobileNavItem} ${isActive('/shop') ? styles.mobileNavItemActive : ''}`}>
          <ShoppingBag size={24} />
          <span>Shop</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
