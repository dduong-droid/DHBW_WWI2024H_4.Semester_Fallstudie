# Shared API Contracts

Dieses Dokument ist die leichte teamuebergreifende Contract-Uebersicht fuer den MVP. Die typisierten Python-Schemas bleiben aktuell im Backend, weil dort die Domainlogik liegt. Frontend und Praesentation koennen diese Datei als stabile Orientierung nutzen.

## MVP Flow

```text
PatientProfile -> QuestionnaireIntake -> NutritionAssessment -> Recommendation -> NutritionPlan -> ShoppingList -> SafetyCheck -> ProfessionalReview/Tracking -> Analytics/Privacy
```

## Wichtige Statuswerte

- RiskFlag severity: `low`, `medium`, `high`
- Recommendation readiness: `ready`, `reviewRequired`, `insufficientData`
- NutritionPlan status: `draft`, `review_required`, `approved_mock`, `blocked`
- SafetyCheck status: `clear`, `warning`, `blocked`
- ProfessionalReview status: `pending`, `approved`, `rejected`, `changes_requested`

## Contract-Regeln

- Alle sensiblen Reads und alle Write-Endpunkte sind per `X-API-Key` geschuetzt, sobald `API_KEY` gesetzt ist.
- Ohne `consent_data_processing=true` darf kein PatientProfile verarbeitet werden.
- High-Risk-Flags duerfen keinen final freigegebenen automatischen Plan erzeugen.
- Meal-Kits sind optionale Umsetzungshilfe und keine medizinische Therapie.
- Fehlerformat: `{"error": {"code": "...", "message": "...", "details": ...}}`.

## Wichtigste Backend-Endpunkte

- `POST /api/patients`
- `POST /api/patients/{patient_id}/intake`
- `POST /api/patients/{patient_id}/assessment`
- `POST /api/recommendations/analyze`
- `POST /api/nutrition-plans/from-recommendation`
- `POST /api/nutrition-plans/{plan_id}/shopping-list`
- `POST /api/safety-check`
- `POST /api/patients/{patient_id}/tracking`
- `GET /api/professional-reviews`
- `GET /api/analytics/summary`
- `GET /api/patients/{patient_id}/export`
- `DELETE /api/patients/{patient_id}`
