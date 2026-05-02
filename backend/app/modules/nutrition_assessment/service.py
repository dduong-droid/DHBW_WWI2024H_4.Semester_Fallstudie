"""Nutrition assessment service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.analytics.service import record_event
from app.modules.nutrition_assessment.repository import (
    get_latest_assessment_for_patient,
    save_assessment,
)
from app.modules.nutrition_assessment.schemas import NutritionAssessment, NutritionRiskStatus, RecommendationReadiness
from app.modules.patient_profile.service import get_patient_profile_or_404
from app.modules.risk_flags.schemas import RiskFlag
from app.modules.risk_flags.service import generate_and_store_risk_flags, latest_intake_for_patient


def _nutrition_status(flags: list[RiskFlag]) -> NutritionRiskStatus:
    if any(flag.type == "insufficient_data" for flag in flags):
        return "insufficientData"
    if any(flag.severity == "high" or flag.blocks_automatic_plan for flag in flags):
        return "highRisk"
    if any(flag.severity == "medium" for flag in flags):
        return "moderateRisk"
    return "lowRisk"


def _readiness(flags: list[RiskFlag]) -> RecommendationReadiness:
    if any(flag.type == "insufficient_data" for flag in flags):
        return "insufficientData"
    if any(flag.severity == "high" or flag.blocks_automatic_plan or flag.requires_professional_review for flag in flags):
        return "reviewRequired"
    return "ready"


def create_assessment_for_patient(patient_id: str) -> NutritionAssessment:
    profile = get_patient_profile_or_404(patient_id)
    intake = latest_intake_for_patient(patient_id)
    if intake is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No questionnaire intake found for patient '{patient_id}'.",
        )

    flags = generate_and_store_risk_flags(profile, intake)
    for flag in flags:
        record_event(
            "risk_flag_created",
            patient_id=patient_id,
            metadata={"risk_flag_id": flag.id, "type": flag.type, "severity": flag.severity},
        )
    main_problems = [flag.title for flag in flags if flag.severity in {"medium", "high"}]
    constraints = []
    if profile.allergies:
        constraints.append("Allergien: " + ", ".join(profile.allergies))
    if intake.gut_health.food_intolerances:
        constraints.append("Unverträglichkeiten: " + ", ".join(intake.gut_health.food_intolerances))
    if not intake.eating_habits.can_cook:
        constraints.append("Eingeschränkte Kochmöglichkeit")

    assessment = NutritionAssessment(
        assessment_id=f"assessment_{uuid4().hex[:10]}",
        patient_id=patient_id,
        intake_id=intake.intake_id,
        intake_summary={
            "appetite_level": intake.nutrition_status.appetite_level,
            "intake_change_vs_past": intake.nutrition_status.intake_change_vs_past,
            "meals_per_day": intake.nutrition_status.meals_per_day,
            "fluid_intake_ml_per_day": intake.eating_habits.fluid_intake_ml_per_day,
            "known_conditions": profile.known_conditions,
            "goals": intake.goals_and_expectations.goals,
        },
        nutrition_status=_nutrition_status(flags),
        main_problems=main_problems,
        relevant_constraints=constraints,
        risk_flags=flags,
        recommendation_readiness=_readiness(flags),
        generated_at=datetime.now(timezone.utc),
    )
    saved = save_assessment(assessment)
    record_event(
        "assessment_generated",
        patient_id=patient_id,
        metadata={"assessment_id": saved.assessment_id, "readiness": saved.recommendation_readiness},
    )
    if saved.recommendation_readiness == "reviewRequired":
        record_event("review_required", patient_id=patient_id, metadata={"source": "nutrition_assessment"})
    return saved


def get_latest_assessment_for_patient_or_404(patient_id: str) -> NutritionAssessment:
    assessment = get_latest_assessment_for_patient(patient_id)
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No nutrition assessment found for patient '{patient_id}'.",
        )
    return assessment
