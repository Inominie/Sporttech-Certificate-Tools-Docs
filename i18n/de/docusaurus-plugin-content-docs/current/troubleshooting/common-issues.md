---
title: "Häufige Probleme"
sidebar_position: 1
---

# Häufige Probleme {/* #common-issues */}

## Die App startet leer {/* #the-app-opens-empty */}

Das ist nach einer Neuinstallation normal. Importiere unter **Event** Wettkampfdaten und wähle oder erstelle unter **Certificate Studio** eine Vorlage.

## macOS blockiert die App {/* #macos-blocks-the-app */}

Die Beta ist unsigniert. Öffne **Systemeinstellungen > Datenschutz & Sicherheit** und erlaube den Start der App, sofern die Version aus einer vertrauenswürdigen Projektquelle stammt.

## Windows SmartScreen wird angezeigt {/* #windows-smartscreen-appears */}

Das Beta-Installationsprogramm ist unsigniert. Wähle **Weitere Informationen > Trotzdem ausführen** nur dann, wenn es aus einer vertrauenswürdigen Projektquelle stammt.

## Die lokale OVS-Suche findet keinen Server {/* #offline-ovs-discovery-finds-nothing */}

Prüfe Folgendes:

- Der Computer ist im selben lokalen Netzwerk wie der OVS-Server.
- Der OVS-Server läuft.
- Port `9002` ist erreichbar.
- Die lokalen Firewall-Regeln erlauben die Verbindung.

Falls die Suche weiterhin erfolglos bleibt, gib die OVS-Basis-URL manuell ein.

## Preview PDF ist nicht verfügbar {/* #preview-pdf-is-unavailable */}

Prüfe Folgendes:

- Wettkampfdaten wurden importiert.
- Für die Urkundenausgabe ist eine Urkundenvorlage aktiv.
- Der ausgewählte Umfang enthält druckbare Zeilen.
- Der Typst-Renderer ist funktionsfähig.

## Der gedruckte Inhalt ist verschoben {/* #printed-content-is-shifted */}

Nutze die Druckkalibrierung und prüfe, ob der Drucker die PDF-Datei unerwartet skaliert.

## Eine gespeicherte PDF-Datei ist bereits vorhanden {/* #a-saved-pdf-already-exists */}

Bei einem Namenskonflikt wähle **Save copy**, um die vorhandene Datei zu behalten und eine Kopie zu speichern. Mit **Overwrite** ersetzt du die vorhandene Datei.
