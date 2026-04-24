"""SQLite-backed repository for internal analytics events."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import AnalyticsEventRecord
from app.db.session import db_session
from app.modules.analytics.schemas import AnalyticsEvent


def save_event(event: AnalyticsEvent) -> AnalyticsEvent:
    with db_session() as session:
        session.merge(
            AnalyticsEventRecord(
                id=event.event_id,
                patient_id=event.patient_id,
                status=event.event_type,
                payload=event.model_dump_json(),
                created_at=event.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return event


def list_events() -> list[AnalyticsEvent]:
    with db_session() as session:
        records = session.scalars(select(AnalyticsEventRecord).order_by(AnalyticsEventRecord.created_at)).all()
        return [AnalyticsEvent.model_validate_json(record.payload) for record in records]


def list_events_for_patient(patient_id: str) -> list[AnalyticsEvent]:
    with db_session() as session:
        records = session.scalars(
            select(AnalyticsEventRecord)
            .where(AnalyticsEventRecord.patient_id == patient_id)
            .order_by(AnalyticsEventRecord.created_at)
        ).all()
        return [AnalyticsEvent.model_validate_json(record.payload) for record in records]


def delete_events_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(AnalyticsEventRecord).where(AnalyticsEventRecord.patient_id == patient_id))


def clear_events() -> None:
    with db_session() as session:
        session.execute(delete(AnalyticsEventRecord))
