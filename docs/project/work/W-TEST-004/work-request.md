# W-TEST-004 — Work Request

## Metadata

| Work ID | W-TEST-004 |
| Title | Add CSV export button to resource list |
| Requester | Human |
| Created | 2026-07-26 |
| Status | Draft |
| Version | 1.0 |

## Intent

Add a CSV export button to the resource list page. When clicked, the user sees a confirmation toast, then downloads the resource list data as a CSV file.

## Expected Outcome

- CSV export button visible on the resource list page
- Clicking the button shows a confirmation toast: "Export started"
- File download begins automatically after confirmation
- Existing list functionality unchanged

## Scope

**Affected area(s):**
- frontend

**Known constraints:**
- Must not change existing API contracts
- Must not affect existing list rendering or pagination

## Acceptance Criteria

- **AC-WTEST-004-001:** CSV export button is visible on the resource list page
- **AC-WTEST-004-002:** Clicking button shows confirmation toast
- **AC-WTEST-004-003:** File download starts after confirmation
- **AC-WTEST-004-004:** Existing list behaviour unchanged

## Technical Hints (optional)

**Possible files:**
- platform/frontend/src/components/resource-list/
- platform/frontend/src/components/toast/

**Known risks:**
- Toast component may need creation if not already present
