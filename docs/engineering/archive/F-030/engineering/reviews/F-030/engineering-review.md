# F-030 — User Display Name — Engineering Review

## 1. Metadata

| Field | Value |
|---|---|
| Feature ID | F-030 |
| Feature Title | User Display Name |
| Source Feature Specification | docs/project/features/F-030/feature-spec.md |
| Source Feature Specification Version | 1.0 |
| Source Technical Design | docs/engineering/technical-plans/F-030/technical-design.md |
| Source Technical Design Version | 1.0 |
| Source Frontend Integration | docs/engineering/frontend-integration/F-030/frontend-integration.md |
| Source Frontend Integration Version | 1.0 |
| Review Version | 1.0 |
| Reviewer | AGENT-104 — Engineering Design Reviewer |
| Created | 2026-08-07 |
| Review Recommendation | READY FOR APPROVAL |
| Blocking Findings | 0 |
| Advisories | 4 |

## 2. Executive Summary

The F-030 technical design and frontend integration are complete, minimal, and internally consistent. The design extends the existing `users` Django app with one additive nullable `display_name` field and two self-scoped endpoints (`GET`/`PUT /api/profile/`) that operate exclusively on `request.user`, making ownership enforcement structural (TD-F030-002) and satisfying the ownership requirement and AC-F030-005/007 by construction. The frontend integration is faithful to the scaffold: one new `/profile` page with two new components wired to the existing `apiClient`, one content-level home-page link, and local-navigation-only integration (a shared app shell is correctly rejected as out of scope). All seven semantic integrity relationships hold. The two deliberately open contract items — the PUT success response contract and `display_name` validation constraints — are intentional test fixtures recorded as non-blocking known design limitations; the implementation agent is expected to escalate them as NEEDS CLARIFICATION, and the Frontend Integration correctly leaves them open as dependencies (FD-F030-004). Zero blocking findings. Four non-blocking advisories are recorded, including one evidence-citation mismatch with ADR-003 (TokenAuth vs SessionAuthentication) and a review-environment limitation on source inspection. **Recommendation: READY FOR APPROVAL.**

## 3. Architecture Findings

No blocking architecture findings.

The architecture fit is verified:
- Component responsibilities map cleanly to the approved scope: one backend component (CMP-F030-001), one new page (CMP-F030-002), one home-page link (CMP-F030-003). No unnecessary complexity; no missing ownership.
- The design respects ADR-001 (no resource-model change), ADR-002 (profile logic inside the existing `users` app), and ADR-003 (DRF views with platform auth/permission and OpenAPI registration).
- The Architecture Challenge was not required: every Technical Decision is feature-local, follows existing ADRs, and does not meet the materiality threshold (no architecture boundary change, platform convention, infrastructure, security-posture change, operational cost, or cross-feature maintainability impact). TD-F030-001's rejected alternatives (new `profile` app, ADR-006-style key-value metadata) are each documented with a concrete reason and satisfy the Ownership Test.
- A shared application shell / global navigation was correctly rejected by the Frontend Integration Planner (FD-F030-001); the approved scope (Feature Specification §10, BR-F030-004) requires only a link on the existing home page.

## 4. Semantic Consistency Review

### SC-F030-001 — ADR-003 citation does not match ADR-003 text (TokenAuth vs SessionAuthentication)
**Integrity relationship:** References↔Artifacts
**Observation:** The Technical Design (TD §5, TD-F030-003) states the platform already configures `SessionAuthentication` + `IsAuthenticated` as DRF defaults "under ADR-003" / "(ADR-003)". ADR-003's Key design choices instead record "Token-based authentication (DRF TokenAuth) initially". The cited artifact does not support the claim as written.
**Evidence:** TD §5 "The API layer uses Django REST Framework (ADR-003) with platform defaults already configured in `config/settings/base.py`: SessionAuthentication, IsAuthenticated, ..."; ADR-003 "Key design choices: ... Token-based authentication (DRF TokenAuth) initially".
**Impact:** A reviewer cannot confirm from the cited ADR that session authentication is the configured platform default. The design decision remains sound because the endpoints declare their auth/permission classes explicitly (TD-F030-003), so the design does not depend on the global default being session-based.
**Recommendation:** Either verify the actual `config/settings/base.py` default and cite that evidence, or note the divergence between ADR-003's initial TokenAuth statement and the session-based reality of F-001 (session management per feature-catalog.md).
**Blocking:** No

No other semantic inconsistencies found. Verified relationships:

- **Model ↔ API:** `display_name` (TextField, nullable, default None — DM-F030-001) agrees with the GET response field and PUT request body (`display_name` as text) in API-F030-001/002. Type and nullability agree; the unset state is represented consistently across §10, §11, and ES-F030-005.
- **Component ↔ Runtime:** CMP-F030-001, CMP-F030-002, and CMP-F030-003 all appear in §14 flows and/or state transitions (Flows 1–3; ProfilePage state machine). Every flow references real components.
- **Authentication ↔ Endpoint:** Both endpoints declare `SessionAuthentication` + `IsAuthenticated` (API-F030-001/002, §17, TD-F030-003). 401 is the correct unauthenticated response (AC-F030-007); 403 is correctly declared not applicable because no authenticated-but-forbidden case exists in a self-scoped contract (TD-F030-002, §17). Consistent across TD and FIP §12.
- **Migration ↔ Data:** One additive nullable column, no backfill, schema-before-code safe, rollback = reverse migration (DM-F030-001, §20). Nullability and defaults respect deployment ordering (EA-F030-003).
- **Decision ↔ Design:** Every Technical Decision propagates to the declared sections: TD-F030-001 → DM/API/Security/Migration; TD-F030-002 → API/Security/Scenarios/Risks; TD-F030-003 → API/Security/Integration/Scenarios; TD-F030-004 → API/Flows/Failure/Scenarios; TD-F030-005 → Components/Data Flow/Scenarios. No decision is mentioned only in risks or a single scenario.
- **Risk ↔ Mitigation:** Each mitigation has a design element: TR-F030-001 → INT-F030-001 (explicit F-001 dependency, no code coupling); TR-F030-002/003 → §11 Open Contract Item recording with NEEDS CLARIFICATION instruction; TR-F030-004 → self-scoped endpoints + no-value logging (§19) + React escaping (ES-F030-008); TR-F030-005 → `apiClient` CSRF interceptor reuse (INT-F030-002).
- **References ↔ Artifacts:** ADR-001, ADR-002, ADR-003, ADR-006 exist. component-design.md confirms `users` owns User/identity. feature-catalog.md confirms F-030 and F-001. personas.md confirms the persona set. The F-001 feature spec is not yet persisted; the design honestly records this (INT-F030-001, TR-F030-001, EA-F030-001) rather than silently assuming an artifact.

## 5. Missing Decisions

No blocking Missing Decisions.

The following areas are fully addressed: database (DM-F030-001, §20), API (API-F030-001/002), permissions and enforcement points (§17), error handling and idempotency (§18), background jobs (explicitly not applicable), logging/metrics/alerting (§19), deployment and backward compatibility (§20), and security/privacy (§17). The two deliberately deferred contract details are test fixtures, not missing decisions (see Section 8 and the Known Design Limitations note below).

## 6. Risks

### RSK-F030-001 — F-001 session authentication not yet available at F-030 delivery
**Area:** Reliability / Operations
**Risk description:** F-001 backend endpoints are not implemented (`users/urls.py` empty per INT-F030-001), so no API session can be established; all profile requests would return 401 until F-001 delivers session login.
**Trigger or early warning:** Absence of a working login/session endpoint at F-030 integration time.
**Severity:** Medium
**Mitigation in design:** Yes — TR-F030-001, INT-F030-001, and EA-F030-001 document the dependency explicitly; no F-030 code depends on F-001 internals beyond DRF `SessionAuthentication`, which is configured at the platform level.
**Residual concern:** Sequencing risk between F-001 and F-030 execution remains; it is a delivery-order concern, not a design defect.

### RSK-F030-002 — Open contract items cause frontend/backend divergence during implementation
**Area:** Maintainability / Reliability
**Risk description:** The PUT success response contract and `display_name` validation constraints are deliberately open. An implementation agent could silently invent defaults or assume different contracts on each side, breaking the save flow or producing a misleading success indication (FR-F030-006).
**Trigger or early warning:** Implementation proceeds without escalating the open items as NEEDS CLARIFICATION.
**Severity:** Medium
**Mitigation in design:** Yes — TD §11 records both items with explicit "do not resolve, do not default, escalate" instructions; AC-F030-004/006 are preserved regardless of the eventual contract; the FIP records them as open dependencies (FD-F030-004, §11).
**Residual concern:** Coordination effort at implementation time; the eventual validation policy is a product decision outside this design.

## 7. Required Changes

None. Zero blocking findings. No Required Changes apply to the Technical Design or the Frontend Integration.

## 8. Advisories

### AD-F030-001 — Pin the wire representation of the unset display name on GET
**Observation:** DM-F030-001 defines `display_name` as nullable, and ES-F030-005/API-F030-001 describe the "unset stored state" without pinning the JSON wire representation (JSON `null` vs omitted key) for a user who has never saved a value. The FIP models it as `string | unset` (FIP §13).
**Consideration:** DRF serializing a `None` text field to JSON `null` is the platform-standard behavior and both sides converge on it, but a one-line statement in API-F030-001 would remove the only remaining ambiguity for the implementation agent.

### AD-F030-002 — Verify the "already configured SessionAuthentication default" claim against the actual settings file
**Observation:** See SC-F030-001. The design's evidence chain for the session-auth default cites ADR-003, whose text records TokenAuth initially. The endpoint-level auth declaration makes the design robust either way.
**Consideration:** Before or during implementation, confirm the actual `config/settings/base.py` DRF defaults and, if session-based auth is the operative platform posture, consider noting the ADR-003 divergence in a future ADR update (out of scope for F-030).

### AD-F030-003 — Review-environment limitation: codebase claims were not independently source-validated
**Observation:** Per the selective-source-inspection rule, this review attempted narrow validation of the design's codebase claims (`apiClient` CSRF/401 behavior, `App.tsx` single-route set, `users/urls.py` empty, `config/settings/base.py` DRF defaults, SystemInfo raw-axios pattern). Source inspection of `platform/` was not permitted in this review environment.
**Consideration:** These claims are recorded as design evidence (TD §5, EA-F030-002, TR-F030-005; FIP §3 route-conflict verification, §14). They should be confirmed during implementation integration testing; none are treated as confirmed by this review. This does not block approval because the design is not architecturally dependent on any single unvalidated claim.

### AD-F030-004 — F-001 feature specification is not yet persisted
**Observation:** The F-001 feature spec does not yet exist as a persisted artifact (only the feature-catalog entry). The design records this honestly as a material discrepancy (INT-F030-001, TR-F030-001) and treats F-001 as a declared dependency.
**Consideration:** When F-001's spec and backend land, re-confirm the session-authentication contract assumed here (DEP-F030-001, EA-F030-001). No F-030 revision is expected unless F-001's contract diverges from session-based DRF auth.

### Known Design Limitations (deliberate test fixtures — non-blocking, NOT findings)

Per the authority map at `docs/project/features/F-030/authority-map.md`, the Technical Design deliberately leaves two items open as controlled test fixtures. They are recorded in TD §11 as Open Contract Items 1 and 2. They are **not** treated as blocking findings and **not** recorded as Missing Decisions:

1. **KDL-F030-001 — PUT /api/profile/ success response contract (TD §11 Open Contract Item 1):** success status code, response body, and whether the client should refetch after a save are unspecified by design.
2. **KDL-F030-002 — display_name validation constraints (TD §11 Open Contract Item 2):** maximum length, character restrictions, and whether an empty display name is permitted are unspecified by design.

These are intentional: the execution test expects the implementation agent to escalate both as **NEEDS CLARIFICATION** rather than invent defaults. The Frontend Integration correctly left them open as dependencies (FIP FD-F030-004, §11, §13, UI Behaviour Matrix row 3) — that is correct behavior, not a finding. The error path (stored value unchanged on failure, AC-F030-006) is contract-independent and fully specified.

## 9. Prior Finding Resolution (re-review only)

N/A — this is an initial review. No prior Engineering Review exists at `docs/engineering/reviews/F-030/engineering-review.md`.

## 10. Final Recommendation

**Recommendation:** READY FOR APPROVAL
**Confidence:** High
**Blocking findings:** 0
**Advisories:** 4
**Summary:** The technical design is complete, minimal, and contract-bound: one additive nullable field on the existing `users.User` model, two self-scoped endpoints with structural ownership enforcement, explicit loading/save/error state behavior, and honest documentation of the F-001 dependency and the two deliberately deferred contract items. Every approved requirement, acceptance criterion, and engineering attention flag traces to a design response, all seven semantic integrity relationships hold, and the frontend integration is faithful to the scaffold with local-navigation-only scope and a complete UI Behaviour Matrix, permission mapping, and evidence-based reuse analysis. The only identified inconsistencies are non-blocking (an ADR-003 citation mismatch and an environment-limited source-validation note). Routing to the Engineering Approval Gate per the recommendation rules. Under the approval policy, the design contains only ordinary Technical Decisions, no Human Technical Decision, and no Level 5 trigger, so the Gate is expected to record NOT REQUIRED and route to AGENT-105.
