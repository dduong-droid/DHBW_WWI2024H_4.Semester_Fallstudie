"""Safety and contraindication checks."""

from __future__ import annotations

from fastapi import HTTPException

from app.modules.meal_kit_catalog.service import get_meal_kit_or_404
from app.modules.patient_profile.service import get_patient_profile_or_404
from app.modules.questionnaire_intake.repository import list_questionnaires_for_patient
from app.modules.recommendation_engine.schemas import Recipe
from app.modules.recommendation_engine.service import get_latest_recommendation_for_patient_or_404, get_recommendation_or_404
from app.modules.safety_check.schemas import (
    SafetyBlockedMealKit,
    SafetyCheckRequest,
    SafetyCheckResponse,
    SafetyWarning,
)


_INGREDIENT_CONFLICTS: dict[str, set[str]] = {
    "gluten": {"hafer", "pasta", "gries", "polenta"},
    "lactose": {"joghurt", "skyr", "kefir", "milch", "quark"},
    "nuts": {"mandel", "mandeln", "nuss", "nuesse"},
}


def _patient_risk_terms(patient_id: str) -> set[str]:
    profile = get_patient_profile_or_404(patient_id)
    terms = {item.lower() for item in profile.allergies}
    questionnaires = list_questionnaires_for_patient(patient_id)
    if questionnaires:
        latest_questionnaire = max(questionnaires, key=lambda item: item.created_at)
        terms.update(item.lower() for item in latest_questionnaire.gut_health.food_intolerances)
    return terms


def _recipe_conflicts(recipe: Recipe, risk_terms: set[str]) -> list[str]:
    ingredients = {ingredient.lower() for ingredient in recipe.ingredients}
    conflicts: list[str] = []
    for risk_term in sorted(risk_terms):
        conflict_markers = _INGREDIENT_CONFLICTS.get(risk_term, {risk_term})
        if ingredients & conflict_markers:
            conflicts.append(risk_term)
    return conflicts


def _recipes_from_recommendation(recommendation_id: str | None, patient_id: str) -> list[Recipe]:
    if recommendation_id:
        recommendation = get_recommendation_or_404(recommendation_id)
    else:
        recommendation = get_latest_recommendation_for_patient_or_404(patient_id)
    recipes: list[Recipe] = []
    for day in recommendation.recommended_weekly_plan.days:
        recipes.extend(
            [
                day.meals.breakfast,
                day.meals.lunch,
                day.meals.dinner,
                *day.meals.snacks,
            ]
        )
    return recipes


def run_safety_check(payload: SafetyCheckRequest) -> SafetyCheckResponse:
    risk_terms = _patient_risk_terms(payload.patient_id)
    checked_meal_kits: list[str] = []
    blocked_meal_kits: list[SafetyBlockedMealKit] = []
    warnings: list[SafetyWarning] = []

    for meal_kit_id in payload.meal_kit_ids:
        meal_kit = get_meal_kit_or_404(meal_kit_id)
        checked_meal_kits.append(meal_kit.id)
        contraindication_hits = sorted(set(meal_kit.contraindications) & risk_terms)
        if contraindication_hits:
            blocked_meal_kits.append(
                SafetyBlockedMealKit(
                    meal_kit_id=meal_kit.id,
                    name=meal_kit.name,
                    reasons=[f"Kontraindikation: {item}" for item in contraindication_hits],
                )
            )

    checked_recipe_ids: list[str] = []
    if payload.recommendation_id:
        recipes = _recipes_from_recommendation(payload.recommendation_id, payload.patient_id)
    else:
        try:
            recipes = _recipes_from_recommendation(None, payload.patient_id)
        except HTTPException:
            recipes = []

    for recipe in recipes:
        checked_recipe_ids.append(recipe.id)
        conflicts = _recipe_conflicts(recipe, risk_terms)
        if conflicts:
            warnings.append(
                SafetyWarning(
                    code="recipe_ingredient_conflict",
                    message=f"Rezept '{recipe.name}' enthaelt moegliche Konflikte: {', '.join(conflicts)}.",
                    item_id=recipe.id,
                    conflicts=conflicts,
                )
            )

    status = "clear"
    if warnings:
        status = "warning"
    if blocked_meal_kits:
        status = "blocked"
    return SafetyCheckResponse(
        status=status,
        blocked_meal_kits=blocked_meal_kits,
        warnings=warnings,
        checked_meal_kits=checked_meal_kits,
        checked_recipe_ids=checked_recipe_ids,
    )
