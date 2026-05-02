// ============================================================
// Mock API Service — Frontend-Only Dummy-Daten
// Kann später 1:1 durch echte Calls auf /api/frontend/... ersetzt werden.
// ============================================================

// --- Typen (Frontend-View-Models, kein Backend-Schema) ---

export interface CuratedMeal {
  id: string;
  name: string;
  description: string;
  image: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  micronutrients?: {
    vitaminC: number;
    zinc: number;
    iron: number;
  };
  tags: string[];
  boxName?: string;
}

export interface DailyMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  label: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients?: {
    vitaminC: number;
    zinc: number;
    iron: number;
  };
  prepTime: string;
  time: string;
  image: string;
  checked: boolean;
}

export interface NutrientProgress {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export interface TrackingDataPoint {
  date: string;
  weight: number;
  hydration: number;
}

export interface DashboardData {
  patientName: string;
  avatarUrl: string;
  diagnosis: string;
  phase: string;
  dayNumber: number;
  weekProgress: number;
  dailyMeals: DailyMeal[];
  nutrients: NutrientProgress[];
  hydration: { current: number; target: number };
  calories: { current: number; target: number };
  macrosTarget: { carbs: number; protein: number; fat: number };
  streakDays: number;
  trackingHistory: TrackingDataPoint[];
}

export interface MealKit {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  tags: string[];
  category: 'wound_healing' | 'oncology' | 'immune' | 'gut_health' | 'vitality' | 'general_health';
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  meals: DailyMeal[];
  deliveryDays: string;
}

export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  weight: number;
  height: number;
  conditions: string[];
  allergies: string[];
  notes: string;
  completionPercent: number;
}

export interface RecoveryAnalysis {
  status: 'demo_ready' | 'review_recommended';
  progressPercent: number;
  title: string;
  summary: string;
  recommendedKitId: string;
  recommendedKitName: string;
  matchScores: {
    label: string;
    percent: number;
    rationale: string;
  }[];
  orientationNotes: string[];
  riskNotes: string[];
  nextSteps: string[];
}

// --- Mock Daten ---

const MOCK_MEAL_KITS: MealKit[] = [
  {
    id: 'mk-einfach-gesund',
    name: 'Einfach Gesund',
    description: 'Ausgewogene und nährstoffreiche Mahlzeiten zur allgemeinen Gesundheitsoptimierung und Vorbeugung.',
    price: 69.90,
    currency: '€',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    tags: ['Ausgewogen', 'Vitaminreich'],
    category: 'general_health',
    nutrition: { calories: 1800, protein: '80g', carbs: '220g', fat: '60g' },
    deliveryDays: 'Di & Fr',
    meals: [
      {
        id: 'm-eg-1',
        type: 'breakfast',
        label: 'Frühstück',
        name: 'Bircher Müsli mit frischen Beeren',
        description: 'Ballaststoffreicher Start in den Tag für lang anhaltende Energie.',
        calories: 450,
        protein: 20,
        carbs: 60,
        fat: 15,
        micronutrients: { vitaminC: 50, zinc: 4, iron: 4 },
        prepTime: '5 Min',
        time: '08:00',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800',
        checked: false,
      },
      {
        id: 'm-eg-2',
        type: 'lunch',
        label: 'Mittagessen',
        name: 'Quinoa-Gemüse Pfanne mit Kräutern',
        description: 'Vollwertige pflanzliche Proteine und Vitamine für die Mittagspause.',
        calories: 750,
        protein: 30,
        carbs: 90,
        fat: 25,
        micronutrients: { vitaminC: 60, zinc: 6, iron: 6 },
        prepTime: '20 Min',
        time: '13:00',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        checked: false,
      },
      {
        id: 'm-eg-3',
        type: 'dinner',
        label: 'Abendessen',
        name: 'Vollkorn-Wrap mit Hummus & Spinat',
        description: 'Leichtes Abendessen, das die Verdauung nicht belastet.',
        calories: 600,
        protein: 30,
        carbs: 70,
        fat: 20,
        micronutrients: { vitaminC: 40, zinc: 5, iron: 4 },
        prepTime: '10 Min',
        time: '19:00',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
        checked: false,
      }
    ]
  },
  {
    id: 'mk-chemo',
    name: 'Chemotherapie Box',
    description: 'Sanfte, kaloriendichte Mahlzeiten zur Erhaltung der Kraft und Minimierung von Übelkeit während intensiver Behandlungen.',
    price: 95.00,
    currency: '€',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz3rK5W6ZBzGfUL6tm0o3FU66TtnQX3zszYZMpflOWeYaKtY1m5xYnyCL3-rii_5LCNjou9wWKs_J24uAhWb_h1Brif1ztO3iAPdgz-9Y1AItSZCvw-mkblcrw0NO2NLyvIvdtyEWeuiPVDiyvf9Q1a8FcZSTOxAsF9k1aNVKQErSLtAIwm_EAbbkCPZOjhPpxbpdxOSwlnsWELqZM-4vzuAj5quK8VUw4JBMHi7VL3v9GqUeQPTvgA5bayogNFD7nruPVVpyt-H0',
    tags: ['Leicht verdaulich', 'Kaloriendicht'],
    category: 'oncology',
    nutrition: { calories: 2100, protein: '90g', carbs: '220g', fat: '80g' },
    deliveryDays: 'Mo & Do',
    meals: [
      {
        id: 'm-ch-1',
        type: 'breakfast',
        label: 'Frühstück',
        name: 'Milder Haferbrei mit Banane',
        description: 'Magenfreundlich und leicht süßlich gegen morgendliche Übelkeit.',
        calories: 550,
        protein: 25,
        carbs: 60,
        fat: 20,
        micronutrients: { vitaminC: 40, zinc: 5, iron: 5 },
        prepTime: '10 Min',
        time: '08:30',
        image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800',
        checked: false,
      },
      {
        id: 'm-ch-2',
        type: 'lunch',
        label: 'Mittagessen',
        name: 'Kräftige Knochenbrühe mit Nudeln',
        description: 'Flüssigkeits- und nährstoffreich, besonders gut an schweren Tagen.',
        calories: 750,
        protein: 30,
        carbs: 80,
        fat: 30,
        micronutrients: { vitaminC: 50, zinc: 5, iron: 5 },
        prepTime: '15 Min',
        time: '13:00',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        checked: false,
      },
      {
        id: 'm-ch-3',
        type: 'dinner',
        label: 'Abendessen',
        name: 'Weicher Kartoffel-Auflauf mit Quark',
        description: 'Weiche Textur, kaloriendicht zur Krafterhaltung ohne zu beschweren.',
        calories: 800,
        protein: 35,
        carbs: 80,
        fat: 30,
        micronutrients: { vitaminC: 60, zinc: 5, iron: 4 },
        prepTime: '25 Min',
        time: '18:30',
        image: 'https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?w=800',
        checked: false,
      }
    ]
  }
];

const MOCK_DASHBOARD: DashboardData = {
  patientName: 'Daniel',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY',
    diagnosis: 'Recovery-Fokus',
  phase: 'Phase 1',
  dayNumber: 3,
  weekProgress: 42,
  calories: { current: 0, target: 2100 },
  hydration: { current: 0, target: 2.5 },
  macrosTarget: { carbs: 220, protein: 90, fat: 80 },
  nutrients: [
    { name: 'Vitamin C', current: 0, target: 150, unit: 'mg', color: '#f97316' },
    { name: 'Zink', current: 0, target: 15, unit: 'mg', color: '#3b82f6' },
    { name: 'Eisen', current: 0, target: 14, unit: 'mg', color: '#ef4444' },
  ],
  streakDays: 0,
  trackingHistory: [],
  dailyMeals: [],
};

const MOCK_RECOVERY_ANALYSIS: RecoveryAnalysis = {
  status: 'demo_ready',
  progressPercent: 100,
  title: 'Orientierende Recovery-Auswertung',
  summary:
    'Auf Basis der Demo-Angaben werden Protein, ausreichende Flüssigkeit und leicht planbare Mahlzeiten priorisiert. Die Auswertung ist eine regelbasierte Orientierung und keine medizinische Diagnose.',
  recommendedKitId: 'mk1',
  recommendedKitName: 'Wundheilungs-Box',
  matchScores: [
    {
      label: 'Protein-Fokus',
      percent: 92,
      rationale: 'Proteinreiche Mahlzeiten können die normale Gewebeerneuerung im Rahmen einer ausgewogenen Ernährung unterstützen.',
    },
    {
      label: 'Alltagstauglichkeit',
      percent: 88,
      rationale: 'Vorstrukturierte Mahlzeiten reduzieren Planungsaufwand in belastenden Regenerationsphasen.',
    },
    {
      label: 'Verträglichkeit',
      percent: 81,
      rationale: 'Milde Komponenten und klare Zutatenlisten erleichtern die Auswahl bei sensibler Verdauung.',
    },
  ],
  orientationNotes: [
    'Regelmäßige kleine Mahlzeiten können helfen, Energie über den Tag zu verteilen.',
    'Eine ausreichende Flüssigkeitsroutine liefert Orientierung für das tägliche Tracking.',
    'Bei Appetitmangel können kleine, proteinbetonte Snacks alltagstauglicher sein als große Portionen.',
  ],
  riskNotes: [
    'Bei starken Beschwerden, Gewichtsverlust oder Unsicherheit sollte Fachpersonal einbezogen werden.',
    'Dokumente werden in dieser Demo nicht medizinisch ausgewertet; der Upload zeigt nur den späteren Prozess.',
  ],
  nextSteps: [
    'Wochenplan im Dashboard ansehen',
    'Passende Rezepte prüfen',
    'Meal-Kit optional in den Warenkorb legen',
  ],
};

// --- API Methoden ---

export const nutritionMockApi = {
  /**
   * Curated Meals für die Rezepte-Seite.
   * Später: GET /api/frontend/recipes/curated/{patient_id}
   */
  fetchCuratedMeals: async (): Promise<CuratedMeal[]> => {
    const allMeals: CuratedMeal[] = MOCK_MEAL_KITS.flatMap(kit => 
      kit.meals.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        image: m.image,
        calories: m.calories,
        protein: kit.nutrition.protein,
        carbs: kit.nutrition.carbs,
        fat: kit.nutrition.fat,
        micronutrients: m.micronutrients,
        tags: kit.tags,
        boxName: kit.name
      }))
    );
    return allMeals;
  },

  /**
   * Dashboard-Daten für den Hauptbildschirm.
   * Später: GET /api/frontend/nutrition-plan/{patient_id}
   *       + GET /api/frontend/tracking/daily/{patient_id}
   *       + GET /api/frontend/tracking/hydration/{patient_id}
   */
  fetchDashboardData: async (): Promise<DashboardData> => {
    // Simuliere Netzwerk-Latenz
    await new Promise(resolve => setTimeout(resolve, 600));
    return { ...MOCK_DASHBOARD };
  },

  /**
   * Shop-Inventar für die Shop-Seite.
   * Später: GET /api/frontend/shop/inventory
   */
  fetchShopInventory: async (): Promise<MealKit[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...MOCK_MEAL_KITS];
  },

  /**
   * Regelbasierte Demo-Auswertung für die Analyse-Seite.
   * Später: POST /api/frontend/intake/full-analyze
   */
  fetchRecoveryAnalysis: async (): Promise<RecoveryAnalysis> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...MOCK_RECOVERY_ANALYSIS };
  },

  /**
   * Einzelnes MealKit für die Produktdetailseite.
   * Später: GET /api/frontend/shop/meal-kits/{meal_kit_id}
   */
  fetchMealKit: async (id: string): Promise<MealKit | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_MEAL_KITS.find(kit => kit.id === id) || null;
  },

  /**
   * Patientenprofil laden.
   * Später: GET /api/patient-profile/{patient_id}
   */
  fetchPatientProfile: async (): Promise<PatientProfile> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const defaultProfile: PatientProfile = {
      id: 'p-001',
      firstName: 'Daniel',
      lastName: 'Müller',
      age: 28,
      weight: 72,
      height: 180,
      conditions: ['chemotherapy'],
      allergies: [],
      notes: '',
      completionPercent: 50,
    };

    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('f4r_profile');
      if (saved) return JSON.parse(saved);
    }
    return defaultProfile;
  },

  /**
   * Patientenprofil speichern (Mock).
   * Nutzt sessionStorage für Persistenz zwischen Seiten in der Demo.
   */
  savePatientProfile: async (profile: Partial<PatientProfile>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (typeof window !== 'undefined') {
      const currentRaw = sessionStorage.getItem('f4r_profile');
      const current = currentRaw ? JSON.parse(currentRaw) : {
        id: 'p-001',
        firstName: 'Daniel',
        lastName: 'Müller',
        age: 28,
        weight: 72,
        height: 180,
        conditions: ['chemotherapy'],
        allergies: [],
        notes: '',
        completionPercent: 50,
      };
      
      const updated = { ...current, ...profile };
      sessionStorage.setItem('f4r_profile', JSON.stringify(updated));
      console.log('[MockAPI] Profil in sessionStorage aktualisiert:', updated);
    }
    return { success: true };
  },

  /**
   * MealKit für das Dashboard aktivieren.
   */
  /**
   * MealKit kaufen und zum Inventar hinzufügen.
   * Unterstützt Mengen: Wird dasselbe Kit erneut gekauft, erhöht sich die Quantity.
   */
  activateMealKit: async (kitId: string, quantity: number = 1): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const kit = MOCK_MEAL_KITS.find(k => k.id === kitId);
    if (kit && typeof window !== 'undefined') {
      const existingRaw = sessionStorage.getItem('f4r_purchased_kits');
      const existingKits: Array<MealKit & { quantity: number }> = existingRaw ? JSON.parse(existingRaw) : [];
      const idx = existingKits.findIndex(k => k.id === kitId);
      if (idx >= 0) {
        existingKits[idx].quantity += quantity;
      } else {
        existingKits.push({ ...kit, quantity });
      }
      sessionStorage.setItem('f4r_purchased_kits', JSON.stringify(existingKits));
    }
    return { success: true };
  },
};
