---
sidebar_position: 1
---

# Event import overview

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/event-import.png" alt="Event page with source tabs and explicit new-file and refresh actions" />
  <figcaption>Choose a new source or refresh the current event.</figcaption>
</figure>

## Source types

| Source | Use when | Updating it |
| --- | --- | --- |
| Online Sporttech | The event is available online. | Automatic or manual refresh from Sporttech. |
| Offline OVS | A Sporttech OVS server runs on the local network. | Automatic or manual refresh while the server is reachable. |
| File import | You have a Sporttech Excel export. | Select an updated workbook with **Refresh current file…**. |

See [online events](online-event.md), [offline OVS](offline-ovs.md) and [file import](file-import.md).

## Import status

Check the event title, source and row counts after import, then open Quick Check. If import fails, the previously loaded data remains usable; it has not become current merely because a refresh was attempted.

## Refreshing data

The refresh icon in the header works in Event, Quick Check, Produce and Studio. It refreshes the loaded source and shows refresh status. Same-event refresh keeps manual certificate corrections. Loading a different event clears them. Excel distinguishes a new file import from an explicit refresh of the current file.

[Auto-refresh](auto-refresh.md) is enabled by default for online and OVS sources; Excel files require manual selection.
