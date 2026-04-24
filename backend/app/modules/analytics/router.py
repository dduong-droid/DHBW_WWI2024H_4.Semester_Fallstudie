"""Internal analytics routes."""

from fastapi import APIRouter

from app.modules.analytics.schemas import (
    AnalyticsEvent,
    AnalyticsEventCreate,
    AnalyticsSummary,
    FunnelAnalytics,
    RiskFlagAnalytics,
)
from app.modules.analytics.service import (
    build_analytics_summary,
    build_funnel_analytics,
    build_risk_flag_analytics,
    create_event,
    get_patient_events,
)


router = APIRouter()


@router.post("/analytics/events", response_model=AnalyticsEvent)
def post_event(payload: AnalyticsEventCreate) -> AnalyticsEvent:
    return create_event(payload)


@router.get("/analytics/patient/{patient_id}/events", response_model=list[AnalyticsEvent])
def list_patient_events(patient_id: str) -> list[AnalyticsEvent]:
    return get_patient_events(patient_id)


@router.get("/analytics/summary", response_model=AnalyticsSummary)
def get_summary() -> AnalyticsSummary:
    return build_analytics_summary()


@router.get("/analytics/risk-flags", response_model=RiskFlagAnalytics)
def get_risk_flags_summary() -> RiskFlagAnalytics:
    return build_risk_flag_analytics()


@router.get("/analytics/funnel", response_model=FunnelAnalytics)
def get_funnel() -> FunnelAnalytics:
    return build_funnel_analytics()
