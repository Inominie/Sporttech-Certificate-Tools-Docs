---
sidebar_position: 2
---

# Import and review policy

Settings includes controls that change how imported event data becomes printable certificate output.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/settings-diagnostics.png" alt="Settings screen showing live import behavior and review correction options" />
  <figcaption>Import and review policy options are saved in Settings and affect how incoming Sporttech data is transformed for printing.</figcaption>
</figure>

## Live import behavior

### Include discipline in live certificate class

When enabled, the discipline is included in the generated certificate class label.

Example:

```text
TRA Einzel mannlich
```

instead of:

```text
Einzel mannlich
```

### Add qualification score to finalist total

When enabled, finalists print qualification total plus final total. Non-finalists keep their qualification total.

Use this only when the event's certificate rule requires combined qualification and final scoring.

## Review corrections

### Recalculate placements when merging groups

When enabled, placements are recalculated after group merges.

When disabled, athletes keep their imported or manually corrected place values.
