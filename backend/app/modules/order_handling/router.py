"""Order handling router."""

from fastapi import APIRouter

from app.modules.order_handling.schemas import Order, OrderCreate, OrderStatusUpdate
from app.modules.order_handling.service import create_order, get_order_or_404, update_order_status


router = APIRouter()


@router.post("/orders", response_model=Order)
def create_order_route(payload: OrderCreate) -> Order:
    return create_order(payload)


@router.get("/orders/{order_id}", response_model=Order)
def get_order_route(order_id: str) -> Order:
    return get_order_or_404(order_id)


@router.patch("/orders/{order_id}/status", response_model=Order)
def update_order_status_route(order_id: str, payload: OrderStatusUpdate) -> Order:
    return update_order_status(order_id, payload.status)
