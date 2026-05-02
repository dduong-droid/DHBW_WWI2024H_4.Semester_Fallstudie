"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Utensils, Droplets, Flame, Clock, ChevronRight,
  Activity, ShoppingBag, HeartPulse, Sparkles, Check, Zap, LineChart, Plus, Trash2, ChevronDown, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import type { DashboardData, PatientProfile, MealKit, DailyMeal } from '../../services/mockApi';

interface PurchasedKit extends MealKit { quantity: number; }
interface PlannedMeal extends DailyMeal { boxName: string; planIdx: number; }

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [checkedMealsByDay, setCheckedMealsByDay] = useState<Record<string, string[]>>({});
  const [hydrationByDay, setHydrationByDay] = useState<Record<string, number>>({});
  const [selectedDay, setSelectedDay] = useState('');
  const [symptom, setSymptom] = useState<number | null>(null);
  const [chartMetric, setChartMetric] = useState<'weight' | 'hydration'>('weight');
  const [inputWeight, setInputWeight] = useState('');
  const [inputHydration, setInputHydration] = useState('');
  const [trackingNote, setTrackingNote] = useState('');
  // Inventory & Planning
  const [purchasedKits, setPurchasedKits] = useState<PurchasedKit[]>([]);
  const [plannedMealsByDay, setPlannedMealsByDay] = useState<Record<string, PlannedMeal[]>>({});
  const [showInventory, setShowInventory] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const FULL_DAYS: Record<string, string> = {
    'Mo': 'Montag', 'Di': 'Dienstag', 'Mi': 'Mittwoch', 
    'Do': 'Donnerstag', 'Fr': 'Freitag', 'Sa': 'Samstag', 'So': 'Sonntag'
  };

  useEffect(() => {
    // Setze initialen Tag dynamisch
    const currentDayIndex = new Date().getDay(); // 0 = So, 1 = Mo...
    const weekdayMap = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    setSelectedDay(weekdayMap[currentDayIndex]);

    Promise.all([
      recoveryApi.fetchDashboardData(),
      recoveryApi.fetchPatientProfile()
    ]).then(([d, p]) => {
      // Initialize full week for chart if empty
      const initialHistory = DAYS.map(day => ({ date: day, weight: 70, hydration: 0 }));
      
      // Restore basic data
      const savedHistory = sessionStorage.getItem('f4r_history');
      if (savedHistory) {
        d.trackingHistory = JSON.parse(savedHistory);
      } else {
        d.trackingHistory = initialHistory;
      }
      
      const savedStreak = sessionStorage.getItem('f4r_streak');
      if (savedStreak) d.streakDays = JSON.parse(savedStreak);

      setData(d);
      setProfile(p);

      // Load purchased kits inventory
      const savedKits = sessionStorage.getItem('f4r_purchased_kits');
      if (savedKits) setPurchasedKits(JSON.parse(savedKits));

      // Restore planned meals per day
      const savedPlanned = sessionStorage.getItem('f4r_planned_meals');
      if (savedPlanned) setPlannedMealsByDay(JSON.parse(savedPlanned));

      // Restore per-day tracking
      const savedCheckedByDay = sessionStorage.getItem('f4r_checked_by_day');
      if (savedCheckedByDay) {
        setCheckedMealsByDay(JSON.parse(savedCheckedByDay));
      } else {
        setCheckedMealsByDay({});
      }

      const savedHydrationByDay = sessionStorage.getItem('f4r_hydration_by_day');
      if (savedHydrationByDay) {
        setHydrationByDay(JSON.parse(savedHydrationByDay));
      } else {
        const dayKey = weekdayMap[new Date().getDay()];
        setHydrationByDay({ [dayKey]: d.hydration.current });
      }
    });
  }, []);

  // Speichere Tracking-Daten bei \u00c4nderung
  useEffect(() => {
    sessionStorage.setItem('f4r_checked_by_day', JSON.stringify(checkedMealsByDay));
  }, [checkedMealsByDay]);

  useEffect(() => {
    sessionStorage.setItem('f4r_hydration_by_day', JSON.stringify(hydrationByDay));
  }, [hydrationByDay]);

  useEffect(() => {
    if (!data) return;
    sessionStorage.setItem('f4r_history', JSON.stringify(data.trackingHistory));
    sessionStorage.setItem('f4r_streak', JSON.stringify(data.streakDays));
  }, [data]);

  const handleHydrationChange = async (amount: number) => {
    const currentVal = hydrationByDay[selectedDay] || 0;
    const newVal = Math.max(0, parseFloat((currentVal + amount).toFixed(2)));

    setHydrationByDay(prev => ({ ...prev, [selectedDay]: newVal }));
    setInputHydration(newVal.toString()); // Sync the input field too

    // History-Update f\u00fcr den aktuell ausgew\u00e4hlten Tag (f\u00fcr den Graphen)
    setData(prev => {
      if (!prev) return prev;
      const newHistory = [...prev.trackingHistory];
      const existingIdx = newHistory.findIndex(h => h.date === selectedDay);
      
      if (existingIdx >= 0) {
        newHistory[existingIdx] = { ...newHistory[existingIdx], hydration: newVal };
      }
      return { ...prev, trackingHistory: newHistory };
    });

    // Backend-Feedback (optional)
    if (amount > 0) {
      const result = await recoveryApi.addHydrationWater(Math.round(amount * 1000));
      setTrackingNote(result.backendUsed ? 'Hydration im Backend gespeichert.' : 'Hydration lokal als Demo-Fallback gespeichert.');
    }
  };

  const toggleMealChecked = async (mealId: string) => {
    let isNowChecked = false;
    setCheckedMealsByDay(prev => {
      const currentDayMeals = prev[selectedDay] || [];
      const isChecked = currentDayMeals.includes(mealId);
      isNowChecked = !isChecked;
      const nextDayMeals = isChecked 
        ? currentDayMeals.filter(id => id !== mealId)
        : [...currentDayMeals, mealId];
      return { ...prev, [selectedDay]: nextDayMeals };
    });

    if (isNowChecked) {
      const result = await recoveryApi.markMealBoxEaten();
      setTrackingNote(result.backendUsed ? 'Meal-Tracking im Backend gespeichert.' : 'Meal-Tracking lokal gespeichert.');
    }
  };

  useEffect(() => {
    sessionStorage.setItem('f4r_planned_meals', JSON.stringify(plannedMealsByDay));
  }, [plannedMealsByDay]);

  const addMealToDay = (meal: DailyMeal, boxName: string) => {
    setPlannedMealsByDay(prev => {
      const current = prev[selectedDay] || [];
      const planIdx = Date.now() + Math.random();
      return { ...prev, [selectedDay]: [...current, { ...meal, boxName, planIdx }] };
    });
    setTrackingNote('Gericht wurde hinzugefügt!');
    setTimeout(() => setTrackingNote(''), 3000);
  };

  const removeMealFromDay = (planIdx: number) => {
    setPlannedMealsByDay(prev => {
      const current = prev[selectedDay] || [];
      return { ...prev, [selectedDay]: current.filter(m => m.planIdx !== planIdx) };
    });
  };

  const handleDragStart = (e: React.DragEvent, meal: any, boxName: string) => {
    e.dataTransfer.setData('meal', JSON.stringify(meal));
    e.dataTransfer.setData('boxName', boxName);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const mealData = e.dataTransfer.getData('meal');
    const boxName = e.dataTransfer.getData('boxName');
    if (mealData && boxName) {
      const meal = JSON.parse(mealData);
      addMealToDay(meal, boxName);
    }
  };

  useEffect(() => {
    // Wenn sich der Tag ändert, das Quick-Track Wasser-Feld synchronisieren
    const currentDayHydration = hydrationByDay[selectedDay] || 0;
    setInputHydration(currentDayHydration > 0 ? currentDayHydration.toString() : '');
  }, [selectedDay, hydrationByDay]);

  const handleTrackData = (type: 'weight' | 'hydration') => {
    if (!data) return;
    const val = type === 'weight' ? parseFloat(inputWeight) : parseFloat(inputHydration);
    if (isNaN(val)) return;

    if (type === 'hydration') {
      setHydrationByDay(prev => ({ ...prev, [selectedDay]: val }));
    }

    setData(prev => {
      if (!prev) return prev;
      const newHistory = [...prev.trackingHistory];
      const existingIdx = newHistory.findIndex(h => h.date === selectedDay);
      if (existingIdx >= 0) {
        newHistory[existingIdx] = { ...newHistory[existingIdx], [type]: val };
      } else {
        newHistory.push({
          date: selectedDay,
          weight: type === 'weight' ? val : 70,
          hydration: type === 'hydration' ? val : 0,
        });
      }
      return { ...prev, trackingHistory: newHistory, streakDays: prev.streakDays + 1 };
    });

    if (type === 'weight') setInputWeight('');
  };

  const exportPlan = (format: 'md' | 'json') => {
    if (!data) return;
    
    let content = '';
    let filename = `food4recovery_plan_${new Date().toISOString().split('T')[0]}`;
    
    if (format === 'md') {
      content = `# Food4Recovery Ernährungsplan\n\n`;
      content += `**Patient:** ${data.patientName}\n`;
      content += `**Diagnose:** ${data.diagnosis}\n`;
      content += `**Phase:** ${data.phase}\n\n`;
      
      DAYS.forEach(day => {
        content += `## ${FULL_DAYS[day]}\n`;
        const checked = checkedMealsByDay[day] || [];
        const hydration = hydrationByDay[day] || 0;
        
        const dayMeals = plannedMealsByDay[day] || [];
        dayMeals.forEach(meal => {
          const isDone = checked.includes(String(meal.planIdx)) ? '[x]' : '[ ]';
          content += `${isDone} ${meal.time} Uhr: ${meal.name} (${meal.calories} kcal) [${meal.boxName}]\n`;
        });
        content += `**Wasser:** ${hydration} / ${data.hydration.target} L\n\n`;
      });
      filename += '.md';
    } else {
      const exportData = {
        metadata: {
          patient: data.patientName,
          date: new Date().toISOString(),
          plan: data.diagnosis
        },
        tracking: {
          checkedMealsByDay,
          hydrationByDay,
          streak: data.streakDays
        },
        plan: plannedMealsByDay
      };
      content = JSON.stringify(exportData, null, 2);
      filename += '.json';
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const currentDayChecked = checkedMealsByDay[selectedDay] || [];
  const currentDayHydration = hydrationByDay[selectedDay] || 0;
  const currentDayPlanned = plannedMealsByDay[selectedDay] || [];

  const currentCalories = currentDayPlanned
    .filter(meal => currentDayChecked.includes(String(meal.planIdx)))
    .reduce((sum, meal) => sum + meal.calories, 0);

  const currentMacros = currentDayPlanned
    .filter(meal => currentDayChecked.includes(String(meal.planIdx)))
    .reduce((acc, meal) => ({
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0)
    }), { protein: 0, carbs: 0, fat: 0 });

  const currentMicronutrients = currentDayPlanned
    .filter(meal => currentDayChecked.includes(String(meal.planIdx)))
    .reduce((acc, meal) => ({
      vitaminC: acc.vitaminC + (meal.micronutrients?.vitaminC || 0),
      zinc: acc.zinc + (meal.micronutrients?.zinc || 0),
      iron: acc.iron + (meal.micronutrients?.iron || 0)
    }), { vitaminC: 0, zinc: 0, iron: 0 });

  const caloriePercent = Math.min(Math.round((currentCalories / data.calories.target) * 100), 100);
  const hydrationPercent = Math.min(Math.round((currentDayHydration / data.hydration.target) * 100), 100);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className={styles.greeting}>Willkommen zurück, {profile?.firstName || data.patientName}</h1>
            </div>
          </div>
        </section>



        {/* Day Picker (Priority 2) */}
        <section className={styles.dayPicker}>
          <div className={styles.dayPickerHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2>Dein Wochenplan</h2>
              <span className={styles.currentMonth}>April 2026</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className={styles.exportBtn} onClick={() => exportPlan('md')} style={{ fontSize: '0.75rem' }}>
                MD Export
              </button>
              <button className={styles.exportBtn} onClick={() => exportPlan('json')} style={{ fontSize: '0.75rem' }}>
                JSON Export
              </button>
            </div>
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
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Kombinierte Kalorien & Makros Card */}
          <div className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.cardHeader} style={{ marginBottom: '1rem' }}>
              <span className={styles.cardTitle}>Kalorien & Makronährstoffe</span>
              <Activity size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
            
            {/* Kalorien Teil */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>{currentCalories.toLocaleString('de-DE')}</span>
                <span style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>/ {data.calories.target.toLocaleString('de-DE')} kcal</span>
              </div>
              <div style={{ width: '100%', height: '0.5rem', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${caloriePercent}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '9999px', transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* Makros Teil */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>Kohlenhydrate</span>
                  <span style={{ color: 'var(--text-muted)' }}>{currentMacros.carbs} / {data.macrosTarget.carbs} g</span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((currentMacros.carbs / data.macrosTarget.carbs) * 100 || 0, 100)}%`, height: '100%', background: '#33c758', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>Protein</span>
                  <span style={{ color: 'var(--text-muted)' }}>{currentMacros.protein} / {data.macrosTarget.protein} g</span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((currentMacros.protein / data.macrosTarget.protein) * 100 || 0, 100)}%`, height: '100%', background: '#ff8e86', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  <span style={{ fontWeight: 600 }}>Fette</span>
                  <span style={{ color: 'var(--text-muted)' }}>{currentMacros.fat} / {data.macrosTarget.fat} g</span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((currentMacros.fat / data.macrosTarget.fat) * 100 || 0, 100)}%`, height: '100%', background: '#97d598', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Nährstoff-Tracker Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Nährstoff-Tracker</span>
              <Sparkles size={24} style={{ color: '#f97316' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {data.nutrients.map(nutrient => {
                const currentVal = nutrient.name === 'Vitamin C' ? currentMicronutrients.vitaminC 
                                 : nutrient.name === 'Zink' ? currentMicronutrients.zinc 
                                 : currentMicronutrients.iron;
                const pct = Math.min(Math.round((currentVal / nutrient.target) * 100) || 0, 100);
                return (
                  <div key={nutrient.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{nutrient.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{currentVal}{nutrient.unit} / {nutrient.target}{nutrient.unit}</span>
                    </div>
                    <div style={{ width: '100%', height: '0.5rem', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: nutrient.color, borderRadius: '9999px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wasser Card */}
          <div className={`${styles.card} ${currentDayHydration >= data.hydration.target ? styles.waterGoalReached : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div className={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={styles.cardTitle}>Flüssigkeit</span>
                {currentDayHydration >= data.hydration.target && <span className={styles.successBadge}>Erreicht!</span>}
              </div>
              <Droplets size={24} className={styles.waterColor} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{currentDayHydration}</span>
                <span style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>/ {data.hydration.target} L</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleHydrationChange(-0.25)}
                  style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                >
                  -
                </button>
                <button 
                  onClick={() => handleHydrationChange(0.25)}
                  style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: 'none', background: '#3b82f6', color: 'white', fontSize: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s' }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                >
                  +
                </button>
              </div>
            </div>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${hydrationPercent}%`, background: '#3b82f6' }} />
            </div>
            {trackingNote && (
              <p style={{ fontSize: '0.7rem', color: 'var(--color-primary)', marginTop: '0.5rem', fontWeight: 600 }}>
                {trackingNote}
              </p>
            )}
          </div>
        </section>

        {/* Main Grid */}
        <div className={styles.grid}>
          {/* Left: Mahlzeiten */}
          <div>
            <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className={styles.cardTitle} style={{ fontSize: '1.5rem', margin: 0 }}>Mahlzeiten für {FULL_DAYS[selectedDay as keyof typeof FULL_DAYS]}</h2>
              {purchasedKits.length > 0 && (
                <button onClick={() => setShowInventory(!showInventory)} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <Plus size={16} /> Gericht hinzufügen
                </button>
              )}
            </div>
            {showInventory && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-xl)', padding: '1.5rem', marginBottom: '1.5rem', marginTop: '1rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem', margin: 0, fontWeight: 700 }}>Deine Speisekammer</h3>
                  <button 
                    onClick={() => setShowInventory(false)} 
                    style={{ background: 'rgba(51, 199, 88, 0.1)', color: 'var(--color-primary)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <X size={14} /> Schließen
                  </button>
                </div>
                {purchasedKits.map(kit => (
                  <div key={kit.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                      <ShoppingBag size={14} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />{kit.name} ({kit.quantity}x)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      {kit.meals.map(meal => (
                        <button 
                          key={meal.id} 
                          draggable 
                          onDragStart={(e) => handleDragStart(e, meal, kit.name)}
                          onClick={() => addMealToDay(meal, kit.name)} 
                          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--background)', padding: '0.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', cursor: 'grab', textAlign: 'left' }}
                        >
                          <div style={{ width: 40, height: 40, backgroundImage: `url('${meal.image}')`, backgroundSize: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{meal.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{meal.calories} kcal</div>
                          </div>
                          <Plus size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div 
              className={`${styles.mealList} ${isDraggingOver ? styles.dragOver : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {currentDayPlanned.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--surface)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)', border: isDraggingOver ? '2px dashed var(--color-primary)' : '1px dashed var(--border)', transition: 'all 0.2s ease' }}>
                  <Utensils size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p style={{ fontWeight: 600, color: 'var(--text)' }}>{purchasedKits.length > 0 ? 'Noch keine Mahlzeiten geplant' : 'Keine Boxen gekauft'}</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{purchasedKits.length > 0 ? 'Ziehe ein Gericht hierher oder klicke auf "Gericht hinzufügen".' : 'Besuche den Shop, um eine Recovery-Box zu kaufen.'}</p>
                  {purchasedKits.length === 0 && (
                    <Link href="/shop" style={{ display: 'inline-block', marginTop: '1.5rem', background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600, textDecoration: 'none' }}>Zum Shop</Link>
                  )}
                </div>
              ) : (currentDayPlanned.map(meal => {
                const mealKey = String(meal.planIdx);
                const isChecked = currentDayChecked.includes(mealKey);
                return (
                  <div key={mealKey} className={styles.mealCard}>
                    <div className={styles.mealImage} style={{ backgroundImage: `url('${meal.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div className={styles.mealInfo}>
                      <div className={styles.mealTime}>{meal.label} &bull; <span style={{ color: 'var(--color-primary)' }}>{meal.boxName}</span></div>
                      <div className={styles.mealName}>{meal.name}</div>
                      <div className={styles.mealMeta}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Flame size={12} /> {meal.calories} kcal</span>
                        <span style={{ marginLeft: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {meal.prepTime}</span>
                      </div>
                    </div>
                    <button onClick={() => removeMealFromDay(meal.planIdx)} title="Entfernen" style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={16} /></button>
                    <button onClick={() => toggleMealChecked(mealKey)} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', border: isChecked ? '2px solid var(--color-primary)' : '2px solid var(--border)', background: isChecked ? 'var(--color-primary)' : 'transparent', color: isChecked ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', flexShrink: 0 }}>
                      {isChecked ? <Check size={16} /> : null}
                    </button>
                  </div>
                );
              }))}
            </div>

            {/* Tracking Chart */}
            <div className={styles.card} style={{ marginTop: '2rem' }}>
              <div className={styles.cardHeader} style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LineChart size={24} style={{ color: 'var(--color-primary)' }} />
                  <h2 className={styles.cardTitle} style={{ fontSize: '1.5rem', margin: 0 }}>Verlauf</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setChartMetric('weight')}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem',
                      border: chartMetric === 'weight' ? '2px solid var(--color-primary)' : '1px solid var(--border)',
                      background: chartMetric === 'weight' ? 'rgba(51,199,88,0.1)' : 'transparent',
                      color: chartMetric === 'weight' ? 'var(--color-primary)' : 'var(--text)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Gewicht
                  </button>
                  <button 
                    onClick={() => setChartMetric('hydration')}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem',
                      border: chartMetric === 'hydration' ? '2px solid #3b82f6' : '1px solid var(--border)',
                      background: chartMetric === 'hydration' ? 'rgba(59,130,246,0.1)' : 'transparent',
                      color: chartMetric === 'hydration' ? '#3b82f6' : 'var(--text)',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Wasser
                  </button>
                </div>
              </div>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trackingHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartMetric === 'weight' ? '#33c758' : '#3b82f6'} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartMetric === 'weight' ? '#33c758' : '#3b82f6'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                    <YAxis 
                      domain={chartMetric === 'weight' ? [60, 90] : [0, 'dataMax + 1']} 
                      axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                      itemStyle={{ fontWeight: 600, color: chartMetric === 'weight' ? '#33c758' : '#3b82f6' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={chartMetric} 
                      stroke={chartMetric === 'weight' ? '#33c758' : '#3b82f6'} 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMetric)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
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
                    Gewicht tracken (kg)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input 
                      type="number" 
                      placeholder="72.5" 
                      value={inputWeight}
                      onChange={e => setInputWeight(e.target.value)}
                      className={styles.trackInput} 
                    />
                    <button onClick={() => handleTrackData('weight')} className={styles.trackBtn} style={{ background: 'var(--color-primary)', color: 'white', border: 'none' }}>
                      Ok
                    </button>
                  </div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Wasser tracken (L)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      placeholder="1.5" 
                      value={inputHydration}
                      onChange={e => setInputHydration(e.target.value)}
                      className={styles.trackInput} 
                    />
                    <button onClick={() => handleTrackData('hydration')} className={styles.trackBtn} style={{ background: '#3b82f6', color: 'white', border: 'none' }}>
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Track (Priority 4) war hier, aber Nährstoff-Tracker ist jetzt oben */}


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
