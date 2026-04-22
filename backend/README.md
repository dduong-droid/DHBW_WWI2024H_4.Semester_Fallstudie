# Backend

FastAPI-Backend fuer `Food 4 Recovery`.

## Enthaltene Bereiche

- Patientenprofil
- Fragebogen-Intake
- Recommendation Engine mit regelbasierter Logik
- Meal-Kit-Katalog
- Order Handling
- Frontend-BFF unter `/api/frontend`
- API-, Unit- und Integrationstests

## API-Ebenen

Es gibt zwei API-Schichten:

1. Domain-Endpunkte unter `/api/...`
2. Frontend-BFF-/Compatibility-Endpunkte unter `/api/frontend/...`

Die Domain-Endpunkte bleiben nahe an den internen Fachmodellen.
Der BFF-Layer liefert camelCase-Responses in den Frontend-Contracts aus `frontend/src/types/apiContracts.ts`.

## Wichtige Endpunkte

Domain:

- `GET /health`
- `POST /api/patient-profile`
- `GET /api/patient-profile/{patient_id}`
- `POST /api/questionnaire-intake`
- `GET /api/questionnaire-intake/{intake_id}`
- `POST /api/recommendations/analyze`
- `GET /api/recommendations/{recommendation_id}`
- `GET /api/meal-kits`
- `GET /api/meal-kits/{meal_kit_id}`
- `POST /api/orders`
- `GET /api/orders/{order_id}`
- `PATCH /api/orders/{order_id}/status`

Frontend-BFF:

- `POST /api/frontend/intake/full-analyze`
- `GET /api/frontend/nutrition-plan/{patient_id}`
- `GET /api/frontend/shop/inventory`
- `GET /api/frontend/shop/meal-kits/{meal_kit_id}`
- `GET /api/frontend/recipes/curated/{patient_id}`
- `GET /api/frontend/tracking/daily/{patient_id}`
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`
- `GET /api/frontend/tracking/hydration/{patient_id}`
- `POST /api/frontend/tracking/hydration/{patient_id}/water`

## Lokal starten

```bash
uvicorn app.main:app --reload
```

## Tests

```bash
pytest app/tests
```
