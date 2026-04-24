"""SQLite-backed repository for shopping lists."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import ShoppingListRecord
from app.db.session import db_session
from app.modules.shopping_list.schemas import ShoppingList


def save_shopping_list(shopping_list: ShoppingList) -> ShoppingList:
    with db_session() as session:
        session.merge(
            ShoppingListRecord(
                id=shopping_list.shopping_list_id,
                patient_id=shopping_list.patient_id,
                status=None,
                payload=shopping_list.model_dump_json(),
                created_at=shopping_list.generated_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return shopping_list


def get_shopping_list(shopping_list_id: str) -> ShoppingList | None:
    with db_session() as session:
        record = session.get(ShoppingListRecord, shopping_list_id)
        if record is None:
            return None
        return ShoppingList.model_validate_json(record.payload)


def list_shopping_lists_for_patient(patient_id: str) -> list[ShoppingList]:
    with db_session() as session:
        records = session.scalars(
            select(ShoppingListRecord)
            .where(ShoppingListRecord.patient_id == patient_id)
            .order_by(ShoppingListRecord.created_at)
        ).all()
        return [ShoppingList.model_validate_json(record.payload) for record in records]


def get_shopping_list_by_plan(plan_id: str) -> ShoppingList | None:
    with db_session() as session:
        records = session.scalars(select(ShoppingListRecord)).all()
        for record in records:
            shopping_list = ShoppingList.model_validate_json(record.payload)
            if shopping_list.plan_id == plan_id:
                return shopping_list
    return None


def get_latest_shopping_list_for_patient(patient_id: str) -> ShoppingList | None:
    lists = list_shopping_lists_for_patient(patient_id)
    if not lists:
        return None
    return max(lists, key=lambda item: item.generated_at)


def delete_shopping_lists_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(ShoppingListRecord).where(ShoppingListRecord.patient_id == patient_id))


def clear_shopping_lists() -> None:
    with db_session() as session:
        session.execute(delete(ShoppingListRecord))
