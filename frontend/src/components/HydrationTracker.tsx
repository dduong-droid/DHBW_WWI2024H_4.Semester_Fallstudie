'use client';
import React, { useEffect, useState } from 'react';
import { trackingMockApi } from '../services/mockApi';
import { HydrationProgress } from '../types/apiContracts';
import { Droplet, Plus } from 'lucide-react';
import styles from './HydrationTracker.module.css';

export default function HydrationTracker() {
  const [progress, setProgress] = useState<HydrationProgress | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    trackingMockApi.getHydrationProgress().then(data => setProgress(data));
  }, []);

  const handleAddWater = async (amount: number) => {
    setIsAdding(true);
    const updated = await trackingMockApi.addWaterMl(amount);
    setProgress(updated);
    setIsAdding(false);
  };

  if (!progress) return <div className={styles.skeleton}></div>;

  const percent = Math.min(100, Math.round((progress.currentMl / progress.targetMl) * 100));

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Hydration</h2>
        <Droplet color="#3b82f6" size={24} strokeWidth={2.5} />
      </div>
      
      <div className={styles.waterProgress}>
        <div className={styles.progressInfo}>
          <span>Getrunken</span>
          <span className={styles.waterColor}>{(progress.currentMl / 1000).toFixed(1)} L / {(progress.targetMl / 1000).toFixed(1)} L</span>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${percent}%` }}></div>
        </div>
        <p className={styles.subtext}>
          {percent >= 100 ? "Tagesziel erreicht! 🎯" : `Noch ${((progress.targetMl - progress.currentMl) / 250).toFixed(1)} Gläser bis zum Ziel.`}
        </p>
      </div>

      <div className={styles.quickAdd}>
        <button 
          className={styles.addBtn} 
          onClick={() => handleAddWater(250)}
          disabled={percent >= 100 || isAdding}
        >
          <Plus size={16} strokeWidth={3} /> 250ml
        </button>
        <button 
          className={styles.addBtn} 
          onClick={() => handleAddWater(500)}
          disabled={percent >= 100 || isAdding}
        >
          <Plus size={16} strokeWidth={3} /> 500ml
        </button>
      </div>
    </div>
  );
}
