"""Meal kit catalog schemas."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


PrepDifficulty = Literal["easy", "moderate", "advanced"]


class NutritionalValues(BaseModel):
    calories: int = Field(ge=0)
    protein: int = Field(ge=0)
    carbs: int = Field(ge=0)
    fat: int = Field(ge=0)
    fiber: int = Field(ge=0)


class MealKit(BaseModel):
    id: str
    name: str
    description: str
    price: float = Field(gt=0)
    currency: str
    servings: int = Field(gt=0)
    nutritional_values: NutritionalValues
    dietary_tags: list[str] = Field(default_factory=list)
    condition_tags: list[str] = Field(default_factory=list)
    prep_difficulty: PrepDifficulty
    contraindications: list[str] = Field(default_factory=list)
    recommended_for: list[str] = Field(default_factory=list)
    meals: list[str] = Field(default_factory=list)
    image_url: str | None = None
    is_active: bool = True
