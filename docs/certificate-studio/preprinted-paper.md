---
sidebar_position: 8
---

# Design for preprinted paper

Use a scan or image of the club's preprinted certificate paper as a reference while designing. The app can show this artwork in Studio while leaving it out of every generated PDF.

## Set up reference artwork

1. Add the paper image, or select the artwork imported from your design sample.
2. Match its position and dimensions to the certificate page.
3. Set **Background · locked** to prevent accidental movement.
4. Enable **Already on preprinted paper** for that image.
5. Place names, results and other content in the available spaces and save the template.

Locking and the preprinted-paper flag serve separate purposes: locking protects geometry; the flag controls PDF output. If several images make up the printed artwork, mark each relevant image.

## What each view shows

| View or output | Reference artwork |
| --- | --- |
| Studio canvas and template thumbnail | Visible for design. |
| Generated PDF preview, including Studio PDF tests | Omitted. |
| Saved or printed PDF | Omitted. |
| Exported Studio template | Artwork and its preprinted-paper setting are retained. |

This is not a PDF layer that a printer may choose to ignore. The artwork is absent from the PDF itself, so the behavior is consistent across PDF viewers and printers.

## Before printing

Load the matching preprinted paper and check a single test sheet at the correct scale. Use [print calibration](../produce/print-calibration.md) for a printer offset. Produce reminds you when the selected template relies on preprinted paper.

For a complete digital certificate with the artwork included, make a copy of the template and turn off **Already on preprinted paper** on its reference images. Preview that copy before sharing the PDF.
