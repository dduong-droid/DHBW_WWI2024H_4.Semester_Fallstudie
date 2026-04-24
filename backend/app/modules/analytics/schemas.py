"""Internal analytics schemas."""

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field


class AnalyticsEventCreate(BaseModel):
    event_type: str
    patient_id: str | None = None
    metadata: dict[str, object] = Field(default_factory=dict)


class AnalyticsEvent(BaseModel):
    event_id: str
    event_type: str
    patient_id: str | None = None
    metadata: dict[str, object] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AnalyticsSummary(BaseModel):
    total_events: int
    events_by_type: dict[str, int] = Field(default_factory=dict)
    patient_count: int
    risk_flag_count: int
    review_required_count: int
    plan_generated_count: int
    tracking_submitted_count: int


class RiskFlagAnalytics(BaseModel):
    counts_by_type: dict[str, int] = Field(default_factory=dict)
    counts_by_severity: dict[str, int] = Field(default_factory=dict)


class FunnelAnalytics(BaseModel):
    intake_started: int = 0
    intake_completed: int = 0
    assessment_generated: int = 0
    plan_generated: int = 0
    shopping_list_generated: int = 0
    tracking_submitted: int = 0
