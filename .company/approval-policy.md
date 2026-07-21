# GeoSpatial Platform — Approval Policy

Version:

1.1

Purpose:

Define what requires approval, who can approve, and how approval is requested and recorded.

Every approval creates a traceable decision.

---

# Approval Levels

## Level 1 — Informational

No approval required.

Examples:

- minor documentation updates
- refactoring with no behavior change
- adding comments
- fixing typos

Action:

Self-service.

No record needed.

---

## Level 2 — Peer Approval

Requires review from one qualified agent.

Examples:

- bug fixes
- small feature changes within existing architecture
- test additions
- dependency version bumps (patch)

Action:

Pull request review by an agent with relevant role.

Approval recorded in PR thread.

---

## Level 3 — Department Approval

Requires review from the responsible department head.

Examples:

- new API endpoints
- database schema changes
- new integration points
- permission model changes
- medium features

Action:

Submit to the relevant department.

Approval recorded as ADR or in the task artifact.

---

## Level 4 — Cross-Department Approval

Requires review from two or more departments.

Examples:

- changes affecting data model + API
- security-relevant changes
- workflow changes
- frontend + backend coordination

Action:

Submit to all affected departments.

Each department must approve.

Approval recorded with sign-off from each.

---

## Level 5 — Human Approval

Requires explicit human owner sign-off.

Examples:

- scope changes
- technology stack changes
- architecture paradigm changes
- security policy changes
- budget or timeline implications
- public API breaking changes

Action:

Written proposal submitted to human owner.

Approval recorded in ADR or decision log.

---

# Approval Matrix

| Decision Type | Level | Approver |
|---|---|---|
| Typo fix, comment change | 1 | Self |
| Bug fix, minor refactor | 2 | Peer Engineer |
| New endpoint, schema change | 3 | Solution Architect |
| Cross-cutting feature | 4 | Multiple Departments |
| Scope, tech stack, breaking API | 5 | Human Owner |
| Security-relevant change | 4+ | Security Reviewer |
| Publishing pipeline change | 3 | DevOps Engineer |
| Requirement change | 3 | Requirements Analyst |

---

# Engineering Design Approval (Pipeline)

Every Technical Design passes through the Engineering Approval Gate (GATE-ENG-APPROVAL) after Engineering Review. The Gate determines whether human approval is required based on this policy.

## When Human Approval IS Required

The Gate MUST present the design to the human when the Technical Design contains one or more:

- **Human Technical Decisions (HTDs)** — any choice that triggers Level 5: technology stack changes, architecture paradigm changes, new strategic platform technologies, trust boundary or security posture changes, destructive or irreversible migrations, breaking cross-feature or public contracts, or platform-wide conventions that commit multiple features.
- **New decision-bearing ADRs** that change platform-level conventions and require human sign-off under Level 5.
- **Scope-affecting architectural choices** that the product specification did not resolve.

The human responds with one of:
- **APPROVED** — Design is accepted. Route to AGENT-105.
- **REQUEST CHANGES** — Design needs specific revisions. Return to AGENT-103 with stable change-request IDs (CR-FXXX-NNN).
- **REJECTED** — Architectural approach is fundamentally unacceptable. Return to AGENT-103 for a substantially different approach.

## When Human Approval Is NOT Required

The Gate records **NOT REQUIRED** and routes directly to AGENT-105 when ALL of the following are true:

- The Technical Design contains only ordinary Technical Decisions owned by AGENT-103.
- No Human Technical Decision is present.
- No decision triggers Level 5 (technology stack changes, architecture paradigm changes, security policy changes, public API breaking changes, or budget/timeline implications).
- All decisions fit within the approved architecture and existing ADRs.
- The Engineering Design Reviewer (AGENT-104) has verified completeness and consistency with a READY FOR APPROVAL recommendation and zero blocking findings.
- The Design Integrity Gate (run by AGENT-103 before readiness) passed.

A NOT REQUIRED approval still produces a version-locked approval artifact at `docs/engineering/approvals/F-XXX/engineering-approval.md`. It records the exact Technical Design and Engineering Review versions and serves as the authorization for AGENT-105 to begin task decomposition.

## Eligibility

The Gate enforces an eligibility check before applying this policy. A package is ineligible for any decision when:

- The Engineering Review recommendation is not READY FOR APPROVAL.
- The Engineering Review has blocking findings.
- Source artifact versions do not match across the chain.
- Unresolved HTDs or decision-bearing ADRs remain.

Ineligible packages are routed back without reaching the human. The Gate records NOT ELIGIBLE in the approval artifact.

## Pipeline Approval Matrix

| Condition | Human Required? | Gate Decision | Route |
|---|---|---|---|
| Design has HTDs, new ADRs, platform tech changes, trust boundary shifts | Yes | APPROVED / REQUEST CHANGES / REJECTED | AGENT-105 or AGENT-103 |
| Design has only ordinary TDs, reviewer says READY, zero blocking findings | No | NOT REQUIRED | AGENT-105 |
| Package ineligible (review not READY, blocking findings, version mismatch) | N/A | NOT ELIGIBLE | AGENT-103 or AGENT-104 |

## Recording Pipeline Approvals

All pipeline approval decisions are recorded in:
```
docs/engineering/approvals/F-XXX/engineering-approval.md
```

Pipeline approvals are version-locked. A new Technical Design version automatically invalidates the prior approval. AGENT-105 must verify the version lock before beginning task decomposition.

---

# Approval Process

## Request

1. Identify the approval level using the matrix above.

2. Prepare a brief summary:

   ```
   What:
   Why:
   Impact:
   Risk:
   ```

3. Submit to the appropriate approver.

## Review

The approver evaluates:

- does this align with project goals?
- are risks acceptable?
- are consequences understood?

## Decision

Approver responds with one of:

- Approved
- Approved with conditions
- Not Required (pipeline only — design does not require human sign-off)
- Rejected (with reason)
- Requires escalation

## Recording

All decisions are recorded in:

```
docs/project/PROJECT_STATUS.md
.ai-memory/decisions.md
```

Level 4 and 5 decisions also produce an ADR.

---

# Exceptions

## Emergency Changes

Security vulnerabilities or production outages may bypass normal approval.

Rules:

1. Fix first, approve after.

2. Document the emergency within one session.

3. Retrospective approval within 24 hours.

## Delegation

An approver may delegate Level 2 and Level 3 decisions to a qualified agent.

Delegation must be explicit and recorded.

Level 4 and Level 5 cannot be delegated.

---

# Rejection Handling

If a request is rejected:

1. Understand the reason.

2. Address the concern.

3. Resubmit with changes.

Repeated rejection of the same proposal requires escalation to the Project Director.

---

# Golden Rule

No unapproved change reaches production.

Every approval is a documented decision.
