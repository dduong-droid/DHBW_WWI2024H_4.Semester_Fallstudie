"""Rule-based risk flag engine."""

from __future__ import annotations

from datetime import datetime, timezone

from app.modules.patient_profile.schemas import PatientProfile
from app.modules.questionnaire_intake.repository import list_questionnaires_for_patient
from app.modules.questionnaire_intake.schemas import QuestionnaireIntakeRecord
from app.modules.risk_flags.repository import list_risk_flags_for_patient, save_risk_flags
from app.modules.risk_flags.schemas import RiskFlag, RiskSeverity


_CRITICAL_TEXT_MARKERS = {
    "blut",
    "fieber",
    "notfall",
    "starke schmerzen",
    "kann nicht essen",
    "seit tagen nichts gegessen",
    "dehydriert",
}


def _contains_any(values: list[str], markers: set[str]) -> bool:
    text = " ".join(values).lower()
    return any(marker in text for marker in markers)


def _flag(
    *,
    patient_id: str,
    flag_type: str,
    severity: RiskSeverity,
    title: str,
    description: str,
    triggered_by: list[str],
    recommended_action: str,
    requires_review: bool,
    blocks_plan: bool = False,
    suffix: str | None = None,
) -> RiskFlag:
    flag_id = f"risk_{patient_id}_{flag_type}"
    if suffix:
        flag_id = f"{flag_id}_{suffix}"
    return RiskFlag(
        id=flag_id,
        patient_id=patient_id,
        type=flag_type,
        severity=severity,
        title=title,
        description=description,
        triggered_by=triggered_by,
        recommended_action=recommended_action,
        requires_professional_review=requires_review,
        blocks_automatic_plan=blocks_plan,
        created_at=datetime.now(timezone.utc),
    )


def generate_risk_flags(profile: PatientProfile, intake: QuestionnaireIntakeRecord) -> list[RiskFlag]:
    flags: list[RiskFlag] = []
    nutrition = intake.nutrition_status
    habits = intake.eating_habits
    meds = intake.medication_and_supplements
    symptoms = {item.lower() for item in nutrition.digestive_symptoms}
    eating_difficulties = {item.lower() for item in nutrition.eating_difficulties}
    notes = " ".join(
        [
            intake.additional_notes or "",
            intake.goals_and_expectations.expectation_notes or "",
            profile.notes or "",
        ]
    ).lower()

    if profile.weight_kg and intake.personal_and_body_data.weight_kg:
        weight_loss_percent = ((profile.weight_kg - intake.personal_and_body_data.weight_kg) / profile.weight_kg) * 100
        if weight_loss_percent >= 5:
            flags.append(
                _flag(
                    patient_id=profile.patient_id,
                    flag_type="strong_weight_loss",
                    severity="high",
                    title="Auffälliger Gewichtsverlust",
                    description="Der Gewichtsverlauf spricht für ein erhoehtes Ernährungsrisiko.",
                    triggered_by=["profile.weight_kg", "intake.personal_and_body_data.weight_kg"],
                    recommended_action="Professionelle Prüfung einplanen, bevor der Plan freigegeben wird.",
                    requires_review=True,
                    blocks_plan=True,
                )
            )

    if nutrition.appetite_level == "minimal":
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="very_low_appetite",
                severity="high",
                title="Sehr geringer Appetit",
                description="Sehr geringer Appetit kann die Umsetzung eines automatischen Plans unsicher machen.",
                triggered_by=["nutrition_status.appetite_level"],
                recommended_action="Plan nur als Entwurf anzeigen und fachliche Prüfung markieren.",
                requires_review=True,
                blocks_plan=True,
            )
        )
    elif nutrition.appetite_level == "reduced":
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="reduced_appetite",
                severity="medium",
                title="Reduzierter Appetit",
                description="Kleinere und leichter umsetzbare Mahlzeiten sollten priorisiert werden.",
                triggered_by=["nutrition_status.appetite_level"],
                recommended_action="Kleine Mahlzeiten und Snacks vorschlagen; Verlauf beobachten.",
                requires_review=False,
            )
        )

    if nutrition.intake_change_vs_past == "significantly_less" or nutrition.meals_per_day <= 1:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="low_food_intake",
                severity="high",
                title="Kaum Nahrungsaufnahme",
                description="Die angegebene Nahrungsaufnahme ist für automatische Empfehlungen kritisch.",
                triggered_by=["nutrition_status.intake_change_vs_past", "nutrition_status.meals_per_day"],
                recommended_action="Professionelle Prüfung und ggf. medizinische Rücksprache empfehlen.",
                requires_review=True,
                blocks_plan=True,
            )
        )

    if _contains_any(list(symptoms), {"erbrechen", "vomiting"}):
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="repeated_vomiting",
                severity="high",
                title="Wiederholtes Erbrechen",
                description="Erbrechen ist ein kritisches Signal für die Ernährungsplanung.",
                triggered_by=["nutrition_status.digestive_symptoms"],
                recommended_action="Keine automatische Freigabe; fachliche oder medizinische Prüfung markieren.",
                requires_review=True,
                blocks_plan=True,
            )
        )

    if _contains_any(list(symptoms), {"durchfall", "diarrhea"}):
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="strong_diarrhea",
                severity="medium",
                title="Durchfall angegeben",
                description="Verdauungsbeschwerden sollten bei Plan und Hydration berücksichtigt werden.",
                triggered_by=["nutrition_status.digestive_symptoms"],
                recommended_action="Milde Kost und Verlaufskontrolle priorisieren.",
                requires_review=False,
            )
        )

    if _contains_any(list(eating_difficulties), {"schluck", "swallow", "dysphagie"}):
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="swallowing_problem",
                severity="high",
                title="Schluckprobleme",
                description="Bei Schluckproblemen dürfen normale feste Rezepte nicht als sicher freigegeben werden.",
                triggered_by=["nutrition_status.eating_difficulties"],
                recommended_action="Plan blockieren oder nur als Entwurf mit professioneller Prüfung anzeigen.",
                requires_review=True,
                blocks_plan=True,
            )
        )

    if profile.allergies:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="relevant_allergy",
                severity="medium",
                title="Allergien angegeben",
                description="Allergien müssen bei Rezepten und Meal-Kits hart ausgeschlossen werden.",
                triggered_by=["patient_profile.allergies"],
                recommended_action="Allergenfilter anwenden und Safety Check ausfuehren.",
                requires_review=False,
            )
        )

    if intake.gut_health.food_intolerances:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="relevant_intolerance",
                severity="medium",
                title="Unverträglichkeiten angegeben",
                description="Unverträglichkeiten schränken Rezepte und Meal-Kits ein.",
                triggered_by=["gut_health.food_intolerances"],
                recommended_action="Unverträglichkeiten beim Matching ausschließen oder stark abwerten.",
                requires_review=False,
            )
        )

    if not habits.can_cook and not habits.receives_support_for_cooking:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="no_cooking_capacity",
                severity="medium",
                title="Keine Kochmöglichkeit oder Unterstützung",
                description="Der Plan muss sehr niedrigschwellig und umsetzbar bleiben.",
                triggered_by=["eating_habits.can_cook", "eating_habits.receives_support_for_cooking"],
                recommended_action="Einfache Rezepte, Meal-Kits oder Angehoerigenunterstützung priorisieren.",
                requires_review=False,
            )
        )

    if meds.medications or meds.supplements:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="medication_not_checked",
                severity="low",
                title="Medikamente oder Supplements angegeben",
                description="Medikationsangaben werden im MVP nicht automatisch medizinisch interpretiert.",
                triggered_by=["medication_and_supplements"],
                recommended_action="Hinweis anzeigen, dass keine Interaktionsprüfung stattfindet.",
                requires_review=False,
            )
        )

    if not profile.known_conditions:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="unclear_medical_context",
                severity="medium",
                title="Medizinischer Kontext unklar",
                description="Ohne klaren Kontext ist eine spezifische Empfehlung nur eingeschränkt belastbar.",
                triggered_by=["patient_profile.known_conditions"],
                recommended_action="Kontext nacherfassen oder Plan nur allgemein halten.",
                requires_review=True,
            )
        )

    if any(marker in notes for marker in _CRITICAL_TEXT_MARKERS):
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="critical_free_text",
                severity="high",
                title="Kritische Freitextangabe",
                description="Der Freitext enthält möglicherweise kritische Hinweise.",
                triggered_by=["additional_notes", "profile.notes"],
                recommended_action="Freitext menschlich prüfen, keine automatische Freigabe.",
                requires_review=True,
                blocks_plan=True,
            )
        )

    if habits.fluid_intake_ml_per_day == 0 or nutrition.meals_per_day == 0:
        flags.append(
            _flag(
                patient_id=profile.patient_id,
                flag_type="insufficient_data",
                severity="high",
                title="Unvollständige oder nicht belastbare Daten",
                description="Einige Angaben reichen für eine sichere Empfehlung nicht aus.",
                triggered_by=["nutrition_status.meals_per_day", "eating_habits.fluid_intake_ml_per_day"],
                recommended_action="Daten nacherfassen, bevor ein Plan generiert wird.",
                requires_review=True,
                blocks_plan=True,
            )
        )

    return flags


def generate_and_store_risk_flags(profile: PatientProfile, intake: QuestionnaireIntakeRecord) -> list[RiskFlag]:
    flags = generate_risk_flags(profile, intake)
    return save_risk_flags(flags)


def get_patient_risk_flags(patient_id: str) -> list[RiskFlag]:
    return list_risk_flags_for_patient(patient_id)


def latest_intake_for_patient(patient_id: str) -> QuestionnaireIntakeRecord | None:
    intakes = list_questionnaires_for_patient(patient_id)
    if not intakes:
        return None
    return max(intakes, key=lambda item: item.created_at)
