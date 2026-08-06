# Command: Work Escalate

Version: 1.0

Command ID: CMD-214

---

# Purpose

Route a Level 3 work request through the full Technical Design pipeline. Converts a work request into a feature-style engineering flow while preserving its work origin.

Use this command when:
- `/work:execute` produced a Level 3 escalation
- The work requires architecture decisions, contract changes, or multi-domain coordination

---

# Core Rule

Escalation converts the knowledge path from "Work → Task Manifest" to "Work → Technical Design → Task Manifest." The manifest still carries `source.type: "work"`. The execution pipeline remains origin-agnostic.

---

# Execution

When invoked:

1. Verify the work request and assessment exist:
   ```
   docs/project/work/W-XXX/work-request.md
   docs/project/work/W-XXX/assessment.md
   ```
   If either is missing, STOP.
   If the assessment is not Level 3, STOP — this work does not need escalation.

2. Sequence the engineering pipeline:

   **Step A — Technical Design**
   - Activate AGENT-103 — Technical Planner.
   - Input: `work-request.md` + `assessment.md` (escalation detail).
   - AGENT-103 produces:
     ```
     docs/engineering/technical-plans/W-XXX/technical-design.md
     ```
   - AGENT-103 declares contract boundaries as appropriate.

   **Step A2 — Frontend Integration (when Has User-Facing Surface: Yes)**
   - Read `Has User-Facing Surface` from `work-request.md` metadata.
   - If `No` — skip this step.
   - If `Yes` — activate the Frontend Integration Planner.
   - Input: `work-request.md` + `technical-design.md`.
   - Produces:
     ```
     docs/engineering/frontend-integration/W-XXX/frontend-integration.md
     ```

   **Step B — Engineering Review**
   - Activate AGENT-104 — Engineering Design Reviewer.
   - Input: `technical-design.md` + `work-request.md` (+ `frontend-integration.md` when present).
   - Produces:
     ```
     docs/engineering/reviews/W-XXX/engineering-review.md
     ```
   - If REVISIONS REQUIRED → loop back to the owning step (AGENT-103 or Frontend Integration Planner, per the `Applies to` classification).

   **Step C — Engineering Approval Gate**
   - Human checkpoint: review the technical design and engineering review (and frontend integration when present).
   - Decision: APPROVED / REQUEST CHANGES / NOT REQUIRED.
   - Records:
     ```
     docs/engineering/approvals/W-XXX/engineering-approval.md
     ```
   - If REQUEST CHANGES → loop back to the owning step.

   **Step D — Task Planning**
   - Activate AGENT-105 — Task Planner (Feature input path, but against W-XXX).
   - Input: `work-request.md` + `technical-design.md` + `engineering-review.md` + `engineering-approval.md` (+ `frontend-integration.md` when present).
   - Validates the approval chain.
   - Produces:
     ```
     docs/engineering/task-plans/W-XXX/task-manifest.json
     ```
   - The manifest carries `source.type: "work"` with `source.id: "W-XXX"`.

3. Return the final status to the user:
   - Task manifest ready.
   - Next: `/work:execute W-XXX` to proceed to execution.

---

# Forbidden Actions

This command MUST NOT:
- skip the Technical Design step
- skip Engineering Review
- skip the human approval gate
- skip the Frontend Integration step when `Has User-Facing Surface: Yes`
- produce a task manifest without passing through the full pipeline
- convert the work request into a Feature (it remains W-XXX, not F-XXX)
- modify the work-request.md or assessment.md

---

# User Examples

```
/work:escalate W-003
/work:escalate W-007
```

---

# Completion

The command is complete when AGENT-105 has produced a task manifest and the user is ready to execute.

---

# Output

```
✓ Work Escalation Complete

Work:
W-XXX — [Title]

Technical Design:
docs/engineering/technical-plans/W-XXX/technical-design.md

Engineering Review:
docs/engineering/reviews/W-XXX/engineering-review.md

Engineering Approval:
docs/engineering/approvals/W-XXX/engineering-approval.md

Task Manifest:
docs/engineering/task-plans/W-XXX/task-manifest.json

Next:
/work:execute W-XXX
```

---

# Golden Rule

Escalation adds design knowledge — it does not change origin. Work remains work. The execution pipeline does not care.
