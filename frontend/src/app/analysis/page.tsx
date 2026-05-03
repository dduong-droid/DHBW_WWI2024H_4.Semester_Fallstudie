"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ClipboardList, Sparkles } from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import type { RecoveryAnalysis, MealKit } from '../../services/mockApi';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';

const LOADING_MESSAGES = [
  "Prüfe Gesundheitsziele...",
  "Abgleich mit Recovery-Phase...",
  "Erstelle initialen Ernährungsplan...",
  "Ordne passende Meal-Kits zu..."
];

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<RecoveryAnalysis | null>(null);
  const [recommendedKit, setRecommendedKit] = useState<MealKit | null>(null);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    // Fetch analysis and then the recommended kit
    recoveryApi.fetchRecoveryAnalysis().then(async (data) => {
      setAnalysis(data);
      if (data.recommendedKitId) {
        const kit = await recoveryApi.fetchMealKit(data.recommendedKitId);
        setRecommendedKit(kit);
      }
    });

    // Rotate text
    const interval = setInterval(() => {
      setLoadingTextIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleAddKit = async () => {
    if (!recommendedKit) return;
    addToCart({
      id: recommendedKit.id,
      name: recommendedKit.name,
      price: recommendedKit.price,
      quantity: 1,
      imageUrl: recommendedKit.imageUrl
    });
    router.push('/checkout');
  };

  if (!analysis || !recommendedKit) {
    return (
      <main className={styles.loadingContainer}>
        <section className={styles.loadingCard} aria-live="polite">
          <div className={styles.scanIcon}>
            <ClipboardList size={34} />
          </div>
          <h1>Auswertung läuft</h1>
          <p style={{ minHeight: '1.5rem', transition: 'opacity 0.3s' }}>
            {LOADING_MESSAGES[loadingTextIdx]}
          </p>
          <div className={styles.loadingBar}>
            <span />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.funnelContainer}>
      <header className={styles.funnelHeader}>
        <span className={styles.badge}>
          <Sparkles size={15} />
          Analyse abgeschlossen
        </span>
        <h1>Dein perfektes Meal-Kit</h1>
        <p>Basierend auf deinen Daten haben wir genau das Richtige für deine Recovery gefunden.</p>
      </header>

      <div className={styles.funnelCard}>
        <div className={styles.funnelImageWrapper}>
          <Image 
            src={recommendedKit.imageUrl || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800'} 
            alt={recommendedKit.name} 
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.funnelImage} 
            priority
          />
        </div>
        <div className={styles.funnelContent}>
          <h2>{recommendedKit.name}</h2>
          <p className={styles.funnelDescription}>{recommendedKit.description}</p>
          
          <ul className={styles.funnelFeatures}>
            <li><CheckCircle2 size={20} /> Perfekt auf dich abgestimmt</li>
            <li><CheckCircle2 size={20} /> Frische, gesunde Zutaten</li>
            <li><CheckCircle2 size={20} /> Lieferung direkt nach Hause</li>
          </ul>

          <button onClick={handleAddKit} className={styles.checkoutButton}>
            Zur Kasse
          </button>
        </div>
      </div>
    </main>
  );
}
