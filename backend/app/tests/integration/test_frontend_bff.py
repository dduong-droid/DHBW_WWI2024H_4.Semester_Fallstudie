from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.modules.frontend_bff.tracking_repository import clear_tracking_state
from app.modules.order_handling.repository import clear_orders
from app.modules.patient_profile.repository import clear_patient_profiles
from app.modules.questionnaire_intake.repository import clear_questionnaires
from app.modules.recommendation_engine.repository import clear_recommendations
from app.tests.helpers import build_full_analyze_payload


client = TestClient(app)


def setup_function() -> None:
    clear_tracking_state()
    clear_orders()
    clear_recommendations()
    clear_questionnaires()
    clear_patient_profiles()


def test_full_analyze_and_nutrition_plan_endpoints_return_frontend_contract() -> None:
    response = client.post("/api/frontend/intake/full-analyze", json=build_full_analyze_payload())
    assert response.status_code == 200
    payload = response.json()

    assert set(payload.keys()) == {
        "patientId",
        "intakeId",
        "recommendationId",
        "nutritionPlan",
        "recommendedMealKits",
        "summary",
        "rationale",
    }
    assert payload["nutritionPlan"]["userId"] == payload["patientId"]
    assert payload["nutritionPlan"]["weeklyPlan"][0]["meals"]["breakfast"]["macros"]["protein"] > 0
    assert payload["recommendedMealKits"]

    plan_response = client.get(f"/api/frontend/nutrition-plan/{payload['patientId']}")
    assert plan_response.status_code == 200
    assert plan_response.json()["id"] == payload["recommendationId"]


def test_frontend_shop_endpoints_return_inventory_and_detail_contracts() -> None:
    inventory_response = client.get("/api/frontend/shop/inventory")
    assert inventory_response.status_code == 200
    inventory = inventory_response.json()

    assert "availableMealKits" in inventory
    assert inventory["availableMealKits"]
    first_kit_id = inventory["availableMealKits"][0]["id"]

    detail_response = client.get(f"/api/frontend/shop/meal-kits/{first_kit_id}")
    assert detail_response.status_code == 200
    detail = detail_response.json()

    assert "imageUrl" in detail
    assert "nutritionalValues" in detail
    assert "dietaryTags" in detail


def test_frontend_curated_and_tracking_endpoints_follow_demo_flow() -> None:
    analyze_response = client.post("/api/frontend/intake/full-analyze", json=build_full_analyze_payload())
    assert analyze_response.status_code == 200
    patient_id = analyze_response.json()["patientId"]

    curated_response = client.get(f"/api/frontend/recipes/curated/{patient_id}")
    assert curated_response.status_code == 200
    curated_meals = curated_response.json()
    assert len(curated_meals) == 3
    assert "medicalBenefit" in curated_meals[0]

    daily_response = client.get(f"/api/frontend/tracking/daily/{patient_id}")
    assert daily_response.status_code == 200
    assert daily_response.json()["isMealBoxEaten"] is False

    track_response = client.post(f"/api/frontend/tracking/daily/{patient_id}/meal-box")
    assert track_response.status_code == 200
    assert track_response.json()["proteinPercent"] == 100

    hydration_response = client.get(f"/api/frontend/tracking/hydration/{patient_id}")
    assert hydration_response.status_code == 200
    assert hydration_response.json()["currentMl"] == 0

    add_water_response = client.post(
        f"/api/frontend/tracking/hydration/{patient_id}/water",
        json={"amountMl": 500},
    )
    assert add_water_response.status_code == 200
    assert add_water_response.json()["currentMl"] == 500


def test_frontend_tracking_rejects_unknown_patient_and_invalid_water_amount() -> None:
    missing_patient_response = client.post("/api/frontend/tracking/daily/unknown_patient/meal-box")
    assert missing_patient_response.status_code == 404
    assert missing_patient_response.json()["error"]["code"] == "not_found"

    analyze_response = client.post("/api/frontend/intake/full-analyze", json=build_full_analyze_payload())
    assert analyze_response.status_code == 200
    patient_id = analyze_response.json()["patientId"]

    invalid_water_response = client.post(
        f"/api/frontend/tracking/hydration/{patient_id}/water",
        json={"amountMl": 0},
    )
    assert invalid_water_response.status_code == 422
    assert invalid_water_response.json()["error"]["code"] == "validation_error"
