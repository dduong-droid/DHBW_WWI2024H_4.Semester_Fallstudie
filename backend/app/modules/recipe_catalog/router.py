"""Recipe catalog routes."""

from fastapi import APIRouter

from app.modules.recipe_catalog.service import get_recipe_or_404, list_recipes
from app.modules.recommendation_engine.schemas import Recipe


router = APIRouter()


@router.get("/recipes", response_model=list[Recipe])
def get_recipes() -> list[Recipe]:
    return list_recipes()


@router.get("/recipes/{recipe_id}", response_model=Recipe)
def get_recipe(recipe_id: str) -> Recipe:
    return get_recipe_or_404(recipe_id)
