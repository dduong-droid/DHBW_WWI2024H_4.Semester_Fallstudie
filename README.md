# Food 4 Recovery

Fallstudien-Repository fuer das Projekt `Food 4 Recovery` mit Frontend, Backend, Infrastruktur-Vorbereitung, Shared-Bereich und Projektdokumentation.

## Projektstruktur

- `frontend/` enthaelt das Next.js-MVP mit Screens, Komponenten, Browser-Validierung und aktuellem Mock-/Service-Layer.
- `backend/` enthaelt die FastAPI-Anwendung mit fachlichen Modulen, Recommendation Engine, Order Handling und dem Frontend-BFF unter `/api/frontend`.
- `infra/` ist der vorgesehene Bereich fuer Datenbank, Auth und technische Infrastruktur.
- `shared/` ist fuer teamuebergreifende Contracts, gemeinsame Standards und spaetere geteilte Artefakte gedacht.
- `docs/` sammelt Projektkontext, Design-Artefakte und Team-Prompts.

## Aktueller Stand

- Das Frontend ist praesentierbar und arbeitet derzeit ueber `frontend/src/services/mockApi.ts` sowie lokale States.
- Das Backend ist inzwischen deutlich ueber das Grundgeruest hinaus ausgebaut und bietet:
  - Patientenprofil
  - Fragebogen-Intake
  - regelbasierte Recommendations
  - Meal-Kit-Katalog
  - Order Handling inkl. Statuswechsel
  - einen additiven Frontend-BFF-Layer unter `/api/frontend`
- `infra/` und `shared/` sind bewusst noch leichtgewichtig und fuer die naechsten Team-Schritte vorbereitet.

## Wichtige Einstiegsdokumente

- [Projektkontext](docs/project_context.md)
- [Design-Artefakte](docs/designs/README.md)
- [Prompt fuer Entwickler 1](docs/entwickler1_frontend_prompt.md)
- [Prompt fuer Entwickler 3](docs/entwickler3_infra_prompt.md)

## Frontend zu Backend

Das Frontend wurde frontend-driven gegen `frontend/src/types/apiContracts.ts` aufgebaut.
Um das Frontend ohne harte Kopplung an interne Domain-Modelle anschliessbar zu machen, liefert das Backend jetzt zusaetzlich einen BFF-/Compatibility-Layer unter `/api/frontend`.

Wichtige BFF-Endpunkte:

- `POST /api/frontend/intake/full-analyze`
- `GET /api/frontend/nutrition-plan/{patient_id}`
- `GET /api/frontend/shop/inventory`
- `GET /api/frontend/shop/meal-kits/{meal_kit_id}`
- `GET /api/frontend/recipes/curated/{patient_id}`
- `GET /api/frontend/tracking/daily/{patient_id}`
- `POST /api/frontend/tracking/daily/{patient_id}/meal-box`
- `GET /api/frontend/tracking/hydration/{patient_id}`
- `POST /api/frontend/tracking/hydration/{patient_id}/water`

Die fachlichen Domain-Endpunkte unter `/api/...` bleiben parallel erhalten.

## Lokale Entwicklung

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Backend-Tests:

```bash
pytest app/tests
```
