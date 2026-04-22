"""Order handling service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.meal_kit_catalog.repository import get_meal_kit
from app.modules.order_handling.repository import get_order, save_order
from app.modules.order_handling.schemas import Order, OrderCreate, OrderItem
from app.modules.patient_profile.service import get_patient_profile_or_404


def create_order(payload: OrderCreate) -> Order:
    get_patient_profile_or_404(payload.patient_id)

    items: list[OrderItem] = []
    subtotal = 0.0
    for item in payload.items:
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
        subtotal=round(subtotal, 2),
        shipping_cost=0.0,
        total=round(subtotal, 2),
        estimated_delivery_window="2-3 Werktage",
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
