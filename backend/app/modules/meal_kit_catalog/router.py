"""Meal kit catalog router."""

from fastapi import APIRouter

from app.modules.meal_kit_catalog.schemas import MealKit
from app.modules.meal_kit_catalog.service import get_active_meal_kits, get_meal_kit_or_404


router = APIRouter()


@router.get("/meal-kits", response_model=list[MealKit])
def list_catalog() -> list[MealKit]:
    return get_active_meal_kits()


@router.get("/meal-kits/{meal_kit_id}", response_model=MealKit)
def get_catalog_item(meal_kit_id: str) -> MealKit:
    return get_meal_kit_or_404(meal_kit_id)
