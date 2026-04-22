"""Order handling router."""

from fastapi import APIRouter

from app.modules.order_handling.schemas import Order, OrderCreate
from app.modules.order_handling.service import create_order, get_order_or_404


router = APIRouter()


@router.post("/orders", response_model=Order)
def create_order_route(payload: OrderCreate) -> Order:
    return create_order(payload)


@router.get("/orders/{order_id}", response_model=Order)
def get_order_route(order_id: str) -> Order:
    return get_order_or_404(order_id)
