---
title: "Platzhalter"
sidebar_position: 4
---

# Platzhalter {/* #placeholders */}

Ein Platzhalter hat einen **Namen** für den Editor und eine **Datenquelle** für die Urkunde. Das Ändern des Namens ändert nicht seine Zuordnung. Fügen Sie unter Einfügen einen Platzhalter hinzu, wählen Sie Quelle und Namen und positionieren Sie das ausgewählte neue Feld auf der Seite.

## Häufige Platzhalter {/* #common-placeholders */}

Quelllisten sind bei einzelnen Platzhaltern, kombinierten Texten und der Zuordnungsprüfung einheitlich gruppiert. Die verfügbaren Quellen hängen von der Vorlagenkategorie ab.

| Gruppe | Beispiele |
| --- | --- |
| Event und Klasse | Eventtitel/-untertitel, Klasse, Phase. |
| Einzel | Athletenname und Verein. |
| Synchron | Athlet 1/2, einzelne Vereine, kombinierte Namen/Vereine. |
| Team | Teamname, Mitgliederanzahl, einzelne Mitgliedernamen und Vereine. |
| Ergebnisse | Sporttech-Platzierung und -Punktzahl. |
| Datum und Dokument | Aktuelles Datum in numerischen oder ausgeschriebenen Formaten, Vorlagenname, Dokumentseitennummer und -anzahl. |

Bei Synchron-Urkunden zeigt **Synchron-Verein(e), ohne Dopplungen** einen gemeinsamen Verein nur einmal. Unterscheiden sich die Vereine, werden beide ausgegeben. Die einzelnen und die gewöhnlichen kombinierten Vereinszuordnungen bleiben verfügbar.

## Felder zuordnen {/* #mapping-fields */}

Wählen Sie ein Feld und seine Quelle im Eigenschaftenbereich. Soll ein Platzhalter bewusst leer bleiben, verwenden Sie die Option zum absichtlichen Leerhalten; ein unzugeordnetes Feld benötigt vor der endgültigen Ausgabe noch eine Entscheidung.

Ein kombinierter Text enthält geordnete Fixtext- und Platzhalterteile. Jeder Platzhalterteil besitzt eine eigene Quelle. Sie können Teile manuell hinzufügen, bestehende Texte erweitern oder ausgewählte Elemente kombinieren. Reine Fixtexte werden zu einem normalen Textfeld mit bearbeitbaren Zeilenumbrüchen. Bei Platzhaltern oder gemischten Texten entsteht ein kombiniertes Feld. Prüfen Sie anschließend Leerzeichen, Satzzeichen und Zeilenumbrüche.

## Vorschauwerte {/* #preview-values */}

Der **Platzhaltermodus** zeigt Namen an, auch bei automatisch erzeugten Datumswerten. **Echte Daten** zeigt Werte für die ausgewählte [Klasse und den Eintrag](preview-data.md).

Aktuelle Datumsfelder verwenden das lokale Datum des Computers bei der PDF-Erstellung, nicht das Sporttech-Eventdatum. Ausgeschriebene deutsche/englische Datumsformate behalten die gewählte Sprache unabhängig von der App-Sprache. Innerhalb eines PDFs gilt ein gemeinsamer Erstellungszeitpunkt. Neue Uhrzeitplatzhalter werden nicht mehr angeboten; ältere gespeicherte Zuordnungen bleiben kompatibel.

Die Dokumentnummerierung bezeichnet Seitennummer und Gesamtseitenzahl des erzeugten PDFs einschließlich zusätzlicher Exemplare. Sie ist weder Platzierung noch dauerhafte Urkundennummer. Die einzelne Studio-Urkundenvorschau entspricht Seite 1 von 1.

## Fehlende Daten {/* #missing-data */}

Unterscheiden Sie mit **Zuordnungen prüfen** zwischen unzugeordneten Quellen, absichtlich leeren Feldern, fehlenden Eintragswerten und bedingt ausgeblendeten Feldern. Ein leerer Wert kann für den Eintrag korrekt sein, etwa bei einem ungenutzten Teamplatz. Testen Sie vor einer ganzen Klasse einen zweiten Eintrag mit anderen Namen, Vereinen oder einer anderen Teamgröße.
