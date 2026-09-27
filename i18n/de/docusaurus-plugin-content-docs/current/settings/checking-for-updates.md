---
title: "Nach Updates suchen"
sidebar_position: 2
---

# Nach Updates suchen {/* #checking-for-updates */}

Die Desktop-App sucht beim Start nach Updates. Über **Einstellungen → Beta-Updates → Nach Updates suchen** können Sie die Prüfung erneut starten. Updates und Installationsdateien finden Sie in den [Veröffentlichungen des öffentlichen Dokumentations-Repositories](https://github.com/Inominie/Sporttech-Certificate-Tools-Docs/releases).

## Versionen mit integrierten Updates {/* #versions-with-in-app-updates */}

1. Wählen Sie **Update herunterladen**, wenn eine neuere Version bereitsteht. Währenddessen können Sie weiterarbeiten und den Download bei Bedarf abbrechen.
2. Die App prüft die Datei anhand signierter Veröffentlichungsinformationen. Eine fehlgeschlagene Prüfung verhindert die Installation.
3. Beenden Sie die Wettkampfarbeit und wählen Sie **Neu starten und installieren**. Ungespeicherte Studio-Änderungen müssen gespeichert oder verworfen und laufende Vorgänge abgeschlossen werden. Der Neustart lässt sich abbrechen.
4. Prüfen Sie nach dem erneuten Öffnen die installierte Version in den Einstellungen.

**Ein Neustart löscht das geladene Event und manuelle Urkundenkorrekturen.** Laden Sie das Event danach erneut. Gespeicherte Vorlagen, Bild-/Schriftdateien, Einstellungen sowie gespeicherte/gedruckte PDFs bleiben an ihren bisherigen Speicherorten erhalten. Vorschau-PDFs sind temporär. Vor einem Update wird eine lokale Sicherung von Vorlagen und Einstellungen im Unterordner `update-backups` des App-Datenordners erstellt. Kontaktieren Sie vor einer Wiederherstellung den Support.

Ein Download wird beim normalen Beenden der App nicht installiert. Die Installation beginnt erst über **Neu starten und installieren**. Ein nicht erreichbarer Update-Dienst verhindert die Wettkampfarbeit nicht.

## Erstes Update von einer älteren Beta {/* #first-update-from-an-older-beta */}

Ältere Versionen zeigen nur einen Update-Hinweis. Installieren Sie die erste Version mit integriertem Updater manuell von der öffentlichen Release-Seite. Auf dem Mac die App vor dem Start aus dem DMG nach Programme verschieben. Danach können weitere Updates innerhalb der App installiert werden.

## Wenn ein Update fehlschlägt {/* #if-an-update-fails */}

Prüfen Sie die Verbindung und wählen Sie **Erneut prüfen**. Bei einem Download- oder Prüffehler können Sie mit der aktuellen App weiterarbeiten. Ersetzen Sie keine Installationsdatei und umgehen Sie keine fehlgeschlagene Signaturprüfung. Windows-Sicherheitsrichtlinien können unsignierte Windows-Installer weiterhin blockieren; wenden Sie sich an die Administration des Vereins oder den Support. Mac-Versionen mit diesem Update-Verfahren sind mit Developer ID signiert und notarisiert.

Senden Sie dem Support einen Screenshot der Versions-/Build-Angaben und der Fehlermeldung. Vermeiden Sie ältere App-Versionen: Diese unterstützen möglicherweise neuere Vorlagendaten nicht.
