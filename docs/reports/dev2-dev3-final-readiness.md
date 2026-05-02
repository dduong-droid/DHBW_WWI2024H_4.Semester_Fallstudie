# Dev2 + Dev3 Final Readiness Report

## 1. Ausgangszustand

- Branch: `codex/dev2-dev3-final-readiness`
- Ausgangscommit: `5d5f7bf` (`feat: harden Food4Recovery demo flow`)
- Relevante vorherige Reports: `docs/reports/demo-readiness-check.md`, `docs/reports/demo-hardening-report.md`
- Bekannte Ausgangsrisiken: moderate transitive `npm audit`-Warnung in `postcss` über `next`, kein echtes Auth-/Rollenmodell, keine produktive medizinische Validierung, keine echte Payment-Integration, lokaler SQLite-Demozustand.

## 2. Dev2-Verantwortungsbereich

- Backend/API: FastAPI-App mit zentralem Router unter `/api`, globalem Error-Handling und optionalem API-Key-Schutz.
- BFF: Frontend-nahe Endpunkte unter `/api/frontend/...` liefern camelCase-Responses für Onboarding, Analyse, Dashboard, Recipes, Shop und Tracking.
- Recommendation Engine: Regelbasierte Template- und Meal-Kit-Auswahl mit erklärbaren Scores, Rationale-Lines und Allergie-/Unverträglichkeitsfiltern.
- Risk/Safety: Review- und Safety-Fälle sind über Risk Flags, Safety Check und Professional Review abbildbar.
- Tests: API-, Integration- und Unit-Tests decken BFF, Recommendation Rules, Order Handling, Security/Privacy und Persistenz ab.

## 3. Dev3-Übernommener Bereich

- Infra: Lokaler Start bleibt bewusst schlank mit Python/FastAPI, Next.js und SQLite.
- ENV: `.env.example` und `backend/.env.example` dokumentieren Backend- und Frontend-Demo-Variablen.
- DB/Seed: `backend/scripts/seed/seed_demo_data.py --reset` erzeugt reproduzierbare Demo-Personas.
- Demo-Start: Start- und Smoke-Schritte sind unten dokumentiert.
- Reproduzierbarkeit: Seed, Backend, Frontend und Smoke-Checks können lokal ohne echte Secrets ausgefuehrt werden.
- Security-Grenzen: API-Key ist nur MVP-/Demo-Schutz; produktive Auth, Rollen, Auditing und Datenschutzprüfung fehlen bewusst.

## 4. Backend-Architektur

Der zentrale Datenfluss ist konsistent und demo-tauglich: `PatientProfile` speichert Basisdaten und Consent, `QuestionnaireIntake` strukturiert den Intake, die `RecommendationEngine` erzeugt regelbasierte Empfehlungen, `NutritionPlan` persistiert daraus Pläne, die `Frontend BFF` mappt Domain-Modelle in frontend-nahe Contracts, Tracking/Hydration speichern Demo-Fortschritt und `OrderHandling` erzeugt lokale Demo-Bestellungen ohne Payment-Provider.

Router, Services, Schemas und Repositories folgen pro Modul einem konsistenten Muster. Fehler für fehlende Patientinnen/Patienten oder fehlenden Recommendation-State werden als 404 ausgeloest; Validation-Fehler laufen als 422 über den globalen Error-Envelope.

## 5. BFF-Endpunkte

| Endpoint | Zweck | Genutzt von Screen | Response-Status | Risiken |
| --- | --- | --- | --- | --- |
| `POST /api/frontend/intake/full-analyze` | Profil, Intake und Empfehlung in einem Demo-Schritt erzeugen | `/onboarding`, `/analysis` | Stabil, camelCase-Response | Payload muss schema-konform sein; API-Key nötig, falls gesetzt |
| `GET /api/frontend/nutrition-plan/{patient_id}` | Letzten Plan aus Recommendation-State liefern | `/dashboard` | Stabil, 404 ohne Recommendation | Demo-State muss vorhanden sein |
| `GET /api/frontend/shop/inventory` | Aktive Meal-Kits für Shop liefern | `/shop` | Stabil | Katalog ist statisch/demohaft |
| `GET /api/frontend/shop/meal-kits/{meal_kit_id}` | Detaildaten eines Meal-Kits liefern | `/shop`, `/checkout` | Stabil, 404 bei unbekannter ID | Keine Lager-/Preisvalidierung gegen externes System |
| `GET /api/frontend/recipes/curated/{patient_id}` | Kuratierte Rezeptkarten aus Empfehlung ableiten | `/recipes` | Stabil, 404 ohne Recommendation | Empfehlungen sind regelbasiert und orientierend |
| `GET /api/frontend/tracking/daily/{patient_id}` | Tagesfortschritt laden | `/dashboard` | Stabil, 404 ohne Patient | Lokaler Demo-State |
| `POST /api/frontend/tracking/daily/{patient_id}/meal-box` | Meal-Box als gegessen markieren | `/dashboard` | Stabil, 404 ohne Patient | Vereinfachte Demo-Logik |
| `GET /api/frontend/tracking/hydration/{patient_id}` | Hydration laden | `/dashboard` | Stabil, 404 ohne Patient | Lokaler Demo-State |
| `POST /api/frontend/tracking/hydration/{patient_id}/water` | Trinkmenge addieren | `/dashboard` | Stabil, 422 bei ungueltiger Menge | Keine medizinische Trinkmengenfreigabe |

## 6. Demo-Daten und Seed

Seed-Befehl:

```bash
cd backend
python scripts/seed/seed_demo_data.py --reset
```

Demo-Personas:

- `demo_maria_post_op`: postoperativer Standard-Demo-Flow mit Wundheilungsfokus.
- `demo_schluckproblem_review`: Review-Fall mit minimalem Appetit, Schluckproblemen und niedriger Flüssigkeitsaufnahme.
- `demo_allergy_safety`: Safety-Fall mit Allergie-/Unverträglichkeitskontext und Review-Bedarf.

Erwartete Ergebnisse: Pro Persona werden Profil, Intake, Assessment, Recommendation, Nutrition Plan, Shopping List und Safety Check erzeugt. Das Script baut Persona-Daten vor dem Seed neu auf; `--reset` bleibt als Kompatibilitaetsflag erhalten.

Bekannte Risiken: SQLite ist lokaler Demo-State ohne Migration-/Rollback-Prozess. Für die Fallstudien-Demo ist das ausreichend, für Produktivbetrieb nicht.

## 7. Setup- und Demo-Startanleitung

1. Backend installieren:

```bash
cd backend
python -m pip install -e .
```

2. Optionalen Demo-API-Key setzen:

```powershell
$env:API_KEY="demo-local-key"
```

Wenn `API_KEY` gesetzt ist, im Frontend lokal denselben Wert setzen:

```powershell
$env:NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8000"
$env:NEXT_PUBLIC_API_KEY="demo-local-key"
```

`NEXT_PUBLIC_API_KEY` ist im Browser sichtbar und nur eine lokale Demo-Hilfe, kein echtes Secret.

3. Demo-Daten seeden:

```bash
cd backend
python scripts/seed/seed_demo_data.py --reset
```

4. Backend starten:

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

5. Frontend installieren und starten:

```bash
cd frontend
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

6. Smoke-Checks:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
Invoke-RestMethod http://127.0.0.1:8000/api/frontend/shop/inventory
Invoke-WebRequest http://127.0.0.1:3000 -UseBasicParsing
```

7. Demo-Flow öffnen: `http://127.0.0.1:3000/login`, dann `/onboarding -> /analysis -> /dashboard -> /recipes -> /shop -> /checkout`.

## 8. Tests und Checks

| Befehl | Ergebnis | Grün/Rot | Hinweise |
| --- | --- | --- | --- |
| `cd frontend && npm install` | Ausgefuehrt | Grün | Dependencies installiert, moderate Audit-Warnung bleibt bekannt |
| `cd frontend && npm run build` | Ausgefuehrt | Grün | Next.js `15.5.15` |
| `cd frontend && npx tsc --noEmit` | Ausgefuehrt | Grün | Keine TypeScript-Fehler |
| `cd frontend && npm run lint` | Ausgefuehrt | Grün | ESLint-Script nutzt `eslint . --ext .ts,.tsx` |
| `cd backend && python -m pip install -e .` | Ausgefuehrt | Grün | Editable Install erfolgreich |
| `cd backend && python -m pytest app/tests` | Ausgefuehrt | Grün | 48 passed |
| `cd backend && python scripts/seed/seed_demo_data.py --reset` | Ausgefuehrt | Grün | 3 Demo-Personas neu erzeugt |
| Smoke `/health`, Shop, Full Analyze, Order, Frontend HTTP 200 | Ausgefuehrt | Grün | Technisch via lokale Server geprüft |
| `cd frontend && npm audit --audit-level=moderate` | Ausgefuehrt | Rot | 2 moderate transitive `postcss`-Warnungen; `npm audit fix --force` wuerde laut npm auf eine brechende Next-Version ausweichen |

## 9. Security-/Datenschutzgrenzen

Umgesetzt im MVP:

- Optionaler `X-API-Key`-Schutz für geschuetzte API-Bereiche.
- Consent-Pflicht beim Erstellen eines PatientProfile.
- Export- und Delete-Endpunkte für Demo-Daten.
- Lokale `.env.example`-Dokumentation ohne echte Secrets.

Bewusst nicht produktiv:

- Keine echte Authentifizierung.
- Kein Rollen-/Rechtemodell.
- Kein Audit Logging.
- Keine produktive Datenschutzprüfung.
- Keine sichere Dokumentenverarbeitung.
- Keine medizinische Validierung.
- Keine Payment-Provider-Integration.

Naechste Ausbaustufen: echte Auth/RBAC, Audit-Events für kritische Aktionen, Datenschutz-/Löschkonzept mit Aufbewahrungsregeln, sichere File-Verarbeitung, medizinische Validierung, Payment Provider im Sandbox-Modus.

## 10. Medizinische Guardrails

Die Anwendung beschreibt Empfehlungen als orientierend, regelbasiert und nicht diagnostisch. Sie ersetzt keine ärztliche Diagnose oder Behandlung. Meal-Kits und Rezepte sind optionale Umsetzungshilfen und keine Therapieanweisung. Review-/Safety-Fälle sind im Demo-Flow sichtbar: Schluckprobleme, geringe Flüssigkeitsaufnahme und Allergie-/Unverträglichkeitskonflikte fuehren zu Safety-/Review-Kontext statt zu überstarken Freigaben.

## 11. Offene Risiken

Kritisch:

- Keine kritisch demo-blockierenden Risiken nach den Checks.

Mittel:

- `API_KEY` ist nur MVP-/Demo-Schutz, kein echtes Auth-/RBAC-System.
- `NEXT_PUBLIC_API_KEY` ist sichtbar und darf nicht als Secret betrachtet werden.
- Moderate `npm audit`-Warnung bleibt bestehen, weil der vorgeschlagene Fix ein Breaking Downgrade erzwingen wuerde.
- SQLite-Demo-State ist nicht produktiv migrations-/backupfaehig.
- Keine medizinische Validierung der Regeln durch Fachpersonal im Code nachweisbar.
- Checkout erzeugt Demo-Bestellungen ohne echten Payment Provider.

Niedrig:

- Mock-Fallback kann Backend-Ausfälle in der UI abfedern und muss in der Präsentation als Demo-Fallback benannt werden.
- Kein Docker-/CI-Setup im Repo gefunden; für die lokale Demo nicht blockierend.

## 12. Übergabe an Dev1

Dev1 sollte nur noch die visuelle Demo prüfen: responsive Darstellung, finale UX-Details, Lesbarkeit der Profil-/Checkout-Darstellung, Browser-Klickpfad und konsistente Demo-Texte. API-/BFF-Arbeit sollte nicht doppelt gemacht werden; bei UI-Fehlern bitte den vorhandenen `apiClient` und die Mock-Fallbacks weiterverwenden.

## 13. Präsentationssprechpunkte für Dev2

1. Das Backend ist in Domain APIs und einen Frontend-BFF getrennt, damit die UI stabile camelCase-Contracts bekommt.
2. Die Analyse ist regelbasiert und erklärbar, keine Black-Box-KI.
3. Safety- und Risk-Logik bildet Review-Fälle wie Schluckprobleme, geringe Flüssigkeitsaufnahme und Allergien ab.
4. Der zentrale Demo-Flow ist backendgestuetzt: Onboarding, Analyse, Dashboard, Recipes, Shop und Checkout.
5. Demo-Daten sind reproduzierbar über ein Seed-Script mit drei Personas.
6. Der API-Key ist nur eine lokale MVP-Schutzmassnahme, keine produktive Auth.
7. Tests decken API, BFF, Recommendation Rules, Order Handling und Security/Privacy ab.
8. Medizinisch bleibt die App bewusst bei orientierenden Empfehlungen ohne Diagnose- oder Heilversprechen.

## 14. Fazit

Präsentierbar: Ja.

Begründung: Frontend Build, Typecheck und Lint sind grün; Backend-Tests sind grün; Smoke-Checks für Backend, BFF, Intake, Order und Frontend HTTP 200 sind grün. Der Demo-Startprozess ist reproduzierbar dokumentiert. Dev2-Status ist demo-ready. Dev3-Status ist für lokale Fallstudien-Demo ausreichend, aber nicht produktionsreif.
