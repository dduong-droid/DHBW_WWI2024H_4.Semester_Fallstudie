'use client';
import React, { useEffect, useState } from 'react';
import ProgressRings from './ProgressRings';
import { CheckCircle2, HeartPulse, Loader2 } from 'lucide-react';
import { trackingMockApi } from '../services/mockApi';
import { DailyProgress } from '../types/apiContracts';
import styles from './DailyTracker.module.css';

export default function DailyTracker() {
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    trackingMockApi.getDailyProgress().then((data: DailyProgress) => {
      setProgress(data);
    });
  }, []);

  const handleTrack = async () => {
    setIsTracking(true);
    const updated = await trackingMockApi.trackMealBox();
    setProgress(updated);
    setIsTracking(false);
  };

  if (!progress) return <div className={styles.skeleton}></div>;

  return (
    <div className={styles.trackerCard}>
      <div className={styles.trackerHeader}>
        <h2 className={styles.trackerTitle}>Heutige Wundheilungs-Box</h2>
        <p className={styles.trackerDesc}>Nutze den Tracker als One-Click Lösung, sobald du dein Meal-Kit konsumiert hast.</p>
      </div>
      
      <div className={styles.trackerBody}>
        <div className={styles.ringsWrapper}>
          <ProgressRings proteinPercent={progress.proteinPercent} energyPercent={progress.energyPercent} size={150} />
          <div className={styles.ringsLabel}>
            <span style={{color: 'var(--color-primary)', fontWeight: 800}}>PRO</span>
            <span style={{color: '#f97316', fontWeight: 800}}>ENE</span>
          </div>
        </div>

        <button 
          className={`${styles.trackBtn} ${progress.isMealBoxEaten ? styles.trackedBtn : ''}`}
          onClick={handleTrack}
          disabled={progress.isMealBoxEaten || isTracking}
        >
          {isTracking ? (
            <Loader2 size={24} className={styles.loadingSpinner} />
          ) : progress.isMealBoxEaten ? (
            <>
              <CheckCircle2 size={24} />
              Erfolgreich getrackt
            </>
          ) : (
            <>
              <HeartPulse size={24} />
              Mahlzeit eingenommen
            </>
          )}
        </button>
      </div>
    </div>
  );
}
