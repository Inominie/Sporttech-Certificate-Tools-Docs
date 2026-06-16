---
sidebar_position: 1
---

# Current limitations

This page tracks important beta limitations for operators.

## Distribution

- Builds are unsigned.
- No automatic updates are available yet.
- macOS and Windows may show operating system trust warnings.

## Import

- Direct `event.j3` import is not implemented yet.
- Offline OVS support requires a reachable local OVS HTTP server.
- File import currently targets Sporttech Excel exports.

## Printing

- Direct silent printing is not implemented.
- Users print saved PDFs through the app's print flow or the operating system PDF viewer.

## Templates

- PDF templates can be used as certificate backgrounds.
- DOCX import is a compatibility path for extracting mail-merge placeholders and basic fixed text.
- PDF output is generated through the bundled Typst runtime.

## Data

Imported data, templates, and generated PDFs are local user data. Avoid sharing support bundles or generated files outside the intended event or beta support context.
