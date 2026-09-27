---
sidebar_position: 4
---

# Placeholders

A placeholder has a **label** for the editor and a **data source** for the certificate. Changing its label does not change its mapping. Add a placeholder from Insert, choose its source and label, then position the selected new field on the page.

## Common placeholders

Source lists are grouped consistently for single placeholders, combined text and the mapping checker. Available sources depend on the template category.

| Group | Examples |
| --- | --- |
| Event and class | Event title/subtitle, class, phase. |
| Single | Athlete name and club. |
| Synchronized | Athlete 1/2, individual clubs, combined names/clubs. |
| Team | Team name, member count, individual member names and clubs. |
| Results | Sporttech placement and score. |
| Date and document | Current date in numeric or written formats, template name, document page number/count. |

For synchronized certificates, **Synchronized club(s), without duplicates** shows a shared club once. If the clubs differ, it includes both. The individual and ordinary combined-club mappings remain available.

## Mapping fields

Select a field and choose its source in the inspector. To leave a placeholder deliberately empty, use the intentional-blank option; an unassigned field still needs a decision before final output.

A combined text field contains ordered fixed-text and placeholder parts. Each placeholder part has its own source. You can add parts manually, extend existing text or combine selected elements. Combining only fixed text produces one ordinary text field with editable line breaks. Combining placeholders or mixed text produces a combined field. Review spaces, punctuation and line breaks afterwards.

## Preview values

**Placeholder mode** shows labels, including labels for generated dates. **Real data** shows values for the chosen [class and entry](preview-data.md).

Current-date fields use the computer's local date at PDF generation, not the Sporttech event date. Written German/English date formats keep the selected language regardless of the app language. One generation time is used throughout a PDF. New time-of-day placeholders are no longer offered; older saved bindings remain compatible.

Document numbering means page number and total pages in the generated PDF, including extra copies. It is not the placement or a permanent certificate ID. Studio's single-certificate preview represents page 1 of 1.

## Missing data

Use **Check mappings** to distinguish unassigned sources, intentionally blank fields, missing entry values and fields hidden by a condition. An empty value may be correct for that entry, such as an unused team slot. Test a second entry with different names, clubs or team size before printing a whole class.
