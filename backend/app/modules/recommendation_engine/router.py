"""Recommendation engine router."""

from fastapi import APIRouter, HTTPException, status

from app.modules.questionnaire_intake.repository import list_questionnaires_for_patient
from app.modules.recommendation_engine.schemas import RecommendationAnalyzeRequest, RecommendationExplanation, RecommendationResult
from app.modules.recommendation_engine.service import (
    analyze_recommendation,
    build_recommendation_explanation,
    get_recommendation_or_404,
)


router = APIRouter()


@router.post("/recommendations/analyze", response_model=RecommendationResult)
def analyze(payload: RecommendationAnalyzeRequest) -> RecommendationResult:
    return analyze_recommendation(payload)


@router.get("/recommendations/{recommendation_id}", response_model=RecommendationResult)
def get_recommendation_result(recommendation_id: str) -> RecommendationResult:
    return get_recommendation_or_404(recommendation_id)


@router.get("/recommendations/{recommendation_id}/explanation", response_model=RecommendationExplanation)
def get_recommendation_explanation(recommendation_id: str) -> RecommendationExplanation:
    recommendation = get_recommendation_or_404(recommendation_id)
    questionnaires = list_questionnaires_for_patient(recommendation.patient_id)
    if not questionnaires:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No questionnaire found for recommendation '{recommendation_id}'.",
        )
    latest_questionnaire = max(questionnaires, key=lambda item: item.created_at)
    return build_recommendation_explanation(recommendation, latest_questionnaire)
