---
title: "Überblick: Event-Import"
sidebar_position: 1
---

# Überblick: Event-Import {/* #event-import-overview */}

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/event-import.png" alt="Eventseite mit Quellenauswahl und getrennten Aktionen für neue Datei und Aktualisierung" />
  <figcaption>Eine neue Quelle wählen oder das aktuelle Event aktualisieren.</figcaption>
</figure>

## Datenquellen {/* #source-types */}

| Quelle | Verwendung | Aktualisierung |
| --- | --- | --- |
| Online-Sporttech | Das Event ist online verfügbar. | Automatisch oder manuell von Sporttech. |
| Offline-OVS | Ein Sporttech-OVS-Server läuft im lokalen Netzwerk. | Automatisch oder manuell, solange der Server erreichbar ist. |
| Dateiimport | Ein Sporttech-Excel-Export liegt vor. | Aktualisierte Arbeitsmappe über **Aktuelle Datei aktualisieren…** auswählen. |

Siehe [Online-Events](online-event.md), [Offline-OVS](offline-ovs.md) und [Dateiimport](file-import.md).

## Importstatus {/* #import-status */}

Prüfen Sie nach dem Import Eventtitel, Quelle und Zeilenanzahl und öffnen Sie danach Quick Check. Scheitert der Import, bleiben die zuvor geladenen Daten nutzbar; ein Aktualisierungsversuch allein macht sie noch nicht aktuell.

## Daten aktualisieren {/* #refreshing-data */}

Das Aktualisierungssymbol in der Kopfzeile funktioniert in Event, Quick Check, Produzieren und Studio. Es aktualisiert die geladene Quelle und zeigt den Status an. Eine Aktualisierung desselben Events erhält manuelle Urkundenkorrekturen. Das Laden eines anderen Events löscht sie. Bei Excel unterscheiden sich ein neuer Dateiimport und die ausdrückliche Aktualisierung der aktuellen Datei.

Die [Auto-Aktualisierung](auto-refresh.md) ist für Online- und OVS-Quellen standardmäßig aktiviert; Excel-Dateien müssen manuell ausgewählt werden.
