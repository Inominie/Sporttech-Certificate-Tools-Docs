---
title: "Dateiimport"
sidebar_position: 4
---

# Dateiimport {/* #file-import */}

Nutze **File Import**, wenn keine Live-Daten verfügbar sind oder du eine exportierte Datei aus dem Wettkampfsystem erhältst.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/event-import.png" alt="Registerkarte File Import im Bereich Event mit einem geladenen Sporttech-Excel-Export" />
  <figcaption>Nach einem Dateiimport bestätigt die Statusleiste Quelldatei, Quellentyp, erkannte Wettkampfklassen, Anzahl der Warnungen und ausgewählte Vorlage.</figcaption>
</figure>

## Unterstützter Dateityp {/* #supported-file-type */}

Die aktuelle Beta unterstützt Sporttech-Excel-Exporte.

Ein direkter Import von `event.j3` ist geplant, aber noch nicht umgesetzt.

## Eine Datei importieren {/* #import-a-file */}

1. Öffne **Event**.
2. Wähle **File Import**.
3. Klicke auf **Import File**.
4. Wähle den Sporttech-Excel-Export aus.
5. Prüfe den Importstatus und die Warnungen.

## Importierte Daten ersetzen {/* #replacing-imported-data */}

Wenn du eine andere Datei importierst, ersetzt sie die aktiven importierten Daten. Gespeicherte Vorlagen werden dabei nicht gelöscht.

Erhältst du einen korrigierten Wettkampfexport, importiere die korrigierte Datei und wiederhole die Prüfung in Quick Check.
