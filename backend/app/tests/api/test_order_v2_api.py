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


def _create_patient() -> str:
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
            "known_conditions": ["post_op_recovery"],
            "allergies": [],
            "dietary_preferences": ["balanced"],
            "consent_data_processing": True,
            "notes": "Testprofil",
        },
    )
    assert response.status_code == 200
    return response.json()["patient_id"]


def _base_order_payload(patient_id: str) -> dict[str, object]:
    return {
        "patient_id": patient_id,
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
    }


def test_order_api_merges_duplicates_and_applies_shipping_rules() -> None:
    patient_id = _create_patient()
    payload = _base_order_payload(patient_id)
    payload["items"] = [
        {"meal_kit_id": "produktdetails_darm_balance_box", "quantity": 1},
        {"meal_kit_id": "produktdetails_darm_balance_box", "quantity": 1},
    ]

    response = client.post("/api/orders", json=payload)
    assert response.status_code == 200
    order = response.json()

    assert len(order["items"]) == 1
    assert order["items"][0]["quantity"] == 2
    assert order["subtotal"] == 75.0
    assert order["shipping_cost"] == 0.0
    assert order["currency"] == "EUR"


def test_order_api_rejects_quantity_above_limit() -> None:
    patient_id = _create_patient()
    payload = _base_order_payload(patient_id)
    payload["items"] = [{"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 11}]

    response = client.post("/api/orders", json=payload)
    assert response.status_code == 422


def test_order_status_patch_allows_valid_and_blocks_invalid_transitions() -> None:
    patient_id = _create_patient()
    payload = _base_order_payload(patient_id)
    payload["items"] = [{"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 1}]

    create_response = client.post("/api/orders", json=payload)
    assert create_response.status_code == 200
    order_id = create_response.json()["order_id"]

    processing_response = client.patch(f"/api/orders/{order_id}/status", json={"status": "processing"})
    assert processing_response.status_code == 200
    assert processing_response.json()["status"] == "processing"

    invalid_response = client.patch(f"/api/orders/{order_id}/status", json={"status": "confirmed"})
    assert invalid_response.status_code == 422
