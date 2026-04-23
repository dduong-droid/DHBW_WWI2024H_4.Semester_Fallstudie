"""Meal kit catalog service."""

from __future__ import annotations

from fastapi import HTTPException, status

from app.modules.meal_kit_catalog.repository import get_meal_kit, list_meal_kits
from app.modules.meal_kit_catalog.schemas import MealKit


def get_active_meal_kits() -> list[MealKit]:
    return [kit for kit in list_meal_kits() if kit.is_active]


def get_meal_kit_or_404(meal_kit_id: str) -> MealKit:
    meal_kit = get_meal_kit(meal_kit_id)
    if meal_kit is None or not meal_kit.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meal kit '{meal_kit_id}' was not found.",
        )
    return meal_kit
