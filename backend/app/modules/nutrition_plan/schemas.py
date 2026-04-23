"""Nutrition plan schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from app.modules.recommendation_engine.schemas import WeeklyPlanRecommendation


NutritionPlanStatus = Literal["active", "archived"]


class NutritionPlanCreateFromRecommendation(BaseModel):
    recommendation_id: str


class NutritionPlan(BaseModel):
    plan_id: str
    patient_id: str
    recommendation_id: str
    title: str
    focus: str
    status: NutritionPlanStatus = "active"
    weekly_plan: WeeklyPlanRecommendation
    adjustments: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
