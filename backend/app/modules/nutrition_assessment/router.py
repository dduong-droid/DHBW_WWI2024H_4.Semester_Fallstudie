"""Nutrition assessment routes."""

from fastapi import APIRouter

from app.modules.nutrition_assessment.schemas import NutritionAssessment
from app.modules.nutrition_assessment.service import (
    create_assessment_for_patient,
    get_latest_assessment_for_patient_or_404,
)


router = APIRouter()


@router.post("/patients/{patient_id}/assessment", response_model=NutritionAssessment)
def create_patient_assessment(patient_id: str) -> NutritionAssessment:
    return create_assessment_for_patient(patient_id)


@router.get("/patients/{patient_id}/assessment", response_model=NutritionAssessment)
def get_patient_assessment(patient_id: str) -> NutritionAssessment:
    return get_latest_assessment_for_patient_or_404(patient_id)
