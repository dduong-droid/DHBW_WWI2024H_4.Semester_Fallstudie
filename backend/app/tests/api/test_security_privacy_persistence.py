from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from app.modules.frontend_bff.tracking_repository import clear_tracking_state
from app.modules.order_handling.repository import clear_orders
from app.modules.patient_profile.repository import clear_patient_profiles, get_patient_profile
from app.modules.questionnaire_intake.repository import clear_questionnaires
from app.modules.recommendation_engine.repository import clear_recommendations
from app.tests.helpers import build_patient_profile_create, build_questionnaire_content


client = TestClient(app)


def setup_function() -> None:
    clear_tracking_state()
    clear_orders()
    clear_recommendations()
    clear_questionnaires()
    clear_patient_profiles()


def _create_profile_payload() -> dict[str, object]:
    return build_patient_profile_create(patient_id="patient_privacy").model_dump(mode="json")


def _create_intake_payload(patient_id: str) -> dict[str, object]:
    payload = build_questionnaire_content().model_dump(mode="json")
    payload["patient_id"] = patient_id
    return payload


def _create_order_payload(patient_id: str) -> dict[str, object]:
    return {
        "patient_id": patient_id,
        "items": [{"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 1}],
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


def test_ready_endpoint_checks_database() -> None:
    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_patient_profile_requires_data_processing_consent() -> None:
    payload = _create_profile_payload()
    payload.pop("consent_data_processing")

    response = client.post("/api/patient-profile", json=payload)

    assert response.status_code == 422
    assert response.json()["error"]["code"] == "validation_error"


def test_patient_profile_persists_across_repository_sessions() -> None:
    response = client.post("/api/patient-profile", json=_create_profile_payload())
    assert response.status_code == 200

    stored_profile = get_patient_profile("patient_privacy")

    assert stored_profile is not None
    assert stored_profile.patient_id == "patient_privacy"
    assert stored_profile.email == "maria@example.com"


def test_api_key_protects_sensitive_endpoints_and_leaves_catalog_public(monkeypatch) -> None:
    monkeypatch.setenv("API_KEY", "secret-demo-key")

    payload = _create_profile_payload()
    no_key_response = client.post("/api/patient-profile", json=payload)
    wrong_key_response = client.post("/api/patient-profile", headers={"X-API-Key": "wrong"}, json=payload)
    valid_response = client.post("/api/patient-profile", headers={"X-API-Key": "secret-demo-key"}, json=payload)
    catalog_response = client.get("/api/meal-kits")

    assert no_key_response.status_code == 401
    assert no_key_response.json()["error"]["code"] == "unauthorized"
    assert wrong_key_response.status_code == 401
    assert valid_response.status_code == 200
    assert catalog_response.status_code == 200


def test_privacy_export_and_delete_cover_patient_related_data() -> None:
    profile_response = client.post("/api/patient-profile", json=_create_profile_payload())
    assert profile_response.status_code == 200
    patient_id = profile_response.json()["patient_id"]

    intake_response = client.post("/api/questionnaire-intake", json=_create_intake_payload(patient_id))
    assert intake_response.status_code == 200

    recommendation_response = client.post(
        "/api/recommendations/analyze",
        json={"intake_id": intake_response.json()["intake_id"]},
    )
    assert recommendation_response.status_code == 200

    order_response = client.post("/api/orders", json=_create_order_payload(patient_id))
    assert order_response.status_code == 200

    track_response = client.post(f"/api/frontend/tracking/daily/{patient_id}/meal-box")
    assert track_response.status_code == 200

    export_response = client.get(f"/api/patient-profile/{patient_id}/export")
    assert export_response.status_code == 200
    export_payload = export_response.json()

    assert export_payload["profile"]["patient_id"] == patient_id
    assert len(export_payload["questionnaires"]) == 1
    assert len(export_payload["recommendations"]) == 1
    assert len(export_payload["orders"]) == 1
    assert export_payload["tracking"]["daily"]["isMealBoxEaten"] is True

    delete_response = client.delete(f"/api/patient-profile/{patient_id}")
    assert delete_response.status_code == 204

    assert client.get(f"/api/patient-profile/{patient_id}").status_code == 404
    assert client.get(f"/api/orders/{order_response.json()['order_id']}").status_code == 404
