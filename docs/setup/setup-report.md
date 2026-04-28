# Food4Recovery Setup Report

## Projektstruktur
- Erkannte Teilprojekte:
  - `frontend/`: Next.js 15 App Router, React 19, TypeScript, CSS Modules, `lucide-react`.
  - `backend/`: FastAPI/Python-Backend mit `pyproject.toml`, vorhandener `.venv`, SQLite-Datei und Tests unter `backend/app/tests`.
  - `shared/`: gemeinsame Contracts/Absprachen, aktuell nur README-Struktur.
  - `infra/`: Infrastruktur-Dokumentation, aktuell nur README-Struktur.
  - `docs/`: Projektkontext, Roadmaps, API-/Backend-Dokumentation und Design-Artefakte.
- Relevante Dateien:
  - `AGENTS.md`
  - `README.md`
  - `frontend/package.json`
  - `frontend/package-lock.json`
  - `backend/pyproject.toml`
  - `docs/designs/`

## Environment
- Betriebssystem: Microsoft Windows 10 Home 10.0.19045, 64-Bit.
- Node-Version: `v24.15.0`.
- npm-Version: `11.12.1`.
- Python-Version global: `3.12.10`.
- Backend `.venv`: Python `3.12.10`, pip `26.0.1`.
- Package Manager: npm.
- Erkannter Lockfile-Status:
  - `frontend/package-lock.json` vorhanden.
  - Kein `pnpm-lock.yaml` gefunden.
  - Kein `yarn.lock` gefunden.
  - `pnpm` und `yarn` sind lokal nicht installiert; das ist unkritisch, weil npm zum Lockfile passt.
- Hinweis: PowerShell blockiert `npm.ps1`; Befehle wurden deshalb mit `npm.cmd`/`npx.cmd` ausgeführt.

## Installationsstatus
- Frontend-Installationsbefehl: `npm.cmd ci` in `frontend/`.
- Ergebnis: erfolgreich.
- Relevante Warnungen:
  - `next@15.1.0` ist deprecated wegen bekannter Security Vulnerability.
  - npm meldet 2 Vulnerabilities: 1 moderate, 1 critical.
  - Deprecated Transitives: `inflight`, `rimraf@3`, `glob@7`, `@humanwhocodes/*`, `eslint@8.57.1`.
- Backend-Installationsbefehl: `.venv\Scripts\python.exe -m pip install -e .` in `backend/`.
- Ergebnis: erfolgreich, alle Backend-Abhängigkeiten waren bereits vorhanden oder wurden editable bestätigt.

## Erkannte Scripts
| Script | Befehl | Zweck | Ergebnis |
| --- | --- | --- | --- |
| `dev` | `next dev` | lokaler Frontend-Dev-Server | Smoke-Test mit `npm run dev -- --hostname 127.0.0.1 --port 3000`, `GET / 200` |
| `build` | `next build` | Produktionsbuild | grün, Build erfolgreich |
| `start` | `next start` | Produktionsserver starten | nicht ausgeführt |
| `lint` | `next lint` | Frontend-Linting | rot, ESLint invalid options |
| `test` | nicht vorhanden | Frontend-Tests | fehlt |
| `typecheck` | nicht vorhanden | Frontend-Typecheck | fehlt; manueller Check `npx.cmd tsc --noEmit` grün |
| Backend Tests | `.venv\Scripts\python.exe -m pytest app/tests` | Backend API/Unit/Integration | grün, 48 passed |

## Design Assets
- Gefundene Design-Dateien unter `docs/designs`:
  - `ai_analysis_result/screen.png`
  - `bestellbestaetigung/screen.png`
  - `bestellbestaetigung_alt/screen.png`
  - `bestelluebersicht/screen.png`
  - `checkout_zahlung/screen.png`
  - `dashboard/screen.png`
  - `dashboard_mit_makro_verteilung/screen.png`
  - `dashboard_with_doctor_chat/screen.png`
  - `detaillierte_analyse/screen.png`
  - `dokumenten_upload_pdf/screen.png`
  - `dokument_upload/screen.png`
  - `empfehlung_wochenplan/screen.png`
  - `essenpakete_shop/screen.png`
  - `fragebogen_erweitert/screen.png`
  - `gesundheitsprofil/screen.png`
  - `loading_skeleton/screen.png`
  - `login/screen.png`
  - `mahlzeit_hinzufuegen/screen.png`
  - `meal_kit_store/screen.png`
  - `naehrstoff_tracking/screen.png`
  - `onboarding_start/screen.png`
  - `produktdetails_darm_balance_box/screen.png`
  - `produktdetails_immun_boost_box/screen.png`
  - `produktdetails_onko_box/screen.png`
  - `produktdetails_vitality_box/screen.png`
  - `produktdetails_wundheilungs_box/screen.png`
  - `scan_analyse/screen.png`
  - `startseite/screen.png`
- Anzahl: 28 `screen.png` Dateien.
- Hinweise:
  - `docs/designs/README.md` bestaetigt, dass Ordnernamen die verlaesslichste Referenz sind.
  - Keine Bilddateien wurden verändert.

## Checks
### Frontend Install
- Befehl: `npm.cmd ci`
- Ergebnis: grün.
- Warnungen: Security-/Deprecated-Warnungen, siehe Dependencies und Security/Audit.
- Einschätzung: Installation ist reproduzierbar und arbeitsfähig.

### Frontend Lint
- Befehl: `npm.cmd run lint`
- Ergebnis: rot.
- Fehler/Warnungen:
  - `next lint` bricht mit `Invalid Options` ab.
  - Gemeldete unbekannte/entfernte Optionen: `useEslintrc`, `extensions`, `resolvePluginsRelativeTo`, `rulePaths`, `ignorePath`, `reportUnusedDisableDirectives`.
- Einschätzung: Tooling-Kompatibilitätsproblem im Lint-Befehl. Kein Code-Fix durchgeführt, weil Setup-Ziel keine Tooling-Updates ohne Freigabe vorsieht.

### Frontend Typecheck
- Befehl: `npx.cmd tsc --noEmit`
- Ergebnis: grün nach abgeschlossenem Next-Build.
- Hinweis: Ein erster paralleler Lauf während `next build` schlug fehl, weil `.next/types` noch nicht vollständig erzeugt war.
- Einschätzung: TypeScript-Stand ist nach Build arbeitsfähig.

### Frontend Build
- Befehl: `npm.cmd run build`
- Ergebnis: grün.
- Details:
  - Next.js 15.1.0 kompiliert erfolgreich.
  - 11 statische Seiten wurden erzeugt.
  - Während des Builds wird ebenfalls die ESLint-Options-Warnung angezeigt, der Build beendet sich trotzdem erfolgreich.
- Einschätzung: Demo-Build ist möglich.

### Frontend Dev Smoke
- Befehl: `npm.cmd run dev -- --hostname 127.0.0.1 --port 3000`
- Ergebnis: grün.
- Details:
  - Next.js wurde ready.
  - `GET /` lieferte HTTP 200.
  - Der danach verbliebene Next-Prozess auf Port 3000 wurde gezielt beendet.
- Einschätzung: Lokales Frontend ist startbar.

### Backend Install
- Befehl: `.venv\Scripts\python.exe -m pip install -e .`
- Ergebnis: grün.
- Einschätzung: Backend ist in der vorhandenen venv installierbar.

### Backend Tests
- Befehl: `.venv\Scripts\python.exe -m pytest app/tests`
- Ergebnis: grün.
- Details: 48 Tests bestanden in 9.45s.
- Einschätzung: Backend ist aktuell stabil.

## Dependencies
- Wichtige Frontend-Frameworks und Versionen:
  - `next`: `15.1.0`
  - `react`: installiert `19.2.5`, Range in package.json `^19.0.0`
  - `react-dom`: installiert `19.2.5`, Range in package.json `^19.0.0`
  - `lucide-react`: `0.468.0`
  - `typescript`: installiert `5.9.3`, Range in package.json `^5.0.0`
  - `eslint`: installiert `8.57.1`, Range in package.json `^8.0.0`
  - `eslint-config-next`: `15.1.0`
- Wichtige Backend-Abhängigkeiten:
  - `fastapi`
  - `httpx`
  - `pytest`
  - `sqlalchemy`
  - `uvicorn`
- Auffällig veraltete Pakete laut `npm.cmd outdated --json`:
  - `next`: current `15.1.0`, latest `16.2.4`
  - `eslint-config-next`: current `15.1.0`, latest `16.2.4`
  - `eslint`: current `8.57.1`, latest `10.2.1`
  - `lucide-react`: current `0.468.0`, latest `1.12.0`
  - `typescript`: current `5.9.3`, latest `6.0.3`
  - `@types/node`: current `20.19.39`, latest `25.6.0`
- Pakete mit möglichem Risiko:
  - `next@15.1.0` wegen mehrerer Security-Advisories.
  - `postcss` transitiv über Next wegen XSS-Advisory.
  - `eslint`/`next lint` wegen aktueller Lint-Inkompatibilität.
  - `npm list --depth=0` meldet `@emnapi/runtime@1.10.0` als extraneous im `node_modules`; nicht automatisch entfernt.
- Keine automatischen Updates durchgeführt.
- Keine Major-Versionen aktualisiert.
- Keine neuen Libraries installiert.

## Security/Audit
- Audit ausgeführt: Ja, `npm.cmd audit --json`.
- Relevante Findings:
  - `next`: critical aggregate, inklusive RCE in React flight protocol, Middleware Authorization Bypass, Cache Poisoning/DoS und weitere Next-Advisories.
  - `postcss`: moderate XSS via CSS stringify, transitiv über Next.
- `npm audit` schlägt als Fix `next@15.5.15` vor; das wäre kein Major-Update, wurde aber bewusst nicht automatisch ausgeführt.
- Empfohlene nächste Schritte:
  - Gezieltes Patch-/Minor-Update von `next` und `eslint-config-next` innerhalb Major 15 prüfen und separat freigeben.
  - Danach `npm ci`, `npm run build`, `npm run lint`, `npx tsc --noEmit` erneut ausführen.
- Keine Force-Fixes durchgeführt.
- Kein `npm audit fix --force` ausgeführt.

## Blocker
- `npm run lint` ist aktuell kaputt durch Next/ESLint-Options-Inkompatibilität.
- Kein Frontend-Testscript vorhanden.
- Kein Frontend-Typecheck-Script vorhanden; manueller Typecheck funktioniert.
- `frontend/README.md` wurde nach dem Setup-Check auf die tatsächliche Next.js-App aktualisiert.
- Node `v24.15.0` ist sehr neu; Build und Dev-Smoke funktionieren, aber für Next.js-Projekte kann eine LTS-Version wie Node 20/22 stabiler sein.
- Aktuell sind keine bekannten fremden uncommitted Code-Aenderungen als Setup-Blocker dokumentiert.
- Keine fehlenden ENV-Variablen für den lokalen Frontend-Loop festgestellt; Backend kann mit leerem `API_KEY` lokal arbeiten.

## Empfehlung für den nächsten Frontend-Loop
- Bereitschaft: Teilweise.
- Das Repo ist installierbar, buildbar, typecheckbar und lokal startbar. Für einen langen Frontend-Loop ist es arbeitsfähig.
- Vor einem sehr langen Loop sollte der kaputte Lint-Befehl bewusst behandelt werden, damit Codex nicht wiederholt an einem bekannten Tooling-Problem hängen bleibt.
- Der nächste Codex-Prompt sollte berücksichtigen:
  - Designreferenzen zuerst aus `docs/designs/*/screen.png` analysieren.
  - Medizinische Aussagen vorsichtig formulieren, keine Diagnosen oder Heilversprechen.
  - Bestehende Mock-Daten klar als Mock behandeln.
  - Vor Code-Aenderungen immer `git status --short` pruefen und fremde lokale Aenderungen nicht ungefragt überschreiben.
- Empfohlene Befehle im Loop:
  - `cd frontend`
  - `npm.cmd run dev`
  - `npm.cmd run build`
  - `npx.cmd tsc --noEmit`
  - `npm.cmd run lint` erst nach Fix/Update der Lint-Konfiguration sinnvoll.
  - Backend bei API-bezogenen Änderungen: `cd backend` und `.venv\Scripts\python.exe -m pytest app/tests`
- Riskante Bereiche:
  - Security-Stand von `next@15.1.0`.
  - Lint-Tooling ist rot.
  - Medizinisch zu starke bestehende UI-Texte koennen Safety-Guardrails verletzen.
  - Externe Bild-URLs in Mock-Daten koennen Demo-Stabilitaet beeinträchtigen.
