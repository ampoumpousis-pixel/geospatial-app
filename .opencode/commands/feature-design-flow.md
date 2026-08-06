# Command: Feature Design Flow

Version: 1.1

Command ID: CMD-210

---

# Purpose

Execute the full planning pipeline for a feature: Technical Design → Frontend Integration (when user-facing) → Engineering Review → Human Approval Gate → Task Planning.

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

The feature specification MUST contain `Has User-Facing Surface: Yes or No` in its metadata (set by AGENT-102). This field determines whether the Frontend Integration Planner runs in Phase A2.

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

### Phase A2 — Frontend Integration (conditional)

1. Read `Has User-Facing Surface` from `feature-spec.md` §1 Metadata.
2. If `No` — SKIP this phase. Proceed to Phase B. No frontend-integration.md artifact is created or expected downstream.
3. If `Yes` — activate the Frontend Integration Planner.
4. Input: `feature-spec.md` + `technical-design.md`.
5. The planner produces:
   ```
   docs/engineering/frontend-integration/F-XXX/frontend-integration.md
   ```
6. Wait for the planner to complete.

### Phase B — Engineering Review

1. Activate AGENT-104 — Engineering Design Reviewer.
2. Input: `feature-spec.md` + `technical-design.md` (+ `frontend-integration.md` when Phase A2 ran).
3. AGENT-104 produces:
   ```
   docs/engineering/reviews/F-XXX/engineering-review.md
   ```
4. AGENT-104 issues recommendation: READY FOR APPROVAL or REVISIONS REQUIRED.

5. If REVISIONS REQUIRED:
   - Report the blocking findings to the user.
   - Determine which artifacts are stale (see Two-Track Invalidation below).
   - Loop back to the phase owning the stale artifact(s).
   - New versions of upstream artifacts invalidate downstream review.
   - Re-run the affected phases.

6. If READY FOR APPROVAL:
   - Proceed to Phase C.

### Phase C — Human Approval Gate

1. Present the user with:
   - Feature ID and title.
   - The **operator-defined scope** (from the original command or Step 0 baseline).
   - The **feature specification scope** (from `feature-spec.md` §10 In Scope / Out of Scope).
   - Any **differences between operator scope and spec scope** (from `feature-spec.md` Scope Comparison section, per FI-G-004).
   - Technical Design summary (version, key decisions, contracts).
   - **Frontend Integration summary when Phase A2 ran** (pages added, pages modified, routes added, navigation changes, component counts).
   - Engineering Review summary (recommendation, finding count, any notes).
   - Decision options: APPROVED / REQUEST CHANGES.

2. Ask the user explicitly:

   > "Does the feature specification match the authorized scope? If scope has
   > expanded beyond the original operator input, do you authorize the new scope?"
   >
   > (When Phase A2 ran) "Do the pages, routes, and navigation entries introduced
   > by the frontend integration fall within the approved feature boundary?"

3. Record the scope decision in the approval artifact.

4. If REQUEST CHANGES:
   - Record the reason.
   - Determine which artifacts are stale (see Two-Track Invalidation below).
   - Loop back to the phase owning the stale artifact(s).
   - Inform the user that the pipeline will restart from the appropriate phase.

5. If APPROVED:
   - Record the decision:
     ```
     docs/engineering/approvals/F-XXX/engineering-approval.md
     ```
   - Include in the approval artifact: scope comparison result and any scope expansion authorizations.
   - Proceed to Phase D.

### Phase D — Task Planning

1. Activate AGENT-105 — Task Planner (Feature input path).
2. Input: `feature-spec.md` + `technical-design.md` + `engineering-review.md` + `engineering-approval.md` (+ `frontend-integration.md` when Phase A2 ran).
3. AGENT-105 validates the approval chain, decomposes the design, and produces:
   ```
   docs/engineering/task-plans/F-XXX/implementation-plan.md
   docs/engineering/task-plans/F-XXX/task-manifest.json
   ```
4. If AGENT-105 returns Design Gap Returns (DGRs):
   - Report the gaps to the user.
   - Pipeline stops. DGRs must be resolved by the owning agent before retrying:
     - DGRs citing missing APIs/permissions/models in the Technical Design → AGENT-103.
     - DGRs citing unmapped pages/components in the Frontend Integration → Frontend Integration Planner.

---

# Two-Track Invalidation

When a revision loop is triggered (REVISIONS REQUIRED from AGENT-104 or REQUEST CHANGES from the Human Gate), the command layer determines which artifact(s) are stale and restarts from the owning phase.

| Trigger | TD stale? | FIP stale? | Review stale? | Approval stale? | Restart from |
|---|---|---|---|---|---|
| Findings apply to Technical Design only | Yes | Yes | Yes | Yes | Phase A (AGENT-103) |
| Findings apply to Frontend Integration only | No | Yes | Yes | Yes | Phase A2 (FIP) |
| Findings apply to both | Yes | Yes | Yes | Yes | Phase A (AGENT-103) |
| No Frontend Integration (surface = No) | Yes | N/A | Yes | Yes | Phase A (AGENT-103) |

**Determining which artifact findings apply to:**
- AGENT-104 classifies each Required Change with an `Applies to: Technical Design | Frontend Integration | Both` field in the review artifact.
- The Human Gate classifies REQUEST CHANGES the same way.
- The command layer reads the union of all finding targets to determine staleness.

**Staleness cascade (per Downstream Validity Rule):**
- A revised Technical Design makes the Frontend Integration, Review, Approval, and Task Plan stale.
- A revised Frontend Integration (Technical Design unchanged) makes the Review, Approval, and Task Plan stale — the Technical Design remains valid and is NOT regenerated.

**Evidence preservation (FI-G-002):** Before any artifact is replaced with a new version, invoke `/lifecycle archive` to preserve the superseded version.

---

# Human Checkpoints

There is exactly one human checkpoint: the Approval Gate (Phase C).

The human decision authorizes execution knowledge creation. Everything else is agent-driven.

---

# Forbidden Actions

This command MUST NOT:
- skip Engineering Review
- skip human approval
- skip the Frontend Integration phase when `Has User-Facing Surface: Yes`
- proceed to Task Planning with unresolved Design Gap Returns
- modify any artifact directly
- contain technical design logic or architecture decisions
- skip the version invalidation chain (changed design → invalidated review → invalidated approval)
- run the Frontend Integration phase when `Has User-Facing Surface: No`

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

Frontend Integration (when Has User-Facing Surface: Yes):
docs/engineering/frontend-integration/F-XXX/frontend-integration.md

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
