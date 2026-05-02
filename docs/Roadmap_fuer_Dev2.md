# Roadmap für Dev2: Backend/API und Fachlogik

## Ziel

Dev2 verantwortet den fachlichen Produktkern im Backend. Das Backend soll zeigen, dass Food 4 Recovery nicht nur Mockdaten ausliefert, sondern Patientendaten, Intake, Empfehlungen, Safety, Erklärbarkeit, Privacy und Persistenz sinnvoll verbindet.

## Bereits umgesetzt

Der aktuelle Backend-Stand enthält bereits wichtige produktnahe Grundlagen:

- FastAPI Domain-Endpunkte unter `/api/...`
- SQLite-Persistenz für Patientenprofile, Fragebögen, Empfehlungen, Orders und Tracking
- API-Key-Schutz für sensible Endpunkte, wenn `API_KEY` gesetzt ist
- Pflicht zur Einwilligung über `consent_data_processing`
- Privacy Export und Löschung patientenbezogener Daten
- Recommendation Engine mit regelbasierter Logik
- persistierte Nutrition Plans aus Recommendations
- Safety Check für Allergien, Unverträglichkeiten und Meal-Kit-Kontraindikationen
- Recommendation Explanation mit Scores, Flags und fachlicher Begründung
- Tests für API, Persistenz, Privacy und neue Dev2-Module

Damit ist Dev2 schon nah am MVP-Kern: Intake -> Recommendation -> Nutrition Plan -> Safety -> Explanation -> Order.

## Naechste Backend-Erweiterung 1: Shopping List API

Die Einkaufsliste ist ein sehr starkes Praxisartefakt, weil sie aus dem Plan eine konkrete Handlung macht.

Geplante Endpunkte:

- `POST /api/shopping-lists/from-nutrition-plan`
- `GET /api/shopping-lists/{shopping_list_id}`
- `GET /api/shopping-lists/patient/{patient_id}/latest`

Verhalten:

- Nimmt `nutrition_plan_id` entgegen.
- Erzeugt eine persistierte Einkaufsliste aus dem Wochenplan.
- Aggregiert Zutaten nach Kategorie, soweit die Planstruktur es erlaubt.
- Bleibt idempotent pro `nutrition_plan_id`.
- Response enthält `shopping_list_id`, `patient_id`, `nutrition_plan_id`, `items`, `status`, `created_at`.

## Naechste Backend-Erweiterung 2: Professional Review API

Kritische Fälle sollten nicht automatisch final entschieden werden. Eine Review-API macht die fachliche Grenze glaubwuerdig.

Geplante Endpunkte:

- `POST /api/professional-reviews`
- `GET /api/professional-reviews/{review_id}`
- `GET /api/professional-reviews/patient/{patient_id}/latest`
- `PATCH /api/professional-reviews/{review_id}/status`

Verhalten:

- Review kann aus Recommendation, Nutrition Plan oder Safety Check entstehen.
- Statuswerte: `pending`, `approved`, `changes_requested`, `rejected`.
- Speichert Ausloeser, Risikoflags, Kommentar und optional Reviewer-Rolle.
- Kritische Safety-Ergebnisse können als Review-Kandidaten dargestellt werden.

## Naechste Backend-Erweiterung 3: Analytics/Event API

Analytics ist für Business Case und Produktoptimierung wichtig. Im MVP reicht ein einfaches internes Event-Modell.

Geplante Endpunkte:

- `POST /api/analytics/events`
- `GET /api/analytics/patient/{patient_id}/events`
- `GET /api/analytics/summary`

Typische Events:

- `onboarding_started`
- `onboarding_completed`
- `intake_step_completed`
- `recommendation_created`
- `nutrition_plan_opened`
- `shopping_list_created`
- `meal_kit_viewed`
- `order_created`
- `tracking_submitted`
- `privacy_export_requested`
- `profile_deleted`

Die Summary sollte einfache Kennzahlen liefern: Anzahl Profile, abgeschlossene Intakes, Recommendations, Plans, Safety Warnings, Orders und Tracking Events.

## Naechste Backend-Erweiterung 4: API Contract Übersicht

Für Dev1 und die Präsentation sollte Dev2 eine kurze Contract-Übersicht pflegen.

Inhalt:

- wichtigste Domain-Endpunkte
- Request-/Response-Beispiele für Demo-Flow
- Auth-Verhalten mit `X-API-Key`
- Fehlerformat
- Privacy-Endpunkte
- Hinweis, welche Endpunkte öffentlich sind

Diese Übersicht kann als `docs/API_Contract_Übersicht.md` oder im Backend-README ergänzt werden.

## Testplan

Neue Backend-Erweiterungen sollten jeweils Tests erhalten:

- Shopping List wird aus Nutrition Plan erzeugt und ist idempotent.
- Shopping List latest liefert die neueste Liste für einen Patienten.
- Professional Review kann erstellt, gelesen und im Status geändert werden.
- Analytics Events können gespeichert und als Summary aggregiert werden.
- Neue sensible Endpunkte sind bei gesetztem `API_KEY` geschuetzt.
- Bestehender Demo-Flow bleibt grün.

Standardprüfung:

```bash
python -m pytest app/tests
```

## Akzeptanzkriterien

- Backend unterstützt den kompletten MVP-Flow fachlich nachvollziehbar.
- Bestehende API-Verträge bleiben kompatibel.
- Neue APIs sind additiv und stoeren Frontend-BFF nicht.
- Datenschutz, Safety und Review-Grenzen sind technisch sichtbar.
- README oder API-Contract-Doku erklärt den Demo-Flow für Dev1 und Dev3.

## Nicht-Ziele

- Keine echte DiGA- oder MDR-Produktionsreife.
- Keine automatische Medikationsinteraktionsprüfung.
- Keine echte Laborwertinterpretation.
- Keine echte KI-Dokumentenanalyse.
- Keine echte Zahlungs- oder Lieferlogistik.
