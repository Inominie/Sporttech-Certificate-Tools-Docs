---
sidebar_position: 1
---

# Common issues

## The app opens empty

Each new session starts without a loaded event or manual corrections. Reload the source. Saved templates, settings and saved/printed PDFs should still be available. If those are missing, check runtime paths in Settings and contact support before deleting app data.

## macOS blocks the app

Current Mac installers are signed and notarized. Download the current DMG from the official download page, drag the app into Applications and run that copy. Do not launch it from inside the DMG. Older unsigned betas may have shown Gatekeeper warnings.

If a current official download is blocked or reported as damaged, redownload it and include the exact message and version when contacting support. Do not disable system security or bypass a failed update verification.

## Windows SmartScreen appears

The Windows installer is unsigned. Choose **More info → Run anyway** only for a trusted project download. If a club policy blocks installation, ask its administrator. In-app download verification does not remove Windows' unsigned-installer warning.

## Offline OVS discovery finds nothing

Check that the OVS server is running, both computers are on the same reachable network and the server exposes HTTP on port `9002`. Try the known server URL manually. Local discovery can be blocked by network/firewall rules. A Sporttech Excel export is an alternative.

## Preview PDF is unavailable

Load an event, choose valid entries and a saved template of the matching category. Resolve unassigned mappings, layout-box overflow and missing team quantities. Check the error message and available storage. Wait for a new preview after changing settings; stale output is not a safe fallback.

## Printed content is shifted

Check paper size, actual size/100% scale and printer margins. Use [print calibration](../produce/print-calibration.md) for a consistent offset. For preprinted paper, align the reference image and mark it as already printed so it is not included twice.

## A saved PDF already exists

Review the name/overwrite prompt. Choose a different name or confirm replacement deliberately. Existing retained outputs are not temporary previews. Keep required copies elsewhere before cleaning up storage.

## Word sample import asks for LibreOffice

Export the document as PDF in Word and import that PDF as a [design sample](../certificate-studio/design-samples.md). Alternatively, install LibreOffice for direct Word import. Saved Studio templates do not need Word or LibreOffice to print.

## A field is missing or shows the wrong value

In Studio, check the selected class and entry, template category and **Real data** mode. Open **Check mappings**. Look for an unassigned source, a genuinely empty value, a visibility condition or an unused team slot. Check both the label and data source: renaming a placeholder does not remap it.

For a hard-to-select item, use the element selector. Lock large background images to stop accidental selection. Check text colour, layer order and box dimensions. Scanned/outlined sample text may be part of an image rather than an editable field.

## Save is disabled or an exported template looks older

Save is enabled only when the template has changes. Use Rename for a title change and Copy for a new design. Export uses the saved version; save current edits before exporting. See [template library](../certificate-studio/template-library.md).

## Artwork disappears from the PDF

If it is marked **Already on preprinted paper**, this is intentional. Studio shows it for design, but generated previews and final PDFs omit it. To create a complete digital certificate, use a template copy with that option disabled.

## Data or corrections seem outdated

Check the header's last successful refresh and any error. Auto-refresh applies to online/OVS sources; Excel requires an updated workbook. Same-event corrections override imported certificate text until reset. A new event, new file import or restart clears corrections. See [auto-refresh](../event/auto-refresh.md).

## I need help with an update or another error

Follow [update troubleshooting](../settings/checking-for-updates.md#if-an-update-fails). For other issues, include the app version, action, exact error and a screenshot without unnecessary personal data. Review a [support bundle](../settings/support-bundles.md) before sharing it privately.
