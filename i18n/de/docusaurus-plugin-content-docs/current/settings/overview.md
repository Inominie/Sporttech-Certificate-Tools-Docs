---
title: "Überblick: Einstellungen"
sidebar_position: 1
---

# Überblick: Einstellungen {/* #settings-overview */}

Unter **Settings** findest du Funktionen, die nicht zum normalen Wettkampfablauf gehören.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/settings-diagnostics.png" alt="Bereich Settings mit Importverhalten, Korrektureinstellungen, Kalibrierung, Studio-Zugriff und Support-Paketen" />
  <figcaption>Settings bündelt seltener benötigte Import- und Korrektureinstellungen, Kalibrierung, Vorlagenzugriff und Support-Werkzeuge getrennt vom Hauptablauf.</figcaption>
</figure>

Die Einstellungen umfassen:

- Prüfung auf Beta-Updates.
- Verhalten beim Live-Import.
- Verhalten bei Prüfdatenkorrekturen.
- Speicherlimits für erzeugte Ausgaben.
- Standardwerte für die Druckkalibrierung.
- Zugriff auf Certificate Studio.
- Beta-Diagnosefunktionen.
- Laufzeitpfade.

Die meisten Einstellungen werden automatisch gespeichert.

## Prüfung auf Beta-Updates {/* #beta-update-checks */}

Die App prüft, ob die installierte Beta dem öffentlichen Beta-Manifest entspricht. Sie lädt die Anwendung nicht herunter, installiert oder ersetzt sie nicht und startet sie auch nicht neu.

Der manuelle Update-Ablauf ist unter [Nach Updates suchen](./checking-for-updates.md) beschrieben.

## Laufzeitpfade {/* #runtime-paths */}

Die Laufzeitpfade zeigen, wo die App aktive Projektdaten, erzeugte PDFs, Vorschauen, gespeicherte Gruppen-PDFs, Nachdrucke, Vorlagen und importierte Daten ablegt.

Nutze diese Pfade, wenn du lokale Ausgaben finden oder Diagnosedateien prüfen möchtest.

Das vollständige Verhalten des aktiven Projekts und die Speicherlimits für erzeugte Ausgaben findest du unter [Verbindliches App-Verhalten](../reference/behavior-contracts.md).
