"""In-memory repository for questionnaire intake records."""

from __future__ import annotations

from app.modules.questionnaire_intake.schemas import QuestionnaireIntakeRecord


_INTAKES: dict[str, QuestionnaireIntakeRecord] = {}


def save_questionnaire(record: QuestionnaireIntakeRecord) -> QuestionnaireIntakeRecord:
    _INTAKES[record.intake_id] = record
    return record


def get_questionnaire(intake_id: str) -> QuestionnaireIntakeRecord | None:
    return _INTAKES.get(intake_id)


def clear_questionnaires() -> None:
    _INTAKES.clear()
