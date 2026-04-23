"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Utensils, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

// Google SVG Logo (inline, kein externer CDN)
const GoogleIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Apple SVG Logo
const AppleIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.96 0-2.04-.6-3.23-.6-1.2 0-2.09.55-3.14.55-1.56 0-4.01-2.48-4.01-6.2 0-3.66 2.31-5.61 4.54-5.61 1.16 0 2.1.72 3.07.72.93 0 2.05-.72 3.21-.72 1.02 0 2.37.52 3.19 1.7-2.65 1.58-2.22 5.31.42 6.57-.63 1.6-1.5 3.19-3.05 3.19zM15 4.72c0-1.24 1.02-2.26 2.26-2.26.14 0 .27.02.4.04-.06 1.41-1.12 2.53-2.31 2.53-.13 0-.25-.02-.35-.04v-.27z" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = email.trim().length > 0 && password.length >= 6 && isEmailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setLoading(true);

    // Mock: Simuliere POST /api/auth/login
    console.log('[MockAPI] Login-Versuch:', { email, rememberMe });
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock: Immer erfolgreich mit beliebigen Daten
    // In Zukunft: Entwickler 2 liefert echten Auth-Endpoint
    if (email === 'fehler@test.de') {
      setError('E-Mail oder Passwort ist falsch. Bitte versuche es erneut.');
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`[MockAPI] Social Login: ${provider}`);
    // Mock: Direkt zum Dashboard weiterleiten
    router.push('/onboarding');
  };

  return (
    <div className={styles.container}>
      {/* === Left Side: Visual Hero === */}
      <div className={styles.heroSide}>
        <div className={styles.heroBg}>
          <img
            className={styles.heroBgImage}
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80"
            alt="Frische gesunde Mahlzeit mit buntem Gemüse"
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroIconBox}>
            <Utensils size={28} />
          </div>
          <h2 className={styles.heroTitle}>
            Bringe Balance in dein Leben.
          </h2>
          <p className={styles.heroDesc}>
            Entdecke personalisierte Ernährungspläne, die deine Erholung unterstützen
            und deinen Körper stärken.
          </p>
        </div>
      </div>

      {/* === Right Side: Login Form === */}
      <div className={styles.formSide}>
        <div className={styles.formContainer}>
          {/* Mobile Hero Image */}
          <div className={styles.mobileHero}>
            <img
              className={styles.mobileHeroImg}
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
              alt="Frische gesunde Mahlzeit"
            />
          </div>

          {/* Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>
              Willkommen bei Food4Recovery
            </h1>
            <p className={styles.formSubtitle}>
              Melde dich an, um fortzufahren.
            </p>
          </div>

          {/* Social Login */}
          <div className={styles.socialButtons}>
            <button
              className={`${styles.socialBtn} ${styles.socialBtnGoogle}`}
              onClick={() => handleSocialLogin('Google')}
              type="button"
            >
              <GoogleIcon />
              <span>Mit Google anmelden</span>
            </button>
            <button
              className={`${styles.socialBtn} ${styles.socialBtnApple}`}
              onClick={() => handleSocialLogin('Apple')}
              type="button"
            >
              <AppleIcon />
              <span>Mit Apple anmelden</span>
            </button>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <hr className={styles.dividerLine} />
            <span className={styles.dividerText}>oder mit E-Mail</span>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorMsg}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Email Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="login-email" className={styles.label}>
                E-Mail-Adresse
              </label>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}><Mail size={20} /></div>
                <input
                  id="login-email"
                  type="email"
                  className={styles.input}
                  placeholder="name@beispiel.de"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="login-password" className={styles.label}>
                  Passwort
                </label>
                <a className={styles.forgotLink} tabIndex={0}>
                  Passwort vergessen?
                </a>
              </div>
              <div className={styles.inputWrapper}>
                <div className={styles.inputIcon}><Lock size={20} /></div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`${styles.input} ${styles.inputWithBtn}`}
                  placeholder="Dein Passwort"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePasswordBtn}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className={styles.checkboxRow}>
              <input
                id="remember-me"
                type="checkbox"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className={styles.checkboxLabel}>
                Angemeldet bleiben
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={!canSubmit || loading}
              style={{
                opacity: (!canSubmit || loading) ? 0.6 : 1,
                cursor: (!canSubmit || loading) ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Register */}
          <p className={styles.registerText}>
            Noch kein Mitglied?
            <Link href="/onboarding" className={styles.registerLink}>
              Kostenlos registrieren
            </Link>
          </p>

          {/* Footer Links */}
          <div className={styles.footerLinks}>
            <a>Datenschutz</a>
            <a>Impressum</a>
            <a>Hilfe</a>
          </div>
        </div>
      </div>
    </div>
  );
}
