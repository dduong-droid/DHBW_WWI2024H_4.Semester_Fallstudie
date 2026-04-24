"""Symptom tracking service with simple deterioration signals."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.modules.analytics.service import record_event
from app.modules.patient_profile.service import get_patient_profile_or_404
from app.modules.risk_flags.repository import save_risk_flags
from app.modules.risk_flags.schemas import RiskFlag
from app.modules.symptom_tracking.repository import list_tracking_for_patient, save_tracking
from app.modules.symptom_tracking.schemas import SymptomTrackingCreate, SymptomTrackingRecord


def _tracking_flag(
    *,
    patient_id: str,
    tracking_id: str,
    flag_type: str,
    severity: str,
    title: str,
    description: str,
    triggered_by: list[str],
    action: str,
    blocks_plan: bool = False,
) -> RiskFlag:
    return RiskFlag(
        id=f"risk_{patient_id}_{flag_type}_{tracking_id}",
        patient_id=patient_id,
        type=flag_type,
        severity=severity,  # type: ignore[arg-type]
        title=title,
        description=description,
        triggered_by=triggered_by,
        recommended_action=action,
        requires_professional_review=severity == "high" or blocks_plan,
        blocks_automatic_plan=blocks_plan,
        created_at=datetime.now(timezone.utc),
    )


def _detect_tracking_risk_flags(patient_id: str, tracking_id: str, payload: SymptomTrackingCreate) -> list[RiskFlag]:
    flags: list[RiskFlag] = []
    if payload.appetite_score <= 1 or payload.meals_completed <= 1:
        flags.append(
            _tracking_flag(
                patient_id=patient_id,
                tracking_id=tracking_id,
                flag_type="tracking_low_intake",
                severity="high",
                title="Tracking zeigt sehr geringe Aufnahme",
                description="Appetit oder Mahlzeiten liegen im kritischen Bereich.",
                triggered_by=["tracking.appetite_score", "tracking.meals_completed"],
                action="Fall zur professionellen Pruefung markieren.",
                blocks_plan=True,
            )
        )
    if payload.nausea_score >= 4:
        flags.append(
            _tracking_flag(
                patient_id=patient_id,
                tracking_id=tracking_id,
                flag_type="tracking_high_nausea",
                severity="medium",
                title="Starke Uebelkeit im Tracking",
                description="Die neue Eingabe deutet auf eine Verschlechterung der Vertraeglichkeit hin.",
                triggered_by=["tracking.nausea_score"],
                action="Planhinweise ueberpruefen und Verlauf beobachten.",
            )
        )
    previous_weights = [record.weight for record in list_tracking_for_patient(patient_id) if record.weight is not None]
    if payload.weight is not None and previous_weights:
        latest_weight = previous_weights[-1]
        if latest_weight and latest_weight - payload.weight >= 2:
            flags.append(
                _tracking_flag(
                    patient_id=patient_id,
                    tracking_id=tracking_id,
                    flag_type="tracking_weight_drop",
                    severity="high",
                    title="Gewicht faellt im Tracking",
                    description="Das dokumentierte Gewicht ist im Verlauf deutlich gesunken.",
                    triggered_by=["tracking.weight"],
                    action="Professionelle Ruecksprache empfehlen.",
                    blocks_plan=True,
                )
            )
    return flags


def create_tracking_entry(patient_id: str, payload: SymptomTrackingCreate) -> SymptomTrackingRecord:
    get_patient_profile_or_404(patient_id)
    tracking_id = f"track_{uuid4().hex[:10]}"
    flags = _detect_tracking_risk_flags(patient_id, tracking_id, payload)
    if flags:
        save_risk_flags(flags)
        for flag in flags:
            record_event(
                "risk_flag_created",
                patient_id=patient_id,
                metadata={"risk_flag_id": flag.id, "type": flag.type, "source": "tracking"},
            )
            if flag.requires_professional_review:
                record_event("review_required", patient_id=patient_id, metadata={"source": "tracking"})
    record = SymptomTrackingRecord(
        tracking_id=tracking_id,
        patient_id=patient_id,
        generated_risk_flags=flags,
        created_at=datetime.now(timezone.utc),
        **payload.model_dump(),
    )
    saved = save_tracking(record)
    record_event("tracking_submitted", patient_id=patient_id, metadata={"tracking_id": saved.tracking_id})
    return saved


def get_tracking_entries(patient_id: str) -> list[SymptomTrackingRecord]:
    get_patient_profile_or_404(patient_id)
    return list_tracking_for_patient(patient_id)
