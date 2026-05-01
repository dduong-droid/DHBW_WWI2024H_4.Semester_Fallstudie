"""Nutrition plan schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from app.modules.recommendation_engine.schemas import WeeklyPlanRecommendation


NutritionPlanStatus = Literal["active", "archived", "draft", "review_required", "approved_mock", "blocked"]
PreparationComplexity = Literal["low", "medium", "high"]


class NutritionPlanCreateFromRecommendation(BaseModel):
    recommendation_id: str


class NutritionPlan(BaseModel):
    id: str | None = None
    plan_id: str
    patient_id: str
    recommendation_id: str
    title: str
    focus: str
    status: NutritionPlanStatus = "draft"
    weekly_plan: WeeklyPlanRecommendation
    days: int = 7
    daily_meals: list[dict[str, object]] = Field(default_factory=list)
    hydration_hint: str = "Regelmäßig trinken und individuelle Vorgaben beachten."
    preparation_complexity: PreparationComplexity = "medium"
    rationale: list[str] = Field(default_factory=list)
    safety_notes: list[str] = Field(default_factory=list)
    linked_risk_flags: list[str] = Field(default_factory=list)
    adjustments: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviewed_by: str | None = None
    reviewed_at: datetime | None = None
