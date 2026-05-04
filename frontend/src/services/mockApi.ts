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
    "id": "produktdetails_wundheilungs_box",
    "name": "Wundheilungs-Box",
    "description": "Protein- und mikronährstoffreiche Box zur Unterstützung von Regeneration und Gewebeaufbau.",
    "price": 39.9,
    "currency": "EUR",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    "tags": [
      "High Protein",
      "Anti-Inflammatory"
    ],
    "category": "wound_healing",
    "nutrition": {
      "calories": 2250,
      "protein": "165g",
      "carbs": "180g",
      "fat": "75g"
    },
    "deliveryDays": "Für 1 Woche",
    "meals": [
      {
        "id": "m-wh-1",
        "type": "breakfast",
        "label": "Frühstück",
        "name": "Lachs mit Quinoa",
        "description": "Omega-3-reicher Start.",
        "calories": 750,
        "protein": 55,
        "carbs": 60,
        "fat": 25,
        "micronutrients": {
          "vitaminC": 60,
          "zinc": 6,
          "iron": 5
        },
        "prepTime": "10 Min",
        "time": "08:00",
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-wh-2",
        "type": "lunch",
        "label": "Mittagessen",
        "name": "Huhn mit Linsen",
        "description": "Proteingeladenes Mittagessen.",
        "calories": 750,
        "protein": 55,
        "carbs": 60,
        "fat": 25,
        "micronutrients": {
          "vitaminC": 40,
          "zinc": 9,
          "iron": 6
        },
        "prepTime": "15 Min",
        "time": "13:00",
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-wh-3",
        "type": "dinner",
        "label": "Abendessen",
        "name": "Joghurtfreier Beeren-Snack",
        "description": "Leicht verdaulich.",
        "calories": 750,
        "protein": 55,
        "carbs": 60,
        "fat": 25,
        "micronutrients": {
          "vitaminC": 50,
          "zinc": 6,
          "iron": 4
        },
        "prepTime": "5 Min",
        "time": "19:00",
        "image": "https://images.unsplash.com/photo-1605697746162-4aa83aa03823?q=80&w=800",
        "checked": false
      }
    ]
  },
  {
    "id": "produktdetails_onko_box",
    "name": "Onko-Box",
    "description": "Leicht verdauliche, energiedichte Mahlzeiten für geringe Belastbarkeit und Appetitmangel.",
    "price": 42.5,
    "currency": "EUR",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    "tags": [
      "Leicht verdaulich",
      "Kaloriendicht"
    ],
    "category": "oncology",
    "nutrition": {
      "calories": 2100,
      "protein": "120g",
      "carbs": "240g",
      "fat": "60g"
    },
    "deliveryDays": "Für 1 Woche",
    "meals": [
      {
        "id": "m-ok-1",
        "type": "breakfast",
        "label": "Frühstück",
        "name": "Cremige Reisschale",
        "description": "Sanft und leicht verdaulich.",
        "calories": 700,
        "protein": 40,
        "carbs": 80,
        "fat": 20,
        "micronutrients": {
          "vitaminC": 60,
          "zinc": 4,
          "iron": 4
        },
        "prepTime": "10 Min",
        "time": "08:30",
        "image": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-ok-2",
        "type": "lunch",
        "label": "Mittagessen",
        "name": "Mildes Hähnchenfilet",
        "description": "Energiedicht und verträglich.",
        "calories": 700,
        "protein": 40,
        "carbs": 80,
        "fat": 20,
        "micronutrients": {
          "vitaminC": 40,
          "zinc": 6,
          "iron": 6
        },
        "prepTime": "15 Min",
        "time": "13:00",
        "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-ok-3",
        "type": "dinner",
        "label": "Abendessen",
        "name": "Sanfter Frucht-Smoothie",
        "description": "Vitaminreich und weich.",
        "calories": 700,
        "protein": 40,
        "carbs": 80,
        "fat": 20,
        "micronutrients": {
          "vitaminC": 50,
          "zinc": 5,
          "iron": 4
        },
        "prepTime": "5 Min",
        "time": "18:30",
        "image": "https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?q=80&w=800",
        "checked": false
      }
    ]
  },
  {
    "id": "produktdetails_darm_balance_box",
    "name": "Darm-Balance-Box",
    "description": "Milde, ballaststoffbewusste Box mit Fokus auf Verdauung, Mikrobiom und Verträglichkeit.",
    "price": 37.5,
    "currency": "EUR",
    "imageUrl": "https://images.unsplash.com/photo-1605697746162-4aa83aa03823?q=80&w=800&auto=format&fit=crop",
    "tags": [
      "Gut Friendly",
      "Glutenfrei"
    ],
    "category": "gut_health",
    "nutrition": {
      "calories": 1950,
      "protein": "105g",
      "carbs": "255g",
      "fat": "54g"
    },
    "deliveryDays": "Für 1 Woche",
    "meals": [
      {
        "id": "m-db-1",
        "type": "breakfast",
        "label": "Frühstück",
        "name": "Reis-Congee",
        "description": "Wärmend und magenfreundlich.",
        "calories": 650,
        "protein": 35,
        "carbs": 85,
        "fat": 18,
        "micronutrients": {
          "vitaminC": 60,
          "zinc": 4,
          "iron": 4
        },
        "prepTime": "20 Min",
        "time": "08:00",
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-db-2",
        "type": "lunch",
        "label": "Mittagessen",
        "name": "Geduensteter Kabeljau",
        "description": "Leichtes Protein.",
        "calories": 650,
        "protein": 35,
        "carbs": 85,
        "fat": 18,
        "micronutrients": {
          "vitaminC": 40,
          "zinc": 6,
          "iron": 6
        },
        "prepTime": "15 Min",
        "time": "13:00",
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-db-3",
        "type": "dinner",
        "label": "Abendessen",
        "name": "Fenchel-Kartoffel-Suppe",
        "description": "Beruhigend für den Darm.",
        "calories": 650,
        "protein": 35,
        "carbs": 85,
        "fat": 18,
        "micronutrients": {
          "vitaminC": 50,
          "zinc": 5,
          "iron": 4
        },
        "prepTime": "15 Min",
        "time": "19:00",
        "image": "https://images.unsplash.com/photo-1605697746162-4aa83aa03823?q=80&w=800",
        "checked": false
      }
    ]
  },
  {
    "id": "produktdetails_immun_boost_box",
    "name": "Immun-Boost-Box",
    "description": "Vitamin- und antioxidantienreiche Auswahl zur Unterstützung des Immunsystems.",
    "price": 35.9,
    "currency": "EUR",
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
    "tags": [
      "Immune Support",
      "Antioxidant"
    ],
    "category": "immune",
    "nutrition": {
      "calories": 1920,
      "protein": "96g",
      "carbs": "216g",
      "fat": "66g"
    },
    "deliveryDays": "Für 1 Woche",
    "meals": [
      {
        "id": "m-ib-1",
        "type": "breakfast",
        "label": "Frühstück",
        "name": "Beeren-Porridge",
        "description": "Antioxidantien zum Start.",
        "calories": 640,
        "protein": 32,
        "carbs": 72,
        "fat": 22,
        "micronutrients": {
          "vitaminC": 80,
          "zinc": 4,
          "iron": 4
        },
        "prepTime": "10 Min",
        "time": "08:00",
        "image": "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-ib-2",
        "type": "lunch",
        "label": "Mittagessen",
        "name": "Mandel-Hirse-Bowl",
        "description": "Kraftvolles Mittagessen.",
        "calories": 640,
        "protein": 32,
        "carbs": 72,
        "fat": 22,
        "micronutrients": {
          "vitaminC": 30,
          "zinc": 6,
          "iron": 6
        },
        "prepTime": "20 Min",
        "time": "13:00",
        "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800",
        "checked": false
      },
      {
        "id": "m-ib-3",
        "type": "dinner",
        "label": "Abendessen",
        "name": "Gemuese mit Tahin",
        "description": "Leichtes Gemüseragout.",
        "calories": 640,
        "protein": 32,
        "carbs": 72,
        "fat": 22,
        "micronutrients": {
          "vitaminC": 40,
          "zinc": 5,
          "iron": 4
        },
        "prepTime": "15 Min",
        "time": "19:00",
        "image": "https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?q=80&w=800",
        "checked": false
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
  calories: { current: 1450, target: 2100 },
  hydration: { current: 1.8, target: 2.5 },
  macrosTarget: { carbs: 220, protein: 90, fat: 80 },
  nutrients: [
    { name: 'Vitamin C', current: 85, target: 150, unit: 'mg', color: '#f97316' },
    { name: 'Zink', current: 9, target: 15, unit: 'mg', color: '#3b82f6' },
    { name: 'Eisen', current: 8, target: 14, unit: 'mg', color: '#ef4444' },
  ],
  streakDays: 5,
  trackingHistory: [
    { date: '2024-05-01', weight: 73.5, hydration: 2.2 },
    { date: '2024-05-02', weight: 73.2, hydration: 2.5 },
    { date: '2024-05-03', weight: 72.8, hydration: 2.0 },
    { date: '2024-05-04', weight: 72.5, hydration: 2.4 },
  ],
  dailyMeals: [],
};

const MOCK_RECOVERY_ANALYSIS: RecoveryAnalysis = {
  status: 'demo_ready',
  progressPercent: 100,
  title: 'Orientierende Recovery-Auswertung',
  summary:
    'Auf Basis der Demo-Angaben werden Protein, ausreichende Flüssigkeit und leicht planbare Mahlzeiten priorisiert. Die Auswertung ist eine regelbasierte Orientierung und keine medizinische Diagnose.',
  recommendedKitId: 'produktdetails_wundheilungs_box',
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
      conditions: ['wundheilung'],
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
        conditions: ['wundheilung'],
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
