"""Shopping list schemas."""

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field


class ShoppingListCreateFromPlan(BaseModel):
    nutrition_plan_id: str


class ShoppingListItem(BaseModel):
    name: str
    quantity: float = Field(gt=0)
    unit: str
    category: str
    related_recipes: list[str] = Field(default_factory=list)
    checked: bool = False


class ShoppingList(BaseModel):
    shopping_list_id: str
    patient_id: str
    plan_id: str
    items: list[ShoppingListItem] = Field(default_factory=list)
    grouped_by_category: dict[str, list[ShoppingListItem]] = Field(default_factory=dict)
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
