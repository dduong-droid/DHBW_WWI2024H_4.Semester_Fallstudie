"""Risk flag domain schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


RiskSeverity = Literal["low", "medium", "high"]


class RiskFlag(BaseModel):
    id: str
    patient_id: str
    type: str
    severity: RiskSeverity
    title: str
    description: str
    triggered_by: list[str] = Field(default_factory=list)
    recommended_action: str
    requires_professional_review: bool = False
    blocks_automatic_plan: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
