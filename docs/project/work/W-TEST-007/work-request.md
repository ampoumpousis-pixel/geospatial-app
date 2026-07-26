# W-TEST-007 — Work Request

## Metadata

| Work ID | W-TEST-007 |
| Title | Add loading spinner while CSV download is processing |
| Requester | Human |
| Created | 2026-07-26 |
| Status | Draft |
| Version | 1.0 |

## Intent

Add a loading spinner to the resource list page that shows while a CSV download is processing, so users know the export is working.

## Expected Outcome

- Loading spinner appears when CSV export is triggered
- Spinner disappears when the download starts or completes
- No change to the download functionality itself
- Existing page behaviour unchanged

## Scope

**Affected area(s):**
- frontend

**Known constraints:**
- Must use existing spinner component if available
- Must not change download logic

## Acceptance Criteria

- **AC-WTEST-007-001:** Loading spinner visible during CSV export processing
- **AC-WTEST-007-002:** Spinner disappears when download begins
- **AC-WTEST-007-003:** Existing page functionality unchanged
