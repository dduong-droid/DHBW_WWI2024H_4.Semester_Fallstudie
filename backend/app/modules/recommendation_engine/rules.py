"""Recommendation rules and weekly plan templates."""

from __future__ import annotations

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
    return Recipe(
        id=recipe_id,
        name=name,
        description=description,
        prep_time_minutes=15,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        ingredients=ingredients,
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
            _recipe("po_l2", "Huhn mit Linsen", "Proteinstarke Regenerationsmahlzeit.", 640, 45, 50, 18, ["Haehnchen", "Linsen", "Karotten"]),
        ],
        "dinner": [
            _recipe("po_d1", "Putenpfanne mit Reis", "Leicht und ausgewogen.", 560, 39, 52, 14, ["Pute", "Reis", "Zucchini"]),
            _recipe("po_d2", "Kabeljau mit Kartoffeln", "Milde Abendmahlzeit.", 520, 37, 46, 12, ["Kabeljau", "Kartoffeln", "Fenchel"]),
        ],
        "snacks": [
            _recipe("po_s1", "Protein-Smoothie", "Snack fuer die Genesungsphase.", 220, 18, 20, 6, ["Banane", "Beeren", "Protein"]),
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
            _recipe("ce_l1", "Mildes Haehnchen mit Reis", "Leichte Hauptmahlzeit.", 520, 34, 58, 10, ["Haehnchen", "Reis", "Karotten"]),
            _recipe("ce_l2", "Kartoffel-Zucchini-Eintopf", "Schonend fuer empfindliche Tage.", 480, 22, 60, 12, ["Kartoffeln", "Zucchini", "Huhn"]),
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
        "focus": "Darmfreundliche Kost mit milden, vertraeglichen Komponenten",
        "breakfast": [
            _recipe("gb_b1", "Reis-Congee", "Sehr sanft fuer den Start in den Tag.", 310, 9, 58, 4, ["Reis", "Ingwer", "Karotte"]),
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
            _recipe("er_d1", "Ofengemuese mit Huhn", "Einfach und energiereich.", 560, 36, 44, 18, ["Haehnchen", "Suesskartoffel", "Brokkoli"]),
            _recipe("er_d2", "Reis mit Eierspeise", "Schnelle Abendmahlzeit.", 520, 26, 58, 14, ["Reis", "Ei", "Zucchini"]),
        ],
        "snacks": [
            _recipe("er_s1", "Nussfreier Energie-Snack", "Schneller Zwischenimpuls.", 230, 10, 28, 7, ["Hafer", "Banane", "Sonnenblumenkerne"]),
        ],
    },
    "balanced_general_recovery": {
        "title": "Balanced General Recovery",
        "focus": "Ausgewogene Regeneration fuer den Alltag",
        "breakfast": [
            _recipe("bg_b1", "Joghurtfreie Bowl", "Leichter und ausgewogener Start.", 390, 18, 46, 11, ["Pflanzenjoghurt", "Beeren", "Hafer"]),
            _recipe("bg_b2", "Porridge mit Birne", "Alltagstaugliches Fruehstueck.", 370, 14, 52, 8, ["Hafer", "Birne", "Zimt"]),
        ],
        "lunch": [
            _recipe("bg_l1", "Quinoa-Gemueseschale", "Ausgewogene Mittagsmahlzeit.", 540, 24, 60, 16, ["Quinoa", "Kichererbsen", "Brokkoli"]),
            _recipe("bg_l2", "Huhn mit Kartoffeln", "Klassisch und gut vertraeglich.", 560, 34, 48, 17, ["Haehnchen", "Kartoffeln", "Karotten"]),
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


def choose_template_id(flags: DerivedFlags) -> str:
    if flags.chemo_related_appetite_loss:
        return "chemo_easy_digest"
    if flags.gut_sensitivity:
        return "gut_balance_recovery"
    if flags.post_op_recovery and flags.high_protein_need:
        return "post_op_high_protein"
    if flags.high_fatigue or flags.energy_support:
        return "energy_rebuild"
    return "balanced_general_recovery"


def score_meal_kit(meal_kit: MealKit, flags: DerivedFlags) -> int:
    score = 0
    if flags.post_op_recovery and "post_op_recovery" in meal_kit.condition_tags:
        score += 4
    if flags.high_protein_need and "high_protein_need" in meal_kit.condition_tags:
        score += 3
    if flags.chemo_related_appetite_loss and "chemo_related_appetite_loss" in meal_kit.condition_tags:
        score += 5
    if flags.gut_sensitivity and "gut_sensitivity" in meal_kit.condition_tags:
        score += 5
    if flags.immune_focus and "immune_focus" in meal_kit.condition_tags:
        score += 3
    if flags.high_fatigue and "high_fatigue" in meal_kit.condition_tags:
        score += 4
    if flags.energy_support and "energy_support" in meal_kit.condition_tags:
        score += 3
    if flags.needs_easy_prep and meal_kit.prep_difficulty == "easy":
        score += 2
    if flags.anti_inflammatory_focus and "anti_inflammatory_focus" in meal_kit.condition_tags:
        score += 2
    if flags.oncology_context and "oncology_context" in meal_kit.condition_tags:
        score += 2
    return score


def build_weekly_plan(
    template_id: str,
    *,
    flags: DerivedFlags,
    questionnaire: QuestionnaireIntakeRecord,
) -> WeeklyPlanRecommendation:
    template = _TEMPLATE_RECIPES[template_id]
    adjustments: list[str] = []
    if flags.high_protein_need:
        adjustments.append("Protein-Ziel wurde angehoben.")
    if flags.chemo_related_appetite_loss:
        adjustments.append("Kleinere, leicht verdauliche Mahlzeiten mit Snack-Fokus wurden priorisiert.")
    if flags.gut_sensitivity:
        adjustments.append("Darmfreundliche, milde Zutaten stehen im Vordergrund.")
    if flags.needs_easy_prep:
        adjustments.append("Einfach vorzubereitende Mahlzeiten wurden bevorzugt.")
    if questionnaire.gut_health.food_intolerances:
        adjustments.append(
            "Ruecksicht auf Unvertraeglichkeiten: " + ", ".join(questionnaire.gut_health.food_intolerances)
        )

    days: list[DailyPlan] = []
    calories_boost = 150 if flags.energy_support else 0
    protein_boost = 10 if flags.high_protein_need else 0
    include_two_snacks = questionnaire.nutrition_status.appetite_level in {"reduced", "minimal"}
    for day_index in range(7):
        breakfast = template["breakfast"][day_index % len(template["breakfast"])]
        lunch = template["lunch"][day_index % len(template["lunch"])]
        dinner = template["dinner"][day_index % len(template["dinner"])]
        snacks = [template["snacks"][0]]
        if include_two_snacks:
            snacks.append(template["snacks"][0].copy(update={"id": f"{template['snacks'][0].id}_extra_{day_index}"}))

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
