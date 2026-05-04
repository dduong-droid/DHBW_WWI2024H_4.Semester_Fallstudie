"""Static meal kit catalog repository."""

from __future__ import annotations

from app.modules.meal_kit_catalog.schemas import MealKit, NutritionalValues


_MEAL_KITS: dict[str, MealKit] = {
    "produktdetails_wundheilungs_box": MealKit(
        id="produktdetails_wundheilungs_box",
        name="Wundheilungs-Box",
        description="Protein- und mikronahrstoffreiche Box zur Unterstützung von Regeneration und Gewebeaufbau.",
        price=39.90,
        currency="EUR",
        servings=7,
        nutritional_values=NutritionalValues(calories=2250, protein=165, carbs=180, fat=75, fiber=30),
        dietary_tags=["high_protein", "anti_inflammatory"],
        condition_tags=["post_op_recovery", "high_protein_need", "anti_inflammatory_focus"],
        prep_difficulty="easy",
        contraindications=[],
        recommended_for=["wundheilung", "postoperative_regeneration", "proteinaufbau"],
        meals=["Lachs mit Quinoa", "Huhn mit Linsen", "Joghurtfreier Beeren-Snack"],
        image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
    "produktdetails_onko_box": MealKit(
        id="produktdetails_onko_box",
        name="Onko-Box",
        description="Leicht verdauliche, energiedichte Mahlzeiten für geringe Belastbarkeit und Appetitmangel.",
        price=42.50,
        currency="EUR",
        servings=7,
        nutritional_values=NutritionalValues(calories=2100, protein=120, carbs=240, fat=60, fiber=25),
        dietary_tags=["easy_digest", "energy_dense"],
        condition_tags=["oncology_context", "chemo_related_appetite_loss", "needs_easy_prep"],
        prep_difficulty="easy",
        contraindications=[],
        recommended_for=["chemotherapie", "appetitmangel", "leichte_verdaulichkeit"],
        meals=["Cremige Reisschale", "Mildes Hähnchenfilet", "Sanfter Frucht-Smoothie"],
        image_url="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
    "produktdetails_darm_balance_box": MealKit(
        id="produktdetails_darm_balance_box",
        name="Darm-Balance-Box",
        description="Milde, ballaststoffbewusste Box mit Fokus auf Verdauung, Mikrobiom und Verträglichkeit.",
        price=37.50,
        currency="EUR",
        servings=7,
        nutritional_values=NutritionalValues(calories=1950, protein=105, carbs=255, fat=54, fiber=42),
        dietary_tags=["gut_friendly", "glutenfree", "lactosefree"],
        condition_tags=["gut_sensitivity", "needs_easy_prep"],
        prep_difficulty="easy",
        contraindications=[],
        recommended_for=["verdauung", "mikrobiom", "leichte_ernährung"],
        meals=["Reis-Congee", "Geduensteter Kabeljau", "Fenchel-Kartoffel-Suppe"],
        image_url="https://images.unsplash.com/photo-1605697746162-4aa83aa03823?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
    "produktdetails_immun_boost_box": MealKit(
        id="produktdetails_immun_boost_box",
        name="Immun-Boost-Box",
        description="Vitamin- und antioxidantienreiche Auswahl zur Unterstützung des Immunsystems.",
        price=35.90,
        currency="EUR",
        servings=7,
        nutritional_values=NutritionalValues(calories=1920, protein=96, carbs=216, fat=66, fiber=36),
        dietary_tags=["immune_support", "antioxidant"],
        condition_tags=["immune_focus", "anti_inflammatory_focus"],
        prep_difficulty="moderate",
        contraindications=["nuts"],
        recommended_for=["immunsystem", "antioxidativer_fokus"],
        meals=["Beeren-Porridge", "Mandel-Hirse-Bowl", "Gemuese mit Tahin"],
        image_url="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
}


def list_meal_kits() -> list[MealKit]:
    return list(_MEAL_KITS.values())


def get_meal_kit(meal_kit_id: str) -> MealKit | None:
    return _MEAL_KITS.get(meal_kit_id)
