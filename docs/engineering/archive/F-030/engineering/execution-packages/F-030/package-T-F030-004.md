# Execution Package — T-F030-004

## Metadata

Origin:
  type: feature
  id: F-030
Task: T-F030-004
Package Version: 1.0
Owner: Frontend
Execution Type: Implementation
Status: Ready for Implementation
Created: 2026-08-07

Generated From: manifest 1.0, generator 1.1, at 2026-08-07

Source Artifact Versions:

| Source Artifact | Required Version |
|---|---|
| Feature Specification | 1.0 |
| Technical Design | 1.0 |
| Frontend Integration | 1.0 |
| Engineering Review | 1.0 |
| Engineering Approval | 1.0 |
| Implementation Plan | 1.0 |

Contract Dependencies:

| Contract | Required Version |
|---|---|
| API-F030-PROFILE | 1.0 |
| RT-F030-PROFILE | 1.0 |

---

## Task Definition

Task ID: T-F030-004

Summary: Create ProfilePage and ProfileDisplayNameForm components for the /profile page

Description:
Create the `/profile` page components per FIP P-F030-001, C-F030-001 (ProfilePage) and C-F030-002 (ProfileDisplayNameForm), and TD CMP-F030-002 / TD-F030-005 / FD-F030-002. ProfilePage owns the display value and the local state machine (`Idle → Loading → Loaded/Error`; `Loaded → Saving → Success/Error`) per TD §14 and FIP §13 (state: `displayName`, `phase`). On mount it fetches via `apiClient` `GET /api/profile/` (API-F030-001), renders Loading then Loaded with the current display name (AC-F030-003), handles the unset value without crashing (ES-F030-005), and shows Error on load failure with no stale value shown (AC-F030-006). ProfileDisplayNameForm presents the current value, captures the draft edit (`editValue` per FIP §13), and exposes a save action; ProfilePage submits via `apiClient` `PUT /api/profile/` (API-F030-002, FD-F030-003) and transitions Saving → Success on a confirmed save or Saving → Error on failure with the previously loaded value unchanged (AC-F030-006). A 401 from GET or PUT is handled by `apiClient`'s `auth:unauthorized` dispatch, which drives the F-001 login flow; the page renders no display name and allows no save (AC-F030-007, FIP §12). No global store is introduced (FD-F030-002); all profile HTTP goes through `apiClient`, not raw axios (FD-F030-003).

CONSTRAINTS (escalation fixtures): Do NOT resolve Open Contract Item 1 — do not assume a PUT success status code or response body and do not implement a refetch-after-save decision; treat a resolved (non-error) PUT as a confirmed save and escalate the success-indication/refetch mechanism as NEEDS CLARIFICATION. Do NOT resolve Open Contract Item 2 — do not add client-side maximum-length or empty-value validation; escalate as NEEDS CLARIFICATION.

Scope:
- In scope: Create `platform/frontend/src/pages/ProfilePage.tsx` and `platform/frontend/src/components/ProfileDisplayNameForm.tsx`; page-local state machine; GET/PUT via `apiClient`; 401 handled through `apiClient` `auth:unauthorized`.
- Out of scope: Route registration and home-page "Profile" link (T-F030-005); backend endpoints (T-F030-002); tests (T-F030-003); resolving either Open Contract Item.

Completion Criteria:
- [ ] ProfilePage and ProfileDisplayNameForm exist per the FIP component catalog and hierarchy (C-F030-001, C-F030-002).
- [ ] ProfilePage calls `GET /api/profile/` through `apiClient` on mount and transitions Loading → Loaded (renders the stored display name, including the unset state) or Loading → Error on failure (AC-F030-003, AC-F030-006, ES-F030-005).
- [ ] Submitting the form calls `PUT /api/profile/` through `apiClient` and transitions Saving → Success on a resolved PUT or Saving → Error on failure; the previously loaded value is unchanged in the Error state (AC-F030-004, AC-F030-006).
- [ ] A 401 from either endpoint relies on `apiClient`'s `auth:unauthorized` dispatch to route to the F-001 login flow; no display name is rendered and no save is allowed (AC-F030-007, FIP §12).
- [ ] No client-side maximum-length, character, or empty-value validation is added (Open Contract Item 2 remains open — escalated, not resolved).
- [ ] No PUT response-body parsing or refetch-after-save decision is implemented (Open Contract Item 1 remains open — escalated, not resolved).
- [ ] `npm run build` (tsc + vite build) and `npm run lint` pass.

---

## Technical Context

Technical Design References:
- Section 9 — CMP-F030-002 — ProfilePage (Frontend)
- Section 14 — Flows 1-3 and Profile page state transitions
- Section 11 — API-F030-001 — GET /api/profile/
- Section 11 — API-F030-002 — PUT /api/profile/
- Section 11 — Open Contract Items 1 and 2
- TD-F030-005 — Frontend profile page with explicit state machine

Frontend Integration References:
- Section 1 — Metadata — source version lock
- Section 2 — P-F030-001 — Profile Page (route /profile)
- Section 9 — Component Hierarchy — ProfilePage → ProfileDisplayNameForm
- Section 10 — C-F030-001 — ProfilePage; C-F030-002 — ProfileDisplayNameForm
- Section 11 — API-to-Component Mapping — API-F030-001/002 consumed by C-F030-001
- Section 12 — Permission Mapping — 401 → `auth:unauthorized` → F-001 login flow
- Section 13 — State Ownership — `displayName`, `phase`, `editValue`
- Section 15 — FD-F030-002 (page-local state machine), FD-F030-003 (all HTTP via apiClient), FD-F030-004 (open contract items remain open)
- NOTE: Frontend Integration sections are the authoritative source for page, route, component, and permission boundaries for this task.

Relevant Decisions (ADRs):
- ADR-003 — Django REST Framework (session authentication for the consumed endpoints)

Components Affected:
- `platform/frontend/src/pages/ProfilePage.tsx` — new
- `platform/frontend/src/components/ProfileDisplayNameForm.tsx` — new
- `apiClient` — reused service (not modified)

Dependencies:
- T-F030-002 — Backend GET/PUT /api/profile/ endpoints (API-F030-PROFILE) must be complete before this task.

---

## Standards Required

Standards:
- .ai-rules/team/engineering-standards.md — applicable sections for frontend implementation
- .ai-rules/project/geospatial-rules.md — applicable sections
- .ai-rules/security/security-rules.md — applicable sections (auth handling, no credential/data leakage)
- .ai-rules/testing/verification-rules.md — applicable sections (verification requirements)
- .ai-rules/organization/core-rules.md — core rules

---

## Context Guidance

Recommended Reads:
- `platform/frontend/src/services/apiClient.ts` — the single HTTP access path (CSRF header, 401 event dispatch)
- `platform/frontend/src/App.tsx` — existing route registration and home page content
- `platform/frontend/src/components/SystemInfo.tsx` — existing local-state data-fetching pattern to mirror

Avoid:
- `platform/backend/**` — backend domain; unrelated to this task
- `docs/**` — read-only planning artifacts
- `.ai-execution/**` — framework documents, read-only

---

## Ownership Boundary

Allowed Writes:
- `platform/frontend/src/pages/ProfilePage.tsx`
- `platform/frontend/src/components/ProfileDisplayNameForm.tsx`

Forbidden Writes:
- `platform/backend/**`
- `platform/frontend/src/App.tsx`
- `platform/frontend/vite.config.ts`
- `docs/**`
- `.ai-execution/**`
- `.ai-rules/**`

---

## Verification Requirements

Required Checks:

Static:
1. [ ] Run linter: `npm run lint`
2. [ ] Run type checker / build: `npm run build` (tsc + vite build)

Runtime:
3. [ ] Manual (with backend available): authenticated user opens `/profile`, sees current display name, edits and saves; failure path shows Error
4. [ ] Verify 401 from GET or PUT routes through `apiClient` `auth:unauthorized` to the F-001 login flow (AC-F030-007)
5. [ ] Verify no writes outside allowed directories

Additional Verification:
- [ ] No client-side maximum-length, character, or empty-value validation added (Open Contract Item 2 remains open — escalated as NEEDS CLARIFICATION, not resolved)
- [ ] No PUT response-body parsing or refetch-after-save decision implemented (Open Contract Item 1 remains open — escalated as NEEDS CLARIFICATION, not resolved)
