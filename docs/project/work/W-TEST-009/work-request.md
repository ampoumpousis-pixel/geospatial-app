# W-TEST-009 — Work Request

## Metadata

| Work ID | W-TEST-009 |
| Title | Introduce a shared client-side data-fetching layer in the frontend |
| Requester | Human |
| Created | 2026-08-06 |
| Status | Draft |
| Version | 1.0 |
| Has User-Facing Surface | Yes — frontend architecture change with user-visible effects (loading/error/empty states across pages) |

## Intent

Introduce a centralized client-side data-fetching layer in the frontend (shared query cache with retry, cancellation, and invalidation) to replace per-component direct API calls, starting with the home page.

## Expected Outcome

- A shared data-fetching layer is available to frontend components
- The home page SystemInfo component consumes it (loading/error/empty states)
- No backend change; API contracts unchanged

## Scope

**Affected area(s):**
- Frontend (application data-fetching architecture)

**Known constraints:**
- Backend untouched; API response contracts unchanged
- No new third-party runtime dependency beyond what the project already installs

## Acceptance Criteria

- **AC-WTEST009-001:** A shared client-side data layer exists with retry and invalidation semantics.
- **AC-WTEST009-002:** The home page uses it and renders loading/error/empty states.
- **AC-WTEST009-003:** No backend source is read or modified.

## Escalation Flags

Architecture-level: new client-side data layer across the frontend, affecting how all pages fetch data. Requires technical design (Level 3).
