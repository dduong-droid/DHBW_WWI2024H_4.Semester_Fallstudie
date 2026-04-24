"""Professional review workflow schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


ReviewStatus = Literal["pending", "approved", "rejected", "changes_requested"]
ReviewerRole = Literal["nutritionist", "doctor", "admin_mock"]


class ProfessionalReviewCreate(BaseModel):
    patient_id: str
    plan_id: str | None = None
    source: str = "manual"
    risk_flag_ids: list[str] = Field(default_factory=list)
    comments: str | None = None


class ProfessionalReviewUpdate(BaseModel):
    status: ReviewStatus
    reviewer_role: ReviewerRole = "admin_mock"
    reviewer_name: str | None = None
    comments: str | None = None


class ProfessionalReview(BaseModel):
    review_id: str
    patient_id: str
    plan_id: str | None = None
    status: ReviewStatus = "pending"
    reviewer_role: ReviewerRole = "admin_mock"
    reviewer_name: str | None = None
    comments: str | None = None
    source: str = "manual"
    risk_flag_ids: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
