"""SQLite-backed repository for nutrition plans."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import delete, select

from app.db.base import NutritionPlanRecord
from app.db.session import db_session
from app.modules.nutrition_plan.schemas import NutritionPlan


def save_nutrition_plan(plan: NutritionPlan) -> NutritionPlan:
    with db_session() as session:
        session.merge(
            NutritionPlanRecord(
                id=plan.plan_id,
                patient_id=plan.patient_id,
                status=plan.status,
                payload=plan.model_dump_json(),
                created_at=plan.created_at,
                updated_at=datetime.now(timezone.utc),
            )
        )
    return plan


def get_nutrition_plan(plan_id: str) -> NutritionPlan | None:
    with db_session() as session:
        record = session.get(NutritionPlanRecord, plan_id)
        if record is None:
            return None
        return NutritionPlan.model_validate_json(record.payload)


def get_nutrition_plan_by_recommendation(recommendation_id: str) -> NutritionPlan | None:
    with db_session() as session:
        records = session.scalars(select(NutritionPlanRecord)).all()
        for record in records:
            plan = NutritionPlan.model_validate_json(record.payload)
            if plan.recommendation_id == recommendation_id:
                return plan
        return None


def get_latest_nutrition_plan_for_patient(patient_id: str) -> NutritionPlan | None:
    plans = list_nutrition_plans_for_patient(patient_id)
    if not plans:
        return None
    return max(plans, key=lambda item: item.created_at)


def list_nutrition_plans_for_patient(patient_id: str) -> list[NutritionPlan]:
    with db_session() as session:
        records = session.scalars(
            select(NutritionPlanRecord)
            .where(NutritionPlanRecord.patient_id == patient_id)
            .order_by(NutritionPlanRecord.created_at)
        ).all()
        return [NutritionPlan.model_validate_json(record.payload) for record in records]


def delete_nutrition_plans_for_patient(patient_id: str) -> None:
    with db_session() as session:
        session.execute(delete(NutritionPlanRecord).where(NutritionPlanRecord.patient_id == patient_id))


def clear_nutrition_plans() -> None:
    with db_session() as session:
        session.execute(delete(NutritionPlanRecord))
