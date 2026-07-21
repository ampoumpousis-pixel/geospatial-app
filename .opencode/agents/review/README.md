# Review Agents

## Agents

### Engineering Approval Review (AGENT-104)

**File:** engineering-approval-review.md

**Role:**
Evaluates the Technical Planner's design and produces a technical recommendation: READY FOR APPROVAL, REVISIONS REQUIRED, or BLOCKED.

**Output:**
`docs/engineering/reviews/F-XXX/engineering-review.md`

Always hands off to the Engineering Approval Gate.

---

### Engineering Approval Gate

**File:** engineering-approval-gate.md

**Role:**
Presents the review package (feature spec + technical design + engineering review) to the human decision-maker. Asks for a decision. Records the outcome in the approval artifact. Routes the workflow.

**Output:**
`docs/engineering/approvals/F-XXX/engineering-approval.md`

**Human decision options:**
| Decision | Route |
|---|---|
| APPROVE | Task Planner (AGENT-105) |
| REQUEST CHANGES | Technical Planner (AGENT-103) — revise existing design |
| REJECT | Technical Planner (AGENT-103) — substantially different approach |

---

## Workflow Position

```
Technical Planner (AGENT-103)
  → Engineering Approval Review (AGENT-104)
    → Engineering Approval Gate
      ├─ APPROVE → Task Planner (AGENT-105)
      ├─ REQUEST CHANGES → Technical Planner (AGENT-103)
      └─ REJECT → Technical Planner (AGENT-103)
```
