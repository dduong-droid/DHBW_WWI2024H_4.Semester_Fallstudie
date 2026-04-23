from __future__ import annotations

import pytest
from fastapi import HTTPException

from app.modules.order_handling.repository import clear_orders
from app.modules.order_handling.schemas import OrderCreate, ShippingAddress
from app.modules.order_handling.service import create_order, update_order_status
from app.modules.patient_profile.repository import clear_patient_profiles
from app.modules.patient_profile.service import create_patient_profile
from app.modules.questionnaire_intake.repository import clear_questionnaires
from app.modules.recommendation_engine.repository import clear_recommendations
from app.tests.helpers import build_patient_profile_create


def setup_function() -> None:
    clear_orders()
    clear_recommendations()
    clear_questionnaires()
    clear_patient_profiles()


def _address() -> ShippingAddress:
    return ShippingAddress(
        first_name="Maria",
        last_name="Muster",
        street="Heilweg 12",
        postal_code="70173",
        city="Stuttgart",
        country="DE",
    )


def test_create_order_merges_duplicates_and_applies_free_shipping() -> None:
    profile = create_patient_profile(build_patient_profile_create())

    order = create_order(
        OrderCreate(
            patient_id=profile.patient_id,
            items=[
                {"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 1},
                {"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 2},
            ],
            shipping_address=_address(),
            payment_method="card",
            contact_email="maria@example.com",
            contact_phone="+49123456789",
        )
    )

    assert len(order.items) == 1
    assert order.items[0].quantity == 3
    assert order.subtotal == 119.7
    assert order.shipping_cost == 0.0
    assert order.currency == "EUR"


def test_create_order_applies_standard_shipping_below_threshold() -> None:
    profile = create_patient_profile(build_patient_profile_create())

    order = create_order(
        OrderCreate(
            patient_id=profile.patient_id,
            items=[{"meal_kit_id": "produktdetails_darm_balance_box", "quantity": 1}],
            shipping_address=_address(),
            payment_method="card",
            contact_email="maria@example.com",
            contact_phone="+49123456789",
        )
    )

    assert order.subtotal == 37.5
    assert order.shipping_cost == 4.99
    assert order.total == 42.49


def test_create_order_rejects_quantity_above_limit() -> None:
    profile = create_patient_profile(build_patient_profile_create())

    with pytest.raises(HTTPException) as exc_info:
        create_order(
            OrderCreate(
                patient_id=profile.patient_id,
                items=[{"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 11}],
                shipping_address=_address(),
                payment_method="card",
                contact_email="maria@example.com",
                contact_phone="+49123456789",
            )
        )

    assert exc_info.value.status_code == 422


def test_update_order_status_enforces_transition_guard() -> None:
    profile = create_patient_profile(build_patient_profile_create())
    order = create_order(
        OrderCreate(
            patient_id=profile.patient_id,
            items=[{"meal_kit_id": "produktdetails_wundheilungs_box", "quantity": 1}],
            shipping_address=_address(),
            payment_method="card",
            contact_email="maria@example.com",
            contact_phone="+49123456789",
        )
    )

    updated = update_order_status(order.order_id, "processing")
    assert updated.status == "processing"

    with pytest.raises(HTTPException) as exc_info:
        update_order_status(order.order_id, "confirmed")

    assert exc_info.value.status_code == 422
