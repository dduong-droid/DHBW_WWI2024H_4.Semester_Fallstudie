"""Recommendation engine schemas."""

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field

from app.modules.patient_profile.schemas import PatientProfileCreate
from app.modules.questionnaire_intake.schemas import QuestionnaireContent


class Recipe(BaseModel):
    id: str
    name: str
    description: str
    prep_time_minutes: int = Field(ge=0)
    calories: int = Field(ge=0)
    protein: int = Field(ge=0)
    carbs: int = Field(ge=0)
    fat: int = Field(ge=0)
    ingredients: list[str] = Field(default_factory=list)


class DailyPlanMeals(BaseModel):
    breakfast: Recipe
    lunch: Recipe
    dinner: Recipe
    snacks: list[Recipe] = Field(default_factory=list)


class DailyPlan(BaseModel):
    day: int = Field(ge=1, le=7)
    meals: DailyPlanMeals
    total_metrics: dict[str, int]


class WeeklyPlanRecommendation(BaseModel):
    template_id: str
    title: str
    focus: str
    adjustments: list[str] = Field(default_factory=list)
    days: list[DailyPlan] = Field(default_factory=list)


class RecommendedMealKit(BaseModel):
    meal_kit_id: str
    name: str
    score: int
    rationale: str


class RecommendationAnalyzeRequest(BaseModel):
    intake_id: str | None = None
    patient_profile: PatientProfileCreate | None = None
    questionnaire: QuestionnaireContent | None = None


class RecommendationResult(BaseModel):
    recommendation_id: str
    patient_id: str
    summary: str
    priority_goals: list[str] = Field(default_factory=list)
    detected_needs: list[str] = Field(default_factory=list)
    recommended_meal_kits: list[RecommendedMealKit] = Field(default_factory=list)
    recommended_weekly_plan: WeeklyPlanRecommendation
    dietary_warnings: list[str] = Field(default_factory=list)
    rationale: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
