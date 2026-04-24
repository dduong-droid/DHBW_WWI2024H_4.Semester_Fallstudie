"""Internal analytics service."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException, status

from app.modules.analytics.repository import list_events, list_events_for_patient, save_event
from app.modules.analytics.schemas import (
    AnalyticsEvent,
    AnalyticsEventCreate,
    AnalyticsSummary,
    FunnelAnalytics,
    RiskFlagAnalytics,
)
from app.modules.patient_profile.repository import get_patient_profile
from app.modules.risk_flags.repository import list_risk_flags_for_patient


def record_event(event_type: str, *, patient_id: str | None = None, metadata: dict[str, object] | None = None) -> AnalyticsEvent:
    event = AnalyticsEvent(
        event_id=f"evt_{uuid4().hex[:10]}",
        event_type=event_type,
        patient_id=patient_id,
        metadata=metadata or {},
        created_at=datetime.now(timezone.utc),
    )
    return save_event(event)


def create_event(payload: AnalyticsEventCreate) -> AnalyticsEvent:
    if payload.patient_id is not None and get_patient_profile(payload.patient_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient profile '{payload.patient_id}' was not found.",
        )
    return record_event(payload.event_type, patient_id=payload.patient_id, metadata=payload.metadata)


def get_patient_events(patient_id: str) -> list[AnalyticsEvent]:
    if get_patient_profile(patient_id) is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient profile '{patient_id}' was not found.",
        )
    return list_events_for_patient(patient_id)


def build_analytics_summary() -> AnalyticsSummary:
    events = list_events()
    by_type = Counter(event.event_type for event in events)
    patients = {event.patient_id for event in events if event.patient_id}
    return AnalyticsSummary(
        total_events=len(events),
        events_by_type=dict(by_type),
        patient_count=len(patients),
        risk_flag_count=by_type.get("risk_flag_created", 0),
        review_required_count=by_type.get("review_required", 0),
        plan_generated_count=by_type.get("plan_generated", 0),
        tracking_submitted_count=by_type.get("tracking_submitted", 0),
    )


def build_risk_flag_analytics() -> RiskFlagAnalytics:
    events = list_events()
    patient_ids = {event.patient_id for event in events if event.patient_id}
    type_counts: Counter[str] = Counter()
    severity_counts: Counter[str] = Counter()
    for patient_id in patient_ids:
        for flag in list_risk_flags_for_patient(patient_id):
            type_counts[flag.type] += 1
            severity_counts[flag.severity] += 1
    return RiskFlagAnalytics(counts_by_type=dict(type_counts), counts_by_severity=dict(severity_counts))


def build_funnel_analytics() -> FunnelAnalytics:
    by_type = Counter(event.event_type for event in list_events())
    return FunnelAnalytics(
        intake_started=by_type.get("intake_started", 0),
        intake_completed=by_type.get("intake_completed", 0),
        assessment_generated=by_type.get("assessment_generated", 0),
        plan_generated=by_type.get("plan_generated", 0),
        shopping_list_generated=by_type.get("shopping_list_generated", 0),
        tracking_submitted=by_type.get("tracking_submitted", 0),
    )
