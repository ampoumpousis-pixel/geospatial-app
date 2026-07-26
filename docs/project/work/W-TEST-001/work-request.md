# W-TEST-001 — Work Request

## Metadata

| Work ID | W-TEST-001 |
| Title | Change button hover colour |
| Requester | Human |
| Created | 2026-07-26 |
| Status | Draft |
| Version | 1.0 |

## Intent

Change the hover colour of the primary action button from #ccc (light grey) to #2563eb (blue).

## Expected Outcome

- Primary button turns blue (#2563eb) when hovered
- All other button styles remain unchanged
- No visual regressions on other UI elements

## Scope

**Affected area(s):**
- frontend

**Known constraints:**
- Must not change existing CSS approach
- Must not affect other button styles
- Must not change click behaviour or event handlers

## Acceptance Criteria

- **AC-WTEST-001-001:** Hover colour of primary button is #2563eb
- **AC-WTEST-001-002:** All other button styles unchanged
- **AC-WTEST-001-003:** No API, database, or infrastructure changes

## Technical Hints (optional)

**Possible files:**
- Relevant CSS file for button component

**Known risks:**
- None — straightforward CSS change
