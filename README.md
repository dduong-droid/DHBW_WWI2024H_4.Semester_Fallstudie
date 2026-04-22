# Food 4 Recovery

Fallstudie Food4Recovery mit Frontend-, Backend-, Infra-, Shared- und Docs-Struktur.

## Projektordner

- `frontend/` fuer UI, Screens und spaetere Mockdaten. Enthaelt das Next.js MVP.
- `backend/` fuer API, Fachlogik und Verarbeitung
- `infra/` fuer Datenbank und technische Infrastruktur
- `shared/` fuer gemeinsame Contracts und Absprachen
- `docs/` fuer Architektur, Setup und Projektdokumentation

## Projektkontext

Die inhaltliche Kurzreferenz zur Geschaeftsidee und zum aktuellen Zielbild liegt hier:

- [project_context.md](/C:/Code/Fallstudie/DHBW_WWI2024H_4.Semester_Fallstudie/docs/project_context.md)

---

## Frontend Architektur (MVP)

Willkommen zur Codebase des **Food 4 Recovery** MVPs. Dieses Repository enthaelt das Next.js Frontend, welches im **Frontend-Driven Development** Ansatz aus rohen UI-Designs in eine modulare, API-ready React Architektur ueberfuehrt wurde.

### Die Architektur-Ziele

1. **Frontend-Driven:** Noch bevor serverseitiger Backend-Code geschrieben wurde, haben wir das gesamte Datenmodell im Frontend ueber strenge Schnittstellen ("Contracts") definiert. Dies verhinderte Blockaden.
2. **Next.js App Router (Server Components):** Einsatz eines modernen Datenflusses. Im Dashboard rufen wir die Daten asynchron direkt in der `page.tsx` ab (Server Component), um den Code schlanker zu machen und das Laden im Client zu optimieren.
3. **Apple Human Interface Guidelines (HIG):** Wir haben alle TailwindCSS-Fragmente aus den Design-Skizzen verbannt und auf stark gekapselte **Vanilla CSS Module** (`page.module.css`) umgestellt. Damit gewaehrleisten wir ein sauberes, wartbares Glassmorphism-UI, konsistente Abstaende und perfekte Render-Performance ohne CSS-Framework-Ueberhang.

### Code-Struktur & Flow

Die Anwendung gliedert sich klassisch in **drei Architekturschichten**:

#### 1. Das Fundament: Vertraege & Typen (`frontend/src/types/apiContracts.ts`)

Dies ist unsere einzige Wahrheit (*Source of Truth*). Wenn das echte Backend gebaut wird, **muss** es uns das hier definierte JSON-Format fuer den Ernaehrungsplan (`NutritionPlan`) und das E-Commerce-Inventar (`ShopInventory`) zurueckgeben.
Dadurch weiss unser UI im Voraus exakt, wie das Backend mit uns spricht.

#### 2. Die Bruecke: Die API-Simulation (`frontend/src/services/mockApi.ts`)

Hier sitzt der Adapter, der die fehlende Infrastruktur emuliert.
- Er greift die Interface-Vertraege auf und fuellt sie mit Mocking-Daten.
- Durch `setTimeout()` simulieren wir realistische Netzwerk-Traegheit (1,5 Sekunden).
- Sobald das echte Backend online geht, tauschen wir in dieser einen Datei lediglich die Fake-Zuweisung durch ein `fetch('https://api...')` aus. **Im Frontend (in den React Komponenten) muss dafuer spaeter keine einzige Zeile geaendert werden.**

#### 3. Das UI: Routen & Views (`frontend/src/app/`)

Wir setzen auf den modernen Next.js App Router (Dateisystembasiertes Routing):

- **`/login`**: Arbeitet voellig unabhaengig. Ein bewusster Demo-Gatekeeper ohne API-Anbindung, der den Nutzer in den Flow leitet.
- **`/onboarding`**: Behandelt den Drag-and-Drop Part. Eine kleine React Zustand-Ablaufsteuerung simuliert 2 Sekunden lang einen KI-Analyse-Prozess des Arztbriefs (PDF) und schleust den Nutzer danach weiter.
- **`/dashboard`** und **`/shop`**: Das sind die Vorzeige-Komponenten der Architektur. Es handelt sich um **Server Components**. Sie rufen `await nutritionMockApi.getNutritionPlan(...)` auf. Der Server baut also das Markup sofort unter Einbeziehung der Naehrstoffdaten auf, bevor die Route am Endgeraet ueberhaupt ankommt. Das garantiert ein stabiles Layoutverhalten ganz ohne springende UI-Elemente.

### Styling-Philosophie (CSS Modules statt Tailwind)

Ein Grossteil der Migration bestand darin, unzusammenhaengende Tailwind-Klassen in logische DOM-Elemente zu refactoren:
- `globals.css` kuemmert sich um die globale Typografie (System-Fonts, Fallback auf `Manrope`), definiert die Primary Color (`#33c758`) ueber saubere CSS-Variablen und deklariert das globale Utility fuer den `.glass` Filter (Apple HIG Glassmorphism).
- Jede Next.js Page (`page.tsx`) erhaelt ihr exklusives `page.module.css`. So ist es ausgeschlossen, dass Stile versehentlich andere Bereiche beeinflussen (Scoping by Design).
