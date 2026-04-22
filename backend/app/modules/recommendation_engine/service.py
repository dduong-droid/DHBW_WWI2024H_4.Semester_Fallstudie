"""Recommendation engine service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.meal_kit_catalog.service import get_active_meal_kits
from app.modules.patient_profile.service import create_patient_profile, get_patient_profile_or_404
from app.modules.questionnaire_intake.schemas import QuestionnaireContent, QuestionnaireIntakeCreate, QuestionnaireIntakeRecord
from app.modules.questionnaire_intake.service import create_questionnaire_intake, derive_flags, get_questionnaire_or_404
from app.modules.recommendation_engine.repository import get_recommendation, save_recommendation
from app.modules.recommendation_engine.rules import build_weekly_plan, choose_template_id, score_meal_kit
from app.modules.recommendation_engine.schemas import RecommendationAnalyzeRequest, RecommendationResult, RecommendedMealKit
from app.modules.recommendation_engine.templates import build_detected_needs, build_rationale_lines, build_summary


def _merge_allergy_filters(profile_allergies: list[str], questionnaire: QuestionnaireIntakeRecord) -> list[str]:
    merged = {item.lower() for item in profile_allergies}
    merged.update(item.lower() for item in questionnaire.gut_health.food_intolerances)
    return sorted(merged)


def _build_recommendation_from_inputs(patient_id: str, questionnaire: QuestionnaireIntakeRecord) -> RecommendationResult:
    profile = get_patient_profile_or_404(patient_id)
    flags = questionnaire.derived_flags
    template_id = choose_template_id(flags)
    dietary_warnings = _merge_allergy_filters(profile.allergies, questionnaire)

    kit_candidates: list[RecommendedMealKit] = []
    for meal_kit in get_active_meal_kits():
        contraindication_hit = set(item.lower() for item in meal_kit.contraindications) & set(dietary_warnings)
        if contraindication_hit:
            continue
        score = score_meal_kit(meal_kit, flags)
        if score <= 0:
            continue
        kit_candidates.append(
            RecommendedMealKit(
                meal_kit_id=meal_kit.id,
                name=meal_kit.name,
                score=score,
                rationale=f"{meal_kit.name} passt zum aktuellen Profil durch {', '.join(meal_kit.recommended_for[:2])}.",
            )
        )

    kit_candidates.sort(key=lambda item: item.score, reverse=True)
    top_kit_names = [item.name for item in kit_candidates[:3]]
    weekly_plan = build_weekly_plan(template_id, flags=flags, questionnaire=questionnaire)
    result = RecommendationResult(
        recommendation_id=f"rec_{uuid4().hex[:10]}",
        patient_id=patient_id,
        created_at=datetime.now(timezone.utc),
        summary=build_summary(flags),
        priority_goals=questionnaire.goals_and_expectations.goals,
        detected_needs=build_detected_needs(flags),
        recommended_meal_kits=kit_candidates[:3],
        recommended_weekly_plan=weekly_plan,
        dietary_warnings=dietary_warnings,
        rationale=build_rationale_lines(flags, top_kit_names, dietary_warnings),
    )
    return save_recommendation(result)


def analyze_recommendation(payload: RecommendationAnalyzeRequest) -> RecommendationResult:
    if payload.intake_id:
        intake = get_questionnaire_or_404(payload.intake_id)
        return _build_recommendation_from_inputs(intake.patient_id, intake)

    if payload.patient_profile is None or payload.questionnaire is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either intake_id or both patient_profile and questionnaire.",
        )

    profile = create_patient_profile(payload.patient_profile)
    questionnaire = create_questionnaire_intake(
        QuestionnaireIntakeCreate(
            patient_id=profile.patient_id,
            **payload.questionnaire.dict(),
        )
    )
    return _build_recommendation_from_inputs(profile.patient_id, questionnaire)


def get_recommendation_or_404(recommendation_id: str) -> RecommendationResult:
    record = get_recommendation(recommendation_id)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recommendation '{recommendation_id}' was not found.",
        )
    return record
