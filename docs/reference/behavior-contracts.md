---
sidebar_position: 1
---

# Behavior contracts

This page describes app behavior that operators can rely on during the beta.

## Runtime data lifecycle

Sporttech Certificate Tools keeps two kinds of local data:

- **Persistent settings and templates:** app settings, saved template profiles, uploaded template sources and assets, and print calibration defaults.
- **Active project data:** imported certificate rows, import warnings, source metadata, import data maps, Quick Check corrections, previews, print history, and generated PDFs.

Active project data is intentionally temporary. A desktop launch starts with a fresh active project. Saved templates and Settings remain available.

| Operation | Imported rows | Warnings and source metadata | Quick Check corrections | Previews and generated PDFs | Saved templates | Settings |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop launch | Cleared | Cleared | Cleared | Cleared | Kept | Kept |
| New Event import | Replaced | Replaced | Cleared | Cleared | Kept | Kept |
| Refresh current live or OVS source | Replaced | Replaced | Cleared | Cleared | Kept | Kept |
| Clear active project | Cleared | Cleared | Cleared | Cleared | Kept | Kept |
| Delete template | Unchanged | Unchanged | Unchanged | Unchanged except selected template | Updated | Unchanged |

Manual corrections are active-project review decisions, not long-term project records. Save generated PDFs or create a support bundle before closing the app if the current session needs to be preserved for event operations or beta support.

## Import contracts

- Online Event import accepts public `sporttech.io` event API URLs and event IDs that resolve to that API.
- Offline OVS import accepts local or private-network HTTP OVS base URLs. Discovery scans a bounded local IPv4 range and can miss servers on large or unusual networks; manual Offline OVS entry is the fallback.
- File import accepts Sporttech `.xlsx` workbooks only. Legacy `.xls`, direct `event.j3`, and renamed non-ZIP files are rejected.
- Network JSON reads have response byte caps, timeouts, and content-type validation.
- ZIP and XLSX reads apply archive limits for entry count, path safety, compressed and uncompressed size, compression ratio, and worksheet dimensions.

## Identity, phases, and scoring

Live-result identity prefers stable Sporttech identifiers:

- individual entries use event or competition plus athlete ID
- synchronized entries use event or competition plus the sorted athlete ID set
- team entries use competition plus team ID

When Sporttech does not provide stable IDs, the importer falls back to normalized names and classes and records warnings for ambiguous identity.

Canonical phases are `Qualification`, `Final`, and explicit unsupported or unknown phases. Localized source labels such as `Vorkampf` and `Finale` are mapped while raw source metadata remains available for diagnostics.

Scores are parsed strictly. Strings with trailing text such as `12abc` are invalid. Empty, invalid, and non-positive totals are treated as unscored unless imported source status explicitly marks the row as scored.

Ranking and result-list inclusion use one shared policy:

- scored rows are rank-eligible
- unscored or invalid rows do not receive calculated places
- zero can be printed or ranked only when source status explicitly says the result is scored
- qualification, final, and combined selection must match between UI previews and backend PDF generation

## Storage limits

Generated output storage is capped by the persisted Settings storage limit. The default is 512 MB per active generated-output area, configurable from 64 MB to 4096 MB.

PDF previews, saved PDFs, reprints, class lists, and group PDFs count toward the cap. When the cap would be exceeded, the app rejects the write before saving a duplicate preview or removes a just-rendered over-budget PDF before returning the error.

## Template assets and remote images

Static template assets are files managed under the template upload directory. Runtime profile and config writes cannot select arbitrary local paths.

Data-bound image assets are limited to known Sporttech team-logo source fields. Remote image fetching is allowed for trusted Sporttech HTTPS hosts and derived Sporttech club icons. HTTP local or private image fetching is disabled by default and is intended only for controlled local testing.

Every dynamic image redirect hop is revalidated. Response size, content type, and file signatures are checked before rendering, and temporary render workspaces are cleaned after use.

## Template fidelity

Certificate Studio profiles are the source of truth for rendered certificate layout. Uploaded PDFs can be used as visual backgrounds. Uploaded DOCX files are a compatibility path for extracting mail-merge placeholders, page size, and simple fixed text.

Supported with confidence:

- profile JSON created by the app
- PDF background files with Studio-managed text and image overlays
- DOCX and PDF placeholder discovery when placeholders are visible to the extractor
- PNG, JPG, SVG, WEBP, and PDF image assets inside managed template storage

Limited or heuristic:

- PDF text in compressed or object streams can evade placeholder detection; uncompressed raw, escaped, and hex-encoded text placeholders are scanned
- complex DOCX layout, floating objects, nested fields, custom spacing, and unsupported fonts may not reproduce exactly
- legacy DOCX merge-style behavior should be treated as compatibility behavior, not as a high-fidelity editor

Fidelity diagnostics use these levels:

| Level | Meaning | Typical sources |
| --- | --- | --- |
| `exact` | The app-owned profile format can be loaded as the render contract without reverse engineering. | profile JSON created by Sporttech Certificate Tools |
| `heuristic` | The upload was inspected and useful layout or placeholder hints were extracted, but the operator must review placement before printing. | visible-text PDF placeholders, simple DOCX mail-merge fields |
| `limited` | The source contains constructs that may hide placeholders or layout from the extractor. The app can keep the source as a background or compatibility input, but cannot promise complete discovery. | compressed/object-stream/encrypted PDFs, complex DOCX layout |
