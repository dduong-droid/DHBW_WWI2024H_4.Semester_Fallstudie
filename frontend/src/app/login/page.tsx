'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/profile');
  };

  return (
    <div className={styles.container}>
      {/* Visual Sidebar */}
      <div className={styles.leftSidebar}>
        <div className={styles.decorBlob} />
        <div className={styles.sidebarContent}>
          <h1 className={styles.sidebarTitle}>Nahrungswerkzeug <br/>für Ihre <span className={styles.sidebarHero}>Genesung.</span></h1>
          <p className={styles.sidebarDesc}>Personalisierte Ernährungspläne und medizinische Meal-Kits exakt abgestimmt auf Ihre ärztliche Diagnose.</p>
        </div>
      </div>

      {/* Login Area */}
      <div className={styles.rightContent}>
        <div className={styles.formBox}>
          <div className={styles.header}>
            <h2 className={styles.title}>Willkommen zurück</h2>
            <p className={styles.subtitle}>Bitte loggen Sie sich ein, um fortzufahren.</p>
          </div>
          
          <div className={styles.socialLogin}>
            <button type="button" onClick={() => router.push('/profile')} className={`${styles.socialBtn} ${styles.googleBtn}`}>
              <svg height="20" width="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.56 0 2.96.54 4.07 1.6l3.04-3.04C17.18 1.93 14.86 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span>Mit Google anmelden</span>
            </button>
            <button type="button" onClick={() => router.push('/profile')} className={`${styles.socialBtn} ${styles.appleBtn}`}>
              <svg height="20" width="20" className="fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.96 0-2.04-.6-3.23-.6-1.2 0-2.09.55-3.14.55-1.56 0-4.01-2.48-4.01-6.2 0-3.66 2.31-5.61 4.54-5.61 1.16 0 2.1.72 3.07.72.93 0 2.05-.72 3.21-.72 1.02 0 2.37.52 3.19 1.7-2.65 1.58-2.22 5.31.42 6.57-.63 1.6-1.5 3.19-3.05 3.19zM15 4.72c0-1.24 1.02-2.26 2.26-2.26.14 0 .27.02.4.04-.06 1.41-1.12 2.53-2.31 2.53-.13 0-.25-.02-.35-.04v-.27z"></path>
              </svg>
              <span>Mit Apple anmelden</span>
            </button>
          </div>
          
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>Demo-Zugang</span>
          </div>
          
          <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
            <p className={styles.footerText} style={{ marginTop: '0', marginBottom: '1.5rem', textAlign: 'left' }}>
              Da wir uns in der MVP-Phase befinden, benötigst du noch keinen echten Account. Du kannst dir die gesamte Plattform direkt als Demo ansehen.
            </p>
            <button 
              type="button" 
              onClick={() => router.push('/profile')} 
              className={styles.submitBtn}
              style={{ padding: '1.25rem', fontSize: '1.1rem' }}
            >
              Ohne Anmeldung fortfahren
              <ArrowRight size={20} strokeWidth={2.5} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          
          <p className={styles.footerText}>
            Noch kein Mitglied? <a href="#" className={styles.forgotPassword}>Kostenlos registrieren</a>
          </p>
        </div>
      </div>
    </div>
  );
}
