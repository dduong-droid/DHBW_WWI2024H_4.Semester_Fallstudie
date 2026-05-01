"""Root API router."""

from fastapi import APIRouter, Depends

from app.api.health import router as health_router
from app.core.security import require_api_key
from app.modules.analytics.router import router as analytics_router
from app.modules.document_upload.router import router as document_upload_router
from app.modules.frontend_bff.router import router as frontend_bff_router
from app.modules.meal_kit_catalog.router import router as meal_kit_router
from app.modules.nutrition_assessment.router import router as nutrition_assessment_router
from app.modules.nutrition_plan.router import router as nutrition_plan_router
from app.modules.order_handling.router import router as order_router
from app.modules.patient_profile.router import router as patient_profile_router
from app.modules.professional_review.router import router as professional_review_router
from app.modules.questionnaire_intake.router import router as questionnaire_router
from app.modules.recipe_catalog.router import router as recipe_router
from app.modules.recommendation_engine.router import router as recommendation_router
from app.modules.risk_flags.router import router as risk_flags_router
from app.modules.safety_check.router import router as safety_check_router
from app.modules.shopping_list.router import router as shopping_list_router
from app.modules.symptom_tracking.router import router as symptom_tracking_router

api_router = APIRouter()
api_router.include_router(health_router)
protected = [Depends(require_api_key)]
api_router.include_router(patient_profile_router, prefix="/api", tags=["patient-profile"], dependencies=protected)
api_router.include_router(questionnaire_router, prefix="/api", tags=["questionnaire-intake"], dependencies=protected)
api_router.include_router(nutrition_assessment_router, prefix="/api", tags=["nutrition-assessment"], dependencies=protected)
api_router.include_router(risk_flags_router, prefix="/api", tags=["risk-flags"], dependencies=protected)
api_router.include_router(recommendation_router, prefix="/api", tags=["recommendations"], dependencies=protected)
api_router.include_router(nutrition_plan_router, prefix="/api", tags=["nutrition-plans"], dependencies=protected)
api_router.include_router(meal_kit_router, prefix="/api", tags=["meal-kits"])
api_router.include_router(recipe_router, prefix="/api", tags=["recipes"])
api_router.include_router(shopping_list_router, prefix="/api", tags=["shopping-lists"], dependencies=protected)
api_router.include_router(symptom_tracking_router, prefix="/api", tags=["symptom-tracking"], dependencies=protected)
api_router.include_router(professional_review_router, prefix="/api", tags=["professional-reviews"], dependencies=protected)
api_router.include_router(analytics_router, prefix="/api", tags=["analytics"], dependencies=protected)
api_router.include_router(document_upload_router, prefix="/api", tags=["documents"], dependencies=protected)
api_router.include_router(order_router, prefix="/api", tags=["orders"], dependencies=protected)
api_router.include_router(frontend_bff_router, prefix="/api", tags=["frontend-bff"], dependencies=protected)
api_router.include_router(safety_check_router, prefix="/api", tags=["safety-check"], dependencies=protected)
