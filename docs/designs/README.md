# Design Artefakte

Diese Sammlung enthält exportierte UI-Artefakte für `Food 4 Recovery`.
Jeder Screen liegt in der Regel in einem eigenen Ordner und besteht aus:

- `code.html`: exportierter HTML-Code
- `screen.png`: exportierter Screenshot

## Namenskonvention

- Ordnernamen bleiben flach unter `docs/designs/`
- Slugs sind ASCII-basiert und in `snake_case`
- Umlaute werden normalisiert, zum Beispiel `ae`, `oe`, `ue`
- Wenn ein bereinigter Name mit einem bereits vorhandenen Screen kollidiert, bleibt die aeltere Variante mit dem Suffix `_alt` erhalten

## Aktueller Stand

- Die frueheren `food_4_recovery_*`-Praefixe wurden aus den Screen-Ordnernamen entfernt.
- Historische Duplikate bleiben nur dort erhalten, wo sie für Rückverfolgung oder Vergleich nötig sind.
- Neuere Stitch-Exporte sind im Manifest dokumentiert.

## Stitch Manifest

- [stitch_manifest.json](stitch_manifest.json)

## Wichtige Screen-Ordner

- `startseite`
- `onboarding_start`
- `scan_analyse`
- `dokumenten_upload_pdf`
- `empfehlung_wochenplan`
- `dashboard_mit_makro_verteilung`
- `essenpakete_shop`
- `bestellübersicht`
- `bestellbestaetigung`
- `produktdetails_wundheilungs_box`
- `produktdetails_onko_box`
- `produktdetails_vitality_box`
- `produktdetails_darm_balance_box`
- `produktdetails_immun_boost_box`

## Hinweis

Einige aeltere Imports enthalten keine oder nur unvollständige `<title>`-Metadaten in `code.html`.
Die Ordnernamen sind deshalb die verlaesslichste Referenz für die Zuordnung.
