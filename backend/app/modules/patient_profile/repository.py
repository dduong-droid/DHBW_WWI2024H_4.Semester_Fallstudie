"""SQLite-backed repository for patient profiles."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete

from app.db.base import PatientProfileRecord
from app.db.session import db_session
from app.modules.patient_profile.schemas import PatientProfile


def save_patient_profile(profile: PatientProfile) -> PatientProfile:
    with db_session() as session:
        session.merge(
            PatientProfileRecord(
                id=profile.patient_id,
                patient_id=profile.patient_id,
                status=None,
                payload=profile.model_dump_json(),
                created_at=profile.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return profile


def get_patient_profile(patient_id: str) -> PatientProfile | None:
    with db_session() as session:
        record = session.get(PatientProfileRecord, patient_id)
        if record is None:
            return None
        return PatientProfile.model_validate_json(record.payload)


def delete_patient_profile(patient_id: str) -> bool:
    with db_session() as session:
        record = session.get(PatientProfileRecord, patient_id)
        if record is None:
            return False
        session.delete(record)
        return True


def clear_patient_profiles() -> None:
    with db_session() as session:
        session.execute(delete(PatientProfileRecord))
