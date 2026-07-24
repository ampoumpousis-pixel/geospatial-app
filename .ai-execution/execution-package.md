# Execution Package Specification

Version: 1.0

Purpose: Define the format, rules, and boundaries of every Execution Package. This document is the contract between the task planner (or coordinator) and the developer agent.

---

## What Is an Execution Package?

An Execution Package is the complete, bounded universe of a single implementation task. It contains everything a developer agent needs to begin work — and nothing it does not.

The package is the bridge between planning and execution. The planner translates approved design into tasks. The package translates a single task into an executable instruction set.

### Why It Exists

Without a package, every developer agent must discover its own context:
- Reading the full Technical Design to find relevant sections.
- Searching the entire repository for related code.
- Guessing which standards apply.
- Guessing which directories it may write to.

This leads to inconsistent implementation, budget exhaustion, and cross-boundary creep. The package replaces discovery with delivery.

### Who Creates It

| Phase | Creator |
|---|---|
| Phase 1 (current) | Hand-crafted. The Project Director or task assigner prepares the package. |
| Phase 2 | Execution Coordinator — reads the Implementation Plan and generates packages per task. |

The Technical Planner (AGENT-103) and Task Planner (AGENT-105) provide the source material. The package author assembles it — they do not add to it.

### Who Consumes It

- **Developer Agents** (Backend, Frontend, Infrastructure) — the primary consumer. Reads the package, implements the task, verifies against completion criteria.
- **Code Reviewer** — reads the package to understand the task's scope, boundaries, and expected outcome. Uses it to assess whether the implementation stayed within defined limits.

---

## Required Sections

Every Execution Package must contain all of the following sections. An incomplete package is invalid and must not be given to a developer agent.

### 1. Metadata

```markdown
Feature: F-XXX
Task: T-FXXX-NNN
Package Version: 1.0
Owner: Backend | Frontend | Infrastructure
Execution Type: Implementation | Verification | Migration | Investigation | Spike
Status: Ready for Implementation
Created: YYYY-MM-DD
```

**Execution Type** declares the expected outcome. It influences which activities the agent performs — it is not a workflow selector. The agent follows the same lifecycle regardless of type.

| Type | Expected Activities |
|---|---|
| Implementation | Modify code, create files, write tests, verify |
| Verification | Validate state, run checks, produce report — no code changes |
| Migration | Modify code, run migrations, verify state, backup if applicable |
| Investigation | Inspect code, query data, produce report only — no writes |
| Spike | Experiment, prototype, produce findings — may write throwaway code in a sandbox |

If Execution Type is not specified, it defaults to `Implementation`.

**Source Artifact Versions** (must match current versions):

| Source Artifact | Required Version |
|---|---|
| Feature Specification | vN |
| Technical Design | vM |
| Engineering Review | vP |
| Engineering Approval | vQ |
| Implementation Plan | vR |

**Contract Dependencies** (optional — required when the referenced Technical Design declares contracts):

| Contract | Required Version |
|---|---|
| [contract name] | [version] |

When present, the package is valid only when all declared contract dependencies match their current versions. If the Technical Design contains a Contract Boundary Declaration, every execution package derived from it must declare its Contract Dependencies.

If any source version does not match the current version of that artifact, the package is stale and the developer agent must reject it.

### 2. Task Definition

```markdown
Task ID: T-FXXX-NNN

Summary: [One sentence describing the task.]

Description:
[Full description of what must be implemented. From the Implementation Plan.]

Scope:
- In scope: [specific items the agent must deliver]
- Out of scope: [specific items the agent must NOT touch, even if adjacent]
```

**Completion Criteria:**

A bullet list of verifiable conditions. The task is done when every condition is met. These derive from acceptance criteria in the Technical Design.

```markdown
Completion Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] ...
```

Each criterion must be testable. Vague criteria ("the code should be clean") are not valid.

### 3. Technical Context

```markdown
Technical Design References:
- Section X.Y — [title] — [brief relevance]
- Section A.B — [title] — [brief relevance]

Relevant Decisions (ADRs):
- ADR-XXX — [title]

Components Affected:
- [Component/Module 1] — [nature of change: new, modified, extended]
- [Component/Module 2] — [nature of change]

Dependencies:
- [Upstream task ID] — [what it provides — must be complete before this task]
- [Upstream task ID] — [what it provides]
```

The agent reads only the referenced design sections — not the entire Technical Design. Each reference must include the section identifier and a brief statement of why it is relevant to this task.

### 4. Standards Required

```markdown
Standards:
- .ai-rules/team/engineering-standards.md — [which sections apply]
- .ai-rules/project/geospatial-rules.md — [which sections apply]
- .ai-rules/security/security-rules.md — [which sections apply]
- .ai-rules/testing/verification-rules.md — [which sections apply]
```

List only the standards files and sections relevant to this specific task. The agent reads every listed standard before writing code.

### 5. Context Guidance

```markdown
Recommended Reads:
- platform/backend/app_name/models.py — [why this file is relevant]
- platform/backend/app_name/tests/test_models.py — [existing test patterns]

Avoid:
- platform/frontend/** — [reason: frontend is unrelated to this task]
- platform/backend/other_app/** — [reason: different domain]
```

**Recommended Reads** are files the planner believes are relevant — existing models to extend, tests to follow, utilities to use. These are suggestions, not requirements. The agent reads them at Layer 3 of the context expansion algorithm.

**Avoid** is a hard constraint. The agent must not read these files or directories. This prevents context creep into unrelated domains.

### 6. Ownership Boundary

```markdown
Allowed Writes:
- platform/backend/app_name/**
- platform/backend/app_name/tests/**

Forbidden Writes:
- platform/backend/other_app/**
- platform/frontend/**
- docs/**
- .ai-rules/**
- .company/**
```

Allowed writes use directory-level wildcard patterns (`app_name/**`). The agent may create, modify, or delete any file within these directories. Writing outside allowed writes is a policy violation — the agent must stop and escalate.

Forbidden writes are an explicit safety net. They restate the ownership boundaries for clarity, especially for directories adjacent to or nested within the allowed scope.

### 7. Verification Requirements

```markdown
Required Checks:
1. [ ] Run existing tests: platform/backend/app_name/tests/
2. [ ] Run linter: ruff, mypy, eslint (as applicable)
3. [ ] Run type checker: mypy (backend), tsc (frontend)
4. [ ] Verify acceptance criteria: [specific criteria from Technical Design]
5. [ ] Verify no writes outside allowed directories

Additional Verification:
- [Task-specific checks — e.g., "Verify API returns 201 on valid POST"]
- [Task-specific checks — e.g., "Verify error response matches contract"]
```

The standard five checks from the Execution Framework are mandatory. The package may add task-specific checks beyond those five.

---

## Version-Locking Rules

The Execution Package inherits the version-locking contract from `engineering-workflow.md`.

### Validity Rule

**An Execution Package is valid only when every referenced source artifact version matches the current version of that artifact.**

### Staleness

An Execution Package becomes stale when any of its referenced source artifacts is revised:

| Change | Effect |
|---|---|
| Feature Specification version changes | Package is stale |
| Technical Design version changes | Package is stale |
| Engineering Review version changes | Package is stale |
| Engineering Approval version changes | Package is stale |
| Implementation Plan version changes | Package is stale |

A stale package must not be executed. It must be regenerated against the current upstream versions.

### Developer Agent Obligation

Before beginning implementation, the developer agent must verify that every source version in the package metadata matches the current version of the corresponding artifact. If any version does not match, the agent must:
1. Stop.
2. Report the version mismatch.
3. Escalate to the Project Director.

The agent must not implement a task from a stale package.

### Regeneration

When a package is stale:
- **Phase 1:** The Project Director or task assigner creates a new package against the current upstream versions.
- **Phase 2:** The Execution Coordinator detects the invalidation and regenerates the package automatically.

---

## What an Execution Package Must NOT Contain

The package provides execution context. It must not create knowledge that belongs to upstream planning artifacts.

### Prohibited Content

| Must NOT Contain | Belongs To | Example |
|---|---|---|
| New architecture decisions | Technical Designer (AGENT-103) | "We will use Redis for session storage" |
| Product decisions | Feature Planner (AGENT-102) | "Password reset is a P1 priority" |
| Unapproved scope changes | Engineering Approval Gate | "This task now also includes email verification" |
| Implementation instructions | The developer agent decides | "Use a class-based view, override the post method" |
| Standards modifications | Standards (`.ai-rules/`) | "Override the security rules for this task" |
| References to unrelated domains | Not applicable | "Also read the frontend login component" |

### Implementation Autonomy

The package defines **what** to implement and **where** to write. It does not define **how** to implement. The developer agent owns implementation decisions (class structure, function design, algorithm choice) within the boundaries of approved design and standards.

If the Technical Design specifies implementation details (e.g., "use Django's `CreateView`"), the agent follows the design. If the design is silent, the agent chooses.

---

## Package Lifecycle

```
Implementation Plan (AGENT-105)
        │
        ▼
Package Author (Phase 1: Project Director, Phase 2: Execution Coordinator)
        │
        ▼
Execution Package v1.0 (Status: Ready for Implementation)
        │
        ├─── Upstream artifact changes? → Package is STALE → Regenerate
        │
        ├─── Task completed? → Package is CONSUMED → Archive
        │
        └─── Task rejected? → Package is RETURNED → Review + regenerate
```

### Statuses

| Status | Meaning |
|---|---|
| Draft | Package is being prepared. Not ready for an agent. |
| Ready for Implementation | All sections complete, versions verified. Ready for a developer agent. |
| In Progress | A developer agent is actively working on this task. |
| Consumed | Task completed. Package is archived. |
| Stale | Upstream artifact changed. Package must be regenerated. |
| Returned | Task could not be completed. Package needs review. |

---

## Concrete Package Template

When creating a package, use this structure:

```markdown
# Execution Package — T-FXXX-NNN

## Metadata

Feature: F-XXX
Task: T-FXXX-NNN
Package Version: 1.0
Owner: Backend
Status: Ready for Implementation
Created: YYYY-MM-DD

Source Artifact Versions:

| Source Artifact | Required Version |
|---|---|
| Feature Specification | vN |
| Technical Design | vM |
| Engineering Review | vP |
| Engineering Approval | vQ |
| Implementation Plan | vR |

---

## Task Definition

Task ID: T-FXXX-NNN

Summary: ...

Description:
...

Scope:
- In scope: ...
- Out of scope: ...

Completion Criteria:
- [ ] ...
- [ ] ...

---

## Technical Context

Technical Design References:
- Section X.Y — Title — Relevance

Relevant Decisions (ADRs):
- ADR-XXX — Title

Components Affected:
- Component — Change type

Dependencies:
- T-FXXX-NNN — What it provides

---

## Standards Required

Standards:
- .ai-rules/... — Sections that apply

---

## Context Guidance

Recommended Reads:
- path/to/file — Why relevant

Avoid:
- path/to/** — Reason

---

## Ownership Boundary

Allowed Writes:
- path/to/**

Forbidden Writes:
- path/to/**

---

## Verification Requirements

Required Checks:
1. [ ] Run existing tests: ...
2. [ ] Run linter: ...
3. [ ] Run type checker: ...
4. [ ] Verify acceptance criteria: ...
5. [ ] Verify no writes outside allowed directories

Additional Verification:
- ...
```

---

## Relationship With Other Documents

| Document | Relationship |
|---|---|
| `execution-framework.md` | Defines the policies the package enforces (ownership, allowed writes, verification). |
| `context-management.md` | Defines how the agent reads the package (Part 1) and expands beyond it (Part 2). |
| `engineering-workflow.md` | Defines the version-locking contract the package inherits. |
| `execution-artifact-map.md` | Shows where the package sits in the full pipeline. |

The Execution Package is the mechanism. The execution framework is the policy. Context management is the reading algorithm. Together they form the execution layer.
