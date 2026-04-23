"""In-memory repository for patient profiles."""

from __future__ import annotations

from app.modules.patient_profile.schemas import PatientProfile


_PROFILES: dict[str, PatientProfile] = {}


def save_patient_profile(profile: PatientProfile) -> PatientProfile:
    _PROFILES[profile.patient_id] = profile
    return profile


def get_patient_profile(patient_id: str) -> PatientProfile | None:
    return _PROFILES.get(patient_id)


def clear_patient_profiles() -> None:
    _PROFILES.clear()
