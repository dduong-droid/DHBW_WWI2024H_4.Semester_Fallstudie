"""Symptom tracking routes."""

from fastapi import APIRouter

from app.modules.symptom_tracking.schemas import SymptomTrackingCreate, SymptomTrackingRecord
from app.modules.symptom_tracking.service import create_tracking_entry, get_tracking_entries


router = APIRouter()


@router.post("/patients/{patient_id}/tracking", response_model=SymptomTrackingRecord)
def post_tracking(patient_id: str, payload: SymptomTrackingCreate) -> SymptomTrackingRecord:
    return create_tracking_entry(patient_id, payload)


@router.get("/patients/{patient_id}/tracking", response_model=list[SymptomTrackingRecord])
def get_tracking(patient_id: str) -> list[SymptomTrackingRecord]:
    return get_tracking_entries(patient_id)
