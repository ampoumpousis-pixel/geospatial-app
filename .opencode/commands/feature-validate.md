# Command: Feature Validate

Version: 1.0

Command ID: CMD-204

---

# Purpose

Validate a feature's manifest, contracts, and packages before execution. Stateless read-only command.

---

# Core Rule

This command reads artifacts and reports problems. It does not modify anything. It is a pre-flight check, not an execution gate.

---

# Execution

1. Verify the task manifest exists: `docs/engineering/task-plans/F-XXX/task-manifest.json`.

2. Run structural validation on the manifest:
   - JSON is well-formed and parseable.
   - `manifest_version` is valid.
   - Every task has: id, domain, executor, execution_type, files, allowed_writes, completion_criteria.
   - All task IDs follow the naming convention.

3. Run contract validation:
   - Read `docs/engineering/technical-plans/F-XXX/technical-design.md`.
   - Compare declared contract versions in the manifest against the Technical Design's Contract Boundary Declaration.
   - Flag any version mismatches.

4. Run dependency validation:
   - Build the dependency graph from the manifest.
   - Verify the graph is acyclic (no circular dependencies).
   - Verify every dependency task ID exists in the manifest.
   - Verify no parallel tasks have overlapping `allowed_writes`.

5. Run completeness check:
   - Count tasks in the manifest.
   - Check if execution packages exist for each task (or can be generated).
   - Flag any tasks with empty files or allowed_writes.

6. Report the result.

---

# Output (PASS)

```
✓ Validation Passed

Feature: F-XXX
Tasks: N
Dependencies: acyclic, valid
Contracts: all versions match
Writes: no parallel conflicts
Packages: N generated / can be generated
```

# Output (BLOCKED)

```
✗ Validation Blocked

Feature: F-XXX

Failures:
• Contract version mismatch: API-FXXX-AUTH is at 1.2, manifest expects 1.0
• Circular dependency: T-FXXX-003 ↔ T-FXXX-004
• Parallel write conflict: T-FXXX-001 and T-FXXX-002 both write to config/settings/base.py

Actions required before execution.
```

---

# User Examples

```
/feature:validate F-002
```

---

# Golden Rule

Validation is the pre-flight check. It finds problems — it does not fix them. Execution should never begin on an invalid manifest.
