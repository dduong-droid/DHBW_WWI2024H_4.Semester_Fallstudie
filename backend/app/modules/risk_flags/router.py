"""Risk flag API routes."""

from fastapi import APIRouter

from app.modules.risk_flags.schemas import RiskFlag
from app.modules.risk_flags.service import get_patient_risk_flags


router = APIRouter()


@router.get("/patients/{patient_id}/risk-flags", response_model=list[RiskFlag])
def list_patient_risk_flags(patient_id: str) -> list[RiskFlag]:
    return get_patient_risk_flags(patient_id)
