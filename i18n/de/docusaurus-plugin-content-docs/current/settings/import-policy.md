---
sidebar_position: 2
---

# Import- und Korrekturregeln {/* #import-and-review-policy */}

Unter Settings kannst du festlegen, wie importierte Wettkampfdaten in druckbare Urkundeninhalte umgewandelt werden.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/settings-diagnostics.png" alt="Bereich Settings mit Optionen für Live-Import und Prüfdatenkorrekturen" />
  <figcaption>Die Import- und Korrekturregeln werden in Settings gespeichert und beeinflussen, wie eingehende Sporttech-Daten für den Druck aufbereitet werden.</figcaption>
</figure>

## Verhalten beim Live-Import {/* #live-import-behavior */}

### Disziplin in die Urkundenklasse aufnehmen {/* #include-discipline-in-live-certificate-class */}

Wenn diese Option aktiviert ist, wird die Disziplin in die erzeugte Bezeichnung der Urkundenklasse aufgenommen.

Beispiel:

```text
TRA Einzel mannlich
```

statt:

```text
Einzel mannlich
```

### Vorkampfergebnis zur Gesamtpunktzahl der Finalteilnehmenden addieren {/* #add-qualification-score-to-finalist-total */}

Wenn diese Option aktiviert ist, wird bei Finalteilnehmenden die Summe aus Vorkampf- und Finalergebnis gedruckt. Bei Personen ohne Finalteilnahme bleibt es beim Vorkampfergebnis.

Nutze diese Option nur, wenn die Urkundenregel des Wettkampfs eine gemeinsame Wertung aus Vorkampf und Finale vorsieht.

## Korrekturen bei der Datenprüfung {/* #review-corrections */}

### Platzierungen beim Zusammenführen von Gruppen neu berechnen {/* #recalculate-placements-when-merging-groups */}

Wenn diese Option aktiviert ist, werden die Platzierungen nach dem Zusammenführen von Gruppen neu berechnet.

Wenn sie deaktiviert ist, behalten die Teilnehmenden ihre importierten oder manuell korrigierten Platzierungen.

Die gemeinsamen Regeln für Import, Identität, Wettkampfphasen, Punktzahlen und Rangfolge in Oberfläche und PDF-Erstellung findest du unter [Verbindliches App-Verhalten](../reference/behavior-contracts.md).
