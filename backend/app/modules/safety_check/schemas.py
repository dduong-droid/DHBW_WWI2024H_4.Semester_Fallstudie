"""Safety check schemas."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


SafetyStatus = Literal["clear", "warning", "blocked"]


class SafetyCheckRequest(BaseModel):
    patient_id: str
    meal_kit_ids: list[str] = Field(default_factory=list)
    recommendation_id: str | None = None


class SafetyBlockedMealKit(BaseModel):
    meal_kit_id: str
    name: str
    reasons: list[str] = Field(default_factory=list)


class SafetyWarning(BaseModel):
    code: str
    message: str
    item_id: str | None = None
    conflicts: list[str] = Field(default_factory=list)


class SafetyCheckResponse(BaseModel):
    status: SafetyStatus
    blocked_meal_kits: list[SafetyBlockedMealKit] = Field(default_factory=list)
    warnings: list[SafetyWarning] = Field(default_factory=list)
    checked_meal_kits: list[str] = Field(default_factory=list)
    checked_recipe_ids: list[str] = Field(default_factory=list)
    review_required: bool = False
    review_id: str | None = None
