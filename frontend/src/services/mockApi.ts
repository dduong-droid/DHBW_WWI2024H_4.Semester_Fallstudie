/**
 * ==========================================
 * ARCHITEKTUR-BRÜCKE: Mock API Service
 * ==========================================
 * Simuliert die Antworten eines echten Backends (inklusive 1.5s Latenz).
 * Das Frontend ruft ausschließlich Methoden aus dieser Datei ab. 
 * Zur Anbindung ans echte Backend müssen nur diese Funktionen auf 
 * echte `fetch()` Calls oder Axios umgerüstet werden – das UI (Next.js) bleibt unangetastet.
 */
import { NutritionPlan, ShopInventory, MealKit, DailyPlan, Recipe, DailyProgress, HydrationProgress, CuratedMeal } from '../types/apiContracts';

// Mock data generator
const generateMockNutritionPlan = (): NutritionPlan => ({
  id: 'plan-123',
  userId: 'user-001',
  diagnosis: {
    condition: 'Post-Surgery Recovery',
    recommendations: ['High protein intake for tissue repair', 'Anti-inflammatory foods'],
    restrictions: ['Excessive processed sugar', 'High saturated fats'],
  },
  weeklyPlan: Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    meals: {
      breakfast: generateMockRecipe('Oatmeal with Berries', 'breakfast'),
      lunch: generateMockRecipe('Quinoa Salad with Chicken', 'lunch'),
      dinner: generateMockRecipe('Baked Salmon with Asparagus', 'dinner'),
      snacks: [generateMockRecipe('Greek Yogurt', 'snack')],
    },
    totalMetrics: { calories: 2000, protein: 120, carbs: 220, fat: 60 },
  })),
});

const generateMockRecipe = (name: string, type: string): Recipe => ({
  id: `rec-${Math.random().toString(36).substring(2, 9)}`,
  name,
  description: `A healthy ${type} option.`,
  prepTimeMinutes: 15,
  calories: 450,
  macros: { protein: 30, carbs: 45, fat: 15 },
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: ['Step 1', 'Step 2'],
});

const generateMockShopInventory = (): ShopInventory => ({
  availableMealKits: [
    {
      id: 'kit-001',
      name: 'Recovery Power Bowl',
      description: 'Nährstoffreiche Bowl zur optimalen Wundheilung mit Quinoa und Hähnchen.',
      price: 12.99,
      currency: 'EUR',
      nutritionalValues: { calories: 600, protein: 40, carbs: 65, fat: 20, fiber: 10 },
      dietaryTags: ['High-Protein', 'Glutenfrei'],
      meals: ['Hähnchen mit Quinoa & Brokkoli', 'Protein-Dessert', 'Ingwer-Shot'],
      servings: 1,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'kit-002',
      name: 'Anti-Inflammatory Green Soup',
      description: 'Beruhigende Suppe mit wertvollen Antioxidantien und grünem Gemüse.',
      price: 9.99,
      currency: 'EUR',
      nutritionalValues: { calories: 350, protein: 15, carbs: 40, fat: 12, fiber: 8 },
      dietaryTags: ['Vegan', 'Entzündungshemmend'],
      meals: ['Grüne Bio-Erbsensuppe', 'Veganes Kürbiskern-Brot', 'Matcha Tee'],
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1605697746162-4aa83aa03823?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'kit-003',
      name: 'Omega-3 Lachs Filet',
      description: 'Frischer Lachs mit Süßkartoffelpüree zur Förderung der Zellregeneration.',
      price: 15.99,
      currency: 'EUR',
      nutritionalValues: { calories: 520, protein: 38, carbs: 30, fat: 28, fiber: 5 },
      dietaryTags: ['Pescatarisch', 'Omega-3'],
      meals: ['Atlantik-Lachs mit Süßkartoffel', 'Algensalat', 'Zitronen-Wasser'],
      servings: 1,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'kit-004',
      name: 'Probiotic Gut-Health Omelette',
      description: 'Leicht verdauliches Omelette mit fermentiertem Gemüse für die Darmflora.',
      price: 8.99,
      currency: 'EUR',
      nutritionalValues: { calories: 410, protein: 25, carbs: 12, fat: 22, fiber: 6 },
      dietaryTags: ['Vegetarisch', 'Probiotisch'],
      meals: ['Omelette mit Bio-Eiern', 'Fermentiertes Kimchi', 'Kefir-Drink'],
      servings: 1,
      imageUrl: 'https://images.unsplash.com/photo-1510693209872-9cc91129bde5?q=80&w=800&auto=format&fit=crop',
    }
  ],
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const nutritionMockApi = {
  getNutritionPlan: async (userId: string): Promise<NutritionPlan> => {
    await delay(1500); // 1.5s simulated latency
    return generateMockNutritionPlan();
  },
  fetchCuratedMeals: async (): Promise<CuratedMeal[]> => {
    await delay(1200); 
    return [
      {
        id: 'cur-001',
        title: 'Antioxidativer Wildlachs',
        medicalBenefit: 'Omega-3 + Zellschutz',
        description: 'Hochdosierte Omega-3 Fettsäuren reduzieren postoperative Entzündungen und beschleunigen die Geweberegeneration auf zellulärer Ebene.',
        tags: ['Protein', 'Entzündungshemmend'],
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop',
        ingredients: ['150g Wildlachs', 'Dampfgegarte Süßkartoffel', 'Algensalat']
      },
      {
        id: 'cur-002',
        title: 'Kollagen-Aufbau Huhn',
        medicalBenefit: 'Kollagensynthese + Heilung',
        description: 'Liefert essenzielle Aminosäuren für den Aufbau von neuem Kollagen und unterstützt die Stabilität der Narbenbildung.',
        tags: ['Protein', 'Zink-reich'],
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
        ingredients: ['Hähnchenbrust', 'Brokkoli', 'Quinoa']
      },
      {
        id: 'cur-003',
        title: 'Probiotisches Kefir-Omelette',
        medicalBenefit: 'Darmflora + Immunabwehr',
        description: 'Stärkt das Mikrobiom nach einer Behandlungsphase und sichert so die systemische Immunabwehr des Körpers.',
        tags: ['Protein', 'Probiotisch'],
        imageUrl: 'https://images.unsplash.com/photo-1510693209872-9cc91129bde5?q=80&w=800&auto=format&fit=crop',
        ingredients: ['Bio-Eier', 'Fermentiertes Gemüse', 'Kefir']
      },
      {
        id: 'cur-004',
        title: 'Eisen-Booster Rind',
        medicalBenefit: 'Blutbildung + O2-Transport',
        description: 'Hochverfügbares Häm-Eisen füllt die Speicher nach Blutverlust schnell wieder auf und bekämpft tiefe Erschöpfung.',
        tags: ['Energie', 'Eisen-reich'],
        imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop',
        ingredients: ['Rinder-Steakstreifen', 'Spinat', 'Rote Beete']
      },
      {
        id: 'cur-005',
        title: 'B-Komplex Energie-Bowl',
        medicalBenefit: 'Nervensystem + Vitalität',
        description: 'Ein massiver Schub an B-Vitaminen repariert Nervenbahnen und wandelt Makronährstoffe in zelluläre Energie um.',
        tags: ['Energie', 'Vitamin B'],
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
        ingredients: ['Linsen', 'Avocado', 'Kürbiskerne']
      },
      {
        id: 'cur-006',
        title: 'Polyphenol Beeren-Smoothie',
        medicalBenefit: 'Zellschutz + ATP-Produktion',
        description: 'Dichte Antioxidantien wehren freie Radikale ab und unterstützen die Mitochondrien massiv bei der Energieproduktion.',
        tags: ['Energie', 'Antioxidativ'],
        imageUrl: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c70e?q=80&w=800&auto=format&fit=crop',
        ingredients: ['Blaubeeren', 'Maca-Pulver', 'Mandelmilch']
      }
    ];
  }
};

export const shopMockApi = {
  getInventory: async (): Promise<ShopInventory> => {
    await delay(1500); // 1.5s simulated latency
    return generateMockShopInventory();
  },
  getMealKitDetails: async (kitId: string): Promise<MealKit | undefined> => {
    await delay(1500); // 1.5s simulated latency
    const inventory = generateMockShopInventory();
    return inventory.availableMealKits.find(k => k.id === kitId);
  },
};

/**
 * ==========================================
 * TRACKING MOCK LOCALSTORAGE API
 * ==========================================
 */
const TRACKING_STORAGE_KEY = 'food_4_recovery_tracking';
const HYDRATION_STORAGE_KEY = 'food_4_recovery_hydration';

export const trackingMockApi = {
  getDailyProgress: async (): Promise<DailyProgress> => {
    await delay(600); // Simulate latency
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(TRACKING_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    }
    return { proteinPercent: 12, energyPercent: 20, isMealBoxEaten: false }; 
  },
  
  trackMealBox: async (): Promise<DailyProgress> => {
    await delay(800); // Simulate latency
    const newProgress: DailyProgress = {
      proteinPercent: 100,
      energyPercent: 100,
      isMealBoxEaten: true
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(newProgress));
    }
    return newProgress;
  },

  getHydrationProgress: async (): Promise<HydrationProgress> => {
    await delay(300);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(HYDRATION_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    }
    return { currentMl: 0, targetMl: 2500 }; 
  },
  
  addWaterMl: async (amountMl: number): Promise<HydrationProgress> => {
    await delay(300);
    let current = { currentMl: 0, targetMl: 2500 };
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(HYDRATION_STORAGE_KEY);
      if (stored) current = JSON.parse(stored);
      
      current.currentMl = Math.min(current.currentMl + amountMl, current.targetMl);
      localStorage.setItem(HYDRATION_STORAGE_KEY, JSON.stringify(current));
    }
    return current;
  }
};
