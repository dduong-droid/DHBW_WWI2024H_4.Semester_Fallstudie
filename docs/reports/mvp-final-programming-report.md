# MVP Final Programming Report

## 1. Ausgangszustand

- Branch: `codex/mvp-final-programming`
- Ausgangscommit: `aff76f7` (`chore: finalize dev2 dev3 demo readiness`)
- Vorherige Reports: `docs/reports/dev2-dev3-final-readiness.md`, `docs/reports/demo-hardening-report.md`, `docs/reports/demo-readiness-check.md`
- Bekannte Risiken: keine echte Auth/RBAC, kein echtes Payment, keine medizinische Validierung, SQLite als lokaler Demo-State, moderate transitive `npm audit`-Warnung, Mock-Fallbacks fuer Demo-Robustheit.

## 2. Umgesetzte Produktverbesserungen

- Backend: Neuer sicherer Dokumenten-Metadaten-Endpunkt, erweiterte Order-Statuswerte, minimale Audit-Events fuer Profil, Export, Delete, Order, Upload und Tracking.
- Frontend/API: `apiClient` kann Multipart-Demo-Uploads, Meal-Tracking und Hydration-Aktionen gegen den BFF ausfuehren.
- Security-/Medizin-Texte: Sichtbarer Onboarding-Hinweis wurde von pauschalem Verschluesselungsclaim auf `Demo-Schutz` und lokale API-Key-Grenze entschaerft; veraltete Design-HTML-Texte wurden von Therapie-/KI-Auswertungsclaims auf Demo-Plan-/Metadatenformulierungen umgestellt.
- Dokumentenfluss: Onboarding prueft Dateien weiterhin clientseitig und sendet ausgewaehlte Dateien als Metadaten-Upload an das Backend. Keine OCR, keine medizinische Auswertung.
- Tracking: Dashboard-Meal-Box und `+250 ml` Hydration schreiben regulaer in den Backend-Demo-State; Fallback bleibt lokal.
- Checkout: Order-API bleibt regulaerer Pfad; Statusmodell enthaelt nun auch `pending` und `demo_failed`.
- Profil: Backend-Profilaktionen erzeugen Audit-Events; UI bleibt backendgestuetzt mit Mock-Fallback.
- Tests: Backend-Testabdeckung erweitert von 48 auf 57 Tests.
- Infra/ENV: Minimale GitHub Actions CI fuer Backend-Tests und Frontend Build/Typecheck/Lint ergaenzt.

## 3. Backend/API-Status

Zentrale Module bleiben unveraendert in ihrer Architektur: Patient Profile, Questionnaire Intake, Recommendation Engine, Nutrition Plan, Frontend BFF, Tracking, Order Handling und Analytics. Neu hinzugekommen ist `document_upload` als bewusst schmaler Modulbereich fuer sichere MVP-Dokument-Metadaten.

Neue/angepasste Endpunkte:

- `POST /api/documents/upload`: nimmt genau eine Datei als Multipart-Feld `file` entgegen, erlaubt PDF/JPG/PNG bis 10 MB, speichert keine Inhalte und gibt `uploaded_demo` zurueck.
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`: wird nun auch aus dem Dashboard aufgerufen.
- `POST /api/frontend/tracking/hydration/{patient_id}/water`: wird nun auch aus dem Dashboard aufgerufen.
- `POST /api/orders`: unveraendert ohne echtes Payment, aber mit erweitertem Statusmodell und Audit-Event.

Error Handling:

- 404/422 laufen weiter ueber `{"error": {"code", "message", "details"}}`.
- Unbehandelte Exceptions werden nun als 500 mit `internal_error` und ohne Stacktrace im Response gekapselt.

Persistenz/Demo-State:

- Tracking und Orders bleiben SQLite-gestuetzt.
- Dokumenten-Upload persistiert bewusst keine medizinischen Inhalte, sondern nur die Response-Metadaten im Request-Kontext und ein anonymisiertes Analytics-Event.

## 4. Frontend-Backend-Status

| Screen | Backend genutzt | Fallback vorhanden | Offene Luecke |
| --- | --- | --- | --- |
| `/onboarding` | Full Analyze BFF und neuer Dokument-Metadaten-Upload | Ja | Keine echte OCR oder medizinische Dokumentenanalyse |
| `/analysis` | Letzte BFF-Analyse aus Demo-State | Ja | Kein serverseitiger Analyseverlauf im UI |
| `/dashboard` | Nutrition Plan, Meal-Tracking und Hydration BFF | Ja | Nur einfache Demo-Aktionen, kein vollstaendiges Tagesjournal |
| `/recipes` | Curated Recipes BFF | Ja | Keine individuelle Rezeptsuche |
| `/shop` | Shop Inventory und Meal-Kit Detail BFF | Ja | Statischer Katalog |
| `/profile` | PatientProfile API lesen/speichern | Ja | UI deckt nicht jedes Backend-Profilfeld ab |
| `/checkout` | Order API | Ja | Keine echte Zahlung, keine Payment-Provider-Sandbox |
| `/login` | Nein | Lokaler Demo-Gatekeeper | Keine echte Auth |

## 5. Tests und Checks

| Befehl | Ergebnis | Gruen/Rot | Hinweise |
| --- | --- | --- | --- |
| `cd backend && python -m pip install -e .` | Ausgefuehrt | Gruen | `python-multipart` fuer Upload installiert |
| `cd backend && python -m pytest app/tests` | `57 passed` | Gruen | Neue Tests fuer Upload, Order, Tracking und Error Envelope |
| `cd frontend && npm install` | Ausgefuehrt | Gruen | Keine Dependency-Aenderung im Frontend |
| `cd frontend && npm run build` | Ausgefuehrt | Gruen | Next.js `15.5.15` |
| `cd frontend && npx tsc --noEmit` | Ausgefuehrt | Gruen | Keine TypeScript-Fehler |
| `cd frontend && npm run lint` | Ausgefuehrt | Gruen | ESLint sauber |
| `cd frontend && npm audit --audit-level=moderate` | 2 moderate Findings | Rot | Kein `npm audit fix --force`, weil der angebotene Pfad ein Breaking-Downgrade erzwingt |
| `git diff --check` | Ausgefuehrt | Gruen | Keine Whitespace-Fehler |

## 6. Smoke-Test-Ergebnis

Getestete Endpunkte:

- `GET /health`: `ok`
- `GET /api/frontend/shop/inventory`: 5 Meal-Kits
- `POST /api/frontend/intake/full-analyze`: Patient `demo_smoke_mvp`, 7 Plantage
- `GET /api/frontend/nutrition-plan/{patient_id}`: 7 Plantage
- `GET /api/frontend/recipes/curated/{patient_id}`: 3 Rezeptkarten
- `POST /api/frontend/tracking/hydration/{patient_id}/water`: `currentMl=250`
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`: `isMealBoxEaten=true`
- `POST /api/orders`: Order `confirmed`
- `POST /api/documents/upload`: `uploaded_demo`, `analysis_available=false`
- Frontend `http://127.0.0.1:3000`: HTTP 200

Demo-Flow technisch nachvollziehbar: Onboarding -> Analysis -> Dashboard -> Recipes -> Shop -> Checkout bleibt backendgestuetzt mit Fallback.

## 7. Noch offene Produktlücken

Kritisch:

- Keine produktive Authentifizierung und kein Rollen-/Rechtemodell.
- Keine medizinische Validierung durch Fachpersonal.

Mittel:

- Kein echter Payment Provider oder Payment-Sandbox.
- Dokumenten-Upload hat keine sichere produktive Dateispeicherung, keine Virenpruefung und keine OCR.
- SQLite bleibt lokaler Demo-State ohne Migration-/Backup-Konzept.
- Audit Logging ist ein leichtes internes Analytics/Event-Log, kein revisionssicheres Audit-System.
- Moderate transitive `npm audit`-Warnung bleibt offen.

Niedrig:

- Mock-Fallbacks bleiben fuer Demo-Robustheit aktiv und muessen als Fallback verstanden werden.
- Profil-UI bildet nicht jedes Backend-Feld ab.
- CI ist minimal und ersetzt keine E2E-/Browser-Teststrecke.

## 8. Was nicht umgesetzt wurde und warum

- Echtes Auth/RBAC: zu gross fuer eine sichere kleine Iteration; API-Key bleibt Demo-/Dev-Schutz.
- Echte medizinische Validierung: fachlich-organisatorischer Prozess, nicht per Code zu erfinden.
- Echte OCR/Dokumentenanalyse: bewusst nicht implementiert, um keine medizinische Auswertung vorzutäuschen.
- Echtes Payment: nicht Scope des MVP; Checkout bleibt Demo-Order ohne Zahlungsdatenverarbeitung.
- Docker: nicht ergaenzt, weil kein vorhandenes Setup existierte und lokale Reproduzierbarkeit bereits dokumentiert ist.
- Vollstaendige Profil-UI: kein UI-Redesign; Backend-Anbindung bleibt funktional, aber nicht feldvollstaendig.

## 9. Nächster Entwicklungsplan

1. Echtes Auth-/Session-Konzept mit Rollen fuer Patient, Fachpersonal und Admin entwerfen.
2. Produktives Audit Logging mit unveraenderbaren Events und Aufbewahrungsregeln.
3. Medizinische Regelvalidierung durch Fachpersonal dokumentieren und testbar versionieren.
4. Dokumentenpipeline mit sicherer Speicherung, Virenpruefung, Consent und optionaler OCR-Sandbox.
5. Payment Provider im Sandbox-Modus anbinden, ohne echte Zahlungsdaten in der App zu speichern.
6. Datenbankmigrationen und Postgres-Profil fuer produktionsnaehere Umgebung.
7. E2E-Smokes fuer Onboarding -> Checkout automatisieren.
8. Mock-Fallbacks per sichtbarem Demo-/Dev-Modus schaltbar machen.
9. Profil-UI feldvollstaendig gegen `PatientProfile`-Schema ausbauen.
10. Npm-Audit-Warnung erneut pruefen, sobald ein sicherer Next-15.x/PostCSS-Fix verfuegbar ist.
