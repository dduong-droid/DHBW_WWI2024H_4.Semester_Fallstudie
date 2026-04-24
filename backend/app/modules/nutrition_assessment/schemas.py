"""Nutrition assessment schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from app.modules.risk_flags.schemas import RiskFlag


NutritionRiskStatus = Literal["lowRisk", "moderateRisk", "highRisk", "insufficientData"]
RecommendationReadiness = Literal["ready", "reviewRequired", "insufficientData"]


class NutritionAssessment(BaseModel):
    assessment_id: str
    patient_id: str
    intake_id: str
    intake_summary: dict[str, object] = Field(default_factory=dict)
    nutrition_status: NutritionRiskStatus
    main_problems: list[str] = Field(default_factory=list)
    relevant_constraints: list[str] = Field(default_factory=list)
    risk_flags: list[RiskFlag] = Field(default_factory=list)
    recommendation_readiness: RecommendationReadiness
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
