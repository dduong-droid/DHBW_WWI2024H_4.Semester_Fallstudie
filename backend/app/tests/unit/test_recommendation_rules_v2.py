from __future__ import annotations

from app.modules.meal_kit_catalog.service import get_meal_kit_or_404
from app.modules.questionnaire_intake.schemas import DerivedFlags
from app.modules.recommendation_engine.rules import build_weekly_plan, choose_template_id, evaluate_meal_kit
from app.tests.helpers import build_questionnaire_record


def test_choose_template_id_prioritizes_chemo_context_over_other_signals() -> None:
    flags = DerivedFlags(
        chemo_related_appetite_loss=True,
        oncology_context=True,
        needs_easy_prep=True,
        high_protein_need=True,
    )
    questionnaire = build_questionnaire_record(
        derived_flags=flags.model_dump(),
        questionnaire=None,
    )

    template_id = choose_template_id(flags, questionnaire)

    assert template_id == "chemo_easy_digest"


def test_evaluate_meal_kit_respects_hard_exclusions_and_positive_fit() -> None:
    excluded_kit = get_meal_kit_or_404("produktdetails_immun_boost_box")
    fitting_kit = get_meal_kit_or_404("produktdetails_onko_box")
    flags = DerivedFlags(
        chemo_related_appetite_loss=True,
        oncology_context=True,
        needs_easy_prep=True,
    )
    questionnaire = build_questionnaire_record(
        derived_flags=flags.model_dump(),
        questionnaire=None,
    )

    exclusion = evaluate_meal_kit(excluded_kit, flags, dietary_warnings=["nuts"], questionnaire=questionnaire)
    fit = evaluate_meal_kit(fitting_kit, flags, dietary_warnings=[], questionnaire=questionnaire)

    assert exclusion.score == 0
    assert exclusion.exclusion_reasons
    assert fit.score > 0
    assert fit.positive_reasons


def test_build_weekly_plan_adds_extra_snacks_and_filters_gluten_sources() -> None:
    flags = DerivedFlags(
        high_fatigue=True,
        needs_easy_prep=True,
        energy_support=True,
    )
    questionnaire = build_questionnaire_record(
        derived_flags=flags.model_dump(),
        questionnaire=None,
    )
    questionnaire = questionnaire.model_copy(
        update={
            "gut_health": questionnaire.gut_health.model_copy(update={"food_intolerances": ["gluten"]}),
            "nutrition_status": questionnaire.nutrition_status.model_copy(update={"appetite_level": "minimal"}),
        }
    )

    weekly_plan = build_weekly_plan("energy_rebuild", flags=flags, questionnaire=questionnaire)

    breakfast_ingredients = {item.lower() for item in weekly_plan.days[0].meals.breakfast.ingredients}
    assert len(weekly_plan.days[0].meals.snacks) == 2
    assert "hafer" not in breakfast_ingredients
    assert any("Unvertraeglichkeiten" in item for item in weekly_plan.adjustments)
