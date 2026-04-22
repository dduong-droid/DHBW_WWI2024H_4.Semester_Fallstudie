"""In-memory repository for recommendation results."""

from __future__ import annotations

from app.modules.recommendation_engine.schemas import RecommendationResult


_RECOMMENDATIONS: dict[str, RecommendationResult] = {}


def save_recommendation(record: RecommendationResult) -> RecommendationResult:
    _RECOMMENDATIONS[record.recommendation_id] = record
    return record


def get_recommendation(recommendation_id: str) -> RecommendationResult | None:
    return _RECOMMENDATIONS.get(recommendation_id)


def clear_recommendations() -> None:
    _RECOMMENDATIONS.clear()
