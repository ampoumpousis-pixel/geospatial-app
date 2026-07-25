# Command: Feature Plan

Version: 1.0

Command ID: CMD-203

---

# Purpose

Create a task manifest independently. Standalone pipeline control command — invokes AGENT-105 Task Planner on the feature path.

---

# Core Rule

This command invokes exactly one agent: AGENT-105 — Task Planner (Feature input path). It validates the approval chain before decomposing.

---

# Execution

1. Verify all four pipeline artifacts exist:
   - `docs/project/features/F-XXX/feature-spec.md`
   - `docs/engineering/technical-plans/F-XXX/technical-design.md`
   - `docs/engineering/reviews/F-XXX/engineering-review.md`
   - `docs/engineering/approvals/F-XXX/engineering-approval.md`

2. Activate AGENT-105 — Task Planner (Feature input path).

3. AGENT-105 validates the approval chain, decomposes the design, and produces:
   - `docs/engineering/task-plans/F-XXX/implementation-plan.md`
   - `docs/engineering/task-plans/F-XXX/task-manifest.json`

4. If Design Gap Returns (DGRs) are found:
   - Task manifest is blocked.
   - Gaps must be resolved by AGENT-103 before retrying.

5. Return the AGENT-105 console summary.

---

# User Examples

```
/feature:plan F-002
```

---

# Golden Rule

Task planning decomposes approved design into executable units. It does not re-architect. Use `/feature:design-flow` for the full pipeline.
