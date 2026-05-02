"""Recommendation rules and weekly plan templates."""

from __future__ import annotations

from dataclasses import dataclass

from app.modules.meal_kit_catalog.schemas import MealKit
from app.modules.questionnaire_intake.schemas import DerivedFlags, QuestionnaireIntakeRecord
from app.modules.recommendation_engine.schemas import DailyPlan, DailyPlanMeals, Recipe, WeeklyPlanRecommendation


def _recipe(
    recipe_id: str,
    name: str,
    description: str,
    calories: int,
    protein: int,
    carbs: int,
    fat: int,
    ingredients: list[str],
) -> Recipe:
    lowered = " ".join(ingredients).lower()
    allergens = []
    intolerances = []
    if any(marker in lowered for marker in ["hafer", "pasta", "gries", "polenta"]):
        allergens.append("gluten")
        intolerances.append("gluten")
    if any(marker in lowered for marker in ["mandel", "nuss"]):
        allergens.append("nuts")
    if any(marker in lowered for marker in ["joghurt", "skyr", "milch", "quark"]):
        intolerances.append("lactose")
    texture = "soft" if any(marker in lowered for marker in ["brei", "suppe", "congee", "porridge"]) else "normal"
    protein_level = "high" if protein >= 28 else "medium" if protein >= 14 else "low"
    energy_level = "high" if calories >= 560 else "medium" if calories >= 350 else "low"
    return Recipe(
        id=recipe_id,
        name=name,
        description=description,
        prep_time_minutes=15,
        preparation_time_minutes=15,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        ingredients=ingredients,
        allergens=allergens,
        intolerances=intolerances,
        tags=[],
        suitable_for_symptoms=[],
        unsuitable_for_symptoms=[],
        difficulty="low",
        texture=texture,
        protein_level=protein_level,
        energy_level=energy_level,
        instructions=["Zutaten schonend vorbereiten.", "Mahlzeit mild abschmecken und portionsgerecht servieren."],
    )


_TEMPLATE_RECIPES = {
    "post_op_high_protein": {
        "title": "Post-OP High Protein",
        "focus": "Gewebeaufbau, Wundheilung und stabile Proteinzufuhr",
        "breakfast": [
            _recipe("po_b1", "Protein-Haferbrei", "Sanfter Haferbrei mit Beeren.", 430, 28, 44, 12, ["Hafer", "Beeren", "Pflanzendrink"]),
            _recipe("po_b2", "Skyrfreie Beeren-Bowl", "Proteinstark und leicht.", 400, 26, 38, 10, ["Sojaquark", "Beeren", "Samen"]),
        ],
        "lunch": [
            _recipe("po_l1", "Lachs mit Quinoa", "Entzuendungsarmer Mittagsteller.", 620, 42, 48, 22, ["Lachs", "Quinoa", "Brokkoli"]),
            _recipe("po_l2", "Huhn mit Linsen", "Proteinstarke Regenerationsmahlzeit.", 640, 45, 50, 18, ["Hähnchen", "Linsen", "Karotten"]),
        ],
        "dinner": [
            _recipe("po_d1", "Putenpfanne mit Reis", "Leicht und ausgewogen.", 560, 39, 52, 14, ["Pute", "Reis", "Zucchini"]),
            _recipe("po_d2", "Kabeljau mit Kartoffeln", "Milde Abendmahlzeit.", 520, 37, 46, 12, ["Kabeljau", "Kartoffeln", "Fenchel"]),
        ],
        "snacks": [
            _recipe("po_s1", "Protein-Smoothie", "Snack für die Genesungsphase.", 220, 18, 20, 6, ["Banane", "Beeren", "Protein"]),
        ],
    },
    "chemo_easy_digest": {
        "title": "Chemo Easy Digest",
        "focus": "Leichte Verdaulichkeit, kleine Portionen und stabile Energie",
        "breakfast": [
            _recipe("ce_b1", "Griesbrei mit Apfel", "Mild und magenfreundlich.", 360, 14, 54, 8, ["Gries", "Apfel", "Haferdrink"]),
            _recipe("ce_b2", "Reis-Porridge", "Sanftes Fruehstueck bei Appetitmangel.", 340, 10, 56, 6, ["Reis", "Banane", "Zimt"]),
        ],
        "lunch": [
            _recipe("ce_l1", "Mildes Hähnchen mit Reis", "Leichte Hauptmahlzeit.", 520, 34, 58, 10, ["Hähnchen", "Reis", "Karotten"]),
            _recipe("ce_l2", "Kartoffel-Zucchini-Eintopf", "Schonend für empfindliche Tage.", 480, 22, 60, 12, ["Kartoffeln", "Zucchini", "Huhn"]),
        ],
        "dinner": [
            _recipe("ce_d1", "Fenchel-Suppe mit Pute", "Warme und sanfte Abendoption.", 420, 28, 34, 10, ["Fenchel", "Pute", "Kartoffel"]),
            _recipe("ce_d2", "Polenta mit Gemuese", "Leicht verdaulich und weich.", 440, 20, 56, 12, ["Polenta", "Karotte", "Zucchini"]),
        ],
        "snacks": [
            _recipe("ce_s1", "Bananen-Snack", "Kleine Zwischenmahlzeit.", 180, 8, 28, 4, ["Banane", "Haferkeks"]),
        ],
    },
    "gut_balance_recovery": {
        "title": "Gut Balance Recovery",
        "focus": "Darmfreundliche Kost mit milden, verträglichen Komponenten",
        "breakfast": [
            _recipe("gb_b1", "Reis-Congee", "Sehr sanft für den Start in den Tag.", 310, 9, 58, 4, ["Reis", "Ingwer", "Karotte"]),
            _recipe("gb_b2", "Buchweizen-Bowl", "Glutenfreie Morgenmahlzeit.", 350, 14, 50, 8, ["Buchweizen", "Beeren", "Leinsamen"]),
        ],
        "lunch": [
            _recipe("gb_l1", "Geduensteter Fisch mit Gemuese", "Leicht und darmfreundlich.", 500, 34, 40, 14, ["Kabeljau", "Karotte", "Reis"]),
            _recipe("gb_l2", "Kartoffel-Fenchel-Topf", "Beruhigende Mittagsoption.", 460, 18, 54, 12, ["Kartoffeln", "Fenchel", "Tofu"]),
        ],
        "dinner": [
            _recipe("gb_d1", "Hirse mit Moehren", "Milde Abendmahlzeit.", 430, 16, 58, 10, ["Hirse", "Karotten", "Zucchini"]),
            _recipe("gb_d2", "Suppe mit Reisnudeln", "Wenig belastend und waermend.", 410, 15, 52, 9, ["Reisnudeln", "Bruehe", "Gemuese"]),
        ],
        "snacks": [
            _recipe("gb_s1", "Apfelmus mit Zimt", "Sanfter Snack.", 140, 2, 32, 0, ["Apfel", "Zimt"]),
        ],
    },
    "energy_rebuild": {
        "title": "Energy Rebuild",
        "focus": "Mehr Energie, alltagstaugliche Mahlzeiten und stabile Kalorienzufuhr",
        "breakfast": [
            _recipe("er_b1", "Power-Oats", "Energiebetont und leicht vorzubereiten.", 460, 20, 58, 14, ["Hafer", "Banane", "Samen"]),
            _recipe("er_b2", "Fruehstuecksreis mit Beeren", "Warme Energiequelle.", 420, 16, 60, 10, ["Reis", "Beeren", "Mandeldrink"]),
        ],
        "lunch": [
            _recipe("er_l1", "Puten-Reis-Bowl", "Naehrstoffdichte Hauptmahlzeit.", 620, 40, 64, 16, ["Pute", "Reis", "Paprika"]),
            _recipe("er_l2", "Linsen-Kartoffel-Teller", "Sattmachend und ausgewogen.", 590, 28, 70, 14, ["Linsen", "Kartoffeln", "Spinat"]),
        ],
        "dinner": [
            _recipe("er_d1", "Ofengemuese mit Huhn", "Einfach und energiereich.", 560, 36, 44, 18, ["Hähnchen", "Suesskartoffel", "Brokkoli"]),
            _recipe("er_d2", "Reis mit Eierspeise", "Schnelle Abendmahlzeit.", 520, 26, 58, 14, ["Reis", "Ei", "Zucchini"]),
        ],
        "snacks": [
            _recipe("er_s1", "Nussfreier Energie-Snack", "Schneller Zwischenimpuls.", 230, 10, 28, 7, ["Hafer", "Banane", "Sonnenblumenkerne"]),
        ],
    },
    "balanced_general_recovery": {
        "title": "Balanced General Recovery",
        "focus": "Ausgewogene Regeneration für den Alltag",
        "breakfast": [
            _recipe("bg_b1", "Joghurtfreie Bowl", "Leichter und ausgewogener Start.", 390, 18, 46, 11, ["Pflanzenjoghurt", "Beeren", "Hafer"]),
            _recipe("bg_b2", "Porridge mit Birne", "Alltagstaugliches Fruehstueck.", 370, 14, 52, 8, ["Hafer", "Birne", "Zimt"]),
        ],
        "lunch": [
            _recipe("bg_l1", "Quinoa-Gemueseschale", "Ausgewogene Mittagsmahlzeit.", 540, 24, 60, 16, ["Quinoa", "Kichererbsen", "Brokkoli"]),
            _recipe("bg_l2", "Huhn mit Kartoffeln", "Klassisch und gut verträglich.", 560, 34, 48, 17, ["Hähnchen", "Kartoffeln", "Karotten"]),
        ],
        "dinner": [
            _recipe("bg_d1", "Milde Gemuesepfanne", "Ausgeglichen und einfach.", 470, 20, 50, 14, ["Tofu", "Reis", "Gemuese"]),
            _recipe("bg_d2", "Fisch mit Reis", "Leichte Abendmahlzeit.", 500, 30, 46, 15, ["Fisch", "Reis", "Fenchel"]),
        ],
        "snacks": [
            _recipe("bg_s1", "Obst-Komponente", "Kleiner Regenerationssnack.", 150, 4, 26, 2, ["Apfel", "Hafercracker"]),
        ],
    },
}


@dataclass(frozen=True)
class RecommendationRuleContext:
    post_op_recovery: bool
    chemo_related_appetite_loss: bool
    gut_sensitivity: bool
    high_fatigue: bool
    needs_easy_prep: bool
    high_protein_need: bool
    anti_inflammatory_focus: bool
    immune_focus: bool
    oncology_context: bool
    energy_support: bool
    appetite_reduced: bool
    appetite_minimal: bool
    support_required: bool
    digestive_symptom_count: int
    intolerances: frozenset[str]
    dietary_warnings: frozenset[str]


@dataclass(frozen=True)
class TemplateSelection:
    template_id: str
    score: int
    rationale: list[str]
    all_scores: dict[str, int]


@dataclass(frozen=True)
class MealKitEvaluation:
    score: int
    positive_reasons: list[str]
    negative_reasons: list[str]
    exclusion_reasons: list[str]


_TEMPLATE_PRIORITY = [
    "chemo_easy_digest",
    "gut_balance_recovery",
    "post_op_high_protein",
    "energy_rebuild",
    "balanced_general_recovery",
]

_TEMPLATE_RULES: dict[str, list[tuple[str, int, str]]] = {
    "chemo_easy_digest": [
        ("chemo_related_appetite_loss", 12, "Onkologischer Kontext mit Appetitmangel priorisiert leicht verdauliche Kost."),
        ("oncology_context", 4, "Der Therapiekontext spricht für eine sanfte, niedrigschwellige Vorlage."),
        ("appetite_minimal", 3, "Sehr geringer Appetit verlangt kleine, einfache Mahlzeiten mit Snack-Fokus."),
        ("needs_easy_prep", 2, "Einfach vorbereitbare Mahlzeiten entlasten im Alltag."),
    ],
    "gut_balance_recovery": [
        ("gut_sensitivity", 11, "Verdauungsbeschwerden und Intoleranzen sprechen für eine darmfreundliche Vorlage."),
        ("digestive_symptom_count", 2, "Mehrere Verdauungssymptome verstärken den Bedarf an milder Kost."),
        ("needs_easy_prep", 1, "Eine einfach umsetzbare Alltagsstruktur bleibt hilfreich."),
    ],
    "post_op_high_protein": [
        ("post_op_recovery", 8, "Die Regeneration nach Eingriffen erfordert einen klaren Wundheilungsfokus."),
        ("high_protein_need", 5, "Erhoehter Proteinbedarf stuetzt Gewebeaufbau und Stabilisierung."),
        ("anti_inflammatory_focus", 2, "Entzuendungsarme Optionen passen gut in die postoperative Phase."),
    ],
    "energy_rebuild": [
        ("high_fatigue", 7, "Erschoepfung spricht für energiedichtere und alltagstaugliche Mahlzeiten."),
        ("energy_support", 4, "Der Fokus auf Energieaufbau stuetzt eine kalorien- und snackbetonte Vorlage."),
        ("needs_easy_prep", 2, "Alltagstauglichkeit bleibt bei geringer Belastbarkeit wichtig."),
    ],
    "balanced_general_recovery": [
        ("post_op_recovery", 1, "Regeneration bleibt ein allgemeiner Grundfokus."),
        ("immune_focus", 1, "Ein ausgewogener Regenerationsplan deckt leichte Immununterstützung mit ab."),
    ],
}

_TEMPLATE_PENALTIES: dict[str, list[tuple[str, int, str]]] = {
    "energy_rebuild": [
        ("gut_sensitivity", -2, "Stark energiedichte Mahlzeiten sind bei sensibler Verdauung nicht erste Wahl."),
        ("chemo_related_appetite_loss", -2, "Bei Appetitmangel ist eine sanftere Vorlage haeufig passender."),
    ],
    "post_op_high_protein": [
        ("chemo_related_appetite_loss", -2, "Sehr proteindichte Optionen können bei Appetitmangel zu belastend wirken."),
    ],
    "chemo_easy_digest": [
        ("high_protein_need", -1, "Ein reiner Easy-Digest-Fokus deckt hohen Proteinbedarf allein weniger gut ab."),
    ],
}

_MEAL_KIT_POSITIVE_RULES: dict[str, tuple[str, int, str]] = {
    "post_op_recovery": ("post_op_recovery", 4, "unterstützt den postoperativen Regenerationsbedarf"),
    "high_protein_need": ("high_protein_need", 4, "liefert einen passenden Protein-Fokus"),
    "chemo_related_appetite_loss": ("chemo_related_appetite_loss", 5, "passt zu onkologischer Belastung und Appetitmangel"),
    "gut_sensitivity": ("gut_sensitivity", 5, "ist auf sensible Verdauung ausgerichtet"),
    "immune_focus": ("immune_focus", 3, "stuetzt den immunbezogenen Schwerpunkt"),
    "high_fatigue": ("high_fatigue", 4, "adressiert Erschoepfung und geringe Belastbarkeit"),
    "energy_support": ("energy_support", 3, "liefert energiedichte Unterstützung"),
    "anti_inflammatory_focus": ("anti_inflammatory_focus", 2, "passt zum entzuendungsarmen Schwerpunkt"),
    "oncology_context": ("oncology_context", 2, "berücksichtigt den onkologischen Kontext"),
}


def _build_rule_context(
    flags: DerivedFlags,
    questionnaire: QuestionnaireIntakeRecord | None = None,
    dietary_warnings: list[str] | None = None,
) -> RecommendationRuleContext:
    appetite_level = questionnaire.nutrition_status.appetite_level if questionnaire else "good"
    digestive_symptom_count = len(questionnaire.nutrition_status.digestive_symptoms) if questionnaire else 0
    intolerances = frozenset(item.lower() for item in questionnaire.gut_health.food_intolerances) if questionnaire else frozenset()
    return RecommendationRuleContext(
        post_op_recovery=flags.post_op_recovery,
        chemo_related_appetite_loss=flags.chemo_related_appetite_loss,
        gut_sensitivity=flags.gut_sensitivity,
        high_fatigue=flags.high_fatigue,
        needs_easy_prep=flags.needs_easy_prep,
        high_protein_need=flags.high_protein_need,
        anti_inflammatory_focus=flags.anti_inflammatory_focus,
        immune_focus=flags.immune_focus,
        oncology_context=flags.oncology_context,
        energy_support=flags.energy_support,
        appetite_reduced=appetite_level in {"reduced", "minimal"},
        appetite_minimal=appetite_level == "minimal",
        support_required=flags.needs_easy_prep,
        digestive_symptom_count=digestive_symptom_count,
        intolerances=intolerances,
        dietary_warnings=frozenset(item.lower() for item in (dietary_warnings or [])),
    )


def _context_value(context: RecommendationRuleContext, key: str) -> bool:
    value = getattr(context, key)
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value > 0
    return bool(value)


def evaluate_template_selection(
    flags: DerivedFlags,
    questionnaire: QuestionnaireIntakeRecord | None = None,
) -> TemplateSelection:
    context = _build_rule_context(flags, questionnaire)
    scores: dict[str, int] = {}
    rationales: dict[str, list[str]] = {}

    for template_id in _TEMPLATE_PRIORITY:
        score = 1 if template_id == "balanced_general_recovery" else 0
        reasons: list[str] = []
        for key, weight, reason in _TEMPLATE_RULES.get(template_id, []):
            if _context_value(context, key):
                score += weight
                reasons.append(reason)
        for key, weight, reason in _TEMPLATE_PENALTIES.get(template_id, []):
            if _context_value(context, key):
                score += weight
                reasons.append(reason)
        scores[template_id] = score
        rationales[template_id] = reasons or ["Ausgewogene Standardvorlage für die allgemeine Regeneration."]

    best_template_id = max(
        _TEMPLATE_PRIORITY,
        key=lambda template_id: (scores[template_id], -_TEMPLATE_PRIORITY.index(template_id)),
    )
    return TemplateSelection(
        template_id=best_template_id,
        score=scores[best_template_id],
        rationale=rationales[best_template_id],
        all_scores=scores,
    )


def choose_template_id(
    flags: DerivedFlags,
    questionnaire: QuestionnaireIntakeRecord | None = None,
) -> str:
    return evaluate_template_selection(flags, questionnaire).template_id


def evaluate_meal_kit(
    meal_kit: MealKit,
    flags: DerivedFlags,
    *,
    dietary_warnings: list[str] | None = None,
    questionnaire: QuestionnaireIntakeRecord | None = None,
) -> MealKitEvaluation:
    context = _build_rule_context(flags, questionnaire, dietary_warnings)
    contraindication_hits = sorted(set(meal_kit.contraindications) & set(context.dietary_warnings))
    if contraindication_hits:
        return MealKitEvaluation(
            score=0,
            positive_reasons=[],
            negative_reasons=[],
            exclusion_reasons=[f"enthält Ausschluesse für: {', '.join(contraindication_hits)}"],
        )

    score = 0
    positive_reasons: list[str] = []
    negative_reasons: list[str] = []

    for tag in meal_kit.condition_tags:
        rule = _MEAL_KIT_POSITIVE_RULES.get(tag)
        if rule is None:
            continue
        context_key, weight, reason = rule
        if _context_value(context, context_key):
            score += weight
            positive_reasons.append(reason)

    if context.needs_easy_prep and meal_kit.prep_difficulty == "easy":
        score += 2
        positive_reasons.append("laesst sich einfach in den Alltag integrieren")
    if context.high_protein_need and meal_kit.nutritional_values.protein >= 40:
        score += 2
        positive_reasons.append("liefert zusätzlich eine hohe Proteindichte")
    if context.appetite_reduced and meal_kit.nutritional_values.calories >= 650:
        score += 1
        positive_reasons.append("konzentriert Energie bei reduziertem Appetit")

    if context.needs_easy_prep and meal_kit.prep_difficulty == "advanced":
        score -= 4
        negative_reasons.append("aufwendige Zubereitung passt schlecht zur aktuellen Belastbarkeit")
    if context.gut_sensitivity and not {"gut_friendly", "easy_digest"} & set(meal_kit.dietary_tags):
        score -= 2
        negative_reasons.append("bei sensibler Verdauung ist die Verträglichkeit weniger klar")
    if context.chemo_related_appetite_loss and "easy_digest" not in meal_kit.dietary_tags:
        score -= 2
        negative_reasons.append("bei Appetitmangel waeren noch sanftere Komponenten ideal")

    return MealKitEvaluation(
        score=score,
        positive_reasons=positive_reasons,
        negative_reasons=negative_reasons,
        exclusion_reasons=[],
    )


def score_meal_kit(
    meal_kit: MealKit,
    flags: DerivedFlags,
    *,
    dietary_warnings: list[str] | None = None,
    questionnaire: QuestionnaireIntakeRecord | None = None,
) -> int:
    return evaluate_meal_kit(
        meal_kit,
        flags,
        dietary_warnings=dietary_warnings,
        questionnaire=questionnaire,
    ).score


_INGREDIENT_CONFLICTS: dict[str, set[str]] = {
    "gluten": {"hafer", "pasta", "gries", "polenta"},
    "lactose": {"joghurt", "skyr", "kefir", "milch", "quark"},
    "nuts": {"mandel", "mandeln", "nuss", "nuesse"},
}


def _recipe_conflicts_with_intolerances(recipe: Recipe, intolerances: frozenset[str]) -> bool:
    recipe_allergens = {item.lower() for item in recipe.allergens}
    recipe_intolerances = {item.lower() for item in recipe.intolerances}
    if intolerances & (recipe_allergens | recipe_intolerances):
        return True
    lowered_ingredients = {ingredient.lower() for ingredient in recipe.ingredients}
    for intolerance in intolerances:
        conflicts = _INGREDIENT_CONFLICTS.get(intolerance, set())
        if lowered_ingredients & conflicts:
            return True
    return False


def _safe_substitute_recipe(recipe_id: str) -> Recipe:
    return _recipe(
        f"{recipe_id}_allergen_safe_substitute",
        "Allergenarme Ersatzmahlzeit",
        "Milde Ersatzoption, wenn alle Planvarianten mit Allergien oder Unverträglichkeiten kollidieren.",
        430,
        24,
        54,
        10,
        ["Reis", "Karotten", "Tofu"],
    ).model_copy(
        update={
            "tags": ["allergen_safe_substitute"],
            "texture": "soft",
            "instructions": [
                "Ersatzoption nur als sichere Demo-Alternative verwenden.",
                "Bei komplexen Allergien oder Beschwerden fachliche Prüfung einplanen.",
            ],
        }
    )


def _select_recipe_variant(
    candidates: list[Recipe],
    *,
    day_index: int,
    intolerances: frozenset[str],
) -> Recipe:
    ordered_candidates = [candidates[(day_index + offset) % len(candidates)] for offset in range(len(candidates))]
    for candidate in ordered_candidates:
        if not _recipe_conflicts_with_intolerances(candidate, intolerances):
            return candidate
    return _safe_substitute_recipe(ordered_candidates[0].id)


def build_weekly_plan(
    template_id: str,
    *,
    flags: DerivedFlags,
    questionnaire: QuestionnaireIntakeRecord,
    dietary_warnings: list[str] | None = None,
) -> WeeklyPlanRecommendation:
    template = _TEMPLATE_RECIPES[template_id]
    context = _build_rule_context(flags, questionnaire, dietary_warnings)
    adjustments: list[str] = []
    if flags.high_protein_need:
        adjustments.append("Protein-Ziel wurde angehoben.")
    if flags.chemo_related_appetite_loss:
        adjustments.append("Kleinere, leicht verdauliche Mahlzeiten mit Snack-Fokus wurden priorisiert.")
    if flags.gut_sensitivity:
        adjustments.append("Darmfreundliche, milde Zutaten stehen im Vordergrund.")
    if flags.needs_easy_prep:
        adjustments.append("Einfach vorzubereitende Mahlzeiten wurden bevorzugt.")
    if context.appetite_minimal:
        adjustments.append("Es wurden zusätzliche Snack-Fenster für sehr geringe Essmengen aktiviert.")
    if flags.high_fatigue:
        adjustments.append("Kalorien- und Energieziel wurden für Fatigue moderat angehoben.")
    if questionnaire.gut_health.food_intolerances:
        adjustments.append(
            "Rücksicht auf Unverträglichkeiten: " + ", ".join(questionnaire.gut_health.food_intolerances)
        )

    days: list[DailyPlan] = []
    calories_boost = 200 if flags.energy_support else 0
    if context.appetite_minimal:
        calories_boost += 100
    protein_boost = 15 if flags.high_protein_need else 0
    include_two_snacks = context.appetite_reduced or flags.high_fatigue
    for day_index in range(7):
        breakfast = _select_recipe_variant(
            template["breakfast"],
            day_index=day_index,
            intolerances=context.intolerances | context.dietary_warnings,
        )
        lunch = _select_recipe_variant(
            template["lunch"],
            day_index=day_index,
            intolerances=context.intolerances | context.dietary_warnings,
        )
        dinner = _select_recipe_variant(
            template["dinner"],
            day_index=day_index,
            intolerances=context.intolerances | context.dietary_warnings,
        )
        snack_recipe = _select_recipe_variant(
            template["snacks"],
            day_index=day_index,
            intolerances=context.intolerances | context.dietary_warnings,
        )
        snacks = [snack_recipe]
        if include_two_snacks:
            snacks.append(snack_recipe.model_copy(update={"id": f"{snack_recipe.id}_extra_{day_index}"}))

        total_calories = breakfast.calories + lunch.calories + dinner.calories + sum(item.calories for item in snacks)
        total_protein = breakfast.protein + lunch.protein + dinner.protein + sum(item.protein for item in snacks)
        total_carbs = breakfast.carbs + lunch.carbs + dinner.carbs + sum(item.carbs for item in snacks)
        total_fat = breakfast.fat + lunch.fat + dinner.fat + sum(item.fat for item in snacks)
        days.append(
            DailyPlan(
                day=day_index + 1,
                meals=DailyPlanMeals(
                    breakfast=breakfast,
                    lunch=lunch,
                    dinner=dinner,
                    snacks=snacks,
                ),
                total_metrics={
                    "calories": total_calories + calories_boost,
                    "protein": total_protein + protein_boost,
                    "carbs": total_carbs,
                    "fat": total_fat,
                },
            )
        )

    return WeeklyPlanRecommendation(
        template_id=template_id,
        title=template["title"],
        focus=template["focus"],
        adjustments=adjustments,
        days=days,
    )


def list_all_recipe_templates() -> list[Recipe]:
    recipes: dict[str, Recipe] = {}
    for template in _TEMPLATE_RECIPES.values():
        for key in ("breakfast", "lunch", "dinner", "snacks"):
            for recipe in template[key]:
                recipes[recipe.id] = recipe
    return sorted(recipes.values(), key=lambda item: item.id)


def get_recipe_template(recipe_id: str) -> Recipe | None:
    for recipe in list_all_recipe_templates():
        if recipe.id == recipe_id:
            return recipe
    return None
