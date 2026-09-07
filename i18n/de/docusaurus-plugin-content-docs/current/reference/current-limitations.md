---
sidebar_position: 1
---

# Aktuelle Einschränkungen {/* #current-limitations */}

Diese Seite beschreibt wichtige Einschränkungen der Beta für den Einsatz im Wettkampf.

## Verteilung {/* #distribution */}

- Die veröffentlichten Versionen sind unsigniert.
- Die App kann nach Beta-Updates suchen, lädt sie aber nicht herunter, installiert sie nicht, startet sich nicht neu und ersetzt sich nicht selbst.
- macOS und Windows können Sicherheits- bzw. Vertrauenswarnungen des Betriebssystems anzeigen.

## Import {/* #import */}

- Ein direkter Import von `event.j3` ist noch nicht umgesetzt.
- Für Offline OVS muss ein lokaler OVS-HTTP-Server erreichbar sein.
- Der Dateiimport ist derzeit auf Sporttech-Excel-Exporte ausgerichtet.

## Drucken {/* #printing */}

- Ein direkter Druck ohne Dialog ist nicht umgesetzt.
- Gespeicherte PDFs werden über die Druckfunktion der App oder das PDF-Programm des Betriebssystems gedruckt.

## Vorlagen {/* #templates */}

- PDF-Vorlagen können als Urkundenhintergründe verwendet werden.
- Der DOCX-Import dient als Kompatibilitätsweg zum Auslesen von Seriendruck-Platzhaltern und einfachen festen Texten.
- Die PDF-Ausgabe wird mit der mitgelieferten Typst-Laufzeitumgebung erzeugt.

## Daten {/* #data */}

Importierte Daten, Vorlagen und erzeugte PDFs sind lokale Nutzerdaten. Gib Support-Pakete oder erzeugte Dateien nicht außerhalb des vorgesehenen Wettkampf- oder Beta-Support-Kontexts weiter.

Details zu Datenlebenszyklus, Speicherlimits, Import, Wertung und Vorlagentreue findest du unter [Verbindliches App-Verhalten](./behavior-contracts.md).
