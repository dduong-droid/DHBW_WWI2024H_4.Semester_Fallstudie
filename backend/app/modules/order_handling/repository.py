"""In-memory repository for orders."""

from __future__ import annotations

from app.modules.order_handling.schemas import Order


_ORDERS: dict[str, Order] = {}


def save_order(order: Order) -> Order:
    _ORDERS[order.order_id] = order
    return order


def get_order(order_id: str) -> Order | None:
    return _ORDERS.get(order_id)


def clear_orders() -> None:
    _ORDERS.clear()
