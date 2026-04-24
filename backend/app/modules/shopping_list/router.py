"""Shopping list API routes."""

from fastapi import APIRouter

from app.modules.shopping_list.schemas import ShoppingList, ShoppingListCreateFromPlan
from app.modules.shopping_list.service import (
    create_shopping_list_from_plan,
    get_latest_shopping_list_for_patient_or_404,
    get_shopping_list_or_404,
)


router = APIRouter()


@router.post("/shopping-lists/from-nutrition-plan", response_model=ShoppingList)
def create_from_plan(payload: ShoppingListCreateFromPlan) -> ShoppingList:
    return create_shopping_list_from_plan(payload)


@router.post("/nutrition-plans/{plan_id}/shopping-list", response_model=ShoppingList)
def create_from_plan_path(plan_id: str) -> ShoppingList:
    return create_shopping_list_from_plan(ShoppingListCreateFromPlan(nutrition_plan_id=plan_id))


@router.get("/shopping-lists/{shopping_list_id}", response_model=ShoppingList)
def get_shopping_list_item(shopping_list_id: str) -> ShoppingList:
    return get_shopping_list_or_404(shopping_list_id)


@router.get("/shopping-lists/patient/{patient_id}/latest", response_model=ShoppingList)
def get_latest_for_patient(patient_id: str) -> ShoppingList:
    return get_latest_shopping_list_for_patient_or_404(patient_id)
