# Projektkontext

Diese Datei ist die gemeinsame Kurzreferenz fuer Teammitglieder und KI-Agents.
Sie beschreibt, was `Food 4 Recovery` fachlich leisten soll und welche Grenzen fuer die Umsetzung aktuell gelten.

## Ausgangsidee

`Food 4 Recovery` ist eine digitale Gesundheitsloesung fuer Patientinnen und Patienten vor allem nach oder waehrend medizinischen Eingriffen.
Die Kernidee ist, dass passende Ernaehrung die Genesung, Wundheilung und allgemeine Stabilisierung deutlich unterstuetzen kann, Betroffene aber haeufig keine klare, alltagstaugliche und medizinisch passende Orientierung erhalten.

## Problem

Laut der Geschaeftsidee stehen im Zentrum diese Probleme:

- fehlende Ernaehrungsanleitung trotz hoher Relevanz fuer die Genesung
- Zeitmangel und Ueberforderung im Alltag nach einer Behandlung
- geringe Kenntnisse ueber geeignete oder ungeeignete Lebensmittel
- daraus folgende Risiken wie verzoegerte Heilung, mehr Komplikationen, Wiedereinweisungen, hoehere Kosten und geringere Lebensqualitaet

## Zielgruppen

Die Idee spricht mehrere Nutzergruppen an:

- Patientinnen und Patienten in der Genesungsphase nach Operationen
- Patientinnen und Patienten waehrend belastender Therapien, z. B. Chemotherapie
- Angehoerige oder pflegende Bezugspersonen
- medizinische Entscheiderinnen und Entscheider im B2B-Kontext, z. B. Kliniken oder Chefaerzte
- Selbstzahlerinnen und Selbstzahler mit hoher Gesundheitsaffinitaet

## Produktidee

Die App kombiniert drei Dinge:

- strukturierte Datenerhebung, z. B. Dokumenten-Upload, Scan, Profil und Fragebogen
- persoenliche Ernaehrungsplaene und Empfehlungen
- medizinisch abgestimmte Meal-Kits bzw. Essenspakete

Die Anwendung soll Nutzerinnen und Nutzer nicht mit generischen Tipps abspeisen, sondern moeglichst konkrete, alltagstaugliche und vertrauenswuerdige Empfehlungen geben.

## Inhalt des Fragebogens

Aus der Geschaeftsidee lassen sich diese Themen fuer den Intake ableiten:

- persoenliche Daten und Koerperdaten
- Alltagsaktivitaet
- Medikamente und Supplements
- Darmgesundheit und Unvertraeglichkeiten
- aktueller Ernaehrungsstatus und Appetit
- Essverhalten, Vorlieben und Abneigungen
- Verdauungsbeschwerden
- Immunsystem, Infektanfaelligkeit, Wundheilung, Fatigue und Schlaf
- Ziele und Erwartungen an die Beratung

## Produktversprechen

Die App soll vor allem:

- Orientierung geben
- Sicherheit vermitteln
- Planung vereinfachen
- Nachsorge digital ergaenzen
- medizinisch plausibel wirken

## Wichtige Umsetzungsgrenze

Aktuell ist **keine echte KI-Integration Pflicht**.
Wenn sinnvoll, darf eine einfache regelbasierte oder simulierte "Fake-KI" eingesetzt werden.
Schwere oder aufwendige echte KI-Implementierungen sind aktuell **nicht Teil des Zielbilds**.

Das bedeutet fuer die technische Umsetzung:

- Empfehlungen koennen regelbasiert erzeugt werden
- Entscheidungslogik darf ueber feste Regeln, Kategorien und Mapping laufen
- eine OpenAI- oder sonstige LLM-Anbindung ist kein Muss fuer das MVP

## Technisches MVP-Verstaendnis

Ein sinnvolles MVP fuer dieses Projekt ist:

- Nutzerprofil aufnehmen
- Gesundheits- bzw. Ernaehrungsdaten erfassen
- passende Empfehlungen oder Boxen aus festen Regeln ableiten
- Wochenplan und Shop plausibel darstellen
- Bestellung und Nachverfolgung durchgaengig demonstrieren

## Teamabgrenzung

Aktuelles Rollenverstaendnis:

- Entwickler 1: Frontend, UI/UX, Mock-Daten, Browser-Validierung
- Entwickler 2: Backend, API, Logik-Engine, Empfehlungssystem, aber nicht zwingend echte KI
- Entwickler 3: Datenbank, Infrastruktur, Authentifizierung, Backend-Datenanbindung

## Quelle

Diese Zusammenfassung basiert auf der eingereichten Geschaeftsidee aus:

- dem PDF zur Vorstellung der Geschaeftsidee

Sie ist absichtlich kurz und operativ formuliert, damit Team und KI-Agents schnell den Projektauftrag verstehen.
