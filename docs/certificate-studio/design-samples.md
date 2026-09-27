---
sidebar_position: 3
---

# Start from a PDF or Word sample

A design sample gives you a starting layout. It does **not** infer which Sporttech value a name or marker represents. You decide those mappings in Studio.

## Recommended import workflow

1. If the design is in Word, save/export it as a PDF in Word.
2. In the Studio library, choose the action to start from a **PDF/Word sample**.
3. Select the file, then choose the template name and category.
4. Review the detected page, text, artwork and import notices before opening the draft.
5. Correct positions and fonts. Convert sample names or markers into placeholders and choose their data sources.
6. Select a class and entry in [real-data preview](preview-data.md), check the mappings, then save.

Use a single-page certificate sample; the import uses the first page of a multi-page document. The upload limit is 25 MB. PDF and `.docx` are supported; older `.doc` files need conversion first.

## Word and LibreOffice

Direct Word import needs LibreOffice installed locally to convert the document. If it is unavailable, export to PDF in Word and import that PDF instead. LibreOffice and Word are not required to use or print a saved Studio template.

Different Word renderers can change line breaks or fonts. Exporting the PDF from the program where the design looks correct is usually the most predictable starting point.

## What can be edited

Ordinary PDF text can become editable text fields. Recognizable placeholder markers can become unassigned placeholders or parts of a combined field. Images and decorative graphics are retained as image assets where possible.

PDFs do not always contain editable text. Scans, text converted to outlines, special effects or unsupported drawing operations may remain artwork or a page image. There is no OCR step. Inspect import notices and recreate affected text in Studio when needed; decorative vector graphics are not a full vector-editing document.

Fixed text from a sample can still contain a real athlete's name. Replace it with the correct mapping and check the package before sharing it.

## After import

The saved Studio template contains the layout and copied assets it needs. The original sample is no longer required for printing. Keep the original separately if you want to reimport it later. To share the finished design, use [Studio export](sharing-templates.md), not the sample PDF.
