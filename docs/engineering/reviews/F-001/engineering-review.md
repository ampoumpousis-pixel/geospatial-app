# F-001 — User Authentication — Engineering Review

## 1. Metadata

| Field | Value |
|---|---|
| Feature ID | F-001 |
| Feature Title | User Authentication |
| Source Feature Specification | docs/project/features/F-001/feature-spec.md |
| Source Feature Specification Version | 1.0 |
| Source Technical Design | docs/engineering/technical-plans/F-001/technical-design.md |
| Source Technical Design Version | 1.0 |
| Review Version | 2.0 |
| Reviewer | AGENT-104 — Engineering Design Reviewer |
| Created | 2026-07-21 |
| Review Recommendation | READY FOR APPROVAL |
| Blocking Findings | 0 |
| Advisories | 4 |

## 2. Executive Summary

This is a re-review of the revised Technical Design for F-001 (User Authentication). The design is complete, internally consistent, and fully addresses all 15 functional requirements, 12 acceptance criteria, and 7 Engineering Attention Flags. The architecture follows approved ADRs and human decisions (DEC-004: built-in auth first; DEC-005: single organization). Session-based authentication using Django's built-in `django.contrib.auth` with DRF `SessionAuthentication` is the correct approach for this browser-based SPA. All seven Technical Decisions are sound with well-documented alternatives and rationale. Engineering Scenarios cover normal, boundary, failure, misuse, concurrency, and abuse cases. Security, performance, scalability, observability, and migration concerns are addressed in appropriate depth.

Of the six prior findings from the previous review (v1.0), four are fully resolved. Two remain as non-blocking advisories: (1) the session invalidation approach on password change is documented in DM-F001-002 but is not formalized as a standalone Technical Decision; (2) the `must_change_password` enforcement gap at the backend level remains acceptable for F-001 scope but should be tracked for F-002 onward. One new advisory is identified regarding an inconsistency between ADR-003's TokenAuth mention and the design's SessionAuthentication choice. A second new advisory notes that the `next` redirect-URL handling between frontend and backend has a minor contract gap.

The design is recommended for **READY FOR APPROVAL**. Zero blocking findings. All material risks are documented with mitigations. The design is sufficiently detailed for AGENT-105 to begin task decomposition.

## 3. Architecture Findings

### AF-F001-001 — ADR-003 Specifies TokenAuth but Design Uses SessionAuthentication

**Severity:** Low
**Blocking:** No
**Category:** Consistency
**Observation:** ADR-003 (`docs/adr/ADR-003-django-rest-framework.md`) lists "Token-based authentication (DRF TokenAuth) initially" as a key design choice. The Technical Design uses SessionAuthentication (Django session cookies) instead. The design acknowledges ADR-003 as a binding ADR (Section 4) but does not address the deviation on auth mechanism choice.
**Evidence:**
- ADR-003 Key design choices: "Token-based authentication (DRF TokenAuth) initially"
- Technical Design Section 16: Uses `SessionAuthentication`, not TokenAuth
- Technical Design Section 4: Lists ADR-003 as binding without noting the auth mechanism discrepancy
**Impact:** Low for this implementation — the design correctly follows DEC-004 (human decision: "built-in authentication first") which takes precedence over ADR-003's preliminary TokenAuth recommendation per the project's source-of-truth priority (PROJECT_FACTS: Human Decisions > Approved ADRs). However, the inconsistency is not acknowledged, which could confuse developers reading both documents.
**Recommendation:** Add a note in Section 4 (Architectural Context) or Section 16 (Security) explaining that ADR-003's TokenAuth reference is superseded by DEC-004 for the initial version, and that session-based auth is used for the browser-based SPA while TokenAuth remains an option for future machine-to-machine API access.

### AF-F001-002 — Session Invalidation Approach Not Formalized as Technical Decision

**Severity:** Low
**Blocking:** No
**Category:** Completeness
**Observation:** This finding was raised in the prior review (v1.0) as AF-F001-001 / RC-F001-001. The revised design provides clearer documentation of the session invalidation approach in DM-F001-002 but still does not formalize it as a Technical Decision in Section 7 with the standard alternatives-analysis structure.
**Evidence:**
- DM-F001-002 (lines 484–493): Discusses multiple approaches (UserSession model, `auth_version` counter, session iteration) but reads as exploratory thinking rather than a settled decision
- The decision to use iterative session decoding (O(n) scan) over the `auth_version` counter pattern is not documented as a formal TD with explicit rationale
- No TD entry exists in Section 7 for "Session Invalidation Strategy"
**Impact:** Low. The chosen approach is discoverable and the implementation guidance is clear enough for AGENT-105 to decompose into tasks. Formalizing it would improve design consistency.
**Recommendation:** Promote the session invalidation approach to a Technical Decision in Section 7, documenting the chosen approach (iterate sessions with `.decoded()`) and the alternative considered (`auth_version` counter on the User model) with the rationale that simplicity is preferred for Milestone 1 scale.

## 4. Semantic Consistency Review

### SC-F001-001 — Login Next-URL Contract Gap

**Integrity relationship:** API ↔ Frontend Flow
**Observation:** The login endpoint response (API-F001-001) includes a `"next"` field, and the sequence diagram (Login Flow) shows the backend returning it. However, the request contract does not include a `next` field, so the backend has no way to know the intended redirect URL. The frontend CMP-F001-007 reads `next` from URL query params on mount but there is no API contract for the frontend to submit it.
**Evidence:**
- API-F001-001 request body: `{username, password, remember_me}` — no `next` field
- API-F001-001 success response: `{user, next, remember_me, session_expires}` — includes `next`
- Sequence diagram (lines 871–875): Backend returns `next`, frontend navigates to it
- CMP-F001-007: Frontend reads `next` from URL params but does not send it in the request
**Impact:** Low. The frontend can handle `next` entirely client-side (it already reads the param from the URL). If `next` in the API response is intended to come from the backend, the request contract needs an optional `next` field. If it is client-side only, the API response should omit `next` to avoid confusion.
**Recommendation:** Either (a) add an optional `next` field to the login request body and have the backend echo it; or (b) remove `next` from the login response and document that the frontend handles redirect URL management client-side.

### SC-F001-002 — ADR-003 Auth Content Conflict

**Integrity relationship:** References ↔ Artifacts
**Observation:** ADR-003 exists and is properly referenced, but its auth mechanism specification conflicts with the design's chosen approach (see AF-F001-001).
**Evidence:**
- ADR-003: "Token-based authentication (DRF TokenAuth) initially"
- Technical Design: Session-based authentication (SessionAuthentication)
**Impact:** Low. The binding ADR intent (use DRF for API) is respected. The auth mechanism is governed by DEC-004.
**Recommendation:** See AF-F001-001.

## 5. Missing Decisions

### MD-F001-001 — must_change_password Backend Enforcement (Cross-Feature Gap)

**Area:** Authorization / Security
**What is missing:** The `must_change_password` flag (FR-F001-013, AC-F001-010) is checked at login and enforced client-side (via ProtectedRoute redirect), but there is no backend middleware or permission class that blocks authenticated API access when `must_change_password=True`. Within F-001 scope, the only authenticated endpoints are session check, logout, and password change — all acceptable. However, F-002+ endpoints (resource management, permissions) will need this enforcement.
**Why it matters:** A user with `must_change_password=True` could bypass the frontend redirect and call F-002+ backend APIs directly (e.g., via curl or Postman), potentially creating resources or changing permissions before setting a new password.
**Blocking:** No (for F-001 scope). Yes for F-002+ — should be documented as a cross-feature dependency.
**Recommendation:** Document this as a cross-feature concern in the task handoff to AGENT-105. Add a note in F-001 that F-002 should implement a `ForcePasswordChangeMiddleware` or permission mixin that checks `must_change_password` before granting access to protected resources.

## 6. Risks

### RSK-F001-001 — CSRF Cookie Non-HttpOnly Enables JavaScript Read Access

**Area:** Security
**Risk description:** The design specifies `CSRF_COOKIE_HTTPONLY = False` so the frontend can read the `csrftoken` cookie and send it as `X-CSRFToken` header. This exposes the CSRF token to any JavaScript running on the page, including third-party scripts.
**Severity:** Medium
**Trigger or early warning:** XSS vulnerability in any frontend component.
**Mitigation in design:** The session cookie (`SESSION_COOKIE_HTTPONLY = True`) remains inaccessible to JavaScript. CSRF token exposure is exploitable only in combination with XSS, which alone constitutes a complete compromise. CSP headers and XSS prevention are recommended.
**Residual concern:** The platform must maintain strict XSS prevention across all frontend code. Future third-party script inclusions should be reviewed.

### RSK-F001-002 — Long-Lived Remember-Me Sessions Without Token Rotation

**Area:** Security
**Risk description:** "Remember Me" sessions persist for up to 30 days (configurable) using the same session ID. No session ID rotation occurs during the remember-me window. A leaked session cookie remains valid for the configured duration.
**Severity:** Medium
**Trigger or early warning:** Session cookie exfiltration via network interception, device access, or XSS.
**Mitigation in design:** Session cookie is HttpOnly, Secure, SameSite=Lax. Password change invalidates all sessions. Duration is administrator-configurable.
**Residual concern:** On shared devices, users should explicitly log out. Session ID rotation on each request via `SESSION_SAVE_EVERY_REQUEST` could be considered in a future hardening iteration.

### RSK-F001-003 — Session Iteration Performance at Scale

**Area:** Performance / Scalability
**Risk description:** The session invalidation approach (DM-F001-002) iterates and decodes all active sessions to find sessions belonging to a specific user. This is O(n) where n is total active sessions.
**Severity:** Low
**Trigger or early warning:** Active sessions exceeding 10,000. Password-change or admin-force-reset latency exceeding 500ms.
**Mitigation in design:** Design explicitly acknowledges this and recommends switching to `auth_version` counter pattern or a `UserSession` model at scale. For current expected scale (<100 concurrent sessions), the O(n) scan is acceptable.
**Residual concern:** Must be monitored and remediated before scale exceeds threshold.

## 7. Required Changes

None. Zero blocking findings.

## 8. Advisories

### AD-F001-001 — Formalize Session Invalidation Technical Decision

**Source finding:** AF-F001-002
**Observation:** The session invalidation approach (iterate and decode sessions) is documented in DM-F001-002 but is not formalized as a Technical Decision in Section 7. This was flagged in the prior review and remains unaddressed.
**Consideration:** Formalizing it would improve design consistency and make the decision discoverable for future maintainers.

### AD-F001-002 — Document ADR-003 Auth Content Deviation

**Source finding:** AF-F001-001
**Observation:** The design uses SessionAuthentication but ADR-003 specifies TokenAuth. The design does not acknowledge this deviation.
**Consideration:** A brief note in Section 4 or 16 clarifying that DEC-004 (built-in auth) supersedes ADR-003's TokenAuth mention would prevent confusion for developers reading both documents.

### AD-F001-003 — Clarify Login Next-URL Handling

**Source finding:** SC-F001-001
**Observation:** The `next` redirect-URL handling between frontend and backend has a contract gap — the API response includes `next` but the request does not submit it.
**Consideration:** Either add `next` to the login request body as an optional field, or remove it from the response and document client-side handling.

### AD-F001-004 — Track must_change_password Enforcement for F-002+

**Source finding:** MD-F001-001
**Observation:** Backend enforcement of `must_change_password` is not implemented for non-F-001 endpoints. This is acceptable within F-001 scope but becomes a security gap in F-002+.
**Consideration:** Document this as a cross-feature dependency in the handoff to AGENT-105. When F-002 is designed, a `ForcePasswordChangeMiddleware` or permission mixin should be added.

## 9. Prior Finding Resolution (Re-review)

| Prior Finding ID | Finding | Status | Notes |
|---|---|---|---|
| AF-F001-001 / RC-F001-001 | Session invalidation approach not formalized as Technical Decision | Unresolved | Approach is more clearly documented in DM-F001-002 but still not promoted to a formal TD in Section 7. See AD-F001-001. |
| AF-F001-002 / RC-F001-002 | Reference to ADR-003 references non-existent file | Resolved | ADR-003 now exists at `docs/adr/ADR-003-django-rest-framework.md`. However, a content inconsistency was discovered (see AF-F001-001 / AD-F001-002). |
| MD-F001-001 | Health endpoint not defined in API Design | Resolved | Design now uses `GET /api/auth/session/` as the liveness probe (Section 18). No separate health endpoint needed. |
| RSK-F001-001 | CSRF cookie HttpOnly=False exposes CSRF token | Resolved | Risk is documented and mitigated in Section 16. CSP and XSS prevention referenced. |
| RSK-F001-002 | Long-lived remember-me sessions without token rotation | Resolved | Risk documented in TD-F001-002 with rationale. Mitigations in Section 16 (cookie security). |
| RSK-F001-003 | must_change_password enforcement is frontend-only | Unresolved | Still no backend enforcement for non-F-001 endpoints. Acceptable within F-001 scope. See AD-F001-004 for cross-feature tracking recommendation. |

## 10. Final Recommendation

**Recommendation:** READY FOR APPROVAL
**Confidence:** High
**Blocking findings:** 0
**Advisories:** 4
**Summary:** The Technical Design for F-001 (User Authentication) is comprehensive, architecturally sound, and fully addresses all 15 functional requirements, 12 acceptance criteria, and 7 Engineering Attention Flags from the approved Feature Specification. The design correctly leverages Django's battle-tested auth components (session-based auth with database session store, Argon2 password hashing, built-in password reset token generator) rather than building custom solutions, which reduces risk and aligns with the project's engineering principles. All seven Technical Decisions are sound with well-documented alternatives and rationale. Engineering Scenarios cover normal, boundary, failure, misuse, concurrency, and abuse cases. Security, performance, scalability, observability, and migration are addressed in appropriate depth.

Four advisory-level observations remain from both prior and new findings: (1) the session invalidation approach could be formalized as a Technical Decision; (2) the ADR-003 auth mechanism content deviation should be acknowledged; (3) the login `next`-URL handling has a minor contract gap; and (4) the `must_change_password` backend enforcement gap should be tracked for F-002+. None block approval or task planning.

The design is ready for Engineering Approval Gate and subsequent task decomposition by AGENT-105.
