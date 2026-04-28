"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Utensils, HeartPulse } from 'lucide-react';
import styles from './page.module.css';
import { nutritionMockApi, type CuratedMeal } from '../../services/mockApi';
import CuratedMealCard from '../../components/CuratedMealCard';
import CuratedMealModal from '../../components/CuratedMealModal';
import CartNavIcon from '../../components/CartNavIcon';

export default function CuratedRecipesPage() {
  const [meals, setMeals] = useState<CuratedMeal[] | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<CuratedMeal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    nutritionMockApi.fetchCuratedMeals().then(data => setMeals(data));
  }, []);

  const handleOpenMeal = (meal: CuratedMeal) => {
    setSelectedMeal(meal);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.container}>
        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <div className={styles.logoArea}>
              <div className={styles.logoIcon}>
                <Utensils size={20} strokeWidth={2.5} />
              </div>
              <span className={styles.logoText}>Food 4 Recovery</span>
            </div>
            <div className={styles.navLinks}>
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <Link href="/profile" className={styles.navLink}>Profil</Link>
              <Link href="/recipes" className={`${styles.navLink} ${styles.navLinkActive}`}>Rezepte</Link>
              <Link href="/shop" className={styles.navLink}>Shop</Link>
            </div>
            <div className={styles.userArea}>
              <CartNavIcon />
              <div className={styles.avatar}>
                <div
                  className={styles.avatarImg}
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY')" }}
                />
              </div>
            </div>
          </div>
        </nav>

        <main className={styles.main}>
          <header className={styles.pageHeader}>
            <div className={styles.badge}>
              <HeartPulse size={16} strokeWidth={3} />
              Demo-Kuration
            </div>
            <h1 className={styles.title}>Rezeptideen fuer deine Recovery-Routine.</h1>
            <p className={styles.subtitle}>
              Basierend auf dem Demo-Profil zeigen wir alltagstaugliche Gerichte, die Orientierung fuer Protein, Energie und Vertraeglichkeit geben. Sie ersetzen keine individuelle Beratung.
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
