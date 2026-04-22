"""Order handling schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


OrderStatus = Literal["draft", "confirmed", "processing", "completed", "cancelled"]
PaymentMethod = Literal["apple_pay", "card", "invoice"]


class ShippingAddress(BaseModel):
    first_name: str
    last_name: str
    street: str
    postal_code: str
    city: str
    country: str


class OrderItemCreate(BaseModel):
    meal_kit_id: str
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    patient_id: str
    items: list[OrderItemCreate] = Field(min_length=1)
    shipping_address: ShippingAddress
    payment_method: PaymentMethod
    contact_email: str
    contact_phone: str
    notes: str | None = None


class OrderItem(BaseModel):
    meal_kit_id: str
    name: str
    unit_price: float
    quantity: int
    line_total: float


class Order(BaseModel):
    order_id: str
    patient_id: str
    status: OrderStatus
    items: list[OrderItem]
    shipping_address: ShippingAddress
    payment_method: PaymentMethod
    contact_email: str
    contact_phone: str
    notes: str | None = None
    currency: str
    subtotal: float
    shipping_cost: float
    total: float
    estimated_delivery_window: str
    recommendation_fit_note: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
