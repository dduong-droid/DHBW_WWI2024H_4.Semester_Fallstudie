"""Mapping helpers between domain models and frontend API contracts."""

from __future__ import annotations

from app.modules.frontend_bff.schemas import (
    FrontendDailyPlan,
    FrontendDailyPlanMeals,
    FrontendDiagnosis,
    FrontendMealKit,
    FrontendNutritionalValues,
    FrontendNutritionPlan,
    FrontendRecipe,
    FrontendRecipeMacros,
    FrontendShopInventory,
)
from app.modules.meal_kit_catalog.schemas import MealKit
from app.modules.recommendation_engine.schemas import DailyPlan, RecommendationResult, Recipe


_TEMPLATE_TO_CONDITION = {
    "chemo_easy_digest": "chemo_related_appetite_loss",
    "gut_balance_recovery": "gut_sensitivity",
    "post_op_high_protein": "post_op_recovery",
    "energy_rebuild": "energy_support",
    "balanced_general_recovery": "general_recovery",
}


def map_recipe(recipe: Recipe) -> FrontendRecipe:
    return FrontendRecipe(
        id=recipe.id,
        name=recipe.name,
        description=recipe.description,
        prepTimeMinutes=recipe.prep_time_minutes,
        calories=recipe.calories,
        macros=FrontendRecipeMacros(
            protein=recipe.protein,
            carbs=recipe.carbs,
            fat=recipe.fat,
        ),
        ingredients=recipe.ingredients,
        instructions=[],
    )


def map_daily_plan(day: DailyPlan) -> FrontendDailyPlan:
    return FrontendDailyPlan(
        day=day.day,
        meals=FrontendDailyPlanMeals(
            breakfast=map_recipe(day.meals.breakfast),
            lunch=map_recipe(day.meals.lunch),
            dinner=map_recipe(day.meals.dinner),
            snacks=[map_recipe(item) for item in day.meals.snacks],
        ),
        totalMetrics=day.total_metrics,
    )


def _diagnosis_condition(recommendation: RecommendationResult) -> str:
    template_id = recommendation.recommended_weekly_plan.template_id
    return _TEMPLATE_TO_CONDITION.get(template_id, "general_recovery")


def _diagnosis_recommendations(recommendation: RecommendationResult) -> list[str]:
    combined_lines = recommendation.recommended_weekly_plan.adjustments + recommendation.rationale
    deduped: list[str] = []
    for line in combined_lines:
        if line not in deduped:
            deduped.append(line)
    return deduped[:5]


def map_recommendation_to_nutrition_plan(recommendation: RecommendationResult) -> FrontendNutritionPlan:
    return FrontendNutritionPlan(
        id=recommendation.recommendation_id,
        userId=recommendation.patient_id,
        diagnosis=FrontendDiagnosis(
            condition=_diagnosis_condition(recommendation),
            recommendations=_diagnosis_recommendations(recommendation),
            restrictions=recommendation.dietary_warnings,
        ),
        weeklyPlan=[map_daily_plan(day) for day in recommendation.recommended_weekly_plan.days],
    )


def map_meal_kit(meal_kit: MealKit) -> FrontendMealKit:
    return FrontendMealKit(
        id=meal_kit.id,
        name=meal_kit.name,
        description=meal_kit.description,
        price=meal_kit.price,
        currency=meal_kit.currency,
        imageUrl=meal_kit.image_url,
        nutritionalValues=FrontendNutritionalValues(
            calories=meal_kit.nutritional_values.calories,
            protein=meal_kit.nutritional_values.protein,
            carbs=meal_kit.nutritional_values.carbs,
            fat=meal_kit.nutritional_values.fat,
            fiber=meal_kit.nutritional_values.fiber,
        ),
        dietaryTags=meal_kit.dietary_tags,
        meals=meal_kit.meals,
        servings=meal_kit.servings,
    )


def map_meal_kits_to_inventory(meal_kits: list[MealKit]) -> FrontendShopInventory:
    return FrontendShopInventory(availableMealKits=[map_meal_kit(item) for item in meal_kits])
