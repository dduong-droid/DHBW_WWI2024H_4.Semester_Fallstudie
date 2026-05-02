"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Utensils, HeartPulse } from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import type { CuratedMeal } from '../../services/mockApi';
import CuratedMealCard from '../../components/CuratedMealCard';
import CuratedMealModal from '../../components/CuratedMealModal';
import CartNavIcon from '../../components/CartNavIcon';

export default function CuratedRecipesPage() {
  const [meals, setMeals] = useState<CuratedMeal[] | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<CuratedMeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    recoveryApi.fetchCuratedMeals().then(data => setMeals(data));
  }, []);

  const handleOpenMeal = (meal: CuratedMeal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          <header className={styles.pageHeader}>
            <div className={styles.badge}>
              <HeartPulse size={16} strokeWidth={3} />
              Demo-Kuration
            </div>
            <h1 className={styles.title}>Rezeptideen für deine Recovery-Routine.</h1>
            <p className={styles.subtitle}>
              Basierend auf dem Demo-Profil zeigen wir alltagstaugliche Gerichte, die Orientierung für Protein, Energie und Verträglichkeit geben. Sie ersetzen keine individuelle Beratung.
            </p>
          </header>

          {!meals ? (
            <div className={styles.skeletonGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonBadge} />
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonText} />
                    <div className={styles.skeletonTextShort} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.mealList}>
              {meals.map(meal => (
                <CuratedMealCard key={meal.id} meal={meal} onClick={handleOpenMeal} />
              ))}
            </div>
          )}
        </main>
      </div>

      <CuratedMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meal={selectedMeal}
      />
    </>
  );
}
