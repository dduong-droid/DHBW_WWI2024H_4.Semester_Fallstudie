# Roadmap fuer Dev2: Backend/API und Fachlogik

## Ziel

Dev2 verantwortet den fachlichen Produktkern im Backend. Das Backend soll zeigen, dass Food 4 Recovery nicht nur Mockdaten ausliefert, sondern Patientendaten, Intake, Empfehlungen, Safety, Erklaerbarkeit, Privacy und Persistenz sinnvoll verbindet.

## Bereits umgesetzt

Der aktuelle Backend-Stand enthaelt bereits wichtige produktnahe Grundlagen:

- FastAPI Domain-Endpunkte unter `/api/...`
- SQLite-Persistenz fuer Patientenprofile, Frageboegen, Empfehlungen, Orders und Tracking
- API-Key-Schutz fuer sensible Endpunkte, wenn `API_KEY` gesetzt ist
- Pflicht zur Einwilligung ueber `consent_data_processing`
- Privacy Export und Loeschung patientenbezogener Daten
- Recommendation Engine mit regelbasierter Logik
- persistierte Nutrition Plans aus Recommendations
- Safety Check fuer Allergien, Unvertraeglichkeiten und Meal-Kit-Kontraindikationen
- Recommendation Explanation mit Scores, Flags und fachlicher Begruendung
- Tests fuer API, Persistenz, Privacy und neue Dev2-Module

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
- Response enthaelt `shopping_list_id`, `patient_id`, `nutrition_plan_id`, `items`, `status`, `created_at`.

## Naechste Backend-Erweiterung 2: Professional Review API

Kritische Faelle sollten nicht automatisch final entschieden werden. Eine Review-API macht die fachliche Grenze glaubwuerdig.

Geplante Endpunkte:

- `POST /api/professional-reviews`
- `GET /api/professional-reviews/{review_id}`
- `GET /api/professional-reviews/patient/{patient_id}/latest`
- `PATCH /api/professional-reviews/{review_id}/status`

Verhalten:

- Review kann aus Recommendation, Nutrition Plan oder Safety Check entstehen.
- Statuswerte: `pending`, `approved`, `changes_requested`, `rejected`.
- Speichert Ausloeser, Risikoflags, Kommentar und optional Reviewer-Rolle.
- Kritische Safety-Ergebnisse koennen als Review-Kandidaten dargestellt werden.

## Naechste Backend-Erweiterung 3: Analytics/Event API

Analytics ist fuer Business Case und Produktoptimierung wichtig. Im MVP reicht ein einfaches internes Event-Modell.

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

## Naechste Backend-Erweiterung 4: API Contract Uebersicht

Fuer Dev1 und die Praesentation sollte Dev2 eine kurze Contract-Uebersicht pflegen.

Inhalt:

- wichtigste Domain-Endpunkte
- Request-/Response-Beispiele fuer Demo-Flow
- Auth-Verhalten mit `X-API-Key`
- Fehlerformat
- Privacy-Endpunkte
- Hinweis, welche Endpunkte oeffentlich sind

Diese Uebersicht kann als `docs/API_Contract_Uebersicht.md` oder im Backend-README ergaenzt werden.

## Testplan

Neue Backend-Erweiterungen sollten jeweils Tests erhalten:

- Shopping List wird aus Nutrition Plan erzeugt und ist idempotent.
- Shopping List latest liefert die neueste Liste fuer einen Patienten.
- Professional Review kann erstellt, gelesen und im Status geaendert werden.
- Analytics Events koennen gespeichert und als Summary aggregiert werden.
- Neue sensible Endpunkte sind bei gesetztem `API_KEY` geschuetzt.
- Bestehender Demo-Flow bleibt gruen.

Standardpruefung:

```bash
python -m pytest app/tests
```

## Akzeptanzkriterien

- Backend unterstuetzt den kompletten MVP-Flow fachlich nachvollziehbar.
- Bestehende API-Vertraege bleiben kompatibel.
- Neue APIs sind additiv und stoeren Frontend-BFF nicht.
- Datenschutz, Safety und Review-Grenzen sind technisch sichtbar.
- README oder API-Contract-Doku erklaert den Demo-Flow fuer Dev1 und Dev3.

## Nicht-Ziele

- Keine echte DiGA- oder MDR-Produktionsreife.
- Keine automatische Medikationsinteraktionspruefung.
- Keine echte Laborwertinterpretation.
- Keine echte KI-Dokumentenanalyse.
- Keine echte Zahlungs- oder Lieferlogistik.
