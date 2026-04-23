"""Root API router."""

from fastapi import APIRouter

from app.api.health import router as health_router
from app.modules.frontend_bff.router import router as frontend_bff_router
from app.modules.meal_kit_catalog.router import router as meal_kit_router
from app.modules.order_handling.router import router as order_router
from app.modules.patient_profile.router import router as patient_profile_router
from app.modules.questionnaire_intake.router import router as questionnaire_router
from app.modules.recommendation_engine.router import router as recommendation_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(patient_profile_router, prefix="/api", tags=["patient-profile"])
api_router.include_router(questionnaire_router, prefix="/api", tags=["questionnaire-intake"])
api_router.include_router(recommendation_router, prefix="/api", tags=["recommendations"])
api_router.include_router(meal_kit_router, prefix="/api", tags=["meal-kits"])
api_router.include_router(order_router, prefix="/api", tags=["orders"])
api_router.include_router(frontend_bff_router, prefix="/api", tags=["frontend-bff"])
