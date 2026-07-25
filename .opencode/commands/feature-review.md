# Command: Feature Review

Version: 1.0

Command ID: CMD-209

---

# Purpose

Trigger code review manually. Standalone pipeline control command.

Normally the Execution Coordinator invokes the Code Reviewer automatically. Use this command for manual re-review or when a review was missed.

---

# Core Rule

This command invokes exactly one agent: the Code Reviewer. It reviews completed execution artifacts.

---

# Execution

1. If a specific task ID is provided (e.g., T-F001-003):
   - Locate the execution package: `docs/engineering/execution-packages/F-XXX/package-T-F001-003.md`.
   - Review only that task's implementation.

2. If only a feature ID is provided (e.g., F-002):
   - Review all completed tasks for that feature.
   - Read the execution state to identify tasks in AWAITING_REVIEW or COMPLETED state.

3. Activate the Code Reviewer.
   - Input: execution packages + Technical Design + Feature Specification.
   - Output: review result at `docs/engineering/reviews/F-XXX/`.

4. Return the review result.

---

# User Examples

```
/feature:review F-001
/feature:review F-001 T-F001-003
```

---

# Output

```
✓ Review Complete

F-XXX
Reviewed: N tasks
Findings: N (0 blocking, N advisory)

Next:
Execution will continue automatically
```

---

# Golden Rule

Review validates implementation against approved design. It is independent verification — not a substitute for developer self-checking.
