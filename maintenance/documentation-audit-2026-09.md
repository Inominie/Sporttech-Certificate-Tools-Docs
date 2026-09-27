# User documentation audit — 27 September 2026

## Baseline and scope

Reviewed all 29 existing English guides, their 29 German counterparts, the homepage, navigation, screenshots, videos and repository onboarding text against application 0.7.2 (`7facd23`). Added five focused Studio guides in each language, bringing the user guide to 34 pages per language. Existing guide URLs and all 135 original heading anchors are preserved.

This audit concerns operator documentation. It does not certify a new app release, a physical print run or a macOS installed-app upgrade.

The last broad English content baseline was June 2026 (`5118bbc`, `04f481c`, `637e532`); the June 24 update (`5e4ff85`) concentrated on update-manifest guidance. German documentation was added on September 7 (`ac7bcca`), largely reflecting that earlier content. September 27's update (`ed5622d`) changed installation and in-app-update instructions in both languages, rather than reviewing the full guide. Later signed-feed commits changed available versions, not the other user instructions.

Application changes examined since that baseline:

| Release/change | Application commit | Documentation implications |
| --- | --- | --- |
| 0.4.0: editable Studio templates and beta workflow fixes | `c5a9f2c` | Sample vs finished-template import; explicit bindings; fonts and package portability; Studio tools, layout boxes, saving and persistence; Sporttech scoring authority. |
| 0.5.0: Studio editing and event search | `e54793b` | Save/rename/copy, asset extraction, stable categorized library, unsaved-change handling, Germany default and date filters. |
| 0.6.0: refresh and certificate preview controls | `f7a99bb` | Default refresh and global button, specific class/entry previews, mapping inspection, generated dates, unique synchronized clubs, print order and preprinted artwork. |
| Automatic copies and Produce layout | `d43c881` | Per-entry/per-athlete quantities, team-count overrides, page order, one printer copy, updated preview controls. |
| 0.7.0 desktop updater; 0.7.1 upgrade test | `ba92e52`, `225082b` | Signed/notarized Mac installation, manual download/restart, session reset, verification/recovery. |
| 0.7.2 direct update banner | `7facd23` | Banner starts the in-app download and opens Settings. |

## Incorrect instructions corrected

| Earlier instruction | Current behavior now documented |
| --- | --- |
| Refresh clears corrections; turn automatic refresh off before correcting. | Same-event refresh preserves certificate corrections. Auto-refresh defaults to enabled every 30 seconds in Settings. New event/new file import/restart clears corrections. |
| Merge/rename groups, recalculate places, or add qualification to final totals locally. | Sporttech owns groups, placements and scores. Only certificate presentation details can be corrected. Removed controls are identified as historical. |
| Generated/saved PDFs are cleared at startup. | Temporary previews/tests are cleaned up; explicitly saved and successfully submitted print PDFs persist. |
| Save before Print becomes available. | The current PDF preview can be printed directly. A successful submission retains the PDF. |
| Word/PDF imports are final templates with inferred mappings or only fixed backgrounds. | They are design starting points. Recoverable elements are editable; sources are assigned explicitly. Word needs LibreOffice or a PDF export workaround. |
| The Studio library only needs the original import/activate/save-profile explanation. | Category setup, plain Save, Rename, Copy, asset export, unsaved guards and portable-package import/export have distinct roles. |
| Mac beta builds are unsigned. | Current updater-enabled Mac releases are signed/notarized; Windows installers remain unsigned. |
| Old videos describe the current interface. | Current screenshots lead the homepage. June videos are collapsed, labelled historical and manually playable, with no autoplay. |

## Coverage and source evidence

Paths below refer to the application source checkout; they are maintainer references, not instructions for testers to edit files. Implementation and existing regression tests were used where old documentation or unused translation keys contradicted current behavior.

| Area and updated guides | Evidence inspected |
| --- | --- |
| Entry workflow: `intro`, all Getting Started guides | Current app routes/UI; source history; runtime/session lifecycle; installer/update implementation. |
| Event: all five guides; Germany/date filters, explicit Excel refresh, OVS, header refresh | `ui/src/sections/ImportSection.jsx`, `ui/src/app/use-event-refresh.js`, `ui/src/app/event-refresh.js`, `src/core/auto-refresh.mjs`, `src/services/import-state-service.mjs`, `test/event-refresh.test.mjs`. |
| Quick Check: all three guides; correction scope, exclusions, phase/group authority | `src/server/review-actions.mjs`, `src/services/certificate-service.mjs`, current Quick Check UI and behavior contracts. |
| Studio overview/library; sample setup, save/rename/copy and categories | `ui/src/sections/TemplateSection.jsx`, `src/services/template-service.mjs`, `src/services/sample-import-service.mjs`, `src/certificates/pdf-sample-import.mjs`, `test/template-copy.test.mjs`, `test/template-rename.test.mjs`. |
| Studio placeholders and preview selection | `src/core/certificate-placeholders.mjs`, `src/core/certificate-document-fields.mjs`, `ui/src/studio/preview-selection.js`, `ui/src/studio/StudioPreviewSelection.jsx`, `ui/src/studio/mapping-inspection.js`, EN/DE source labels. |
| Studio layout, bulk edits, alignment, locking and image export | `ui/src/studio/StudioEditor.jsx`, `ui/src/sections/StudioSelectionTools.jsx`, `ui/src/studio/StudioRibbonPanels.jsx`, `test/template-asset-download.test.mjs`, current rendered editor. |
| Layout boxes and preprinted paper | `src/certificates/layout-boxes.mjs`, `ui/src/studio-layout-box-utils.js`, `test/studio-layout-boxes.test.mjs`, `test/preprinted-artwork.test.mjs`, preprinted-paper UI text. |
| Template packages, fonts and migration | `src/certificates/template-bundle.mjs`, `src/certificates/studio-document.mjs`, `test/template-bundle.test.mjs`, `test/template-system-fonts.test.mjs`, `test/template-compatibility.test.mjs` and historical fixtures. |
| Produce: all five guides; quantity/order/scope, lists, preview/save/print, calibration | `ui/src/export/ProduceControls.jsx`, `ui/src/app/use-pdf-output.js`, `src/core/certificate-copies.mjs`, `test/certificate-copies-pdf.test.mjs`, `src/services/pdf-export-service.mjs`, `src/services/calibration-service.mjs`. |
| Settings: all four guides; refresh, import label policy, updates, diagnostics/storage | `ui/src/sections/ConfigurationPanel.jsx`, `src/services/support-service.mjs`, `src/desktop/desktop-updater.mjs`, current Settings UI. |
| Reference and troubleshooting: all four guides | Cross-checked against the above implementations, lifecycle contracts and current controls. Historical unsupported workflows are no longer recommended. |

New Studio guides: `design-samples`, `preview-data`, `layout-boxes`, `preprinted-paper`, `sharing-templates`. Both editions link these guides from the basic workflow, overview, related settings and troubleshooting pages.

## Media and navigation

- Replaced the five main screenshots: Event, Quick Check, Produce, Studio and Settings.
- Added a mapping-checker screenshot demonstrating an explicitly selected class and entry.
- Captured the current built app against a separate temporary runtime containing only fictional names, clubs, competition data and demo templates. No real event, user template or private user path was used in new screenshots.
- Shared English-interface screenshots have translated alt text/captions; the introduction explains the shared interface language.
- Kept the old video files and their URLs available, but marked their homepage section as June 2026 historical material. They no longer autoplay or lead the current instructions. The recordings themselves have not been remade.
- Preserved existing guide URLs/anchors and added the new guides to both sidebars. Existing download-page work is retained.
- Added documentation-maintenance notes to both READMEs. Existing recording scripts load a real event by default and should not be reused unchanged for public recordings.

## Validation

Completed validation:

- Localization source checks: 34 matching guide pairs, 174 matching heading anchors, 75 homepage messages and 23 download-page messages.
- All 135 original English heading anchors remain available; existing German anchors match them. No existing guide URLs were removed.
- 21 localization/validator tests and four signed-download-feed tests pass. Updated two content-dependent test fixtures and made no-op fixture edits fail explicitly.
- TypeScript checking and the complete English/German production build pass.
- Built-site validator checks 72 localized guide/home/download pages and 170 local media references. An additional link sweep resolves all 2,292 local navigation/document links and fragments across 74 generated HTML files, including the two 404 pages.
- Rendered browser checks cover eight key guides in four desktop/mobile, English/German, light/dark combinations (32 guide checks). Images, navigation, locale switching, content, console errors and horizontal overflow were checked.
- The expanded lifecycle table revealed a mobile overflow in the existing table CSS. Tables now scroll within their available width and allow header wrapping. The homepage's outline-link contrast was also corrected after visual inspection.
- An additional four homepage checks verify the final outline-link contrast/hover states, loaded lazy images and responsive width after the styling correction.
- Rebuilt the app UI for documentation capture. Captured and visually inspected five replacement screenshots and the new mapping-checker screenshot using an isolated fictional-data runtime.
- Reused one preview port, stopped the temporary app server afterwards and closed automated browser contexts. No installer was rebuilt or published during this audit.

Source/test inspection supports the behavioral audit; it is not represented as rerunning the complete application regression suite or testing a physical printer. Desktop native dialogs and real installed-app upgrades were not exercised by the documentation browser checks.

## Future update checklist

1. For each app release, list user-visible changes since the documented baseline; compare both guides and troubleshooting against the changed code and UI.
2. Treat refresh/correction persistence, scoring authority, saved-file lifetime and print behavior as documentation contracts. Review these whenever their implementations change.
3. Update English and German together. Preserve guide URLs and anchors; use relative links between guides so the selected language is retained.
4. Recheck creation, copy, save, rename, import/export and missing-font instructions when the template format or editor changes. Do not promise that future packages will open in older apps.
5. Replace affected screenshots with fictional data. Label old videos explicitly or remake them; never silently present historical UI as current.
6. Run localization tests, type checking, the full bilingual build, link/media checks and desktop/mobile rendered checks. Confirm the installer links still come from the verified update feed.
7. Record the new app/version baseline and remaining limitations in this report or a subsequent dated audit. Automated validators check structure; they cannot prove that prose matches app behavior.
