"""Frontend-facing BFF router."""

from fastapi import APIRouter

from app.modules.frontend_bff.schemas import (
    FrontendCuratedMeal,
    FrontendDailyProgress,
    FrontendHydrationProgress,
    FrontendMealKit,
    FrontendNutritionPlan,
    FrontendShopInventory,
    FullAnalyzeRequest,
    FullAnalyzeResponse,
    HydrationUpdateRequest,
)
from app.modules.frontend_bff.service import (
    add_frontend_hydration,
    get_frontend_curated_meals,
    get_frontend_daily_progress,
    get_frontend_hydration_progress,
    get_frontend_meal_kit,
    get_frontend_nutrition_plan,
    get_frontend_shop_inventory,
    run_full_analyze,
    track_meal_box,
)


router = APIRouter()


@router.post("/frontend/intake/full-analyze", response_model=FullAnalyzeResponse)
def full_analyze(payload: FullAnalyzeRequest) -> FullAnalyzeResponse:
    return run_full_analyze(payload)


@router.get("/frontend/nutrition-plan/{patient_id}", response_model=FrontendNutritionPlan)
def get_nutrition_plan(patient_id: str) -> FrontendNutritionPlan:
    return get_frontend_nutrition_plan(patient_id)


@router.get("/frontend/shop/inventory", response_model=FrontendShopInventory)
def get_shop_inventory() -> FrontendShopInventory:
    return get_frontend_shop_inventory()


@router.get("/frontend/shop/meal-kits/{meal_kit_id}", response_model=FrontendMealKit)
def get_shop_meal_kit(meal_kit_id: str) -> FrontendMealKit:
    return get_frontend_meal_kit(meal_kit_id)


@router.get("/frontend/recipes/curated/{patient_id}", response_model=list[FrontendCuratedMeal])
def get_curated_recipes(patient_id: str) -> list[FrontendCuratedMeal]:
    return get_frontend_curated_meals(patient_id)


@router.get("/frontend/tracking/daily/{patient_id}", response_model=FrontendDailyProgress)
def get_daily_tracking(patient_id: str) -> FrontendDailyProgress:
    return get_frontend_daily_progress(patient_id)


@router.post("/frontend/tracking/daily/{patient_id}/meal-box", response_model=FrontendDailyProgress)
def post_meal_box_tracking(patient_id: str) -> FrontendDailyProgress:
    return track_meal_box(patient_id)


@router.get("/frontend/tracking/hydration/{patient_id}", response_model=FrontendHydrationProgress)
def get_hydration_tracking(patient_id: str) -> FrontendHydrationProgress:
    return get_frontend_hydration_progress(patient_id)


@router.post("/frontend/tracking/hydration/{patient_id}/water", response_model=FrontendHydrationProgress)
def post_hydration_tracking(patient_id: str, payload: HydrationUpdateRequest) -> FrontendHydrationProgress:
    return add_frontend_hydration(patient_id, payload.amountMl)
