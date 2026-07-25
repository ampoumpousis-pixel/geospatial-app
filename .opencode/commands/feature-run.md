# Command: Feature Run

Version: 1.0

Command ID: CMD-206

---

# Purpose

Start execution independently. Standalone pipeline control command.

---

# Core Rule

This command invokes exactly one agent: the Execution Coordinator. It creates execution state and dispatches tasks to developer agents.

---

# Preconditions

- Task manifest exists: `docs/engineering/task-plans/F-XXX/task-manifest.json`.
- Execution packages exist: `docs/engineering/execution-packages/F-XXX/package-T-FXXX-*.md`.

If either is missing, direct the user to `/feature:exec-flow F-XXX` for the full pipeline.

---

# Execution

1. Verify preconditions are met.

2. Activate the Execution Coordinator Agent.

3. Coordinator:
   - Creates execution state at `docs/engineering/execution-state/F-XXX.json`.
   - Dispatches tasks to developer agents (backend, frontend, infrastructure).
   - Respects task dependencies and parallel groups.
   - Routes completed tasks through Code Reviewer.
   - Updates execution state as tasks progress.

4. Report the initial state.

---

# User Examples

```
/feature:run F-002
```

---

# Output

```
✓ Execution Started

Feature: F-XXX
Tasks: N dispatched
Pending: N

Monitor:
/status F-XXX

Resume if interrupted:
/resume F-XXX
```

---

# Golden Rule

The Coordinator runs the state machine. It dispatches, waits, reviews, and advances. It is the execution engine. Use `/feature:exec-flow` for the full validated pipeline.
