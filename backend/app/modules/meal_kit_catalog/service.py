"""Meal kit catalog service."""

from __future__ import annotations

from fastapi import HTTPException, status

from app.modules.analytics.service import record_event
from app.modules.meal_kit_catalog.repository import get_meal_kit, list_meal_kits
from app.modules.meal_kit_catalog.schemas import MealKit
from app.modules.risk_flags.repository import list_risk_flags_for_patient
from app.modules.recommendation_engine.schemas import RecommendedMealKit


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


def suggest_meal_kits_for_patient(patient_id: str) -> list[RecommendedMealKit]:
    from app.modules.recommendation_engine.service import get_latest_recommendation_for_patient_or_404

    recommendation = get_latest_recommendation_for_patient_or_404(patient_id)
    high_risk = any(
        flag.severity == "high" or flag.blocks_automatic_plan
        for flag in list_risk_flags_for_patient(patient_id)
    )
    suggestions = recommendation.recommended_meal_kits
    for item in suggestions:
        record_event(
            "mealkit_suggested",
            patient_id=patient_id,
            metadata={"meal_kit_id": item.meal_kit_id, "high_risk_context": high_risk},
        )
    if high_risk:
        return [
            item.model_copy(
                update={
                    "rationale": item.rationale
                    + " Kritischer Fall: nicht als Shop-Handlungsaufforderung, sondern nur als mögliche Option nach Prüfung anzeigen."
                }
            )
            for item in suggestions
        ]
    return suggestions
