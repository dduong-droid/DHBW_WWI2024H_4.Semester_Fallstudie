"""Professional review workflow service."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.analytics.service import record_event
from app.modules.nutrition_plan.repository import get_nutrition_plan, save_nutrition_plan
from app.modules.patient_profile.service import get_patient_profile_or_404
from app.modules.professional_review.repository import (
    get_latest_review_for_patient,
    get_review,
    list_reviews,
    save_review,
)
from app.modules.professional_review.schemas import (
    ProfessionalReview,
    ProfessionalReviewCreate,
    ProfessionalReviewUpdate,
)


def create_professional_review(payload: ProfessionalReviewCreate) -> ProfessionalReview:
    get_patient_profile_or_404(payload.patient_id)
    if payload.plan_id is not None:
        plan = get_nutrition_plan(payload.plan_id)
        if plan is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Nutrition plan '{payload.plan_id}' was not found.",
            )
        if plan.patient_id != payload.patient_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Professional review patient_id must match the nutrition plan patient_id.",
            )
    review = ProfessionalReview(
        review_id=f"review_{uuid4().hex[:10]}",
        patient_id=payload.patient_id,
        plan_id=payload.plan_id,
        status="pending",
        source=payload.source,
        risk_flag_ids=payload.risk_flag_ids,
        comments=payload.comments,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    saved = save_review(review)
    record_event(
        "review_required",
        patient_id=saved.patient_id,
        metadata={"review_id": saved.review_id, "plan_id": saved.plan_id, "source": saved.source},
    )
    return saved


def create_review_if_missing(
    *,
    patient_id: str,
    plan_id: str | None,
    source: str,
    risk_flag_ids: list[str],
) -> ProfessionalReview:
    latest = get_latest_review_for_patient(patient_id)
    if latest is not None and latest.status == "pending" and latest.plan_id == plan_id:
        return latest
    return create_professional_review(
        ProfessionalReviewCreate(
            patient_id=patient_id,
            plan_id=plan_id,
            source=source,
            risk_flag_ids=risk_flag_ids,
            comments="Automatisch zur fachlichen Pruefung markiert.",
        )
    )


def get_review_or_404(review_id: str) -> ProfessionalReview:
    review = get_review(review_id)
    if review is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Professional review '{review_id}' was not found.",
        )
    return review


def list_professional_reviews(status_filter: str | None = None) -> list[ProfessionalReview]:
    reviews = list_reviews()
    if status_filter is None:
        return reviews
    return [review for review in reviews if review.status == status_filter]


def update_professional_review(review_id: str, payload: ProfessionalReviewUpdate) -> ProfessionalReview:
    review = get_review_or_404(review_id)
    updated = review.model_copy(
        update={
            "status": payload.status,
            "reviewer_role": payload.reviewer_role,
            "reviewer_name": payload.reviewer_name,
            "comments": payload.comments if payload.comments is not None else review.comments,
            "updated_at": datetime.now(timezone.utc),
        }
    )
    saved = save_review(updated)

    if saved.plan_id:
        plan = get_nutrition_plan(saved.plan_id)
        if plan is not None:
            if saved.status == "approved":
                save_nutrition_plan(
                    plan.model_copy(
                        update={
                            "status": "approved_mock",
                            "reviewed_by": saved.reviewer_name or saved.reviewer_role,
                            "reviewed_at": saved.updated_at,
                        }
                    )
                )
            elif saved.status in {"rejected", "changes_requested"}:
                save_nutrition_plan(plan.model_copy(update={"status": "blocked"}))

    record_event(
        "review_completed",
        patient_id=saved.patient_id,
        metadata={"review_id": saved.review_id, "status": saved.status, "plan_id": saved.plan_id},
    )
    return saved
