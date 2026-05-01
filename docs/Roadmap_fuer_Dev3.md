# Roadmap für Dev3: Business Case, Doku und Präsentation

## Ziel

Dev3 macht aus der technischen Demo eine fachlich und wirtschaftlich überzeugende Fallstudie. Die Story soll eng, realistisch und professionell wirken: Food 4 Recovery ist digitale Ernährungsnachsorge nach Entlassung, keine breite Health-App und kein KI-Heilversprechen.

## Prioritaet 1: MVP-Schnitt schärfen

Der MVP sollte klar als Thin Slice beschrieben werden:

**postoperative Patientin nach Entlassung -> strukturierter Intake -> Risiko-Check -> 7-Tage-Plan -> Einkaufsliste/Meal-Kits -> Tracking -> Review bei kritischen Angaben**

Dev3 sollte besonders herausarbeiten:

- Warum postoperative Nachsorge zuerst sinnvoller ist als alle Zielgruppen gleichzeitig
- Warum B2B2C realistischer ist als reines B2C
- Warum Meal-Kits optionaler Umsetzungshelfer sind und nicht der medizinische Kern
- Warum KI unterstützt, aber nicht alleine entscheidet

## Prioritaet 2: Use-Case-Matrix

Eine Use-Case-Matrix zeigt, dass das Team fachlich priorisieren kann.

Wichtige Use Cases:

- Patientin erhaelt einen 7-Tage-Ernährungsplan.
- Angehoerige erhalten eine Einkaufshilfe.
- Patientin dokumentiert Appetit, Gewicht, Flüssigkeit oder Symptome.
- System erkennt Allergien, Unverträglichkeiten und Warnflags.
- Ernährungsberatung sieht kritische Fälle zur Prüfung.
- Betreiber sieht Abbrueche, Nutzung und Risikoflags.

Bewertungskriterien:

- fachlicher Nutzen
- technische Komplexitaet
- Datenbedarf
- Risiko
- MVP-Relevanz
- Präsentationswert

## Prioritaet 3: Datenmodell und Datenschutzmodell

Dev3 sollte das fachliche Datenmodell für die Abgabe erklären.

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
- Export und Löschung sind Teil des Produktwerts.
- Rollen und Zugriffe werden fachlich getrennt.

## Prioritaet 4: Risiko- und Entscheidungslogik

Die Fallstudie sollte zeigen, wo regelbasierte Logik besser ist als KI.

Regelbasiert:

- Allergien und Unverträglichkeiten
- Schluckprobleme
- starker Gewichtsverlust
- wiederholtes Erbrechen oder Durchfall
- Meal-Kit-Kontraindikationen
- Review-Trigger

KI oder Simulation nur vorsichtig:

- Dokumentenextraktion als Vorbefuellung
- Klassifikation zur Priorisierung
- Erklärung des Plans in einfacher Sprache
- keine Diagnose, keine Therapieänderung, keine Notfallberatung

## Prioritaet 5: Service Blueprint

Ein Service Blueprint verbindet die Stakeholder und macht die Loesung realistisch.

Empfohlene Spuren:

- Patientin/Patient
- Angehoerige
- Klinik oder Praxis
- Ernährungsberatung
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

Analytics sollte nicht als Überwachung wirken, sondern als Produkt- und Versorgungsqualitaet.

Wichtige Kennzahlen:

- Intake-Abschlussrate
- Abbruch pro Intake-Schritt
- Nutrition Plan geöffnet
- Shopping List erstellt oder genutzt
- Tracking D1/D7
- Safety-Warning-Rate
- Review-Trigger-Rate
- Meal-Kit-Conversion
- Privacy Export/Delete Nutzung

## Präsentationsleitlinien

Gute Aussagen:

- "Food 4 Recovery strukturiert Ernährung als Teil der Nachsorge."
- "Die Loesung reduziert Unsicherheit bei Patienten und Angehoerigen."
- "Kritische Angaben loesen Warnung oder fachliche Prüfung aus."
- "KI unterstützt, entscheidet aber nicht alleine."
- "Datenschutz ist als Produktfunktion sichtbar."

Aussagen vermeiden:

- "Die App beschleunigt Heilung."
- "Die KI erstellt automatisch fachlich freigegebene Therapiepläne."
- "Food 4 Recovery verhindert Wiedereinweisungen."
- "Das Produkt ist sofort DiGA-faehig."
- "Die App ersetzt Ernährungsberatung."

## Akzeptanzkriterien

- Die Zielgruppe ist eng und klar beschrieben.
- Business Case, MVP, Technik und Datenschutz passen zusammen.
- Risiken werden offen benannt und nicht kaschiert.
- Die Präsentation kann den Demo-Flow fachlich einordnen.
- Dev1 und Dev2 können ihre Arbeit direkt an Dev3s Story anschließen.

## Nicht-Ziele

- Keine vollständige regulatorische Produktdokumentation.
- Keine echte klinische Studie.
- Keine DiGA-Zulassung als kurzfristiges Ziel.
- Keine überladene Zielgruppe mit OP, Onkologie, Fitness und Lifestyle gleichzeitig.
