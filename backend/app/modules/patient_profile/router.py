"""Patient profile router."""

from fastapi import APIRouter
from fastapi import Response, status

from app.modules.patient_profile.schemas import PatientProfile, PatientProfileCreate
from app.modules.patient_profile.service import (
    create_patient_profile,
    delete_patient_data,
    export_patient_data,
    get_patient_profile_or_404,
)


router = APIRouter()


@router.post("/patient-profile", response_model=PatientProfile)
def create_profile(payload: PatientProfileCreate) -> PatientProfile:
    return create_patient_profile(payload)


@router.get("/patient-profile/{patient_id}", response_model=PatientProfile)
def get_profile(patient_id: str) -> PatientProfile:
    return get_patient_profile_or_404(patient_id)


@router.get("/patient-profile/{patient_id}/export")
def export_profile_data(patient_id: str) -> dict[str, object]:
    return export_patient_data(patient_id)


@router.delete("/patient-profile/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_profile_data(patient_id: str) -> Response:
    delete_patient_data(patient_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
