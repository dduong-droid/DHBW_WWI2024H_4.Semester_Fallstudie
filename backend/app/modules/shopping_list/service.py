"""Shopping list generation from nutrition plans."""

from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.modules.analytics.service import record_event
from app.modules.nutrition_plan.service import get_nutrition_plan_or_404
from app.modules.recommendation_engine.schemas import Recipe
from app.modules.shopping_list.repository import (
    get_latest_shopping_list_for_patient,
    get_shopping_list,
    get_shopping_list_by_plan,
    save_shopping_list,
)
from app.modules.shopping_list.schemas import ShoppingList, ShoppingListCreateFromPlan, ShoppingListItem


_CATEGORY_MARKERS: dict[str, set[str]] = {
    "Protein": {"huhn", "haehnchen", "pute", "lachs", "kabeljau", "fisch", "tofu", "ei", "protein"},
    "Getreide und Beilagen": {"reis", "quinoa", "hafer", "hirse", "kartoffel", "kartoffeln", "pasta", "polenta"},
    "Obst": {"banane", "beeren", "apfel", "birne"},
    "Gemuese": {"brokkoli", "karotte", "karotten", "zucchini", "fenchel", "spinat", "paprika", "gemuese"},
    "Basis": {"pflanzendrink", "haferdrink", "bruehe", "zucker", "zimt", "samen", "leinsamen"},
}


def _category_for_ingredient(ingredient: str) -> str:
    lowered = ingredient.lower()
    for category, markers in _CATEGORY_MARKERS.items():
        if any(marker in lowered for marker in markers):
            return category
    return "Sonstiges"


def _plan_recipes(plan_id: str) -> tuple[str, str, list[Recipe]]:
    plan = get_nutrition_plan_or_404(plan_id)
    recipes: list[Recipe] = []
    for day in plan.weekly_plan.days:
        recipes.extend([day.meals.breakfast, day.meals.lunch, day.meals.dinner, *day.meals.snacks])
    return plan.patient_id, plan.plan_id, recipes


def create_shopping_list_from_plan(payload: ShoppingListCreateFromPlan) -> ShoppingList:
    existing = get_shopping_list_by_plan(payload.nutrition_plan_id)
    if existing is not None:
        return existing

    patient_id, plan_id, recipes = _plan_recipes(payload.nutrition_plan_id)
    aggregated: dict[str, ShoppingListItem] = {}
    for recipe in recipes:
        for ingredient in recipe.ingredients:
            key = ingredient.strip().lower()
            if not key:
                continue
            if key not in aggregated:
                aggregated[key] = ShoppingListItem(
                    name=ingredient,
                    quantity=1,
                    unit="Portion",
                    category=_category_for_ingredient(ingredient),
                    related_recipes=[],
                )
            else:
                aggregated[key].quantity += 1
            if recipe.id not in aggregated[key].related_recipes:
                aggregated[key].related_recipes.append(recipe.id)

    items = sorted(aggregated.values(), key=lambda item: (item.category, item.name.lower()))
    grouped: dict[str, list[ShoppingListItem]] = defaultdict(list)
    for item in items:
        grouped[item.category].append(item)

    shopping_list = ShoppingList(
        shopping_list_id=f"shopping_{plan_id}",
        patient_id=patient_id,
        plan_id=plan_id,
        items=items,
        grouped_by_category=dict(grouped),
        generated_at=datetime.now(timezone.utc),
    )
    saved = save_shopping_list(shopping_list)
    record_event(
        "shopping_list_generated",
        patient_id=patient_id,
        metadata={"shopping_list_id": saved.shopping_list_id, "plan_id": plan_id},
    )
    return saved


def get_shopping_list_or_404(shopping_list_id: str) -> ShoppingList:
    shopping_list = get_shopping_list(shopping_list_id)
    if shopping_list is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shopping list '{shopping_list_id}' was not found.",
        )
    return shopping_list


def get_latest_shopping_list_for_patient_or_404(patient_id: str) -> ShoppingList:
    shopping_list = get_latest_shopping_list_for_patient(patient_id)
    if shopping_list is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No shopping list found for patient '{patient_id}'.",
        )
    return shopping_list
