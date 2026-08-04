# Command: Lifecycle Diff

Version: 1.0

Command ID: CMD-219

---

# Purpose

Compare two versions of the same artifact, showing which sections changed between them.
Enables rapid understanding of what was revised during a pipeline iteration without
manually comparing files.

---

# Core Rule

Diff is a read-only comparison. It does not modify any artifact. It reads two versions
of the same artifact and reports structural differences.

---

# Execution

When invoked:

1. Identify the two versions to compare. The user may specify:
   - Two explicit paths (e.g., `archive path` and `current path`)
   - An artifact type with two version numbers (e.g., `technical-design v1.0 v1.1`)
   - A feature ID and artifact type with version range (e.g., `F-002 td v1.0 v1.1`)

2. Read both artifacts. If one is archived, locate it via the archive directory.

3. Compare by sections (Markdown headings). For each section that appears in both
   versions, report:
   - **UNCHANGED** — identical content
   - **MODIFIED** — content differs between versions
   - **ADDED** — section exists only in the newer version
   - **REMOVED** — section existed only in the older version

4. For MODIFIED sections, show a summary of the changes (not the full diff):

   ```
   F-002 — technical-design.md v1.0 → v1.1

   Section 13 (User Deactivation Flow):
     MODIFIED — sequence diagram changed:
     - v1.0: INSERT AuditEvent before COMMIT
     - v1.1: COMMIT before INSERT AuditEvent
     Change: Audit moved outside transaction (best-effort pattern)

   Section 10 (API-F002-009 Role CRUD):
     MODIFIED — added "Update protection" paragraph:
     - v1.0: no constraint documented
     - v1.1: cannot change name of is_system=True roles (400 error)
     Change: Contract gap closed (propagates TD-F002-007)

   All other sections:
     UNCHANGED
   ```

5. Report the comparison to the user.

---

# Preconditions

- Both artifact versions must exist at their specified paths.
- The artifacts must be of the same type (both technical designs, both reviews, etc.).

---

# Forbidden Actions

This command MUST NOT:
- modify any artifact
- perform line-by-line text diffing (compare by semantic sections)
- compare artifacts of different types (e.g., a spec against a design)

---

# User Examples

```
/lifecycle diff F-002 technical-design v1.0 v1.1
/lifecycle diff F-002 engineering-review v1.0 v2.0
/lifecycle diff docs/engineering/archive/F-002/.../td-v1.0.md docs/engineering/technical-plans/F-002/technical-design.md
```

---

# Output

```
✓ Artifact Diff

Feature:
F-002 — technical-design.md

Comparison:
v1.0 → v1.1

Changes:
├── MODIFIED (Section 13 — Audit transaction boundary corrected)
├── MODIFIED (Section 10 — API-F002-009 update protection added)
└── 12 sections UNCHANGED

Summary:
2 sections changed. Both changes resolve blocking findings
from Engineering Review v1.0 (RC-F002-001, RC-F002-002).
```

---

# Golden Rule

Diff exists so that the orchestrator and reviewers can understand what changed during a
revision without manually comparing entire documents. It answers the question: "what
was the actual correction made in this revision?"
