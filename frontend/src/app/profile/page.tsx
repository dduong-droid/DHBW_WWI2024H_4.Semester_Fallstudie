'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Utensils, 
  Activity, 
  User, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  Shield 
} from 'lucide-react';
import styles from './page.module.css';
import CartNavIcon from '../../components/CartNavIcon';

export default function ProfilePage() {
  const router = useRouter();
  
  const [personalData, setPersonalData] = useState({
    age: '',
    weight: '',
    height: ''
  });

  const [conditions, setConditions] = useState({
    postOp: false,
    chemo: true, 
    chronic: false,
    cardio: false
  });
  
  const [allergies, setAllergies] = useState({
    lactose: false,
    gluten: false,
    nuts: false,
    other: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Validation Logic
  const isValid = 
    personalData.age !== '' && Number(personalData.age) > 0 &&
    personalData.weight !== '' && Number(personalData.weight) > 0 &&
    personalData.height !== '' && Number(personalData.height) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    // Simulate save duration
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Smooth transition to next step
      setTimeout(() => {
        router.push('/onboarding');
      }, 1500);
    }, 600);
  };

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
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/profile" className={`${styles.navLink} ${styles.navLinkActive}`}>Profil</Link>
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

      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Personalisieren Sie Ihre Genesung</h1>
              <p className={styles.subtitle}>Schritt 1 von 2: Medizinischer Hintergrund</p>
            </div>
            <div className={styles.iconBox}>
              <Activity size={32} strokeWidth={2} />
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{width: '50%'}}></div>
          </div>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          
          {showSuccess && (
            <div style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
              <CheckCircle2 size={24} />
              <span>Ihre Daten wurden erfolgreich gespeichert! Sie werden weitergeleitet...</span>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <User size={24} />
              </div>
              <h2 className={styles.sectionTitle}>Physisches Profil</h2>
            </div>
            <div className={styles.grid3}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Alter</label>
                <input 
                  type="number"
                  min="1"
                  className={styles.input} 
                  placeholder="28" 
                  value={personalData.age}
                  onChange={(e) => setPersonalData({...personalData, age: e.target.value})}
                  onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Gewicht (kg)</label>
                <input 
                  type="number"
                  min="1"
                  className={styles.input} 
                  placeholder="72" 
                  value={personalData.weight}
                  onChange={(e) => setPersonalData({...personalData, weight: e.target.value})}
                  onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Größe (cm)</label>
                <input 
                  type="number"
                  min="1"
                  className={styles.input} 
                  placeholder="180" 
                  value={personalData.height}
                  onChange={(e) => setPersonalData({...personalData, height: e.target.value})}
                  onKeyDown={(e) => ['-', '+', 'e', 'E'].includes(e.key) && e.preventDefault()}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Stethoscope size={24} />
              </div>
              <h2 className={styles.sectionTitle}>Aktuelle Beschwerden</h2>
            </div>
            <p className={styles.sectionDesc}>Wählen Sie alles Zutreffende aus, damit wir Ihre Aktivitäten anpassen können.</p>
            
            <div className={styles.grid2}>
              <label className={`${styles.checkboxLabel} ${conditions.postOp ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={conditions.postOp} onChange={() => setConditions({...conditions, postOp: !conditions.postOp})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Post-OP Erholung</span>
                  <span className={styles.checkboxDesc}>Chirurgischer Eingriff in den letzten 6 Monaten</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>
              
              <label className={`${styles.checkboxLabel} ${conditions.chemo ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={conditions.chemo} onChange={() => setConditions({...conditions, chemo: !conditions.chemo})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Chemotherapie</span>
                  <span className={styles.checkboxDesc}>Laufende oder kürzliche onkologische Behandlung</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>

              <label className={`${styles.checkboxLabel} ${conditions.chronic ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={conditions.chronic} onChange={() => setConditions({...conditions, chronic: !conditions.chronic})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Chronische Schmerzen</span>
                  <span className={styles.checkboxDesc}>Anhaltende Beschwerden oder eingeschränkte Mobilität</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>

              <label className={`${styles.checkboxLabel} ${conditions.cardio ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={conditions.cardio} onChange={() => setConditions({...conditions, cardio: !conditions.cardio})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Herz-Kreislauf</span>
                  <span className={styles.checkboxDesc}>Vorgeschichte oder Überwachung des Herzens</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <AlertTriangle size={24} />
              </div>
              <h2 className={styles.sectionTitle}>Allergien & Unverträglichkeiten</h2>
            </div>
            <p className={styles.sectionDesc}>Bitte wählen Sie alle bekannten Allergien oder Nahrungsmittel-Unverträglichkeiten aus.</p>
            
            <div className={styles.grid2}>
              <label className={`${styles.checkboxLabel} ${allergies.lactose ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={allergies.lactose} onChange={() => setAllergies({...allergies, lactose: !allergies.lactose})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Laktoseintoleranz</span>
                  <span className={styles.checkboxDesc}>Unverträglichkeit von Milchprodukten</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>
              
              <label className={`${styles.checkboxLabel} ${allergies.gluten ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={allergies.gluten} onChange={() => setAllergies({...allergies, gluten: !allergies.gluten})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Glutenfrei</span>
                  <span className={styles.checkboxDesc}>Zöliakie oder Gluten-Sensitivität</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>

              <label className={`${styles.checkboxLabel} ${allergies.nuts ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={allergies.nuts} onChange={() => setAllergies({...allergies, nuts: !allergies.nuts})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Nussallergie</span>
                  <span className={styles.checkboxDesc}>Allergie gegen Schalenfrüchte oder Erdnüsse</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>

              <label className={`${styles.checkboxLabel} ${allergies.other ? styles.checkboxChecked : ''}`}>
                <input type="checkbox" className={styles.checkboxInput} checked={allergies.other} onChange={() => setAllergies({...allergies, other: !allergies.other})} />
                <div className={styles.checkboxContent}>
                  <span className={styles.checkboxTitle}>Sonstige</span>
                  <span className={styles.checkboxDesc}>Andere spezifische Unverträglichkeiten</span>
                </div>
                <CheckCircle2 size={24} className={styles.checkIcon} />
              </label>
            </div>
          </div>

          <div className={styles.section} style={{marginBottom: '0'}}>
            <label className={styles.label} style={{display: 'block', marginBottom: '0.5rem'}}>Weitere Anmerkungen oder Bedürfnisse</label>
            <textarea className={styles.textarea} rows={3} placeholder="Erzählen Sie uns mehr über Ihre spezifischen Bedürfnisse..." />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.backBtn} onClick={() => router.back()}>Zurück</button>
            <button type="submit" className={styles.nextBtn} disabled={!isValid || isSubmitting}>
              {isSubmitting ? 'Wird gespeichert...' : 'Speichern & Weiter'}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </div>
        </form>

        <div className={styles.trustBadge}>
          <div className={styles.trustItem}>
            <Lock size={16} />
            HIPAA Konform
          </div>
          <div className={styles.trustDot}></div>
          <div className={styles.trustItem}>
            <Shield size={16} />
            Ende-zu-Ende verschlüsselt
          </div>
        </div>

      </main>
    </div>
  );
}
