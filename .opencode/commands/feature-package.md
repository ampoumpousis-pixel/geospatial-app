# Command: Feature Package

Version: 1.0

Command ID: CMD-205

---

# Purpose

Generate execution packages independently. Standalone pipeline control command.

---

# Core Rule

This command invokes exactly one agent: the Execution Package Agent. It generates per-task execution packages from the task manifest.

---

# Execution

1. Verify the task manifest exists: `docs/engineering/task-plans/F-XXX/task-manifest.json`.

2. Activate the Execution Package Agent.

3. Agent reads the manifest and generates packages at:
   ```
   docs/engineering/execution-packages/F-XXX/package-T-FXXX-NNN.md
   ```

4. Verify count: the number of generated packages must equal the number of tasks in the manifest.

5. Report the result.

---

# User Examples

```
/feature:package F-002
```

---

# Output

```
✓ Packages Generated

Feature: F-XXX
Packages: N / N

Ready for execution:
/feature:run F-XXX
```

---

# Golden Rule

Packages are the bridge between planning and execution. Each task gets exactly one package. Use `/feature:exec-flow` for the full pipeline.
