"""Patient profile service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.patient_profile.repository import get_patient_profile, save_patient_profile
from app.modules.patient_profile.schemas import PatientProfile, PatientProfileCreate


def create_patient_profile(payload: PatientProfileCreate) -> PatientProfile:
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
