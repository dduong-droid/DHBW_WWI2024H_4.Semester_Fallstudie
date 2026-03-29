'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ClipboardList, 
  Bell, 
  User, 
  ShieldCheck, 
  UploadCloud, 
  Plus, 
  FileText, 
  FileCheck, 
  Lock, 
  HeartPulse, 
  Hourglass 
} from 'lucide-react';
import styles from './page.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type === "application/pdf") {
      setIsUploading(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000); // Simulate upload and analysis
    } else {
      alert("Bitte lade eine gültige PDF-Datei hoch.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <ClipboardList size={20} strokeWidth={2.5} />
            </div>
            <h2 className={styles.logoText}>NutriMed <span className={styles.logoHighlight}>AI</span></h2>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn}>
              <Bell size={20} />
            </button>
            <div className={styles.divider} />
            <button className={styles.userBtn}>
              <div className={styles.userAvatar}>
                <User size={16} strokeWidth={3} />
              </div>
              <span className={styles.userName}>Dr. Weber</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          
          <div className={styles.hero}>
            <div className={styles.badge}>
              <ShieldCheck size={16} strokeWidth={2.5} />
              Sicher & Verschlüsselt
            </div>
            <h1 className={styles.title}>Dokumenten-Analyse</h1>
            <p className={styles.subtitle}>
              Laden Sie Ihren Arztbrief hoch für eine <span className={styles.highlight}>KI-basierte Ernährungsanalyse</span>. Wir extrahieren wichtige Daten für Ihren individuellen Plan.
            </p>
          </div>

          <div 
            className={styles.dropzoneContainer}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className={styles.glow} />
            <div className={styles.dropzone} style={{ borderColor: isDragging ? 'var(--color-primary)' : '' }}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".pdf" 
                style={{ display: 'none' }} 
              />

              {isUploading ? (
                <div className={styles.dropzoneInner}>
                  <div className={styles.uploadIconWrapper} style={{ transition: 'opacity 0.3s', opacity: 0.7 }}>
                    <Hourglass size={48} strokeWidth={1.5} className="animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  <div>
                    <h3 className={styles.dropTitle}>KI-Analyse läuft...</h3>
                    <p className={styles.dropDesc}>Dein Arztbrief wird hochgeladen, analysiert und dein Plan generiert.</p>
                  </div>
                </div>
              ) : (
                <div className={styles.dropzoneInner}>
                  <div className={styles.uploadIconWrapper}>
                    <UploadCloud size={48} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className={styles.dropTitle}>PDF Arztbrief hierher ziehen</h3>
                    <p className={styles.dropDesc}>Oder klicken, um eine Datei von deinem Gerät auszuwählen.</p>
                  </div>
                  <button className={styles.uploadBtn} onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    <Plus size={20} strokeWidth={2.5} />
                    Datei auswählen
                  </button>
                  <div className={styles.uploadMeta}>
                    <div className={styles.metaItem}>
                      <FileText size={16} />
                      MAX. 10MB
                    </div>
                    <div className={styles.metaItem}>
                      <FileCheck size={16} />
                      PDF FORMAT
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.securitySection}>
            <div className={styles.securityItem}>
              <div className={styles.securityIconWrapper}>
                <ShieldCheck size={28} />
              </div>
              <h4 className={styles.securityTitle}>DSGVO Konform</h4>
              <p className={styles.securityDesc}>Ihre Daten werden nach höchsten EU-Sicherheitsstandards verarbeitet.</p>
            </div>
            <div className={styles.securityItem}>
              <div className={styles.securityIconWrapper}>
                <Lock size={28} />
              </div>
              <h4 className={styles.securityTitle}>Ende-zu-Ende</h4>
              <p className={styles.securityDesc}>Alle Dokumente werden bereits im Browser verschlüsselt übertragen.</p>
            </div>
            <div className={styles.securityItem}>
              <div className={styles.securityIconWrapper}>
                <HeartPulse size={28} />
              </div>
              <h4 className={styles.securityTitle}>Medizinisch Geprüft</h4>
              <p className={styles.securityDesc}>Die Analyse dient als Unterstützung und wird kontinuierlich validiert.</p>
            </div>
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLinks}>
            <a>Datenschutz</a>
            <a>Impressum</a>
            <a>Nutzungsbedingungen</a>
          </div>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            System Status: Sicher
          </div>
        </div>
      </footer>

      <div className={styles.decorations}>
        <div className={styles.decorTopRight} />
        <div className={styles.decorBotLeft} />
      </div>
    </div>
  );
}
