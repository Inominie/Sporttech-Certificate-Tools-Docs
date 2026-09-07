---
sidebar_position: 1
---

# Verbindliches App-Verhalten {/* #behavior-contracts */}

Diese Seite beschreibt das Verhalten der App, auf das du dich während der Beta verlassen kannst.

## Lebenszyklus der Laufzeitdaten {/* #runtime-data-lifecycle */}

Sporttech Certificate Tools unterscheidet zwei Arten lokaler Daten:

- **Dauerhafte Einstellungen und Vorlagen:** App-Einstellungen, gespeicherte Vorlagenprofile, hochgeladene Vorlagendateien und Medien sowie Standardwerte für die Druckkalibrierung.
- **Aktive Projektdaten:** importierte Urkundeneinträge, Importwarnungen, Quellenmetadaten, Import-Datenzuordnungen, Quick-Check-Korrekturen, Vorschauen, Druckverlauf und erzeugte PDFs.

Aktive Projektdaten sind bewusst temporär. Beim Start der Desktop-App beginnt ein neues, leeres aktives Projekt. Gespeicherte Vorlagen und Einstellungen bleiben verfügbar.

| Vorgang | Importierte Zeilen | Warnungen und Quellenmetadaten | Quick-Check-Korrekturen | Vorschauen und erzeugte PDFs | Gespeicherte Vorlagen | Einstellungen |
| --- | --- | --- | --- | --- | --- | --- |
| Start der Desktop-App | Gelöscht | Gelöscht | Gelöscht | Gelöscht | Beibehalten | Beibehalten |
| Import eines neuen Wettkampfs | Ersetzt | Ersetzt | Gelöscht | Gelöscht | Beibehalten | Beibehalten |
| Aktuelle Live- oder OVS-Quelle aktualisieren | Ersetzt | Ersetzt | Gelöscht | Gelöscht | Beibehalten | Beibehalten |
| Aktives Projekt leeren | Gelöscht | Gelöscht | Gelöscht | Gelöscht | Beibehalten | Beibehalten |
| Vorlage löschen | Unverändert | Unverändert | Unverändert | Unverändert, außer hinsichtlich der ausgewählten Vorlage | Aktualisiert | Unverändert |

Manuelle Korrekturen sind Prüfentscheidungen innerhalb des aktiven Projekts und keine langfristig gespeicherten Projektaufzeichnungen. Speichere erzeugte PDFs oder erstelle ein Support-Paket, bevor du die App schließt, wenn du die aktuelle Sitzung für den Wettkampfbetrieb oder den Beta-Support sichern musst.

## Verbindliche Importregeln {/* #import-contracts */}

- Der Online-Import akzeptiert öffentliche Wettkampf-API-URLs von `sporttech.io` sowie Wettkampf-IDs, die auf diese API aufgelöst werden können.
- Der Offline-OVS-Import akzeptiert HTTP-Basis-URLs von OVS-Servern im lokalen oder privaten Netzwerk. Die automatische Suche prüft einen begrenzten lokalen IPv4-Bereich und kann Server in großen oder ungewöhnlich aufgebauten Netzwerken übersehen. Als Alternative steht die manuelle Eingabe unter Offline OVS zur Verfügung.
- Der Dateiimport akzeptiert ausschließlich Sporttech-Arbeitsmappen im Format `.xlsx`. Das ältere Format `.xls`, ein direkter Import von `event.j3` und umbenannte Dateien, die keine ZIP-Archive sind, werden abgewiesen.
- Beim Abrufen von JSON über das Netzwerk gelten Größenlimits für Antworten, Zeitlimits und eine Prüfung des Inhaltstyps.
- Beim Lesen von ZIP- und XLSX-Dateien werden Grenzen für die Anzahl der Archiveinträge, sichere Dateipfade, komprimierte und unkomprimierte Größe, Kompressionsverhältnis und Arbeitsblattabmessungen angewendet.

## Identität, Wettkampfphasen und Wertung {/* #identity-phases-and-scoring */}

Zur Identifikation von Live-Ergebnissen werden bevorzugt stabile Sporttech-Kennungen verwendet:

- Einzeleinträge verwenden Wettkampf oder Competition zusammen mit der Athleten-ID.
- Synchroneinträge verwenden Wettkampf oder Competition zusammen mit der sortierten Menge der Athleten-IDs.
- Teameinträge verwenden Competition zusammen mit der Team-ID.

Wenn Sporttech keine stabilen IDs bereitstellt, verwendet der Importer normalisierte Namen und Klassen. Bei einer mehrdeutigen Zuordnung werden Warnungen erfasst.

Die vereinheitlichten Wettkampfphasen sind `Qualification`, `Final` sowie ausdrücklich nicht unterstützte oder unbekannte Phasen. Lokalisierte Quellenbezeichnungen wie `Vorkampf` und `Finale` werden zugeordnet; die ursprünglichen Quellenmetadaten bleiben für die Diagnose verfügbar.

Punktzahlen werden streng eingelesen. Zeichenfolgen mit angehängtem Text wie `12abc` sind ungültig. Leere, ungültige und nicht positive Gesamtpunktzahlen gelten als nicht gewertet, sofern der importierte Quellenstatus die Zeile nicht ausdrücklich als gewertet kennzeichnet.

Für die Rangfolge und die Aufnahme in Ergebnislisten gilt dieselbe gemeinsame Regelung:

- Gewertete Zeilen können eine Platzierung erhalten.
- Nicht gewertete oder ungültige Zeilen erhalten keine berechnete Platzierung.
- Eine Null darf nur gedruckt oder in die Rangfolge aufgenommen werden, wenn der Quellenstatus das Ergebnis ausdrücklich als gewertet kennzeichnet.
- Die Auswahl zwischen Vorkampf, Finale und kombinierter Wertung muss in der Vorschau der Oberfläche und bei der PDF-Erstellung im Backend übereinstimmen.

## Speicherlimits {/* #storage-limits */}

Für erzeugte Ausgaben gilt das dauerhaft in Settings gespeicherte Speicherlimit. Der Standard beträgt 512 MB je aktivem Ausgabebereich und kann zwischen 64 MB und 4096 MB eingestellt werden.

PDF-Vorschauen, gespeicherte PDFs, Nachdrucke, Klassenlisten und Gruppen-PDFs zählen zu diesem Limit. Würde es überschritten, verweigert die App das Speichern einer zusätzlichen Vorschau oder entfernt eine gerade gerenderte, zu große PDF-Datei, bevor sie den Fehler zurückmeldet.

## Vorlagenmedien und externe Bilder {/* #template-assets-and-remote-images */}

Statische Vorlagenmedien sind Dateien, die im Upload-Verzeichnis für Vorlagen verwaltet werden. Beim Speichern von Laufzeitprofilen und Konfigurationen können keine beliebigen lokalen Pfade ausgewählt werden.

Datengebundene Bilder sind auf bekannte Sporttech-Quellfelder für Teamlogos beschränkt. Externe Bilder dürfen von vertrauenswürdigen Sporttech-HTTPS-Hosts und aus daraus abgeleiteten Sporttech-Vereinssymbolen geladen werden. Das Abrufen lokaler oder privater Bilder über HTTP ist standardmäßig deaktiviert und ausschließlich für kontrollierte lokale Tests vorgesehen.

Jeder Weiterleitungsschritt beim Abrufen dynamischer Bilder wird erneut geprüft. Antwortgröße, Inhaltstyp und Dateisignaturen werden vor dem Rendern kontrolliert. Temporäre Arbeitsverzeichnisse für das Rendern werden nach der Nutzung bereinigt.

## Vorlagentreue {/* #template-fidelity */}

Certificate-Studio-Profile sind die maßgebliche Grundlage für das gerenderte Urkundenlayout. Hochgeladene PDFs können als visuelle Hintergründe dienen. Hochgeladene DOCX-Dateien werden als Kompatibilitätsweg genutzt, um Seriendruck-Platzhalter, Seitengröße und einfache feste Texte auszulesen.

Zuverlässig unterstützt werden:

- Von der App erzeugte Profil-JSON-Dateien.
- PDF-Hintergründe mit im Studio verwalteten Text- und Bildüberlagerungen.
- Die Erkennung von DOCX- und PDF-Platzhaltern, wenn diese für das Extraktionsverfahren sichtbar sind.
- PNG-, JPG-, SVG-, WEBP- und PDF-Bilddateien innerhalb des verwalteten Vorlagenspeichers.

Nur eingeschränkt oder heuristisch unterstützt werden:

- PDF-Text in komprimierten Datenströmen oder Objektströmen kann der Platzhaltererkennung entgehen. Unkomprimierte Textplatzhalter in Rohform, mit Escape-Zeichen oder in Hexadezimaldarstellung werden durchsucht.
- Komplexe DOCX-Layouts, frei platzierte Objekte, verschachtelte Felder, individuelle Abstände und nicht unterstützte Schriften werden möglicherweise nicht exakt wiedergegeben.
- Das bisherige DOCX-Seriendruckverhalten ist als Kompatibilitätsfunktion zu verstehen, nicht als originalgetreuer Layouteditor.

Die Vorlagentreue-Diagnose verwendet folgende Stufen:

| Stufe | Bedeutung | Typische Quellen |
| --- | --- | --- |
| `exact` | Das eigene Profilformat der App kann ohne Rückerschließung als verbindliche Renderdefinition geladen werden. | Von Sporttech Certificate Tools erzeugte Profil-JSON-Dateien |
| `heuristic` | Die hochgeladene Datei wurde untersucht und verwertbare Layout- oder Platzhalterhinweise wurden ausgelesen. Vor dem Druck musst du die Positionierung prüfen. | PDF-Platzhalter mit sichtbarem Text, einfache DOCX-Seriendruckfelder |
| `limited` | Die Quelle enthält Konstrukte, durch die Platzhalter oder Layoutinformationen für das Extraktionsverfahren verborgen bleiben können. Die App kann die Quelle als Hintergrund oder Kompatibilitätseingabe behalten, aber keine vollständige Erkennung zusichern. | PDFs mit Komprimierung, Objektströmen oder Verschlüsselung; komplexe DOCX-Layouts |
