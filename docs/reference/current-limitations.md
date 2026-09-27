---
sidebar_position: 1
---

# Current limitations

## Distribution

The app is in beta for testing clubs. Current Mac releases are Developer ID signed and notarized. Windows installers remain unsigned and may trigger SmartScreen or organizational restrictions. Use the [official download page](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/download) and [update guidance](../settings/checking-for-updates.md).

## Import

Event sources are Sporttech online, local OVS and Sporttech Excel exports. Direct OVS database import and other competition providers are not currently supported. Online events need internet access; OVS needs access to its local server. Excel refresh requires a newly exported workbook selected by the user.

## Printing

PDF and printer scaling can affect alignment. Test the actual paper and printer before a batch. Reference artwork for preprinted paper is omitted from the PDF itself, not hidden only at print time.

Automatic team quantities need a usable member count or an explicit quantity. Automatic copies repeat the same team certificate. Physical printing success cannot be inferred from submission to the operating system.

## Templates

Direct Word sample import needs LibreOffice; exporting from Word to PDF avoids that dependency. PDF sample import uses the first page and is not lossless. There is no OCR for scanned text, and some artwork remains an image rather than editable text.

Templates do not automatically guess Sporttech mappings. Font availability can differ between computers. Resolve missing fonts and review the layout after transfer. Layout boxes arrange text in a single column and cannot fit unlimited content; overflow must be resolved before output.

Portable Studio packages support migration of supported historical formats. An older app may reject newer packages. Keep exported backups and update the receiving app when required.

## Data

Sporttech remains authoritative for scoring and groups. Certificate corrections are session-only, even though they survive same-event refresh. Restarting or changing event clears them. Saved templates and saved/printed PDFs persist.

The installed desktop app is the supported operator workflow. A separately hosted multi-user web service is not part of this beta. See [behavior contracts](behavior-contracts.md) for persistence details.
