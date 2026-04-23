# Roadmap fuer Dev1: Frontend und Patient Journey

## Ziel

Dev1 macht den fachlichen Produktkern sichtbar und benutzbar. Das Frontend soll nicht wie ein reiner Shop wirken, sondern wie ein gefuehrter Nachsorge-Flow: Patientin oder Patient versteht den eigenen Plan, sieht Warnungen, kann konkrete naechste Schritte ausfuehren und erkennt, dass Datenschutz ernst genommen wird.

## Prioritaet 1: Demo-Flow klickbar machen

Der wichtigste Frontend-Beitrag ist ein durchgehender Flow:

1. Demo-Einstieg oder Login
2. Patient Profile mit Einwilligung
3. Intake-Fragebogen
4. Analyse-/Recommendation-Schritt
5. Nutrition Plan Ansicht
6. Safety/Warnhinweise
7. Meal-Kit- oder Rezeptvorschlaege
8. Tracking
9. Export/Delete als Privacy-Aktion

Der Flow darf fuer die Abgabe mit Demo-Daten arbeiten, sollte aber auf die echten Backend-Endpunkte vorbereitet sein.

## Prioritaet 2: Nutrition Plan als Hauptscreen

Die Planansicht sollte der Mittelpunkt der App werden.

- 7-Tage-Uebersicht mit Fruehstueck, Mittagessen, Abendessen und Snacks
- Fokus des Plans sichtbar, zum Beispiel proteinreich, leicht zuzubereiten oder magenfreundlich
- Hinweise und Anpassungen aus dem Backend klar anzeigen
- Empfehlungserklaerung verstaendlich darstellen, ohne medizinisch zu uebertreiben
- Warnungen optisch klar von normalen Tipps trennen

## Prioritaet 3: Safety und Warnlogik sichtbar machen

Das Backend liefert Safety Checks und Recommendation Explanations. Dev1 sollte diese Informationen so darstellen, dass sie in der Praesentation fachlich stark wirken.

- Status `clear`, `warning` und `blocked` klar unterscheidbar anzeigen
- Blockierte Meal-Kits nicht als kaufbare Option praesentieren
- Warnungen in einfacher Sprache anzeigen
- Bei kritischen Angaben auf professionelle Ruecksprache oder Review verweisen
- Keine UI-Texte verwenden, die Diagnose, Heilung oder medizinische Freigabe versprechen

## Prioritaet 4: Tracking UI

Tracking soll zeigen, dass Food 4 Recovery mehr ist als ein einmaliger Plan.

- Kurze Eingabe fuer Appetit, Mahlzeiten, Gewicht, Fluessigkeit oder Symptome
- Tagesstatus im Dashboard anzeigen
- Fortschritt nicht als medizinisches Ergebnis, sondern als Beobachtung darstellen
- Fehlende Eingaben freundlich behandeln

## Prioritaet 5: Privacy-Aktionen

Datenschutz ist fuer die Abgabe ein starkes Argument und sollte im UI sichtbar sein.

- Einwilligung beim Profil klar erfassen
- Export patientenbezogener Daten erreichbar machen
- Loeschen des Profils als bewusst bestaetigte Aktion einbauen
- Erfolgs- und Fehlerzustaende verstaendlich anzeigen

## API-Anbindung

Dev1 sollte die echten Backend-Funktionen bevorzugen, wo sie bereits vorhanden sind:

- `POST /api/patient-profile`
- `POST /api/questionnaire-intake`
- `POST /api/recommendations/analyze`
- `POST /api/nutrition-plans/from-recommendation`
- `GET /api/recommendations/{recommendation_id}/explanation`
- `POST /api/safety-check`
- `GET /api/patient-profile/{patient_id}/export`
- `DELETE /api/patient-profile/{patient_id}`

Wenn der bestehende Frontend-BFF genutzt wird, sollte die UI trotzdem fachlich dieselben Schritte zeigen.

## Akzeptanzkriterien

- Der komplette Demo-Flow ist ohne manuelle API-Tools praesentierbar.
- Nutrition Plan, Warnungen und Meal-Kit-Optionen sind fuer Nicht-Techniker verstaendlich.
- Blockierte oder riskante Optionen werden nicht wie normale Empfehlungen dargestellt.
- Privacy Export und Delete sind im UI sichtbar oder mindestens im Demo-Flow vorbereitet.
- Die App wirkt wie digitale Ernaehrungsnachsorge, nicht wie ein allgemeiner Rezeptshop.

## Nicht-Ziele

- Keine echte medizinische Diagnose.
- Keine echte Zahlungsabwicklung.
- Keine vollstaendige Kliniksystemintegration.
- Kein KI-Chatbot mit medizinischen Freitextempfehlungen.
