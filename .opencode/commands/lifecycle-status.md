# Command: Lifecycle Status

Version: 1.0

Command ID: CMD-218

---

# Purpose

Display which artifacts for a feature or work item are current vs superseded vs archived.
Provides a quick overview of artifact state without reading version headers from each file.

---

# Core Rule

Status is a read-only diagnostic. It reads artifact headers, metadata files, and
directory structure to determine state. It does not modify any artifact.

---

# Execution

When invoked:

1. Scan the feature or work artifact directories:
   ```
   docs/project/features/F-XXX/
   docs/engineering/technical-plans/F-XXX/
   docs/engineering/frontend-integration/F-XXX/
   docs/engineering/reviews/F-XXX/
   docs/engineering/approvals/F-XXX/
   docs/engineering/task-plans/F-XXX/
   docs/engineering/execution-packages/F-XXX/
   ```
   The frontend-integration directory exists only when `Has User-Facing Surface: Yes`; when absent for a surface=Yes feature, report it as a MISSING required artifact. For work items, the equivalent path is `docs/engineering/frontend-integration/W-XXX/`.
2. For each artifact found, read the version from its header or metadata.
3. Check the archive directory `docs/engineering/archive/F-XXX/` for archived versions.
4. Classify each artifact:
   - **CURRENT** — the latest version present in the active directory
   - **SUPERSEDED** — an older version that has been replaced by a newer version
     (should be archived)
   - **ARCHIVED** — moved to the archive directory with `.archived` metadata
   - **ORPHANED** — current version exists but predecessor was archived without
     a clear supersession record
5. Display a table:

   ```
   F-002 — User and Group Management

   Artifact                  Version   State     Location
   ─────────────────────────────────────────────────────────────────
   feature-spec.md           v1.0      CURRENT   docs/project/features/F-002/
   technical-design.md       v1.1      CURRENT   docs/engineering/technical-plans/F-002/
   technical-design.md       v1.0      ARCHIVED  docs/engineering/archive/F-002/.../
   frontend-integration.md   v1.1      CURRENT   docs/engineering/frontend-integration/F-002/
   engineering-review.md     v2.0      CURRENT   docs/engineering/reviews/F-002/
   engineering-review.md     v1.0      ARCHIVED  docs/engineering/archive/F-002/.../
   engineering-approval.md   v1.0      CURRENT   docs/engineering/approvals/F-002/
   task-manifest.json        v1.0      CURRENT   docs/engineering/task-plans/F-002/
   implementation-plan.md    v1.0      CURRENT   docs/engineering/task-plans/F-002/
   ```

---

# Preconditions

- The feature or work directory must exist. If no artifacts exist, report that the
  feature has no work products yet.

---

# Forbidden Actions

This command MUST NOT:
- modify any artifact
- infer state from file modification timestamps alone (use version headers)
- classify an artifact as CURRENT if a newer version exists in archive

---

# User Examples

```
/lifecycle status F-002
/lifecycle status W-001
```

---

# Output

```
✓ Artifact Status

Feature:
F-002 — User and Group Management

Summary:
├── 1 CURRENT (feature-spec.md v1.0)
├── 2 CURRENT (technical-design.md v1.1, engineering-review.md v2.0)
├── 1 CURRENT (engineering-approval.md v1.0)
├── 2 CURRENT (task-manifest.json v1.0, implementation-plan.md v1.0)
├── 2 ARCHIVED (technical-design.md v1.0, engineering-review.md v1.0)
└── 0 ORPHANED

Note:
All superseded artifacts have been archived.
No action required.
```

---

# Golden Rule

Status exists so that the orchestrator and reviewers can quickly determine which
artifacts are authoritative without reading every file. It answers the question:
"what is the current state of this feature's work products?"
