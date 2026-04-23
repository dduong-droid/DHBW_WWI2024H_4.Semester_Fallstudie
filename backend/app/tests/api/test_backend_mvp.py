from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.modules.order_handling.repository import clear_orders
from app.modules.patient_profile.repository import clear_patient_profiles
from app.modules.questionnaire_intake.repository import clear_questionnaires
from app.modules.recommendation_engine.repository import clear_recommendations


client = TestClient(app)


def setup_function() -> None:
    clear_orders()
    clear_recommendations()
    clear_questionnaires()
    clear_patient_profiles()


def create_patient_profile(*, known_conditions: list[str] | None = None, allergies: list[str] | None = None) -> dict:
    response = client.post(
        "/api/patient-profile",
        json={
            "first_name": "Maria",
            "last_name": "Muster",
            "birth_date": "1962-03-15",
            "email": "maria@example.com",
            "phone": "+49123456789",
            "height_cm": 168,
            "weight_kg": 71,
            "activity_level": "low",
            "support_at_home": "partial_support",
            "known_conditions": known_conditions or ["post_op_recovery"],
            "allergies": allergies or [],
            "dietary_preferences": ["balanced"],
            "notes": "Testprofil",
        },
    )
    assert response.status_code == 200
    return response.json()


def create_intake(patient_id: str, *, appetite_level: str, digestive_symptoms: list[str], goals: list[str], fatigue_level: str = "moderate") -> dict:
    response = client.post(
        "/api/questionnaire-intake",
        json={
            "patient_id": patient_id,
            "personal_and_body_data": {
                "first_name": "Maria",
                "last_name": "Muster",
                "birth_date": "1962-03-15",
                "phone": "+49123456789",
                "email": "maria@example.com",
                "profession": "Rentnerin",
                "height_cm": 168,
                "weight_kg": 71,
                "measurements": {},
            },
            "activity_and_movement": {
                "daily_steps": 1800,
                "sports_per_week": 0,
                "sports_description": "Keine",
            },
            "medication_and_supplements": {
                "medications": ["Schmerzmittel"],
                "supplements": [{"name": "Vitamin D", "dosage": "1000 IE"}],
            },
            "gut_health": {
                "last_antibiotic_date": "2025-02-10",
                "antibiotic_duration_days": 7,
                "food_intolerances": [],
            },
            "nutrition_status": {
                "appetite_level": appetite_level,
                "intake_change_vs_past": "significantly_less" if appetite_level in {"reduced", "minimal"} else "same",
                "meals_per_day": 3,
                "eating_difficulties": ["uebelkeit"] if appetite_level in {"reduced", "minimal"} else [],
                "digestive_symptoms": digestive_symptoms,
            },
            "eating_habits": {
                "typical_day_summary": "Drei kleine Mahlzeiten.",
                "preferred_foods": ["Reis", "Gemuese"],
                "disliked_foods": ["Scharf"],
                "diet_style": "mixed",
                "diet_style_notes": None,
                "cultural_requirements": None,
                "can_cook": False,
                "receives_support_for_cooking": True,
                "fluid_intake_ml_per_day": 1600,
                "alcohol_notes": "selten",
                "smoking_status": "no",
            },
            "recovery_indicators": {
                "infections_last_year": 1,
                "wound_healing_issues": "wundheilung" in " ".join(goals).lower(),
                "fatigue_level": fatigue_level,
                "sleep_quality": "variable",
            },
            "goals_and_expectations": {
                "goals": goals,
                "expectation_notes": "Bessere Orientierung im Alltag",
            },
            "additional_notes": "Testintake",
        },
    )
    assert response.status_code == 200
    return response.json()


def test_questionnaire_validation_rejects_incomplete_payload() -> None:
    response = client.post("/api/questionnaire-intake", json={"patient_id": "missing_sections"})
    assert response.status_code == 422


def test_post_op_profile_prioritizes_wound_healing_box() -> None:
    profile = create_patient_profile(known_conditions=["post_op_recovery"])
    intake = create_intake(
        profile["patient_id"],
        appetite_level="good",
        digestive_symptoms=[],
        goals=["wundheilung", "bessere_genesung"],
        fatigue_level="moderate",
    )

    response = client.post("/api/recommendations/analyze", json={"intake_id": intake["intake_id"]})
    assert response.status_code == 200
    data = response.json()

    assert data["recommended_weekly_plan"]["template_id"] == "post_op_high_protein"
    assert data["recommended_meal_kits"][0]["meal_kit_id"] == "produktdetails_wundheilungs_box"


def test_oncology_profile_prioritizes_onko_box() -> None:
    profile = create_patient_profile(known_conditions=["chemotherapy_support"])
    intake = create_intake(
        profile["patient_id"],
        appetite_level="minimal",
        digestive_symptoms=[],
        goals=["gewicht_halten", "therapie_unterstuetzen"],
        fatigue_level="moderate",
    )

    response = client.post("/api/recommendations/analyze", json={"intake_id": intake["intake_id"]})
    assert response.status_code == 200
    data = response.json()

    assert data["recommended_weekly_plan"]["template_id"] == "chemo_easy_digest"
    assert data["recommended_meal_kits"][0]["meal_kit_id"] == "produktdetails_onko_box"


def test_gut_sensitivity_prioritizes_darm_balance_box() -> None:
    profile = create_patient_profile(known_conditions=["general_recovery"])
    intake = create_intake(
        profile["patient_id"],
        appetite_level="variable",
        digestive_symptoms=["blaehungen", "bauchschmerzen"],
        goals=["beschwerden_lindern"],
        fatigue_level="light",
    )

    response = client.post("/api/recommendations/analyze", json={"intake_id": intake["intake_id"]})
    assert response.status_code == 200
    data = response.json()

    assert data["recommended_weekly_plan"]["template_id"] == "gut_balance_recovery"
    assert data["recommended_meal_kits"][0]["meal_kit_id"] == "produktdetails_darm_balance_box"


def test_allergies_exclude_incompatible_meal_kits() -> None:
    profile = create_patient_profile(known_conditions=["immune_support"], allergies=["nuts"])
    intake = create_intake(
        profile["patient_id"],
        appetite_level="good",
        digestive_symptoms=[],
        goals=["immunsystem_staerken"],
        fatigue_level="light",
    )

    response = client.post("/api/recommendations/analyze", json={"intake_id": intake["intake_id"]})
    assert response.status_code == 200
    data = response.json()

    meal_kit_ids = [item["meal_kit_id"] for item in data["recommended_meal_kits"]]
    assert "produktdetails_immun_boost_box" not in meal_kit_ids


def test_create_and_fetch_order_with_correct_totals() -> None:
    profile = create_patient_profile()
    response = client.post(
        "/api/orders",
        json={
            "patient_id": profile["patient_id"],
            "items": [
                {"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 2},
                {"meal_kit_id": "produktdetails_vitality_box", "quantity": 1},
            ],
            "shipping_address": {
                "first_name": "Maria",
                "last_name": "Muster",
                "street": "Heilweg 12",
                "postal_code": "70173",
                "city": "Stuttgart",
                "country": "DE",
            },
            "payment_method": "card",
            "contact_email": "maria@example.com",
            "contact_phone": "+49123456789",
            "notes": "Bitte klingeln",
        },
    )
    assert response.status_code == 200
    order = response.json()

    assert order["subtotal"] == 118.7
    assert order["total"] == 118.7

    fetch_response = client.get(f"/api/orders/{order['order_id']}")
    assert fetch_response.status_code == 200
    assert fetch_response.json()["order_id"] == order["order_id"]


def test_unknown_meal_kit_order_is_rejected() -> None:
    profile = create_patient_profile()
    response = client.post(
        "/api/orders",
        json={
            "patient_id": profile["patient_id"],
            "items": [{"meal_kit_id": "unknown", "quantity": 1}],
            "shipping_address": {
                "first_name": "Maria",
                "last_name": "Muster",
                "street": "Heilweg 12",
                "postal_code": "70173",
                "city": "Stuttgart",
                "country": "DE",
            },
            "payment_method": "card",
            "contact_email": "maria@example.com",
            "contact_phone": "+49123456789",
        },
    )
    assert response.status_code == 404


def test_order_validation_rejects_missing_payment_method() -> None:
    profile = create_patient_profile()
    response = client.post(
        "/api/orders",
        json={
            "patient_id": profile["patient_id"],
            "items": [{"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 1}],
            "shipping_address": {
                "first_name": "Maria",
                "last_name": "Muster",
                "street": "Heilweg 12",
                "postal_code": "70173",
                "city": "Stuttgart",
                "country": "DE",
            },
            "contact_email": "maria@example.com",
            "contact_phone": "+49123456789",
        },
    )
    assert response.status_code == 422


def test_catalog_and_get_endpoints_are_stable() -> None:
    list_response = client.get("/api/meal-kits")
    assert list_response.status_code == 200
    items = list_response.json()
    assert len(items) >= 5

    item_response = client.get("/api/meal-kits/produktdetails_wundheilungs_box")
    assert item_response.status_code == 200
    assert item_response.json()["name"] == "Wundheilungs-Box"
