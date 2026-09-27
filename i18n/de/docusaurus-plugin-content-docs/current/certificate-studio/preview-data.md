---
title: "Zuordnungen mit einem gewählten Eintrag prüfen"
sidebar_position: 5
---

# Zuordnungen mit einem gewählten Eintrag prüfen {/* #check-mappings-with-a-chosen-entry */}

Mit einem echten Wettkampfeintrag sehen Sie, welchen Wert eine Quelle auf die Urkunde setzt. Diese Auswahl dient der Studio-Vorschau; sie ändert nicht die Druckauswahl der Wettkampf-App.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/preview-mappings.png" alt="Zuordnungsprüfung mit Werten für einen gewählten erfundenen Wettkampfeintrag" />
  <figcaption>Wert und Status jeder von der Vorlage verwendeten Quelle prüfen.</figcaption>
</figure>

## Erst Klasse, dann Eintrag wählen {/* #choose-class-then-entry */}

1. Laden Sie ein Event in der Wettkampf-App und öffnen Sie das Studio.
2. Wählen Sie **Wettkampf / Klasse** in den Vorschauoptionen. Die Liste ist auf die Vorlagenkategorie eingeschränkt.
3. Wählen Sie einen **Eintrag** aus dieser Klasse. Suchen Sie nach Namen, Verein, Teammitglied oder Platzierung oder wechseln Sie mit den Vor-/Zurück-Schaltflächen zwischen Einträgen.
4. Wechseln Sie zu **Echte Daten**. Prüfen Sie lange Namen, Vereinskombinationen, leere Teamplätze und Zeilenumbrüche.

Ein Klassenwechsel löscht die vorherige Eintragsauswahl, damit nicht unbemerkt jemand aus einer anderen Klasse angezeigt wird. Auch ein anderes Event oder eine andere Vorlagenkategorie benötigt eine gültige neue Auswahl. Die Aktualisierung desselben Events erhält eine weiterhin gültige Auswahl; ein fehlender Eintrag wird gemeldet und nicht durch eine beliebige erste Zeile ersetzt.

## Quellwerte prüfen {/* #check-the-source-values */}

Öffnen Sie **Zuordnungen prüfen**, um Quellbezeichnungen und Werte für den ausgewählten Eintrag zu sehen. Durchsuchen Sie die Liste und wechseln Sie zwischen verwendeten Zuordnungen und allen verfügbaren Quellen. Auch Platzhalterteile kombinierter Texte und Quellen für Sichtbarkeitsbedingungen werden erfasst.

Die Statusangaben unterscheiden verfügbare oder leere Werte, eine noch nötige Eintragsauswahl, absichtliche Leerwerte, fehlende Zuordnungen, ausgeblendete Bedingungen sowie ungenutzte/ausgeblendete Teamzeilen. Die Prüfung berücksichtigt den aktuellen Entwurf einschließlich lokaler Urkundenkorrekturen.

Für erzeugte Datums-/Dokumentfelder wird kein Eventeintrag benötigt. Eventfelder bleiben ohne ausgewählten Eintrag unaufgelöst. Für ausführliche Importdiagnosen gibt es separate Datenübersichten in den Einstellungen; die Zuordnungsprüfung ist das Werkzeug für die tägliche Urkundengestaltung.

## Vor einem Drucklauf {/* #before-a-print-run */}

Testen Sie typische Sonderfälle: einen langen Namen, zwei unterschiedliche Synchron-Vereine sowie gegebenenfalls ein kleines und ein großes Team. Speichern Sie anschließend die Vorlage und prüfen Sie das PDF unter Produzieren. [Vordruck-Referenzgrafiken](preprinted-paper.md) sind im Studio sichtbar und fehlen absichtlich im PDF.
