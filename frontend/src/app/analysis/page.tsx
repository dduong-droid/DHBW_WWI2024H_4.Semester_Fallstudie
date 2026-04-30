"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, BarChart3, CheckCircle2, ClipboardList, HeartPulse,
  PackageCheck, ShieldAlert, Sparkles, Utensils
} from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import type { RecoveryAnalysis } from '../../services/mockApi';

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<RecoveryAnalysis | null>(null);

  useEffect(() => {
    recoveryApi.fetchRecoveryAnalysis().then(setAnalysis);
  }, []);

  if (!analysis) {
    return (
      <main className={styles.container}>
        <section className={styles.loadingCard} aria-live="polite">
          <div className={styles.scanIcon}>
            <ClipboardList size={34} />
          </div>
          <h1>Unterlagen werden eingeordnet</h1>
          <p>Demo-Auswertung wird vorbereitet...</p>
          <div className={styles.loadingBar}>
            <span />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandIcon}><Utensils size={17} /></span>
          Food4Recovery
        </Link>
        <Link href="/dashboard" className={styles.navAction}>Dashboard</Link>
      </nav>

      <section className={styles.progressCard}>
        <div>
          <p>Analyse abgeschlossen</p>
          <span>Regelbasierte Demo-Auswertung aus Onboarding und Upload-Status</span>
        </div>
        <strong>{analysis.progressPercent}%</strong>
        <div className={styles.progressTrack}>
          <span style={{ width: `${analysis.progressPercent}%` }} />
        </div>
      </section>

      <header className={styles.header}>
        <span className={styles.badge}>
          <Sparkles size={15} />
          Demo-Ergebnis
        </span>
        <h1>{analysis.title}</h1>
        <p>{analysis.summary}</p>
      </header>

      <section className={styles.recommendationGrid}>
        <article className={styles.kitCard}>
          <div className={styles.kitVisual}>
            <PackageCheck size={88} />
            <span>Orientierende Empfehlung</span>
          </div>
          <div className={styles.kitFooter}>
            <div>
              <p>Empfohlenes Meal-Kit</p>
              <h2>{analysis.recommendedKitName}</h2>
            </div>
            <Link href="/shop" className={styles.smallButton}>Shop</Link>
          </div>
        </article>

        <article className={styles.reasonCard}>
          <h2>Warum diese Orientierung passt</h2>
          <div className={styles.scoreList}>
            {analysis.matchScores.map(score => (
              <div key={score.label} className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span>{score.label}</span>
                  <strong>{score.percent}%</strong>
                </div>
                <div className={styles.scoreTrack}>
                  <span style={{ width: `${score.percent}%` }} />
                </div>
                <p>{score.rationale}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.insightGrid}>
        <article className={styles.infoCard}>
          <HeartPulse size={22} />
          <h3>Orientierung</h3>
          <ul>
            {analysis.orientationNotes.map(note => <li key={note}>{note}</li>)}
          </ul>
        </article>
        <article className={styles.infoCard}>
          <ShieldAlert size={22} />
          <h3>Sicherheit</h3>
          <ul>
            {analysis.riskNotes.map(note => <li key={note}>{note}</li>)}
          </ul>
        </article>
        <article className={styles.infoCard}>
          <BarChart3 size={22} />
          <h3>Naechste Schritte</h3>
          <ul>
            {analysis.nextSteps.map(step => <li key={step}>{step}</li>)}
          </ul>
        </article>
      </section>

      <section className={styles.disclaimer}>
        <CheckCircle2 size={18} />
        <p>
          Food4Recovery ersetzt keine aerztliche Diagnose oder Behandlung. Empfehlungen dienen der Orientierung und sollten bei medizinischen Fragen mit Fachpersonal abgestimmt werden.
        </p>
      </section>

      <div className={styles.actions}>
        <Link href="/dashboard" className={styles.primaryAction}>
          Wochenplan ansehen
          <ArrowRight size={18} />
        </Link>
        <Link href="/recipes" className={styles.secondaryAction}>Rezepte pruefen</Link>
      </div>
    </main>
  );
}
