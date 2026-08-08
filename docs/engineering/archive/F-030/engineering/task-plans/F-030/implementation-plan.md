# F-030 — User Display Name — Implementation Plan

## Status and Versions

**Plan Status:** Complete
**Plan Version:** 1.0

**Source Package Versions:**
- Feature Specification: 1.0
- Technical Design: 1.0
- Frontend Integration: 1.0
- Engineering Review: 1.0 (Recommendation: READY FOR APPROVAL)
- Engineering Approval: 1.0 (Decision: APPROVED)

## Overview

F-030 delivers a self-service profile page at `/profile` where an authenticated user can view and update their display name, reached through a "Profile" link on the existing home page. The backend extends the `users` app with one additive nullable `display_name` field on `users.User` and two self-scoped endpoints (`GET`/`PUT /api/profile/`) that operate exclusively on `request.user` (ownership by construction, TD-F030-002). The frontend gains `ProfilePage` + `ProfileDisplayNameForm` wired to the existing `apiClient`, plus route registration and a home-page link in `App.tsx`.

Two contract details are deliberately open per the execution-milestone test contract (TD §11 Open Contract Items 1 and 2). They are approved fixtures and are **not** design gaps. They are recorded as open dependencies: the backend PUT task and the frontend form task escalate them as NEEDS CLARIFICATION rather than inventing defaults. The plan creates **no DGRs**.

Total tasks: **5** (3 backend, 2 frontend).

## Trace Bullet

Not part of any trace bullet. `docs/project/planning/trace-bullets.md` defines Trace Bullet 1 (Core Resource Lifecycle) and Trace Bullet 2 (Resource Publishing to GeoServer); F-030's profile surface is not on either path.

## Design Gap Returns

None. The two Technical Design Open Contract Items (§11) are approved execution-test fixtures, not design gaps, and do not produce DGRs.

## Resolved Design Gap Returns

N/A — no prior design gaps.

## Traceability

### Acceptance Criteria to Tasks

| Acceptance Criterion | Implementation Task(s) | Developer Verification |
|---|---|---|
| AC-F030-001 — `/profile` displays a profile page | T-F030-004, T-F030-005 | `npm run build`; manual: authenticated user navigates to `/profile` and the page renders |
| AC-F030-002 — Home page contains a "Profile" link to `/profile` | T-F030-005 | `npm run build`; manual: home page shows the "Profile" link and click navigates to `/profile` |
| AC-F030-003 — Stored display name shown on profile | T-F030-002, T-F030-003, T-F030-004 | Backend test: GET returns stored value; manual: page renders current display name on load |
| AC-F030-004 — New name persisted and shown with success indication | T-F030-002, T-F030-003, T-F030-004 | Backend test: PUT persists and GET reflects it; page shows Saving → Success on confirmed save (indication mechanism per Open Contract Item 1 — escalated) |
| AC-F030-005 — Another user's profile cannot be accessed | T-F030-002, T-F030-003 | Backend test: no request form accepts a user identifier; structural ownership review |
| AC-F030-006 — Fetch/update failure shows error; stored value unchanged | T-F030-002, T-F030-003, T-F030-004 | Backend test: failed PUT leaves value unchanged; manual: page shows Error state, no stale/partial value |
| AC-F030-007 — Unauthenticated user cannot view or update | T-F030-002, T-F030-003, T-F030-004 | Backend test: unauthenticated GET/PUT → 401 with no data; frontend: 401 → `auth:unauthorized` → F-001 redirect |

### Technical Design to Tasks

| Design Element | Task(s) |
|---|---|
| DM-F030-001 — `users.User.display_name` | T-F030-001 |
| API-F030-001 — GET /api/profile/ | T-F030-002, T-F030-003, T-F030-004 |
| API-F030-002 — PUT /api/profile/ | T-F030-002, T-F030-003, T-F030-004 |
| CMP-F030-001 — Profile API (Backend, `users` app) | T-F030-002 |
| CMP-F030-002 — ProfilePage (Frontend) | T-F030-004 |
| CMP-F030-003 — Home Page Profile Link | T-F030-005 |
| TD-F030-001 — Store `display_name` on `users.User` | T-F030-001 |
| TD-F030-002 — Self-scoped profile endpoints | T-F030-002, T-F030-003 |
| TD-F030-003 — Reuse DRF SessionAuthentication + IsAuthenticated | T-F030-002, T-F030-003 |
| TD-F030-004 — PUT full-field replace | T-F030-002, T-F030-003 |
| TD-F030-005 — Frontend profile page with explicit state machine | T-F030-004, T-F030-005 |
| TD §11 — Open Contract Items 1 and 2 (approved fixtures) | T-F030-002 (escalate), T-F030-003 (do not assert), T-F030-004 (escalate) |
| TD §14 — Runtime and Data Flows (Flows 1–3, state transitions) | T-F030-002, T-F030-004 |
| TD §17 — Security and Privacy | T-F030-002, T-F030-003 |
| TD §19 — Observability (logging, audit event) | T-F030-002 |
| TD §20 — Migration and Backward Compatibility | T-F030-001 (migration), T-F030-002 (URL registration) |
| TD §21 — Engineering Scenarios ES-F030-001..009 | T-F030-003 |

### Frontend Integration to Tasks

| FIP Element | Task(s) |
|---|---|
| P-F030-001 — Profile Page (`/profile`) | T-F030-004, T-F030-005 |
| P-F030-002 — Home Page (modified) | T-F030-005 |
| Route Map — new route `/profile` | T-F030-005 |
| C-F030-001 — ProfilePage | T-F030-004 |
| C-F030-002 — ProfileDisplayNameForm | T-F030-004 |
| §11 API-to-Component Mapping (API-F030-001/002) | T-F030-004 |
| §12 Permission Mapping (authenticated session gate; 401 → `auth:unauthorized`) | T-F030-004 (page), T-F030-002/T-F030-003 (backend enforcement) |
| §13 State Ownership (`displayName`, `phase`, `editValue`) | T-F030-004 |
| §15 FD-F030-001 — Local navigation only | T-F030-005 |
| §15 FD-F030-002 — Page-local state machine | T-F030-004 |
| §15 FD-F030-003 — All profile HTTP through apiClient | T-F030-004 |
| §15 FD-F030-004 — Open contract items remain open | T-F030-002, T-F030-004 |

---

## Tasks

### T-F030-001 — Add nullable display_name field to users.User with additive migration

**Description:** Extend the existing `users.User` model (`platform/backend/users/models.py`) with a display-only `display_name` attribute per DM-F030-001 and TD-F030-001. The field is a nullable text column (`null=True`, default `None`) so the unset state is valid at the storage layer (ES-F030-005); it is distinct from `username` and never affects sign-in or credentials (BR-F030-003, EAF-F030-003). Generate the additive migration (`0002`) that adds the `users_user.display_name` column; no backfill and no default value (existing rows remain unset, per TD §20). **Do NOT define validation constraints** for the field (no maximum length, no character restrictions, no empty-value policy) — those are Open Contract Item 2 and must be escalated as NEEDS CLARIFICATION, not resolved here. Do not add any other profile field (TC-F030-005) and do not alter authentication, session, or credential behavior (TC-F030-004).

**Files affected:**
- `platform/backend/users/models.py` (modified)
- `platform/backend/users/migrations/0002_user_display_name.py` (new — generated)

**Dependencies:** none

**Technical Design References:**
- DM-F030-001 — `users.User.display_name` (§10)
- TD-F030-001 — Store `display_name` on `users.User`
- §20 Migration and Backward Compatibility
- §11 Open Contract Item 2 (validation constraints — remain open)

**Acceptance criteria addressed:** AC-F030-003 (storage prerequisite), AC-F030-004 (storage prerequisite)

**Completion criteria:**
- [ ] `users.User` gains a `display_name` text field that is nullable (`null=True`) with no default and no max_length/character/empty-value validation constraints (Open Contract Item 2 remains open; nothing resolved).
- [ ] Migration `0002_user_display_name` adds the additive nullable `users_user.display_name` column with no backfill; reverse migration drops the column (TD §20 rollback safety).
- [ ] `python manage.py makemigrations users` produces exactly the expected `0002` migration; `python manage.py migrate` applies cleanly on a database containing existing users (EA-F030-003).
- [ ] No authentication, session, or credential code is modified (TC-F030-004).

**Developer verification:**
- [ ] `python manage.py makemigrations users` and `python manage.py migrate`
- [ ] `python manage.py showmigrations users` shows `0002` applied
- [ ] `python manage.py check`

---

### T-F030-002 — Implement self-scoped GET/PUT /api/profile/ endpoints with URL registration and observability

**Description:** Implement the profile API in the `users` app per CMP-F030-001, API-F030-001, API-F030-002, and TD-F030-002/003/004. Create a DRF serializer that reads/writes `display_name` and API views for `GET` and `PUT /api/profile/` that resolve the subject exclusively from `request.user` — no user identifier in path, query, or body (structural ownership, TD-F030-002, AC-F030-005). Apply DRF `SessionAuthentication` + `IsAuthenticated` (TD-F030-003): unauthenticated GET/PUT return 401 with no user data (AC-F030-007); PUT is a mutating request requiring a valid CSRF token (supplied by the frontend `apiClient`). PUT performs a single atomic full-field replace of the current user's `display_name` (TD-F030-004); on any failure the stored value is unchanged (AC-F030-006). Malformed payloads (missing field, wrong type, non-JSON) are rejected with platform validation errors and never touch storage (ES-F030-008). Register the endpoint at `/api/profile/` in the project URL configuration (`config/urls.py` per TD §5 Affected Boundaries and §20) so it is reachable only at `/api/profile/` and does not create an unintended `/api/auth/profile/` route. Implement §19 observability: structured logging of GET/PUT outcomes (`user_id`, duration; never the display-name value) and an audit event `profile_display_name_updated` (`user_id`, timestamp; value not logged). Register the endpoints in the OpenAPI schema via the existing drf-spectacular configuration.

**CONSTRAINTS (escalation fixtures):** Do **NOT** resolve the PUT success response contract (Open Contract Item 1) — do not choose a success status code, response body, or refetch behavior; escalate as NEEDS CLARIFICATION. Do **NOT** resolve `display_name` validation constraints (Open Contract Item 2) — do not add maximum-length, character, or empty-value validation rules; escalate as NEEDS CLARIFICATION. Do not introduce a new metrics dependency for §19 counters (TC-F030-003).

**Files affected:**
- `platform/backend/users/serializers.py` (new)
- `platform/backend/users/views.py` (new)
- `platform/backend/users/urls.py` (modified)
- `platform/backend/config/urls.py` (modified)

**Dependencies:** T-F030-001

**Technical Design References:**
- API-F030-001 — GET /api/profile/ (§11)
- API-F030-002 — PUT /api/profile/ (§11)
- §11 Open Contract Items 1 and 2
- CMP-F030-001 — Profile API (Backend, §9)
- TD-F030-002 — Self-scoped profile endpoints
- TD-F030-003 — Reuse DRF SessionAuthentication + IsAuthenticated
- TD-F030-004 — PUT full-field replace
- §17 Security and Privacy
- §19 Observability
- §20 Migration and Backward Compatibility (URL registration)
- §5 Affected Boundaries (`config/urls.py`)

**Acceptance criteria addressed:** AC-F030-003, AC-F030-004, AC-F030-005, AC-F030-006, AC-F030-007

**Completion criteria:**
- [ ] `GET /api/profile/` returns 200 with `{"display_name": <stored value>}` for an authenticated user, resolving `request.user` only; the unset state is represented as JSON `null` per platform DRF convention (AD-F030-001 advisory).
- [ ] `PUT /api/profile/` persists the submitted `display_name` in a single atomic write on `request.user`'s row and is idempotent; on any failure the previously stored value is byte-for-byte unchanged (AC-F030-006, TD-F030-004).
- [ ] No request form (path, query, or body) accepts a user identifier, so no cross-user access is expressible (AC-F030-005, TD-F030-002).
- [ ] Unauthenticated GET and PUT return 401 with no user data (AC-F030-007).
- [ ] Malformed payloads (missing field, wrong type, non-JSON) are rejected with platform validation errors and cause no storage mutation (ES-F030-008).
- [ ] Endpoint is registered at `/api/profile/` and appears in the OpenAPI schema (drf-spectacular); no unintended `/api/auth/profile/` route is exposed.
- [ ] GET/PUT outcomes are logged with `user_id` and duration without the display-name value; update events log `event=profile_display_name_updated` without the value (TD §19).
- [ ] The PUT success response contract (Open Contract Item 1) is **NOT** resolved: no success status code, response body, or refetch behavior is invented; the item is escalated as NEEDS CLARIFICATION.
- [ ] `display_name` validation constraints (Open Contract Item 2) are **NOT** resolved: no maximum length, character restrictions, or empty-value policy are added; the item is escalated as NEEDS CLARIFICATION.

**Developer verification:**
- [ ] `python manage.py check`; server starts
- [ ] Unauthenticated `curl /api/profile/` GET and PUT → 401 with no data
- [ ] Authenticated GET returns the stored `display_name`; authenticated PUT persists the value and a subsequent GET reflects it
- [ ] `GET /api/schema/` includes the profile endpoints

---

### T-F030-003 — Write backend tests for the profile API

**Description:** Write backend tests for the profile API per TD §21 Engineering Scenarios (ES-F030-001 through ES-F030-009) and the API-F030-PROFILE contract, in the existing `platform/backend/users/tests` package. Tests must cover: authenticated GET returns the stored `display_name` and the unset state for a user who never saved (ES-F030-005); PUT persists the submitted value and a subsequent GET reflects it (AC-F030-004, BR-F030-002); PUT is idempotent (TD-F030-004); a failed or rejected PUT leaves the stored value unchanged (AC-F030-006); unauthenticated GET and PUT return 401 with no data (AC-F030-007); no request form accepts a user identifier, making cross-user access structurally impossible (AC-F030-005, ES-F030-004); malformed payloads are rejected without storage mutation (ES-F030-008); concurrent PUTs converge to one submitted value without torn writes (ES-F030-007). Tests MUST **NOT** assert the PUT success response contract (success status code, response body, or refetch behavior — Open Contract Item 1) and MUST **NOT** assert maximum-length, character, or empty-value validation behavior (Open Contract Item 2).

**Files affected:**
- `platform/backend/users/tests/test_profile_api.py` (new)

**Dependencies:** T-F030-002

**Technical Design References:**
- ES-F030-001..009 — Engineering Scenarios (§21)
- API-F030-001, API-F030-002 (§11)
- TD-F030-002 — Self-scoped profile endpoints
- TD-F030-003 — Reuse DRF SessionAuthentication + IsAuthenticated
- TD-F030-004 — PUT full-field replace
- §17 Security and Privacy

**Acceptance criteria addressed:** AC-F030-003, AC-F030-004, AC-F030-005, AC-F030-006, AC-F030-007

**Completion criteria:**
- [ ] Test suite covers authenticated GET (stored and unset states), PUT persistence and idempotency, failure-leaves-value-unchanged, unauthenticated 401 for GET and PUT, structural cross-user inaccessibility, malformed payload rejection without storage mutation, and concurrent PUT convergence.
- [ ] No test asserts a specific PUT success status code, response body, or refetch behavior (Open Contract Item 1 remains open).
- [ ] No test asserts maximum-length, character-restriction, or empty-value validation behavior (Open Contract Item 2 remains open).
- [ ] `python manage.py test users` (or `pytest`) passes.

**Developer verification:**
- [ ] `python manage.py test users` passes

---

### T-F030-004 — Create ProfilePage and ProfileDisplayNameForm components for the /profile page

**Description:** Create the `/profile` page components per FIP P-F030-001, C-F030-001 (ProfilePage) and C-F030-002 (ProfileDisplayNameForm), and TD CMP-F030-002 / TD-F030-005 / FD-F030-002. ProfilePage owns the display value and the local state machine (`Idle → Loading → Loaded/Error`; `Loaded → Saving → Success/Error`) per TD §14 and FIP §13 (state: `displayName`, `phase`). On mount it fetches via `apiClient` `GET /api/profile/` (API-F030-001), renders Loading then Loaded with the current display name (AC-F030-003), handles the unset value without crashing (ES-F030-005), and shows Error on load failure with no stale value shown (AC-F030-006). ProfileDisplayNameForm presents the current value, captures the draft edit (`editValue` per FIP §13), and exposes a save action; ProfilePage submits via `apiClient` `PUT /api/profile/` (API-F030-002, FD-F030-003) and transitions Saving → Success on a confirmed save or Saving → Error on failure with the previously loaded value unchanged (AC-F030-006). A 401 from GET or PUT is handled by `apiClient`'s `auth:unauthorized` dispatch, which drives the F-001 login flow; the page renders no display name and allows no save (AC-F030-007, FIP §12). No global store is introduced (FD-F030-002); all profile HTTP goes through `apiClient`, not raw axios (FD-F030-003).

**CONSTRAINTS (escalation fixtures):** Do **NOT** resolve Open Contract Item 1 — do not assume a PUT success status code or response body and do not implement a refetch-after-save decision; treat a resolved (non-error) PUT as a confirmed save and escalate the success-indication/refetch mechanism as NEEDS CLARIFICATION. Do **NOT** resolve Open Contract Item 2 — do not add client-side maximum-length or empty-value validation; escalate as NEEDS CLARIFICATION.

**Files affected:**
- `platform/frontend/src/pages/ProfilePage.tsx` (new)
- `platform/frontend/src/components/ProfileDisplayNameForm.tsx` (new)

**Dependencies:** T-F030-002

**Technical Design References:**
- CMP-F030-002 — ProfilePage (Frontend, §9)
- TD-F030-005 — Frontend profile page with explicit state machine
- §14 Flows 1–3 and Profile page state transitions
- §11 Open Contract Items 1 and 2

**Frontend Integration References:**
- P-F030-001 — Profile Page
- C-F030-001 — ProfilePage; C-F030-002 — ProfileDisplayNameForm (§10)
- §9 Component Hierarchy
- §11 API-to-Component Mapping (API-F030-001/002)
- §12 Permission Mapping (401 → `auth:unauthorized`)
- §13 State Ownership (`displayName`, `phase`, `editValue`)
- §15 FD-F030-002, FD-F030-003, FD-F030-004

**Acceptance criteria addressed:** AC-F030-001, AC-F030-003, AC-F030-004, AC-F030-006, AC-F030-007

**Completion criteria:**
- [ ] ProfilePage and ProfileDisplayNameForm exist per the FIP component catalog and hierarchy (C-F030-001, C-F030-002).
- [ ] ProfilePage calls `GET /api/profile/` through `apiClient` on mount and transitions Loading → Loaded (renders the stored display name, including the unset state) or Loading → Error on failure (AC-F030-003, AC-F030-006, ES-F030-005).
- [ ] Submitting the form calls `PUT /api/profile/` through `apiClient` and transitions Saving → Success on a resolved PUT or Saving → Error on failure; the previously loaded value is unchanged in the Error state (AC-F030-004, AC-F030-006).
- [ ] A 401 from either endpoint relies on `apiClient`'s `auth:unauthorized` dispatch to route to the F-001 login flow; no display name is rendered and no save is allowed (AC-F030-007, FIP §12).
- [ ] No client-side maximum-length, character, or empty-value validation is added (Open Contract Item 2 remains open — escalated, not resolved).
- [ ] No PUT response-body parsing or refetch-after-save decision is implemented (Open Contract Item 1 remains open — escalated, not resolved).
- [ ] `npm run build` (tsc + vite build) and `npm run lint` pass.

**Developer verification:**
- [ ] `npm run build` and `npm run lint`
- [ ] Manual (with backend available): authenticated user opens `/profile`, sees current display name, edits and saves; failure path shows Error

---

### T-F030-005 — Register /profile route and add the home page Profile link in App.tsx

**Description:** Integrate the profile surface into the application per FIP P-F030-002, FIP §3 Route Map, FIP §4 Navigation Changes, FD-F030-001, and TD CMP-F030-003. In `platform/frontend/src/App.tsx`, register a new `/profile` route that renders ProfilePage (AC-F030-001) and add a single visible "Profile" link element inside the existing home page content on the `/` route that navigates to `/profile` (AC-F030-002). The home page gains no other behavior (BR-F030-004, TC-F030-006); no app shell, header, sidebar, or navigation infrastructure is introduced (FD-F030-001). Verify the existing `vite.config.ts` `/api` proxy already routes `/api/profile/` to the backend (target `http://backend:8000`) — no proxy change is expected; adjust only if the profile route cannot reach the backend. Do not modify any other route or component.

**Files affected:**
- `platform/frontend/src/App.tsx` (modified)
- `platform/frontend/vite.config.ts` (verify only; no change expected)

**Dependencies:** T-F030-004

**Technical Design References:**
- CMP-F030-003 — Home Page Profile Link (§9)
- TD-F030-005 — Frontend profile page with explicit state machine and home-page link
- §5 Affected Boundaries (frontend routing)

**Frontend Integration References:**
- P-F030-002 — Home Page (modified)
- §3 Route Map (`/profile`)
- §4 Navigation Changes ("Profile" link)
- §15 FD-F030-001 — Local navigation only

**Acceptance criteria addressed:** AC-F030-001, AC-F030-002

**Completion criteria:**
- [ ] `App.tsx` registers a `/profile` route that renders ProfilePage (AC-F030-001).
- [ ] The `/` route home page content contains a visible "Profile" link that navigates to `/profile` (AC-F030-002).
- [ ] No other home page behavior, global navigation, or app shell change is introduced (BR-F030-004, FD-F030-001).
- [ ] The existing vite `/api` proxy covering `/api/profile/` is verified (no change required); no other proxy target is altered.
- [ ] `npm run build` and `npm run lint` pass.

**Developer verification:**
- [ ] `npm run build` and `npm run lint`
- [ ] Manual: home page shows the "Profile" link; click navigates to `/profile` and the page renders

---

## Execution Order

1. T-F030-001 — Backend model field + migration (no dependencies)
2. T-F030-002 — Backend profile API (depends on T-F030-001)
3. T-F030-003, T-F030-004 — Parallel work (both depend on T-F030-002)
4. T-F030-005 — Frontend route registration + home link (depends on T-F030-004)

## Dependency Graph

```
T-F030-001
   └── T-F030-002
          ├── T-F030-003
          └── T-F030-004
                 └── T-F030-005
```

Acyclic: verified. Every dependency ID references an existing task.

## Parallel Group Validation

| Parallel Group | Tasks | Write Sets Disjoint? | No Dependencies Within Group? |
|---|---|---|---|
| G1 | T-F030-003, T-F030-004 | Yes — backend test files (`users/tests/**`) vs frontend component files (`src/pages/ProfilePage.tsx`, `src/components/ProfileDisplayNameForm.tsx`) | Yes — no direct or transitive dependency between T-F030-003 and T-F030-004 |

## Notes

- **Open Contract Items (approved fixtures, NOT DGRs):** TD §11 Open Contract Item 1 (PUT success response contract) and Open Contract Item 2 (`display_name` validation constraints) remain open by design. T-F030-002 and T-F030-004 escalate both as NEEDS CLARIFICATION and invent no defaults; T-F030-003 and the frontend verification steps assert none of the open behaviors. The error path (stored value unchanged on failure — AC-F030-006) is contract-independent and fully specified.
- **Non-blocking advisories:** AD-F030-001 (unset wire representation) is handled by platform convention (JSON `null`); SC-F030-001 / AD-F030-002 (ADR-003 citation) is confirmed by source inspection — `config/settings/base.py` already configures `SessionAuthentication` + `IsAuthenticated` as DRF defaults. AD-F030-003 (source validation) and AD-F030-004 (F-001 spec not persisted) are delivery-coordination notes; they require no plan change.
- **F-001 dependency (TR-F030-001):** The profile endpoints are unreachable until F-001 session establishment exists. This is a delivery-sequencing concern, not a task dependency; no F-030 code depends on F-001 internals beyond DRF `SessionAuthentication`.
- **Metrics (§19):** The design declares `profile.api.requests_total` counters and marks the duration histogram optional. No platform metrics mechanism exists in the codebase; the implementation must not introduce a new metrics dependency (TC-F030-003) and may record metrics only through the existing logging path. Structured logging and audit events are the required observability deliverables.
- **URL registration:** The profile route must be reachable only at `/api/profile/`. The existing `config/urls.py` includes `users.urls` at `api/auth/`; the developer must register the profile endpoint via a dedicated include or direct path so it does not surface as `/api/auth/profile/`.
- **Migration ordering:** Apply migration `0002` before deploying the new endpoint code is safe (schema-before-code); the additive nullable column does not break existing code (TD §20).
- **Manifest consistency:** `docs/engineering/task-plans/F-030/task-manifest.json` is the machine-readable source of truth for the Execution Package Agent and is embedded below.

## Task Manifest

```json
{
  "manifest_version": "1.0",
  "source_versions": {
    "feature_spec": "1.0",
    "technical_design": "1.0",
    "frontend_integration": "1.0",
    "engineering_review": "1.0",
    "engineering_approval": "1.0",
    "implementation_plan": "1.0"
  },
  "feature": {
    "id": "F-030",
    "name": "User Display Name"
  },
  "tasks": [
    {
      "id": "T-F030-001",
      "domain": "backend",
      "executor": "backend-implementation-agent",
      "execution_type": "implementation",
      "retry_limit": 1,
      "summary": "Add nullable display_name field to users.User with additive migration",
      "description": "Extend the existing users.User model (platform/backend/users/models.py) with a display-only display_name attribute per DM-F030-001 and TD-F030-001. The field is a nullable text column (null=True, default None) so the unset state is valid at the storage layer (ES-F030-005); it is distinct from username and never affects sign-in or credentials (BR-F030-003, EAF-F030-003). Generate the additive migration (0002) that adds the users_user.display_name column; no backfill and no default value (existing rows remain unset, per TD Section 20). Do NOT define validation constraints for the field (no maximum length, no character restrictions, no empty-value policy) — those are Open Contract Item 2 and must be escalated as NEEDS CLARIFICATION, not resolved here. Do not add any other profile field (TC-F030-005) and do not alter authentication, session, or credential behavior (TC-F030-004).",
      "files": [
        "platform/backend/users/models.py",
        "platform/backend/users/migrations/0002_user_display_name.py"
      ],
      "allowed_writes": [
        "platform/backend/users/models.py",
        "platform/backend/users/migrations/**"
      ],
      "contracts": ["DB-F030-PROFILE:1.0"],
      "dependencies": [],
      "design_refs": [
        "TD Section 10: DM-F030-001 — users.User.display_name",
        "TD Section 20: Migration and Backward Compatibility",
        "TD-F030-001 — Store display_name on users.User"
      ],
      "completion_criteria": [
        "users.User gains a display_name text field that is nullable (null=True) with no default and no max_length/character/empty-value validation constraints (Open Contract Item 2 remains open; nothing resolved).",
        "Migration 0002_user_display_name adds the additive nullable users_user.display_name column with no backfill; reverse migration drops the column (TD Section 20 rollback safety).",
        "python manage.py makemigrations users produces exactly the expected 0002 migration; python manage.py migrate applies cleanly on a database containing existing users (EA-F030-003).",
        "No authentication, session, or credential code is modified (TC-F030-004)."
      ]
    },
    {
      "id": "T-F030-002",
      "domain": "backend",
      "executor": "backend-implementation-agent",
      "execution_type": "implementation",
      "retry_limit": 1,
      "summary": "Implement self-scoped GET/PUT /api/profile/ endpoints with URL registration and observability",
      "description": "Implement the profile API in the users app per CMP-F030-001, API-F030-001, API-F030-002, and TD-F030-002/003/004. Create a DRF serializer that reads/writes display_name and API views for GET and PUT /api/profile/ that resolve the subject exclusively from request.user — no user identifier in path, query, or body (structural ownership, TD-F030-002, AC-F030-005). Apply DRF SessionAuthentication + IsAuthenticated (TD-F030-003): unauthenticated GET/PUT return 401 with no user data (AC-F030-007); PUT is a mutating request requiring a valid CSRF token (supplied by the frontend apiClient). PUT performs a single atomic full-field replace of the current user's display_name (TD-F030-004); on any failure the stored value is unchanged (AC-F030-006). Malformed payloads (missing field, wrong type, non-JSON) are rejected with platform validation errors and never touch storage (ES-F030-008). Register the endpoint at /api/profile/ in the project URL configuration (config/urls.py per TD Section 5 Affected Boundaries and Section 20) so it is reachable only at /api/profile/ and does not create an unintended /api/auth/profile/ route. Implement Section 19 observability: structured logging of GET/PUT outcomes (user_id, duration; never the display-name value) and an audit event profile_display_name_updated (user_id, timestamp; value not logged). Register the endpoints in the OpenAPI schema via the existing drf-spectacular configuration. CONSTRAINTS (escalation fixtures): Do NOT resolve the PUT success response contract (Open Contract Item 1) — do not choose a success status code, response body, or refetch behavior; escalate as NEEDS CLARIFICATION. Do NOT resolve display_name validation constraints (Open Contract Item 2) — do not add maximum-length, character, or empty-value validation rules; escalate as NEEDS CLARIFICATION. Do not introduce a new metrics dependency for Section 19 counters (TC-F030-003).",
      "files": [
        "platform/backend/users/serializers.py",
        "platform/backend/users/views.py",
        "platform/backend/users/urls.py",
        "platform/backend/config/urls.py"
      ],
      "allowed_writes": [
        "platform/backend/users/serializers.py",
        "platform/backend/users/views.py",
        "platform/backend/users/urls.py",
        "platform/backend/config/urls.py"
      ],
      "contracts": ["API-F030-PROFILE:1.0", "DB-F030-PROFILE:1.0", "RT-F030-PROFILE:1.0"],
      "dependencies": ["T-F030-001"],
      "design_refs": [
        "TD Section 11: API-F030-001 — GET /api/profile/",
        "TD Section 11: API-F030-002 — PUT /api/profile/",
        "TD Section 11: Open Contract Items 1 and 2",
        "TD Section 9: CMP-F030-001 — Profile API (Backend)",
        "TD-F030-002 — Self-scoped profile endpoints",
        "TD-F030-003 — Reuse DRF SessionAuthentication + IsAuthenticated",
        "TD-F030-004 — PUT full-field replace",
        "TD Section 17: Security and Privacy",
        "TD Section 19: Observability",
        "TD Section 20: Migration and Backward Compatibility (URL registration)"
      ],
      "completion_criteria": [
        "GET /api/profile/ returns 200 with {\"display_name\": <stored value>} for an authenticated user, resolving request.user only; the unset state is represented as JSON null per platform DRF convention (AD-F030-001 advisory).",
        "PUT /api/profile/ persists the submitted display_name in a single atomic write on request.user's row and is idempotent; on any failure the previously stored value is byte-for-byte unchanged (AC-F030-006, TD-F030-004).",
        "No request form (path, query, or body) accepts a user identifier, so no cross-user access is expressible (AC-F030-005, TD-F030-002).",
        "Unauthenticated GET and PUT return 401 with no user data (AC-F030-007).",
        "Malformed payloads (missing field, wrong type, non-JSON) are rejected with platform validation errors and cause no storage mutation (ES-F030-008).",
        "Endpoint is registered at /api/profile/ and appears in the OpenAPI schema (drf-spectacular); no unintended /api/auth/profile/ route is exposed.",
        "GET/PUT outcomes are logged with user_id and duration without the display-name value; update events log event=profile_display_name_updated without the value (TD Section 19).",
        "The PUT success response contract (Open Contract Item 1) is NOT resolved: no success status code, response body, or refetch behavior is invented; the item is escalated as NEEDS CLARIFICATION.",
        "display_name validation constraints (Open Contract Item 2) are NOT resolved: no maximum length, character restrictions, or empty-value policy are added; the item is escalated as NEEDS CLARIFICATION."
      ]
    },
    {
      "id": "T-F030-003",
      "domain": "backend",
      "executor": "backend-implementation-agent",
      "execution_type": "implementation",
      "retry_limit": 1,
      "summary": "Write backend tests for the profile API",
      "description": "Write backend tests for the profile API per TD Section 21 Engineering Scenarios (ES-F030-001 through ES-F030-009) and the API-F030-PROFILE contract, in the existing platform/backend/users/tests package. Tests must cover: authenticated GET returns the stored display_name and renders the unset state for a user who never saved (ES-F030-005); PUT persists the submitted value and a subsequent GET reflects it (AC-F030-004, BR-F030-002); PUT is idempotent (TD-F030-004); a failed or rejected PUT leaves the stored value unchanged (AC-F030-006); unauthenticated GET and PUT return 401 with no data (AC-F030-007); no request form accepts a user identifier, making cross-user access structurally impossible (AC-F030-005, ES-F030-004); malformed payloads are rejected without storage mutation (ES-F030-008); concurrent PUTs converge to one submitted value without torn writes (ES-F030-007). Tests MUST NOT assert the PUT success response contract (success status code, response body, or refetch behavior — Open Contract Item 1) and MUST NOT assert maximum-length, character, or empty-value validation behavior (Open Contract Item 2).",
      "files": [
        "platform/backend/users/tests/test_profile_api.py"
      ],
      "allowed_writes": [
        "platform/backend/users/tests/**"
      ],
      "contracts": ["API-F030-PROFILE:1.0", "RT-F030-PROFILE:1.0"],
      "dependencies": ["T-F030-002"],
      "design_refs": [
        "TD Section 21: ES-F030-001..009 — Engineering Scenarios",
        "TD Section 11: API-F030-001 and API-F030-002",
        "TD-F030-002 — Self-scoped profile endpoints",
        "TD-F030-003 — Reuse DRF SessionAuthentication + IsAuthenticated",
        "TD-F030-004 — PUT full-field replace",
        "TD Section 17: Security and Privacy"
      ],
      "completion_criteria": [
        "Test suite covers authenticated GET (stored and unset states), PUT persistence and idempotency, failure-leaves-value-unchanged, unauthenticated 401 for GET and PUT, structural cross-user inaccessibility, malformed payload rejection without storage mutation, and concurrent PUT convergence.",
        "No test asserts a specific PUT success status code, response body, or refetch behavior (Open Contract Item 1 remains open).",
        "No test asserts maximum-length, character-restriction, or empty-value validation behavior (Open Contract Item 2 remains open).",
        "python manage.py test users (or pytest) passes."
      ]
    },
    {
      "id": "T-F030-004",
      "domain": "frontend",
      "executor": "frontend-implementation-agent",
      "execution_type": "implementation",
      "retry_limit": 1,
      "summary": "Create ProfilePage and ProfileDisplayNameForm components for the /profile page",
      "description": "Create the /profile page components per FIP P-F030-001, C-F030-001 (ProfilePage) and C-F030-002 (ProfileDisplayNameForm), and TD CMP-F030-002 / TD-F030-005 / FD-F030-002. ProfilePage owns the display value and the local state machine (Idle -> Loading -> Loaded/Error; Loaded -> Saving -> Success/Error) per TD Section 14 and FIP Section 13 (state: displayName, phase). On mount it fetches via apiClient GET /api/profile/ (API-F030-001), renders Loading then Loaded with the current display name (AC-F030-003), handles the unset value without crashing (ES-F030-005), and shows Error on load failure with no stale value shown (AC-F030-006). ProfileDisplayNameForm presents the current value, captures the draft edit (editValue per FIP Section 13), and exposes a save action; ProfilePage submits via apiClient PUT /api/profile/ (API-F030-002, FD-F030-003) and transitions Saving -> Success on a confirmed save or Saving -> Error on failure with the previously loaded value unchanged (AC-F030-006). A 401 from GET or PUT is handled by apiClient's auth:unauthorized dispatch, which drives the F-001 login flow; the page renders no display name and allows no save (AC-F030-007, FIP Section 12). No global store is introduced (FD-F030-002); all profile HTTP goes through apiClient, not raw axios (FD-F030-003). CONSTRAINTS (escalation fixtures): Do NOT resolve Open Contract Item 1 — do not assume a PUT success status code or response body and do not implement a refetch-after-save decision; treat a resolved (non-error) PUT as a confirmed save and escalate the success-indication/refetch mechanism as NEEDS CLARIFICATION. Do NOT resolve Open Contract Item 2 — do not add client-side maximum-length or empty-value validation; escalate as NEEDS CLARIFICATION.",
      "files": [
        "platform/frontend/src/pages/ProfilePage.tsx",
        "platform/frontend/src/components/ProfileDisplayNameForm.tsx"
      ],
      "allowed_writes": [
        "platform/frontend/src/pages/ProfilePage.tsx",
        "platform/frontend/src/components/ProfileDisplayNameForm.tsx"
      ],
      "contracts": ["API-F030-PROFILE:1.0", "RT-F030-PROFILE:1.0"],
      "dependencies": ["T-F030-002"],
      "design_refs": [
        "FIP Section 10: C-F030-001 — ProfilePage",
        "FIP Section 10: C-F030-002 — ProfileDisplayNameForm",
        "FIP Section 9: Component Hierarchy (P-F030-001)",
        "FIP Section 11: API-to-Component Mapping (API-F030-001/002)",
        "FIP Section 12: Permission Mapping (401 -> auth:unauthorized)",
        "FIP Section 13: State Ownership",
        "FIP Section 15: FD-F030-002, FD-F030-003, FD-F030-004",
        "TD Section 9: CMP-F030-002 — ProfilePage (Frontend)",
        "TD Section 14: Flows 1-3 and Profile page state transitions",
        "TD-F030-005 — Frontend profile page with explicit state machine",
        "TD Section 11: Open Contract Items 1 and 2"
      ],
      "completion_criteria": [
        "ProfilePage and ProfileDisplayNameForm exist per the FIP component catalog and hierarchy (C-F030-001, C-F030-002).",
        "ProfilePage calls GET /api/profile/ through apiClient on mount and transitions Loading -> Loaded (renders the stored display name, including the unset state) or Loading -> Error on failure (AC-F030-003, AC-F030-006, ES-F030-005).",
        "Submitting the form calls PUT /api/profile/ through apiClient and transitions Saving -> Success on a resolved PUT or Saving -> Error on failure; the previously loaded value is unchanged in the Error state (AC-F030-004, AC-F030-006).",
        "A 401 from either endpoint relies on apiClient's auth:unauthorized dispatch to route to the F-001 login flow; no display name is rendered and no save is allowed (AC-F030-007, FIP Section 12).",
        "No client-side maximum-length, character, or empty-value validation is added (Open Contract Item 2 remains open — escalated, not resolved).",
        "No PUT response-body parsing or refetch-after-save decision is implemented (Open Contract Item 1 remains open — escalated, not resolved).",
        "npm run build (tsc + vite build) and npm run lint pass."
      ]
    },
    {
      "id": "T-F030-005",
      "domain": "frontend",
      "executor": "frontend-implementation-agent",
      "execution_type": "implementation",
      "retry_limit": 1,
      "summary": "Register /profile route and add the home page Profile link in App.tsx",
      "description": "Integrate the profile surface into the application per FIP P-F030-002, FIP Section 3 Route Map, FIP Section 4 Navigation Changes, FD-F030-001, and TD CMP-F030-003. In platform/frontend/src/App.tsx, register a new /profile route that renders ProfilePage (AC-F030-001) and add a single visible \"Profile\" link element inside the existing home page content on the / route that navigates to /profile (AC-F030-002). The home page gains no other behavior (BR-F030-004, TC-F030-006); no app shell, header, sidebar, or navigation infrastructure is introduced (FD-F030-001). Verify the existing vite.config.ts /api proxy already routes /api/profile/ to the backend (target http://backend:8000) — no proxy change is expected; adjust only if the profile route cannot reach the backend. Do not modify any other route or component.",
      "files": [
        "platform/frontend/src/App.tsx",
        "platform/frontend/vite.config.ts"
      ],
      "allowed_writes": [
        "platform/frontend/src/App.tsx",
        "platform/frontend/vite.config.ts"
      ],
      "contracts": ["RT-F030-PROFILE:1.0"],
      "dependencies": ["T-F030-004"],
      "design_refs": [
        "FIP Section 2: P-F030-002 — Home Page",
        "FIP Section 3: Route Map (/profile)",
        "FIP Section 4: Navigation Changes (Profile link)",
        "FIP Section 15: FD-F030-001 — Local navigation only",
        "TD Section 9: CMP-F030-003 — Home Page Profile Link",
        "TD Section 5: Affected Boundaries (frontend routing)",
        "TD-F030-005 — Frontend profile page with explicit state machine and home-page link"
      ],
      "completion_criteria": [
        "App.tsx registers a /profile route that renders ProfilePage (AC-F030-001).",
        "The / route home page content contains a visible \"Profile\" link that navigates to /profile (AC-F030-002).",
        "No other home page behavior, global navigation, or app shell change is introduced (BR-F030-004, FD-F030-001).",
        "The existing vite /api proxy covering /api/profile/ is verified (no change required); no other proxy target is altered.",
        "npm run build and npm run lint pass."
      ]
    }
  ]
}
```
