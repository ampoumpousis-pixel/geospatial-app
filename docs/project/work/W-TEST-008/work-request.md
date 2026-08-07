# W-TEST-008 — Work Request

## Metadata

| Work ID | W-TEST-008 |
| Title | Replace session-based API throttling with a token-bucket rate limiter |
| Requester | Human |
| Created | 2026-08-06 |
| Status | Draft |
| Version | 1.0 |
| Has User-Facing Surface | No — backend-only (Django DRF throttling infrastructure; no pages, forms, views, or UI affected) |

## Intent

Replace the current DRF default per-user throttling with a configurable token-bucket rate limiter applied across all API views, preserving the existing 401/429 contract for API clients.

## Expected Outcome

- A reusable token-bucket throttling class is available in the backend
- All API views apply the new limiter (per-user default budget)
- Existing API clients observe the same 429 shape with a Retry-After header
- No frontend change is required; API response contracts are unchanged

## Scope

**Affected area(s):**
- Backend (Django DRF throttling infrastructure)

**Known constraints:**
- No frontend change; no UI surface affected

## Acceptance Criteria

- **AC-WTEST008-001:** A configurable token-bucket throttle class exists and is applied as the default across API views.
- **AC-WTEST008-002:** API clients still receive 429 with a `Retry-After` header when the budget is exhausted.
- **AC-WTEST008-003:** Existing per-user default budgets remain enforced after the change.

## Escalation Flags

Architecture-level change: new rate-limiting mechanism across all API views, affecting the platform's public API contract posture. Requires technical design (Level 3).
