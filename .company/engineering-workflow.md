# GeoSpatial Platform — Engineering Workflow

Version:

1.0

Purpose:

Define the day-to-day engineering task lifecycle from intake to delivery.

This is the operational companion to WORKFLOW.md.

WORKFLOW.md describes the high-level development lifecycle.

This document describes how individual engineering tasks are processed.

---

# Task Lifecycle

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

# Golden Rule

Every task follows the full lifecycle.

Skipping stages increases risk.

Plan before you build. Verify before you submit. Record before you close.
