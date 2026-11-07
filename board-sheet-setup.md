# Community Board: Google Sheet setup

The Community Board at `/board` reads from a tab called **Board** in the main PRISM Google Sheet (the same sheet as Directory and Events). Changes appear on the site within about five minutes.

## Columns

Put these headers in row 1. Order doesn't matter and headers aren't case-sensitive.

| Header | Required | What goes in it |
|---|---|---|
| Status | Yes | `Published` to show it. Anything else (blank, `Pending`, `Draft`) keeps it hidden. |
| Type | Yes | `Ask` (the group is looking for something) or `Offer` (the group can provide it). |
| Category | Yes | `Space`, `Speaker`, `Reach`, `Sponsorship`, `Volunteers`, `Participants`. Anything else shows as Other. |
| Organisation (or Organization Name (English)) | Yes | The group's name. If it matches a Directory listing's English name exactly, the card links to that listing and shows its logo. |
| Title (English) | Yes | One line, e.g. "Venue for 80 people in March". |
| Title (Traditional Chinese) | No | |
| Title (Simplified Chinese) | No | |
| Description (English) | No | Details: dates, size, requirements. |
| Description (Traditional Chinese) | No | |
| Description (Simplified Chinese) | No | |
| Needed By (or Date) | No | For an Ask, the date it's needed; for an Offer, when it's available until. Past dates on Asks hide the post. |
| Posted | No | Date submitted. Used for sorting and default expiry. |
| Expires | No | Hide after this date. If blank, posts hide 60 days after Posted. |
| Contact | No | Email, a link, or a phone number (phone numbers open WhatsApp; 8-digit numbers get +852). |
| Link | No | An optional page with more detail. |
| Region | No | Shown as a label on the card. Trilingual answers like `Kowloon / 九龍 / 九龙` show in the visitor's language. |
| Featured | No | `Yes` to show it under ⭐ Featured on the homepage. |
| Submitted at | No | Written by Tally; used as the Posted date. |

Dates can be `d/m/yyyy` (like the Events tab) or `yyyy-mm-dd` (what Tally and Make.com usually write).

## Approving submissions

Point the Tally form (via Make.com) at this tab with Status left as `Pending`. To approve a post, change Status to `Published`. To take one down early, change it back or set Expires to a past date.

The Tally form is https://tally.so/r/KpePGX. Its link is set in `SUBMIT_FORM_URL` at the top of `src/app/board/BoardClient.tsx` and on the Get Involved page.
