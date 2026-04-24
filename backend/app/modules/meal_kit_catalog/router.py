"""Meal kit catalog router."""

from fastapi import APIRouter, Depends

from app.core.security import require_api_key
from app.modules.meal_kit_catalog.schemas import MealKit
from app.modules.meal_kit_catalog.service import get_active_meal_kits, get_meal_kit_or_404, suggest_meal_kits_for_patient
from app.modules.recommendation_engine.schemas import RecommendedMealKit


router = APIRouter()


@router.get("/meal-kits", response_model=list[MealKit])
def list_catalog() -> list[MealKit]:
    return get_active_meal_kits()


@router.get("/meal-kits/{meal_kit_id}", response_model=MealKit)
def get_catalog_item(meal_kit_id: str) -> MealKit:
    return get_meal_kit_or_404(meal_kit_id)


@router.get(
    "/patients/{patient_id}/meal-kit-suggestions",
    response_model=list[RecommendedMealKit],
    dependencies=[Depends(require_api_key)],
)
def get_patient_meal_kit_suggestions(patient_id: str) -> list[RecommendedMealKit]:
    return suggest_meal_kits_for_patient(patient_id)
