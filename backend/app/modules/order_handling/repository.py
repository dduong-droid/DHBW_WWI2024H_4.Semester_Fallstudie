"""SQLite-backed repository for orders."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import OrderRecord
from app.db.session import db_session
from app.modules.order_handling.schemas import Order


def save_order(order: Order) -> Order:
    with db_session() as session:
        session.merge(
            OrderRecord(
                id=order.order_id,
                patient_id=order.patient_id,
                status=order.status,
                payload=order.model_dump_json(),
                created_at=order.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return order


def get_order(order_id: str) -> Order | None:
    with db_session() as session:
        record = session.get(OrderRecord, order_id)
        if record is None:
            return None
        return Order.model_validate_json(record.payload)


def list_orders_for_patient(patient_id: str) -> list[Order]:
    with db_session() as session:
        records = session.scalars(
            select(OrderRecord).where(OrderRecord.patient_id == patient_id).order_by(OrderRecord.created_at)
        ).all()
        return [Order.model_validate_json(record.payload) for record in records]


def delete_orders_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(OrderRecord).where(OrderRecord.patient_id == patient_id))


def clear_orders() -> None:
    with db_session() as session:
        session.execute(delete(OrderRecord))
