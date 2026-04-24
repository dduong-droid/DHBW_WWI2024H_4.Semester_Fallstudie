"""Symptom, weight and appetite tracking schemas."""

from __future__ import annotations

from datetime import date, datetime, timezone

from pydantic import BaseModel, Field

from app.modules.risk_flags.schemas import RiskFlag


class SymptomTrackingCreate(BaseModel):
    date: date
    weight: float | None = Field(default=None, gt=0)
    appetite_score: int = Field(ge=1, le=5)
    meals_completed: int = Field(ge=0)
    fluid_intake_ml: int | None = Field(default=None, ge=0)
    nausea_score: int = Field(ge=0, le=5)
    pain_score: int | None = Field(default=None, ge=0, le=5)
    stool_issue: str | None = None
    notes: str | None = None


class SymptomTrackingRecord(BaseModel):
    tracking_id: str
    patient_id: str
    date: date
    weight: float | None = None
    appetite_score: int = Field(ge=1, le=5)
    meals_completed: int = Field(ge=0)
    fluid_intake_ml: int | None = None
    nausea_score: int = Field(ge=0, le=5)
    pain_score: int | None = None
    stool_issue: str | None = None
    notes: str | None = None
    generated_risk_flags: list[RiskFlag] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
