---
sidebar_position: 7
---

# Layout boxes for variable team sizes

A layout box keeps a set of text rows inside a defined area. It is useful for team member names: six possible names can share one region without leaving awkward empty slots when a team has fewer members.

## Create the box

1. Add the required team-member placeholders and map each to its own member slot.
2. Select the fields with Shift-click and create a layout box from the selection.
3. Position and resize the box on the certificate.
4. Set the row order, padding, gap and alignment in the inspector.
5. Enable **Hide empty rows** and test different teams in real-data preview.

A layout box arranges text rows in one column. It is not an arbitrary grid or a container for background images.

## Choose a layout mode

| Mode | Result |
| --- | --- |
| Centred stack | Rows keep their text size and spacing; the stack is positioned within the box. Useful for consistent names with more free space around smaller teams. |
| Evenly spaced rows | Visible rows are distributed through the available area. |
| Automatic font size | Text size adjusts within the chosen minimum and maximum to fit the available area. |

Use horizontal left/centre/right alignment and vertical top/middle/bottom alignment as appropriate. Padding controls the space inside the box edges; the row gap separates neighbouring rows.

## Empty rows and long names

Empty rows are evaluated using the selected real entry. Placeholder mode keeps the labels visible for editing. A row with literal text such as “Athlete:” is not empty simply because its mapped name is missing.

Long names can wrap. Automatic sizing does not shrink without limit: if the contents still cannot fit, an overflow warning prevents PDF generation rather than silently cutting off names. Increase the box, reduce padding/gaps or adjust the permitted font sizes.

## Edit or dissolve

Reorder, add or remove member rows in the layout-box inspector. Select an individual row when you need to change its data mapping. Dissolving the box keeps its fields and their mappings as separate elements at their current layout positions. Check the result before saving.
