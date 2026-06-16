---
sidebar_position: 1
---

# Event import overview

The **Event** screen loads competition data into the active project. Only one imported source is active at a time.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/event-import.png" alt="Event screen with file import selected and sample Sporttech data loaded" />
  <figcaption>The Event screen shows source selection, current source status, class counts, warnings, and active template state.</figcaption>
</figure>

## Source types

| Source | Use when |
| --- | --- |
| **Online URL** | The event is available through Sporttech online results. |
| **Offline OVS** | The event computer runs an OVS server on the local network. |
| **File Import** | You have a Sporttech Excel export on disk. |

## Import status

After importing, the status strip shows:

- Current source label.
- Source type and source URL or path.
- Number of detected classes and printable event entries.
- Warnings and manual overrides.
- Active template status.

## Refreshing data

Use refresh when event data changes after the first import. Online and offline live sources can also use auto-refresh.

File imports refresh from the already loaded file data. If you receive a newer file export, import the newer file.
