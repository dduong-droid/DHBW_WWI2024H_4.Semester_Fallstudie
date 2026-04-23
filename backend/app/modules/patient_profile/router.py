"""Patient profile router."""

from fastapi import APIRouter

from app.modules.patient_profile.schemas import PatientProfile, PatientProfileCreate
from app.modules.patient_profile.service import create_patient_profile, get_patient_profile_or_404


router = APIRouter()


@router.post("/patient-profile", response_model=PatientProfile)
def create_profile(payload: PatientProfileCreate) -> PatientProfile:
    return create_patient_profile(payload)


@router.get("/patient-profile/{patient_id}", response_model=PatientProfile)
def get_profile(patient_id: str) -> PatientProfile:
    return get_patient_profile_or_404(patient_id)
