---
sidebar_position: 3
---

# Placeholders

Placeholders are dynamic text fields filled from imported Sporttech data when PDFs are generated.

<figure className="app-screenshot">
  <img src="/Sporttech-Certificate-Tools-Docs/img/app/certificate-studio.png" alt="Certificate Studio canvas showing certificate placeholders and the field inspector" />
  <figcaption>The canvas shows placeholders in context, while the inspector maps the selected placeholder to imported data.</figcaption>
</figure>

## Common placeholders

| Placeholder | Typical source |
| --- | --- |
| Given name | Athlete given name |
| Surname | Athlete surname |
| Representing | Club or representing organization |
| Class | Certificate class label |
| Total | Result total |
| Place | Result place |

## Mapping fields

Each placeholder should be mapped to a source field. Source fields come from the imported certificate data and can differ depending on whether the row is individual, synchronized, or team based.

## Preview values

When imported data is available, use preview values to verify that a placeholder produces the expected text before saving the template.

## Missing data

If a placeholder has no source data, the generated PDF may show a blank value or fallback text. Review warnings in Certificate Studio and Produce before final output.
