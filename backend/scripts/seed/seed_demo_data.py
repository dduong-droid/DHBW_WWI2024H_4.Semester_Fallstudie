"""Seed stable demo data for the Food 4 Recovery backend MVP."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from fastapi import HTTPException

from app.db.session import init_db
from app.modules.nutrition_assessment.service import create_assessment_for_patient
from app.modules.nutrition_plan.schemas import NutritionPlanCreateFromRecommendation
from app.modules.nutrition_plan.service import create_nutrition_plan_from_recommendation
from app.modules.patient_profile.schemas import PatientProfileCreate
from app.modules.patient_profile.service import create_patient_profile, delete_patient_data
from app.modules.professional_review.repository import list_reviews_for_patient
from app.modules.questionnaire_intake.schemas import (
    ActivityAndMovement,
    BodyMeasurements,
    EatingHabits,
    GoalsAndExpectations,
    GutHealth,
    MedicationAndSupplements,
    NutritionStatus,
    PersonalAndBodyData,
    QuestionnaireIntakeCreate,
    RecoveryIndicators,
    SupplementEntry,
)
from app.modules.questionnaire_intake.service import create_questionnaire_intake
from app.modules.recommendation_engine.schemas import RecommendationAnalyzeRequest
from app.modules.recommendation_engine.service import analyze_recommendation
from app.modules.safety_check.schemas import SafetyCheckRequest
from app.modules.safety_check.service import run_safety_check
from app.modules.shopping_list.schemas import ShoppingListCreateFromPlan
from app.modules.shopping_list.service import create_shopping_list_from_plan


def _profile(
    *,
    patient_id: str,
    first_name: str,
    known_conditions: list[str],
    allergies: list[str] | None = None,
    support_at_home: str = "partial_support",
) -> PatientProfileCreate:
    return PatientProfileCreate(
        patient_id=patient_id,
        first_name=first_name,
        last_name="Demo",
        birth_date="1962-03-15",
        gender="female",
        email=f"{patient_id}@example.com",
        phone="+49123456789",
        height_cm=168,
        weight_kg=72,
        activity_level="low",
        support_at_home=support_at_home,
        known_conditions=known_conditions,
        medical_context="postoperative Nachsorge nach Entlassung",
        surgery_type="Hueft-OP",
        discharge_date="2026-04-20",
        therapy_phase="post_discharge",
        allergies=allergies or [],
        dietary_preferences=["balanced", "easy_prep"],
        consent_data_processing=True,
        notes="Demo-Profil fuer die Fallstudie.",
    )


def _intake(
    *,
    patient_id: str,
    appetite_level: str = "reduced",
    intake_change: str = "slightly_less",
    meals_per_day: int = 3,
    eating_difficulties: list[str] | None = None,
    digestive_symptoms: list[str] | None = None,
    food_intolerances: list[str] | None = None,
    can_cook: bool = False,
    receives_support: bool = True,
    fluid_ml: int = 1600,
    fatigue_level: str = "moderate",
    additional_notes: str | None = None,
) -> QuestionnaireIntakeCreate:
    return QuestionnaireIntakeCreate(
        patient_id=patient_id,
        personal_and_body_data=PersonalAndBodyData(
            first_name="Demo",
            last_name="Patient",
            birth_date="1962-03-15",
            phone="+49123456789",
            email=f"{patient_id}@example.com",
            profession="Rentnerin",
            height_cm=168,
            weight_kg=70,
            measurements=BodyMeasurements(),
        ),
        activity_and_movement=ActivityAndMovement(
            daily_steps=1500,
            sports_per_week=0,
            sports_description="Postoperativ eingeschraenkt",
        ),
        medication_and_supplements=MedicationAndSupplements(
            medications=["Schmerzmittel nach Entlassplan"],
            supplements=[SupplementEntry(name="Vitamin D", dosage="1000 IE")],
        ),
        gut_health=GutHealth(
            last_antibiotic_date="2026-04-18",
            antibiotic_duration_days=5,
            food_intolerances=food_intolerances or [],
        ),
        nutrition_status=NutritionStatus(
            appetite_level=appetite_level,
            intake_change_vs_past=intake_change,
            meals_per_day=meals_per_day,
            eating_difficulties=eating_difficulties or [],
            digestive_symptoms=digestive_symptoms or [],
        ),
        eating_habits=EatingHabits(
            typical_day_summary="Kleine Mahlzeiten, wenig Energie zum Kochen.",
            preferred_foods=["Reis", "Gemuese", "Huhn"],
            disliked_foods=["scharfe Speisen"],
            diet_style="mixed",
            diet_style_notes=None,
            cultural_requirements=None,
            can_cook=can_cook,
            receives_support_for_cooking=receives_support,
            fluid_intake_ml_per_day=fluid_ml,
            alcohol_notes="kein Alkohol im Demo-Fall",
            smoking_status="no",
        ),
        recovery_indicators=RecoveryIndicators(
            infections_last_year=1,
            wound_healing_issues=True,
            fatigue_level=fatigue_level,
            sleep_quality="variable",
        ),
        goals_and_expectations=GoalsAndExpectations(
            goals=["wundheilung", "gewicht_stabilisieren", "alltagstauglich_essen"],
            expectation_notes="Konkreter Plan fuer die erste Woche nach Entlassung.",
        ),
        additional_notes=additional_notes or "Demo-Intake fuer strukturierten Nachsorgeflow.",
    )


PERSONAS = {
    "demo_maria_post_op": {
        "profile": _profile(
            patient_id="demo_maria_post_op",
            first_name="Maria",
            known_conditions=["post_op_recovery"],
        ),
        "intake": _intake(patient_id="demo_maria_post_op"),
        "safety_meal_kits": ["produktdetails_wundheilungs_box"],
    },
    "demo_schluckproblem_review": {
        "profile": _profile(
            patient_id="demo_schluckproblem_review",
            first_name="Helga",
            known_conditions=["post_op_recovery"],
            support_at_home="partial_support",
        ),
        "intake": _intake(
            patient_id="demo_schluckproblem_review",
            appetite_level="minimal",
            intake_change="significantly_less",
            meals_per_day=1,
            eating_difficulties=["schluckprobleme"],
            fluid_ml=900,
            additional_notes="Schluckprobleme seit Entlassung, fachliche Pruefung erforderlich.",
        ),
        "safety_meal_kits": ["produktdetails_wundheilungs_box"],
    },
    "demo_allergy_safety": {
        "profile": _profile(
            patient_id="demo_allergy_safety",
            first_name="Nina",
            known_conditions=["post_op_recovery"],
            allergies=["nuts"],
        ),
        "intake": _intake(
            patient_id="demo_allergy_safety",
            food_intolerances=["gluten"],
            digestive_symptoms=["durchfall"],
            fatigue_level="high",
        ),
        "safety_meal_kits": ["produktdetails_immun_boost_box"],
    },
}


def _reset_patient(patient_id: str) -> None:
    try:
        delete_patient_data(patient_id)
    except HTTPException as exc:
        if exc.status_code != 404:
            raise


def seed_persona(patient_id: str, *, reset: bool) -> dict[str, object]:
    persona = PERSONAS[patient_id]
    _reset_patient(patient_id)

    profile = create_patient_profile(persona["profile"])
    intake = create_questionnaire_intake(persona["intake"])
    assessment = create_assessment_for_patient(profile.patient_id)
    recommendation = analyze_recommendation(RecommendationAnalyzeRequest(intake_id=intake.intake_id))
    plan = create_nutrition_plan_from_recommendation(
        NutritionPlanCreateFromRecommendation(recommendation_id=recommendation.recommendation_id)
    )
    shopping_list = create_shopping_list_from_plan(ShoppingListCreateFromPlan(nutrition_plan_id=plan.plan_id))
    safety = run_safety_check(
        SafetyCheckRequest(
            patient_id=profile.patient_id,
            recommendation_id=recommendation.recommendation_id,
            meal_kit_ids=persona["safety_meal_kits"],
        )
    )
    open_reviews = [review for review in list_reviews_for_patient(profile.patient_id) if review.status == "pending"]

    return {
        "patient_id": profile.patient_id,
        "intake_id": intake.intake_id,
        "assessment_id": assessment.assessment_id,
        "recommendation_id": recommendation.recommendation_id,
        "plan_id": plan.plan_id,
        "plan_status": plan.status,
        "shopping_list_id": shopping_list.shopping_list_id,
        "safety_status": safety.status,
        "safety_review_id": safety.review_id,
        "open_review_ids": [review.review_id for review in open_reviews],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed Food 4 Recovery demo personas.")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Compatibility flag: demo persona data is always rebuilt before seeding.",
    )
    args = parser.parse_args()

    init_db()
    result = {patient_id: seed_persona(patient_id, reset=args.reset) for patient_id in PERSONAS}
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
