"""Recommendation engine router."""

from fastapi import APIRouter

from app.modules.recommendation_engine.schemas import RecommendationAnalyzeRequest, RecommendationResult
from app.modules.recommendation_engine.service import analyze_recommendation, get_recommendation_or_404


router = APIRouter()


@router.post("/recommendations/analyze", response_model=RecommendationResult)
def analyze(payload: RecommendationAnalyzeRequest) -> RecommendationResult:
    return analyze_recommendation(payload)


@router.get("/recommendations/{recommendation_id}", response_model=RecommendationResult)
def get_recommendation_result(recommendation_id: str) -> RecommendationResult:
    return get_recommendation_or_404(recommendation_id)
