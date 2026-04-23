# Food 4 Recovery

Minimale Root-Struktur fuer das Hochschulprojekt.

## Projektordner

- `frontend/` fuer UI, Screens und spaetere Mockdaten. Enthält das Next.js MVP.
- `backend/` fuer API, Fachlogik und Verarbeitung
- `infra/` fuer Datenbank und technische Infrastruktur
- `shared/` fuer gemeinsame Contracts und Absprachen
- `docs/` fuer Architektur, Setup und Projektdokumentation

---

## 🏗 Frontend Architektur (MVP)

Willkommen zur Codebase des **Food 4 Recovery** MVPs. Dieses Repository enthält das Next.js Frontend, welches im **Frontend-Driven Development** Ansatz aus rohen UI-Designs in eine modulare, API-ready React Architektur überführt wurde.

### Die Architektur-Ziele
1. **Frontend-Driven:** Noch bevor serverseitiger Backend-Code geschrieben wurde, haben wir das gesamte Datenmodell im Frontend über strenge Schnittstellen ("Contracts") definiert. Dies verhinderte Blockaden.
2. **Next.js App Router (Server Components):** Einsatz eines modernen Datenflusses. Im Dashboard rufen wir die Daten asynchron direkt in der `page.tsx` ab (Server Component), um den Code schlanker zu machen und das Laden im Client zu optimieren.
3. **Apple Human Interface Guidelines (HIG):** Wir haben alle TailwindCSS-Fragmente aus den Design-Skizzen verbannt und auf stark gekapselte **Vanilla CSS Module** (`page.module.css`) umgestellt. Damit gewährleisten wir ein sauberes, wartbares Glassmorphism-UI, konsistente Abstände und perfekte Render-Performance ohne CSS-Framework-Überhang.

### 📂 Code-Struktur & Flow

Die Anwendung gliedert sich klassisch in **drei Architekturschichten**:

#### 1. Das Fundament: Verträge & Typen (`frontend/src/types/apiContracts.ts`)
Dies ist unsere einzige Wahrheit (*Source of Truth*). Wenn das echte Backend gebaut wird, **muss** es uns das hier definierte JSON-Format für den Ernährungsplan (`NutritionPlan`) und das E-Commerce-Inventar (`ShopInventory`) zurückgeben.  
Dadurch weiß unser UI im Voraus exakt, wie das Backend mit uns spricht.

#### 2. Die Brücke: Die API-Simulation (`frontend/src/services/mockApi.ts`)
Hier sitzt der Adapter, der die fehlende Infrastruktur emuliert.
- Er greift die Interface-Verträge auf und füllt sie mit Mocking-Daten.
- Durch `setTimeout()` simulieren wir realistische Netzwerk-Trägheit (1,5 Sekunden). 
- Sobald das echte Backend online geht, tauschen wir in dieser einen Datei lediglich die Fake-Zuweisung durch ein `fetch('https://api...')` aus. **Im Fronted (in den React Komponenten) muss dafür später keine einzige Zeile geändert werden.**

#### 3. Das UI: Routen & Views (`frontend/src/app/`)
Wir setzen auf den modernen Next.js App Router (Dateisystembasiertes Routing):

- **`/login`**: Arbeitet völlig unabhängig. Ein bewusster Demo-Gatekeeper ohne API-Anbindung, der den Nutzer in den Flow leitet.
- **`/onboarding`**: Behandelt den Drag-and-Drop Part. Eine kleine React Zustand-Ablaufsteuerung simuliert 2 Sekunden lang einen KI-Analyse-Prozess des Arztbriefs (PDF) und schleust den Nutzer danach weiter.
- **`/dashboard` & `/shop`**: Das sind die Vorzeige-Komponenten der Architektur. Es handelt sich um **Server Components**.
Sie rufen `await nutritionMockApi.getNutritionPlan(...)` auf. Der Server baut also das Markup sofort unter Einbeziehung der Nährstoffdaten auf, bevor die Route am Endgerät überhaupt ankommt. Das garantiert ein stabiles Layoutverhalten ganz ohne "Springende UI-Elemente".

### 🎨 Styling-Philosophie (CSS Modules statt Tailwind)
Ein Großteil der Migration bestand darin, unzusammenhängende Tailwind-Klassen in logische DOM-Elemente zu refactoren:
- `globals.css` kümmert sich um die globale Typografie (System-Fonts, Fallback auf `Manrope`), definiert die Primary Color (`#33c758`) über saubere CSS Variablen und deklariert das globale Utility für den `.glass` Filter (Apple HIG Glassmorphism).
- Jede Next.js Page (`page.tsx`) erhält ihr exklusives `page.module.css`. So ist es ausgeschlossen, dass Stile (z.B. vom Button im Dashboard) versehentlich das Layout im Dokumenten-Upload zerschießen (Scoping by Design).
