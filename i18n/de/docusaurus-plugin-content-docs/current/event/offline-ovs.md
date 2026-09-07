---
sidebar_position: 3
---

# Lokale OVS-Server {/* #offline-ovs-servers */}

Nutze **Offline OVS**, wenn Sporttech OVS im lokalen Wettkampfnetzwerk läuft und HTTP-Daten über Port `9002` bereitstellt.

## Einen lokalen Server finden {/* #discover-a-local-server */}

1. Verbinde den Computer mit demselben lokalen Netzwerk wie den OVS-Server.
2. Öffne **Event**.
3. Wähle **Offline OVS**.
4. Klicke auf **Discover OVS Server**.
5. Wähle einen der gefundenen Server aus.

Bei gefundenen Servern werden der Wettkampftitel, die Basis-URL und die Anzahl der Performances, Competitions, Stages und Frames angezeigt.

## Eine bekannte URL eingeben {/* #enter-a-known-url */}

Falls die Suche den Server nicht findet, gib die OVS-Basis-URL manuell ein, zum Beispiel:

```text
http://192.168.1.20:9002/
```

Klicke anschließend auf **Import Offline OVS**.

## Lokale Daten aktualisieren {/* #refresh-offline-data */}

Klicke auf **Refresh Offline Data**, um die neuesten Daten vom ausgewählten lokalen Server zu laden.

Ein direkter Import von `event.j3` ist derzeit nicht verfügbar. Nutze stattdessen den laufenden OVS-Server oder einen Sporttech-Excel-Export.
