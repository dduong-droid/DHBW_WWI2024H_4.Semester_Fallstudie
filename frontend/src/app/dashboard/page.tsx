import React from 'react';
import Link from 'next/link';
import { Utensils, Droplets, Flame, Zap, Dumbbell, ArrowRight, Clock, ShoppingCart } from 'lucide-react';
import styles from './page.module.css';
import { nutritionMockApi, shopMockApi } from '../../services/mockApi';
import DailyTracker from '../../components/DailyTracker';
import HydrationTracker from '../../components/HydrationTracker';
import CartNavIcon from '../../components/CartNavIcon';

export default async function DashboardPage() {
  // Simulate fetching data from the mock API for a specific user
  const nutritionPlan = await nutritionMockApi.getNutritionPlan('uid_123');
  const todayPlan = nutritionPlan.weeklyPlan[0];
  const shopData = await shopMockApi.getInventory();

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logoArea}>
            <div className={styles.logoIcon}>
              <Utensils size={20} strokeWidth={2.5} />
            </div>
            <span className={styles.logoText}>Food 4 Recovery</span>
          </div>
          <div className={styles.navLinks}>
            <Link href="/dashboard" className={`${styles.navLink} ${styles.navLinkActive}`}>Dashboard</Link>
            <Link href="/profile" className={styles.navLink}>Profil</Link>
            <Link href="/recipes" className={styles.navLink}>Rezepte</Link>
            <Link href="/shop" className={styles.navLink}>Shop</Link>
          </div>
          <div className={styles.userArea}>
            <CartNavIcon />
            <div className={styles.avatar}>
              <div 
                className={styles.avatarImg} 
                style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY')"}} 
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        
        <div className={styles.hero}>
          <h1 className={styles.greeting}>Guten Morgen, Dr. Weber</h1>
          <p className={styles.date}>Dienstag, 24. Oktober • Tag {todayPlan.day} deiner Genesung</p>
          <div className={styles.diagnosisBox}>
            <span style={{fontSize: '1.2rem'}}>⚕️</span>
            Plan aktiviert für: {nutritionPlan.diagnosis.condition}
          </div>
        </div>

        <div className={styles.grid}>
          
          {/* Left Column: Meals */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Deine Mahlzeiten heute</h2>
            </div>
            
            <div className={styles.mealList}>
              {/* Breakfast */}
              <div className={styles.mealCard}>
                <div className={styles.mealImage}>🥣</div>
                <div className={styles.mealInfo}>
                  <p className={styles.mealTime}>Frühstück</p>
                  <h3 className={styles.mealName}>{todayPlan.meals.breakfast.name}</h3>
                  <p className={styles.mealMeta}>
                    <Clock size={12} style={{display:'inline', marginRight:'4px'}}/>
                    {todayPlan.meals.breakfast.prepTimeMinutes} Min • {todayPlan.meals.breakfast.calories} kcal
                  </p>
                </div>
                <div>
                  <input type="checkbox" style={{width: '20px', height: '20px', accentColor: 'var(--color-primary)'}} />
                </div>
              </div>

              {/* Lunch */}
              <div className={styles.mealCard}>
                <div className={styles.mealImage}>🥗</div>
                <div className={styles.mealInfo}>
                  <p className={styles.mealTime}>Mittagessen</p>
                  <h3 className={styles.mealName}>{todayPlan.meals.lunch.name}</h3>
                  <p className={styles.mealMeta}>
                    <Clock size={12} style={{display:'inline', marginRight:'4px'}}/>
                    {todayPlan.meals.lunch.prepTimeMinutes} Min • {todayPlan.meals.lunch.calories} kcal
                  </p>
                </div>
                <div>
                  <input type="checkbox" style={{width: '20px', height: '20px', accentColor: 'var(--color-primary)'}} />
                </div>
              </div>

              {/* Dinner */}
              <div className={styles.mealCard}>
                <div className={styles.mealImage}>🍲</div>
                <div className={styles.mealInfo}>
                  <p className={styles.mealTime}>Abendessen</p>
                  <h3 className={styles.mealName}>{todayPlan.meals.dinner.name}</h3>
                  <p className={styles.mealMeta}>
                    <Clock size={12} style={{display:'inline', marginRight:'4px'}}/>
                    {todayPlan.meals.dinner.prepTimeMinutes} Min • {todayPlan.meals.dinner.calories} kcal
                  </p>
                </div>
                <div>
                  <input type="checkbox" style={{width: '20px', height: '20px', accentColor: 'var(--color-primary)'}} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tracking & Shop Link */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            
            {/* New Apple Fitness Style Tracker */}
            <DailyTracker />

            {/* Interactive Hydration Tracker */}
            <HydrationTracker />

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Nährstoff-Ziele</h2>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div className={styles.statHeader}>
                    <Flame size={16} color="#f97316" />
                    Kalorien
                  </div>
                  <div className={styles.statValue}>{todayPlan.totalMetrics.calories}</div>
                  <div className={styles.statTarget}>Ziel: 2200 kcal</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statHeader}>
                    <Dumbbell size={16} color="var(--color-primary)" />
                    Protein
                  </div>
                  <div className={styles.statValue}>{todayPlan.totalMetrics.protein}g</div>
                  <div className={styles.statTarget}>Ziel: 120g</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Empfohlene Meal Kits</h2>
              </div>
              <p style={{fontSize: '0.875rem', color: 'var(--text-muted)'}}>
                Exakt abgestimmt auf deinen Therapieplan. Direkt bestellbar im Shop.
              </p>
              
              <div className={styles.kitGrid}>
                {shopData.availableMealKits.map(kit => (
                  <Link href="/shop" key={kit.id} className={styles.kitCard}>
                    <div className={styles.kitHeader}>
                      <div>
                        <h3 className={styles.kitTitle}>{kit.name}</h3>
                      </div>
                      <Utensils size={16} className={styles.kitIcon} />
                    </div>
                    <p className={styles.kitDesc}>{kit.description}</p>
                    <div className={styles.kitFooter}>
                      <div className={styles.kitPrice}>
                        {kit.price} <span>{kit.currency}</span>
                      </div>
                      <ArrowRight size={16} className={styles.kitArrow} />
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link href="/shop" className={styles.storeLink}>
                <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <ShoppingCart size={18} />
                  Zum Recovery Shop
                </span>
                <ArrowRight size={18} />
              </Link>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
