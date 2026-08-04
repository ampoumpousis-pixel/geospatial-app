# Command: Lifecycle Archive

Version: 1.0

Command ID: CMD-216

---

# Purpose

Move a superseded artifact to the archive directory. Preserves all data for traceability
while removing it from active listings. This enables reconstructing version chains when
artifacts are revised during a pipeline run.

---

# Core Rule

Archive preserves evidence. It does not delete or modify the archived content beyond
adding a metadata file recording the original path, version, and archival timestamp.

---

# Execution

When invoked:

1. Identify the artifact to archive from the feature or work ID and optional path.
2. Create the archive directory structure:
   ```
   docs/engineering/archive/F-XXX/original-path/
   ```
3. Move the artifact to the archive directory.
4. Create a `.archived` metadata file at the archive destination containing:
   ```
   original_path: docs/engineering/technical-plans/F-XXX/technical-design.md
   version: 1.0
   archived_at: 2026-07-27T14:00:00Z
   reason: Superseded by version 1.1
   ```
5. Verify the archive file exists and the original path is empty.
6. Report the archival path to the user.

---

# Preconditions

- The artifact must exist at the specified path.
- A newer version of the artifact must exist or be in progress (archive should not be
  used to remove the only copy of an artifact).

---

# Forbidden Actions

This command MUST NOT:
- delete artifacts without archiving them first
- modify the archived artifact content
- archive the only current version of an artifact
- archive artifacts without creating a `.archived` metadata file

---

# User Examples

```
/lifecycle archive F-002 docs/engineering/technical-plans/F-002/technical-design.md
/lifecycle archive F-002 docs/engineering/reviews/F-002/engineering-review.md
/feature:archive F-002
```

---

# Output

```
✓ Artifact Archived

Feature:
F-002

Artifact:
technical-design.md v1.0

Archive destination:
docs/engineering/archive/F-002/engineering/technical-plans/F-002/technical-design.md

Next:
/lifecycle status F-002
```

---

# Golden Rule

Archive exists so that the version chain between successive revisions can always be
reconstructed. Without archive, superseded artifacts become invisible and the evidence
trail is lost.
