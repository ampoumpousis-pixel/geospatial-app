# Command: Lifecycle Trace

Version: 1.0

Command ID: CMD-217

---

# Purpose

Display the full provenance chain for a feature or work item across all pipeline stages.
Shows how artifacts evolved from product input through planning, validation, approval,
and task decomposition.

---

# Core Rule

Trace is a read-only diagnostic. It does not modify any artifact. It reads version
headers, metadata files, and the directory structure to reconstruct the chain.

---

# Execution

When invoked:

1. Read the feature or work directory structure under:
   ```
   docs/project/features/F-XXX/
   docs/engineering/technical-plans/F-XXX/
   docs/engineering/frontend-integration/F-XXX/
   docs/engineering/reviews/F-XXX/
   docs/engineering/approvals/F-XXX/
   docs/engineering/task-plans/F-XXX/
   docs/engineering/execution-packages/F-XXX/
   docs/engineering/archive/F-XXX/
   ```
   The frontend-integration stage sits between the Technical Design and the Engineering Review in the chain (present only when `Has User-Facing Surface: Yes`; the equivalent work-path location is `docs/engineering/frontend-integration/W-XXX/`).
2. For each artifact, read the version from its metadata or header.
3. If the artifact has been archived, locate it in the archive directory and cross-reference
   the `.archived` metadata.
4. Display the chain as a tree:

   ```
   F-002 — User and Group Management

   Product Input
   ├── feature-catalog.md §37-49

   Planning
   ├── feature-spec.md v1.0
   │   ├── EAF-F002-001 through EAF-F002-007
   │   └── HD-F002-001 through HD-F002-003
   ├── technical-design.md v1.0 (ARCHIVED)
   │   └── superseded by v1.1
   ├── technical-design.md v1.1 (CURRENT)
   │   ├── TD-F002-001 through TD-F002-007
   │   └── resolves RC-F002-001, RC-F002-002
   ├── frontend-integration.md v1.0 (CURRENT) (when Has User-Facing Surface: Yes)
   │   └── resolves FD-F002-001 through FD-F002-003

   Validation
   ├── engineering-review.md v1.0 (ARCHIVED)
   │   └── superseded by v2.0
   ├── engineering-review.md v2.0 (CURRENT)
   │   ├── SC-F002-001, SC-F002-002 (RESOLVED)
   │   └── Recommendation: READY FOR APPROVAL

   Approval
   └── engineering-approval.md v1.0

   Task Decomposition
   ├── task-manifest.json v1.0
   │   └── 15 tasks (8 backend, 7 frontend)
   └── implementation-plan.md v1.0
   ```

5. Report the chain to the user.

---

# Preconditions

- The feature or work directory must exist.
- At least one artifact must exist in the pipeline directories.

---

# Forbidden Actions

This command MUST NOT:
- modify any artifact
- infer versions that cannot be read from artifact headers or metadata
- display archived artifacts as current

---

# User Examples

```
/lifecycle trace F-002
/lifecycle trace W-001
```

---

# Output

```
✓ Provenance Chain

Feature:
F-002 — User and Group Management

Chain:
[displays tree as shown above]

Endpoints:
├── 1 product input
├── 3 planning artifacts (1 archived, 2 current)
├── 2 validation artifacts (1 archived, 1 current)
├── 1 approval artifact
├── 2 task artifacts
│   └── 15 tasks total

Note:
Archived artifacts preserved at
docs/engineering/archive/F-002/
```

---

# Golden Rule

Trace exists so that the full evolution of a feature can be understood without reading
every file. It answers the question: "what happened, in what order, and which versions
are still relevant?"
