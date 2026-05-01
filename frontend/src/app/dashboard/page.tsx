"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Utensils, Droplets, Flame, Clock, ChevronRight,
  Activity, ShoppingBag, Bell, Check, HeartPulse, Sparkles, ShieldAlert
} from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import type { DashboardData, PatientProfile } from '../../services/mockApi';
import CartNavIcon from '../../components/CartNavIcon';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [checkedMeals, setCheckedMeals] = useState<Set<string>>(new Set());
  const [trackingNote, setTrackingNote] = useState('');
  const [selectedDay, setSelectedDay] = useState('Mi'); // Heute (Demo)
  const [symptom, setSymptom] = useState<number | null>(null);

  const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const FULL_DAYS = {
    'Mo': 'Montag', 'Di': 'Dienstag', 'Mi': 'Mittwoch', 
    'Do': 'Donnerstag', 'Fr': 'Freitag', 'Sa': 'Samstag', 'So': 'Sonntag'
  };

  useEffect(() => {
    Promise.all([
      recoveryApi.fetchDashboardData(),
      recoveryApi.fetchPatientProfile()
    ]).then(([d, p]) => {
      setData(d);
      setProfile(p);
      const checked = new Set(d.dailyMeals.filter(m => m.checked).map(m => m.id));
      setCheckedMeals(checked);
    });
  }, []);

  const toggleMealChecked = async (mealId: string) => {
    const wasChecked = checkedMeals.has(mealId);
    setCheckedMeals(prev => {
      const next = new Set(prev);
      if (wasChecked) {
        next.delete(mealId);
      } else {
        next.add(mealId);
      }
      return next;
    });
    if (!wasChecked) {
      const result = await recoveryApi.markMealBoxEaten();
      setTrackingNote(result.backendUsed ? 'Meal-Tracking im Backend gespeichert.' : 'Meal-Tracking lokal als Demo-Fallback gespeichert.');
    }
  };

  const addWater = async (amountMl: number) => {
    if (!data) return;
    const previousCurrent = data.hydration.current;
    setData({
      ...data,
      hydration: {
        ...data.hydration,
        current: Math.min(data.hydration.target, Number((data.hydration.current + amountMl / 1000).toFixed(1))),
      },
    });
    const result = await recoveryApi.addHydrationWater(amountMl);
    setData(current => current ? {
      ...current,
      hydration: {
        current: result.backendUsed ? result.currentLiters : Math.min(current.hydration.target, Number((previousCurrent + amountMl / 1000).toFixed(1))),
        target: result.backendUsed ? result.targetLiters : current.hydration.target,
      },
    } : current);
    setTrackingNote(result.backendUsed ? 'Hydration im Backend gespeichert.' : 'Hydration lokal als Demo-Fallback gespeichert.');
  };

  // Loading State
  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p style={{ fontWeight: 600 }}>Lade dein Dashboard...</p>
        </div>
      </div>
    );
  }

  const caloriePercent = Math.round((data.calories.current / data.calories.target) * 100);
  const hydrationPercent = Math.round((data.hydration.current / data.hydration.target) * 100);

  return (
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
            <Link href="/dashboard" className={`${styles.navLink} ${styles.navLinkActive}`}>Dashboard</Link>
            <Link href="/profile" className={styles.navLink}>Profil</Link>
            <Link href="/recipes" className={styles.navLink}>Rezepte</Link>
            <Link href="/shop" className={styles.navLink}>Shop</Link>
          </div>
          <div className={styles.userArea}>
            <button className={styles.iconBtn} aria-label="Benachrichtigungen">
              <Bell size={20} />
            </button>
            <CartNavIcon />
            <div className={styles.avatar}>
              <div
                className={styles.avatarImg}
                style={{ backgroundImage: `url('${data.avatarUrl}')` }}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className={styles.greeting}>Willkommen zurück, {data.patientName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className={styles.diagnosisBox}>
                  <HeartPulse size={14} />
                  Heute: Tag {data.dayNumber}
                </span>
                <span className={styles.date}>{data.diagnosis} • {data.phase}</span>
              </div>
            </div>
            <div className={styles.focusBadge}>
              <Sparkles size={16} />
              Fokus: Proteinreich & Magenfreundlich
            </div>
          </div>
        </section>

        {/* Safety & Warning Section (Dynamic) */}
        {profile?.conditions.includes('chemotherapy') ? (
          <section className={styles.safetyAlert}>
            <div className={styles.safetyIcon}>
              <ShieldAlert size={20} />
            </div>
            <div className={styles.safetyContent}>
              <h3>Sicherheitshinweis für Chemo-Begleitung</h3>
              <p>
                Achte aktuell auf besonders keimarme Ernährung. Vermeide rohes Fleisch, unpasteurisierte Milchprodukte 
                und wasche Obst und Gemüse sehr gründlich.
              </p>
            </div>
            <div className={styles.safetyStatus}>
              <span className={styles.statusWarning}>Warning</span>
            </div>
          </section>
        ) : profile?.conditions.includes('post_op') ? (
           <section className={styles.safetyAlert}>
            <div className={styles.safetyIcon}>
              <ShieldAlert size={20} />
            </div>
            <div className={styles.safetyContent}>
              <h3>Sicherheitshinweis für Post-OP Phase</h3>
              <p>
                Deine Verdauung benötigt in dieser Phase besonders milde Kost. 
                Vermeide schwer verdauliche Fette und stark blähende Gemüsesorten.
              </p>
            </div>
            <div className={styles.safetyStatus}>
              <span className={styles.statusWarning}>Warning</span>
            </div>
          </section>
        ) : null}

        {/* Day Picker (Priority 2) */}
        <section className={styles.dayPicker}>
          <div className={styles.dayPickerHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2>Dein Wochenplan</h2>
              <span className={styles.currentMonth}>April 2026</span>
            </div>
            <button className={styles.exportBtn} onClick={() => alert('PDF wird generiert...')}>
              Plan exportieren
            </button>
          </div>
          <div className={styles.daysRow}>
            {DAYS.map(day => (
              <button 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className={`${styles.dayBtn} ${selectedDay === day ? styles.dayBtnActive : ''}`}
              >
                <span className={styles.dayName}>{day}</span>
                <span className={styles.dayDot} />
              </button>
            ))}
          </div>
          <p className={styles.selectedDayLabel}>Mahlzeiten für {FULL_DAYS[selectedDay as keyof typeof FULL_DAYS]}</p>
        </section>

        {/* Stats Cards Row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Kalorien Card */}
          <div className={styles.card} style={{
            background: 'linear-gradient(135deg, #006e27, #33c758)',
            color: 'white',
            border: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', opacity: 0.1 }}>
              <Flame size={120} />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
                <span className={styles.cardTitle}>Kalorien</span>
                <Flame size={24} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800 }}>{data.calories.current.toLocaleString('de-DE')}</span>
                <span style={{ opacity: 0.7, marginBottom: '0.25rem' }}>/ {data.calories.target.toLocaleString('de-DE')} kcal</span>
              </div>
              <div style={{ width: '100%', height: '0.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${caloriePercent}%`, height: '100%', background: 'white', borderRadius: '9999px', transition: 'width 1s ease' }} />
              </div>
            </div>
          </div>

          {/* Wasser Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Flüssigkeit</span>
              <Droplets size={24} className={styles.waterColor} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{data.hydration.current}</span>
              <span style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>/ {data.hydration.target} L</span>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${hydrationPercent}%` }} />
            </div>
            <button
              type="button"
              onClick={() => addWater(250)}
              style={{
                marginTop: '1rem',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                borderRadius: '9999px',
                padding: '0.5rem 0.875rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--text)',
              }}
            >
              +250 ml
            </button>
          </div>

          {/* Makros Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Makronährstoffe</span>
              <Activity size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {/* Donut Chart */}
              <div style={{ position: 'relative', width: '5.5rem', height: '5.5rem', flexShrink: 0 }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="var(--border)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#33c758" strokeWidth="3.5"
                    strokeDasharray={`${data.macros.carbs} ${100 - data.macros.carbs}`} strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ff8e86" strokeWidth="3.5"
                    strokeDasharray={`${data.macros.protein} ${100 - data.macros.protein}`} strokeDashoffset={`${-data.macros.carbs}`} />
                  <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#97d598" strokeWidth="3.5"
                    strokeDasharray={`${data.macros.fat} ${100 - data.macros.fat}`} strokeDashoffset={`${-(data.macros.carbs + data.macros.protein)}`} />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <MacroLegendItem color="#33c758" label="Kohlenhydrate" value={`${data.macros.carbs}%`} />
                <MacroLegendItem color="#ff8e86" label="Protein" value={`${data.macros.protein}%`} />
                <MacroLegendItem color="#97d598" label="Fette" value={`${data.macros.fat}%`} />
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Left: Heutige Mahlzeiten */}
          <div>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle} style={{ fontSize: '1.5rem' }}>Heutige Mahlzeiten</h2>
            </div>

            <div className={styles.mealList}>
              {data.dailyMeals.map(meal => (
                <div key={meal.id} className={styles.mealCard}>
                  <div
                    className={styles.mealImage}
                    style={{ backgroundImage: `url('${meal.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  />
                  <div className={styles.mealInfo}>
                    <div className={styles.mealTime}>{meal.label} • {meal.time} Uhr</div>
                    <div className={styles.mealName}>{meal.name}</div>
                    <div className={styles.mealMeta}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Flame size={12} /> {meal.calories} kcal
                      </span>
                      <span style={{ marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {meal.prepTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMealChecked(meal.id)}
                    aria-label={checkedMeals.has(meal.id) ? 'Mahlzeit als nicht erledigt markieren' : 'Mahlzeit als erledigt markieren'}
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      border: checkedMeals.has(meal.id) ? '2px solid var(--color-primary)' : '2px solid var(--border)',
                      background: checkedMeals.has(meal.id) ? 'var(--color-primary)' : 'transparent',
                      color: checkedMeals.has(meal.id) ? 'white' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Track (Priority 4) */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle} style={{ marginBottom: '1rem' }}>Quick Track</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Appetit heute
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['Low', 'Mid', 'High'].map(level => (
                      <button key={level} className={styles.trackBtn} onClick={() => alert(`${level} Appetit getrackt!`)}>
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Symptom Tracker */}
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Symptome / Schmerzen
                  </label>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'space-between' }}>
                    {[1, 2, 3, 4, 5].map(level => (
                      <button 
                        key={level} 
                        className={styles.trackBtn} 
                        style={{ 
                          padding: '0.5rem 0', 
                          background: symptom === level ? 'var(--color-primary)' : 'var(--surface)',
                          color: symptom === level ? 'white' : 'var(--text)',
                          borderColor: symptom === level ? 'var(--color-primary)' : 'var(--border)'
                        }}
                        onClick={() => { setSymptom(level); alert(`Schmerzlevel ${level} getrackt!`); }}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Gewicht tracken
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="number" placeholder="72.5" className={styles.trackInput} />
                    <button className={styles.trackBtn} style={{ background: 'var(--color-primary)', color: 'white', border: 'none' }}>
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Nährstoff-Tracker */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle} style={{ marginBottom: '1.5rem' }}>Nährstoff-Tracker</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {data.nutrients.map(nutrient => {
                  const pct = Math.round((nutrient.current / nutrient.target) * 100);
                  return (
                    <div key={nutrient.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>{nutrient.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{nutrient.current}{nutrient.unit} / {nutrient.target}{nutrient.unit}</span>
                      </div>
                      <div style={{ width: '100%', height: '0.5rem', background: 'rgba(51,199,88,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: nutrient.color, borderRadius: '9999px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meal Kit Promo */}
            <div className={styles.card} style={{
              background: 'rgba(51, 199, 88, 0.05)',
              borderColor: 'rgba(51, 199, 88, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', right: '-2rem', bottom: '-2rem', opacity: 0.06 }}>
                <ShoppingBag size={160} />
              </div>
              <h2 className={styles.cardTitle} style={{ marginBottom: '0.5rem' }}>Meal-Kits</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Bestelle deine vorportionierten Zutaten für die nächste Woche — abgestimmt auf deinen Ernährungsplan.
              </p>
              <Link href="/shop" className={styles.storeLink}>
                <span>Zum Store</span>
                <ChevronRight size={20} />
              </Link>
            </div>

            {/* Wochenfortschritt */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Wochenfortschritt</span>
                <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{data.weekProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '0.625rem', background: 'rgba(51,199,88,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${data.weekProgress}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '9999px', transition: 'width 1s ease' }} />
              </div>
              {trackingNote && (
                <p style={{ marginTop: '0.875rem', color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                  {trackingNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Sub-Komponente: Makro-Legende ---
function MacroLegendItem({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '50%', background: color, display: 'inline-block' }} />
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
