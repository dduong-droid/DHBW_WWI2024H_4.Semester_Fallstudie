"""SQLite-backed repository for questionnaire intake records."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import QuestionnaireRecord
from app.db.session import db_session
from app.modules.questionnaire_intake.schemas import QuestionnaireIntakeRecord


def save_questionnaire(record: QuestionnaireIntakeRecord) -> QuestionnaireIntakeRecord:
    with db_session() as session:
        session.merge(
            QuestionnaireRecord(
                id=record.intake_id,
                patient_id=record.patient_id,
                status=record.status,
                payload=record.model_dump_json(),
                created_at=record.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return record


def get_questionnaire(intake_id: str) -> QuestionnaireIntakeRecord | None:
    with db_session() as session:
        record = session.get(QuestionnaireRecord, intake_id)
        if record is None:
            return None
        return QuestionnaireIntakeRecord.model_validate_json(record.payload)


def list_questionnaires_for_patient(patient_id: str) -> list[QuestionnaireIntakeRecord]:
    with db_session() as session:
        records = session.scalars(
            select(QuestionnaireRecord)
            .where(QuestionnaireRecord.patient_id == patient_id)
            .order_by(QuestionnaireRecord.created_at)
        ).all()
        return [QuestionnaireIntakeRecord.model_validate_json(record.payload) for record in records]


def delete_questionnaires_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(QuestionnaireRecord).where(QuestionnaireRecord.patient_id == patient_id))


def clear_questionnaires() -> None:
    with db_session() as session:
        session.execute(delete(QuestionnaireRecord))
