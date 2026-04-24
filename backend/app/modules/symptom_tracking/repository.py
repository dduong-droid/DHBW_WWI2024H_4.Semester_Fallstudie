"""SQLite-backed repository for symptom tracking."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import SymptomTrackingRecord as SymptomTrackingDbRecord
from app.db.session import db_session
from app.modules.symptom_tracking.schemas import SymptomTrackingRecord


def save_tracking(record: SymptomTrackingRecord) -> SymptomTrackingRecord:
    with db_session() as session:
        session.merge(
            SymptomTrackingDbRecord(
                id=record.tracking_id,
                patient_id=record.patient_id,
                status=None,
                payload=record.model_dump_json(),
                created_at=record.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return record


def list_tracking_for_patient(patient_id: str) -> list[SymptomTrackingRecord]:
    with db_session() as session:
        records = session.scalars(
            select(SymptomTrackingDbRecord)
            .where(SymptomTrackingDbRecord.patient_id == patient_id)
            .order_by(SymptomTrackingDbRecord.created_at)
        ).all()
        return [SymptomTrackingRecord.model_validate_json(record.payload) for record in records]


def delete_tracking_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(SymptomTrackingDbRecord).where(SymptomTrackingDbRecord.patient_id == patient_id))


def clear_symptom_tracking() -> None:
    with db_session() as session:
        session.execute(delete(SymptomTrackingDbRecord))
