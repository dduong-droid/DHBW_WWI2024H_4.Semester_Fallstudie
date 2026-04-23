"""Safety check router."""

from fastapi import APIRouter

from app.modules.safety_check.schemas import SafetyCheckRequest, SafetyCheckResponse
from app.modules.safety_check.service import run_safety_check


router = APIRouter()


@router.post("/safety-check", response_model=SafetyCheckResponse)
def safety_check(payload: SafetyCheckRequest) -> SafetyCheckResponse:
    return run_safety_check(payload)
