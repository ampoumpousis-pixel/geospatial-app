# Engineering Team Standards

Version:

1.0


Applies to:

- Backend Engineers
- Frontend Engineers
- DevOps Engineers
- Architecture Agents
- QA Engineers

Purpose:

Define professional software engineering practices used by the virtual engineering team.

---

# Engineering Philosophy

The team optimizes for:

1. Correctness

2. Maintainability

3. Simplicity

4. Reliability

5. Understandability


Speed without quality creates future cost.

---

# Rule 1 — Understand Existing Systems Before Changing Them

Before modifying existing code:

Agents must:

- inspect relevant files
- understand current architecture
- identify dependencies
- check existing patterns

Do not rewrite systems based on assumptions.

---

# Rule 2 — Plan Before Implementation

Every meaningful change requires:

```

Problem

↓

Impact Analysis

↓

Implementation Plan

↓

Code Change

↓

Verification

```

The plan should identify:

- files affected
- risks
- tests required

---

# Rule 3 — Small, Focused Tasks

Work should be divided into tasks that fit within one agent context window.

Prefer:

```

Implement Resource thumbnail generation

```

over:

```

Build the complete media subsystem

```

Large goals must be decomposed.

---

# Rule 4 — Trace Bullets First

For uncertain or high-risk functionality, create a trace bullet.

A trace bullet is:

A minimal complete path through the system.

Example:

```

Frontend

↓

API endpoint

↓

Service layer

↓

Database

↓

Test

```

Purpose:

- validate architecture
- discover unknown constraints
- reduce implementation risk

---

# Rule 5 — DRY (Don't Repeat Yourself)

Avoid duplicated logic.

When duplication appears:

Evaluate whether it should become:

- shared service
- utility
- component
- abstraction

Do not duplicate business rules.

---

# Rule 6 — YAGNI (You Aren't Gonna Need It)

Do not implement functionality without a current requirement.

Avoid:

- unused abstractions
- speculative frameworks
- future-only features
- unnecessary configuration

Future flexibility should come from clean design, not unused code.

---

# Rule 7 — SOLID Principles

Software design should follow:

## Single Responsibility

Components should have one reason to change.


## Open/Closed

Extend behavior without unnecessary modification.


## Liskov Substitution

Implementations should respect their contracts.


## Interface Segregation

Avoid large unnecessary interfaces.


## Dependency Inversion

Depend on abstractions where appropriate.

---

# Rule 8 — AI-Friendly Code Design

Code must be understandable by humans and AI agents.

Prefer:

- small files
- clear names
- predictable structures
- explicit logic
- documented decisions

Avoid:

- extremely large files
- hidden magic behavior
- excessive abstraction layers

---

# Rule 9 — Avoid Generated Complexity

AI agents often produce excessive code.

Before accepting implementation:

Review:

- Is every line necessary?
- Does this solve the requested problem?
- Could it be simpler?
- Does it introduce unnecessary dependencies?

---

# Rule 10 — Architecture Boundaries Matter

Business logic should not live everywhere.

Respect separation:

```

Presentation Layer

↓

Application Layer

↓

Domain Logic

↓

Infrastructure

```

---

# Rule 11 — Test Before Declaring Complete

Every feature requires verification.

Minimum:

- happy path
- edge cases
- failure scenarios

---

# Rule 12 — Acceptance Criteria Drive Development

Implementation should trace back to:

```

User Need

↓

User Story

↓

Acceptance Criteria

↓

Test

↓

Code

```

If code cannot trace back to user value, question its purpose.

---

# Rule 13 — Evaluator-Optimizer Workflow

Development uses independent review.

Process:

```

Generator Agent

↓

Evaluator Agent

↓

Feedback

↓

Improvement

↓

Approval

```

The creator does not approve their own work.

---

# Rule 14 — Regression Awareness

When changing existing functionality:

Agents must consider:

- existing behavior
- affected components
- regression tests

New code must not silently break old functionality.

---

# Rule 15 — Error Prevention Memory

Repeated mistakes become rules.

When a pattern appears:

Example:

"Every page forgot empty states."

Create prevention guidance:

```

.ai-memory/errors.md

or

.ai-rules/team/

```

---

# Rule 16 — Dependency Discipline

Before adding a dependency:

Evaluate:

- necessity
- maintenance cost
- security impact
- project alignment

Prefer existing ecosystem tools.

---

# Rule 17 — Verification Checklist

Before completing a task:

Confirm:

✓ Requirement satisfied

✓ Tests added

✓ Existing tests pass

✓ Documentation updated

✓ Memory updated

✓ No unnecessary complexity introduced

---

# Engineering Golden Rule

The best implementation is not the largest.

It is the smallest implementation that fully satisfies the requirement while remaining maintainable.
```

---
