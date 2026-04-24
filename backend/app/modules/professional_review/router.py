"""Professional review routes."""

from fastapi import APIRouter

from app.modules.professional_review.schemas import (
    ProfessionalReview,
    ProfessionalReviewCreate,
    ProfessionalReviewUpdate,
)
from app.modules.professional_review.service import (
    create_professional_review,
    get_review_or_404,
    list_professional_reviews,
    update_professional_review,
)


router = APIRouter()


@router.get("/professional-reviews", response_model=list[ProfessionalReview])
def get_reviews(status: str | None = None) -> list[ProfessionalReview]:
    return list_professional_reviews(status)


@router.post("/professional-reviews", response_model=ProfessionalReview)
def post_review(payload: ProfessionalReviewCreate) -> ProfessionalReview:
    return create_professional_review(payload)


@router.get("/professional-reviews/{review_id}", response_model=ProfessionalReview)
def get_review_item(review_id: str) -> ProfessionalReview:
    return get_review_or_404(review_id)


@router.patch("/professional-reviews/{review_id}", response_model=ProfessionalReview)
def patch_review(review_id: str, payload: ProfessionalReviewUpdate) -> ProfessionalReview:
    return update_professional_review(review_id, payload)
