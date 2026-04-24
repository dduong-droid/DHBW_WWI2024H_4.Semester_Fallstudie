from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.modules.analytics.repository import clear_events
from app.modules.frontend_bff.tracking_repository import clear_tracking_state
from app.modules.nutrition_assessment.repository import clear_assessments
from app.modules.nutrition_plan.repository import clear_nutrition_plans
from app.modules.order_handling.repository import clear_orders
from app.modules.patient_profile.repository import clear_patient_profiles
from app.modules.professional_review.repository import clear_reviews
from app.modules.questionnaire_intake.repository import clear_questionnaires
from app.modules.recommendation_engine.repository import clear_recommendations
from app.modules.risk_flags.repository import clear_risk_flags
from app.modules.shopping_list.repository import clear_shopping_lists
from app.modules.symptom_tracking.repository import clear_symptom_tracking
from app.modules.questionnaire_intake.schemas import DerivedFlags
from app.modules.recommendation_engine.rules import build_weekly_plan
from app.tests.helpers import build_patient_profile_create, build_questionnaire_content, build_questionnaire_record


client = TestClient(app)


def setup_function() -> None:
    clear_events()
    clear_symptom_tracking()
    clear_reviews()
    clear_shopping_lists()
    clear_tracking_state()
    clear_orders()
    clear_nutrition_plans()
    clear_recommendations()
    clear_assessments()
    clear_risk_flags()
    clear_questionnaires()
    clear_patient_profiles()


def _create_profile(patient_id: str, *, allergies: list[str] | None = None, weight_kg: float = 71) -> str:
    payload = build_patient_profile_create(
        patient_id=patient_id,
        allergies=allergies or [],
        known_conditions=["post_op_recovery"],
    ).model_dump(mode="json")
    payload["weight_kg"] = weight_kg
    response = client.post("/api/patients", json=payload)
    assert response.status_code == 200
    return response.json()["patient_id"]


def _create_intake(patient_id: str, **overrides: object) -> str:
    content = build_questionnaire_content().model_dump(mode="json")
    for key, value in overrides.items():
        section, field = key.split(".", 1)
        content[section][field] = value
    response = client.post(f"/api/patients/{patient_id}/intake", json=content)
    assert response.status_code == 200
    return response.json()["intake_id"]


def _create_recommendation(intake_id: str) -> dict[str, object]:
    response = client.post("/api/recommendations/analyze", json={"intake_id": intake_id})
    assert response.status_code == 200
    return response.json()


def test_allergy_excludes_conflicting_recipe_variants() -> None:
    patient_id = _create_profile("patient_recipe_allergy", allergies=["gluten"])
    intake_id = _create_intake(patient_id)
    recommendation = _create_recommendation(intake_id)

    first_breakfast = recommendation["recommended_weekly_plan"]["days"][0]["meals"]["breakfast"]

    assert first_breakfast["id"] == "po_b2"
    assert "gluten" not in first_breakfast["allergens"]


def test_recipe_matching_uses_safe_substitute_when_all_variants_conflict() -> None:
    questionnaire = build_questionnaire_record(
        derived_flags=DerivedFlags(high_fatigue=True, energy_support=True, needs_easy_prep=True).model_dump()
    )

    plan = build_weekly_plan(
        "energy_rebuild",
        flags=questionnaire.derived_flags,
        questionnaire=questionnaire,
        dietary_warnings=["gluten"],
    )
    snack = plan.days[0].meals.snacks[0]

    assert snack.id.endswith("_allergen_safe_substitute")
    assert "gluten" not in snack.allergens
    assert not {"hafer", "pasta", "gries", "polenta"} & {ingredient.lower() for ingredient in snack.ingredients}


def test_swallowing_problem_creates_high_risk_flag_and_review_required_plan() -> None:
    patient_id = _create_profile("patient_swallowing")
    intake_id = _create_intake(
        patient_id,
        **{
            "nutrition_status.eating_difficulties": ["schluckprobleme"],
        },
    )
    recommendation = _create_recommendation(intake_id)

    assessment_response = client.post(f"/api/patients/{patient_id}/assessment")
    plan_response = client.post(
        "/api/nutrition-plans/from-recommendation",
        json={"recommendation_id": recommendation["recommendation_id"]},
    )

    assert assessment_response.status_code == 200
    assert any(flag["type"] == "swallowing_problem" for flag in assessment_response.json()["risk_flags"])
    assert plan_response.status_code == 200
    assert plan_response.json()["status"] == "review_required"


def test_strong_weight_loss_and_insufficient_data_are_flagged() -> None:
    patient_id = _create_profile("patient_weight_loss", weight_kg=80)
    _create_intake(
        patient_id,
        **{
            "personal_and_body_data.weight_kg": 70,
            "eating_habits.fluid_intake_ml_per_day": 0,
        },
    )

    response = client.post(f"/api/patients/{patient_id}/assessment")
    payload = response.json()
    flag_types = {flag["type"] for flag in payload["risk_flags"]}

    assert response.status_code == 200
    assert "strong_weight_loss" in flag_types
    assert "insufficient_data" in flag_types
    assert payload["nutrition_status"] == "insufficientData"
    assert payload["recommendation_readiness"] == "insufficientData"


def test_shopping_list_tracking_mealkit_and_review_flow() -> None:
    patient_id = _create_profile("patient_full_mvp", allergies=["nuts"])
    intake_id = _create_intake(patient_id)
    recommendation = _create_recommendation(intake_id)
    plan_response = client.post(
        "/api/nutrition-plans/from-recommendation",
        json={"recommendation_id": recommendation["recommendation_id"]},
    )
    assert plan_response.status_code == 200
    plan = plan_response.json()

    shopping_response = client.post(f"/api/nutrition-plans/{plan['plan_id']}/shopping-list")
    tracking_response = client.post(
        f"/api/patients/{patient_id}/tracking",
        json={
            "date": "2026-04-24",
            "weight": 70,
            "appetite_score": 1,
            "meals_completed": 1,
            "fluid_intake_ml": 900,
            "nausea_score": 4,
            "pain_score": 3,
            "stool_issue": "durchfall",
            "notes": "deutlich schlechter",
        },
    )
    mealkit_response = client.get(f"/api/patients/{patient_id}/meal-kit-suggestions")
    review_response = client.post(
        "/api/professional-reviews",
        json={"patient_id": patient_id, "plan_id": plan["plan_id"], "source": "test", "risk_flag_ids": []},
    )
    approve_response = client.patch(
        f"/api/professional-reviews/{review_response.json()['review_id']}",
        json={
            "status": "approved",
            "reviewer_role": "nutritionist",
            "reviewer_name": "Demo Ernaehrungsberatung",
            "comments": "Mock-Freigabe fuer die Abgabe.",
        },
    )

    assert shopping_response.status_code == 200
    assert shopping_response.json()["items"]
    assert tracking_response.status_code == 200
    assert any(flag["type"] == "tracking_low_intake" for flag in tracking_response.json()["generated_risk_flags"])
    assert mealkit_response.status_code == 200
    assert all(item["meal_kit_id"] != "produktdetails_immun_boost_box" for item in mealkit_response.json())
    assert review_response.status_code == 200
    assert approve_response.status_code == 200
    assert approve_response.json()["status"] == "approved"

    approved_plan_response = client.get(f"/api/nutrition-plans/{plan['plan_id']}")
    assert approved_plan_response.json()["status"] == "approved_mock"


def test_analytics_summary_contains_mvp_events() -> None:
    patient_id = _create_profile("patient_analytics")
    intake_id = _create_intake(patient_id)
    recommendation = _create_recommendation(intake_id)
    client.post(f"/api/patients/{patient_id}/assessment")
    plan_response = client.post(
        "/api/nutrition-plans/from-recommendation",
        json={"recommendation_id": recommendation["recommendation_id"]},
    )
    client.post(f"/api/nutrition-plans/{plan_response.json()['plan_id']}/shopping-list")

    summary_response = client.get("/api/analytics/summary")
    funnel_response = client.get("/api/analytics/funnel")

    assert summary_response.status_code == 200
    assert summary_response.json()["events_by_type"]["intake_completed"] == 1
    assert summary_response.json()["plan_generated_count"] == 1
    assert funnel_response.status_code == 200
    assert funnel_response.json()["shopping_list_generated"] == 1


def test_analytics_rejects_events_for_unknown_patient() -> None:
    response = client.post(
        "/api/analytics/events",
        json={"event_type": "tracking_submitted", "patient_id": "patient_missing"},
    )

    assert response.status_code == 404


def test_professional_review_validates_plan_belongs_to_patient() -> None:
    patient_a = _create_profile("patient_review_a")
    patient_b = _create_profile("patient_review_b")
    intake_id = _create_intake(patient_a)
    recommendation = _create_recommendation(intake_id)
    plan_response = client.post(
        "/api/nutrition-plans/from-recommendation",
        json={"recommendation_id": recommendation["recommendation_id"]},
    )
    assert plan_response.status_code == 200

    missing_plan_response = client.post(
        "/api/professional-reviews",
        json={"patient_id": patient_a, "plan_id": "plan_missing", "source": "test"},
    )
    mismatched_plan_response = client.post(
        "/api/professional-reviews",
        json={"patient_id": patient_b, "plan_id": plan_response.json()["plan_id"], "source": "test"},
    )

    assert missing_plan_response.status_code == 404
    assert mismatched_plan_response.status_code == 400


def test_assessment_ids_do_not_collide_on_quick_repeated_generation() -> None:
    patient_id = _create_profile("patient_assessment_ids")
    _create_intake(patient_id)

    first_response = client.post(f"/api/patients/{patient_id}/assessment")
    second_response = client.post(f"/api/patients/{patient_id}/assessment")

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert first_response.json()["assessment_id"] != second_response.json()["assessment_id"]
