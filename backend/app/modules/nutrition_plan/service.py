"""Nutrition plan service."""

from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.modules.analytics.service import record_event
from app.modules.nutrition_assessment.repository import get_latest_assessment_for_patient
from app.modules.nutrition_assessment.service import create_assessment_for_patient
from app.modules.nutrition_plan.repository import (
    get_latest_nutrition_plan_for_patient,
    get_nutrition_plan,
    get_nutrition_plan_by_recommendation,
    save_nutrition_plan,
)
from app.modules.nutrition_plan.schemas import NutritionPlan, NutritionPlanCreateFromRecommendation
from app.modules.professional_review.service import create_review_if_missing
from app.modules.recommendation_engine.service import (
    get_latest_recommendation_for_patient_or_404,
    get_recommendation_or_404,
)


def _daily_meals(plan: NutritionPlan) -> list[dict[str, object]]:
    meals: list[dict[str, object]] = []
    for day in plan.weekly_plan.days:
        meals.append(
            {
                "day": day.day,
                "breakfast": day.meals.breakfast.name,
                "lunch": day.meals.lunch.name,
                "dinner": day.meals.dinner.name,
                "snacks": [snack.name for snack in day.meals.snacks],
                "hydration_hint": plan.hydration_hint,
                "daily_note": "Alltagstauglich umsetzen; bei Beschwerden oder Unsicherheit fachlich rueckfragen.",
            }
        )
    return meals


def _status_from_assessment(patient_id: str) -> tuple[str, list[str], list[str]]:
    assessment = get_latest_assessment_for_patient(patient_id)
    if assessment is None:
        try:
            assessment = create_assessment_for_patient(patient_id)
        except HTTPException:
            return "draft", [], ["Assessment fehlt; Plan ist nur ein allgemeiner Entwurf."]

    linked_flags = [flag.id for flag in assessment.risk_flags]
    safety_notes = [flag.recommended_action for flag in assessment.risk_flags if flag.severity in {"medium", "high"}]
    if assessment.recommendation_readiness == "insufficientData":
        return "blocked", linked_flags, safety_notes
    if assessment.recommendation_readiness == "reviewRequired":
        return "review_required", linked_flags, safety_notes
    return "draft", linked_flags, safety_notes


def create_nutrition_plan_from_recommendation(payload: NutritionPlanCreateFromRecommendation) -> NutritionPlan:
    existing_plan = get_nutrition_plan_by_recommendation(payload.recommendation_id)
    if existing_plan is not None:
        return existing_plan

    recommendation = get_recommendation_or_404(payload.recommendation_id)
    weekly_plan = recommendation.recommended_weekly_plan
    plan_status, linked_flags, safety_notes = _status_from_assessment(recommendation.patient_id)
    plan = NutritionPlan(
        id=f"plan_{payload.recommendation_id}",
        plan_id=f"plan_{payload.recommendation_id}",
        patient_id=recommendation.patient_id,
        recommendation_id=recommendation.recommendation_id,
        title=weekly_plan.title,
        focus=weekly_plan.focus,
        status=plan_status,
        weekly_plan=weekly_plan,
        hydration_hint="Ziel: regelmaessig trinken; bei Durchfall, Erbrechen oder Schluckproblemen fachlich rueckfragen.",
        preparation_complexity="low" if "Einfach vorzubereitende Mahlzeiten wurden bevorzugt." in weekly_plan.adjustments else "medium",
        rationale=recommendation.rationale,
        safety_notes=safety_notes,
        linked_risk_flags=linked_flags,
        adjustments=weekly_plan.adjustments,
        created_at=datetime.now(timezone.utc),
    )
    plan = plan.model_copy(update={"daily_meals": _daily_meals(plan)})
    saved = save_nutrition_plan(plan)
    record_event(
        "plan_generated",
        patient_id=saved.patient_id,
        metadata={"plan_id": saved.plan_id, "status": saved.status, "recommendation_id": saved.recommendation_id},
    )
    if saved.status in {"review_required", "blocked"}:
        record_event("plan_blocked", patient_id=saved.patient_id, metadata={"plan_id": saved.plan_id, "status": saved.status})
        create_review_if_missing(
            patient_id=saved.patient_id,
            plan_id=saved.plan_id,
            source="nutrition_plan",
            risk_flag_ids=saved.linked_risk_flags,
        )
    return saved


def create_nutrition_plan_for_patient(patient_id: str) -> NutritionPlan:
    recommendation = get_latest_recommendation_for_patient_or_404(patient_id)
    return create_nutrition_plan_from_recommendation(
        NutritionPlanCreateFromRecommendation(recommendation_id=recommendation.recommendation_id)
    )


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
