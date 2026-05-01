# Food4Recovery Full Codebase Status Analysis

## 1. Executive Summary

Der aktuelle Stand auf `codex/mvp-final-programming` ist fuer eine DHBW-Fallstudien-Demo stark und grundsaetzlich praesentierbar, aber nicht produktionsnah. Backend, BFF, regelbasierte Recommendation, Seed, Dokumenten-Metadaten-Upload, Checkout, Tracking und Dokumentation sind deutlich weiter als ein reiner Mock-Prototyp. Die groesste technische Demo-Gefahr ist aktuell nicht die Backend-Stabilitaet, sondern der echte Browserpfad: Das Frontend ruft `http://127.0.0.1:8000` aus `http://127.0.0.1:3000` auf, aber FastAPI konfiguriert keine CORS-Middleware. Ein getesteter Preflight auf `POST /api/frontend/intake/full-analyze` ergab `405` ohne `Access-Control-Allow-Origin`.

Bewertung in einem Satz: gutes Fallstudien-MVP mit echtem Backend-Kern, aber noch zu viel Demo-/Fallback-Verhalten, fehlender Browser-CORS-Absicherung, keiner produktiven Auth und ohne Frontend-/E2E-Tests.

Fertigstellungsgrad:

- Fallstudie: 90 %
- echtes Produkt-MVP: 55 %
- Praesentierbar: Ja, mit klarer technischer Einordnung und vorherigem Browser-Klicktest.

## 2. Aktueller Gesamtzustand

Gepruefter Stand:

- Branch: `codex/mvp-final-programming`
- Commit: `d8ffdba merge main into MVP final programming branch`
- Remote: `origin https://github.com/dduong-droid/DHBW_WWI2024H_4.Semester_Fallstudie.git`
- Working tree vor Berichtserstellung: sauber

Wirklich fertig fuer die Fallstudie:

- FastAPI-Backend mit Domain-Modulen, SQLite-Persistenz und einheitlichem Error-Envelope.
- Frontend-BFF-Endpunkte unter `/api/frontend/...`.
- Backendgestuetzter Demo-Flow fuer Onboarding, Analysis, Dashboard, Recipes, Shop, Checkout und Teile von Tracking.
- Demo-Seed mit stabilen Personas.
- Backend-Tests mit 57 passed.
- Next.js Build, Typecheck und Lint laufen durch.
- Dokumenten-Upload als sicher begrenzter Metadaten-Demo-Flow.
- Minimal-CI fuer Backend und Frontend.

Nur Demo oder produktionsfern:

- Login ist Mock/Demo-Gatekeeper.
- API-Key ist optionaler Demo-Schutz, keine Authentifizierung.
- Kein RBAC, keine Sessions, kein echtes User-Modell.
- Mock-Fallbacks sind breit aktiv und koennen Backendfehler verdecken.
- Dokumenten-Upload analysiert keine Inhalte und validiert nur MIME/Size.
- Checkout erzeugt Demo-Orders, kein Payment.
- Audit/Event-Logging ist Produkt-/Demo-Telemetrie, kein revisionssicheres Audit.
- SQLite ist lokaler Demo-State.

## 3. Architekturueberblick

Die Architektur ist fuer eine Fallstudie logisch und gut erklaerbar:

```text
Frontend App Router
  -> frontend/src/services/apiClient.ts (recoveryApi)
  -> FastAPI Domain APIs und /api/frontend BFF
  -> Services/Repositories/Schemas
  -> SQLite Records
```

Backend-Struktur:

- `backend/app/main.py`: FastAPI-App, Error Handler, Router, DB-Init.
- `backend/app/api/router.py`: zentrale Router-Komposition mit optionalem API-Key-Schutz.
- `backend/app/modules/*`: Domain-Module fuer Profile, Intake, Assessment, Recommendation, Nutrition Plan, Safety, Tracking, Orders, Analytics, Documents.
- `backend/app/db/*`: SQLAlchemy-Records und Session-Handling.
- `backend/scripts/seed/seed_demo_data.py`: reproduzierbarer Demo-Seed.

Frontend-Struktur:

- `frontend/src/app/*`: Routen/Screens.
- `frontend/src/services/apiClient.ts`: zentrale API-Schicht mit `recoveryApi`.
- `frontend/src/services/mockApi.ts`: View-Model-Typen und Demo-Fallbackdaten.
- `frontend/src/context/CartContext.tsx`: lokaler Warenkorb.
- `frontend/src/components/*`: wiederverwendbare UI-Komponenten fuer Cart, Meals, Meal Kits.

Bewertung:

- Gute Trennung im Backend.
- BFF-Schicht ist sinnvoll fuer frontend-nahe camelCase-Responses.
- Frontend ist funktional, aber einige Pages sind zu gross und enthalten viel Inline-Logik.
- `apiClient.ts` ist inzwischen die zentrale Integrationsstelle, aber auch zu gross und vereint Mapping, Persistence, Fetch, Fallback und Demo-State.

## 4. Frontend-Analyse

Backendgestuetzte Screens:

| Screen | Backend genutzt | Fallback | Bewertung |
| --- | --- | --- | --- |
| `/onboarding` | `uploadDocuments`, `POST /api/frontend/intake/full-analyze` | ja | fachlich sinnvoll, aber Name/Age-Flow ist vereinfacht |
| `/analysis` | letzte gespeicherte BFF-Analyse aus `localStorage`; MealKit per API | ja | praesentationsstark, aber ohne echte Neuladung vom Backend |
| `/dashboard` | Nutrition Plan, Daily Tracking, Hydration, Profile | ja | funktional, aber technisch zu gross |
| `/recipes` | `GET /api/frontend/recipes/curated/{patient_id}` | ja | sauber angebunden |
| `/shop` | `GET /api/frontend/shop/inventory` | ja | sauber angebunden |
| `/profile` | `GET/POST /api/patient-profile` | ja | angebunden, aber Feld-/Condition-Mapping nicht voll harmonisiert |
| `/checkout` | `POST /api/orders` | ja | gute Demo-Order, kein Payment |
| `/login` | nein | n/a | bewusst lokaler Demo-Gatekeeper |

Dashboard-Konfliktloesung:

- Die Merge-Aufloesung ist syntaktisch und funktional erhalten: Profil-Laden, Safety-Hinweise, Tagesauswahl, Quick-Track, `trackingNote`, Meal-Box-POST und Hydration-POST sind kombiniert.
- Sie ist aber nicht voll sauber im Architektur-Sinn. `frontend/src/app/dashboard/page.tsx` hat 474 Zeilen und mischt Fetching, Mapping-Erwartungen, lokale Optimistic Updates, Demo-Alerts, Quick-Track-UI und Layout.
- Es gibt ein semantisches Risiko im Condition-Mapping: Backend-Seed nutzt z. B. `post_op_recovery`, Dashboard prueft aber `profile?.conditions.includes('post_op')`. Profil-UI nutzt `post_op`, Onboarding nutzt `wound_healing` oder `chemo_support`, Dashboard prueft `chemotherapy`. Dadurch koennen Safety-Hinweise bei echten Backend-Profilen ausbleiben, obwohl sie bei Mock-Profilen erscheinen.
- Quick-Track ist uneinheitlich: Meal-Box und Hydration gehen ans Backend, Appetit, Schmerz und Gewicht sind nur `alert()`/lokaler State.

`recoveryApi` vs. `mockApi`:

- Die App-Routen importieren zentral `recoveryApi`; direkte `nutritionMockApi`-Nutzung in den Screens wurde nicht gefunden.
- `apiClient.ts` importiert `nutritionMockApi` bewusst als Fallback.
- Es gibt keine zweite konkurrierende API-Schicht nach dem Merge.
- Trotzdem gibt es doppelte Datenlogik: Mock-View-Models, Backend-Mapping und lokale Storage-Analyse leben alle in `apiClient.ts`/`mockApi.ts`. Das ist fuer Demo okay, aber fuer Weiterentwicklung fehleranfaellig.

Mock-Fallback-Risiko:

- Jeder zentrale API-Call faengt Fehler und liefert Mockdaten oder lokalen Demo-State.
- Das ist demo-stabil, verdeckt aber echte API-Probleme zu stark: CORS, 401, 404, 500 und Schemafehler koennen fuer Nutzer wie funktionierende Demo-Daten aussehen.
- Positiv: Console-Warnings und `backendUsed` bei Tracking/Checkout existieren.
- Fehlend: ein klarer Dev-/Demo-Indikator im UI oder ein ENV-Schalter wie `NEXT_PUBLIC_DISABLE_MOCK_FALLBACK=true` fuer harte Smoke-Tests.

Lint-Warnungen:

- Die 5 Warnungen sind keine Blocker, aber vor Abgabe sollten sie behoben werden. Sie sind klein, eindeutig und zeigen Merge-Reste:
  - `analysis/page.tsx`: fehlende Hook-Dependency `loadingMessages.length`
  - `onboarding/page.tsx`: ungenutztes `setName`
  - `onboarding/page.tsx`: ungenutztes `progressPercent`
  - `onboarding/page.tsx`: ungenutztes `sanitizeNumberInput`
  - `onboarding/page.tsx`: ungenutzte Komponente `InputField`

## 5. Backend/API-Analyse

Stark:

- Modularer Aufbau mit klaren Routern, Services, Schemas und Repositories.
- Einheitliches Fehlerformat: `{"error": {"code": "...", "message": "...", "details": ...}}`.
- BFF-Responses sind weitgehend camelCase.
- Recommendation Engine ist regelbasiert und erklaerbar, keine Black-Box-KI.
- Safety-/Risk-Logik ist sichtbar und testbar.
- Order API validiert Patient, Items, Mengen, Meal-Kit-Existenz und Statusuebergaenge.
- Document Upload ist bewusst als Metadaten-Demo ohne medizinische Analyse begrenzt.

Schwach:

- Keine CORS-Konfiguration trotz Cross-Origin-Frontend.
- Optionaler API-Key ist kein echtes Auth-Modell.
- Error Handling ist fuer HTTP/Validation/500 gut, aber API-Client im Frontend nutzt die Details nicht.
- `OrderStatus` enthaelt `pending`, aber `create_order` erzeugt direkt `confirmed`; fuer Demo okay, fuer echten Prozess diskutabel.
- Analytics/Event-Logging ist nicht revisionssicher und nicht manipulationsgeschuetzt.

BFF-Endpunkte:

| Endpoint | Zweck | genutzt von | Status | Risiko |
| --- | --- | --- | --- | --- |
| `POST /api/frontend/intake/full-analyze` | Profil + Intake + Recommendation in einem Flow | Onboarding | stabil | Browser-CORS, breite Fallbacks |
| `GET /api/frontend/nutrition-plan/{patient_id}` | Wochenplan | Dashboard | stabil | 404 bei fehlender Recommendation wird im Frontend Mock |
| `GET /api/frontend/shop/inventory` | Meal-Kit-Inventar | Shop | stabil | oeffentlich okay |
| `GET /api/frontend/shop/meal-kits/{meal_kit_id}` | Detail | Analysis/Shop | stabil | Fallback bei falscher ID kann Fehler kaschieren |
| `GET /api/frontend/recipes/curated/{patient_id}` | kuratierte Rezepte | Recipes | stabil | braucht Recommendation-State |
| `GET /api/frontend/tracking/daily/{patient_id}` | Tagesprogress | Dashboard | stabil | simple Demo-Metriken |
| `POST /api/frontend/tracking/daily/{patient_id}/meal-box` | Meal-Box erledigt | Dashboard | stabil | nur binär, keine Meal-ID |
| `GET /api/frontend/tracking/hydration/{patient_id}` | Hydration | Dashboard | stabil | Demo-State |
| `POST /api/frontend/tracking/hydration/{patient_id}/water` | Wasser addieren | Dashboard | stabil | validiert `amountMl > 0` |

## 6. BFF- und Datenflussanalyse

Tatsaechlicher Flow:

```text
/login oder Direktlink
  -> /profile optional: Profil laden/speichern
  -> /onboarding: Upload-Metadaten + Full Analyze
  -> localStorage patientId + lastAnalysis
  -> /analysis: gespeicherte Analyse anzeigen
  -> /dashboard: Nutrition Plan, Profile, Tracking/Hydration laden
  -> /recipes: curated recipes fuer patientId
  -> /shop: inventory
  -> /checkout: Warenkorb lokal, Order POST ans Backend
```

`patientId`:

- Default: `demo_maria_post_op`.
- Nach Onboarding: in `localStorage` unter `food4recovery.patientId`.
- Analyse: in `localStorage` unter `food4recovery.lastAnalysis`.

Bruchstellen:

- Ohne Seed funktioniert `demo_maria_post_op` nicht sicher fuer Nutrition Plan/Recipes; Mock-Fallback kaschiert das.
- Ohne CORS funktioniert der echte Browser-POST voraussichtlich nicht; Mock-Fallback kann den Flow trotzdem scheinbar retten.
- Bei gesetztem Backend-`API_KEY` muss `NEXT_PUBLIC_API_KEY` im Frontend gesetzt sein; dieser Wert ist sichtbar und nur Demo-tauglich.
- Profil/Condition-Codes sind zwischen Frontend und Backend nicht einheitlich.

## 7. Dev2-Bewertung

Gut:

- Backend/API ist fuer eine Fallstudie klar ueberdurchschnittlich.
- BFF-Schicht ist sinnvoll und zentral.
- Recommendation Engine ist regelbasiert, testbar und fachlich erklaerbar.
- Safety/Risk/Review-Faelle sind vorhanden und nicht nur Text.
- Tests decken viele Domain- und BFF-Faelle ab.
- Seed und API-Contracts sind nachvollziehbar.

Mittelmaessig:

- Frontend-Fallbacks lassen echte Backend-Probleme zu leicht verschwinden.
- CORS fehlt als reale API-Integrationsvoraussetzung.
- Event-Logging sollte nicht als echtes Audit verkauft werden.
- Condition-/Goal-Code-System ist nicht sauber normalisiert.

Kritisch fuer Pruefer:

- Wenn im Live-Browser die echte Backend-Anbindung gezeigt werden soll, muss CORS/Proxy vorher geloest oder zumindest technisch erklaert werden.
- Mock-Fallbacks muessen offen als Demo-Sicherheitsnetz benannt werden.

Dev2 kann guten Gewissens als fertig betrachten:

- Backend-Grundarchitektur.
- BFF-Endpunkte.
- Regelbasierte Recommendation.
- Safety-/Risk-Mechanik.
- Backend-Testbasis.
- Demo-Seed.

## 8. Dev3-/Infra-Bewertung

Reicht fuer Fallstudie:

- ENV-Beispiele vorhanden.
- Seed reproduzierbar.
- Lokaler Demo-Start dokumentiert.
- SQLite als Demo-State okay.
- Minimal-CI korrekt fuer Repo-Layout.
- Keine echten Secrets im Repo gefunden.

Fehlt fuer echtes Produkt:

- Docker oder reproduzierbare Devcontainer.
- Migrationskonzept.
- echte Auth/RBAC.
- CORS-/Reverse-Proxy-Konzept.
- CI-Smoke mit Backend-Start, Seed und Frontend-Browserpfad.
- Deployment-/Runtime-Konfiguration.

CI-Bewertung:

- `.github/workflows/ci.yml` ist fuer das Repo-Layout korrekt: Backend arbeitet in `backend`, Frontend in `frontend`, Node cache nutzt `frontend/package-lock.json`, `npm ci` passt zum Lockfile.
- CI prueft Build, Typecheck, Lint und Backend-Tests.
- CI prueft nicht `npm audit`, Seed, Smoke, CORS oder Browser-E2E.
- Lint-Warnungen lassen CI gruen, weil ESLint Exit 0 liefert.

## 9. Medizinische und rechtliche Guardrails

Positiv:

- Die meisten medizinischen Texte sind inzwischen vorsichtig formuliert.
- Zentrale Disclaimer sagen, dass Empfehlungen Orientierung sind und keine aerztliche Diagnose oder Behandlung ersetzen.
- Dokumenten-Upload sagt explizit, dass keine medizinische Auswertung erfolgt.
- Backend-README grenzt KI, Diagnose, Therapieanweisung und Heilversprechen sauber ab.

Noch zu entschaerfen:

- `frontend/src/app/profile/page.tsx` enthaelt: "Du hast die volle Kontrolle über deine Daten gemäß DSGVO." Das ist fuer eine Demo zu stark. Besser: "Demo-Datenmanagement im lokalen Modus".
- Einige UI-Texte wie "optimale Abstimmung" oder "stärken" sind nicht kritisch, aber sollten in Health-Tech-Kontext vorsichtig bleiben.
- `Therapie` taucht in Code/Docs teils als Fachkontext auf; nicht automatisch falsch, aber nicht als Leistungsversprechen verwenden.

## 10. Security und Datenschutz

Demo-okay:

- API-Key-Schutz greift, wenn `API_KEY` gesetzt ist.
- `NEXT_PUBLIC_API_KEY` ist dokumentiert als sichtbar und nicht geheim.
- Keine echten Secrets gefunden.
- Upload speichert keine Dateiinhalte.
- Fehlerresponses enthalten keine Stacktraces.

Produktiv inakzeptabel:

- Kein echtes Auth-/Session-/Rollenmodell.
- API-Key optional; ohne `API_KEY` sind sensible Routen offen.
- Keine CORS-Konfiguration.
- Keine Rate Limits.
- Kein CSRF-/Session-Konzept.
- Keine Audit-Integritaet.
- Keine Malware-/Magic-Byte-Pruefung fuer Uploads.
- Keine echte Datenschutz-/Consent-Verwaltung.
- Kein Payment Provider, keine Zahlungsabsicherung.

Groesstes Security-Risiko fuer die Demo:

- Fehlende CORS-Konfiguration kann echte Browser-API-Aufrufe blockieren.

Groesstes Datenschutzrisiko fuer Produkt:

- Medizinische/patientennahe Daten werden in einem lokalen SQLite-Demo-System ohne produktive Auth, RBAC, Audit und Datenschutzprozess verarbeitet.

## 11. Tests, Build, Lint und QA

Ausgefuehrte/validierte Checks auf `d8ffdba`:

| Befehl | Ergebnis | Status | Hinweise |
| --- | --- | --- | --- |
| `git status` | sauber vor Report | gruen | nach Report-Datei natuerlich dirty |
| `git diff --check` | keine Whitespace-Probleme | gruen | |
| Konfliktmarker-Suche | keine echten Marker | gruen | Kommentarzeilen mit `=======` in `mockApi.ts` sind keine Marker |
| `cd frontend && npm install` | up to date | gruen | 2 moderate Audit-Hinweise |
| `cd frontend && npm run build` | Build erfolgreich | gruen mit Warnungen | 5 ESLint-Warnungen |
| `cd frontend && npx tsc --noEmit` | erfolgreich | gruen | seriell nach Build geprueft |
| `cd frontend && npm run lint` | Exit 0 | gruen mit Warnungen | 5 Warnungen |
| `cd frontend && npm audit --audit-level=moderate` | 2 moderate Vulnerabilities | rot | Force-Fix wuerde breaking Next-Downgrade/Altpfad vorschlagen |
| `cd backend && python -m pip install -e .` | erfolgreich | gruen | |
| `cd backend && python -m pytest app/tests --tb=short` | 57 passed | gruen | |
| Backend `/health` | 200 | gruen | mit lokal gestarteter Uvicorn-App |
| CORS Preflight auf `POST /api/frontend/intake/full-analyze` | 405, kein ACAO | rot | Browser-Risiko |

Smoke-Checks aus dem Branch-Integrationsstand `d8ffdba` waren direkt per HTTP gruen:

- `GET /health`
- `GET /api/frontend/shop/inventory`
- `POST /api/frontend/intake/full-analyze`
- `GET /api/frontend/nutrition-plan/{patient_id}`
- `GET /api/frontend/recipes/curated/{patient_id}`
- `POST /api/frontend/tracking/hydration/{patient_id}/water`
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`
- `POST /api/orders`
- `POST /api/documents/upload`
- Frontend HTTP 200

Testqualitaet:

- Fallstudie: 7/10
- echtes Produkt: 4/10

Warum 57 Tests substanziell sind:

- Sie decken BFF-Contracts, Orders, Document Upload, Error Envelope, Privacy Export/Delete, Seed, Recommendation Rules, Safety/Review und Tracking ab.
- Es sind nicht nur Smoke-Tests; mehrere negative Faelle werden geprueft.

Was fehlt:

- keine Frontend-Tests.
- keine Browser-E2E-Tests.
- kein CORS-Test.
- keine CI-Smoke mit laufendem Server.
- keine visuellen/regressiven UI-Tests.
- keine Last-/Concurrency-Tests.

Top 5 naechste Tests:

1. Browser-E2E `onboarding -> analysis -> dashboard -> recipes -> shop -> checkout`.
2. CORS/Preflight-Integrationstest oder Next-Proxy-Test.
3. Frontend-Test fuer `apiClient` Fallback-Verhalten mit "Backend down" vs. "Backend returns 500".
4. Dashboard-Test fuer Condition-Code-Mapping und Safety-Hinweise.
5. Upload-Test mit gefaelschtem MIME-Type vs. Dateiendung/Magic Bytes.

## 12. Codequalitaet

Staerken:

- Backend ist lesbar, modular und gut testbar.
- Schemas sind ueberwiegend streng typisiert.
- Repository/Service-Struktur ist nachvollziehbar.
- Fehlerbehandlung ist bewusst implementiert.
- Frontend Build und TypeScript strict laufen.

Schwaechen:

- Dashboard zu gross und zu viele Inline Styles/Actions.
- `apiClient.ts` ist zu breit: Fetch, Mapping, LocalStorage, Fallback, Upload, Checkout, Tracking in einer Datei.
- Mock- und Backend-View-Models sind gekoppelt ueber `mockApi.ts`-Typen.
- Condition-/Goal-IDs sind inkonsistent (`post_op`, `post_op_recovery`, `wound_healing`, `chemotherapy`, `chemo_support`).
- Profile-Datenmanagement-Buttons sind UI-only Alerts, obwohl Backend Export/Delete existiert.
- Onboarding enthaelt ungenutzte Code-Reste.

## 13. Produktreife

Produktidee:

- Klar und gut erzaehlbar: Patientendaten + Intake + regelbasierte Ernaehrungsempfehlung + Meal-Kit/Tracking.
- Der Shop ist als optionaler Umsetzungsbaustein sinnvoll, solange er nicht als Therapie verkauft wird.
- Der MVP-Flow ist fuer eine Demo logisch.

Was fehlt fuer echtes Produktgefuehl:

- echte Auth und Profilbindung.
- echte serverseitige Session statt `localStorage` patientId.
- sichtbarer Backend-/Fallback-Modus.
- durchgaengige Persistenz fuer alle Tracking-Aktionen.
- echtes Datenmanagement fuer Export/Delete im Frontend.
- Frontend-E2E-Tests.
- medizinische Validierung durch Fachpersonal.

## 14. Bewertungsmatrix

| Bereich | Bewertung 1-10 | Begruendung |
| --- | ---: | --- |
| Produktidee | 8 | klarer Health-/Recovery-Use-Case |
| Frontend | 7 | praesentationsstark, aber grosse Pages und Mock-Fallback-Maskierung |
| Backend/API | 8 | modular, getestet, fachlich erklaerbar |
| BFF/API-Integration | 7 | sinnvoll, aber CORS/Fallback-Risiko |
| Recommendation Engine | 7 | regelbasiert und erklaerbar, aber keine medizinische Validierung |
| Datenfluss | 7 | Demo-Flow gut, `localStorage` und Seed-Abhaengigkeit bleiben |
| Security/Datenschutz | 4 | fuer Demo dokumentiert, produktiv klar unzureichend |
| Medizinische Guardrails | 7 | gute Disclaimer, einzelne Texte noch zu stark |
| Tests/QA | 7 | Backend gut, Frontend/E2E fehlen |
| DevOps/Infra | 5 | minimale CI und Seed gut, Docker/Proxy/E2E fehlen |
| Dokumentation | 8 | umfangreich und praxisnah |
| Demo-Faehigkeit | 8 | direktes HTTP gruen, Browser-CORS muss geklaert werden |
| Codequalitaet | 7 | Backend stark, Frontend teilweise schwergewichtig |
| Gesamtstand Fallstudie | 8 | solide bis stark |
| Gesamtstand echtes MVP | 5 | viele produktive Kernrisiken offen |

Zusatzbewertung:

- Fertigstellungsgrad Fallstudie: 90 %
- Fertigstellungsgrad echtes Produkt-MVP: 55 %
- Risiko Fallstudienbewertung: niedrig bis mittel
- Risiko technische Live-Demo: mittel, bis CORS/Browsertest geklaert ist
- Risiko echter Produktiveinsatz: hoch

## 15. Kritische Probleme

| Problem | Bereich | Schweregrad | Auswirkung | Empfohlene Loesung | Aufwand | Prioritaet |
| --- | --- | --- | --- | --- | --- | --- |
| Fehlende CORS-Konfiguration fuer Frontend 3000 -> Backend 8000 | API/Infra | hoch | echte Browser-API-Calls koennen blockieren | CORS fuer lokale Demo-Origin oder Next-Proxy sauber konfigurieren | S | P0 |
| Mock-Fallbacks kaschieren 401/404/500/CORS | Frontend/API | hoch | Demo wirkt gruen obwohl Backend kaputt ist | Dev-Modus-Indikator und optionaler harter API-Modus | M | P1 |
| Dashboard-Condition-Mapping inkonsistent | Frontend/API Contract | mittel | Safety-Hinweise koennen bei Backend-Profilen fehlen | Condition-Normalisierung im `apiClient` oder gemeinsame Enum | S | P1 |
| 5 ESLint-Warnungen | Frontend | niedrig-mittel | wirkt unfertig, Merge-Reste | ungenutzte Werte entfernen, Hook-Dependency fixen | S | P1 |
| Dashboard 474 Zeilen mit gemischten Verantwortlichkeiten | Frontend | mittel | Wartbarkeit sinkt, Merge-Risiko steigt | QuickTrack/Safety/Stats minimal extrahieren | M | P2 |
| Kein Frontend-/E2E-Test | QA | mittel | Browser-Flow nicht abgesichert | Playwright/Cypress Minimalflow | M | P1 |
| `POST /api/documents/upload` prueft nur MIME-Type | Security | mittel | gefaelschte Inhalte werden akzeptiert | Magic-Byte-Pruefung und klare Demo-Policy | S-M | P2 |
| Audit/Event-Logging nicht revisionssicher | Backend/Security | mittel | darf nicht als produktives Audit verkauft werden | als Telemetrie benennen oder echtes Auditdesign spaeter | M | P2 |
| npm audit moderate transitive Warnungen | Dependencies | mittel | Known security finding | kein Force-Downgrade; Next-compatible Patch beobachten/testen | S-M | P2 |
| Profil-Datenmanagement UI-only | Frontend/Privacy | mittel | Export/Delete wirken produktiver als sie sind | Backend Export/Delete anbinden oder klar Demo markieren | M | P2 |

## 16. Priorisierte To-dos

Top 5 Muss vor Abgabe:

1. CORS/Browser-API-Pfad fixen oder Next-Proxy einrichten und echten Browser-Klicktest machen.
2. 5 Lint-Warnungen entfernen.
3. Fallback-Modus im Demo-Test sichtbar machen oder fuer finalen Smoke deaktivierbar machen.
4. Condition-/Goal-Mapping zwischen Frontend und Backend normalisieren.
5. Full-flow Browser-Test dokumentieren: Onboarding, Analysis, Dashboard, Recipes, Shop, Checkout.

Top 5 Sollte vor Abgabe:

1. Dashboard minimal in Subkomponenten aufteilen.
2. Profile Export/Delete entweder anbinden oder UI-Text klar als Demo markieren.
3. `apiClient.ts` in kleine Funktionsbereiche splitten.
4. `POST /api/documents/upload` mit Magic-Byte-Minimum pruefen.
5. CI um Seed/Backend-Smoke erweitern.

Top 10 nach der Fallstudie:

1. echte Auth mit Sessions/JWT und Rollenmodell.
2. RBAC fuer Patient, Fachpersonal, Admin.
3. produktive DB/Migrationen.
4. echtes Audit Logging mit Integritaet und Datenschutzkonzept.
5. medizinische Validierung der Regeln.
6. sichere Dokumentenpipeline mit Malware-Scan, OCR nur wenn klar ausgewiesen.
7. Payment Provider statt Demo-Checkout.
8. Frontend- und E2E-Test-Suite.
9. Observability/Monitoring.
10. Deployment-/Docker-/CI-CD-Setup.

Top 5 Dev2-Aufgaben:

1. CORS/Proxy und API-Smoke im Browser absichern.
2. BFF-Fallback-Hard-Mode implementieren.
3. Condition-Code-Contract konsolidieren.
4. Backend-Export/Delete im Frontend nutzbar machen oder klar abgrenzen.
5. Tests fuer CORS, API-Key und Fallback-Fehlerpfade ergaenzen.

Top 5 Dev1-Aufgaben:

1. Lint-Warnungen bereinigen.
2. Dashboard minimal refaktorieren.
3. Full-flow visuellen Klicktest machen.
4. Responsive Check fuer Dashboard/Profile/Checkout.
5. UI-Texte zu Datenschutz/Tracking/Mock-Fallback schaerfen.

Top 5 Dev3/Infra-Aufgaben:

1. lokale CORS/Proxy-Strategie finalisieren.
2. CI um Seed/Smoke erweitern.
3. Docker/Compose oder Devcontainer als Future Work vorbereiten.
4. ENV-Dokumentation fuer API-Key und Frontend-Origin schaerfen.
5. npm audit Known Issue regelmaessig gegen Next 15.x pruefen.

## 17. Gutachter-Einschaetzung

Was wuerde ein strenger DHBW-Gutachter positiv sehen?

- Das Projekt hat eine echte Backend-Domainstruktur statt nur UI-Mocks.
- BFF-Integration ist vorhanden und zentral.
- Recommendation Engine ist regelbasiert, nachvollziehbar und testbar.
- Safety-/Risk-/Review-Konzepte sind fachlich relevant.
- Backend-Tests sind fuer eine Fallstudie substanziell.
- Seed und Demo-Start sind reproduzierbar dokumentiert.
- Medizinische Grenzen werden groesstenteils sauber benannt.

Was wuerde ein strenger DHBW-Gutachter kritisch sehen?

- Der echte Browser-API-Pfad ist wegen fehlendem CORS nicht ausreichend abgesichert.
- Mock-Fallbacks koennen technische Fehler verdecken.
- Es gibt keine Frontend-/E2E-Tests.
- Auth, Datenschutz und Audit sind klar Demo-/MVP-Grenzen.
- Dashboard und `apiClient.ts` sind wartungsseitig zu gross.
- Einzelne Datenschutztexte klingen noch zu stark fuer den technischen Stand.

## 18. Naechster sinnvoller Codex-Prompt

```text
Du bist Full-Stack-Stabilization-Engineer fuer Food4Recovery. Arbeite auf codex/mvp-final-programming. Keine grossen Refactors, keine Dependency-Upgrades, kein Force-Push.

Ziel: Behebe die wichtigsten P0/P1-Risiken aus docs/reports/full-codebase-status-analysis.md.

Aufgaben:
1. Pruefe und behebe den Browser-CORS-Pfad fuer lokale Demo: Frontend http://127.0.0.1:3000 muss Backend http://127.0.0.1:8000 fuer JSON-POSTs und GETs erreichen. Nutze eine kleine, konfigurierbare FastAPI-CORS-Konfiguration oder einen Next-Proxy, keine produktive Security vortaeuschen.
2. Fuege ENV-Doku fuer erlaubte lokale Frontend-Origin hinzu, falls CORS im Backend geloest wird.
3. Entferne die 5 ESLint-Warnungen in analysis/onboarding ohne UI-Redesign.
4. Normalisiere Condition-Codes im Frontend-API-Mapping, sodass Backend-Werte wie post_op_recovery und chemo_support die Dashboard-Safety-Hinweise korrekt ausloesen.
5. Fuehre Checks aus: frontend npm install, npm run build, npx tsc --noEmit, npm run lint, backend python -m pip install -e ., python -m pytest app/tests.
6. Starte Backend und Frontend lokal und fuehre einen echten Browser-/Preflight-Smoke fuer Onboarding/Full-Analyze, Dashboard und Checkout aus.
7. Dokumentiere Ergebnisse in docs/reports/final-p0-p1-stabilization.md.

Committe nur, wenn Checks gruen sind, mit: "fix: stabilize local browser demo path".
```

## 19. Fazit

Food4Recovery ist fuer die Fallstudie gut genug und wirkt technisch ernsthaft, solange die Demo sauber vorbereitet wird und die Grenzen offen kommuniziert werden. Der Stand ist eher 90 % als 85 % oder 95 %: deutlich mehr als ein Prototyp, aber nicht warnungsfrei, nicht browserseitig voll abgesichert und nicht produktionsnah.

Vor Abgabe sollten CORS/Browsertest, die 5 Lint-Warnungen und das Condition-Mapping noch erledigt werden. Danach ist die technische Live-Demo deutlich robuster.
