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
  tags: string[];
}

export interface DailyMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  label: string;
  name: string;
  description: string;
  calories: number;
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
  macros: { carbs: number; protein: number; fat: number };
}

export interface MealKit {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  tags: string[];
  category: 'wound_healing' | 'oncology' | 'immune' | 'gut_health' | 'vitality';
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  meals: string[];
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
    id: 'mk1',
    name: 'Wundheilungs-Box',
    description: 'Proteinreiche Demo-Box mit Aminosäuren und Mikronährstoffen, die eine ausgewogene Ernährung in der Regenerationsphase unterstützen kann.',
    price: 89.90,
    currency: '€',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR-s7oU9ghDmTQZ725k-ULlzfvQwWmMmk5RDaQfTYsitrchtJaWEQDLme01GN4GLnLANXekRz8LRydxeZB5o1iOOcod3Necl_aatJsSUXscxmferMUOIpyi0hxkUyZSOd_Mv1m-NPhZYklr4sr1CF4iqZLyMJMwfIN2cec9KNuZeAANtAvGbhfSoQN6hzMUq0aicbGZRTyEF6jkHJKMj72ozszb_sjeptzEbBT9l3tGsIxw9cHm571LEwzHTUsblQInKFXsl8Jr_4',
    tags: ['Proteinreich', 'Zink & Vitamin C'],
    category: 'wound_healing',
    nutrition: { calories: 1850, protein: '120g', carbs: '180g', fat: '65g' },
    meals: ['Avocado-Vollkornbrot mit Eiern', 'Lachs-Quinoa Bowl', 'Süßkartoffel-Kurkuma Bowl'],
    deliveryDays: 'Di & Fr',
  },
  {
    id: 'mk2',
    name: 'Onko-Box',
    description: 'Sanfte, kaloriendichte Mahlzeiten zur Erhaltung der Kraft und Minimierung von Übelkeit während intensiver Behandlungen.',
    price: 95.00,
    currency: '€',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz3rK5W6ZBzGfUL6tm0o3FU66TtnQX3zszYZMpflOWeYaKtY1m5xYnyCL3-rii_5LCNjou9wWKs_J24uAhWb_h1Brif1ztO3iAPdgz-9Y1AItSZCvw-mkblcrw0NO2NLyvIvdtyEWeuiPVDiyvf9Q1a8FcZSTOxAsF9k1aNVKQErSLtAIwm_EAbbkCPZOjhPpxbpdxOSwlnsWELqZM-4vzuAj5quK8VUw4JBMHi7VL3v9GqUeQPTvgA5bayogNFD7nruPVVpyt-H0',
    tags: ['Leicht verdaulich', 'Kaloriendicht'],
    category: 'oncology',
    nutrition: { calories: 2100, protein: '90g', carbs: '220g', fat: '80g' },
    meals: ['Kräftige Knochenbrühe', 'Cremige Gemüsesuppe', 'Weicher Kartoffel-Auflauf'],
    deliveryDays: 'Mo & Do',
  },
  {
    id: 'mk3',
    name: 'Immun-Boost-Box',
    description: 'Pflanzenbetonte Demo-Box mit antioxidativen Zutaten als Orientierung für eine abwechslungsreiche Ernährung.',
    price: 79.90,
    currency: '€',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX9r9R1kuNjJZwKtLrRrehTCQAkLYV4rAtyolfBu3yLBI7H35JYbWuhFCCfOsTVjStaSF6VhT2OWuDYk916-otri4qeBao0VnQI54HxAuB4hEH0dM8CIYJ5zKSTOexeg4KJRY7ruGsgxb9IAxIHmzkHozsK-79uhNEbNp_6H2Ba5W7_Zw5yf1O8MFHyxNfM3HnoXgGJTrT6sbjRg91-TxzxQm7vSjtgpQ-eUMF71i9m8XRBUlT_UCzBMrp3GSTkOfO23pmo9Ww21c',
    tags: ['Antioxidativ', 'Phytonährstoffe'],
    category: 'immune',
    nutrition: { calories: 1700, protein: '85g', carbs: '200g', fat: '55g' },
    meals: ['Beeren-Smoothie Bowl', 'Zitrus-Ingwer Salat', 'Kurkuma-Linsen Eintopf'],
    deliveryDays: 'Mi & Sa',
  },
  {
    id: 'mk4',
    name: 'Darm-Balance-Box',
    description: 'Darmfreundlich ausgerichtete Demo-Box mit ballaststoffreichen und fermentierten Komponenten.',
    price: 84.50,
    currency: '€',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-YvPEIGCdxMoK65M2UqD-XJeBJqSeRMK4I4uzVmCsohPwzJBTJIuGXk65QfflpPMmoIQmX-P8GAPkqQGAwkz3LJSEWr7NOKLSZ3vY2cmFNzYtzTsDOm6paop_HzuByGDFbgDjwPF7UXOOkEA5kX2cOrjjZIuOwdnpGT0NI-t7gcMDXLaLTvlXqIxLC68Yw8fMgYrI5Kcjq1QsxLvE9vui-P41EiV7HZeMt9aqMMUtZkzDteIECdndcMybgdagin-9GMNfzHwoB40',
    tags: ['Probiotisch', 'Ballaststoffreich'],
    category: 'gut_health',
    nutrition: { calories: 1600, protein: '70g', carbs: '210g', fat: '50g' },
    meals: ['Joghurt mit fermentierten Früchten', 'Vollkorn-Kimchi Bowl', 'Kefir-Smoothie'],
    deliveryDays: 'Di & Fr',
  },
  {
    id: 'mk5',
    name: 'Vitality-Box',
    description: 'Energiegeladene Mahlzeiten für die allgemeine Erholung und Wiederherstellung der Vitalität nach längerer Bettruhe.',
    price: 74.90,
    currency: '€',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    tags: ['Energiereich', 'Eisenhaltig'],
    category: 'vitality',
    nutrition: { calories: 2000, protein: '100g', carbs: '240g', fat: '60g' },
    meals: ['Energie-Granola mit Nüssen', 'Rote-Bete Power Bowl', 'Spinat-Lachs Pasta'],
    deliveryDays: 'Mo & Do',
  },
  {
    id: 'mk6',
    name: 'Einfach Gesund Paket',
    description: 'Ausgewogene und nährstoffreiche Mahlzeiten zur allgemeinen Gesundheitsoptimierung und Vorbeugung.',
    price: 69.90,
    currency: '€',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
    tags: ['Ausgewogen', 'Vitaminreich'],
    category: 'general_health',
    nutrition: { calories: 1800, protein: '80g', carbs: '220g', fat: '60g' },
    meals: ['Bircher Müsli', 'Quinoa-Gemüse Pfanne', 'Vollkorn-Wrap mit Hummus'],
    deliveryDays: 'Di & Fr',
  },
];

const MOCK_DASHBOARD: DashboardData = {
  patientName: 'Daniel',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY',
    diagnosis: 'Recovery-Fokus',
  phase: 'Phase 1',
  dayNumber: 3,
  weekProgress: 42,
  calories: { current: 1350, target: 2100 },
  hydration: { current: 1.8, target: 2.5 },
  macros: { carbs: 50, protein: 25, fat: 25 },
  nutrients: [
    { name: 'Protein', current: 82, target: 120, unit: 'g', color: '#33c758' },
    { name: 'Vitamin C', current: 110, target: 150, unit: 'mg', color: '#f97316' },
    { name: 'Zink', current: 12, target: 15, unit: 'mg', color: '#3b82f6' },
    { name: 'Eisen', current: 9, target: 14, unit: 'mg', color: '#ef4444' },
  ],
  dailyMeals: [
    {
      id: 'm1',
      type: 'breakfast',
      label: 'Frühstück',
      name: 'Avocado-Vollkornbrot mit pochierten Eiern',
      description: 'Reich an Omega-3-Fettsäuren und Vitamin C zur Unterstützung der Kollagensynthese.',
      calories: 420,
      prepTime: '15 Min',
      time: '08:30',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnM0xrmZ9Gc1bqwOYy5z81O_7DJFTNI5iFeJF3Az0kEC_59cihGMldM5z739eo_IMfipv6s_dQySX7R8oFZX2vm4TsC7qd5Gu2WaSHaefxqEXgZUnUITasiMdbwnBtfIDYHlPybxv8HP4dZgoKyYrE07WpSTzL89mq94VEfA0KXeccnd3GXYvgGyTIuGZmg5Z02yMYrfkQeGaWVNbEV_GbUIKzAWhpx6SZtPFJ3VNWs8Sm7CSOguzsZ8wj-al7JgDrwEXwyhsr5UI',
      checked: true,
    },
    {
      id: 'm2',
      type: 'lunch',
      label: 'Mittagessen',
      name: 'Gegrillter Lachs mit Zink-reichem Quinoa',
      description: 'Proteinreiches Mittagsgericht mit Mikronährstoffen als Orientierung für die Regenerationsphase.',
      calories: 580,
      prepTime: '25 Min',
      time: '13:00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9frIVGPGbHXtCM4o-9NR8WeAJOVU1PAW04JChrZk8QSKKjzQPfkP95yAVq4bV9w5IyWHb8bR9RovaIe-Y05HUaZWTHR16HFrjiFpN1LGHxJLRYuJgy8xyKMLId5Sv_HWP_KFIG9eWjYuTCGyT4CAkA1RaSTrMzf6jge0p8UWK1LA1LCHRkv_qk3wifARSmyl0szfA48UnqVoH9X6Dftz5dBY2lqvPivPziP-AAniJcJGupocgdqq9Mayv1Ry0176Xuy2Mltm-SAE',
      checked: false,
    },
    {
      id: 'm3',
      type: 'dinner',
      label: 'Abendessen',
      name: 'Süßkartoffel-Bowl mit Kurkuma-Dressing',
      description: 'Milde Bowl mit Kurkuma-Dressing als gut planbare Abendoption.',
      calories: 350,
      prepTime: '20 Min',
      time: '19:00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGazVMJeBFtiBKvhOf30sB_0jtYfkXUjLwt7C3PD8QK8oDGq0dZFveZsvFQYFi680cTlHdMUmc1zQIe71X4ymwHlCnGhSjups3rIzb7WqgQOQ4q0wfWRLanpYG1lNhG-aRRJaLLy8np-D1F4FVjEIl6hUkSevAK3VFoNEVdD8flL_HiCwbvMFzGETgbw3VIv74INyXEEXgU7j68v5m0p0nmNbg8srviFM5rzb4Xp0GKo22YVGLq96-GJ4pLaXoAPrtWYju1HfV6VM',
      checked: false,
    },
  ],
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
    return [
      {
        id: '1',
        name: 'Lachs mit Quinoa',
        description: 'Proteinreiche Rezeptidee mit Omega-3-Fettsäuren als Orientierung.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
        calories: 450,
        protein: '35g',
        carbs: '40g',
        fat: '15g',
        tags: ['Herzgesund', 'Proteinreich']
      },
      {
        id: '2',
        name: 'Grüner Power-Salat',
        description: 'Pflanzenbetonte Rezeptidee mit vielen farbigen Zutaten.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
        calories: 320,
        protein: '12g',
        carbs: '25g',
        fat: '18g',
        tags: ['Vegan', 'Antioxidantien']
      }
    ];
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
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
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
  },

  /**
   * Patientenprofil speichern (Mock — gibt nur Erfolg zurück).
   * Später: POST /api/patient-profile
   */
  savePatientProfile: async (profile: Partial<PatientProfile>): Promise<{ success: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock: Logge die Daten, die ans Backend gehen würden
    console.log('[MockAPI] Profil gespeichert:', profile);
    return { success: true };
  },
};
