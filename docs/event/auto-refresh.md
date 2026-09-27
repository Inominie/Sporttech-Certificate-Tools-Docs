---
sidebar_position: 5
---

# Auto-refresh

Auto-refresh keeps the loaded online or local OVS event up to date. Configure it in **Settings**; it is enabled by default and the preference is saved.

## When to use it

Keep it enabled during a competition. Refreshing the same event preserves manual names, clubs and certificate-note corrections, valid selections and Studio edits. New source scores and placements still come from Sporttech.

The refresh icon in the header is always accessible, including in Studio. Use it before printing and check the last successful refresh. If a refresh fails, the app keeps the previous data and shows the error; those data may now be out of date.

## When to turn it off

You can pause automatic refresh in Settings when needed, for example while investigating a connection problem. Manual refresh remains available. You do not need to turn it off to protect certificate corrections.

Excel events are not polled. Select an updated workbook when [refreshing a file import](file-import.md).

## Default interval

The default is **30 seconds**. Settings offers 10, 15, 30, 60, 120 or 300 seconds. Refresh is coordinated with active operations and inactive workspaces; the interval is not a guarantee of a new fetch every second on the clock.

Changed source data can invalidate a PDF preview. Wait for the current preview before saving or printing.
