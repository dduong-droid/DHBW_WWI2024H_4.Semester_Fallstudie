import Link from 'next/link';
import { ArrowRight, FileText, HeartPulse, Leaf, LineChart, ShieldCheck } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.phoneShell} aria-labelledby="home-title">
        <div className={styles.logoMark} aria-hidden="true">
          <Leaf size={30} strokeWidth={3} />
        </div>

        <div className={styles.hero}>
          <p className={styles.eyebrow}>Recovery-Ernährung als Orientierung</p>
          <h1 id="home-title" className={styles.title}>Food4Recovery</h1>
          <p className={styles.description}>
            Food4Recovery verbindet Patientendaten, Dokumenten-Upload, Empfehlungen, Rezepte und Tracking zu einem klaren Demo-Flow fuer die Nachsorge.
          </p>
        </div>

        <div className={styles.flowCards} aria-label="Demo-Flow">
          <div className={styles.flowCard}>
            <FileText size={18} />
            <span>Unterlagen hochladen</span>
          </div>
          <div className={styles.flowCard}>
            <HeartPulse size={18} />
            <span>Orientierung erhalten</span>
          </div>
          <div className={styles.flowCard}>
            <LineChart size={18} />
            <span>Fortschritt verfolgen</span>
          </div>
        </div>

        <div className={styles.ctaGroup}>
          <Link href="/onboarding" className={styles.primaryBtn}>
            Genesung starten
            <ArrowRight size={18} />
          </Link>
          <Link href="/dashboard" className={styles.secondaryBtn}>
            Demo-Dashboard ansehen
          </Link>
        </div>

        <p className={styles.disclaimer}>
          <ShieldCheck size={15} />
          Food4Recovery ersetzt keine aerztliche Diagnose oder Behandlung. Empfehlungen dienen der Orientierung und sollten bei medizinischen Fragen mit Fachpersonal abgestimmt werden.
        </p>
      </section>
    </main>
  );
}
