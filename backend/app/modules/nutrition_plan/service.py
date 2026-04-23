"""Nutrition plan service."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.modules.nutrition_plan.repository import (
    get_latest_nutrition_plan_for_patient,
    get_nutrition_plan,
    get_nutrition_plan_by_recommendation,
    save_nutrition_plan,
)
from app.modules.nutrition_plan.schemas import NutritionPlan, NutritionPlanCreateFromRecommendation
from app.modules.recommendation_engine.service import get_recommendation_or_404


def create_nutrition_plan_from_recommendation(payload: NutritionPlanCreateFromRecommendation) -> NutritionPlan:
    existing_plan = get_nutrition_plan_by_recommendation(payload.recommendation_id)
    if existing_plan is not None:
        return existing_plan

    recommendation = get_recommendation_or_404(payload.recommendation_id)
    weekly_plan = recommendation.recommended_weekly_plan
    plan = NutritionPlan(
        plan_id=f"plan_{payload.recommendation_id}",
        patient_id=recommendation.patient_id,
        recommendation_id=recommendation.recommendation_id,
        title=weekly_plan.title,
        focus=weekly_plan.focus,
        status="active",
        weekly_plan=weekly_plan,
        adjustments=weekly_plan.adjustments,
        created_at=datetime.now(timezone.utc),
    )
    return save_nutrition_plan(plan)


def get_nutrition_plan_or_404(plan_id: str) -> NutritionPlan:
    plan = get_nutrition_plan(plan_id)
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Nutrition plan '{plan_id}' was not found.",
        )
    return plan


def get_latest_nutrition_plan_for_patient_or_404(patient_id: str) -> NutritionPlan:
    plan = get_latest_nutrition_plan_for_patient(patient_id)
    if plan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No nutrition plan found for patient '{patient_id}'.",
        )
    return plan
