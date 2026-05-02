"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Utensils, Bell, User, HeartPulse, AlertTriangle,
  CheckCircle2, Lock, Shield, ArrowRight, ArrowLeft
} from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';
import CartNavIcon from '../../components/CartNavIcon';

// --- Konfiguration: Beschwerden und Allergien ---

const CONDITIONS = [
  { id: 'chemotherapy', label: 'Chemotherapie', desc: 'Laufende oder kürzliche onkologische Behandlung' },
];

const ALLERGIES = [
  { id: 'lactose', label: 'Laktoseintoleranz', desc: 'Unverträglichkeit von Milchprodukten' },
  { id: 'gluten', label: 'Glutenfrei', desc: 'Zöliakie oder Gluten-Sensitivität' },
  { id: 'nuts', label: 'Nussallergie', desc: 'Allergie gegen Schalenfrüchte oder Erdnüsse' },
  { id: 'other', label: 'Sonstige', desc: 'Andere spezifische Unverträglichkeiten' },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [conditions, setConditions] = useState<Set<string>>(new Set());
  const [allergies, setAllergies] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const router = useRouter();

  // Lade bestehende Profildaten
  useEffect(() => {
    recoveryApi.fetchPatientProfile().then(profile => {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setAge(profile.age ? String(profile.age) : '');
      setWeight(profile.weight ? String(profile.weight) : '');
      setHeight(profile.height ? String(profile.height) : '');
      setConditions(new Set(profile.conditions));
      setAllergies(new Set(profile.allergies));
      setNotes(profile.notes);
      setLoading(false);
    });
  }, []);

  const toggleItem = (set: Set<string>, id: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    const next = new Set(set);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setter(next);
  };

  // Fortschrittsberechnung (reine Frontend-Logik)
  const completionPercent = (() => {
    let filled = 0;
    const total = 4;
    if (age) filled++;
    if (weight) filled++;
    if (height) filled++;
    if (conditions.size > 0 || allergies.size > 0 || notes) filled++;
    return Math.round((filled / total) * 100);
  })();

  const canSubmit = age && weight && height && consent;

  const handleSave = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setSaved(false);
    await recoveryApi.savePatientProfile({
      firstName,
      lastName,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      conditions: Array.from(conditions),
      allergies: Array.from(allergies),
      notes,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push('/dashboard');
    }, 1000);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', color: 'var(--color-primary)' }}>
            <div style={{ width: '3rem', height: '3rem', border: '4px solid rgba(51,199,88,0.2)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontWeight: 600 }}>Lade Profil...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Header mit Fortschritt */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Gesundheitsprofil</h1>
              <p className={styles.subtitle}>Schritt 2 von 4: Medizinischer Hintergrund</p>
            </div>
            <div className={styles.iconBox}>
              <HeartPulse size={24} />
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${completionPercent}%` }} />
          </div>
        </div>

        {/* Form Card */}
        <div className={styles.formCard}>
          {/* Physisches Profil */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}><User size={22} /></span>
              <h2 className={styles.sectionTitle}>Physisches Profil</h2>
            </div>
            <div className={styles.grid2} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.inputGroup}>
                <label htmlFor="profile-firstname" className={styles.label}>Vorname</label>
                <input
                  id="profile-firstname"
                  type="text"
                  className={styles.input}
                  placeholder="Maria"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="profile-lastname" className={styles.label}>Nachname</label>
                <input
                  id="profile-lastname"
                  type="text"
                  className={styles.input}
                  placeholder="Müller"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.grid3}>
              <div className={styles.inputGroup}>
                <label htmlFor="profile-age" className={styles.label}>Alter</label>
                <input
                  id="profile-age"
                  type="number"
                  className={styles.input}
                  placeholder="28"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  min={1}
                  max={120}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="profile-weight" className={styles.label}>Gewicht (kg)</label>
                <input
                  id="profile-weight"
                  type="number"
                  className={styles.input}
                  placeholder="72"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  min={20}
                  max={300}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="profile-height" className={styles.label}>Größe (cm)</label>
                <input
                  id="profile-height"
                  type="number"
                  className={styles.input}
                  placeholder="180"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  min={100}
                  max={250}
                />
              </div>
            </div>
          </div>

          {/* Aktuelle Beschwerden */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}><HeartPulse size={22} /></span>
              <h2 className={styles.sectionTitle}>Aktuelle Beschwerden</h2>
            </div>
            <p className={styles.sectionDesc}>Wähle alles Zutreffende aus, damit wir deine Ernährung anpassen können.</p>
            <div className={styles.grid2}>
              {CONDITIONS.map(c => (
                <label
                  key={c.id}
                  className={`${styles.checkboxLabel} ${conditions.has(c.id) ? styles.checkboxChecked : ''}`}
                >
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={conditions.has(c.id)}
                    onChange={() => toggleItem(conditions, c.id, setConditions)}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>{c.label}</span>
                    <span className={styles.checkboxDesc}>{c.desc}</span>
                  </div>
                  <CheckCircle2 size={22} className={styles.checkIcon} />
                </label>
              ))}
            </div>
          </div>

          {/* Allergien */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}><AlertTriangle size={22} /></span>
              <h2 className={styles.sectionTitle}>Allergien & Unverträglichkeiten</h2>
            </div>
            <p className={styles.sectionDesc}>Bitte wähle alle bekannten Allergien oder Nahrungsmittel-Unverträglichkeiten aus.</p>
            <div className={styles.grid2}>
              {ALLERGIES.map(a => (
                <label
                  key={a.id}
                  className={`${styles.checkboxLabel} ${allergies.has(a.id) ? styles.checkboxChecked : ''}`}
                >
                  <input
                    type="checkbox"
                    className={styles.checkboxInput}
                    checked={allergies.has(a.id)}
                    onChange={() => toggleItem(allergies, a.id, setAllergies)}
                  />
                  <div className={styles.checkboxContent}>
                    <span className={styles.checkboxTitle}>{a.label}</span>
                    <span className={styles.checkboxDesc}>{a.desc}</span>
                  </div>
                  <CheckCircle2 size={22} className={styles.checkIcon} />
                </label>
              ))}
            </div>
          </div>

          {/* Notizen */}
          <div className={styles.section}>
            <div className={styles.inputGroup}>
              <label htmlFor="profile-notes" className={styles.label}>Weitere Anmerkungen oder Bedürfnisse</label>
              <textarea
                id="profile-notes"
                className={styles.textarea}
                placeholder="Erzähle uns mehr über deine spezifischen Bedürfnisse..."
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Datenschutz-Einwilligung */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon} style={{ color: 'var(--color-primary)' }}><Shield size={22} /></span>
              <h2 className={styles.sectionTitle}>Datenschutz & Einwilligung</h2>
            </div>
            <label className={`${styles.checkboxLabel} ${consent ? styles.checkboxChecked : ''}`}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={consent}
                onChange={() => setConsent(!consent)}
              />
              <div className={styles.checkboxContent}>
                <span className={styles.checkboxTitle}>Einwilligung zur Datenverarbeitung</span>
                <span className={styles.checkboxDesc}>
                  Ich stimme zu, dass Food4Recovery meine gesundheitsbezogenen Daten verarbeitet, 
                  um mir personalisierte Empfehlungen zu geben. Diese Einwilligung kann ich jederzeit widerrufen.
                </span>
              </div>
              <CheckCircle2 size={22} className={styles.checkIcon} />
            </label>
          </div>

          {/* Actions */}
          <div className={styles.formActions}>
            <Link href="/dashboard" className={styles.backBtn}>
              <ArrowLeft size={16} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
              Zurück
            </Link>
            <button
              className={styles.nextBtn}
              onClick={handleSave}
              disabled={!canSubmit || saving}
            >
              {saving ? 'Speichere...' : saved ? 'Gespeichert ✓' : 'Speichern & Weiter'}
              {!saving && !saved && <ArrowRight size={18} />}
            </button>
          </div>
        </div>

        {/* Privacy Management (Priority 5) */}
        <div className={styles.section} style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon} style={{ color: 'var(--text-muted)' }}><Shield size={22} /></span>
            <h2 className={styles.sectionTitle}>Datenmanagement</h2>
          </div>
          <p className={styles.sectionDesc}>Demo-Datenmanagement im lokalen Modus: Export und Löschung zeigen den vorgesehenen Prozess, ersetzen aber keine produktive Datenschutzprüfung.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              className={styles.secondaryBtn} 
              style={{ justifyContent: 'center', width: '100%', border: '1px solid var(--border)' }}
              onClick={() => alert('Daten-Export wird vorbereitet (Demo)...')}
            >
              Patientendaten exportieren (.json)
            </button>
            
            <button 
              className={styles.deleteBtn}
              onClick={() => {
                if(confirm('Möchtest du dein Profil wirklich unwiderruflich löschen?')) {
                  alert('Profil wurde gelöscht (Demo).');
                  router.push('/');
                }
              }}
            >
              Profil und alle Daten löschen
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className={styles.trustBadge}>
          <div className={styles.trustItem}>
            <Lock size={14} />
            Demo-Datenschutzkonzept
          </div>
          <div className={styles.trustDot} />
          <div className={styles.trustItem}>
            <Shield size={14} />
            lokaler Demo-Modus
          </div>
        </div>
      </main>
    </div>
  );
}
