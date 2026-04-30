# Demo Hardening Report

Stand: finaler Hardening-Durchlauf auf Branch `codex/demo-final-hardening`.

## Ausgangszustand

- Ausgangspunkt war `main` bei Commit `e9516dd` mit sauberem Working Tree.
- Frontend Build, Typecheck und Lint waren bereits gruen.
- Backend-Tests liefen mit `48 passed`.
- Zentrale Demo-Screens nutzten bereits den Backend-BFF mit Mock-Fallback.
- Noch offen waren Demo-Startablauf, Profil-/Checkout-Bewertung, npm-Audit-Warnungen, `<img>`-Lint-Warnungen und letzte Claim-Pruefung.

## Geaenderte Dateien

- `README.md`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/next.config.ts`
- `frontend/src/services/apiClient.ts`
- `frontend/src/app/checkout/page.tsx`
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/login/page.module.css`
- `frontend/src/components/CuratedMealCard.tsx`
- `docs/reports/demo-readiness-check.md`
- `docs/reports/demo-hardening-report.md`
- `docs/designs/dokument_upload/code.html`
- `docs/designs/gesundheitsprofil/code.html`
- `docs/Roadmap_fuer_Dev3.md`
- `docs/Roadmap_Uebersicht.md`

## BFF-Screens

- `/onboarding`: `POST /api/frontend/intake/full-analyze`, mit Mock-Fallback.
- `/analysis`: letzte BFF-Analyse aus lokalem Demo-State, mit Mock-Fallback.
- `/dashboard`: `GET /api/frontend/nutrition-plan/{patient_id}` plus Tracking/Hydration, mit Mock-Fallback.
- `/recipes`: `GET /api/frontend/recipes/curated/{patient_id}`, mit Mock-Fallback.
- `/shop`: `GET /api/frontend/shop/inventory`, mit Mock-Fallback.
- `/profile`: versucht `GET /api/patient-profile/{patient_id}` und `POST /api/patient-profile`, mit Mock-Fallback.
- `/checkout`: versucht `POST /api/orders`, mit lokalem Demo-Order-Fallback.

## Mock-Fallback-Screens

- `/login`: bleibt bewusst Demo-Gatekeeper ohne echte Auth.
- `/profile`: Backend-Anbindung ist klein vorhanden, faellt aber bei fehlendem Patient/Seed/API-Key auf Mock zurueck.
- `/checkout`: Backend-Order-Call ist klein vorhanden, faellt aber bei ungueltigen Mock-Meal-Kit-IDs oder fehlendem Patient/Seed/API-Key auf lokale Demo-Bestellung zurueck.

## Demo-Startanleitung

### 1. Backend installieren

```bash
cd backend
python -m pip install -e .
```

### 2. Optionalen API-Key setzen

Standard: kein `API_KEY`, dann sind geschuetzte Demo-Endpunkte lokal ohne Header erreichbar.

Falls ein API-Key gesetzt werden soll:

```powershell
$env:API_KEY="demo-local-key"
```

Dann muss das Frontend denselben Wert als Public Demo-Key kennen:

```powershell
$env:NEXT_PUBLIC_API_KEY="demo-local-key"
```

Keine echten Secrets ins Repository schreiben. `NEXT_PUBLIC_API_KEY` ist im Browser sichtbar und nur fuer lokale Demo-Zwecke geeignet.

### 3. Demo-Daten seeden

```bash
cd backend
python scripts/seed/seed_demo_data.py --reset
```

Erzeugte Demo-Personas:

- `demo_maria_post_op`
- `demo_schluckproblem_review`
- `demo_allergy_safety`

### 4. Backend starten

```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Smoke:

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/frontend/shop/inventory
```

### 5. Frontend starten

```bash
cd frontend
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Frontend: `http://127.0.0.1:3000`

### 6. Demo-Flow

1. `/login` oder direkt `/onboarding` oeffnen.
2. Onboarding-Fragen ausfuellen und Analyse starten.
3. `/analysis` zeigt die orientierende Auswertung.
4. `/dashboard` zeigt Plan, Tracking und Hydration.
5. `/recipes` zeigt kuratierte Rezeptideen.
6. `/shop` Meal-Kit in den Warenkorb legen.
7. `/checkout` Demo-Bestellung absenden. Es wird keine echte Zahlung verarbeitet.

## npm Audit

- Vor Hardening: Next `15.1.0` hatte mehrere Next-Advisories inklusive kritischer Eintraege.
- Geaendert auf Next `15.5.15` und `eslint-config-next` `15.5.15`, also kein Major-Upgrade und kein Downgrade.
- `npm audit` meldet danach nur noch 2 moderate Eintraege ueber `postcss` in der Next-Dependency. `npm audit` bietet dafuer keinen sauberen 15.x-Patch-Pfad an; deshalb kein `npm audit fix --force`.

## Medizinische Und Security-Texte

- Sichtbare und dokumentierte Claims fuer `DSGVO konform`, `Ende-zu-Ende`, `diagnostiziert`, `heilt`, `garantiert`, `medizinisch sicher` wurden gesucht.
- Ueberzogene Security-Claims in Design-/UI-Kontexten wurden zu `Demo-Datenschutzkonzept`, `lokaler Demo-Modus` oder vorsichtigen Demo-Formulierungen entschaerft.
- Bestehende Hinweise wie `ersetzt keine aerztliche Diagnose oder Behandlung` bleiben erhalten.
- Keine zusaetzlichen Disclaimer-Spam-Bloecke wurden eingefuegt.

## Checks

Gruen:

- `cd frontend && npm install`
- `cd frontend && npm run build` mit Next `15.5.15`
- `cd frontend && npx tsc --noEmit`
- `cd frontend && npm run lint`
- `cd backend && python -m pip install -e .`
- `cd backend && python -m pytest app/tests` mit `48 passed`
- Backend Smoke `/health`: `ok`
- Backend Smoke `/api/frontend/shop/inventory`: 5 Meal-Kits
- Frontend Smoke `http://127.0.0.1:3000`: HTTP 200
- Technischer Demo-Flow `POST /api/frontend/intake/full-analyze`: Patient `demo_smoke_onboarding`, 7 Plantage, 3 empfohlene Meal-Kits
- Technischer Checkout-Smoke `POST /api/orders`: Order wurde `confirmed`

Rot:

- `npm audit` bleibt mit 2 moderaten transitive Warnungen offen. Kein `npm audit fix --force`, da der angebotene Fix-Pfad nicht als risikoarmer 15.x-Patch dokumentiert ist.

## Bekannte Risiken

- `NEXT_PUBLIC_API_KEY` ist nur eine Demo-Hilfe und kein Geheimnis.
- `/checkout` ist eine Demo-Order ohne echtes Payment und ohne Zahlungsdatenverarbeitung.
- `/profile` nutzt nur eine kleine Schema-Abbildung; komplexere Profilfelder bleiben Backend-seitig vorhanden, aber nicht voll in der UI editierbar.
- Wenn Shop-Daten aus Mock-Fallback stammen, koennen Order-IDs nicht zum Backend-Katalog passen; dann greift der lokale Checkout-Fallback.
- `npm audit` bleibt mit 2 moderaten PostCSS/Next-Transitivwarnungen offen, weil der angebotene Fix nicht als sicherer 15.x-Patch verfuegbar ist.

## Finale Praesentationsbewertung

Praesentierbar: ja.

Der zentrale Flow ist backendgestuetzt, bleibt durch Mock-Fallbacks demo-robust, verarbeitet keine echten Zahlungsdaten, verkauft keine medizinische Diagnose und dokumentiert den lokalen Demo-Modus klar.
