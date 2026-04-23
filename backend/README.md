# Backend

FastAPI-Backend fuer `Food 4 Recovery`.

## Enthaltene Bereiche

- Patientenprofil
- Fragebogen-Intake
- Recommendation Engine mit regelbasierter Logik
- Meal-Kit-Katalog
- Order Handling
- Frontend-BFF unter `/api/frontend`
- SQLite-Persistenz fuer Patienten, Frageboegen, Empfehlungen, Bestellungen und Tracking
- API-Key-Schutz fuer sensible Endpunkte, wenn `API_KEY` gesetzt ist
- Privacy Export und Loeschung patientenbezogener Daten
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
- `GET /ready`
- `POST /api/patient-profile`
- `GET /api/patient-profile/{patient_id}`
- `GET /api/patient-profile/{patient_id}/export`
- `DELETE /api/patient-profile/{patient_id}`
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

## Konfiguration

Standardwerte fuer die lokale Entwicklung:

```bash
APP_NAME="Food 4 Recovery Backend"
APP_ENV=development
APP_PORT=8000
DATABASE_URL=sqlite:///./food4recovery.db
API_KEY=
```

Wenn `API_KEY` leer bleibt, sind lokale Requests ohne Header moeglich.
Wenn `API_KEY` gesetzt ist, muessen sensible Reads und alle Write-Endpunkte den Header `X-API-Key: <wert>` senden.
`/health`, `/ready` und der Meal-Kit-Katalog bleiben oeffentlich.

Die SQLite-Datei wird beim Start automatisch angelegt. Es ist keine Alembic-Migration fuer dieses MVP-Paket noetig.

## Datenschutz-Endpunkte

- `GET /api/patient-profile/{patient_id}/export` liefert Profil, Frageboegen, Empfehlungen, Bestellungen und Trackingdaten.
- `DELETE /api/patient-profile/{patient_id}` entfernt alle patientenbezogenen Daten und gibt `204` zurueck.
- Neue Patientenprofile muessen `consent_data_processing: true` senden.

Fehler werden einheitlich als `{"error": {"code": "...", "message": "...", "details": ...}}` ausgegeben.

## Tests

```bash
pytest app/tests
```
