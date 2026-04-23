"""SQLite-backed tracking repository for the frontend BFF demo endpoints."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete

from app.db.base import TrackingRecord
from app.db.session import db_session
from app.modules.frontend_bff.schemas import FrontendDailyProgress, FrontendHydrationProgress


_DEFAULT_DAILY_PROGRESS = FrontendDailyProgress(
    proteinPercent=12,
    energyPercent=20,
    isMealBoxEaten=False,
)
_DEFAULT_HYDRATION_PROGRESS = FrontendHydrationProgress(
    currentMl=0,
    targetMl=2500,
)

def _get_record(patient_id: str) -> TrackingRecord | None:
    with db_session() as session:
        return session.get(TrackingRecord, patient_id)


def _save_record(
    patient_id: str,
    *,
    daily: FrontendDailyProgress | None = None,
    hydration: FrontendHydrationProgress | None = None,
) -> None:
    with db_session() as session:
        existing = session.get(TrackingRecord, patient_id)
        daily_payload = existing.daily_payload if existing is not None else None
        hydration_payload = existing.hydration_payload if existing is not None else None
        if daily is not None:
            daily_payload = daily.model_dump_json()
        if hydration is not None:
            hydration_payload = hydration.model_dump_json()
        session.merge(
            TrackingRecord(
                patient_id=patient_id,
                daily_payload=daily_payload,
                hydration_payload=hydration_payload,
                updated_at=datetime.now(timezone.utc),
            )
        )


def get_daily_progress(patient_id: str) -> FrontendDailyProgress:
    record = _get_record(patient_id)
    if record is None or record.daily_payload is None:
        return _DEFAULT_DAILY_PROGRESS
    return FrontendDailyProgress.model_validate_json(record.daily_payload)


def mark_meal_box_eaten(patient_id: str) -> FrontendDailyProgress:
    progress = FrontendDailyProgress(
        proteinPercent=100,
        energyPercent=100,
        isMealBoxEaten=True,
    )
    _save_record(patient_id, daily=progress)
    return progress


def get_hydration_progress(patient_id: str) -> FrontendHydrationProgress:
    record = _get_record(patient_id)
    if record is None or record.hydration_payload is None:
        return _DEFAULT_HYDRATION_PROGRESS
    return FrontendHydrationProgress.model_validate_json(record.hydration_payload)


def add_water(patient_id: str, amount_ml: int) -> FrontendHydrationProgress:
    current = get_hydration_progress(patient_id)
    updated = FrontendHydrationProgress(
        currentMl=min(current.currentMl + amount_ml, current.targetMl),
        targetMl=current.targetMl,
    )
    _save_record(patient_id, hydration=updated)
    return updated


def export_tracking_state(patient_id: str) -> dict[str, object]:
    return {
        "daily": get_daily_progress(patient_id).model_dump(mode="json"),
        "hydration": get_hydration_progress(patient_id).model_dump(mode="json"),
    }


def delete_tracking_state(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(TrackingRecord).where(TrackingRecord.patient_id == patient_id))


def clear_tracking_state() -> None:
    with db_session() as session:
        session.execute(delete(TrackingRecord))
