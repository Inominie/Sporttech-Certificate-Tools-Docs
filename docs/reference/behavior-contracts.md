---
sidebar_position: 1
---

# Behavior contracts

These rules explain what operators can rely on in the current beta. They distinguish persistent files from temporary event work.

## Runtime data lifecycle

| Data | Same-event refresh | Different event or new file import | App restart |
| --- | --- | --- | --- |
| Source event data | Updated from the source | Replaced | Cleared; load the event again |
| Manual certificate corrections | Kept | Cleared | Cleared |
| Valid event/preview selections and quantity overrides | Kept where still applicable | Reset | Reset |
| Saved Studio templates and their assets | Kept | Kept | Kept |
| Explicitly saved or successfully printed PDFs | Kept | Kept | Kept |
| Temporary preview/test PDFs | May be invalidated | Not retained as event records | Cleared |
| App settings and print history | Kept | Kept | Kept |

For an updated Excel export of the same event, choose **Refresh current file…**. Loading a new file is a new event operation. Unsaved Studio edits need saving before leaving or restarting; they are not persistent templates.

## Import contracts

Online import uses supported Sporttech event sources. Offline OVS requires a reachable local HTTP server; file import accepts Sporttech `.xlsx` workbooks. Direct `event.j3` import is unavailable. A failed import/refresh does not replace the previous usable event with incomplete results.

Automatic refresh defaults to enabled every 30 seconds for online/OVS sources. It does not fetch a new Excel export for you. Refresh status reports success/failure; retained old data after a failure must not be mistaken for fresh results.

## Identity, phases, and scoring

Sporttech owns scores, placements, phases and competition groups. The app does not add qualification and final scores, merge groups or recalculate rankings. Certificate edits affect names, clubs, team names and notes without writing back to Sporttech.

Preview data is selected by class and then entry. It does not silently substitute the first entry when a selection becomes invalid. Certificate copies repeat the same entry and keep its copies together.

## Storage limits

The default generated-output storage limit is 512 MB, configurable from 64 to 4096 MB. Retained PDFs and temporary outputs count toward it. If an operation exceeds the limit, resolve the storage error; older saved/printed PDFs are not silently deleted to make room. Save important files elsewhere before deliberately removing them.

## Template assets and remote images

Saved templates keep the local assets needed for output. [Studio packages](../certificate-studio/sharing-templates.md) transfer the design and included assets, not event data or app settings. Do not rely on a remote image URL as an offline-ready template asset; import the image into the design.

System fonts are normally referenced, not packaged. Missing fonts need an available replacement on import. Legacy embedded fonts remain supported. Printer calibration is a computer/printer setting and is not transferred with a template.

## Template fidelity

PDF/Word samples are starting points, not guaranteed lossless imports or automatic Sporttech mappings. Review recovered elements, fonts, line breaks and import notices. Scans or unsupported graphics can remain images.

Older supported Studio formats are migrated when opened by newer versions. Unsupported newer features require an app update; universal compatibility with all future formats is not promised.

Artwork marked as already on preprinted paper is visible in Studio and omitted from every generated PDF. A printed PDF is retained after successful job submission, which does not guarantee physical printer completion.
