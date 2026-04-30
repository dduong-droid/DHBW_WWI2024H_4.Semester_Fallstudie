# Food4Recovery

Digitale Health-/Recovery-Anwendung fuer eine DHBW-Fallstudie. Food4Recovery unterstuetzt einen demo-tauglichen Nachsorge-Flow mit Patientendaten, Dokumenten-/Intake-Strecke, regelbasierter Analyse, Ernaehrungsplaenen, Rezepten, Meal-Kits, Bestellung und Tracking.

## Projektordner

- `frontend/` fuer UI, Screens und spaetere Mockdaten. Enthält das Next.js MVP.
- `backend/` fuer API, Fachlogik und Verarbeitung
- `infra/` fuer Datenbank und technische Infrastruktur
- `shared/` fuer gemeinsame Contracts und Absprachen
- `docs/` fuer Architektur, Setup und Projektdokumentation
- `AGENTS.md` fuer dauerhafte Codex-Projektregeln

---

## 🏗 Frontend Architektur (MVP)

Das Repository enthaelt ein Next.js-Frontend, das im **Frontend-Driven Development** Ansatz aus UI-Designs in eine modulare, API-ready React-Architektur ueberfuehrt wurde.

### Die Architektur-Ziele
1. **Frontend-Driven:** Frontend-nahe View-Models und Mock-Daten liegen in `frontend/src/services/mockApi.ts` und `frontend/src/types/apiContracts.ts`. Das echte Backend kann schrittweise an die BFF-Contracts angeschlossen werden.
2. **Next.js App Router (Server Components):** Einsatz eines modernen Datenflusses. Im Dashboard rufen wir die Daten asynchron direkt in der `page.tsx` ab (Server Component), um den Code schlanker zu machen und das Laden im Client zu optimieren.
3. **Apple Human Interface Guidelines (HIG):** Wir haben alle TailwindCSS-Fragmente aus den Design-Skizzen verbannt und auf stark gekapselte **Vanilla CSS Module** (`page.module.css`) umgestellt. Damit gewährleisten wir ein sauberes, wartbares Glassmorphism-UI, konsistente Abstände und perfekte Render-Performance ohne CSS-Framework-Überhang.
4. **Health-Tech-Safety:** UI-Texte sollen Orientierung geben, aber keine Diagnose, Heilversprechen oder medizinische Freigabe formulieren.

### 📂 Code-Struktur & Flow

Die Anwendung gliedert sich klassisch in **drei Architekturschichten**:

#### 1. Das Fundament: Verträge & Typen (`frontend/src/types/apiContracts.ts`)
`apiContracts.ts` enthaelt aktuell schlanke frontend-nahe Typen. Weitere View-Models liegen in `frontend/src/services/mockApi.ts`, solange die UI noch ueber Mock-Daten laeuft. Fuer backendnahe Absprachen ist `shared/api_contracts.md` die operative Uebersicht.

#### 2. Die Bruecke: Die API-Simulation (`frontend/src/services/mockApi.ts`)
Hier sitzt der Adapter, der die fehlende Infrastruktur emuliert.
- Er greift die Interface-Verträge auf und füllt sie mit Mocking-Daten.
- Durch `setTimeout()` simulieren wir realistische Netzwerk-Traegheit.
- Wichtige Methoden sind `fetchDashboardData()`, `fetchShopInventory()`, `fetchMealKit(id)`, `fetchCuratedMeals()`, `fetchPatientProfile()` und `savePatientProfile(profile)`.
- Sobald das echte Backend online geht, kann der Adapter schrittweise auf `/api/frontend/...` und `/api/patient-profile/...` umgestellt werden.

#### 3. Das UI: Routen & Views (`frontend/src/app/`)
Wir setzen auf den modernen Next.js App Router (Dateisystembasiertes Routing):

- **`/login`**: Arbeitet völlig unabhängig. Ein bewusster Demo-Gatekeeper ohne API-Anbindung, der den Nutzer in den Flow leitet.
- **`/onboarding`**: Behandelt den Drag-and-Drop Part. Eine kleine React Zustand-Ablaufsteuerung simuliert 2 Sekunden lang einen KI-Analyse-Prozess des Arztbriefs (PDF) und schleust den Nutzer danach weiter.
- **`/dashboard` & `/shop`**: Das sind die Vorzeige-Komponenten der Architektur. Das Dashboard nutzt `await nutritionMockApi.fetchDashboardData()`, der Shop nutzt `await nutritionMockApi.fetchShopInventory()`.

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

Hinweis: Es gibt aktuell kein `npm run test` und kein `npm run typecheck`; der manuelle Typecheck laeuft ueber `npx tsc --noEmit`.

Backend:

```bash
cd backend
.venv\Scripts\python.exe -m pip install -e .
.venv\Scripts\python.exe -m pytest app/tests
```

## Design-Referenzen

Exportierte Design-Screens liegen unter `docs/designs/*/screen.png`. Bei Frontend-Aufgaben zuerst diese PNGs analysieren und neue Screens im gleichen Stil ergaenzen.
