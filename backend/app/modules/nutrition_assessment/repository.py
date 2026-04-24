"""SQLite-backed repository for nutrition assessments."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import NutritionAssessmentRecord
from app.db.session import db_session
from app.modules.nutrition_assessment.schemas import NutritionAssessment


def save_assessment(assessment: NutritionAssessment) -> NutritionAssessment:
    with db_session() as session:
        session.merge(
            NutritionAssessmentRecord(
                id=assessment.assessment_id,
                patient_id=assessment.patient_id,
                status=assessment.recommendation_readiness,
                payload=assessment.model_dump_json(),
                created_at=assessment.generated_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return assessment


def get_assessment(assessment_id: str) -> NutritionAssessment | None:
    with db_session() as session:
        record = session.get(NutritionAssessmentRecord, assessment_id)
        if record is None:
            return None
        return NutritionAssessment.model_validate_json(record.payload)


def list_assessments_for_patient(patient_id: str) -> list[NutritionAssessment]:
    with db_session() as session:
        records = session.scalars(
            select(NutritionAssessmentRecord)
            .where(NutritionAssessmentRecord.patient_id == patient_id)
            .order_by(NutritionAssessmentRecord.created_at)
        ).all()
        return [NutritionAssessment.model_validate_json(record.payload) for record in records]


def get_latest_assessment_for_patient(patient_id: str) -> NutritionAssessment | None:
    assessments = list_assessments_for_patient(patient_id)
    if not assessments:
        return None
    return max(assessments, key=lambda item: item.generated_at)


def delete_assessments_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(NutritionAssessmentRecord).where(NutritionAssessmentRecord.patient_id == patient_id))


def clear_assessments() -> None:
    with db_session() as session:
        session.execute(delete(NutritionAssessmentRecord))
