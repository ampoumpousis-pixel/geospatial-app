# Command: Feature Exec Flow

Version: 1.0

Command ID: CMD-211

---

# Purpose

Validate and execute a feature's task manifest. Runs the full execution pipeline: Validate → Package → Run → Review.

This is the primary execution command. It sequences the execution agents in order with no human checkpoints (validation rejection is the only stop condition).

---

# Core Rule

This command orchestrates the existing execution agents in sequence. It does not contain execution logic. It invokes agents in the correct order and reports progress.

---

# Preconditions

The task manifest must exist:
```
docs/engineering/task-plans/F-XXX/task-manifest.json
```

If not found, STOP and direct user to `/feature:design-flow F-XXX`.

---

# Execution

When invoked:

### Phase A — Validation (stateless read)

1. Read the task manifest.
2. Run structural validation:
   - Manifest JSON is well-formed.
   - `manifest_version` is valid.
   - Every task has: id, domain, executor, execution_type, files, allowed_writes, completion_criteria.
   - Contract dependency versions match the Technical Design's declared contract versions.
   - Dependency graph is acyclic.
   - All dependency task IDs exist in the manifest.
   - Parallel tasks have disjoint `allowed_writes`.

3. Run completeness validation:
   - Every declared execution package template exists or can be generated.
   - No unresolved Design Gap Returns in the implementation plan.
   - No ownership conflicts (tasks don't write to directories owned by different agent types).

4. If validation fails with any BLOCKING issue:
   - Report the specific failures.
   - STOP. Do not proceed to packaging.

### Phase B — Package Generation

1. Activate the Execution Package Agent.
2. Input: `task-manifest.json` + Technical Design (for contract context).
3. Agent generates per-task execution packages:
   ```
   docs/engineering/execution-packages/F-XXX/package-T-FXXX-001.md
   docs/engineering/execution-packages/F-XXX/package-T-FXXX-002.md
   ...
   ```
4. Verify all packages were generated (count matches task count).
5. Report generated package count.

### Phase C — Execution

1. Activate the Execution Coordinator Agent.
2. Input: `task-manifest.json` + execution packages.
3. Coordinator:
   - Creates execution state at `docs/engineering/execution-state/F-XXX.json`.
   - Dispatches tasks to developer agents (backend, frontend, infrastructure).
   - Respects task dependencies and parallel groups.
   - Monitors progress through the state machine.
   - Routes completed tasks through Code Reviewer.
   - Updates execution state as tasks progress.

---

# Human Checkpoints

There are no human checkpoints in this command. Validation is automatic. The pipeline runs until all tasks complete or a failure occurs.

To monitor progress, use `/status F-XXX`.

---

# Forbidden Actions

This command MUST NOT:
- skip validation
- generate packages for a manifest with blocking validation failures
- dispatch tasks with unresolved dependencies
- skip code review for completed tasks
- modify the task manifest or execution packages
- skip the dependency graph (respect ordering and parallel constraints)

---

# User Examples

```
/feature:exec-flow F-002
/feature:exec-flow F-005
```

---

# Completion

The command is complete when the Execution Coordinator has started. The pipeline may run for a while — monitor with `/status F-XXX`.

---

# Output (Validation PASS)

```
✓ Execution Flow Started

Feature:
F-XXX — [Title]

Validation:
PASS

Packages:
N generated

Execution:
N tasks dispatched

Monitor:
/status F-XXX
```

# Output (Validation BLOCKED)

```
✗ Execution Flow Blocked

Feature:
F-XXX — [Title]

Validation failures:
• [Specific failure]
• [Specific failure]

Action:
Fix the issues before re-running /feature:exec-flow F-XXX
```

---

# Golden Rule

Execution consumes knowledge. This command validates and dispatches — it does not create knowledge, make decisions, or skip quality gates.
