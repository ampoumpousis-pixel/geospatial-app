# W-TEST-005 — Work Request

## Metadata

| Work ID | W-TEST-005 |
| Title | Add real-time WebSocket notifications for resource updates |
| Requester | Human |
| Created | 2026-07-26 |
| Status | Draft |
| Version | 1.0 |

## Intent

Add real-time WebSocket notifications so that when a resource is created, updated, or deleted, all connected users receive a live notification without refreshing the page.

## Expected Outcome

- WebSocket server broadcasts notifications on resource changes
- Frontend receives and displays notifications in real time
- Notifications group by resource type (create, update, delete)
- Users see notifications without page refresh

## Scope

**Affected area(s):**
- backend (WebSocket server, event broadcasting)
- frontend (WebSocket client, notification UI)
- infrastructure (ASGI server, WebSocket routing)

**Known constraints:**
- Must integrate with existing authentication
- Must not block existing REST API performance

## Acceptance Criteria

- **AC-WTEST-005-001:** WebSocket connection established on page load
- **AC-WTEST-005-002:** Notifications received within 1 second of resource change
- **AC-WTEST-005-003:** Existing REST endpoints continue to work unchanged
- **AC-WTEST-005-004:** Unauthenticated users cannot connect to WebSocket

## Escalation Flags

This work touches multiple domains, requires new infrastructure (ASGI), and involves architecture decisions around WebSocket library choice, connection management, and real-time event serialization.
