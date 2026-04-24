"""Recipe catalog service based on the rule-engine templates."""

from __future__ import annotations

from fastapi import HTTPException, status

from app.modules.recommendation_engine.rules import get_recipe_template, list_all_recipe_templates
from app.modules.recommendation_engine.schemas import Recipe


def list_recipes() -> list[Recipe]:
    return list_all_recipe_templates()


def get_recipe_or_404(recipe_id: str) -> Recipe:
    recipe = get_recipe_template(recipe_id)
    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe '{recipe_id}' was not found.",
        )
    return recipe
