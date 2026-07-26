# W-TEST-006 — Work Request

## Metadata

| Work ID | W-TEST-006 |
| Title | Add data export for resource metadata as CSV |
| Requester | Human |
| Created | 2026-07-26 |
| Status | Draft |
| Version | 1.0 |

## Intent

Add a button on the resource list page that lets users download resource metadata as a CSV file.

## Expected Outcome

- CSV export button available on the resource list page
- Clicking the button downloads a CSV file of resource metadata
- No existing functionality affected

## Scope

**Affected area(s):**
- frontend (export button, download handling)
- Possibly backend (if no export endpoint exists yet)
- Possibly infrastructure (none expected)

**Known constraints:**
- Must maintain existing list page behaviour

## Acceptance Criteria

- **AC-WTEST-006-001:** CSV export button is visible on the resource list page
- **AC-WTEST-006-002:** Clicking the button triggers a download
- **AC-WTEST-006-003:** Downloaded file contains valid CSV with resource metadata
- **AC-WTEST-006-004:** Existing list behaviour is unchanged
