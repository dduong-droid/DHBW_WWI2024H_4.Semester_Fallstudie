# API Demo Flow: Food 4 Recovery Backend MVP

## Ziel

Dieser Flow zeigt den kompletten Dev2-Backend-Kern für die Abgabe: Aus einem strukturierten Intake entsteht ein abgegrenzter Planentwurf mit Risk Flags, Shopping List, Safety Check, Tracking, Professional Review und Privacy Export. Die Automatik ersetzt keine ärztliche Behandlung und keine professionelle Ernährungsberatung.

## Vorbereitung

Backend starten:

```bash
cd backend
.venv/Scripts/python.exe -m uvicorn app.main:app --reload
```

Demo-Daten neu erzeugen:

```bash
cd backend
.venv/Scripts/python.exe scripts/seed/seed_demo_data.py --reset
```

Das Script baut die drei stabilen Demo-Personas bei jedem Lauf neu auf, damit die Vorfuehrung nicht durch alte Demo-Daten oder doppelte Intakes verrauscht:

- `demo_maria_post_op`: normaler postoperativer Flow
- `demo_schluckproblem_review`: kritischer Fall mit Review Required
- `demo_allergy_safety`: Allergie-/Safety-Fall mit blockiertem Meal-Kit

Wenn `API_KEY` gesetzt ist, bei geschuetzten Endpunkten den Header `X-API-Key: <wert>` mitsenden.

## 1. Patient anlegen

```http
POST /api/patients
```

```json
{
  "patient_id": "demo_maria_post_op",
  "first_name": "Maria",
  "last_name": "Demo",
  "birth_date": "1962-03-15",
  "email": "demo_maria_post_op@example.com",
  "phone": "+49123456789",
  "height_cm": 168,
  "weight_kg": 72,
  "activity_level": "low",
  "support_at_home": "partial_support",
  "known_conditions": ["post_op_recovery"],
  "allergies": [],
  "dietary_preferences": ["balanced", "easy_prep"],
  "consent_data_processing": true,
  "medical_context": "postoperative Nachsorge nach Entlassung",
  "surgery_type": "Hueft-OP",
  "discharge_date": "2026-04-20",
  "therapy_phase": "post_discharge"
}
```

Erwartet: `patient_id`, Stammdaten, Consent.

## 2. Intake erstellen

```http
POST /api/patients/demo_maria_post_op/intake
```

Request ist das bestehende `QuestionnaireContent`-Schema. Wichtige Felder für die Demo sind Appetit, Essmenge, Mahlzeiten, Trinkmenge, Beschwerden, Allergien/Unverträglichkeiten, Kochmöglichkeit und Unterstützung.

Erwartet: `intake_id`, `derived_flags`, `status`.

## 3. Assessment erzeugen

```http
POST /api/patients/demo_maria_post_op/assessment
```

Erwartet:

- `nutrition_status`
- `recommendation_readiness`
- `risk_flags`
- `main_problems`

Bei High-Risk-Fällen wird `reviewRequired` oder `insufficientData` sichtbar.

## 4. Recommendation analysieren

```http
POST /api/recommendations/analyze
```

```json
{
  "intake_id": "<intake_id>"
}
```

Erwartet:

- `recommendation_id`
- `summary`
- `recommended_weekly_plan`
- `recommended_meal_kits`
- `dietary_warnings`
- `rationale`

## 5. Nutrition Plan erzeugen

```http
POST /api/nutrition-plans/from-recommendation
```

```json
{
  "recommendation_id": "<recommendation_id>"
}
```

Erwartet:

- `plan_id`
- `status`: `draft`, `review_required`, `approved_mock` oder `blocked`
- `weekly_plan`
- `linked_risk_flags`
- `safety_notes`

Wichtig: Kritische Pläne sind Entwuerfe und keine automatische medizinische Freigabe.

## 6. Shopping List erzeugen

```http
POST /api/nutrition-plans/{plan_id}/shopping-list
```

Erwartet:

- `shopping_list_id`
- `items`
- `grouped_by_category`
- `related_recipes`

## 7. Recommendation Explanation abrufen

```http
GET /api/recommendations/{recommendation_id}/explanation
```

Erwartet:

- `template_scores`
- `derived_flags`
- `meal_kit_scores`
- `final_rationale`

Dieser Schritt zeigt, dass die Logik nachvollziehbar ist und keine Black-Box-KI entscheidet.

## 8. Safety Check ausfuehren

```http
POST /api/safety-check
```

```json
{
  "patient_id": "demo_allergy_safety",
  "recommendation_id": "<recommendation_id>",
  "meal_kit_ids": ["produktdetails_immun_boost_box"]
}
```

Erwartet bei Allergiekonflikt:

- `status`: `blocked`
- `blocked_meal_kits`
- `review_required`: `true`
- `review_id`

Nur harte Blocks erzeugen automatisch einen Professional Review. Warnungen bleiben Hinweise.

## 9. Tracking einreichen

```http
POST /api/patients/{patient_id}/tracking
```

```json
{
  "date": "2026-04-29",
  "weight": 70,
  "appetite_score": 1,
  "meals_completed": 1,
  "fluid_intake_ml": 900,
  "nausea_score": 4,
  "pain_score": 3,
  "stool_issue": "durchfall",
  "notes": "deutlich schlechter"
}
```

Erwartet:

- `tracking_id`
- `generated_risk_flags`
- bei kritischen Signalen offener Review mit `source="tracking"`

## 10. Professional Reviews abrufen

```http
GET /api/professional-reviews?status=pending
```

Erwartet:

- offene Reviews aus `nutrition_plan`, `tracking` oder `safety_check`
- `risk_flag_ids`
- `comments`

Mock-Freigabe:

```http
PATCH /api/professional-reviews/{review_id}
```

```json
{
  "status": "approved",
  "reviewer_role": "nutritionist",
  "reviewer_name": "Demo Ernährungsberatung",
  "comments": "Mock-Freigabe für die Abgabe."
}
```

Erwartet: verknuepfter Plan wird `approved_mock`, falls der Review einen Plan referenziert.

## 11. Analytics abrufen

```http
GET /api/analytics/summary
GET /api/analytics/risk-flags
GET /api/analytics/funnel
```

Erwartet:

- Intake-/Plan-/Shopping-/Tracking-Events
- Risk-Flag-Haeufigkeiten
- Review- und Funnel-Kennzahlen

Analytics dient der Produkt- und Prozessverbesserung, nicht medizinischer Überwachung.

## 12. Privacy Export/Delete zeigen

```http
GET /api/patients/{patient_id}/export
DELETE /api/patients/{patient_id}
```

Export trennt Profil, Fragebögen, Assessments, Risk Flags, Recommendations, Pläne, Shopping Lists, Reviews, Orders, Tracking und Analytics Events.

Delete entfernt die patientenbezogenen Daten für diese Demo-ID.
