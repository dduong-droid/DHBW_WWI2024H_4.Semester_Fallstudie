# Food4Recovery

Digitale Health-/Recovery-Anwendung für eine DHBW-Fallstudie. Food4Recovery unterstützt einen demo-tauglichen Nachsorge-Flow mit Patientendaten, Dokumenten-/Intake-Strecke, regelbasierter Analyse, Ernährungsplänen, Rezepten, Meal-Kits, Bestellung und Tracking.

## Projektordner

- `frontend/` für UI, Screens und spätere Mockdaten. Enthält das Next.js MVP.
- `backend/` für API, Fachlogik und Verarbeitung
- `infra/` für Datenbank und technische Infrastruktur
- `shared/` für gemeinsame Contracts und Absprachen
- `docs/` für Architektur, Setup und Projektdokumentation
- `AGENTS.md` für dauerhafte Codex-Projektregeln

---

## 🏗 Frontend Architektur (MVP)

Das Repository enthält ein Next.js-Frontend, das im **Frontend-Driven Development** Ansatz aus UI-Designs in eine modulare, API-ready React-Architektur überfuehrt wurde.

### Die Architektur-Ziele
1. **Frontend-Driven:** Frontend-nahe View-Models und Mock-Daten liegen in `frontend/src/services/mockApi.ts` und `frontend/src/types/apiContracts.ts`. Das echte Backend kann schrittweise an die BFF-Contracts angeschlossen werden.
2. **Next.js App Router mit Client-Screens:** Einsatz des dateibasierten App Routers. Interaktive Screens wie Dashboard, Onboarding, Profil und Checkout laufen als Client Components und laden Daten zentral über `recoveryApi`/`apiClient`; das Backend-BFF wird bevorzugt, `mockApi` bleibt Demo-Fallback.
3. **Apple Human Interface Guidelines (HIG):** Wir haben alle TailwindCSS-Fragmente aus den Design-Skizzen verbannt und auf stark gekapselte **Vanilla CSS Module** (`page.module.css`) umgestellt. Damit gewährleisten wir ein sauberes, wartbares Glassmorphism-UI, konsistente Abstände und perfekte Render-Performance ohne CSS-Framework-Überhang.
4. **Health-Tech-Safety:** UI-Texte sollen Orientierung geben, aber keine Diagnose, Heilversprechen oder medizinische Freigabe formulieren.

### 📂 Code-Struktur & Flow

Die Anwendung gliedert sich klassisch in **drei Architekturschichten**:

#### 1. Das Fundament: Verträge & Typen (`frontend/src/types/apiContracts.ts`)
`apiContracts.ts` enthält aktuell schlanke frontend-nahe Typen. Weitere View-Models liegen in `frontend/src/services/mockApi.ts`, solange die UI noch über Mock-Daten läuft. Für backendnahe Absprachen ist `shared/api_contracts.md` die operative Übersicht.

#### 2. Die Brücke: BFF-Adapter mit Mock-Fallback (`frontend/src/services/apiClient.ts`)
Der zentrale Demo-Flow nutzt das FastAPI-Backend über `/api/frontend/...`, `/api/patient-profile/...` und `/api/orders`.
- `NEXT_PUBLIC_API_BASE_URL` zeigt lokal standardmaessig auf `http://127.0.0.1:8000`.
- `NEXT_PUBLIC_API_KEY` kann für den lokalen Demo-API-Key genutzt werden, ist im Browser sichtbar und kein echtes Secret.
- `frontend/src/services/mockApi.ts` bleibt als klarer Demo-/Fallback-Pfad aktiv, falls das Backend nicht erreichbar ist.
- `NEXT_PUBLIC_DISABLE_MOCK_FALLBACK=true` schaltet den harten Integrationsmodus ein: API-Fehler werden nicht still durch Mockdaten ersetzt.
- Das Backend erlaubt lokale Browser-Requests standardmaessig von `http://127.0.0.1:3000` und `http://localhost:3000`; bei Bedarf kann `FRONTEND_ORIGINS` als kommaseparierte Liste gesetzt werden.

#### 3. Das UI: Routen & Views (`frontend/src/app/`)
Wir setzen auf den modernen Next.js App Router (Dateisystembasiertes Routing):

- **`/login`**: Arbeitet völlig unabhängig. Ein bewusster Demo-Gatekeeper ohne API-Anbindung, der den Nutzer in den Flow leitet.
- **`/onboarding`**: Fuehrt die Demo-Analyse über `POST /api/frontend/intake/full-analyze` aus und fällt bei Backend-Ausfall auf Mock-Daten zurück.
- **`/analysis`, `/dashboard`, `/recipes`, `/shop`, `/profile`, `/checkout`**: Nutzen Backend-BFF beziehungsweise Backend-APIs mit Mock-/Demo-Fallback. `/login` bleibt ein bewusster lokaler Demo-Gatekeeper.

### 🎨 Styling-Philosophie (CSS Modules statt Tailwind)
Ein Großteil der Migration bestand darin, unzusammenhängende Tailwind-Klassen in logische DOM-Elemente zu refactoren:
- `globals.css` kümmert sich um die globale Typografie (System-Fonts, Fallback auf `Manrope`), definiert die Primary Color (`#33c758`) über saubere CSS Variablen und deklariert das globale Utility für den `.glass` Filter (Apple HIG Glassmorphism).
- Jede Next.js Page (`page.tsx`) erhält ihr exklusives `page.module.css`. So ist es ausgeschlossen, dass Stile (z.B. vom Button im Dashboard) versehentlich das Layout im Dokumenten-Upload zerschießen (Scoping by Design).

## Lokale Befehle

Frontend:

```bash
cd frontend
npm install
npm run dev
npm run build
npx tsc --noEmit
npm run lint
```

Hinweis: Es gibt aktuell kein `npm run test` und kein `npm run typecheck`; der manuelle Typecheck läuft über `npx tsc --noEmit`.

Backend:

```bash
cd backend
.venv\Scripts\python.exe -m pip install -e .
.venv\Scripts\python.exe scripts\seed\seed_demo_data.py --reset
.venv\Scripts\python.exe -m pytest app/tests
```

Der vollständige reproduzierbare Demo-Start inklusive Smoke-Checks ist in `docs/reports/dev2-dev3-final-readiness.md` dokumentiert.

## Design-Referenzen

Exportierte Design-Screens liegen unter `docs/designs/*/screen.png`. Bei Frontend-Aufgaben zuerst diese PNGs analysieren und neue Screens im gleichen Stil ergänzen.
