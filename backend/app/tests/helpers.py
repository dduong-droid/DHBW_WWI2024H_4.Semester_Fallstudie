from __future__ import annotations

from datetime import datetime, timezone

from app.modules.patient_profile.schemas import PatientProfileCreate
from app.modules.questionnaire_intake.schemas import (
    ActivityAndMovement,
    BodyMeasurements,
    EatingHabits,
    GoalsAndExpectations,
    GutHealth,
    MedicationAndSupplements,
    PersonalAndBodyData,
    QuestionnaireContent,
    QuestionnaireIntakeRecord,
    RecoveryIndicators,
    SupplementEntry,
)


def build_patient_profile_create(
    *,
    patient_id: str | None = None,
    known_conditions: list[str] | None = None,
    allergies: list[str] | None = None,
    support_at_home: str = "partial_support",
) -> PatientProfileCreate:
    return PatientProfileCreate(
        patient_id=patient_id,
        first_name="Maria",
        last_name="Muster",
        birth_date="1962-03-15",
        email="maria@example.com",
        phone="+49123456789",
        height_cm=168,
        weight_kg=71,
        activity_level="low",
        support_at_home=support_at_home,
        known_conditions=known_conditions or ["post_op_recovery"],
        allergies=allergies or [],
        dietary_preferences=["balanced"],
        notes="Testprofil",
    )


def build_questionnaire_content(
    *,
    appetite_level: str = "good",
    digestive_symptoms: list[str] | None = None,
    food_intolerances: list[str] | None = None,
    goals: list[str] | None = None,
    fatigue_level: str = "moderate",
    can_cook: bool = False,
    receives_support_for_cooking: bool = True,
) -> QuestionnaireContent:
    return QuestionnaireContent(
        personal_and_body_data=PersonalAndBodyData(
            first_name="Maria",
            last_name="Muster",
            birth_date="1962-03-15",
            phone="+49123456789",
            email="maria@example.com",
            profession="Rentnerin",
            height_cm=168,
            weight_kg=71,
            measurements=BodyMeasurements(),
        ),
        activity_and_movement=ActivityAndMovement(
            daily_steps=1800,
            sports_per_week=0,
            sports_description="Keine",
        ),
        medication_and_supplements=MedicationAndSupplements(
            medications=["Schmerzmittel"],
            supplements=[SupplementEntry(name="Vitamin D", dosage="1000 IE")],
        ),
        gut_health=GutHealth(
            last_antibiotic_date="2025-02-10",
            antibiotic_duration_days=7,
            food_intolerances=food_intolerances or [],
        ),
        nutrition_status={
            "appetite_level": appetite_level,
            "intake_change_vs_past": "significantly_less" if appetite_level in {"reduced", "minimal"} else "same",
            "meals_per_day": 3,
            "eating_difficulties": ["uebelkeit"] if appetite_level in {"reduced", "minimal"} else [],
            "digestive_symptoms": digestive_symptoms or [],
        },
        eating_habits=EatingHabits(
            typical_day_summary="Drei kleine Mahlzeiten.",
            preferred_foods=["Reis", "Gemuese"],
            disliked_foods=["Scharf"],
            diet_style="mixed",
            diet_style_notes=None,
            cultural_requirements=None,
            can_cook=can_cook,
            receives_support_for_cooking=receives_support_for_cooking,
            fluid_intake_ml_per_day=1600,
            alcohol_notes="selten",
            smoking_status="no",
        ),
        recovery_indicators=RecoveryIndicators(
            infections_last_year=1,
            wound_healing_issues="wundheilung" in " ".join(goals or []).lower(),
            fatigue_level=fatigue_level,
            sleep_quality="variable",
        ),
        goals_and_expectations=GoalsAndExpectations(
            goals=goals or ["wundheilung", "bessere_genesung"],
            expectation_notes="Bessere Orientierung im Alltag",
        ),
        additional_notes="Testintake",
    )


def build_questionnaire_record(
    *,
    patient_id: str = "patient_test",
    intake_id: str = "intake_test",
    questionnaire: QuestionnaireContent | None = None,
    derived_flags: dict[str, bool] | None = None,
) -> QuestionnaireIntakeRecord:
    questionnaire = questionnaire or build_questionnaire_content()
    return QuestionnaireIntakeRecord(
        intake_id=intake_id,
        patient_id=patient_id,
        derived_flags=derived_flags or {},
        created_at=datetime.now(timezone.utc),
        **questionnaire.model_dump(),
    )


def build_full_analyze_payload() -> dict[str, object]:
    return {
        "patientProfile": build_patient_profile_create(known_conditions=["chemotherapy_support"]).model_dump(mode="json"),
        "questionnaire": build_questionnaire_content(
            appetite_level="minimal",
            goals=["therapie_unterstuetzen", "gewicht_halten"],
            fatigue_level="moderate",
        ).model_dump(mode="json"),
    }
