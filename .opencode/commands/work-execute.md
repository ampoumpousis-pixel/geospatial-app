# Command: Work Execute

Version: 1.0

Command ID: CMD-213

---

# Purpose

Execute a work request. The Task Planner (AGENT-105) assesses complexity and either produces a task manifest directly or escalates to Technical Design.

This command is the execution entry point for all standalone engineering work. It does not branch behavior — it invokes the Task Planner, which determines the correct path.

---

# Core Rule

This command invokes the Task Planner. The Task Planner decides whether to produce a manifest (Level 1 or 2) or escalate (Level 3). The command does not make this decision.

---

# Execution

When invoked:

1. Verify the work request exists:
   ```
   docs/project/work/W-XXX/work-request.md
   ```
   If not found, STOP and report missing work request.

2. Activate AGENT-105 — Task Planner with Work input path.

3. Pass the work-request.md as the sole input artifact.

4. AGENT-105 will:
   - Validate the work request (Work Input Validation Gate).
   - Assess complexity and produce `assessment.md`.
   - Classify the work:
     - **Level 1** → produce 1-task manifest → invoke execution pipeline.
     - **Level 2** → produce N-task manifest → invoke execution pipeline.
     - **Level 3** → produce assessment only → STOP (escalation required).

5. For Level 1 and Level 2 work, proceed with execution:
   - Execution Package Agent generates per-task execution packages.
   - Execution Coordinator dispatches tasks to developer agents.
   - Code Reviewer validates completed work.
   - Execution state is recorded at `docs/engineering/execution-state/W-XXX.json`.

6. Return the AGENT-105 console summary to the user.

---

# Forbidden Actions

This command MUST NOT:
- skip the Task Planner and dispatch directly to developer agents
- make complexity classification decisions
- create task manifests itself
- assume work is simple enough to skip assessment
- modify the work-request.md artifact
- modify execution packages manually

---

# User Examples

```
/work:execute W-001
/work:execute W-005
```

---

# Completion

The command is complete when AGENT-105 has produced a valid output (assessment + manifest, or assessment + escalation) and, for Level 1/2, the execution pipeline has started.

---

# Output (Level 1 or 2 received from AGENT-105)

```
✓ Work Execution Started

Work:
W-XXX — [Title]

Complexity:
Level 1 / 2

Tasks:
N total

Status:
Executing

Monitor:
/status W-XXX
```

# Output (Level 3 received from AGENT-105)

```
⚠ Work Requires Technical Design

Work:
W-XXX — [Title]

Complexity:
Level 3

Reason:
[From assessment]

Next:
/work:escalate W-XXX
```

---

# Golden Rule

The Task Planner is the convergence point. All work — feature-originated or work-originated — passes through AGENT-105 before execution.
