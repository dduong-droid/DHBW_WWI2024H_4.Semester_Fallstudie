"""Nutrition plan router."""

from fastapi import APIRouter

from app.modules.nutrition_plan.schemas import NutritionPlan, NutritionPlanCreateFromRecommendation
from app.modules.nutrition_plan.service import (
    create_nutrition_plan_from_recommendation,
    get_latest_nutrition_plan_for_patient_or_404,
    get_nutrition_plan_or_404,
)


router = APIRouter()


@router.post("/nutrition-plans/from-recommendation", response_model=NutritionPlan)
def create_from_recommendation(payload: NutritionPlanCreateFromRecommendation) -> NutritionPlan:
    return create_nutrition_plan_from_recommendation(payload)


@router.get("/nutrition-plans/patient/{patient_id}/latest", response_model=NutritionPlan)
def get_latest_plan_for_patient(patient_id: str) -> NutritionPlan:
    return get_latest_nutrition_plan_for_patient_or_404(patient_id)


@router.get("/nutrition-plans/{plan_id}", response_model=NutritionPlan)
def get_plan(plan_id: str) -> NutritionPlan:
    return get_nutrition_plan_or_404(plan_id)
