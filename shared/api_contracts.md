# Shared API Contracts

Leichte teamuebergreifende Contract-Uebersicht fuer das Food4Recovery MVP. Die verbindlichen Python-Schemas liegen im Backend; die Frontend-View-Models liegen in `frontend/src/types/apiContracts.ts` und `frontend/src/services/mockApi.ts`.

## MVP Flow

```text
PatientProfile -> QuestionnaireIntake -> NutritionAssessment -> RiskFlags -> Recommendation -> NutritionPlan -> ShoppingList -> SafetyCheck -> ProfessionalReview/Tracking -> Analytics/Privacy
```

## Wichtige Statuswerte

- RiskFlag severity: `low`, `medium`, `high`
- Recommendation readiness: `ready`, `reviewRequired`, `insufficientData`
- NutritionPlan status: `draft`, `review_required`, `approved_mock`, `blocked`
- Order status: `draft`, `pending`, `confirmed`, `processing`, `completed`, `cancelled`, `demo_failed`
- Document upload status: `uploaded_demo`
- SafetyCheck status: `clear`, `warning`, `blocked`
- ProfessionalReview status: `pending`, `approved`, `rejected`, `changes_requested`

## Contract-Regeln

- Alle sensiblen Reads und alle Write-Endpunkte sind per `X-API-Key` geschuetzt, sobald `API_KEY` gesetzt ist.
- Ohne `consent_data_processing=true` darf kein PatientProfile verarbeitet werden.
- High-Risk-Flags duerfen keinen final freigegebenen automatischen Plan erzeugen.
- Meal-Kits sind optionale Umsetzungshilfe und keine medizinische Therapie.
- BFF-Endpunkte liefern frontend-nahe camelCase-Responses.
- Fehlerformat: `{"error": {"code": "...", "message": "...", "details": ...}}`.
- Dokumenten-Uploads im MVP speichern nur Metadaten, pruefen Dateityp/Groesse und fuehren keine medizinische Auswertung oder OCR durch.

## Wichtige Domain-Endpunkte

- `GET /health`
- `GET /ready`
- `POST /api/patient-profile`
- `POST /api/patients`
- `GET /api/patient-profile/{patient_id}`
- `GET /api/patients/{patient_id}`
- `GET /api/patient-profile/{patient_id}/export`
- `DELETE /api/patient-profile/{patient_id}`
- `POST /api/questionnaire-intake`
- `POST /api/patients/{patient_id}/intake`
- `POST /api/patients/{patient_id}/assessment`
- `GET /api/patients/{patient_id}/assessment`
- `GET /api/patients/{patient_id}/risk-flags`
- `POST /api/recommendations/analyze`
- `GET /api/recommendations/{recommendation_id}`
- `GET /api/recommendations/{recommendation_id}/explanation`
- `POST /api/nutrition-plans/from-recommendation`
- `POST /api/patients/{patient_id}/nutrition-plan`
- `GET /api/patients/{patient_id}/nutrition-plan`
- `GET /api/nutrition-plans/{plan_id}`
- `GET /api/recipes`
- `GET /api/recipes/{recipe_id}`
- `POST /api/shopping-lists/from-nutrition-plan`
- `GET /api/shopping-lists/{shopping_list_id}`
- `POST /api/safety-check`
- `GET /api/meal-kits`
- `GET /api/meal-kits/{meal_kit_id}`
- `GET /api/patients/{patient_id}/meal-kit-suggestions`
- `POST /api/patients/{patient_id}/tracking`
- `GET /api/patients/{patient_id}/tracking`
- `GET /api/professional-reviews`
- `POST /api/professional-reviews`
- `PATCH /api/professional-reviews/{review_id}`
- `POST /api/analytics/events`
- `GET /api/analytics/summary`
- `POST /api/documents/upload`
- `POST /api/orders`
- `GET /api/orders/{order_id}`
- `PATCH /api/orders/{order_id}/status`

## Frontend-BFF-Endpunkte

- `POST /api/frontend/intake/full-analyze`
- `GET /api/frontend/nutrition-plan/{patient_id}`
- `GET /api/frontend/shop/inventory`
- `GET /api/frontend/shop/meal-kits/{meal_kit_id}`
- `GET /api/frontend/recipes/curated/{patient_id}`
- `GET /api/frontend/tracking/daily/{patient_id}`
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`
- `GET /api/frontend/tracking/hydration/{patient_id}`
- `POST /api/frontend/tracking/hydration/{patient_id}/water`

## Dokumenten-Upload MVP

`POST /api/documents/upload` akzeptiert genau eine Datei als Multipart-Feld `file`.

Erlaubt:

- `application/pdf`
- `image/jpeg`
- `image/png`
- maximal 10 MB

Response:

```json
{
  "document_id": "doc_...",
  "filename": "arztbrief-demo.pdf",
  "content_type": "application/pdf",
  "size": 12345,
  "status": "uploaded_demo",
  "analysis_available": false,
  "note": "Dokumente werden im MVP nicht medizinisch ausgewertet."
}
```

## Frontend-Mock-Adapter

Das Frontend nutzt aktuell `nutritionMockApi` als Mock-Schicht. Relevante Methoden:

- `fetchDashboardData()`
- `fetchShopInventory()`
- `fetchMealKit(id)`
- `fetchCuratedMeals()`
- `fetchPatientProfile()`
- `savePatientProfile(profile)`

Diese Methoden duerfen im UI nicht als produktive Backend-Integration verkauft werden, solange sie noch Mock-Daten liefern.
