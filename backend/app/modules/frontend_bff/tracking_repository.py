"""In-memory tracking repository for the frontend BFF demo endpoints."""

from __future__ import annotations

from app.modules.frontend_bff.schemas import FrontendDailyProgress, FrontendHydrationProgress


_DEFAULT_DAILY_PROGRESS = FrontendDailyProgress(
    proteinPercent=12,
    energyPercent=20,
    isMealBoxEaten=False,
)
_DEFAULT_HYDRATION_PROGRESS = FrontendHydrationProgress(
    currentMl=0,
    targetMl=2500,
)

_DAILY_PROGRESS_BY_PATIENT: dict[str, FrontendDailyProgress] = {}
_HYDRATION_PROGRESS_BY_PATIENT: dict[str, FrontendHydrationProgress] = {}


def get_daily_progress(patient_id: str) -> FrontendDailyProgress:
    return _DAILY_PROGRESS_BY_PATIENT.get(patient_id, _DEFAULT_DAILY_PROGRESS)


def mark_meal_box_eaten(patient_id: str) -> FrontendDailyProgress:
    progress = FrontendDailyProgress(
        proteinPercent=100,
        energyPercent=100,
        isMealBoxEaten=True,
    )
    _DAILY_PROGRESS_BY_PATIENT[patient_id] = progress
    return progress


def get_hydration_progress(patient_id: str) -> FrontendHydrationProgress:
    return _HYDRATION_PROGRESS_BY_PATIENT.get(patient_id, _DEFAULT_HYDRATION_PROGRESS)


def add_water(patient_id: str, amount_ml: int) -> FrontendHydrationProgress:
    current = get_hydration_progress(patient_id)
    updated = FrontendHydrationProgress(
        currentMl=min(current.currentMl + amount_ml, current.targetMl),
        targetMl=current.targetMl,
    )
    _HYDRATION_PROGRESS_BY_PATIENT[patient_id] = updated
    return updated


def clear_tracking_state() -> None:
    _DAILY_PROGRESS_BY_PATIENT.clear()
    _HYDRATION_PROGRESS_BY_PATIENT.clear()
