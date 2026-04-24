"""Patient profile schemas."""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


ActivityLevel = Literal["low", "moderate", "high"]
SupportAtHome = Literal["independent", "partial_support", "full_support"]


class PatientProfileBase(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    gender: str | None = None
    email: str
    phone: str
    height_cm: float = Field(gt=0)
    weight_kg: float = Field(gt=0)
    activity_level: ActivityLevel
    support_at_home: SupportAtHome
    known_conditions: list[str] = Field(default_factory=list)
    medical_context: str | None = None
    surgery_type: str | None = None
    discharge_date: date | None = None
    therapy_phase: str | None = None
    allergies: list[str] = Field(default_factory=list)
    dietary_preferences: list[str] = Field(default_factory=list)
    consent_data_processing: bool
    notes: str | None = None


class PatientProfileCreate(PatientProfileBase):
    patient_id: str | None = None


class PatientProfile(PatientProfileBase):
    patient_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
