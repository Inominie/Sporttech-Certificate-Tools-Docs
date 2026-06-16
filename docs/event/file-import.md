---
sidebar_position: 4
---

# File import

Use **File Import** when live data is unavailable or when you receive an exported file from the event system.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/event-import.png" alt="File Import tab in the Event screen with a loaded Sporttech Excel export" />
  <figcaption>After a file import, the status strip confirms the source file, source type, detected classes, warning count, and selected template.</figcaption>
</figure>

## Supported file type

The current beta supports Sporttech Excel exports.

Direct `event.j3` import is planned but not implemented yet.

## Import a file

1. Open **Event**.
2. Select **File Import**.
3. Click **Import File**.
4. Choose the Sporttech Excel export.
5. Review the import status and warnings.

## Replacing imported data

Importing another file replaces the active imported data. Saved templates are not deleted.

If the event sends a corrected export, import the corrected file and repeat the Quick Check review.
