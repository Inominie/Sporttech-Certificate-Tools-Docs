---
title: "Aktuelle Einschränkungen"
sidebar_position: 1
---

# Aktuelle Einschränkungen {/* #current-limitations */}

## Verteilung {/* #distribution */}

Die App ist eine Beta für testende Vereine. Aktuelle Mac-Versionen sind mit Developer ID signiert und notarisiert. Windows-Installer bleiben unsigniert und können SmartScreen oder organisatorische Einschränkungen auslösen. Verwenden Sie die [offizielle Downloadseite](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/de/download) und die [Updateanleitung](../settings/checking-for-updates.md).

## Import {/* #import */}

Eventquellen sind Sporttech online, lokales OVS und Sporttech-Excel-Exporte. Direkter OVS-Datenbankimport und andere Wettkampfanbieter werden derzeit nicht unterstützt. Online-Events benötigen Internetzugang; OVS benötigt Zugriff auf seinen lokalen Server. Excel-Aktualisierungen erfordern eine vom Benutzer ausgewählte, neu exportierte Arbeitsmappe.

## Drucken {/* #printing */}

PDF- und Druckerskalierung können die Ausrichtung beeinflussen. Testen Sie vor einem Stapel das tatsächliche Papier und den Drucker. Referenzgrafiken für vorgedrucktes Papier fehlen im PDF selbst und werden nicht erst beim Drucken ausgeblendet.

Automatische Teamanzahlen benötigen eine nutzbare Mitgliederanzahl oder einen ausdrücklich eingegebenen Wert. Automatische Exemplare wiederholen dieselbe Teamurkunde. Aus der Übergabe an das Betriebssystem lässt sich kein physischer Druckerfolg ableiten.

## Vorlagen {/* #templates */}

Der direkte Word-Musterimport benötigt LibreOffice; ein PDF-Export aus Word umgeht diese Abhängigkeit. Der PDF-Musterimport verwendet die erste Seite und ist nicht verlustfrei. Für gescannte Texte gibt es keine OCR, und manche Grafiken bleiben Bilder statt bearbeitbare Texte.

Vorlagen erraten Sporttech-Zuordnungen nicht automatisch. Schriften können sich zwischen Computern unterscheiden. Ersetzen Sie fehlende Schriften und prüfen Sie nach der Übertragung das Layout. Layoutboxen ordnen Texte einspaltig an und können nicht beliebig viel Inhalt aufnehmen; Überläufe müssen vor der Ausgabe behoben werden.

Übertragbare Studio-Pakete unterstützen die Migration unterstützter historischer Formate. Eine ältere App kann neuere Pakete zurückweisen. Bewahren Sie Exportsicherungen auf und aktualisieren Sie bei Bedarf die empfangende App.

## Daten {/* #data */}

Sporttech bleibt für Wertung und Gruppen maßgeblich. Urkundenkorrekturen gelten nur für die Sitzung, auch wenn sie eine Aktualisierung desselben Events überstehen. Neustart oder Eventwechsel löscht sie. Gespeicherte Vorlagen sowie gespeicherte/gedruckte PDFs bleiben erhalten.

Die installierte Desktop-App ist der unterstützte Arbeitsablauf. Ein separat gehosteter Webdienst für mehrere Benutzer gehört nicht zu dieser Beta. Details zur Speicherung finden Sie in den [Verhaltensregeln](behavior-contracts.md).
