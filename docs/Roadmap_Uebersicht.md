# Roadmap Übersicht: Food 4 Recovery

## Gemeinsamer Produktfokus

Food 4 Recovery wird für die Abgabe als digitale Ernährungsnachsorge nach der Entlassung positioniert. Der Kern ist nicht ein allgemeiner Health-Shop und nicht ein KI-Arzt, sondern ein strukturierter Nachsorge-Flow:

**Intake -> Risiko-Check -> 7-Tage-Ernährungsplan -> Einkaufsliste/Meal-Kits -> Tracking -> Review/Analytics**

Die Loesung soll Patientinnen und Patienten sowie Angehoerige nach der Entlassung konkret unterstützen: Was kann gegessen werden, was sollte vermieden werden, was muss beobachtet werden und wann ist fachliche Rücksprache sinnvoll?

## Zielgruppe und Rollen

- **Primaere Zielgruppe:** postoperative Patientinnen und Patienten nach Entlassung
- **Sekundaere Zielgruppe:** Angehoerige, die Einkauf, Kochen und Alltagsorganisation unterstützen
- **Fachliche Rolle:** Ernährungsberatung oder medizinisches Fachpersonal für kritische Fälle
- **Zugangskanal:** Klinik, Praxis, Ernährungsberatung oder Versicherung im B2B2C-Modell

## MVP-Schnitt

Der MVP zeigt einen glaubwuerdigen Thin Slice statt vieler loser Features:

1. Patientin oder Patient legt ein Profil mit Einwilligung an.
2. Intake-Fragebogen erfasst medizinischen Kontext, Beschwerden, Allergien, Appetit, Gewicht, Kochmöglichkeiten und Ziele.
3. Backend erzeugt eine regelbasierte Empfehlung und einen 7-Tage-Plan.
4. Safety Check erkennt harte Ausschluesse und Warnungen.
5. Frontend zeigt Plan, Warnhinweise, Meal-Kit-Optionen und Tracking.
6. Kritische Fälle werden für eine professionelle Prüfung sichtbar.
7. Analytics zeigt Nutzung, Abbrueche, Risikoflags und relevante Produktkennzahlen.

## Rollenverteilung im Team

| Rolle | Fokus | Hauptbeitrag |
| --- | --- | --- |
| Dev1 | Frontend und Patient Journey | Macht den Flow klickbar, verständlich und präsentationsreif. |
| Dev2 | Backend/API und Fachlogik | Liefert Daten, Persistenz, Privacy, Safety, Planlogik und interne APIs. |
| Dev3 | Business Case, Doku und Präsentation | Schärft Zielgruppe, Nutzen, Risiken, Roadmap und Abgabeartefakte. |

## Gemeinsamer Demo-Flow

Für die Abgabe sollte das Team denselben Flow zeigen:

1. Login oder Demo-Einstieg
2. Patient Profile mit Einwilligung
3. Intake-Fragebogen
4. Recommendation Analyze
5. Nutrition Plan aus Recommendation
6. Recommendation Explanation
7. Safety Check
8. Plan-Ansicht mit Warnungen und Meal-Kits
9. Tracking von Appetit, Gewicht, Mahlzeiten oder Flüssigkeit
10. Privacy Export oder Delete als Datenschutzbeweis

## Gemeinsame Leitplanken

- Keine Diagnoseversprechen.
- Keine Behauptung, dass KI automatisch fachlich freigegebene Therapieentscheidungen trifft.
- Kritische Angaben loesen Warnung oder Review aus, keine automatische medizinische Freigabe.
- Meal-Kits sind Umsetzungshilfe und optionaler Revenue Stream, nicht der medizinische Kern.
- Datenschutz, Einwilligung, Export und Löschung werden als Produktqualitaet gezeigt.

## Erfolgskriterien für die Abgabe

- Der Produktkern ist enger und professioneller erzaehlt als eine breite Health-App.
- Der Demo-Flow ist technisch nachvollziehbar und fachlich plausibel.
- Backend, Frontend und Business-Story sprechen dieselbe Sprache.
- Risiken und Grenzen werden offen benannt.
- Die wichtigsten Artefakte liegen im Repo und sind für die Präsentation nutzbar.
