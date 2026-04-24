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
- persistierte Nutrition Plans aus Empfehlungen
- Nutrition Assessment mit Risk Flags und Recommendation Readiness
- Safety Check fuer Allergien, Unvertraeglichkeiten und Meal-Kit-Kontraindikationen
- Recommendation Explanation mit Scores, Flags und Begruendungen
- Rezeptkatalog aus den regelbasierten Planvorlagen
- Shopping Lists aus 7-Tage-Plaenen
- Symptom-, Gewichts- und Appetit-Tracking
- Professional Review Workflow fuer kritische Faelle
- interne Analytics Events und Summary-Endpunkte
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
- `GET /api/nutrition-plans/patient/{patient_id}/latest`
- `GET /api/recipes`
- `GET /api/recipes/{recipe_id}`
- `POST /api/nutrition-plans/{plan_id}/shopping-list`
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
- `GET /api/analytics/risk-flags`
- `GET /api/analytics/funnel`
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
- Der Export trennt Profil, Frageboegen, Assessments, Risk Flags, Empfehlungen, Plaene, Shopping Lists, Reviews, Orders, Tracking und Analytics Events.

Fehler werden einheitlich als `{"error": {"code": "...", "message": "...", "details": ...}}` ausgegeben.

## MVP-Fachlogik

Das Backend bildet den Zielprozess `Intake -> Assessment -> Risk Flags -> Recommendation -> Nutrition Plan -> Shopping List -> Safety/Review -> Tracking/Analytics` ab.

- Risk Flags werden regelbasiert erzeugt, z. B. bei Schluckproblemen, sehr geringem Appetit, kaum Nahrungsaufnahme, starkem Gewichtsverlust, kritischen Freitextangaben oder unklaren medizinischen Kontexten.
- High-Risk-Flags oder `blocks_automatic_plan=true` setzen Plaene auf `review_required` oder `blocked`.
- Ein Plan mit kritischen Flags ist ein Entwurf und wird nicht als medizinisch freigegeben dargestellt.
- Professional Review ist im MVP eine Simulation: Fachrollen koennen Plaene mock-approven, ablehnen oder Aenderungen anfordern.
- Recipe Matching schliesst Allergien und Unvertraeglichkeiten aus, priorisiert leichte Mahlzeiten bei Uebelkeit, einfache Zubereitung bei Fatigue und protein-/energiereichere Optionen bei Gewichtsrisiko.
- Meal-Kits bleiben optionaler Umsetzungsbaustein und werden nicht als Therapie verkauft.

## KI-Abgrenzung

Food 4 Recovery nutzt in diesem Backend keine echte medizinische KI-Entscheidung. Die Logik ist bewusst regelbasiert und erklaerbar.

Erlaubt im MVP:

- strukturierte Mock-/Heuristik-Auswertung von Intake-Daten
- Rationale-Texte fuer Empfehlungen
- Freitext als `needs review` markieren
- Analytics zur Produkt- und Prozessverbesserung

Nicht enthalten:

- keine Diagnose
- keine Laborwertinterpretation
- keine Medikationsinteraktionspruefung
- keine Therapieanweisung
- keine Heilungs- oder Komplikationsvermeidungsversprechen

## Dev2 Demo-Flow

Ein produktnaher Backend-Flow fuer die Fallstudie ist:

1. `POST /api/patient-profile`
2. `POST /api/questionnaire-intake`
3. `POST /api/patients/{patient_id}/assessment`
4. `POST /api/recommendations/analyze`
5. `POST /api/nutrition-plans/from-recommendation`
6. `POST /api/nutrition-plans/{plan_id}/shopping-list`
7. `GET /api/recommendations/{recommendation_id}/explanation`
8. `POST /api/safety-check`
9. `POST /api/patients/{patient_id}/tracking`
10. `GET /api/professional-reviews`
11. `POST /api/orders`
12. `GET /api/patient-profile/{patient_id}/export`

Die Nutrition-Plan-API speichert den aus der Recommendation erzeugten Wochenplan als eigenstaendigen Plan.
Der Safety Check ist eine regelbasierte Plausibilitaetspruefung und ersetzt keine medizinische Freigabe.
Kritische Faelle werden ueber Risk Flags und Professional Reviews sichtbar.

## Tests

```bash
pytest app/tests
```
