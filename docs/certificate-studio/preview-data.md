---
sidebar_position: 5
---

# Check mappings with a chosen entry

Use a real competition entry to understand what each source will put on a certificate. This selection is for Studio preview; it does not change the print selection in the competition app.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/preview-mappings.png" alt="Mapping checker showing values for a selected fictional competition entry" />
  <figcaption>Inspect the value and status of each source used by the template.</figcaption>
</figure>

## Choose class, then entry

1. Load an event in the competition app and open Studio.
2. Select **Competition / class** in the preview controls. The list is filtered to the template category.
3. Select an **Entry** from that class. Search by name, club, team member or place, or move between entries with the previous/next controls.
4. Switch to **Real data**. Check long names, club combinations, empty team slots and line breaks.

Changing class clears the old entry selection so a certificate cannot silently show someone from another class. Changing event or template category also requires a valid new selection. Same-event refresh preserves the selection while it remains valid; a missing entry is reported rather than replaced by an arbitrary first row.

## Check the source values

Open **Check mappings** to see the source labels and values for the selected entry. Search the list and switch between used mappings and all available sources. This also covers placeholder parts in combined text and sources used by visibility conditions.

Statuses distinguish available values, empty values, an entry still needing selection, intentional blanks, unassigned fields, hidden conditions and unused/hidden team rows. The checker reflects the current draft, including local certificate corrections.

No event entry is needed for generated date/document fields. Event fields stay unresolved until an entry is selected. For detailed import diagnostics, use the separate data-map tools in Settings; the mapping checker is the everyday certificate-design tool.

## Before a print run

Try representative entries: a long name, two different synchronized clubs, and a small and large team where relevant. Then save the template and inspect the PDF in Produce. [Preprinted reference artwork](preprinted-paper.md) is visible in Studio but intentionally absent from that PDF.
