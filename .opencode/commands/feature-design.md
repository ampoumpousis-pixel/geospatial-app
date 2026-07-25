# Command: Feature Design

Version: 1.0

Command ID: CMD-201

---

# Purpose

Create technical design independently. Standalone pipeline control command — used for recovery, re-execution, or when design is needed without the full composite flow.

---

# Core Rule

This command invokes exactly one agent: AGENT-103 — Technical Planner. It does not chain to review, approval, or task planning.

---

# Execution

1. Verify feature spec exists: `docs/project/features/F-XXX/feature-spec.md`.
2. Activate AGENT-103 — Technical Planner.
3. AGENT-103 produces: `docs/engineering/technical-plans/F-XXX/technical-design.md`.
4. Return the AGENT-103 console summary.

---

# User Examples

```
/feature:design F-002
/feature:design F-005
```

---

# Golden Rule

Design is one stage of the pipeline. When run alone, no downstream artifacts are created. Use `/feature:design-flow` for the full pipeline.
