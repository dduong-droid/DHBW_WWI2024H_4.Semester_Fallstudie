import httpx
from app.core.config import settings

GOOGLE_PLACES_AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete"

async def get_google_autocomplete_suggestions(query: str):
    if not settings.google_maps_api_key:
        return {"suggestions": []}

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": settings.google_maps_api_key,
        "X-Goog-FieldMask": "suggestions.placePrediction.text.text,suggestions.placePrediction.place"
    }

    payload = {
        "input": query,
        "includedRegionCodes": ["de"]
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                GOOGLE_PLACES_AUTOCOMPLETE_URL,
                json=payload,
                headers=headers,
                timeout=5.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"[Places] Google API error: {e}")
            return {"suggestions": []}
