"use client";
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Utensils, HeartPulse, Ruler, UtensilsCrossed, Target,
  ArrowRight, Clock, Shield, Lock, Sparkles, CheckCircle2,
  Upload, FileText, User, X
} from 'lucide-react';
import styles from './page.module.css';
import { recoveryApi } from '../../services/apiClient';

// --- Schritt-Konfiguration ---

const STEPS = [
  { id: 'welcome', label: 'Willkommen' },
  { id: 'health', label: 'Gesundheit' },
  { id: 'preferences', label: 'Ernährung' },
  { id: 'upload', label: 'Dokumente' },
];

const APPETITE_OPTIONS = [
  { value: 'low', label: 'Eher gering', desc: 'Wenig Hunger, muss mich zum Essen zwingen' },
  { value: 'normal', label: 'Normal', desc: 'Regelmäßiger Appetit, esse zu festen Zeiten' },
  { value: 'high', label: 'Eher groß', desc: 'Häufig Hunger, esse gerne und viel' },
];

const ALLERGY_CHIPS = ['Nüsse', 'Soja', 'Fisch', 'Eier', 'Schalentiere', 'Weizen'];
const INTOLERANCE_CHIPS = ['Laktose', 'Gluten', 'Fruktose', 'Histamin', 'Sorbit'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const GOAL_OPTIONS = [
  { id: 'chemo_support', label: 'Chemotherapie', desc: 'W\u00e4hrend onkologischer Behandlung' },
  { id: 'simply_healthy', label: 'Einfach Gesund', desc: 'Gesunde Ern\u00e4hrungsoptimierung ohne Beschwerden' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [appetite, setAppetite] = useState('normal');
  const [allergies, setAllergies] = useState<Set<string>>(new Set());
  const [intolerances, setIntolerances] = useState<Set<string>>(new Set());
  const [goals, setGoals] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        alert(`"${f.name}" hat ein ungültiges Format. Erlaubt: PDF, JPG, PNG.`);
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        alert(`"${f.name}" ist zu groß (max. 10 MB).`);
        return false;
      }
      return true;
    });
    setUploadedFiles(prev => {
      // Duplikate vermeiden
      const existingNames = new Set(prev.map(f => f.name));
      const newFiles = validFiles.filter(f => !existingNames.has(f.name));
      return [...prev, ...newFiles];
    });
  }, []);

  const removeFile = (name: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== name));
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const toggleChip = (set: Set<string>, value: string, setter: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    const next = new Set(set);
    if (next.has(value)) {
      next.delete(value);
    } else {
      next.add(value);
    }
    setter(next);
  };

  // Keine numerische Validierung für Age/Weight/Height mehr nötig

  const canGoNext = (): boolean => {
    switch (step) {
      case 0: return true; // Welcome
      case 1: return goals.size > 0 && age !== '' && weight !== '' && height !== ''; // Health goals + Bio
      case 2: return true; // Preferences (optional)
      case 3: return true; // Upload (optional)
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setUploadStatus(uploadedFiles.length > 0 ? 'Dokument-Metadaten werden im Demo-Backend geprüft...' : '');
    const uploadedDocuments = uploadedFiles.length > 0 ? await recoveryApi.uploadDocuments(uploadedFiles) : [];
    if (uploadedDocuments.length > 0) {
      const backendUploads = uploadedDocuments.filter(doc => !doc.document_id.startsWith('doc_local_')).length;
      setUploadStatus(
        backendUploads === uploadedDocuments.length
          ? 'Dokument-Metadaten wurden im Backend angenommen. Es erfolgt keine medizinische Auswertung.'
          : 'Dokument-Metadaten wurden lokal als Demo-Fallback erfasst. Es erfolgt keine medizinische Auswertung.',
      );
    }
    await recoveryApi.submitOnboardingAnalysis({
      name, 
      age: Number(age),
      weight: Number(weight), 
      height: Number(height), 
      appetite,
      allergies: Array.from(allergies),
      intolerances: Array.from(intolerances),
      goals: Array.from(goals),
      uploadedFiles: uploadedDocuments.length > 0
        ? uploadedDocuments.map(doc => ({ name: doc.filename, size: doc.size, type: doc.content_type }))
        : uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
    });
    setSubmitting(false);
    router.push('/analysis');
  };

  return (
    <div className={styles.container}>
      {/* Decorative Background */}
      <div className={styles.decorations}>
        <div className={styles.decorTopRight} />
        <div className={styles.decorBotLeft} />
      </div>

      <main className={styles.main}>
        <div className={styles.contentWrapper}>

          {/* === STEP 0: Welcome === */}
          {step === 0 && (
            <>
              <div className={styles.hero}>
                <div className={styles.badge}>
                  <Sparkles size={14} />
                  Personalisierte Ernährung
                </div>
                <h1 className={styles.title}>
                  Lass uns deinen<br /><span className={styles.highlight}>Plan erstellen</span>
                </h1>
                <p className={styles.subtitle}>
                  Beantworte ein paar kurze Fragen zu deiner Gesundheit, damit wir deine 
                  Ernährung optimal auf deine Genesung abstimmen können.
                </p>
              </div>

              {/* Category Preview Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: <Ruler size={24} />, label: 'Alter & Körpermaße' },
                  { icon: <UtensilsCrossed size={24} />, label: 'Appetit-Check' },
                  { icon: <Target size={24} />, label: 'Medizinische Ziele' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'var(--surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{
                      width: '3rem', height: '3rem', borderRadius: '50%',
                      background: 'rgba(51,199,88,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      color: 'var(--color-primary)', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 600, flex: 1 }}>{item.label}</span>
                    <ArrowRight size={20} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button className={styles.uploadBtn} onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: 'var(--radius-lg)' }}>
                  Fragebogen starten
                  <ArrowRight size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
                  <Clock size={16} />
                  Dauert nur 2 Minuten
                </div>
              </div>
            </>
          )}

          {/* === STEPS 1-4: Fragebogen === */}
          {step > 0 && (
            <>
              {/* Progress */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                {STEPS.slice(1).map((s, i) => (
                  <div key={s.id} style={{
                    height: '0.375rem', flex: 1, borderRadius: '9999px',
                    background: i < step ? 'var(--color-primary)' : 'var(--border)',
                    transition: 'background 0.3s ease',
                  }} />
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h1 className={styles.title} style={{ fontSize: '2rem', textAlign: 'left' }}>
                  {step === 1 && 'Deine Gesundheitsziele'}
                  {step === 2 && 'Ernährungspräferenzen'}
                  {step === 3 && 'Dokumente hochladen'}
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  {step === 1 && 'Wähle die Bereiche, in denen du Unterstützung brauchst.'}
                  {step === 2 && 'Allergien und Unverträglichkeiten beeinflussen deinen Ernährungsplan.'}
                  {step === 3 && 'Optional: Lade Unterlagen hoch, um den Demo-Prozess sichtbar zu machen. In dieser Version erfolgt keine echte medizinische Dokumentenauswertung.'}
                </p>
              </div>

              {/* Form Card */}
              <div style={{
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border)',
              }}>

                {/* Step 1: Health Goals & Bio Data */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Bio Data Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <InputField
                        id="age"
                        label="Alter"
                        type="number"
                        placeholder="z.B. 30"
                        value={age}
                        onChange={setAge}
                        suffix="Jahre"
                      />
                      <InputField
                        id="weight"
                        label="Gewicht"
                        type="number"
                        placeholder="z.B. 75"
                        value={weight}
                        onChange={setWeight}
                        suffix="kg"
                      />
                      <InputField
                        id="height"
                        label="Gr\u00f6\u00dfe"
                        type="number"
                        placeholder="z.B. 180"
                        value={height}
                        onChange={setHeight}
                        suffix="cm"
                      />
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        W\u00e4hle dein Gesundheitsziel
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {GOAL_OPTIONS.map(g => (
                          <label key={g.id} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '1rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            border: goals.has(g.id) ? '2px solid var(--color-primary)' : '2px solid var(--border)',
                            background: goals.has(g.id) ? 'rgba(51,199,88,0.05)' : 'var(--background)',
                            transition: 'all 0.2s ease',
                          }}>
                            <input
                              type="checkbox"
                              checked={goals.has(g.id)}
                              onChange={() => toggleChip(goals, g.id, setGoals)}
                              style={{ display: 'none' }}
                            />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 700, display: 'block' }}>{g.label}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{g.desc}</span>
                            </div>
                            <CheckCircle2 size={22} style={{
                              color: goals.has(g.id) ? 'var(--color-primary)' : 'var(--border)',
                              transition: 'color 0.2s ease',
                            }} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Preferences */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Appetite */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Appetit aktuell
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {APPETITE_OPTIONS.map(opt => (
                          <label key={opt.value} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1rem', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                            background: appetite === opt.value ? 'rgba(51,199,88,0.08)' : 'var(--background)',
                            border: appetite === opt.value ? '2px solid rgba(51,199,88,0.2)' : '2px solid transparent',
                            transition: 'all 0.2s ease',
                          }}>
                            <input type="radio" name="appetite" value={opt.value} checked={appetite === opt.value}
                              onChange={() => setAppetite(opt.value)} style={{ display: 'none' }} />
                            <div>
                              <span style={{ fontWeight: 600, color: appetite === opt.value ? 'var(--color-primary)' : 'var(--text)' }}>{opt.label}</span>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{opt.desc}</span>
                            </div>
                            {appetite === opt.value && <CheckCircle2 size={20} style={{ color: 'var(--color-primary)' }} />}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Allergies Chips */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Allergien
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {ALLERGY_CHIPS.map(chip => (
                          <button key={chip} onClick={() => toggleChip(allergies, chip, setAllergies)}
                            style={{
                              padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', fontWeight: 600,
                              fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease',
                              background: allergies.has(chip) ? 'rgba(51,199,88,0.1)' : 'var(--background)',
                              border: allergies.has(chip) ? '2px solid rgba(51,199,88,0.3)' : '2px solid var(--border)',
                              color: allergies.has(chip) ? 'var(--color-primary)' : 'var(--text)',
                            }}>
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Intolerances Chips */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Unverträglichkeiten
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {INTOLERANCE_CHIPS.map(chip => (
                          <button key={chip} onClick={() => toggleChip(intolerances, chip, setIntolerances)}
                            style={{
                              padding: '0.625rem 1rem', borderRadius: 'var(--radius-lg)', fontWeight: 600,
                              fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease',
                              background: intolerances.has(chip) ? 'rgba(51,199,88,0.1)' : 'var(--background)',
                              border: intolerances.has(chip) ? '2px solid rgba(51,199,88,0.3)' : '2px solid var(--border)',
                              color: intolerances.has(chip) ? 'var(--color-primary)' : 'var(--text)',
                            }}>
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {step === 3 && (
                  <div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
                    />

                    <div className={styles.dropzoneContainer}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className={styles.glow} style={{ opacity: isDragging ? 1 : undefined }} />
                      <div className={styles.dropzone} style={{
                        borderColor: isDragging ? 'var(--color-primary)' : undefined,
                        background: isDragging ? 'rgba(51,199,88,0.05)' : undefined,
                      }}>
                        <div className={styles.dropzoneInner}>
                          <div className={styles.uploadIconWrapper}>
                            <Upload size={32} />
                          </div>
                          <div>
                            <p className={styles.dropTitle}>
                              {isDragging ? 'Dateien hier ablegen' : 'Dokumente hochladen'}
                            </p>
                            <p className={styles.dropDesc}>
                              {isDragging
                                ? 'Lass los, um die Dateien hochzuladen.'
                                : 'Arztbriefe, Laborwerte oder Rezepte — per Klick oder Drag & Drop.'}
                            </p>
                          </div>
                          <button className={styles.uploadBtn} type="button"
                            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                            <FileText size={18} />
                            Dateien auswählen
                          </button>
                          <div className={styles.uploadMeta}>
                            <span className={styles.metaItem}>
                              <FileText size={14} />
                              PDF, JPG, PNG
                            </span>
                            <span className={styles.metaItem}>
                              <Shield size={14} />
                              Max. 10 MB pro Datei
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hochgeladene Dateien */}
                    {uploadedFiles.length > 0 && (
                      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                          {uploadedFiles.length} {uploadedFiles.length === 1 ? 'Datei' : 'Dateien'} ausgewählt
                        </p>
                        {uploadedFiles.map(file => (
                          <div key={file.name} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg)',
                            background: 'var(--background)', border: '1px solid var(--border)',
                          }}>
                            <FileText size={20} style={{ color: file.type === 'application/pdf' ? '#ba1a1a' : 'var(--color-primary)', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {file.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {formatFileSize(file.size)}
                              </div>
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); removeFile(file.name); }}
                              aria-label={`${file.name} entfernen`}
                              style={{
                                width: '1.75rem', height: '1.75rem', borderRadius: '50%',
                                border: '1px solid var(--border)', background: 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {uploadStatus && (
                      <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {uploadStatus}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <button onClick={handleBack} style={{
                  padding: '0.75rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)',
                  background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                }}>
                  ← Zurück
                </button>
                {step < STEPS.length - 1 ? (
                  <button className={styles.uploadBtn} onClick={handleNext} disabled={!canGoNext()} style={{
                    opacity: canGoNext() ? 1 : 0.5, cursor: canGoNext() ? 'pointer' : 'not-allowed',
                  }}>
                    Weiter <ArrowRight size={18} />
                  </button>
                ) : (
                  <button className={styles.uploadBtn} onClick={handleSubmit} disabled={submitting} style={{
                    background: submitting ? 'var(--border)' : undefined,
                  }}>
                    {submitting ? 'Wird analysiert...' : 'Analyse starten'}
                    {!submitting && <Sparkles size={18} />}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Security Footer (nur auf Welcome) */}
      {step === 0 && (
        <div className={styles.securitySection} style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 1rem' }}>
          <div className={styles.securityItem}>
            <div className={styles.securityIconWrapper}><Lock size={22} /></div>
            <span className={styles.securityTitle}>Demo-Datenschutzkonzept</span>
            <span className={styles.securityDesc}>Lokaler Demo-Modus mit bewusst begrenzter Verarbeitung.</span>
          </div>
          <div className={styles.securityItem}>
            <div className={styles.securityIconWrapper}><Shield size={22} /></div>
            <span className={styles.securityTitle}>Demo-Schutz</span>
            <span className={styles.securityDesc}>Lokaler API-Key-Schutz für die Demo, keine produktive Authentifizierung.</span>
          </div>
          <div className={styles.securityItem}>
            <div className={styles.securityIconWrapper}><HeartPulse size={22} /></div>
            <span className={styles.securityTitle}>Fachlich vorsichtig</span>
            <span className={styles.securityDesc}>Empfehlungen dienen als Orientierung und ersetzen keine Beratung durch Fachpersonal.</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>© 2026 Food 4 Recovery</span>
          <div className={styles.footerLinks}>
            <a>Datenschutz</a>
            <a>Impressum</a>
            <a>Kontakt</a>
          </div>
          <div className={styles.status}>
            <div className={styles.statusDot} />
            Alle Systeme aktiv
          </div>
        </div>
      </footer>
    </div>
  );
}
