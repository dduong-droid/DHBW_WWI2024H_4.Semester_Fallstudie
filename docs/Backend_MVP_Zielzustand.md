# Backend MVP Zielzustand: Food 4 Recovery

## Zielbild

Das Backend zeigt einen praxisnahen MVP fuer strukturierte Ernaehrungsnachsorge nach der Entlassung. Aus einem Patient Intake entsteht kein medizinisches Heilversprechen, sondern ein sicher abgegrenzter Vorschlag mit Risk Flags, 7-Tage-Plan, Einkaufsliste, optionalen Meal-Kits, Tracking, Datenschutz und Professional Review.

## Kernprozess

1. Patient Profile mit `consent_data_processing=true`
2. strukturierter Intake
3. Nutrition Assessment
4. regelbasierte Risk Flags
5. Recommendation und 7-Tage-Nutrition-Plan
6. Shopping List aus Plan-Zutaten
7. Safety Check fuer Allergien, Unvertraeglichkeiten und Kontraindikationen
8. Professional Review bei kritischen Faellen
9. Symptom-/Gewichts-/Appetit-Tracking
10. Analytics Summary und Privacy Export/Delete

## Risk-Flag-Logik

Risk Flags enthalten `id`, `type`, `severity`, `title`, `description`, `triggered_by`, `recommended_action`, `requires_professional_review` und `blocks_automatic_plan`.

High-Risk oder blockierende Flags sorgen dafuer, dass Plaene nicht als freigegeben erscheinen. Der Status wird `review_required` oder `blocked`, und ein Professional Review kann angelegt werden.

Beispiele:

- starker Gewichtsverlust
- sehr geringer Appetit
- kaum Nahrungsaufnahme
- wiederholtes Erbrechen
- Schluckprobleme
- relevante Allergien oder Unvertraeglichkeiten
- keine Kochmoeglichkeit und keine Unterstuetzung
- kritische Freitextangaben
- unvollstaendige Daten
- Medikamente/Supplements angegeben, aber nicht geprueft

## Datenmodell

Persistierte MVP-Domaenen:

- PatientProfile
- QuestionnaireIntake
- NutritionAssessment
- RiskFlag
- Recommendation
- NutritionPlan
- ShoppingList
- SymptomTracking
- ProfessionalReview
- Order
- AnalyticsEvent

Die Persistenz folgt dem bestehenden SQLite-JSON-Payload-Pattern. Komplexe Fachobjekte bleiben als typisierte Pydantic-Schemas in der API sichtbar.

## API-Gruppen

- Patient/Privacy: `/api/patients`, `/api/patient-profile`
- Intake: `/api/questionnaire-intake`, `/api/patients/{patient_id}/intake`
- Assessment/Risk: `/api/patients/{patient_id}/assessment`, `/api/patients/{patient_id}/risk-flags`
- Recommendation/Explanation: `/api/recommendations/...`
- Plan: `/api/nutrition-plans/...`, `/api/patients/{patient_id}/nutrition-plan`
- Recipes: `/api/recipes`
- Shopping List: `/api/shopping-lists/...`
- Meal Kits: `/api/meal-kits`, `/api/patients/{patient_id}/meal-kit-suggestions`
- Tracking: `/api/patients/{patient_id}/tracking`
- Review: `/api/professional-reviews`
- Analytics: `/api/analytics/summary`, `/api/analytics/risk-flags`, `/api/analytics/funnel`

## Medizinische Grenzen

Food 4 Recovery ersetzt keine aerztliche Behandlung und keine professionelle Ernaehrungsberatung. Das Backend trifft keine Diagnose, interpretiert keine Laborwerte verbindlich und prueft keine Medikationsinteraktionen. Kritische Faelle werden regelbasiert erkannt und zur menschlichen Pruefung markiert.

## Demo-Szenarien

- Allergie schliesst Rezept- und Meal-Kit-Konflikte aus.
- Schluckprobleme erzeugen High-Risk und Review Required.
- Fehlender Consent blockiert Verarbeitung.
- Starker Gewichtsverlust erzeugt Risk Flags.
- Shopping List wird aus dem 7-Tage-Plan generiert.
- Tracking kann neue Risk Flags erzeugen.
- Professional Review kann einen Plan mock-approven.
- Analytics zeigt Funnel- und Risk-Flag-Kennzahlen.

## Testbefehl

```bash
cd backend
.venv/Scripts/python.exe -m pytest app/tests
```
