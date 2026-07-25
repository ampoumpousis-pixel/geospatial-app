# Command: Feature Design Flow

Version: 1.0

Command ID: CMD-210

---

# Purpose

Execute the full planning pipeline for a feature: Technical Design → Engineering Review → Human Approval Gate → Task Planning.

This is the primary planning command. It sequences four agents into a single composite flow with one human checkpoint.

---

# Core Rule

This command orchestrates the existing pipeline agents in sequence. It does not contain design logic. It does not modify artifacts. It invokes agents in the correct order and handles the human gate.

---

# Preconditions

The feature specification must exist:
```
docs/project/features/F-XXX/feature-spec.md
```

If not found, STOP and direct user to `/feature:create`.

---

# Execution

When invoked:

### Phase A — Technical Design

1. Activate AGENT-103 — Technical Planner.
2. Input: `docs/project/features/F-XXX/feature-spec.md`.
3. AGENT-103 produces:
   ```
   docs/engineering/technical-plans/F-XXX/technical-design.md
   ```
4. AGENT-103 declares contract boundaries (API, DB, Runtime contracts).
5. Wait for AGENT-103 to complete.

### Phase B — Engineering Review

1. Activate AGENT-104 — Engineering Design Reviewer.
2. Input: `feature-spec.md` + `technical-design.md`.
3. AGENT-104 produces:
   ```
   docs/engineering/reviews/F-XXX/engineering-review.md
   ```
4. AGENT-104 issues recommendation: READY FOR APPROVAL or REVISIONS REQUIRED.

5. If REVISIONS REQUIRED:
   - Report the blocking findings to the user.
   - Loop back to Phase A — Technical Design (AGENT-103 revises).
   - The new Technical Design version invalidates the previous review.
   - Re-run Phase B after revision.

6. If READY FOR APPROVAL:
   - Proceed to Phase C.

### Phase C — Human Approval Gate

1. Present the user with:
   - Feature ID and title.
   - Technical Design summary (version, key decisions, contracts).
   - Engineering Review summary (recommendation, finding count, any notes).
   - Decision options: APPROVED / REQUEST CHANGES.

2. If REQUEST CHANGES:
   - Record the reason.
   - Loop back to Phase A — Technical Design.
   - Inform the user that the pipeline will restart from Technical Design.

3. If APPROVED:
   - Record the decision:
     ```
     docs/engineering/approvals/F-XXX/engineering-approval.md
     ```
   - Proceed to Phase D.

### Phase D — Task Planning

1. Activate AGENT-105 — Task Planner (Feature input path).
2. Input: `feature-spec.md` + `technical-design.md` + `engineering-review.md` + `engineering-approval.md`.
3. AGENT-105 validates the approval chain, decomposes the design, and produces:
   ```
   docs/engineering/task-plans/F-XXX/implementation-plan.md
   docs/engineering/task-plans/F-XXX/task-manifest.json
   ```
4. If AGENT-105 returns Design Gap Returns (DGRs):
   - Report the gaps to the user.
   - Pipeline stops. DGRs must be resolved by AGENT-103 before retrying.

---

# Human Checkpoints

There is exactly one human checkpoint: the Approval Gate (Phase C).

The human decision authorizes execution knowledge creation. Everything else is agent-driven.

---

# Forbidden Actions

This command MUST NOT:
- skip Engineering Review
- skip human approval
- proceed to Task Planning with unresolved Design Gap Returns
- modify any artifact directly
- contain technical design logic or architecture decisions
- skip the version invalidation chain (changed design → invalidated review → invalidated approval)

---

# User Examples

```
/feature:design-flow F-002
/feature:design-flow F-005
```

---

# Completion

The command is complete when:
- A task manifest has been produced.
- The user is presented with the task count and `/feature:exec-flow F-XXX` as the next step.

---

# Output (Success)

```
✓ Design Flow Complete

Feature:
F-XXX — [Title]

Technical Design:
docs/engineering/technical-plans/F-XXX/technical-design.md

Engineering Review:
docs/engineering/reviews/F-XXX/engineering-review.md (READY FOR APPROVAL)

Engineering Approval:
APPROVED

Task Plan:
docs/engineering/task-plans/F-XXX/implementation-plan.md
docs/engineering/task-plans/F-XXX/task-manifest.json

Tasks:
N total

Next:
/feature:exec-flow F-XXX
```

# Output (Design Gap)

```
⚠ Design Flow Blocked — Design Gap

Feature:
F-XXX — [Title]

Gaps:
DGR-FXXX-001 — [description]
DGR-FXXX-002 — [description]

Next:
Resolve gaps with AGENT-103, then re-run /feature:design-flow F-XXX
```

---

# Golden Rule

Planning creates knowledge. The human authorizes it. Execution consumes it. This command sequences the planning pipeline — it does not create the knowledge itself.
