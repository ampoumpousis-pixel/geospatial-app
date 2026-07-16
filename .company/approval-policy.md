# GeoSpatial Platform — Approval Policy

Version:

1.0

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
