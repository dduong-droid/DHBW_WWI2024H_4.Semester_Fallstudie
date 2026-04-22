"""Questionnaire intake router."""

from fastapi import APIRouter

from app.modules.questionnaire_intake.schemas import QuestionnaireIntakeCreate, QuestionnaireIntakeRecord
from app.modules.questionnaire_intake.service import create_questionnaire_intake, get_questionnaire_or_404


router = APIRouter()


@router.post("/questionnaire-intake", response_model=QuestionnaireIntakeRecord)
def create_intake(payload: QuestionnaireIntakeCreate) -> QuestionnaireIntakeRecord:
    return create_questionnaire_intake(payload)


@router.get("/questionnaire-intake/{intake_id}", response_model=QuestionnaireIntakeRecord)
def get_intake(intake_id: str) -> QuestionnaireIntakeRecord:
    return get_questionnaire_or_404(intake_id)
