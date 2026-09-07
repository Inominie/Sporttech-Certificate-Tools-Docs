---
title: "Überblick: Wettkampfdaten importieren"
sidebar_position: 1
---

# Überblick: Wettkampfdaten importieren {/* #event-import-overview */}

Im Bereich **Event** lädst du Wettkampfdaten in das aktive Projekt. Es ist immer nur eine importierte Quelle gleichzeitig aktiv.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/event-import.png" alt="Bereich Event mit ausgewähltem Dateiimport und geladenen Sporttech-Beispieldaten" />
  <figcaption>Event zeigt die Quellenauswahl, den aktuellen Quellenstatus, die Anzahl der Wettkampfklassen, Warnungen und den Zustand der aktiven Vorlage.</figcaption>
</figure>

## Arten von Datenquellen {/* #source-types */}

| Quelle | Geeignet, wenn … |
| --- | --- |
| **Online URL** | der Wettkampf über die Sporttech-Online-Ergebnisse verfügbar ist. |
| **Offline OVS** | auf dem Wettkampfrechner ein OVS-Server im lokalen Netzwerk läuft. |
| **File Import** | ein Sporttech-Excel-Export als Datei vorliegt. |

## Importstatus {/* #import-status */}

Nach dem Import zeigt die Statusleiste:

- Die Bezeichnung der aktuellen Quelle.
- Den Quellentyp und die URL oder den Dateipfad der Quelle.
- Die Anzahl erkannter Wettkampfklassen und druckbarer Wettkampfeinträge.
- Warnungen und manuelle Korrekturen.
- Den Status der aktiven Vorlage.

## Daten aktualisieren {/* #refreshing-data */}

Aktualisiere die Daten, wenn sie sich nach dem ersten Import ändern. Für Online-Quellen und lokale Live-Quellen steht auch eine automatische Aktualisierung zur Verfügung.

Bei Dateiimporten greift die Aktualisierung auf die bereits geladenen Dateidaten zurück. Wenn du einen neueren Export erhältst, musst du diese neue Datei importieren.
