import {
  nutritionMockApi,
  type CuratedMeal,
  type DashboardData,
  type DailyMeal,
  type MealKit,
  type NutrientProgress,
  type PatientProfile,
  type RecoveryAnalysis,
} from './mockApi';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const DISABLE_MOCK_FALLBACK = process.env.NEXT_PUBLIC_DISABLE_MOCK_FALLBACK === 'true';
const DEFAULT_PATIENT_ID = 'demo_maria_post_op';
const PATIENT_ID_STORAGE_KEY = 'food4recovery.patientId';
const LAST_ANALYSIS_STORAGE_KEY = 'food4recovery.lastAnalysis';

type FrontendRecipe = {
  id: string;
  name: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
};

type FrontendNutritionPlan = {
  id: string;
  userId: string;
  diagnosis: {
    condition: string;
    recommendations: string[];
    restrictions: string[];
  };
  weeklyPlan: {
    day: number;
    meals: {
      breakfast: FrontendRecipe;
      lunch: FrontendRecipe;
      dinner: FrontendRecipe;
      snacks: FrontendRecipe[];
    };
    totalMetrics: Record<string, number>;
  }[];
};

type FrontendMealKit = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  nutritionalValues: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  dietaryTags: string[];
  meals?: string[] | null;
  servings: number;
};

type FrontendShopInventory = {
  availableMealKits: FrontendMealKit[];
};

type FrontendCuratedMeal = {
  id: string;
  title: string;
  medicalBenefit: string;
  description: string;
  tags: string[];
  imageUrl: string;
  ingredients: string[];
};

type FrontendDailyProgress = {
  proteinPercent: number;
  energyPercent: number;
  isMealBoxEaten: boolean;
};

type FrontendHydrationProgress = {
  currentMl: number;
  targetMl: number;
};

type DocumentUploadResult = {
  document_id: string;
  filename: string;
  content_type: string;
  size: number;
  status: 'uploaded_demo';
  analysis_available: boolean;
  note: string;
};

type FullAnalyzeResponse = {
  patientId: string;
  intakeId: string;
  recommendationId: string;
  nutritionPlan: FrontendNutritionPlan;
  recommendedMealKits: FrontendMealKit[];
  summary: string;
  rationale: string[];
};

type BackendPatientProfile = {
  patient_id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
  known_conditions: string[];
  allergies: string[];
  notes?: string | null;
};

type CheckoutOrderItemInput = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutOrderInput = {
  items: CheckoutOrderItemInput[];
  fullName: string;
  street: string;
  zip: string;
  city: string;
  paymentMethod: string;
  timeSlot: string;
};

export type CheckoutOrderResult = {
  orderId: string;
  deliveryWindow: string;
  backendUsed: boolean;
};

export type TrackingActionResult = {
  backendUsed: boolean;
};

export type HydrationActionResult = {
  currentLiters: number;
  targetLiters: number;
  backendUsed: boolean;
};

export type OnboardingAnalysisInput = {
  name: string;
  age: number;
  weight?: number | null;
  height?: number | null;
  appetite: string;
  allergies: string[];
  intolerances: string[];
  goals: string[];
  uploadedFiles: { name: string; size: number; type: string }[];
};

function getPatientId(): string {
  if (typeof window === 'undefined') return DEFAULT_PATIENT_ID;
  return localStorage.getItem(PATIENT_ID_STORAGE_KEY) || DEFAULT_PATIENT_ID;
}

function storePatientId(patientId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PATIENT_ID_STORAGE_KEY, patientId);
  }
}

function storeAnalysis(analysis: RecoveryAnalysis) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LAST_ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
  }
}

function readStoredAnalysis(): RecoveryAnalysis | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LAST_ANALYSIS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RecoveryAnalysis;
  } catch {
    return null;
  }
}

function fallbackOrThrow<T>(message: string, error: unknown, fallback: () => T | Promise<T>): T | Promise<T> {
  const prefix = DISABLE_MOCK_FALLBACK ? '[BFF error]' : '[BFF fallback]';
  const errorMsg = error instanceof Error ? error.message : JSON.stringify(error) === '{}' ? String(error) : JSON.stringify(error);
  
  console.warn(`${prefix} ${message}:`, errorMsg);
  
  if (DISABLE_MOCK_FALLBACK) {
    throw new Error(`${message}: ${errorMsg}`);
  }
  return fallback();
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  if (init?.body && !isFormData) headers.set('Content-Type', 'application/json');
  if (API_KEY) headers.set('X-API-Key', API_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`BFF request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function normalizeConditionCode(code: string): string {
  const normalized = code.trim().toLowerCase();
  const aliases: Record<string, string> = {
    post_op_recovery: 'post_op',
    wound_healing: 'post_op',
    chemotherapy_support: 'chemotherapy',
    chemo_support: 'chemotherapy',
    swallowing_issues: 'swallowing',
    dysphagia: 'swallowing',
    low_hydration: 'hydration',
    dehydration_risk: 'hydration',
  };
  return aliases[normalized] || normalized;
}

function normalizeConditionCodes(codes: string[]): string[] {
  return Array.from(new Set(codes.map(normalizeConditionCode)));
}

function mapRecipe(recipe: FrontendRecipe, type: DailyMeal['type'], label: string, time: string, checked = false): DailyMeal {
  return {
    id: recipe.id,
    type,
    label,
    name: recipe.name,
    description: recipe.description,
    calories: recipe.calories,
    protein: recipe.macros?.protein || 0,
    carbs: recipe.macros?.carbs || 0,
    fat: recipe.macros?.fat || 0,
    prepTime: `${recipe.prepTimeMinutes} Min`,
    time,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    checked,
  };
}

function mapDashboardData(
  plan: FrontendNutritionPlan,
  daily: FrontendDailyProgress | null,
  hydration: FrontendHydrationProgress | null,
  profileName?: string
): DashboardData {
  const today = plan.weeklyPlan[0];
  const total = today?.totalMetrics || {};
  const proteinCurrent = total.protein || daily?.proteinPercent || 0;
  const calorieCurrent = total.calories || daily?.energyPercent || 0;
  const nutrients: NutrientProgress[] = [
    { name: 'Protein', current: proteinCurrent, target: 120, unit: 'g', color: '#33c758' },
    { name: 'Kohlenhydrate', current: total.carbs || 0, target: 220, unit: 'g', color: '#3b82f6' },
    { name: 'Fette', current: total.fat || 0, target: 70, unit: 'g', color: '#f97316' },
  ];

  return {
    patientName: profileName || plan.userId.replace(/^demo_/, '').replace(/[_-]/g, ' ') || 'Demo',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9edJZrKoVYMUbVYeAL11mBb9NDRyQd6pXOSuAEU8Xzm26sBMxoNrcvps2apoGo4tKTfTiiE0U67oUUIghGuFfAkXqH2Q9vZwXrA8CiIlScjZxpd7ep81lHgE9-vO7xhdwnzxYL8ro90cofPsAiLNLRKHIx4QHQaUyTAZdyYXFwW7VEDq8MgInJz6INCGHXzzz_WBx0mlPnZcfNUAQTGtUcrpfYJqPStjaCQmkkMB7Rfgpy1VN1hnTT-eZ_Nv9YUFyYr_drHDwYNY',
    diagnosis: plan.diagnosis.condition,
    phase: 'lokaler Demo-Modus',
    dayNumber: today?.day || 1,
    weekProgress: Math.min(100, Math.round((plan.weeklyPlan.length / 7) * 100)),
    dailyMeals: today ? [
      mapRecipe(today.meals.breakfast, 'breakfast', 'Frühstück', '08:30', daily?.isMealBoxEaten),
      mapRecipe(today.meals.lunch, 'lunch', 'Mittagessen', '13:00'),
      mapRecipe(today.meals.dinner, 'dinner', 'Abendessen', '19:00'),
    ] : [],
    nutrients,
    hydration: {
      current: hydration ? Number((hydration.currentMl / 1000).toFixed(1)) : 0,
      target: hydration ? Number((hydration.targetMl / 1000).toFixed(1)) : 2.5,
    },
    calories: { current: calorieCurrent, target: 2100 },
    macrosTarget: {
      carbs: total.carbs || 220,
      protein: proteinCurrent || 120,
      fat: total.fat || 70,
    },
    streakDays: 0,
    trackingHistory: [],
  };
}

function mapMealKit(kit: FrontendMealKit): MealKit {
  return {
    id: kit.id,
    name: kit.name,
    description: kit.description,
    price: kit.price,
    currency: kit.currency,
    imageUrl: kit.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    tags: kit.dietaryTags,
    category: 'wound_healing',
    nutrition: {
      calories: kit.nutritionalValues.calories,
      protein: `${kit.nutritionalValues.protein}g`,
      carbs: `${kit.nutritionalValues.carbs}g`,
      fat: `${kit.nutritionalValues.fat}g`,
    },
    meals: [] as DailyMeal[],
    deliveryDays: 'lokaler Demo-Modus',
  };
}

function mapCuratedMeal(meal: FrontendCuratedMeal): CuratedMeal {
  return {
    id: meal.id,
    name: meal.title,
    description: meal.description,
    image: meal.imageUrl,
    calories: 450,
    protein: '30g',
    carbs: '45g',
    fat: '15g',
    tags: meal.tags,
  };
}

function birthDateFromAge(age: number): string {
  const currentYear = new Date().getFullYear();
  return `${currentYear - age}-01-01`;
}

function ageFromBirthDate(birthDate: string): number {
  const birthYear = new Date(birthDate).getFullYear();
  const currentYear = new Date().getFullYear();
  return Number.isFinite(birthYear) ? currentYear - birthYear : 0;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'Demo',
    lastName: parts.slice(1).join(' ') || 'Patient',
  };
}

function mapBackendProfile(profile: BackendPatientProfile): PatientProfile {
  return {
    id: profile.patient_id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    age: ageFromBirthDate(profile.birth_date),
    weight: profile.weight_kg,
    height: profile.height_cm,
    conditions: normalizeConditionCodes(profile.known_conditions),
    allergies: profile.allergies,
    notes: profile.notes || '',
    completionPercent: 100,
  };
}

function buildPatientProfilePayload(profile: Partial<PatientProfile>) {
  const patientId = getPatientId();
  const firstName = profile.firstName || 'Demo';
  const lastName = profile.lastName || 'Patient';
  return {
    patient_id: patientId,
    first_name: firstName,
    last_name: lastName,
    birth_date: birthDateFromAge(profile.age || 60),
    email: `${patientId}@example.com`,
    phone: '+490000000',
    height_cm: profile.height || 170,
    weight_kg: profile.weight || 70,
    activity_level: 'low',
    support_at_home: 'partial_support',
    known_conditions: profile.conditions || [],
    allergies: profile.allergies || [],
    dietary_preferences: [],
    consent_data_processing: true,
    notes: profile.notes || 'Lokaler Demo-Modus: Profil aus Frontend-Maske gespeichert.',
  };
}

function mapPaymentMethod(paymentMethod: string): 'card' | 'invoice' | 'apple_pay' {
  if (paymentMethod === 'apple_pay') return 'apple_pay';
  if (paymentMethod === 'credit_card') return 'card';
  return 'invoice';
}

function buildOrderPayload(input: CheckoutOrderInput) {
  const { firstName, lastName } = splitName(input.fullName);
  return {
    patient_id: getPatientId(),
    items: input.items.map(item => ({
      meal_kit_id: item.id,
      quantity: item.quantity,
    })),
    shipping_address: {
      first_name: firstName,
      last_name: lastName,
      street: input.street,
      postal_code: input.zip,
      city: input.city,
      country: 'DE',
    },
    payment_method: mapPaymentMethod(input.paymentMethod),
    contact_email: `${getPatientId()}@example.com`,
    contact_phone: '+490000000',
    notes: `Demo-Bestellung ohne echte Zahlung. Gewaehltes Zeitfenster: ${input.timeSlot}`,
  };
}

function mapAppetite(appetite: string) {
  if (appetite === 'low') return 'reduced';
  if (appetite === 'high') return 'good';
  return 'variable';
}

function buildFullAnalyzePayload(input: OnboardingAnalysisInput) {
  const firstName = input.name.trim().split(/\s+/)[0] || 'Demo';
  const lastName = input.name.trim().split(/\s+/).slice(1).join(' ') || 'Patient';
  const patientId = `demo_${firstName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'patient'}`;
  const treatmentContext = input.goals.includes('simply_healthy') ? 'präventive Gesundheitsförderung' : (input.goals.includes('chemo_support') ? 'onkologische Demo-Nachsorge' : 'postoperative Demo-Nachsorge');
  const knownConditions = input.goals.includes('chemo_support') ? ['chemo_support'] : input.goals;

  return {
    patientProfile: {
      patient_id: patientId,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDateFromAge(input.age),
      email: `${patientId}@example.com`,
      phone: '+490000000',
      height_cm: input.height || 170,
      weight_kg: input.weight || 70,
      activity_level: 'low',
      support_at_home: 'partial_support',
      known_conditions: knownConditions,
      medical_context: treatmentContext,
      allergies: input.allergies,
      dietary_preferences: input.intolerances,
      consent_data_processing: true,
      notes: `Demo-Onboarding. Uploads: ${input.uploadedFiles.map(file => file.name).join(', ') || 'keine'}`,
    },
    questionnaire: {
      personal_and_body_data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDateFromAge(input.age),
        phone: '+490000000',
        email: `${patientId}@example.com`,
        profession: 'Demo',
        height_cm: input.height || 170,
        weight_kg: input.weight || 70,
        measurements: {},
      },
      activity_and_movement: {
        daily_steps: 2500,
        sports_per_week: 0,
        sports_description: 'lokaler Demo-Modus',
      },
      medication_and_supplements: {
        medications: [],
        supplements: [],
      },
      gut_health: {
        food_intolerances: input.intolerances,
      },
      nutrition_status: {
        appetite_level: mapAppetite(input.appetite),
        intake_change_vs_past: input.appetite === 'low' ? 'slightly_less' : 'same',
        meals_per_day: 3,
        eating_difficulties: [],
        digestive_symptoms: input.intolerances.length > 0 ? ['sensitive_digestion'] : [],
      },
      eating_habits: {
        typical_day_summary: 'Demo-Angaben aus dem Onboarding.',
        preferred_foods: [],
        disliked_foods: [],
        diet_style: 'mixed',
        can_cook: true,
        receives_support_for_cooking: true,
        fluid_intake_ml_per_day: 1600,
        smoking_status: 'no',
      },
      recovery_indicators: {
        infections_last_year: 0,
        wound_healing_issues: input.goals.includes('wound_healing'),
        fatigue_level: input.goals.includes('general_recovery') ? 'moderate' : 'light',
        sleep_quality: 'variable',
      },
      goals_and_expectations: {
        goals: input.goals,
        expectation_notes: 'orientierende Empfehlung für die Fallstudien-Demo',
      },
      additional_notes: 'Dokumente werden in dieser Demo nicht medizinisch ausgewertet.',
    },
  };
}

function mapAnalysis(response: FullAnalyzeResponse): RecoveryAnalysis {
  return {
    status: response.rationale.length > 0 ? 'demo_ready' : 'review_recommended',
    progressPercent: 100,
    title: 'Orientierende Recovery-Auswertung',
    summary: `${response.summary} Diese Auswertung ersetzt keine ärztliche Diagnose oder Behandlung.`,
    recommendedKitId: response.recommendedMealKits[0]?.id || '',
    recommendedKitName: response.recommendedMealKits[0]?.name || 'Meal-Kit nach Fachprüfung',
    matchScores: response.rationale.slice(0, 3).map((line, index) => ({
      label: ['Profil-Fit', 'Alltagstauglichkeit', 'Sicherheitscheck'][index] || 'BFF-Rationale',
      percent: Math.max(72, 92 - index * 7),
      rationale: line,
    })),
    orientationNotes: response.nutritionPlan.diagnosis.recommendations.slice(0, 3),
    riskNotes: response.nutritionPlan.diagnosis.restrictions.length > 0
      ? response.nutritionPlan.diagnosis.restrictions
      : ['Bei starken Beschwerden, Gewichtsverlust oder Unsicherheit sollte Fachpersonal einbezogen werden.'],
    nextSteps: ['Wochenplan im Dashboard ansehen', 'Passende Rezepte prüfen', 'Meal-Kit optional in den Warenkorb legen'],
  };
}

export const recoveryApi = {
  fetchDashboardData: async (): Promise<DashboardData> => {
    try {
      const patientId = getPatientId();
      const [plan, daily, hydration, profile] = await Promise.all([
        fetchJson<FrontendNutritionPlan>(`/api/frontend/nutrition-plan/${patientId}`),
        fetchJson<FrontendDailyProgress>(`/api/frontend/tracking/daily/${patientId}`).catch(error => {
          if (DISABLE_MOCK_FALLBACK) throw error;
          return null;
        }),
        fetchJson<FrontendHydrationProgress>(`/api/frontend/tracking/hydration/${patientId}`).catch(error => {
          if (DISABLE_MOCK_FALLBACK) throw error;
          return null;
        }),
        recoveryApi.fetchPatientProfile().catch(() => undefined)
      ]);
      return mapDashboardData(plan, daily, hydration, profile?.firstName);
    } catch (error) {
      return fallbackOrThrow('Dashboard nutzt Mock-Daten', error, async () => {
        const d = await nutritionMockApi.fetchDashboardData();
        const p = await recoveryApi.fetchPatientProfile().catch(() => null);
        if (p && p.firstName) d.patientName = p.firstName;
        return d;
      });
    }
  },

  fetchShopInventory: async (): Promise<MealKit[]> => {
    try {
      const inventory = await fetchJson<FrontendShopInventory>('/api/frontend/shop/inventory');
      return inventory.availableMealKits.map(mapMealKit);
    } catch (error) {
      return fallbackOrThrow('Shop nutzt Mock-Daten', error, () => nutritionMockApi.fetchShopInventory());
    }
  },

  fetchMealKit: async (id: string): Promise<MealKit | null> => {
    try {
      return mapMealKit(await fetchJson<FrontendMealKit>(`/api/frontend/shop/meal-kits/${id}`));
    } catch (error) {
      return fallbackOrThrow('Meal-Kit nutzt Mock-Daten', error, () => nutritionMockApi.fetchMealKit(id));
    }
  },

  fetchCuratedMeals: async (): Promise<CuratedMeal[]> => {
    try {
      const meals = await fetchJson<FrontendCuratedMeal[]>(`/api/frontend/recipes/curated/${getPatientId()}`);
      return meals.map(mapCuratedMeal);
    } catch (error) {
      return fallbackOrThrow('Rezepte nutzen Mock-Daten', error, () => nutritionMockApi.fetchCuratedMeals());
    }
  },

  submitOnboardingAnalysis: async (input: OnboardingAnalysisInput): Promise<RecoveryAnalysis> => {
    try {
      const response = await fetchJson<FullAnalyzeResponse>('/api/frontend/intake/full-analyze', {
        method: 'POST',
        body: JSON.stringify(buildFullAnalyzePayload(input)),
      });
      storePatientId(response.patientId);
      const analysis = mapAnalysis(response);
      storeAnalysis(analysis);
      return analysis;
    } catch (error) {
      const analysis = await fallbackOrThrow('Onboarding nutzt Mock-Auswertung', error, async () => {
        const mockAnalysis = await nutritionMockApi.fetchRecoveryAnalysis();
        // Falls 'Einfach Gesund' gew\u00e4hlt wurde, passe die Empfehlung an
        if (input.goals.includes('simply_healthy')) {
          mockAnalysis.recommendedKitId = 'mk-einfach-gesund';
          mockAnalysis.recommendedKitName = 'Einfach Gesund';
          mockAnalysis.title = 'Ernährungsoptimierung';
          mockAnalysis.summary = 'Basierend auf deinen Angaben liegt der Fokus auf einer ausgewogenen und präventiven Gesundheitsförderung. Diese Auswertung ersetzt keine ärztliche Beratung.';
        } else if (input.goals.includes('chemo_support')) {
          mockAnalysis.recommendedKitId = 'mk-chemo';
          mockAnalysis.recommendedKitName = 'Chemotherapie Box';
          mockAnalysis.title = 'Onkologische Unterstützung';
          mockAnalysis.summary = 'Sanfte, kaloriendichte Mahlzeiten zur Erhaltung der Kraft während deiner Behandlung. Diese Auswertung ersetzt keine ärztliche Beratung.';
        }
        return mockAnalysis;
      });
      storeAnalysis(analysis);
      return analysis;
    }
  },

  uploadDocuments: async (files: File[]): Promise<DocumentUploadResult[]> => {
    const results: DocumentUploadResult[] = [];
    for (const file of files) {
      try {
        const form = new FormData();
        form.append('file', file);
        results.push(await fetchJson<DocumentUploadResult>('/api/documents/upload', {
          method: 'POST',
          body: form,
        }));
      } catch (error) {
        results.push(await fallbackOrThrow('Dokument-Upload nutzt nur lokale Metadaten', error, () => ({
          document_id: `doc_local_${Math.random().toString(16).slice(2, 10)}`,
          filename: file.name,
          content_type: file.type || 'application/octet-stream',
          size: file.size,
          status: 'uploaded_demo',
          analysis_available: false,
          note: 'Dokumente werden im MVP nicht medizinisch ausgewertet.',
        })));
      }
    }
    return results;
  },

  fetchRecoveryAnalysis: async (): Promise<RecoveryAnalysis> => {
    const stored = readStoredAnalysis();
    if (stored) return stored;
    return fallbackOrThrow('Analysis nutzt Mock-Auswertung ohne gespeicherte BFF-Analyse', new Error('No stored BFF analysis found.'), () => nutritionMockApi.fetchRecoveryAnalysis());
  },

  fetchPatientProfile: async (): Promise<PatientProfile> => {
    try {
      return mapBackendProfile(await fetchJson<BackendPatientProfile>(`/api/patient-profile/${getPatientId()}`));
    } catch (error) {
      return fallbackOrThrow('Profil nutzt Mock-Daten', error, () => nutritionMockApi.fetchPatientProfile());
    }
  },

  savePatientProfile: async (profile: Partial<PatientProfile>): Promise<{ success: boolean }> => {
    try {
      await fetchJson<BackendPatientProfile>('/api/patient-profile', {
        method: 'POST',
        body: JSON.stringify(buildPatientProfilePayload(profile)),
      });
      return { success: true };
    } catch (error) {
      return fallbackOrThrow('Profil-Speichern nutzt Mock-Daten', error, () => nutritionMockApi.savePatientProfile(profile));
    }
  },

  submitCheckoutOrder: async (input: CheckoutOrderInput): Promise<CheckoutOrderResult> => {
    try {
      const order = await fetchJson<{ order_id: string; estimated_delivery_window: string }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(buildOrderPayload(input)),
      });
      return {
        orderId: order.order_id,
        deliveryWindow: order.estimated_delivery_window,
        backendUsed: true,
      };
    } catch (error) {
      return fallbackOrThrow('Checkout nutzt lokale Demo-Bestellung', error, () => ({
        orderId: `F4R-${Math.floor(1000 + Math.random() * 9000)}-MOCK`,
        deliveryWindow: input.timeSlot,
        backendUsed: false,
      }));
    }
  },

  markMealBoxEaten: async (): Promise<TrackingActionResult> => {
    try {
      await fetchJson<FrontendDailyProgress>(`/api/frontend/tracking/daily/${getPatientId()}/meal-box`, {
        method: 'POST',
      });
      return { backendUsed: true };
    } catch (error) {
      return fallbackOrThrow('Meal-Tracking bleibt lokal', error, () => ({ backendUsed: false }));
    }
  },

  addHydrationWater: async (amountMl: number): Promise<HydrationActionResult> => {
    try {
      const progress = await fetchJson<FrontendHydrationProgress>(`/api/frontend/tracking/hydration/${getPatientId()}/water`, {
        method: 'POST',
        body: JSON.stringify({ amountMl }),
      });
      return {
        currentLiters: Number((progress.currentMl / 1000).toFixed(1)),
        targetLiters: Number((progress.targetMl / 1000).toFixed(1)),
        backendUsed: true,
      };
    } catch (error) {
      return fallbackOrThrow('Hydration-Tracking bleibt lokal', error, () => ({
        currentLiters: Number((amountMl / 1000).toFixed(1)),
        targetLiters: 2.5,
        backendUsed: false,
      }));
    }
  },
};
