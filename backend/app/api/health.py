"""Health endpoint."""

from fastapi import APIRouter

from app.core.config import settings
from app.db.session import check_database

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.app_env,
    }


@router.get("/ready")
def readiness_check() -> dict[str, str]:
    check_database()
    return {
        "status": "ok",
        "database": "ok",
    }
