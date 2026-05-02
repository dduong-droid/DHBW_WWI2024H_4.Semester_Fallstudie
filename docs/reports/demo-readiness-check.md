# Demo Readiness Check

Stand: 2026-04-30, Branch `main`, Commit `8fd191d`.

## Ausgangslage

- Der lokale Checkout stand zuerst auf dem alten Branch `master`. GitHub zeigt aber `main` als Default-Branch.
- Der alte lokale Zustand wurde als `stash@{0}` gesichert: `backup-before-switching-to-origin-main`.
- Danach wurde `main` mit `origin/main` synchronisiert. `HEAD` und `origin/main` zeigen beide auf `8fd191d`.

## Veraltete oder widersprüchliche Analyseannahmen

- `docs/reports/github-project-analysis.md` war gegen den alten lokalen `master` geschrieben und widersprach `main`.
- Die Behauptung, `AGENTS.md`, `shared/api_contracts.md`, `docs/API_Demo_Flow.md` und `backend/app/modules/frontend_bff/*` fehlten, war nur auf dem alten Checkout wahr. Auf `main` existieren diese Dateien.
- Die fruehere Empfehlung, Next pauschal auf 14 zu setzen, ist veraltet. Aktuell ist Next `15.5.15` in `package.json`, `package-lock.json` und nach `npm install` installiert.

## Aktuelle Backend-BFF-Endpunkte

- `POST /api/frontend/intake/full-analyze`
- `GET /api/frontend/nutrition-plan/{patient_id}`
- `GET /api/frontend/shop/inventory`
- `GET /api/frontend/shop/meal-kits/{meal_kit_id}`
- `GET /api/frontend/recipes/curated/{patient_id}`
- `GET /api/frontend/tracking/daily/{patient_id}`
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`
- `GET /api/frontend/tracking/hydration/{patient_id}`
- `POST /api/frontend/tracking/hydration/{patient_id}/water`

## Frontend-Anbindung

Neu ist `frontend/src/services/apiClient.ts` als kleine API-Schicht:

- nutzt `NEXT_PUBLIC_API_BASE_URL`, Default `http://127.0.0.1:8000`
- sendet optional `X-API-Key` aus `NEXT_PUBLIC_API_KEY`
- ruft BFF-Endpunkte unter `/api/frontend/...`
- speichert nach Onboarding `patientId` und letzte Analyse lokal im Browser
- fällt bei nicht erreichbarerer API oder fehlendem Seed auf `nutritionMockApi` zurück

## Screens mit Backend-BFF

- `/onboarding`: sendet ein gemapptes Intake/Profile an `POST /api/frontend/intake/full-analyze`; Mock-Fallback bei Fehler.
- `/analysis`: zeigt die letzte BFF-Analyse aus lokalem Demo-State; sonst Mock-Fallback.
- `/dashboard`: versucht `GET /api/frontend/nutrition-plan/{patient_id}` plus Tracking/Hydration; Mock-Fallback bei Fehler.
- `/recipes`: versucht `GET /api/frontend/recipes/curated/{patient_id}`; Mock-Fallback bei Fehler.
- `/shop`: versucht `GET /api/frontend/shop/inventory`; Mock-Fallback bei Fehler.

## Weiterhin Mock/Fallback

- `/login`: bewusster Demo-Gatekeeper, keine echte Auth.
- `/profile`: nutzt weiterhin Mock-Lesen/Speichern, weil die vorhandene Profilseite nicht 1:1 das komplette Backend-Profil-Schema abdeckt.
- `/checkout`: lokale Warenkorb-/Bestell-Demo, noch keine Order-API-Anbindung.
- Backend-Ausfall, fehlender Seed oder fehlender API-Key: Frontend nutzt weiterhin Mock-Daten.

## Medizinische und Security-Texte

Geändert:

- Überzogene Datenschutz- und Verschluesselungsclaims wurden in sichtbaren Profil-/Onboarding-Trust-Elementen zu `Demo-Datenschutzkonzept` und `lokaler Demo-Modus` entschärft.

Bereits vorhanden und beibehalten:

- Disclaimer auf Landing/Analysis: `Food4Recovery ersetzt keine ärztliche Diagnose oder Behandlung...`
- Rezept- und Shop-Texte formulieren Empfehlungen als Orientierung und nicht als Diagnose oder Behandlung.

## Checks

Grün:

- `cd frontend && npm install`
- `cd frontend && npm run build`
- `cd frontend && npx tsc --noEmit`
- `cd frontend && npm run lint`
- `cd backend && python -m pip install -e .`
- `cd backend && python -m pytest app/tests` mit `48 passed`

Hinweise:

- `npm install` meldet 2 Audit-Funde und eine Next-15.1.0-Sicherheitswarnung. Es wurde kein `npm audit fix --force` und kein Major-/Downgrade ausgefuehrt.
- `npm run lint` ist erfolgreich, zeigt aber drei bestehende Warnungen für `<img>` statt `next/image`.

## Reparaturen Aus Checks

- `frontend/package.json`: `lint` von `next lint` auf `eslint . --ext .ts,.tsx` geändert, weil `next lint` in der aktuellen Next-/ESLint-Kombination nicht mehr passend ist.
- `frontend/.eslintrc.json`: klassische Next-ESLint-Konfiguration ergänzt.
- `frontend/eslint.config.js`: alte Vite/React-Refresh-Flat-Config entfernt.
- `backend/pyproject.toml`: setuptools Package-Discovery auf `app*` begrenzt, damit `latest_logs` nicht als Top-Level-Package erkannt wird.
- Backend: falsche Starlette-Konstante `HTTP_422_UNPROCESSABLE_CONTENT` durch `HTTP_422_UNPROCESSABLE_ENTITY` ersetzt.

## Rest-Risiken

- Next wurde gezielt innerhalb 15.x auf `15.5.15` angehoben. `npm audit` meldet weiterhin 2 moderate transitive PostCSS/Next-Warnungen; der angebotene Fix-Pfad ist kein sicherer 15.x-Patch.
- Das Frontend hat bewusst Mock-Fallbacks. Ohne laufendes Backend und Demo-Daten ist der Flow präsentierbar, aber nicht voll backendgetrieben.
- `/profile` und `/checkout` sind noch nicht produktiv an Backend-APIs angeschlossen.
- `NEXT_PUBLIC_API_KEY` ist nur für Demo-Zwecke geeignet, weil Public Env Vars im Browser sichtbar sind.

## Präsentationsstatus

Präsentierbar für die Fallstudien-Demo: ja, mit klarem Hinweis auf lokalen Demo-Modus und Mock-Fallback. Der zentrale Flow Onboarding -> Analysis -> Dashboard/Recipes/Shop nutzt jetzt den vorhandenen Frontend-BFF, sofern Backend und optionaler API-Key passen.

## Naechste 5 To-dos

1. Backend-Demo-Seed vor der Vorfuehrung ausfuehren und API-Key-Setup klaeren.
2. Profilseite fachlich erweitern, falls alle Backend-Profilfelder editierbar sein sollen.
3. Checkout bewusst als Demo-Order ohne Payment erklären.
4. Moderate transitive npm-Audit-Warnungen beobachten und bei sicherem 15.x-Fix erneut prüfen.
5. Optional: Browser-E2E-Smoke für Onboarding -> Analysis -> Shop -> Checkout automatisieren.
