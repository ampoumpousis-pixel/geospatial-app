# Command: Feature Approve Design

Version: 1.0

Command ID: CMD-202

---

# Purpose

Record the human approval decision for a technical design. Standalone pipeline control command.

---

# Core Rule

This command invokes the Engineering Approval Gate. It records the decision as an artifact. It does not evaluate the design — that is AGENT-104's job.

---

# Execution

1. Verify these artifacts exist:
   - `docs/engineering/technical-plans/F-XXX/technical-design.md`
   - `docs/engineering/reviews/F-XXX/engineering-review.md`

2. Present the user with the design summary and review recommendation.

3. Ask for the decision: APPROVED / REQUEST CHANGES / NOT REQUIRED.

4. Record the decision at: `docs/engineering/approvals/F-XXX/engineering-approval.md`.

5. If APPROVED or NOT REQUIRED → next is `/feature:plan F-XXX` or `/feature:exec-flow F-XXX`.
   If REQUEST CHANGES → next is `/feature:design F-XXX` (AGENT-103 revises).

---

# User Examples

```
/feature:approve-design F-002
```

---

# Golden Rule

The human authorizes the design. The approval artifact records that authorization. Nothing downstream executes without it.
