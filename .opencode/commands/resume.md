# Command: Resume

Version: 1.0

Command ID: CMD-208

---

# Purpose

Resume execution from the last valid state. Reads the execution state artifact and continues the pipeline — dispatching pending tasks, recovering from failures, or completing interrupted review loops.

Works for both Feature IDs (F-XXX) and Work IDs (W-XXX).

---

# Core Rule

Resume is not "start over." It reads the persisted state and continues from where execution stopped. The Execution Coordinator knows which tasks are in progress, pending, or failed.

---

# Execution

When invoked:

1. Determine whether the input is an F-XXX or W-XXX ID.

2. Verify the execution state file exists:
   ```
   docs/engineering/execution-state/F-XXX.json
   ```
   or
   ```
   docs/engineering/execution-state/W-XXX.json
   ```

3. If the file does not exist:
   - For features: direct user to `/feature:exec-flow F-XXX`.
   - For work: direct user to `/work:execute W-XXX`.

4. Activate the Execution Coordinator Agent with the resume flag.

5. The Execution Coordinator:
   - Reads the current state.
   - Identifies the last valid state for each task.
   - Dispatches pending tasks to developer agents.
   - Recover failed tasks (within retry_limit).
   - Route completed but unreviewed tasks through Code Reviewer.
   - Update the execution state as tasks progress.

6. Present the current status after resumption.

---

# Forbidden Actions

This command MUST NOT:
- reset execution state
- create new tasks or modify the manifest
- skip review for completed tasks
- modify the execution state directly (that's the Coordinator's job)

---

# User Examples

```
/resume F-001
/resume W-005
```

---

# Output

```
Resume F-XXX / W-XXX

Tasks resumed:
  T-XXX-001 → EXECUTING
  T-XXX-002 → PENDING
  T-XXX-003 → AWAITING_REVIEW

Failed (retries exhausted):
  [none or list]

Monitor:
/status F-XXX/W-XXX
```

---

# Golden Rule

The execution state is the single source of truth. Resume picks up where it left off — no guessing, no resetting.
