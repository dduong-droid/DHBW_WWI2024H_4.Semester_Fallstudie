# Backend

Backend scaffold fuer Food 4 Recovery.

## Ziel

Dieser Bereich enthaelt spaeter:

- API und Routing
- Fachlogik fuer Intake und Empfehlungen
- Datenbankanbindung
- Integrationen und Tests

## Aktueller Stand

Aktuell ist nur das minimale API-Grundgeruest vorhanden:

- FastAPI-Einstiegspunkt
- zentraler API-Router
- einfacher Health-Check unter `/health`

Die fachlichen Module sind strukturell vorbereitet, aber noch nicht implementiert.

## Lokaler Start

Beispiel:

```bash
uvicorn app.main:app --reload
```
