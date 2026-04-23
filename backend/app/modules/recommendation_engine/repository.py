"""In-memory repository for recommendation results."""

from __future__ import annotations

from app.modules.recommendation_engine.schemas import RecommendationResult


_RECOMMENDATIONS: dict[str, RecommendationResult] = {}


def save_recommendation(record: RecommendationResult) -> RecommendationResult:
    _RECOMMENDATIONS[record.recommendation_id] = record
    return record


def get_recommendation(recommendation_id: str) -> RecommendationResult | None:
    return _RECOMMENDATIONS.get(recommendation_id)


def list_recommendations() -> list[RecommendationResult]:
    return list(_RECOMMENDATIONS.values())


def get_latest_recommendation_for_patient(patient_id: str) -> RecommendationResult | None:
    patient_recommendations = [item for item in _RECOMMENDATIONS.values() if item.patient_id == patient_id]
    if not patient_recommendations:
        return None
    return max(patient_recommendations, key=lambda item: item.created_at)


def clear_recommendations() -> None:
    _RECOMMENDATIONS.clear()
