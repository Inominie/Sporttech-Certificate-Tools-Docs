---
title: "Platzhalter"
sidebar_position: 3
---

# Platzhalter {/* #placeholders */}

Platzhalter sind dynamische Textfelder, die bei der PDF-Erstellung mit importierten Sporttech-Daten gefüllt werden.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/certificate-studio.png" alt="Arbeitsfläche in Certificate Studio mit Urkundenplatzhaltern und Feldinspektor" />
  <figcaption>Die Arbeitsfläche zeigt Platzhalter im Layout. Im Inspektor ordnest du den ausgewählten Platzhalter den importierten Daten zu.</figcaption>
</figure>

## Häufige Platzhalter {/* #common-placeholders */}

| Platzhalter | Typische Datenquelle |
| --- | --- |
| Given name | Vorname der teilnehmenden Person |
| Surname | Nachname der teilnehmenden Person |
| Representing | Verein oder vertretene Organisation |
| Class | Bezeichnung der Urkundenklasse |
| Total | Gesamtpunktzahl des Ergebnisses |
| Place | Platzierung des Ergebnisses |

## Felder zuordnen {/* #mapping-fields */}

Jeder Platzhalter sollte einem Quellfeld zugeordnet sein. Die Quellfelder stammen aus den importierten Urkundendaten und können sich danach unterscheiden, ob die Zeile einen Einzeleintrag, ein Synchronpaar oder ein Team beschreibt.

## Vorschauwerte {/* #preview-values */}

Wenn importierte Daten verfügbar sind, prüfe anhand der Vorschauwerte, ob ein Platzhalter den erwarteten Text ausgibt, bevor du die Vorlage speicherst.

## Fehlende Daten {/* #missing-data */}

Wenn für einen Platzhalter keine Quelldaten vorhanden sind, kann die erzeugte PDF-Datei einen leeren Wert oder einen Ersatztext anzeigen. Prüfe vor der endgültigen Ausgabe die Warnungen in Certificate Studio und Produce.
