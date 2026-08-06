# GeoSpatial Platform — Engineering Workflow

Version:

2.0

Purpose:

Define the engineering planning pipeline contract and the day-to-day engineering task lifecycle from intake to delivery.

This document governs:
- **Part I — Engineering Planning Pipeline:** How Feature Specifications flow through Technical Design, Engineering Review, Approval, and Task Planning. This is the architectural governance layer.
- **Part II — Task Lifecycle:** How individual engineering tasks are processed from intake to close. This is the operational companion to WORKFLOW.md.

WORKFLOW.md describes the high-level development lifecycle.

---

# Part I — Engineering Planning Pipeline

## Pipeline Flow

Every Feature Specification passes through a coordinated four-agent pipeline before implementation:

```
AGENT-103: Technical Design
    |
    v
Frontend Integration Planner (only when Has User-Facing Surface: Yes)
    |
    v
AGENT-104: Engineering Review
    |
    +-- Revisions required --> AGENT-103 or Frontend Integration Planner
    |
    v (Ready)
Engineering Approval Gate
    |
    +-- Changes requested --> AGENT-103 or Frontend Integration Planner
    |
    v (Approved or Not Required)
AGENT-105: Task Plan
    |
    +-- Design gap found --> AGENT-103 or Frontend Integration Planner
    |
    v (Plan ready)
Implementation
```

**Critical rule:** Every return to AGENT-103 creates a new Technical Design version, which **invalidates** the previous Engineering Review and Engineering Approval. Every return to the Frontend Integration Planner creates a new Frontend Integration version, which invalidates the previous Engineering Review and Engineering Approval (while the Technical Design remains valid).

## Agent Roles in the Pipeline

| Agent | Role | Input | Output |
|---|---|---|---|
| AGENT-103 | Technical Planner | Feature Specification | Technical Design |
| Frontend Integration Planner | Frontend structural planner | Feature Spec + Technical Design (only when Has User-Facing Surface: Yes) | Frontend Integration |
| AGENT-104 | Engineering Design Reviewer | Technical Design + Feature Spec (+ Frontend Integration) | Engineering Review |
| Engineering Approval Gate | Human/Policy Decision Gateway | Review + Design + Feature Spec (+ Frontend Integration) | Engineering Approval |
| AGENT-105 | Task Planner | All approved artifacts | Implementation Plan |

## Source Version Dependencies

Every artifact in the pipeline must record exactly which versions of upstream artifacts it was built against.

| Artifact | Must Reference |
|---|---|
| Feature Specification | Its own version |
| Technical Design | Feature Specification version |
| Frontend Integration | Feature Specification version, Technical Design version |
| Engineering Review | Feature Specification version, Technical Design version, Frontend Integration version (when present) |
| Engineering Approval | Technical Design version, Engineering Review version, Frontend Integration version (when present) |
| Implementation Plan | Feature Specification version, Technical Design version, Frontend Integration version (when present), Engineering Review version, Engineering Approval version |
| Execution Package | Feature Specification version, Technical Design version, Frontend Integration version (when present), Engineering Review version, Engineering Approval version, Implementation Plan version |

### Contract Dependencies (Phase 2.1+)

When the Technical Design declares contracts in its Contract Boundary Declaration section, every execution package derived from it must also declare its Contract Dependencies.

| Artifact | Must Reference |
|---|---|
| Execution Package | Contract name and version for each contract it depends on |

**Document Version** tracks the evolution of the Technical Design document.

**Contract Version** tracks the evolution of a specific declared contract.

The two version sequences are independent. Example: `Technical Design v1.7` may carry `API-F001-AUTH v1.0`, `DB-F001-AUTH v1.3`, `RT-F001-AUTH v1.1`.

## Mandatory Artifact Fields

Every artifact must contain in its metadata:

1. **Artifact Version** — Incremented on every revision. Starts at 1.0.
2. **Status** — Current lifecycle state (Draft, Ready for Review, Approved, etc.)
3. **Source Artifact Versions** — Exact versions of all upstream artifacts this document was built against
4. **Revision History** — Entry for each version describing what changed and why
5. **Superseded Version** — When applicable, the previous version this revision replaces
6. **Immediate Next Owner** — The agent or role that must act next

## Downstream Validity Rule

**A downstream artifact is valid only when all referenced source versions exactly match the current versions of those source artifacts. For execution packages with declared Contract Dependencies, the package is valid only when all declared contract versions also match.**

Consequences:

- If a Technical Design is revised, the Engineering Review is stale.
- If a Technical Design is revised after approval, the Engineering Approval is stale.
- If a Frontend Integration is revised, the Engineering Review is stale.
- If a Frontend Integration is revised after approval, the Engineering Approval is stale.
- If a Feature Specification is updated, every downstream artifact is stale.
- AGENT-105 must verify that every referenced source version matches before beginning task decomposition.
- Stale artifacts require the owning agent to re-execute against the current upstream version.

## Two-Track Invalidation Rule

When a revision loop is triggered (REVISIONS REQUIRED from AGENT-104 or REQUEST CHANGES from the Engineering Approval Gate), the command layer determines which artifacts are stale and restarts from the owning phase:

| Trigger | TD stale? | FIP stale? | Review stale? | Approval stale? | Restart from |
|---|---|---|---|---|---|
| Findings apply to Technical Design only | Yes | Yes | Yes | Yes | AGENT-103 |
| Findings apply to Frontend Integration only | No | Yes | Yes | Yes | Frontend Integration Planner |
| Findings apply to both | Yes | Yes | Yes | Yes | AGENT-103 |
| No Frontend Integration (Has User-Facing Surface: No) | Yes | N/A | Yes | Yes | AGENT-103 |

**Determining which artifact findings apply to:**
- AGENT-104 classifies each Required Change with an `Applies to: Technical Design | Frontend Integration | Both` field in the review artifact.
- The Engineering Approval Gate classifies REQUEST CHANGES the same way.
- The command layer reads the union of all finding targets to determine staleness.
- When only the Frontend Integration is stale, the Technical Design is NOT regenerated — the Frontend Integration Planner re-runs against the unchanged Technical Design.

**Frontend-impact trigger:** The command layer reads `Has User-Facing Surface: Yes or No` from the Feature Specification metadata (set by AGENT-102). `Yes` requires the Frontend Integration artifact in the pipeline. `No` omits it — the pipeline operates exactly as before this stage existed. The decision is a read, never an inference.

## Revision and Return Protocol

### Returns to AGENT-103

AGENT-103 must accept four types of returns:

| Return Type | From | Trigger |
|---|---|---|
| Product Decision Return | AGENT-102 | Missing product behavior discovered during design |
| Review Findings | AGENT-104 | Design gaps, inconsistencies, or missing decisions |
| Approval Change Request | Engineering Approval Gate | Human requests specific changes with stable IDs |
| Design Gap Return (DGR) | AGENT-105 | Implementation detail missing from the design |

The Frontend Integration Planner must also accept returns of the same types that apply to the Frontend Integration artifact:
- Review Findings from AGENT-104 whose `Applies to` field targets the Frontend Integration
- Approval Change Requests from the Engineering Approval Gate that target the Frontend Integration
- Design Gap Returns (DGRs) from AGENT-105 whose missing detail is an unmapped page, component, API, or permission in the Frontend Integration

### Revision Rules

When AGENT-103 revises a Technical Design:

1. Update the same `technical-design.md` — do not create a new file.
2. Increment the Technical Design Version.
3. Add a Revision History entry describing what changed and which return IDs are resolved.
4. Identify each resolved return ID explicitly.
5. Reset the Technical Design Status and readiness.
6. Route through AGENT-104 for re-review.
7. The previous Engineering Review and Engineering Approval are automatically invalidated.

**AGENT-103 must never return directly to AGENT-105 after changing the design.** The design must pass through AGENT-104 and the Engineering Approval Gate again.

### Invalidation Rules

- A new Technical Design version invalidates all prior reviews and approvals for that feature.
- A new Feature Specification version invalidates the Technical Design, review, and approval.
- An Engineering Review that reports REVISIONS REQUIRED or BLOCKED invalidates any prior approval.
- AGENT-105 must reject any package where source versions do not match.
- An execution package is stale when any declared contract dependency version does not match the current version declared in the Technical Design's Contract Boundary Declaration.

---

# Part II — Task Lifecycle

Every engineering task follows these stages:

```
Intake
   |
   v
Triage
   |
   v
Plan
   |
   v
Implement
   |
   v
Verify
   |
   v
Review
   |
   v
Merge
   |
   v
Deploy
   |
   v
Close
```

---

# Stage 1 — Intake

Tasks enter the system through:

- /work command (universal entry point)
- direct task assignment
- bug report
- improvement suggestion

Each task must include:

```
Summary:
Description:
Priority: (low/medium/high/critical)
Requester:
```

Work Intake Agent classifies the request and routes it.

---

# Stage 2 — Triage

Purpose:

Determine if the task is valid and ready for work.

Checks:

- is the task clear?
- are requirements known?
- is scope appropriate?
- are dependencies available?
- is the task within project scope?

Outcomes:

- Accepted → move to Plan
- Needs clarification → request more information
- Rejected → explain and close
- Deferred → move to backlog

---

# Stage 3 — Plan

Purpose:

Define the approach before writing code.

Activities:

- break into sub-tasks if needed
- identify affected files
- identify tests needed
- estimate effort
- identify risks
- check approval requirements

Output:

```
Implementation plan:
- Files to modify:
- New files needed:
- Tests:
- Risks:
- Approval level:
```

If Level 3+ approval is required, submit for approval before implementation.

---

# Stage 4 — Implement

Purpose:

Write the code.

Rules:

- one feature per session
- follow architecture decisions
- follow coding standards
- write tests alongside code
- commit frequently with clear messages
- do not change scope without re-planning

Implementation is complete when all planned changes and tests are written.

---

# Stage 5 — Verify

Purpose:

Confirm the implementation works.

Activities:

- run existing tests
- run new tests
- run linter and type checker
- manual smoke test if applicable
- verify edge cases

If any verification fails, return to Implementation.

---

# Stage 6 — Review

Purpose:

Get independent quality assessment.

Submit for the required reviews (see review-matrix.md).

Reviewer checks:

- correctness
- architecture alignment
- security
- test coverage
- code quality

If changes requested, return to Implementation.

If rejected, escalate or abandon.

---

# Stage 7 — Merge

Purpose:

Integrate completed work into the main branch.

Requirements:

- all required reviews passed
- all tests pass
- no merge conflicts
- documentation updated if needed

Merge strategy:

- squash merge for single-task branches
- rebase for multi-commit feature branches

---

# Stage 8 — Deploy

Purpose:

Deliver the change to the target environment.

Deployment types:

- Development environment — automatic after merge
- Staging environment — manual trigger after verification
- Production environment — manual trigger with human approval

Deployment requires:

- passing CI pipeline
- deployment notes if migration or config change
- rollback plan for production

---

# Stage 9 — Close

Purpose:

Finalize the task.

Activities:

- update PROJECT_STATUS.md
- update .ai-memory/current-state.md
- record lessons learned
- update .ai-memory/handoff.md if session ends
- mark task as closed

A task is not complete until knowledge is preserved.

---

# Task States

```
Backlog       → Task is accepted but not started
Planned       → Implementation plan exists
In Progress   → Implementation is active
In Review     → Under review
Changes Needed → Fixes requested by reviewer
Approved      → Reviews passed, ready to merge
Merged        → Code is in main branch
Deployed      → Code is in target environment
Closed        → Fully complete, knowledge recorded
Cancelled     → Task abandoned with reason
```

---

# Priority Definitions

| Priority | Response | Example |
|---|---|---|
| Critical | Immediate | Production outage, security breach |
| High | Within 1 session | Blocking other work, data loss risk |
| Medium | Within this week | Feature improvement, non-critical bug |
| Low | When possible | Cosmetic, nice-to-have |

---

# Branch Naming

```
<type>/<task-id>-<short-description>
```

Types:

- feat/ — new feature
- fix/ — bug fix
- refactor/ — code restructuring
- docs/ — documentation
- chore/ — maintenance

Example:

```
feat/CMD-101-geotiff-upload
fix/CMD-102-greek-filename-search
```

---

# Commit Message Convention

```
<type>(<scope>): <short description>

<optional body>
```

Types: feat, fix, refactor, docs, chore, test

Scope: module or component name

Examples:

```
feat(upload): add GeoTIFF file type support

fix(search): handle Unicode filenames correctly

docs(api): document resource creation endpoint
```

---

# Origin-Agnostic Execution Rule

Execution artifacts are origin-agnostic. Feature-originated and work-originated manifests must produce identical execution behavior. The execution pipeline (Execution Package Agent, Execution Coordinator, Developer Agents, Code Reviewer) does not branch on origin type.

Origin metadata (the `source` field in the manifest) exists only for traceability and reporting. No downstream agent may use `source.type` to alter execution behavior.

Consequences:
- A work-originated manifest and a feature-originated manifest that produce the same task structure will execute identically.
- The Execution Package Agent does not care whether the input came from a Feature Planner or a Work Request.
- The Code Reviewer does not apply different standards based on origin.
- Any agent observed branching on `source.type` is violating this rule.

---

# Command Gate Rule

Commands select pipeline entry points. They do not implement workflow logic. Workflow behavior belongs to agents and execution artifacts.

Valid commands:
- parse input
- locate or create artifacts
- invoke agents
- pass parameters
- trigger approved flows

Commands must never:
- contain engineering logic
- make architectural decisions
- modify artifacts directly (beyond artifact creation for entry points like `/feature:create` and `/work:create`)
- branch behavior based on origin type
- hide workflow logic that belongs to agents

The command layer is thin, declarative, and boring.

---

# Golden Rule

Every task follows the full lifecycle.

Skipping stages increases risk.

Plan before you build. Verify before you submit. Record before you close.
