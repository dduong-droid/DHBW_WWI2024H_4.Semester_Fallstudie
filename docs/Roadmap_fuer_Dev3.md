# Roadmap fuer Dev3: Business Case, Doku und Praesentation

## Ziel

Dev3 macht aus der technischen Demo eine fachlich und wirtschaftlich ueberzeugende Fallstudie. Die Story soll eng, realistisch und professionell wirken: Food 4 Recovery ist digitale Ernaehrungsnachsorge nach Entlassung, keine breite Health-App und kein KI-Heilversprechen.

## Prioritaet 1: MVP-Schnitt schaerfen

Der MVP sollte klar als Thin Slice beschrieben werden:

**postoperative Patientin nach Entlassung -> strukturierter Intake -> Risiko-Check -> 7-Tage-Plan -> Einkaufsliste/Meal-Kits -> Tracking -> Review bei kritischen Angaben**

Dev3 sollte besonders herausarbeiten:

- Warum postoperative Nachsorge zuerst sinnvoller ist als alle Zielgruppen gleichzeitig
- Warum B2B2C realistischer ist als reines B2C
- Warum Meal-Kits optionaler Umsetzungshelfer sind und nicht der medizinische Kern
- Warum KI unterstuetzt, aber nicht alleine entscheidet

## Prioritaet 2: Use-Case-Matrix

Eine Use-Case-Matrix zeigt, dass das Team fachlich priorisieren kann.

Wichtige Use Cases:

- Patientin erhaelt einen 7-Tage-Ernaehrungsplan.
- Angehoerige erhalten eine Einkaufshilfe.
- Patientin dokumentiert Appetit, Gewicht, Fluessigkeit oder Symptome.
- System erkennt Allergien, Unvertraeglichkeiten und Warnflags.
- Ernaehrungsberatung sieht kritische Faelle zur Pruefung.
- Betreiber sieht Abbrueche, Nutzung und Risikoflags.

Bewertungskriterien:

- fachlicher Nutzen
- technische Komplexitaet
- Datenbedarf
- Risiko
- MVP-Relevanz
- Praesentationswert

## Prioritaet 3: Datenmodell und Datenschutzmodell

Dev3 sollte das fachliche Datenmodell fuer die Abgabe erklaeren.

Kernobjekte:

- PatientProfile
- MedicalContext
- NutritionAssessment
- Recommendation
- NutritionPlan
- Recipe
- MealKit
- ShoppingList
- SymptomTracking
- RiskFlag
- ProfessionalReview

Datenschutzargumentation:

- Gesundheitsdaten sind sensibel.
- Einwilligung ist Pflicht.
- Datensparsamkeit wird als MVP-Prinzip genutzt.
- Export und Loeschung sind Teil des Produktwerts.
- Rollen und Zugriffe werden fachlich getrennt.

## Prioritaet 4: Risiko- und Entscheidungslogik

Die Fallstudie sollte zeigen, wo regelbasierte Logik besser ist als KI.

Regelbasiert:

- Allergien und Unvertraeglichkeiten
- Schluckprobleme
- starker Gewichtsverlust
- wiederholtes Erbrechen oder Durchfall
- Meal-Kit-Kontraindikationen
- Review-Trigger

KI oder Simulation nur vorsichtig:

- Dokumentenextraktion als Vorbefuellung
- Klassifikation zur Priorisierung
- Erklaerung des Plans in einfacher Sprache
- keine Diagnose, keine Therapieaenderung, keine Notfallberatung

## Prioritaet 5: Service Blueprint

Ein Service Blueprint verbindet die Stakeholder und macht die Loesung realistisch.

Empfohlene Spuren:

- Patientin/Patient
- Angehoerige
- Klinik oder Praxis
- Ernaehrungsberatung
- Food 4 Recovery Plattform
- Meal-Kit-Partner

Wichtige Prozessschritte:

1. Entlassung oder Zugangscode
2. Intake
3. Risiko- und Safety-Check
4. Planerstellung
5. Review bei kritischem Fall
6. Planansicht und Einkauf
7. Tracking
8. Analytics und Produktverbesserung

## Prioritaet 6: KPI- und Analytics-Konzept

Analytics sollte nicht als Ueberwachung wirken, sondern als Produkt- und Versorgungsqualitaet.

Wichtige Kennzahlen:

- Intake-Abschlussrate
- Abbruch pro Intake-Schritt
- Nutrition Plan geoeffnet
- Shopping List erstellt oder genutzt
- Tracking D1/D7
- Safety-Warning-Rate
- Review-Trigger-Rate
- Meal-Kit-Conversion
- Privacy Export/Delete Nutzung

## Praesentationsleitlinien

Gute Aussagen:

- "Food 4 Recovery strukturiert Ernaehrung als Teil der Nachsorge."
- "Die Loesung reduziert Unsicherheit bei Patienten und Angehoerigen."
- "Kritische Angaben loesen Warnung oder fachliche Pruefung aus."
- "KI unterstuetzt, entscheidet aber nicht alleine."
- "Datenschutz ist als Produktfunktion sichtbar."

Aussagen vermeiden:

- "Die App beschleunigt Heilung."
- "Die KI erstellt automatisch fachlich freigegebene Therapieplaene."
- "Food 4 Recovery verhindert Wiedereinweisungen."
- "Das Produkt ist sofort DiGA-faehig."
- "Die App ersetzt Ernaehrungsberatung."

## Akzeptanzkriterien

- Die Zielgruppe ist eng und klar beschrieben.
- Business Case, MVP, Technik und Datenschutz passen zusammen.
- Risiken werden offen benannt und nicht kaschiert.
- Die Praesentation kann den Demo-Flow fachlich einordnen.
- Dev1 und Dev2 koennen ihre Arbeit direkt an Dev3s Story anschliessen.

## Nicht-Ziele

- Keine vollstaendige regulatorische Produktdokumentation.
- Keine echte klinische Studie.
- Keine DiGA-Zulassung als kurzfristiges Ziel.
- Keine ueberladene Zielgruppe mit OP, Onkologie, Fitness und Lifestyle gleichzeitig.
