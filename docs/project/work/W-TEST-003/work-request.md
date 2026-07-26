# W-TEST-003 — Work Request

## Metadata

| Work ID | W-TEST-003 |
| Title | Add IP address to health check response |
| Requester | Human |
| Created | 2026-07-26 |
| Status | Draft |
| Version | 1.0 |

## Intent

Add the IP address of the incoming request to the health check endpoint response, so operators can quickly identify which server instance is responding.

## Expected Outcome

- Health check endpoint returns IP address alongside existing fields (version, db_status, uptime)
- Backward compatible — existing fields unchanged
- Zero infrastructure changes

## Scope

**Affected area(s):**
- backend

**Known constraints:**
- Must not change the response schema beyond adding one field
- Must not affect API contracts

## Acceptance Criteria

- **AC-WTEST-003-001:** Health check response includes `client_ip` field
- **AC-WTEST-003-002:** Existing fields (version, db_status, uptime) are unchanged
- **AC-WTEST-003-003:** No new dependencies introduced

## Technical Hints (optional)

**Possible files:**
- platform/backend/platform_info/views.py

**Known risks:**
- None — trivial backend change
