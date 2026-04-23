"""Static meal kit catalog repository."""

from __future__ import annotations

from app.modules.meal_kit_catalog.schemas import MealKit, NutritionalValues


_MEAL_KITS: dict[str, MealKit] = {
    "produktdetails_wundheilungs_box": MealKit(
        id="produktdetails_wundheilungs_box",
        name="Wundheilungs-Box",
        description="Protein- und mikronahrstoffreiche Box zur Unterstuetzung von Regeneration und Gewebeaufbau.",
        price=39.90,
        currency="EUR",
        servings=3,
        nutritional_values=NutritionalValues(calories=760, protein=58, carbs=54, fat=24, fiber=11),
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
        description="Leicht verdauliche, energiedichte Mahlzeiten fuer geringe Belastbarkeit und Appetitmangel.",
        price=42.50,
        currency="EUR",
        servings=3,
        nutritional_values=NutritionalValues(calories=690, protein=44, carbs=62, fat=20, fiber=8),
        dietary_tags=["easy_digest", "energy_dense"],
        condition_tags=["oncology_context", "chemo_related_appetite_loss", "needs_easy_prep"],
        prep_difficulty="easy",
        contraindications=[],
        recommended_for=["chemotherapie", "appetitmangel", "leichte_verdaulichkeit"],
        meals=["Cremige Reisschale", "Mildes Haehnchenfilet", "Sanfter Frucht-Smoothie"],
        image_url="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
    "produktdetails_darm_balance_box": MealKit(
        id="produktdetails_darm_balance_box",
        name="Darm-Balance-Box",
        description="Milde, ballaststoffbewusste Box mit Fokus auf Verdauung, Mikrobiom und Vertraeglichkeit.",
        price=37.50,
        currency="EUR",
        servings=3,
        nutritional_values=NutritionalValues(calories=610, protein=36, carbs=68, fat=18, fiber=14),
        dietary_tags=["gut_friendly", "glutenfree", "lactosefree"],
        condition_tags=["gut_sensitivity", "needs_easy_prep"],
        prep_difficulty="easy",
        contraindications=[],
        recommended_for=["verdauung", "mikrobiom", "leichte_ernaehrung"],
        meals=["Reis-Congee", "Geduensteter Kabeljau", "Fenchel-Kartoffel-Suppe"],
        image_url="https://images.unsplash.com/photo-1605697746162-4aa83aa03823?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
    "produktdetails_immun_boost_box": MealKit(
        id="produktdetails_immun_boost_box",
        name="Immun-Boost-Box",
        description="Vitamin- und antioxidantienreiche Auswahl zur Unterstuetzung des Immunsystems.",
        price=35.90,
        currency="EUR",
        servings=3,
        nutritional_values=NutritionalValues(calories=640, protein=32, carbs=72, fat=22, fiber=12),
        dietary_tags=["immune_support", "antioxidant"],
        condition_tags=["immune_focus", "anti_inflammatory_focus"],
        prep_difficulty="moderate",
        contraindications=["nuts"],
        recommended_for=["immunsystem", "antioxidativer_fokus"],
        meals=["Beeren-Porridge", "Mandel-Hirse-Bowl", "Gemuese mit Tahin"],
        image_url="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
    "produktdetails_vitality_box": MealKit(
        id="produktdetails_vitality_box",
        name="Vitality-Box",
        description="Energiefokussierte Box fuer Erschoepfung, Leistungsabfall und allgemeine Stabilisierung.",
        price=38.90,
        currency="EUR",
        servings=3,
        nutritional_values=NutritionalValues(calories=720, protein=40, carbs=80, fat=21, fiber=9),
        dietary_tags=["energy_support"],
        condition_tags=["energy_support", "high_fatigue"],
        prep_difficulty="easy",
        contraindications=["gluten"],
        recommended_for=["fatigue", "energie", "alltagstauglichkeit"],
        meals=["Hafer-Power-Bowl", "Pasta mit Pute", "Bananen-Snack"],
        image_url="https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
        is_active=True,
    ),
}


def list_meal_kits() -> list[MealKit]:
    return list(_MEAL_KITS.values())


def get_meal_kit(meal_kit_id: str) -> MealKit | None:
    return _MEAL_KITS.get(meal_kit_id)
