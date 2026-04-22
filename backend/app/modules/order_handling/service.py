"""Order handling service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.meal_kit_catalog.repository import get_meal_kit
from app.modules.order_handling.repository import get_order, save_order
from app.modules.order_handling.schemas import Order, OrderCreate, OrderItem, OrderItemCreate, OrderStatus
from app.modules.patient_profile.service import get_patient_profile_or_404
from app.modules.recommendation_engine.repository import get_latest_recommendation_for_patient


_MAX_QUANTITY_PER_MEAL_KIT = 10
_FREE_SHIPPING_THRESHOLD = 60.00
_STANDARD_SHIPPING_COST = 4.99
_ALLOWED_STATUS_TRANSITIONS: dict[OrderStatus, set[OrderStatus]] = {
    "draft": {"confirmed", "cancelled"},
    "confirmed": {"processing", "cancelled"},
    "processing": {"completed", "cancelled"},
    "completed": set(),
    "cancelled": set(),
}


def _merge_duplicate_items(items: list[OrderItemCreate]) -> list[OrderItemCreate]:
    merged_quantities: dict[str, int] = {}
    for item in items:
        merged_quantities[item.meal_kit_id] = merged_quantities.get(item.meal_kit_id, 0) + item.quantity
    return [OrderItemCreate(meal_kit_id=meal_kit_id, quantity=quantity) for meal_kit_id, quantity in merged_quantities.items()]


def _build_recommendation_fit_note(patient_id: str, ordered_meal_kit_ids: list[str]) -> str | None:
    recommendation = get_latest_recommendation_for_patient(patient_id)
    if recommendation is None:
        return None

    recommended_ids = {item.meal_kit_id for item in recommendation.recommended_meal_kits}
    ordered_ids = set(ordered_meal_kit_ids)
    if ordered_ids <= recommended_ids:
        return "Die Bestellung deckt sich mit den zuletzt empfohlenen Meal-Kits."
    return "Die Bestellung weicht teilweise von der letzten Empfehlung ab, bleibt aber zulaessig."


def _shipping_cost_for_subtotal(subtotal: float) -> float:
    return 0.0 if subtotal >= _FREE_SHIPPING_THRESHOLD else _STANDARD_SHIPPING_COST


def create_order(payload: OrderCreate) -> Order:
    get_patient_profile_or_404(payload.patient_id)

    merged_items = _merge_duplicate_items(payload.items)
    items: list[OrderItem] = []
    subtotal = 0.0
    for item in merged_items:
        if item.quantity > _MAX_QUANTITY_PER_MEAL_KIT:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail=f"Meal kit '{item.meal_kit_id}' exceeds the quantity limit of {_MAX_QUANTITY_PER_MEAL_KIT}.",
            )
        meal_kit = get_meal_kit(item.meal_kit_id)
        if meal_kit is None or not meal_kit.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Meal kit '{item.meal_kit_id}' was not found.",
            )
        line_total = round(meal_kit.price * item.quantity, 2)
        subtotal += line_total
        items.append(
            OrderItem(
                meal_kit_id=item.meal_kit_id,
                name=meal_kit.name,
                unit_price=meal_kit.price,
                quantity=item.quantity,
                line_total=line_total,
            )
        )

    shipping_cost = _shipping_cost_for_subtotal(round(subtotal, 2))
    order = Order(
        order_id=f"order_{uuid4().hex[:10]}",
        patient_id=payload.patient_id,
        status="confirmed",
        items=items,
        shipping_address=payload.shipping_address,
        payment_method=payload.payment_method,
        contact_email=payload.contact_email,
        contact_phone=payload.contact_phone,
        notes=payload.notes,
        currency="EUR",
        subtotal=round(subtotal, 2),
        shipping_cost=shipping_cost,
        total=round(subtotal + shipping_cost, 2),
        estimated_delivery_window="2-3 Werktage",
        recommendation_fit_note=_build_recommendation_fit_note(
            payload.patient_id,
            [item.meal_kit_id for item in merged_items],
        ),
        created_at=datetime.now(timezone.utc),
    )
    return save_order(order)


def get_order_or_404(order_id: str) -> Order:
    record = get_order(order_id)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_id}' was not found.",
        )
    return record


def update_order_status(order_id: str, next_status: OrderStatus) -> Order:
    order = get_order_or_404(order_id)
    if next_status == order.status:
        return order

    if next_status not in _ALLOWED_STATUS_TRANSITIONS[order.status]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Invalid status transition from '{order.status}' to '{next_status}'.",
        )

    updated_order = order.model_copy(update={"status": next_status})
    return save_order(updated_order)
