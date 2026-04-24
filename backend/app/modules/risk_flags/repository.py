"""SQLite-backed repository for risk flags."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import RiskFlagRecord
from app.db.session import db_session
from app.modules.risk_flags.schemas import RiskFlag


def save_risk_flag(flag: RiskFlag) -> RiskFlag:
    with db_session() as session:
        session.merge(
            RiskFlagRecord(
                id=flag.id,
                patient_id=flag.patient_id,
                status=flag.severity,
                payload=flag.model_dump_json(),
                created_at=flag.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return flag


def save_risk_flags(flags: list[RiskFlag]) -> list[RiskFlag]:
    for flag in flags:
        save_risk_flag(flag)
    return flags


def get_risk_flag(flag_id: str) -> RiskFlag | None:
    with db_session() as session:
        record = session.get(RiskFlagRecord, flag_id)
        if record is None:
            return None
        return RiskFlag.model_validate_json(record.payload)


def list_risk_flags_for_patient(patient_id: str) -> list[RiskFlag]:
    with db_session() as session:
        records = session.scalars(
            select(RiskFlagRecord)
            .where(RiskFlagRecord.patient_id == patient_id)
            .order_by(RiskFlagRecord.created_at)
        ).all()
        return [RiskFlag.model_validate_json(record.payload) for record in records]


def delete_risk_flags_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(RiskFlagRecord).where(RiskFlagRecord.patient_id == patient_id))


def clear_risk_flags() -> None:
    with db_session() as session:
        session.execute(delete(RiskFlagRecord))
