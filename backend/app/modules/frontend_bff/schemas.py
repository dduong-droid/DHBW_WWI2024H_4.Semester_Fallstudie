"""Frontend BFF schemas matching the frontend API contracts."""

from __future__ import annotations

from pydantic import BaseModel, Field

from app.modules.patient_profile.schemas import PatientProfileCreate
from app.modules.questionnaire_intake.schemas import QuestionnaireContent


class FrontendDiagnosis(BaseModel):
    condition: str
    recommendations: list[str] = Field(default_factory=list)
    restrictions: list[str] = Field(default_factory=list)


class FrontendRecipeMacros(BaseModel):
    protein: int
    carbs: int
    fat: int


class FrontendRecipe(BaseModel):
    id: str
    name: str
    description: str
    prepTimeMinutes: int
    calories: int
    macros: FrontendRecipeMacros
    ingredients: list[str] = Field(default_factory=list)
    instructions: list[str] = Field(default_factory=list)


class FrontendDailyPlanMeals(BaseModel):
    breakfast: FrontendRecipe
    lunch: FrontendRecipe
    dinner: FrontendRecipe
    snacks: list[FrontendRecipe] = Field(default_factory=list)


class FrontendDailyPlan(BaseModel):
    day: int
    meals: FrontendDailyPlanMeals
    totalMetrics: dict[str, int]


class FrontendNutritionPlan(BaseModel):
    id: str
    userId: str
    diagnosis: FrontendDiagnosis
    weeklyPlan: list[FrontendDailyPlan] = Field(default_factory=list)


class FrontendNutritionalValues(BaseModel):
    calories: int
    protein: int
    carbs: int
    fat: int
    fiber: int


class FrontendMealKit(BaseModel):
    id: str
    name: str
    description: str
    price: float
    currency: str
    imageUrl: str | None = None
    nutritionalValues: FrontendNutritionalValues
    dietaryTags: list[str] = Field(default_factory=list)
    meals: list[str] | None = None
    servings: int


class FrontendShopInventory(BaseModel):
    availableMealKits: list[FrontendMealKit] = Field(default_factory=list)


class FrontendCuratedMeal(BaseModel):
    id: str
    title: str
    medicalBenefit: str
    description: str
    tags: list[str] = Field(default_factory=list)
    imageUrl: str
    ingredients: list[str] = Field(default_factory=list)


class FrontendDailyProgress(BaseModel):
    proteinPercent: int = Field(ge=0, le=100)
    energyPercent: int = Field(ge=0, le=100)
    isMealBoxEaten: bool


class FrontendHydrationProgress(BaseModel):
    currentMl: int = Field(ge=0)
    targetMl: int = Field(gt=0)


class FullAnalyzeRequest(BaseModel):
    patientProfile: PatientProfileCreate
    questionnaire: QuestionnaireContent


class FullAnalyzeResponse(BaseModel):
    patientId: str
    intakeId: str
    recommendationId: str
    nutritionPlan: FrontendNutritionPlan
    recommendedMealKits: list[FrontendMealKit] = Field(default_factory=list)
    summary: str
    rationale: list[str] = Field(default_factory=list)


class FrontendPurchasedKit(BaseModel):
    """A meal kit that was purchased via an order, with aggregated quantity."""
    id: str
    name: str
    description: str
    price: float
    currency: str
    imageUrl: str | None = None
    nutritionalValues: FrontendNutritionalValues
    dietaryTags: list[str] = Field(default_factory=list)
    meals: list[str] | None = None
    servings: int
    quantity: int = Field(ge=1)


class FrontendPurchasedKitsResponse(BaseModel):
    purchasedKits: list[FrontendPurchasedKit] = Field(default_factory=list)


class HydrationUpdateRequest(BaseModel):
    amountMl: int = Field(gt=0)
