"""Questionnaire intake schemas."""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field


AppetiteLevel = Literal["good", "variable", "reduced", "minimal"]
IntakeChange = Literal["same", "slightly_less", "significantly_less"]
DietStyle = Literal["mixed", "vegetarian", "vegan", "medical", "religious", "custom"]
SmokingStatus = Literal["no", "yes", "former"]
FatigueLevel = Literal["none", "light", "moderate", "high"]
SleepQuality = Literal["good", "variable", "poor"]
IntakeStatus = Literal["completed"]


class BodyMeasurements(BaseModel):
    body_fat_percent: float | None = Field(default=None, ge=0, le=100)
    upper_arm_cm: float | None = Field(default=None, gt=0)
    chest_cm: float | None = Field(default=None, gt=0)
    waist_cm: float | None = Field(default=None, gt=0)
    abdomen_cm: float | None = Field(default=None, gt=0)
    hips_cm: float | None = Field(default=None, gt=0)
    thigh_cm: float | None = Field(default=None, gt=0)


class PersonalAndBodyData(BaseModel):
    first_name: str
    last_name: str
    birth_date: date
    phone: str
    email: str
    profession: str
    height_cm: float = Field(gt=0)
    weight_kg: float = Field(gt=0)
    measurements: BodyMeasurements = Field(default_factory=BodyMeasurements)


class ActivityAndMovement(BaseModel):
    daily_steps: int = Field(ge=0)
    sports_per_week: int = Field(ge=0)
    sports_description: str | None = None


class SupplementEntry(BaseModel):
    name: str
    dosage: str


class MedicationAndSupplements(BaseModel):
    medications: list[str] = Field(default_factory=list)
    supplements: list[SupplementEntry] = Field(default_factory=list)


class GutHealth(BaseModel):
    last_antibiotic_date: date | None = None
    antibiotic_duration_days: int | None = Field(default=None, ge=0)
    food_intolerances: list[str] = Field(default_factory=list)


class NutritionStatus(BaseModel):
    appetite_level: AppetiteLevel
    intake_change_vs_past: IntakeChange
    meals_per_day: int = Field(ge=0)
    eating_difficulties: list[str] = Field(default_factory=list)
    digestive_symptoms: list[str] = Field(default_factory=list)


class EatingHabits(BaseModel):
    typical_day_summary: str
    preferred_foods: list[str] = Field(default_factory=list)
    disliked_foods: list[str] = Field(default_factory=list)
    diet_style: DietStyle
    diet_style_notes: str | None = None
    cultural_requirements: str | None = None
    can_cook: bool
    receives_support_for_cooking: bool
    fluid_intake_ml_per_day: int = Field(ge=0)
    alcohol_notes: str | None = None
    smoking_status: SmokingStatus


class RecoveryIndicators(BaseModel):
    infections_last_year: int = Field(ge=0)
    wound_healing_issues: bool
    fatigue_level: FatigueLevel
    sleep_quality: SleepQuality


class GoalsAndExpectations(BaseModel):
    goals: list[str] = Field(default_factory=list)
    expectation_notes: str | None = None


class QuestionnaireContent(BaseModel):
    personal_and_body_data: PersonalAndBodyData
    activity_and_movement: ActivityAndMovement
    medication_and_supplements: MedicationAndSupplements
    gut_health: GutHealth
    nutrition_status: NutritionStatus
    eating_habits: EatingHabits
    recovery_indicators: RecoveryIndicators
    goals_and_expectations: GoalsAndExpectations
    additional_notes: str | None = None


class DerivedFlags(BaseModel):
    post_op_recovery: bool = False
    chemo_related_appetite_loss: bool = False
    gut_sensitivity: bool = False
    high_fatigue: bool = False
    needs_easy_prep: bool = False
    high_protein_need: bool = False
    anti_inflammatory_focus: bool = False
    immune_focus: bool = False
    oncology_context: bool = False
    energy_support: bool = False


class QuestionnaireIntakeCreate(QuestionnaireContent):
    patient_id: str


class QuestionnaireIntakeRecord(QuestionnaireContent):
    intake_id: str
    patient_id: str
    status: IntakeStatus = "completed"
    derived_flags: DerivedFlags
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
