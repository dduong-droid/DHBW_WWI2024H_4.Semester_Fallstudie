"""Frontend BFF service layer."""

from __future__ import annotations

from app.modules.frontend_bff.curated_templates import build_curated_meals
from app.modules.frontend_bff.mappers import (
    map_meal_kit,
    map_meal_kits_to_inventory,
    map_recommendation_to_nutrition_plan,
)
from app.modules.frontend_bff.schemas import (
    FrontendCuratedMeal,
    FrontendDailyProgress,
    FrontendHydrationProgress,
    FrontendMealKit,
    FrontendNutritionPlan,
    FrontendPurchasedKit,
    FrontendPurchasedKitsResponse,
    FrontendShopInventory,
    FullAnalyzeRequest,
    FullAnalyzeResponse,
)
from app.modules.frontend_bff.tracking_repository import (
    add_water,
    get_daily_progress,
    get_hydration_progress,
    mark_meal_box_eaten,
)
from app.modules.meal_kit_catalog.repository import get_meal_kit
from app.modules.meal_kit_catalog.service import get_active_meal_kits, get_meal_kit_or_404
from app.modules.patient_profile.service import create_patient_profile, get_patient_profile_or_404
from app.modules.questionnaire_intake.schemas import QuestionnaireIntakeCreate
from app.modules.questionnaire_intake.service import create_questionnaire_intake
from app.modules.recommendation_engine.schemas import RecommendationAnalyzeRequest, RecommendationResult
from app.modules.recommendation_engine.service import analyze_recommendation, get_latest_recommendation_for_patient_or_404


def _map_recommended_meal_kits(recommendation: RecommendationResult) -> list[FrontendMealKit]:
    meal_kits: list[FrontendMealKit] = []
    for recommendation_item in recommendation.recommended_meal_kits:
        meal_kit = get_meal_kit(recommendation_item.meal_kit_id)
        if meal_kit is None or not meal_kit.is_active:
            continue
        meal_kits.append(map_meal_kit(meal_kit))
    return meal_kits


def run_full_analyze(payload: FullAnalyzeRequest) -> FullAnalyzeResponse:
    profile = create_patient_profile(payload.patientProfile)
    intake = create_questionnaire_intake(
        QuestionnaireIntakeCreate(
            patient_id=profile.patient_id,
            **payload.questionnaire.model_dump(),
        )
    )
    recommendation = analyze_recommendation(RecommendationAnalyzeRequest(intake_id=intake.intake_id))
    recommended_meal_kits = _map_recommended_meal_kits(recommendation)
    return FullAnalyzeResponse(
        patientId=profile.patient_id,
        intakeId=intake.intake_id,
        recommendationId=recommendation.recommendation_id,
        nutritionPlan=map_recommendation_to_nutrition_plan(recommendation),
        recommendedMealKits=recommended_meal_kits,
        summary=recommendation.summary,
        rationale=recommendation.rationale,
    )


def get_frontend_nutrition_plan(patient_id: str) -> FrontendNutritionPlan:
    recommendation = get_latest_recommendation_for_patient_or_404(patient_id)
    return map_recommendation_to_nutrition_plan(recommendation)


def get_frontend_shop_inventory() -> FrontendShopInventory:
    return map_meal_kits_to_inventory(get_active_meal_kits())


def get_frontend_meal_kit(meal_kit_id: str) -> FrontendMealKit:
    return map_meal_kit(get_meal_kit_or_404(meal_kit_id))


def get_frontend_curated_meals(patient_id: str) -> list[FrontendCuratedMeal]:
    recommendation = get_latest_recommendation_for_patient_or_404(patient_id)
    recommended_kits = []
    for item in recommendation.recommended_meal_kits:
        meal_kit = get_meal_kit(item.meal_kit_id)
        if meal_kit is not None and meal_kit.is_active:
            recommended_kits.append(meal_kit)
    return build_curated_meals(recommendation, recommended_kits)


def get_frontend_daily_progress(patient_id: str) -> FrontendDailyProgress:
    get_patient_profile_or_404(patient_id)
    return get_daily_progress(patient_id)


def track_meal_box(patient_id: str) -> FrontendDailyProgress:
    get_patient_profile_or_404(patient_id)
    return mark_meal_box_eaten(patient_id)


def get_frontend_hydration_progress(patient_id: str) -> FrontendHydrationProgress:
    get_patient_profile_or_404(patient_id)
    return get_hydration_progress(patient_id)


def add_frontend_hydration(patient_id: str, amount_ml: int) -> FrontendHydrationProgress:
    get_patient_profile_or_404(patient_id)
    return add_water(patient_id, amount_ml)


def get_frontend_purchased_kits(patient_id: str) -> FrontendPurchasedKitsResponse:
    """Return all purchased meal kits for a patient, aggregated across orders."""
    from app.modules.order_handling.repository import list_orders_for_patient

    get_patient_profile_or_404(patient_id)
    orders = list_orders_for_patient(patient_id)

    # Only consider confirmed/processing/completed orders
    valid_statuses = {"confirmed", "processing", "completed"}
    aggregated: dict[str, int] = {}
    for order in orders:
        if order.status not in valid_statuses:
            continue
        for item in order.items:
            aggregated[item.meal_kit_id] = aggregated.get(item.meal_kit_id, 0) + item.quantity

    purchased_kits: list[FrontendPurchasedKit] = []
    for meal_kit_id, quantity in aggregated.items():
        meal_kit = get_meal_kit(meal_kit_id)
        if meal_kit is None or not meal_kit.is_active:
            continue
        frontend_kit = map_meal_kit(meal_kit)
        purchased_kits.append(
            FrontendPurchasedKit(
                id=frontend_kit.id,
                name=frontend_kit.name,
                description=frontend_kit.description,
                price=frontend_kit.price,
                currency=frontend_kit.currency,
                imageUrl=frontend_kit.imageUrl,
                nutritionalValues=frontend_kit.nutritionalValues,
                dietaryTags=frontend_kit.dietaryTags,
                meals=frontend_kit.meals,
                servings=frontend_kit.servings,
                quantity=quantity,
            )
        )
    return FrontendPurchasedKitsResponse(purchasedKits=purchased_kits)
