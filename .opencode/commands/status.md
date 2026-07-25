# Command: Status

Version: 1.0

Command ID: CMD-207

---

# Purpose

Report execution progress for a feature or work item. Reads the execution state artifact and presents a human-readable summary.

Works for both Feature IDs (F-XXX) and Work IDs (W-XXX).

---

# Core Rule

This command is stateless and read-only. It reads one file, formats the information, and prints it. It never modifies state.

---

# Execution

When invoked:

1. Determine whether the input is an F-XXX or W-XXX ID.

2. Locate the execution state file:
   ```
   docs/engineering/execution-state/F-XXX.json
   ```
   or
   ```
   docs/engineering/execution-state/W-XXX.json
   ```

3. If the file does not exist, report:
   ```
   No execution state found for F-XXX/W-XXX.
   Execution has not started yet.
   ```

4. Read the execution state JSON.

5. Parse the task list and aggregate state:
   - Total tasks
   - Tasks by state: PENDING, GENERATING_PACKAGE, PACKAGE_READY, EXECUTING, AWAITING_REVIEW, COMPLETED, FAILED, BLOCKED
   - Per-task details: task ID, domain, executor, current state, retry count

6. Present the summary.

---

# Output

```
F-XXX / W-XXX — [Title]

Status:
[Percentage complete]

Tasks:
  Completed:  N / Total
  Executing:  N
  Pending:    N
  Failed:     0
  Blocked:    0

Per-Task:
  T-XXX-001  COMPLETED       backend     backend-implementation-agent
  T-XXX-002  EXECUTING       frontend    frontend-implementation-agent
  T-XXX-003  PENDING         infra       infrastructure-implementation-agent

Next:
/resume F-XXX/W-XXX  (if incomplete)
```

---

# User Examples

```
/status F-001
/status W-003
```

---

# Golden Rule

Execution state is a filesystem fact. This command reads it and reports it — nothing more.
