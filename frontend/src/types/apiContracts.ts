/**
 * ==========================================
 * ARCHITEKTUR-KERN: API Contracts (Source of Truth)
 * ==========================================
 * Hier definieren wir strikt die Datenmodelle, die zwischen Frontend und Backend
 * ausgetauscht werden. Das Frontend wurde "Frontend-Driven" gegen diese Interfaces
 * entwickelt. Ein künftiges Backend muss exakt diese JSON-Strukturen liefern.
 */

// Nutrition Plan Interfaces
export interface Diagnosis {
  condition: string;
  recommendations: string[];
  restrictions: string[];
}

export interface Recipe {
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
  ingredients: string[];
  instructions: string[];
}

export interface DailyPlan {
  day: number;
  meals: {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
    snacks: Recipe[];
  };
  totalMetrics: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface NutritionPlan {
  id: string;
  userId: string;
  diagnosis: Diagnosis;
  weeklyPlan: DailyPlan[];
}

// E-Commerce Shop Interfaces
export interface NutritionalValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealKit {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  nutritionalValues: NutritionalValues;
  dietaryTags: string[]; 
  meals?: string[];
  servings: number;
}

export interface ShopInventory {
  availableMealKits: MealKit[];
}

/**
 * ==========================================
 * TRACKING CONTRACTS
 * ==========================================
 */
export interface DailyProgress {
  proteinPercent: number; // 0-100
  energyPercent: number;  // 0-100
  isMealBoxEaten: boolean;
}

export interface HydrationProgress {
  currentMl: number;
  targetMl: number;
}

/**
 * ==========================================
 * CURATION CONTRACTS
 * ==========================================
 */
export interface CuratedMeal {
  id: string;
  title: string;
  medicalBenefit: string;
  description: string;
  tags: string[];
  imageUrl: string;
  ingredients: string[];
}
