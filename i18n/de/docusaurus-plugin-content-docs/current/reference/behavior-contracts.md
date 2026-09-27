---
title: "Verhaltensregeln"
sidebar_position: 1
---

# Verhaltensregeln {/* #behavior-contracts */}

Diese Regeln beschreiben das verlässliche Verhalten der aktuellen Beta. Sie unterscheiden dauerhaft gespeicherte Dateien von temporärer Eventarbeit.

## Lebenszyklus der Laufzeitdaten {/* #runtime-data-lifecycle */}

| Daten | Aktualisierung desselben Events | Anderes Event oder neuer Dateiimport | App-Neustart |
| --- | --- | --- | --- |
| Event-Quelldaten | Aus der Quelle aktualisiert | Ersetzt | Gelöscht; Event erneut laden |
| Manuelle Urkundenkorrekturen | Erhalten | Gelöscht | Gelöscht |
| Gültige Event-/Vorschauauswahl und Exemplarüberschreibungen | Soweit weiterhin anwendbar erhalten | Zurückgesetzt | Zurückgesetzt |
| Gespeicherte Studio-Vorlagen und enthaltene Dateien | Erhalten | Erhalten | Erhalten |
| Ausdrücklich gespeicherte oder erfolgreich gedruckte PDFs | Erhalten | Erhalten | Erhalten |
| Temporäre Vorschau-/Test-PDFs | Können ungültig werden | Nicht als Eventunterlagen aufbewahrt | Gelöscht |
| App-Einstellungen und Druckverlauf | Erhalten | Erhalten | Erhalten |

Wählen Sie für einen aktualisierten Excel-Export desselben Events **Aktuelle Datei aktualisieren…**. Das Laden einer neuen Datei ist ein neues Event. Ungespeicherte Studio-Änderungen müssen vor dem Verlassen oder Neustart gespeichert werden; sie sind keine dauerhaften Vorlagen.

## Importregeln {/* #import-contracts */}

Der Online-Import verwendet unterstützte Sporttech-Eventquellen. Offline-OVS benötigt einen erreichbaren lokalen HTTP-Server; der Dateiimport akzeptiert Sporttech-Arbeitsmappen im Format `.xlsx`. Ein direkter Import von `event.j3` ist nicht verfügbar. Ein fehlgeschlagener Import oder eine fehlgeschlagene Aktualisierung ersetzt das bisher nutzbare Event nicht durch unvollständige Ergebnisse.

Die automatische Aktualisierung ist für Online-/OVS-Quellen standardmäßig alle 30 Sekunden aktiv. Sie beschafft keinen neuen Excel-Export. Der Status zeigt Erfolg oder Fehler; nach einem Fehler erhaltene alte Daten sind nicht mit aktuellen Ergebnissen gleichzusetzen.

## Identität, Phasen und Wertung {/* #identity-phases-and-scoring */}

Sporttech bestimmt Punkte, Platzierungen, Phasen und Wettkampfgruppen. Die App addiert keine Qualifikations- und Finalpunkte, führt keine Gruppen zusammen und berechnet keine Rangfolgen neu. Urkundenkorrekturen betreffen Namen, Vereine, Teamnamen und Hinweise, ohne an Sporttech zurückzuschreiben.

Vorschaudaten werden über Klasse und anschließend Eintrag ausgewählt. Eine ungültige Auswahl wird nicht unbemerkt durch den ersten Eintrag ersetzt. Urkundenexemplare wiederholen denselben Eintrag und bleiben zusammen.

## Speicherlimits {/* #storage-limits */}

Das Standardlimit für erzeugte Ausgaben beträgt 512 MB und ist von 64 bis 4096 MB einstellbar. Aufbewahrte PDFs und temporäre Ausgaben zählen dazu. Überschreitet ein Vorgang das Limit, beheben Sie den Speicherfehler; ältere gespeicherte/gedruckte PDFs werden nicht unbemerkt gelöscht, um Platz zu schaffen. Sichern Sie wichtige Dateien anderweitig, bevor Sie sie gezielt entfernen.

## Vorlagendateien und entfernte Bilder {/* #template-assets-and-remote-images */}

Gespeicherte Vorlagen behalten die für die Ausgabe benötigten lokalen Dateien. [Studio-Pakete](../certificate-studio/sharing-templates.md) übertragen Design und enthaltene Dateien, keine Eventdaten oder App-Einstellungen. Verlassen Sie sich für eine offline nutzbare Vorlage nicht auf eine entfernte Bild-URL; importieren Sie das Bild in das Design.

Systemschriften werden normalerweise referenziert und nicht mitverpackt. Fehlende Schriften benötigen beim Import einen verfügbaren Ersatz. Früher eingebettete Schriften bleiben unterstützt. Die Druckkalibrierung gehört zum Computer/Drucker und wird nicht mit einer Vorlage übertragen.

## Vorlagentreue {/* #template-fidelity */}

PDF-/Word-Muster sind Ausgangspunkte, keine garantiert verlustfreien Importe oder automatischen Sporttech-Zuordnungen. Prüfen Sie übernommene Elemente, Schriften, Umbrüche und Importhinweise. Scans oder nicht unterstützte Grafiken können Bilder bleiben.

Ältere unterstützte Studio-Formate werden beim Öffnen in neueren Versionen migriert. Nicht unterstützte neuere Funktionen erfordern ein App-Update; universelle Kompatibilität mit allen zukünftigen Formaten wird nicht versprochen.

Als bereits vorgedruckt markierte Grafiken sind im Studio sichtbar und fehlen in jedem erzeugten PDF. Ein gedrucktes PDF wird nach erfolgreicher Auftragsübergabe aufbewahrt; dies garantiert nicht die physische Fertigstellung durch den Drucker.
