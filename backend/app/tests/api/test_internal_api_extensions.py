from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.modules.frontend_bff.tracking_repository import clear_tracking_state
from app.modules.nutrition_plan.repository import clear_nutrition_plans
from app.modules.order_handling.repository import clear_orders
from app.modules.patient_profile.repository import clear_patient_profiles
from app.modules.questionnaire_intake.repository import clear_questionnaires
from app.modules.recommendation_engine.repository import clear_recommendations
from app.tests.helpers import build_patient_profile_create, build_questionnaire_content


client = TestClient(app)


def setup_function() -> None:
    clear_tracking_state()
    clear_orders()
    clear_nutrition_plans()
    clear_recommendations()
    clear_questionnaires()
    clear_patient_profiles()


def _create_profile(*, patient_id: str = "patient_internal", allergies: list[str] | None = None) -> str:
    response = client.post(
        "/api/patient-profile",
        json=build_patient_profile_create(
            patient_id=patient_id,
            known_conditions=["post_op_recovery"],
            allergies=allergies or [],
        ).model_dump(mode="json"),
    )
    assert response.status_code == 200
    return response.json()["patient_id"]


def _create_intake(
    patient_id: str,
    *,
    goals: list[str] | None = None,
    fatigue_level: str = "moderate",
    food_intolerances: list[str] | None = None,
) -> str:
    payload = build_questionnaire_content(
        goals=goals or ["wundheilung"],
        fatigue_level=fatigue_level,
        food_intolerances=food_intolerances or [],
    ).model_dump(mode="json")
    payload["patient_id"] = patient_id
    response = client.post("/api/questionnaire-intake", json=payload)
    assert response.status_code == 200
    return response.json()["intake_id"]


def _create_recommendation(intake_id: str) -> dict[str, object]:
    response = client.post("/api/recommendations/analyze", json={"intake_id": intake_id})
    assert response.status_code == 200
    return response.json()


def test_nutrition_plan_can_be_created_loaded_and_reused_from_recommendation() -> None:
    patient_id = _create_profile()
    intake_id = _create_intake(patient_id)
    recommendation = _create_recommendation(intake_id)

    create_response = client.post(
        "/api/nutrition-plans/from-recommendation",
        json={"recommendation_id": recommendation["recommendation_id"]},
    )
    duplicate_response = client.post(
        "/api/nutrition-plans/from-recommendation",
        json={"recommendation_id": recommendation["recommendation_id"]},
    )
    assert create_response.status_code == 200
    assert duplicate_response.status_code == 200

    plan = create_response.json()
    duplicate_plan = duplicate_response.json()
    assert duplicate_plan["plan_id"] == plan["plan_id"]
    assert plan["patient_id"] == patient_id
    assert plan["recommendation_id"] == recommendation["recommendation_id"]
    assert plan["weekly_plan"]["template_id"] == recommendation["recommended_weekly_plan"]["template_id"]

    by_id_response = client.get(f"/api/nutrition-plans/{plan['plan_id']}")
    latest_response = client.get(f"/api/nutrition-plans/patient/{patient_id}/latest")
    assert by_id_response.status_code == 200
    assert latest_response.status_code == 200
    assert latest_response.json()["plan_id"] == plan["plan_id"]


def test_safety_check_blocks_contraindicated_meal_kit_and_warns_for_plan_conflicts() -> None:
    patient_id = _create_profile(patient_id="patient_safety", allergies=["nuts", "gluten"])
    intake_id = _create_intake(patient_id, goals=["energie"], fatigue_level="high")
    recommendation = _create_recommendation(intake_id)

    response = client.post(
        "/api/safety-check",
        json={
            "patient_id": patient_id,
            "meal_kit_ids": ["produktdetails_immun_boost_box"],
            "recommendation_id": recommendation["recommendation_id"],
        },
    )
    assert response.status_code == 200
    payload = response.json()

    assert payload["status"] == "blocked"
    assert payload["blocked_meal_kits"][0]["meal_kit_id"] == "produktdetails_immun_boost_box"
    assert payload["checked_meal_kits"] == ["produktdetails_immun_boost_box"]
    assert payload["checked_recipe_ids"]
    assert any("gluten" in warning["conflicts"] for warning in payload["warnings"])


def test_recommendation_explanation_exposes_scores_flags_and_rationale() -> None:
    patient_id = _create_profile()
    intake_id = _create_intake(patient_id, goals=["wundheilung", "protein"])
    recommendation = _create_recommendation(intake_id)

    response = client.get(f"/api/recommendations/{recommendation['recommendation_id']}/explanation")
    assert response.status_code == 200
    explanation = response.json()

    assert explanation["recommendation_id"] == recommendation["recommendation_id"]
    assert explanation["selected_template_id"] == recommendation["recommended_weekly_plan"]["template_id"]
    assert "post_op_high_protein" in explanation["template_scores"]
    assert explanation["derived_flags"]["post_op_recovery"] is True
    assert explanation["meal_kit_scores"]
    assert explanation["meal_kit_scores"][0]["recommended"] is True
    assert explanation["final_rationale"]


def test_new_internal_endpoints_require_api_key_when_configured(monkeypatch) -> None:
    monkeypatch.setenv("API_KEY", "dev2-secret")

    no_key_plan = client.post("/api/nutrition-plans/from-recommendation", json={"recommendation_id": "rec_missing"})
    no_key_safety = client.post("/api/safety-check", json={"patient_id": "patient_missing"})
    no_key_explanation = client.get("/api/recommendations/rec_missing/explanation")

    assert no_key_plan.status_code == 401
    assert no_key_safety.status_code == 401
    assert no_key_explanation.status_code == 401
