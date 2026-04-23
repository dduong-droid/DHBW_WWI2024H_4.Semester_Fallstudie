"""Questionnaire intake service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.patient_profile.service import get_patient_profile_or_404
from app.modules.questionnaire_intake.repository import get_questionnaire, save_questionnaire
from app.modules.questionnaire_intake.schemas import (
    DerivedFlags,
    QuestionnaireContent,
    QuestionnaireIntakeCreate,
    QuestionnaireIntakeRecord,
)


def derive_flags(
    *,
    known_conditions: list[str],
    support_at_home: str,
    questionnaire: QuestionnaireContent,
) -> DerivedFlags:
    normalized_conditions = {item.lower() for item in known_conditions}
    goals = " ".join(questionnaire.goals_and_expectations.goals).lower()
    eating_difficulties = {item.lower() for item in questionnaire.nutrition_status.eating_difficulties}
    digestive_symptoms = {item.lower() for item in questionnaire.nutrition_status.digestive_symptoms}
    intolerances = {item.lower() for item in questionnaire.gut_health.food_intolerances}
    intake_change = questionnaire.nutrition_status.intake_change_vs_past
    infections_last_year = questionnaire.recovery_indicators.infections_last_year
    fluid_intake = questionnaire.eating_habits.fluid_intake_ml_per_day

    post_op_recovery = "post_op_recovery" in normalized_conditions or questionnaire.recovery_indicators.wound_healing_issues
    oncology_context = any(
        marker in normalized_conditions
        for marker in {"chemotherapy_support", "onko_support", "oncology_support", "cancer_support"}
    )
    appetite_low = questionnaire.nutrition_status.appetite_level in {"reduced", "minimal"} or intake_change == "significantly_less"
    chemo_related_appetite_loss = oncology_context and appetite_low
    gut_sensitivity = bool(digestive_symptoms or intolerances or questionnaire.gut_health.last_antibiotic_date)
    high_fatigue = questionnaire.recovery_indicators.fatigue_level in {"moderate", "high"}
    needs_easy_prep = high_fatigue or support_at_home != "independent" or not questionnaire.eating_habits.can_cook
    high_protein_need = post_op_recovery or "protein" in goals or "genesung" in goals or "wundheil" in goals
    anti_inflammatory_focus = post_op_recovery or "entz" in goals or "schmerzen" in goals or infections_last_year >= 2
    immune_focus = infections_last_year >= 3 or "immun" in goals
    energy_support = high_fatigue or appetite_low or "leistung" in goals or "energie" in goals or fluid_intake < 1500

    if "geschmacksveranderungen" in eating_difficulties:
        chemo_related_appetite_loss = chemo_related_appetite_loss or oncology_context

    return DerivedFlags(
        post_op_recovery=post_op_recovery,
        chemo_related_appetite_loss=chemo_related_appetite_loss,
        gut_sensitivity=gut_sensitivity,
        high_fatigue=high_fatigue,
        needs_easy_prep=needs_easy_prep,
        high_protein_need=high_protein_need,
        anti_inflammatory_focus=anti_inflammatory_focus,
        immune_focus=immune_focus,
        oncology_context=oncology_context,
        energy_support=energy_support,
    )


def create_questionnaire_intake(payload: QuestionnaireIntakeCreate) -> QuestionnaireIntakeRecord:
    profile = get_patient_profile_or_404(payload.patient_id)
    questionnaire_content = QuestionnaireContent(**payload.model_dump(exclude={"patient_id"}))
    record = QuestionnaireIntakeRecord(
        intake_id=f"intake_{uuid4().hex[:10]}",
        patient_id=payload.patient_id,
        created_at=datetime.now(timezone.utc),
        derived_flags=derive_flags(
            known_conditions=profile.known_conditions,
            support_at_home=profile.support_at_home,
            questionnaire=questionnaire_content,
        ),
        **questionnaire_content.model_dump(),
    )
    return save_questionnaire(record)


def get_questionnaire_or_404(intake_id: str) -> QuestionnaireIntakeRecord:
    record = get_questionnaire(intake_id)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Questionnaire intake '{intake_id}' was not found.",
        )
    return record
