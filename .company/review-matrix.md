# GeoSpatial Platform — Review Matrix

Version:

1.0

Purpose:

Define what types of reviews exist, who performs them, and what criteria each review checks.

Reviews are quality gates. Every artifact passes through the appropriate gate before it is considered complete.

---

# Review Types

## Code Review

Purpose:

Ensure implementation quality.

Trigger:

Every pull request.

Reviewer:

Peer Engineer (or Senior Engineer for complex changes).

Checks:

- correctness
- follows architecture
- follows coding standards
- no unnecessary complexity
- test coverage
- no security issues
- no secrets exposed

Output:

PR approval or change requests.

---

## Architecture Review

Purpose:

Ensure design integrity.

Trigger:

- new feature
- schema change
- new integration
- any change affecting system structure

Reviewer:

Solution Architect.

Checks:

- aligns with ADRs
- follows domain model
- respects module boundaries
- future-proof (modular, extensible)
- risks identified

Output:

Architecture sign-off or redesign request.

---

## Security Review

Purpose:

Protect system integrity.

Trigger:

- authentication changes
- authorization changes
- file upload handling
- data exposure
- external integrations
- any change with security surface

Reviewer:

Security Reviewer.

Checks:

- authentication strength
- authorization coverage
- input validation
- output encoding
- secrets management
- dependency vulnerabilities
- data protection
- audit logging

Output:

Security sign-off or remediation list.

---

## Requirements Review

Purpose:

Ensure the right thing is built.

Trigger:

- new user story
- requirement change
- acceptance criteria definition

Reviewer:

Requirements Analyst.

Checks:

- clear and unambiguous
- testable
- aligns with project scope
- edge cases considered
- acceptance criteria exist

Output:

Requirements sign-off or clarification request.

---

## Design Review

Purpose:

Ensure UI/UX quality.

Trigger:

- new page or component
- user workflow change
- visualization integration

Reviewer:

Frontend Engineer or designated reviewer.

Checks:

- consistency with design system
- responsive behavior
- accessibility
- error states handled
- loading states handled
- empty states handled

Output:

Design sign-off or revision request.

---

## Quality Review

Purpose:

Independent verification of completeness.

Trigger:

After code review and before merge.

Reviewer:

QA Evaluator.

Checks:

- acceptance criteria met
- tests pass
- edge cases tested
- no regressions
- documentation updated
- error paths work

Output:

Quality sign-off or rejection.

---

# Review Criteria by Artifact

| Artifact | Required Reviews |
|---|---|
| Requirements document | Requirements |
| Architecture decision (ADR) | Architecture |
| API endpoint | Code + Security |
| Database migration | Architecture + Code |
| UI component | Code + Design |
| Permission change | Security + Architecture |
| Publishing integration | Architecture + Security |
| Bug fix | Code |
| Configuration change | Code + Security (if secrets) |
| Documentation | Peer check |

---

# Review Flow

```
Author prepares artifact
        |
        v
Submit for review
        |
        v
Reviewer evaluates
        |
        +-- Approved → Next gate or merge
        |
        +-- Changes requested → Author updates → Re-submit
        |
        +-- Rejected → Escalate or abandon
```

---

# Review Deadlines

| Review Type | Target Response |
|---|---|
| Code Review | Within 1 session |
| Security Review | Within 1 session |
| Architecture Review | Within 2 sessions |
| Requirements Review | Within 1 session |
| Quality Review | Within 1 session |

These are targets, not hard limits.

Complex changes may take longer.

---

# Review Quality Standards

Every review must:

1. Be specific — mention exact lines or behaviors

2. Be constructive — suggest improvements, not just problems

3. Be justified — explain why something is wrong

4. Be timely — do not block work unnecessarily

Prohibited:

- rubber-stamping without reading
- vague feedback ("fix this")
- personal criticism

---

# Escalation

If reviewer and author disagree:

1. Discuss and attempt resolution.

2. If unresolved, escalate to the next authority:

   - Code dispute → Solution Architect
   - Architecture dispute → Project Director
   - Security dispute → Human Owner
   - Quality dispute → Project Director

---

# Golden Rule

Every review is an investment in quality.

Reviews catch problems before they reach production.

No artifact merges without the required reviews.
