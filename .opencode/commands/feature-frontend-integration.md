# Command: Feature Frontend Integration

Version: 1.0

Command ID: CMD-215

---

# Purpose

Create or regenerate the Frontend Integration artifact independently. Standalone pipeline control command — used for recovery, re-execution, or when the Frontend Integration is stale and must be regenerated against an unchanged Technical Design (two-track invalidation track B).

---

# Core Rule

This command invokes exactly one agent: the Frontend Integration Planner. It does not chain to review, approval, or task planning.

---

# Preconditions

Both source artifacts must exist:

```
docs/project/features/F-XXX/feature-spec.md
docs/engineering/technical-plans/F-XXX/technical-design.md
```

The Feature Specification metadata must contain `Has User-Facing Surface: Yes`. If the field is `No` or absent, STOP with an error — this planner is not required for backend-only features.

---

# Execution

1. Verify the Feature Specification exists and declares `Has User-Facing Surface: Yes`.
2. Verify the Technical Design exists.
3. Activate the Frontend Integration Planner.
4. The planner produces:
   ```
   docs/engineering/frontend-integration/F-XXX/frontend-integration.md
   ```
5. Return the planner console summary.

---

# Forbidden Actions

This command MUST NOT:
- run the Technical Planner (AGENT-103)
- run Engineering Review (AGENT-104)
- invoke the approval gate
- invoke the Task Planner (AGENT-105)
- modify any artifact directly

---

# User Examples

```
/feature:frontend-integration F-004
```

---

# Output (Success)

As returned by the Frontend Integration Planner — typically:

```
✓ Frontend Integration Complete
...
Next: AGENT-104 — Engineering Design Reviewer
```

---

# Golden Rule

Frontend integration is one stage of the pipeline. When run alone, no downstream artifacts are created or invalidated. Use `/feature:design-flow` for the full pipeline.