from __future__ import annotations

from datetime import datetime, timezone

from app.modules.frontend_bff.mappers import map_meal_kit, map_meal_kits_to_inventory, map_recommendation_to_nutrition_plan
from app.modules.meal_kit_catalog.service import get_active_meal_kits, get_meal_kit_or_404
from app.modules.questionnaire_intake.schemas import DerivedFlags
from app.modules.recommendation_engine.rules import build_weekly_plan
from app.modules.recommendation_engine.schemas import RecommendationResult, RecommendedMealKit
from app.tests.helpers import build_questionnaire_record


def test_map_recommendation_to_nutrition_plan_matches_frontend_shape() -> None:
    flags = DerivedFlags(post_op_recovery=True, high_protein_need=True, anti_inflammatory_focus=True)
    questionnaire = build_questionnaire_record(
        derived_flags=flags.model_dump(),
    )
    weekly_plan = build_weekly_plan("post_op_high_protein", flags=flags, questionnaire=questionnaire)
    recommendation = RecommendationResult(
        recommendation_id="rec_mapper",
        patient_id="patient_mapper",
        summary="Regeneration mit Protein-Fokus.",
        priority_goals=["wundheilung"],
        detected_needs=["Erhoehter Proteinbedarf"],
        recommended_meal_kits=[
            RecommendedMealKit(
                meal_kit_id="produktdetails_wundheilungs_box",
                name="Wundheilungs-Box",
                score=10,
                rationale="passt zum postoperativen Kontext",
            )
        ],
        recommended_weekly_plan=weekly_plan,
        dietary_warnings=["nuts"],
        rationale=["Protein-Ziel wurde angehoben."],
        created_at=datetime.now(timezone.utc),
    )

    frontend_plan = map_recommendation_to_nutrition_plan(recommendation)

    assert frontend_plan.id == "rec_mapper"
    assert frontend_plan.userId == "patient_mapper"
    assert frontend_plan.diagnosis.condition == "post_op_recovery"
    assert frontend_plan.diagnosis.restrictions == ["nuts"]
    assert frontend_plan.weeklyPlan[0].meals.breakfast.macros.protein > 0
    assert frontend_plan.weeklyPlan[0].meals.breakfast.instructions == []
    assert "calories" in frontend_plan.weeklyPlan[0].totalMetrics


def test_map_meal_kit_and_inventory_hide_internal_domain_fields() -> None:
    domain_meal_kit = get_meal_kit_or_404("produktdetails_wundheilungs_box")

    frontend_meal_kit = map_meal_kit(domain_meal_kit)
    frontend_inventory = map_meal_kits_to_inventory(get_active_meal_kits())

    assert set(frontend_meal_kit.model_dump().keys()) == {
        "id",
        "name",
        "description",
        "price",
        "currency",
        "imageUrl",
        "nutritionalValues",
        "dietaryTags",
        "meals",
        "servings",
    }
    assert frontend_inventory.availableMealKits
    assert frontend_inventory.availableMealKits[0].nutritionalValues.calories > 0
