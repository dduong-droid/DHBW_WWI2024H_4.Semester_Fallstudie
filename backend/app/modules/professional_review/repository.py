"""SQLite-backed repository for professional reviews."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import ProfessionalReviewRecord
from app.db.session import db_session
from app.modules.professional_review.schemas import ProfessionalReview


def save_review(review: ProfessionalReview) -> ProfessionalReview:
    with db_session() as session:
        session.merge(
            ProfessionalReviewRecord(
                id=review.review_id,
                patient_id=review.patient_id,
                status=review.status,
                payload=review.model_dump_json(),
                created_at=review.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return review


def get_review(review_id: str) -> ProfessionalReview | None:
    with db_session() as session:
        record = session.get(ProfessionalReviewRecord, review_id)
        if record is None:
            return None
        return ProfessionalReview.model_validate_json(record.payload)


def list_reviews() -> list[ProfessionalReview]:
    with db_session() as session:
        records = session.scalars(select(ProfessionalReviewRecord).order_by(ProfessionalReviewRecord.created_at)).all()
        return [ProfessionalReview.model_validate_json(record.payload) for record in records]


def list_reviews_for_patient(patient_id: str) -> list[ProfessionalReview]:
    with db_session() as session:
        records = session.scalars(
            select(ProfessionalReviewRecord)
            .where(ProfessionalReviewRecord.patient_id == patient_id)
            .order_by(ProfessionalReviewRecord.created_at)
        ).all()
        return [ProfessionalReview.model_validate_json(record.payload) for record in records]


def get_latest_review_for_patient(patient_id: str) -> ProfessionalReview | None:
    reviews = list_reviews_for_patient(patient_id)
    if not reviews:
        return None
    return max(reviews, key=lambda item: item.updated_at)


def delete_reviews_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(ProfessionalReviewRecord).where(ProfessionalReviewRecord.patient_id == patient_id))


def clear_reviews() -> None:
    with db_session() as session:
        session.execute(delete(ProfessionalReviewRecord))
