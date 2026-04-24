"""Patient profile service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.analytics.repository import delete_events_for_patient, list_events_for_patient
from app.modules.frontend_bff.tracking_repository import delete_tracking_state, export_tracking_state
from app.modules.nutrition_assessment.repository import delete_assessments_for_patient, list_assessments_for_patient
from app.modules.nutrition_plan.repository import delete_nutrition_plans_for_patient, list_nutrition_plans_for_patient
from app.modules.order_handling.repository import delete_orders_for_patient, list_orders_for_patient
from app.modules.patient_profile.repository import delete_patient_profile, get_patient_profile, save_patient_profile
from app.modules.patient_profile.schemas import PatientProfile, PatientProfileCreate
from app.modules.professional_review.repository import delete_reviews_for_patient, list_reviews_for_patient
from app.modules.questionnaire_intake.repository import delete_questionnaires_for_patient, list_questionnaires_for_patient
from app.modules.recommendation_engine.repository import delete_recommendations_for_patient, list_recommendations_for_patient
from app.modules.risk_flags.repository import delete_risk_flags_for_patient, list_risk_flags_for_patient
from app.modules.shopping_list.repository import delete_shopping_lists_for_patient, list_shopping_lists_for_patient
from app.modules.symptom_tracking.repository import delete_tracking_for_patient, list_tracking_for_patient


def create_patient_profile(payload: PatientProfileCreate) -> PatientProfile:
    if not payload.consent_data_processing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Data processing consent is required.",
        )
    patient_id = payload.patient_id or f"patient_{uuid4().hex[:10]}"
    profile = PatientProfile(
        patient_id=patient_id,
        created_at=datetime.now(timezone.utc),
        **payload.model_dump(exclude={"patient_id"}),
    )
    return save_patient_profile(profile)


def get_patient_profile_or_404(patient_id: str) -> PatientProfile:
    profile = get_patient_profile(patient_id)
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient profile '{patient_id}' was not found.",
        )
    return profile


def export_patient_data(patient_id: str) -> dict[str, object]:
    profile = get_patient_profile_or_404(patient_id)
    questionnaires = list_questionnaires_for_patient(patient_id)
    recommendations = list_recommendations_for_patient(patient_id)
    nutrition_plans = list_nutrition_plans_for_patient(patient_id)
    assessments = list_assessments_for_patient(patient_id)
    risk_flags = list_risk_flags_for_patient(patient_id)
    shopping_lists = list_shopping_lists_for_patient(patient_id)
    professional_reviews = list_reviews_for_patient(patient_id)
    symptom_tracking = list_tracking_for_patient(patient_id)
    analytics_events = list_events_for_patient(patient_id)
    orders = list_orders_for_patient(patient_id)
    frontend_tracking = export_tracking_state(patient_id)
    return {
        "profile": profile.model_dump(mode="json"),
        "questionnaires": [item.model_dump(mode="json") for item in questionnaires],
        "assessments": [item.model_dump(mode="json") for item in assessments],
        "risk_flags": [item.model_dump(mode="json") for item in risk_flags],
        "recommendations": [item.model_dump(mode="json") for item in recommendations],
        "nutrition_plans": [item.model_dump(mode="json") for item in nutrition_plans],
        "shopping_lists": [item.model_dump(mode="json") for item in shopping_lists],
        "professional_reviews": [item.model_dump(mode="json") for item in professional_reviews],
        "orders": [item.model_dump(mode="json") for item in orders],
        "tracking": {
            **frontend_tracking,
            "frontend": frontend_tracking,
            "symptom": [item.model_dump(mode="json") for item in symptom_tracking],
        },
        "analytics_events": [item.model_dump(mode="json") for item in analytics_events],
    }


def delete_patient_data(patient_id: str) -> None:
    if get_patient_profile(patient_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient profile '{patient_id}' was not found.",
        )
    delete_orders_for_patient(patient_id)
    delete_reviews_for_patient(patient_id)
    delete_shopping_lists_for_patient(patient_id)
    delete_nutrition_plans_for_patient(patient_id)
    delete_recommendations_for_patient(patient_id)
    delete_assessments_for_patient(patient_id)
    delete_risk_flags_for_patient(patient_id)
    delete_questionnaires_for_patient(patient_id)
    delete_tracking_for_patient(patient_id)
    delete_tracking_state(patient_id)
    delete_events_for_patient(patient_id)
    delete_patient_profile(patient_id)
