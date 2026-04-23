"""Template helpers for recommendation rationale text."""

from __future__ import annotations

from app.modules.questionnaire_intake.schemas import DerivedFlags


def build_detected_needs(flags: DerivedFlags) -> list[str]:
    needs: list[str] = []
    if flags.post_op_recovery:
        needs.append("Wundheilung und Gewebeaufbau")
    if flags.high_protein_need:
        needs.append("Erhoehter Proteinbedarf")
    if flags.chemo_related_appetite_loss:
        needs.append("Leicht verdauliche Energiezufuhr bei Appetitmangel")
    if flags.gut_sensitivity:
        needs.append("Darmfreundliche und milde Ernaehrung")
    if flags.high_fatigue:
        needs.append("Unterstuetzung bei Erschoepfung und geringer Belastbarkeit")
    if flags.immune_focus:
        needs.append("Immunstaerkender Fokus")
    if flags.needs_easy_prep:
        needs.append("Einfach vorbereitbare Mahlzeiten")
    return needs or ["Allgemeine Regeneration und ausgewogene Versorgung"]


def build_summary(flags: DerivedFlags) -> str:
    if flags.chemo_related_appetite_loss:
        return "Der Schwerpunkt liegt auf leicht verdaulichen, energiereichen Mahlzeiten mit geringer Belastung im Alltag."
    if flags.gut_sensitivity:
        return "Der Schwerpunkt liegt auf darmfreundlicher, milder Ernaehrung mit guter Vertraeglichkeit."
    if flags.post_op_recovery:
        return "Der Schwerpunkt liegt auf Regeneration, Wundheilung und einer stabilen Proteinzufuhr."
    if flags.high_fatigue:
        return "Der Schwerpunkt liegt auf Energieaufbau und unkomplizierter Versorgung im Alltag."
    return "Der Schwerpunkt liegt auf ausgewogener, medizinisch plausibler Regeneration."


def build_rationale_lines(flags: DerivedFlags, top_kit_names: list[str], warnings: list[str]) -> list[str]:
    lines: list[str] = []
    if flags.post_op_recovery:
        lines.append("Die Empfehlung priorisiert eiweiss- und regenerationsorientierte Optionen fuer die Genesungsphase.")
    if flags.chemo_related_appetite_loss:
        lines.append("Es wurden leicht verdauliche, sanfte Mahlzeiten mit kleinerer Huerde fuer den Appetit bevorzugt.")
    if flags.gut_sensitivity:
        lines.append("Verdauungssensible Optionen wurden bevorzugt und potenziell belastende Produkte zurueckgestellt.")
    if flags.high_fatigue:
        lines.append("Da Erschoepfung erkannt wurde, wurden einfache und alltagstaugliche Mahlzeiten bevorzugt.")
    if top_kit_names:
        lines.append("Die passendsten Meal-Kits im aktuellen Profil sind: " + ", ".join(top_kit_names) + ".")
    if warnings:
        lines.append("Beruecksichtigte Ausschluesse: " + ", ".join(warnings) + ".")
    if not lines:
        lines.append("Es wurde eine ausgewogene Standardempfehlung fuer die allgemeine Regeneration erstellt.")
    return lines
