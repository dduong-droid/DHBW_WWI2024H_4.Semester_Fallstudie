# Food4Recovery - User Stories

Basierend auf der Analyse des Projekts und dessen Scope (Health-Tech, Post-OP Recovery, Onboarding, Meal-Kits, Dashboard, Mock-BFF-Struktur) wurden die folgenden 10 konkreten User Stories definiert.

## US-01: Patienten-Onboarding und Erstanamnese
**Als** Patient (Nutzer)  
**möchte ich** bei der ersten Anmeldung einen Onboarding-Prozess durchlaufen und meine Operations- und Gesundheitsdokumente hochladen,  
**damit** die Anwendung meinen aktuellen Gesundheitszustand erfassen und daraufhin passende Empfehlungen generieren kann.

**Akzeptanzkriterien:**
- Der Nutzer wird durch einen strukturierten, mehrstufigen Onboarding-Flow geführt.
- Es gibt eine Möglichkeit, relevante Dokumente (z.B. Arztbriefe) hochzuladen oder Symptome/Operationen auszuwählen (Condition ID).
- Eingaben werden im Frontend validiert und an das Backend (bzw. Mock-API) gesendet.
- Nach erfolgreichem Abschluss wird der Nutzer automatisch zur Auswertung oder auf das Dashboard weitergeleitet.

## US-02: Medizinischer Disclaimer (Health-Tech-Safety)
**Als** Patient  
**möchte ich** stets klar darauf hingewiesen werden, dass die App keine echten Diagnosen stellt,  
**damit** ich mir bewusst bleibe, dass medizinische Ratschläge weiterhin mit Fachpersonal abgeklärt werden müssen.

**Akzeptanzkriterien:**
- Auf dem Dashboard, im Profil und nach der Analyse wird ein gut sichtbarer Disclaimer ("Food4Recovery ersetzt keine ärztliche Diagnose...") angezeigt.
- Es gibt im UI keine Versprechen bezüglich Heilung oder "garantierten" Diagnosen.

## US-03: Analyse und Ableitung von Ernährungszielen
**Als** Patient  
**möchte ich** nach meinem Onboarding eine Auswertung erhalten, die mir spezifische Ernährungsziele vorschlägt,  
**damit** ich weiß, auf welche Makro- und Mikronährstoffe ich während meiner Genesung achten muss.

**Akzeptanzkriterien:**
- Das System wertet die Onboarding-Daten regelbasiert aus.
- Eine Übersichtsseite visualisiert die berechneten Ziele (z.B. Proteinbedarf zur Wundheilung, Kalorien).
- Die ermittelten Ziele werden im Patientenprofil gespeichert und als Basis für spätere Empfehlungen genutzt.

## US-04: Dashboard für tägliche Übersicht und Fortschritt
**Als** Patient  
**möchte ich** ein zentrales Dashboard aufrufen, das mir meine Ernährungsziele und meine tägliche Makronährstoff-Verteilung anzeigt,  
**damit** ich meine Genesung im Blick behalte.

**Akzeptanzkriterien:**
- Das Dashboard zeigt den aktuellen Tagesfortschritt in Bezug auf definierte Makros (Proteine, Kohlenhydrate, Fette) an.
- Die Visualisierung erfolgt durch ansprechende Diagramme (z.B. Circular Progress oder Bar Charts).
- Wichtige Gesundheits- oder Ernährungs-Tipps werden passend zur Condition ID eingeblendet.
- Das Design folgt der "Glassmorphism"-Richtlinie mit Vanilla CSS Modules.

## US-05: Personalisierte Rezeptvorschläge (Recipes)
**Als** Patient  
**möchte ich** Rezeptvorschläge erhalten, die genau auf meine Ernährungsziele und meinen Heilungsprozess abgestimmt sind,  
**damit** ich zuhause gesundheitsfördernde Mahlzeiten selbst kochen kann.

**Akzeptanzkriterien:**
- Im Bereich "Recipes" werden kuratierte, personalisierte Rezepte angezeigt.
- Die Rezepte sind nach Relevanz für den aktuellen Zustand gefiltert.
- Jedes Rezept zeigt die Makronährstoffe, Dauer und eine Liste der Zutaten an.
- Bei Klick auf ein Rezept öffnet sich eine Detailansicht oder ein Modal.

## US-06: Meal-Kits und Recovery-Pakete durchsuchen (Shop)
**Als** Patient  
**möchte ich** im integrierten Shop vorgefertigte Mahlzeitenpakete (Meal-Kits) durchsuchen können,  
**damit** ich mir während meiner Regeneration den Aufwand des Kochens ersparen kann.

**Akzeptanzkriterien:**
- Der "Shop"-Bereich listet verfügbare, auf Genesung ausgerichtete Meal-Kits auf (z.B. Wundheilung, Energie).
- Jedes Paket zeigt Preis, Nährwerte und enthaltene Mahlzeiten an.
- Ein "In den Warenkorb"-Button (Add to Cart) ist auf jeder Produktkarte verfügbar.

## US-07: Globale Warenkorb-Verwaltung
**Als** Patient  
**möchte ich** von jeder Seite der App aus meinen Warenkorb einsehen und verwalten können,  
**damit** ich vor der Bestellung jederzeit einen Überblick über meine ausgewählten Meal-Kits habe.

**Akzeptanzkriterien:**
- Ein globaler State (z.B. CartContext) speichert die Warenkorbdaten.
- In der Navigation gibt es ein Icon, das die Anzahl der ausgewählten Artikel anzeigt.
- Nutzer können Artikelmengen anpassen oder Artikel wieder aus dem Warenkorb entfernen.

## US-08: Bestellung und Checkout
**Als** Patient  
**möchte ich** meine ausgewählten Meal-Kits über einen reibungslosen Checkout-Prozess bestellen,  
**damit** diese bequem zu mir nach Hause geliefert werden.

**Akzeptanzkriterien:**
- Ein Checkout-Formular sammelt die Lieferadresse und Rechnungsdetails (als einfaches HTML/CSS-Formular ohne komplexe Maps API).
- Eine Bestellübersicht zeigt alle Artikel, die Zwischensumme und die Gesamtkosten.
- Ein Klick auf "Kostenpflichtig bestellen" löst die simulierte Zahlung aus.
- Der Nutzer erhält nach Abschluss eine Bestellbestätigungsseite.

## US-09: Profilverwaltung und Anpassung des Zustands
**Als** Patient  
**möchte ich** mein Profil einsehen und Gesundheitsdaten im Laufe der Zeit anpassen können,  
**damit** meine Ernährungspläne immer auf meinen aktuellen Heilungsfortschritt abgestimmt bleiben.

**Akzeptanzkriterien:**
- Auf der "Profile"-Seite sind alle persönlichen Daten und die aktuelle Diagnose/Condition sichtbar.
- Der Nutzer kann seinen Zustand bearbeiten, was einen Request an das Backend auslöst.
- Bei einer Zustandsänderung werden die Ernährungsziele entsprechend aktualisiert.

## US-10: Demo-Login (Gatekeeper)
**Als** Nutzer der Demo / Präsentator  
**möchte ich** über einen Login-Screen in die Anwendung starten,  
**damit** der geschützte Health-Bereich authentisch wirkt, auch ohne komplexes OAuth-Setup.

**Akzeptanzkriterien:**
- Ein Login-Screen begrüßt den Nutzer im Food4Recovery Design.
- Für die Präsentation reicht ein einfacher Klick oder Mock-Login (Gatekeeper ohne echtes Backend-Auth).
- Nach erfolgreichem Klick wird geprüft, ob Onboarding-Daten vorhanden sind, und das Dashboard bzw. Onboarding geladen.
