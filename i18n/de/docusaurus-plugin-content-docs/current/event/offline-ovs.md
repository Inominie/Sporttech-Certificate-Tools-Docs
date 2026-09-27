---
title: "Lokale OVS-Server"
sidebar_position: 3
---

# Lokale OVS-Server {/* #offline-ovs-servers */}

Verwenden Sie **Offline OVS**, wenn Sporttech OVS im lokalen Wettkampfnetzwerk läuft und HTTP-Daten über Port `9002` bereitstellt.

## Einen lokalen Server finden {/* #discover-a-local-server */}

1. Verbinden Sie den Computer mit demselben lokalen Netzwerk wie den OVS-Server.
2. Öffnen Sie **Event**.
3. Wählen Sie **Offline OVS**.
4. Klicken Sie auf **OVS-Server suchen**.
5. Wählen Sie einen der gefundenen Server aus.

Bei gefundenen Servern werden der Wettkampftitel, die Basis-URL und die Anzahl der Performances, Competitions, Stages und Frames angezeigt.

## Eine bekannte URL eingeben {/* #enter-a-known-url */}

Falls die Suche den Server nicht findet, geben Sie die OVS-Basis-URL manuell ein, zum Beispiel:

```text
http://192.168.1.20:9002/
```

Klicken Sie anschließend auf **Offline OVS importieren**.

## Lokale Daten aktualisieren {/* #refresh-offline-data */}

Aktualisieren Sie den ausgewählten lokalen Server über das Symbol in der Kopfzeile aus jedem Bereich, auch dem Studio. Die [Auto-Aktualisierung](auto-refresh.md) ist standardmäßig aktiv und wird in den Einstellungen konfiguriert. Eine Aktualisierung desselben Events erhält Urkundenkorrekturen. Der Server muss erreichbar bleiben; bei einem Fehler bleiben die bisherigen Daten verfügbar und eine Fehlermeldung erscheint.

Ein direkter Import von `event.j3` ist derzeit nicht verfügbar. Verwenden Sie stattdessen den laufenden OVS-Server oder einen Sporttech-Excel-Export.
