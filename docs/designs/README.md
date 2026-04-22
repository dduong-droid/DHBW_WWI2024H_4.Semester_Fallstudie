# Design Artefakte

Diese Sammlung enthaelt exportierte UI-Artefakte fuer `Food 4 Recovery`.
Jeder Screen liegt in einem eigenen Ordner und besteht in der Regel aus:

- `code.html`: exportierter HTML-Code
- `screen.png`: exportierter Screenshot

## Namenskonvention

- Ordnernamen bleiben flach unter `docs/designs/`
- Slugs sind ASCII-basiert und in `snake_case`
- Umlaute werden normalisiert, z. B. `ae`, `oe`, `ue`
- Wenn ein bereinigter Name mit einem bereits vorhandenen Screen kollidiert, bleibt die aeltere Variante mit dem Suffix `_alt` erhalten

## Bereinigte Ordnernamen

- Aeltere Slugs mit kaputten Umlauten oder gemischten Sprachen wurden vereinheitlicht
- Alle Screen-Ordner tragen jetzt nur noch den eigentlichen Screen-Namen
- Historische Duplikate bleiben, falls noetig, mit dem Suffix `_alt` erhalten

## Stitch Manifest

Die neueren Stitch-Exporte sind im Manifest dokumentiert:

- [stitch_manifest.json](/C:/Code/Fallstudie/DHBW_WWI2024H_4.Semester_Fallstudie/docs/designs/stitch_manifest.json)

## Wichtige Screen-Ordner

- `startseite`
- `onboarding_start`
- `scan_analyse`
- `dokumenten_upload_pdf`
- `empfehlung_wochenplan`
- `dashboard_mit_makro_verteilung`
- `essenpakete_shop`
- `bestelluebersicht`
- `bestellbestaetigung`
- `produktdetails_wundheilungs_box`
- `produktdetails_onko_box`
- `produktdetails_vitality_box`
- `produktdetails_darm_balance_box`
- `produktdetails_immun_boost_box`

## Hinweis

Einige aeltere Imports enthalten keine oder nur unvollstaendige `<title>`-Metadaten in `code.html`. Die Ordnernamen sind deshalb die verlässlichste Referenz fuer die Zuordnung.
