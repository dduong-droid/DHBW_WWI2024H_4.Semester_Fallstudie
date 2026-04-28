# Food4Recovery Agent Instructions

## Project Context
- Food4Recovery ist eine digitale Health-/Recovery-Anwendung fuer Patientinnen und Patienten nach Operationen, Behandlungen oder in Regenerationsphasen.
- Fokus: Patientendaten, Dokumenten-Upload, Analyse/Empfehlungen, Ernaehrungsplaene, Rezepte, Shop/Meal-Kits und Tracking.
- Das Projekt ist eine DHBW-Fallstudie, soll aber wie ein echtes Produkt behandelt werden.
- Projektstruktur: `frontend/` ist eine Next.js App, `backend/` ist ein FastAPI/Python-Backend, `docs/` enthaelt Kontext, Roadmaps und Designreferenzen.

## Main Goal
- Frontend, Backend und API sollen praesentationsfaehig, stabil und fachlich serioes wirken.
- Prioritaet fuer Frontend-Aufgaben: demo-tauglicher User Flow, saubere UI, klare Health-Tech-Kommunikation.
- Bestehenden Next.js App Router, React, TypeScript, CSS Modules und `lucide-react` respektieren.

## Frontend Design Reference
- Designs liegen unter `docs/designs/*/screen.png`; Metadaten liegen in `docs/designs/stitch_manifest.json`.
- Bei Frontend-Aufgaben diese Designs zuerst analysieren, besonders passende Screen-Ordner wie `startseite`, `onboarding_start`, `dashboard_mit_makro_verteilung`, `essenpakete_shop`, `bestelluebersicht`, `checkout_zahlung` und Produktdetail-Screens.
- Layout, Farben, Cards, Abstaende, Typografie, Tonalitaet und visuelle Hierarchie aus den PNGs ableiten.
- Fehlende Screens im gleichen Stil ergaenzen.
- Kein unnoetiger Wechsel des UI-Frameworks und keine Rueckkehr zu Tailwind, wenn CSS Modules bereits genutzt werden.

## Medical and Safety Guardrails
- Keine echten medizinischen Diagnosen.
- Keine Heilversprechen.
- Keine Aussagen wie "garantiert", "diagnostiziert", "heilt" oder "medizinisch sicher".
- Formulierungen vorsichtig halten: "kann unterstuetzen", "liefert Orientierung", "ersetzt keine aerztliche Beratung".
- An passender Stelle im UI einen Hinweis integrieren:
  "Food4Recovery ersetzt keine ärztliche Diagnose oder Behandlung. Empfehlungen dienen der Orientierung und sollten bei medizinischen Fragen mit Fachpersonal abgestimmt werden."
- Keine echten Patientendaten hardcoden.
- Keine Secrets oder API Keys ins Repository schreiben.

## Engineering Rules
- Vor Aenderungen relevante Dateien lesen.
- Kleine, fokussierte Aenderungen machen.
- Keine grossen Refactors ohne klaren Nutzen.
- Keine unrelated changes.
- Keine Tests loeschen oder abschwaechen, nur damit Checks bestehen.
- Keine erfundenen Backend-Endpunkte als produktionsreif verkaufen.
- Wenn Daten fehlen, saubere Mock-Daten verwenden und klar als Mock behandeln.
- Bestehende Projektstruktur respektieren.
- Bestehende lokale Aenderungen anderer nicht zuruecksetzen; aktuell kann es uncommitted Frontend-Aenderungen geben.

## Verification
- Frontend-Arbeitsverzeichnis: `frontend/`.
- Install: `npm install`.
- Dev: `npm run dev`.
- Build: `npm run build`.
- Lint: `npm run lint`.
- Start: `npm run start`.
- Test: kein `npm run test` vorhanden.
- Typecheck: kein `npm run typecheck` vorhanden; bei Bedarf `npx tsc --noEmit` nutzen und als manuellen Check dokumentieren.
- Backend-Arbeitsverzeichnis: `backend/`.
- Backend-Dependencies: Python >= 3.11, `pip install -e .` oder vorhandene `.venv` nutzen.
- Backend-Tests: `pytest`, falls Backend-Aenderungen Tests betreffen.
- Wenn ein Script nicht existiert, nicht erfinden. Stattdessen dokumentieren, dass es fehlt.

## Bugfix Loop Rules
- Bei Bugfixes zuerst Fehler reproduzieren.
- Eine kleine Aenderung pro Iteration.
- Danach passenden Check ausfuehren.
- Wenn dieselbe Fehlermeldung zweimal ohne Fortschritt erscheint, stoppen und Bericht schreiben.
- Wenn eine Aenderung den Zustand verschlechtert, zurueckgehen oder gezielt reparieren.
- Fortschritt und offene Fehler dokumentieren.

## Documentation
- Fuer laengere Frontend-/Bugfix-Loops einen Report unter `docs/bug-reports/frontend-loop-report.md` fuehren.
- Der Report soll enthalten:
  - Ausgangslage
  - Designanalyse
  - Iterationen
  - gefundene Bugs
  - behobene Bugs
  - offene Bugs
  - ausgefuehrte Befehle
  - Praesentationsstatus
  - naechste To-dos

## Definition of Done
Eine Aufgabe ist fertig, wenn:
- relevante Checks ausgefuehrt wurden oder klar dokumentiert ist, warum sie nicht laufen,
- das Frontend/Feature lokal nachvollziehbar funktioniert,
- Aenderungen klein und reviewbar bleiben,
- keine medizinisch riskanten Aussagen eingefuehrt wurden,
- offene Risiken dokumentiert sind.
