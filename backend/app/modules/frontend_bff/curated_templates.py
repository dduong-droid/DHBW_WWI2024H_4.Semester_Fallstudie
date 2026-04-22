"""Deterministic curated meal templates for the frontend BFF."""

from __future__ import annotations

from app.modules.frontend_bff.schemas import FrontendCuratedMeal
from app.modules.meal_kit_catalog.schemas import MealKit
from app.modules.recommendation_engine.schemas import RecommendationResult


_CURATED_LIBRARY: dict[str, list[dict[str, object]]] = {
    "post_op_high_protein": [
        {
            "id": "cur-po-001",
            "title": "Kollagen-Aufbau Huhn",
            "medicalBenefit": "Protein + Regeneration",
            "description": "Eine proteinschwere Option fuer Gewebeaufbau, Wundheilung und stabile Erholung.",
            "tags": ["Protein", "Regeneration"],
            "ingredients": ["Haehnchenbrust", "Quinoa", "Brokkoli"],
        },
        {
            "id": "cur-po-002",
            "title": "Omega-3 Lachs Teller",
            "medicalBenefit": "Entzuendungsarm + Zellschutz",
            "description": "Unterstuetzt die postoperative Stabilisierung mit Eiweiss und Omega-3-Fettsaeuren.",
            "tags": ["Omega-3", "Wundheilung"],
            "ingredients": ["Lachs", "Kartoffeln", "Fenchel"],
        },
        {
            "id": "cur-po-003",
            "title": "Protein-Snack Beerenmix",
            "medicalBenefit": "Snack fuer Zwischenziele",
            "description": "Hilft, Proteinziele auch bei kleinerem Appetit alltagstauglich zu erreichen.",
            "tags": ["Snack", "Protein"],
            "ingredients": ["Beeren", "Pflanzenquark", "Samen"],
        },
    ],
    "chemo_easy_digest": [
        {
            "id": "cur-ce-001",
            "title": "Sanfte Reisschale",
            "medicalBenefit": "Leicht verdauliche Energie",
            "description": "Reduziert die Essenshuerde bei Appetitmangel und belastet den Magen wenig.",
            "tags": ["Easy Digest", "Energie"],
            "ingredients": ["Reis", "Karotten", "Mildes Huhn"],
        },
        {
            "id": "cur-ce-002",
            "title": "Fenchel-Suppe Mild",
            "medicalBenefit": "Schonung + Waerme",
            "description": "Warme, sanfte Komponenten fuer sensible Tage waehrend einer belastenden Therapiephase.",
            "tags": ["Warm", "Sanft"],
            "ingredients": ["Fenchel", "Kartoffeln", "Pute"],
        },
        {
            "id": "cur-ce-003",
            "title": "Bananen-Energie Snack",
            "medicalBenefit": "Kleine Portion, viel Nutzen",
            "description": "Snack-orientierte Energiezufuhr fuer Tage mit sehr geringer Essmenge.",
            "tags": ["Snack", "Appetitmangel"],
            "ingredients": ["Banane", "Haferkeks", "Pflanzendrink"],
        },
    ],
    "gut_balance_recovery": [
        {
            "id": "cur-gb-001",
            "title": "Reis-Congee Recovery",
            "medicalBenefit": "Beruhigt sensible Verdauung",
            "description": "Sehr milde Basis fuer Tage, an denen Vertraeglichkeit wichtiger ist als Vielfalt.",
            "tags": ["Gut Friendly", "Mild"],
            "ingredients": ["Reis", "Ingwer", "Karotte"],
        },
        {
            "id": "cur-gb-002",
            "title": "Fenchel-Kartoffel Bowl",
            "medicalBenefit": "Darmfreundliche Balance",
            "description": "Ein sanfter Mix mit niedrigschwelliger Zubereitung und guter Alltagstauglichkeit.",
            "tags": ["Verdauung", "Alltag"],
            "ingredients": ["Fenchel", "Kartoffeln", "Zucchini"],
        },
        {
            "id": "cur-gb-003",
            "title": "Geduensteter Fisch",
            "medicalBenefit": "Leichtes Protein",
            "description": "Proteinversorgung ohne unnoetige Belastung fuer eine empfindliche Verdauung.",
            "tags": ["Protein", "Leicht"],
            "ingredients": ["Kabeljau", "Reis", "Karotte"],
        },
    ],
    "energy_rebuild": [
        {
            "id": "cur-er-001",
            "title": "B-Komplex Power Bowl",
            "medicalBenefit": "Energie + Stabilisierung",
            "description": "Hilft bei Fatigue mit energiedichten, leicht einplanbaren Komponenten.",
            "tags": ["Energie", "Fatigue"],
            "ingredients": ["Hafer", "Banane", "Samen"],
        },
        {
            "id": "cur-er-002",
            "title": "Puten-Reis Teller",
            "medicalBenefit": "Kalorien + Protein",
            "description": "Verbindet Energiedichte mit einer klaren Eiweissquelle fuer schwache Phasen.",
            "tags": ["Alltag", "Protein"],
            "ingredients": ["Pute", "Reis", "Paprika"],
        },
        {
            "id": "cur-er-003",
            "title": "Energie-Snack To Go",
            "medicalBenefit": "Zwischenschritt statt Ausfall",
            "description": "Einfach einsetzbare Zwischenmahlzeit, wenn komplette Mahlzeiten schwerfallen.",
            "tags": ["Snack", "Energie"],
            "ingredients": ["Banane", "Hafer", "Sonnenblumenkerne"],
        },
    ],
    "balanced_general_recovery": [
        {
            "id": "cur-bg-001",
            "title": "Ausgewogene Quinoa Bowl",
            "medicalBenefit": "Basis fuer allgemeine Regeneration",
            "description": "Ein solider, breit vertraeglicher Ausgangspunkt fuer den Alltag in der Genesung.",
            "tags": ["Balance", "Recovery"],
            "ingredients": ["Quinoa", "Kichererbsen", "Brokkoli"],
        },
        {
            "id": "cur-bg-002",
            "title": "Milde Abendpfanne",
            "medicalBenefit": "Vertraeglichkeit + Struktur",
            "description": "Unterstuetzt regelmaessige Mahlzeiten ohne unnoetig komplexe Zubereitung.",
            "tags": ["Mild", "Alltag"],
            "ingredients": ["Reis", "Gemuese", "Tofu"],
        },
        {
            "id": "cur-bg-003",
            "title": "Regenerationsfruehstueck",
            "medicalBenefit": "Sanfter Start in den Tag",
            "description": "Ein einfacher Einstieg, um Tagesstruktur und Grundversorgung zu stabilisieren.",
            "tags": ["Fruehstueck", "Recovery"],
            "ingredients": ["Hafer", "Birne", "Zimt"],
        },
    ],
}

_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop"


def build_curated_meals(
    recommendation: RecommendationResult,
    recommended_meal_kits: list[MealKit],
) -> list[FrontendCuratedMeal]:
    template_id = recommendation.recommended_weekly_plan.template_id
    template_entries = _CURATED_LIBRARY.get(template_id, _CURATED_LIBRARY["balanced_general_recovery"])
    kit_images = [kit.image_url for kit in recommended_meal_kits if kit.image_url]

    curated_meals: list[FrontendCuratedMeal] = []
    for index, entry in enumerate(template_entries):
        image_url = kit_images[index] if index < len(kit_images) else _FALLBACK_IMAGE
        curated_meals.append(
            FrontendCuratedMeal(
                id=entry["id"],
                title=entry["title"],
                medicalBenefit=entry["medicalBenefit"],
                description=entry["description"],
                tags=list(entry["tags"]),
                imageUrl=image_url,
                ingredients=list(entry["ingredients"]),
            )
        )
    return curated_meals
