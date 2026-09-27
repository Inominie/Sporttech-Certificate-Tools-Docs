---
title: "Häufige Probleme"
sidebar_position: 1
---

# Häufige Probleme {/* #common-issues */}

## Die App öffnet sich leer {/* #the-app-opens-empty */}

Jede neue Sitzung beginnt ohne geladenes Event und manuelle Korrekturen. Laden Sie die Quelle erneut. Gespeicherte Vorlagen, Einstellungen sowie gespeicherte/gedruckte PDFs sollten weiterhin verfügbar sein. Fehlen diese, prüfen Sie die Laufzeitpfade in den Einstellungen und kontaktieren Sie den Support, bevor Sie App-Daten löschen.

## macOS blockiert die App {/* #macos-blocks-the-app */}

Aktuelle Mac-Installer sind signiert und notarisiert. Laden Sie das aktuelle DMG von der offiziellen Downloadseite, ziehen Sie die App in Programme und starten Sie diese Kopie. Starten Sie sie nicht innerhalb des DMG. Ältere unsignierte Betas konnten Gatekeeper-Warnungen anzeigen.

Wird ein aktueller offizieller Download blockiert oder als beschädigt gemeldet, laden Sie ihn erneut herunter und nennen Sie dem Support die genaue Meldung und Version. Deaktivieren Sie keine Systemsicherheit und umgehen Sie keine fehlgeschlagene Updateprüfung.

## Windows SmartScreen erscheint {/* #windows-smartscreen-appears */}

Der Windows-Installer ist unsigniert. Wählen Sie **Weitere Informationen → Trotzdem ausführen** nur bei einem vertrauenswürdigen Projektdownload. Blockiert eine Vereinsrichtlinie die Installation, fragen Sie die Administration. Die Downloadprüfung in der App entfernt die Windows-Warnung für unsignierte Installer nicht.

## Offline-OVS-Suche findet nichts {/* #offline-ovs-discovery-finds-nothing */}

Prüfen Sie, ob der OVS-Server läuft, beide Computer im selben erreichbaren Netzwerk sind und der Server HTTP auf Port `9002` bereitstellt. Versuchen Sie die bekannte Server-URL manuell. Netzwerk-/Firewallregeln können die lokale Suche verhindern. Ein Sporttech-Excel-Export ist eine Alternative.

## PDF-Vorschau ist nicht verfügbar {/* #preview-pdf-is-unavailable */}

Laden Sie ein Event, wählen Sie gültige Einträge und eine gespeicherte Vorlage der passenden Kategorie. Beheben Sie fehlende Zuordnungen, Layoutbox-Überläufe und fehlende Teamanzahlen. Prüfen Sie Fehlermeldung und freien Speicher. Warten Sie nach Einstellungsänderungen auf eine neue Vorschau; veraltete Ausgabe ist kein sicherer Ersatz.

## Gedruckter Inhalt ist verschoben {/* #printed-content-is-shifted */}

Prüfen Sie Papiergröße, Originalgröße/100 % Skalierung und Druckerränder. Verwenden Sie die [Druckkalibrierung](../produce/print-calibration.md) für einen gleichmäßigen Versatz. Richten Sie bei Vordrucken die Referenzgrafik aus und markieren Sie sie als bereits gedruckt, damit sie nicht doppelt enthalten ist.

## Ein gespeichertes PDF existiert bereits {/* #a-saved-pdf-already-exists */}

Prüfen Sie die Namens-/Überschreibabfrage. Wählen Sie einen anderen Namen oder bestätigen Sie eine Ersetzung bewusst. Bestehende aufbewahrte Ausgaben sind keine temporären Vorschauen. Sichern Sie benötigte Exemplare vor dem Aufräumen anderweitig.

## Word-Musterimport verlangt LibreOffice {/* #word-sample-import-asks-for-libreoffice */}

Exportieren Sie das Dokument in Word als PDF und importieren Sie dieses als [Gestaltungsmuster](../certificate-studio/design-samples.md). Alternativ installieren Sie LibreOffice für den direkten Word-Import. Gespeicherte Studio-Vorlagen benötigen zum Drucken weder Word noch LibreOffice.

## Ein Feld fehlt oder zeigt einen falschen Wert {/* #a-field-is-missing-or-shows-the-wrong-value */}

Prüfen Sie im Studio ausgewählte Klasse und Eintrag, Vorlagenkategorie und den Modus **Echte Daten**. Öffnen Sie **Zuordnungen prüfen**. Achten Sie auf fehlende Zuordnungen, tatsächlich leere Werte, Sichtbarkeitsbedingungen oder ungenutzte Teamplätze. Prüfen Sie Namen und Datenquelle: Ein Umbenennen ändert die Zuordnung nicht.

Verwenden Sie für schwer auswählbare Elemente die Elementauswahl. Sperren Sie große Hintergrundbilder gegen versehentliche Auswahl. Prüfen Sie Textfarbe, Ebenenreihenfolge und Boxgröße. Gescannter oder in Konturen umgewandelter Mustertext kann Teil eines Bildes statt eines bearbeitbaren Felds sein.

## Speichern ist deaktiviert oder ein Export wirkt älter {/* #save-is-disabled-or-an-exported-template-looks-older */}

Speichern ist nur bei Änderungen aktiv. Verwenden Sie Umbenennen für einen anderen Titel und Kopieren für ein neues Design. Exportiert wird der gespeicherte Stand; speichern Sie aktuelle Änderungen vor dem Export. Siehe [Vorlagenbibliothek](../certificate-studio/template-library.md).

## Grafiken fehlen im PDF {/* #artwork-disappears-from-the-pdf */}

Bei der Markierung **Bereits auf dem Papier vorgedruckt** ist das beabsichtigt. Das Studio zeigt sie zur Gestaltung, erzeugte Vorschauen und endgültige PDFs lassen sie aus. Verwenden Sie für eine vollständige digitale Urkunde eine Vorlagenkopie mit deaktivierter Option.

## Daten oder Korrekturen wirken veraltet {/* #data-or-corrections-seem-outdated */}

Prüfen Sie in der Kopfzeile die letzte erfolgreiche Aktualisierung und mögliche Fehler. Auto-Aktualisierung gilt für Online-/OVS-Quellen; Excel benötigt eine aktualisierte Arbeitsmappe. Korrekturen desselben Events überschreiben importierte Urkundentexte bis zum Zurücksetzen. Ein neues Event, ein neuer Dateiimport oder Neustart löscht Korrekturen. Siehe [Auto-Aktualisierung](../event/auto-refresh.md).

## Hilfe bei Updates oder anderen Fehlern {/* #i-need-help-with-an-update-or-another-error */}

Folgen Sie der [Hilfe bei Updatefehlern](../settings/checking-for-updates.md#if-an-update-fails). Nennen Sie bei anderen Problemen App-Version, Aktion und genaue Fehlermeldung und fügen Sie ein Bildschirmfoto ohne unnötige persönliche Daten bei. Prüfen Sie ein [Supportpaket](../settings/support-bundles.md), bevor Sie es privat teilen.
