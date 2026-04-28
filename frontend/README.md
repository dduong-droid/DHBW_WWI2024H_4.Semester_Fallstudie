# Food4Recovery Frontend

Next.js-Frontend fuer das Food4Recovery MVP. Die App nutzt den Next.js App Router, React 19, TypeScript, CSS Modules und `lucide-react`.

## Struktur

- `src/app/`: Routen und Pages fuer Startseite, Login, Onboarding, Dashboard, Profil, Rezepte, Shop und Checkout.
- `src/components/`: wiederverwendbare UI-Komponenten wie Warenkorb, Meal-Kit-Modal und kuratierte Meal-Cards.
- `src/context/`: React Context, aktuell fuer den Warenkorb.
- `src/services/mockApi.ts`: Frontend-Mock-API als Adapter fuer spaetere Backend-/BFF-Calls.
- `src/types/apiContracts.ts`: Frontend-nahe API-/View-Model-Typen.
- `public/`: statische Assets.

## Design-Referenzen

Die wichtigsten UI-Referenzen liegen nicht im Frontend-Ordner, sondern unter:

```text
../docs/designs/*/screen.png
```

Bei Frontend-Aufgaben zuerst die passenden PNGs analysieren und Layout, Farben, Cards, Abstaende, Typografie und Tonalitaet daraus ableiten. Fehlende Screens sollen im gleichen Stil ergaenzt werden.

## Mock-API und Backend-Anbindung

Das Frontend arbeitet aktuell ueber `nutritionMockApi` in `src/services/mockApi.ts`.

Wichtige Methoden:

- `fetchDashboardData()`
- `fetchShopInventory()`
- `fetchMealKit(id)`
- `fetchCuratedMeals()`
- `fetchPatientProfile()`
- `savePatientProfile(profile)`

Die Kommentare in `mockApi.ts` zeigen die spaeter vorgesehenen Backend-/BFF-Endpunkte, z. B. `/api/frontend/nutrition-plan/{patient_id}`, `/api/frontend/shop/inventory` und `/api/patient-profile/{patient_id}`.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

Aktueller Stand:

- `npm run build` funktioniert.
- Manueller Typecheck funktioniert mit `npx tsc --noEmit`.
- Es gibt kein `npm run test`.
- Es gibt kein `npm run typecheck`.
- `npm run lint` ist aktuell bekannt rot, weil `next lint` mit der vorhandenen Next-/ESLint-Kombination ungueltige ESLint-Optionen uebergibt.

## Lokale Entwicklung

```bash
cd frontend
npm install
npm run dev
```

Standard-URL:

```text
http://localhost:3000
```

Wenn PowerShell `npm.ps1` blockiert, `npm.cmd` verwenden:

```powershell
npm.cmd run dev
```

## Health-Tech-Hinweise

- Keine echten Patientendaten hardcoden.
- Mock-Daten klar als Mock behandeln.
- Keine Diagnosen, Heilversprechen oder medizinische Freigaben formulieren.
- Empfehlungen vorsichtig als Orientierung formulieren und nicht als Ersatz fuer aerztliche Beratung darstellen.
