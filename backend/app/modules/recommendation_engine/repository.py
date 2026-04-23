"""SQLite-backed repository for recommendation results."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import RecommendationRecord
from app.db.session import db_session
from app.modules.recommendation_engine.schemas import RecommendationResult


def save_recommendation(record: RecommendationResult) -> RecommendationResult:
    with db_session() as session:
        session.merge(
            RecommendationRecord(
                id=record.recommendation_id,
                patient_id=record.patient_id,
                status=None,
                payload=record.model_dump_json(),
                created_at=record.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return record


def get_recommendation(recommendation_id: str) -> RecommendationResult | None:
    with db_session() as session:
        record = session.get(RecommendationRecord, recommendation_id)
        if record is None:
            return None
        return RecommendationResult.model_validate_json(record.payload)


def list_recommendations() -> list[RecommendationResult]:
    with db_session() as session:
        records = session.scalars(select(RecommendationRecord).order_by(RecommendationRecord.created_at)).all()
        return [RecommendationResult.model_validate_json(record.payload) for record in records]


def list_recommendations_for_patient(patient_id: str) -> list[RecommendationResult]:
    with db_session() as session:
        records = session.scalars(
            select(RecommendationRecord)
            .where(RecommendationRecord.patient_id == patient_id)
            .order_by(RecommendationRecord.created_at)
        ).all()
        return [RecommendationResult.model_validate_json(record.payload) for record in records]


def get_latest_recommendation_for_patient(patient_id: str) -> RecommendationResult | None:
    recommendations = list_recommendations_for_patient(patient_id)
    if not recommendations:
        return None
    return max(recommendations, key=lambda item: item.created_at)


def delete_recommendations_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(RecommendationRecord).where(RecommendationRecord.patient_id == patient_id))


def clear_recommendations() -> None:
    with db_session() as session:
        session.execute(delete(RecommendationRecord))
