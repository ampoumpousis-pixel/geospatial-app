# Command: Reset Project

Version:

1.0

Command ID:

CMD-003


# Purpose

Reverse the `/init` command by removing all files created during project initialization while preserving the directory structure and all non-init files.

This command does the opposite of CMD-001 (Initialize Project).


# What It Removes

Files created by `/init` phases:

### Phase 1 — Requirements Discovery

```

docs/project/requirements/personas.md

docs/project/requirements/user-stories.md

docs/project/requirements/acceptance-criteria.md

docs/project/requirements/success-criteria.md

```

### Phase 2 — System Analysis

```

docs/analysis/functional-requirements.md

docs/analysis/non-functional-requirements.md

docs/analysis/use-cases.md

docs/analysis/workflows.md

```

### Phase 3 — Architecture Design

```

docs/architecture/system-overview.md

docs/architecture/domain-model.md

docs/architecture/component-design.md

```

### Phase 4 — Project Planning

```

docs/project/planning/roadmap.md

docs/project/planning/feature-catalog.md

docs/project/planning/milestones.md

docs/project/planning/task-board.md

docs/project/planning/trace-bullets.md

```

### Architecture Decisions

```

docs/adr/ADR-001-*.md

docs/adr/ADR-002-*.md

docs/adr/ADR-003-*.md

docs/adr/ADR-004-*.md

docs/adr/ADR-005-*.md

docs/adr/ADR-006-*.md

```

### AI Memory (deleted then recreated as empty)

```

.ai-memory/current-state.md

.ai-memory/handoff.md

```


# What It Preserves

The following are NOT removed:

- directory structure (all folders stay)
- `.opencode/` — all agents, commands, configuration
- `.company/` — company definitions
- `.ai-rules/` — AI rules
- `docs/project/PROJECT_FACTS.md`, `PROJECT_SCOPE.md`, `PROJECT_STATUS.md`
- `.ai-memory/README.md`, `decisions.md`, `errors.md`, `lessons-learned.md`
- `docs/ai/` — agent/command templates
- `docs/project/PROJECT_GLOSSARY.md`
- `docs/architecture/README.md` — directory placeholder
- `docs/adr/README.md` — directory placeholder
- `docs/architecture/diagrams/` content
- `docs/analysis/diagrams/` content
- `ENGINEERING_GUIDE.md`
- `README.md`
- All project files outside the init scope


# When To Use

Use this command when:

- you want to undo `/init` and start fresh
- the initialization produced incorrect artifacts
- you need a clean slate before re-running `/init`

Do not use this command for:

- deleting individual features (use `/delete-feature`)
- editing project documents
- removing the OpenCode company structure


# Core Rule

This command is destructive but reversible only by re-running `/init`.

It must:

- require explicit human confirmation
- preview every file that will be deleted
- never remove directories — only files
- preserve project direction files (`PROJECT_FACTS.md`, `PROJECT_SCOPE.md`, `PROJECT_STATUS.md`)
- recreate AI memory files as empty after deletion


# Command Owner

Agent:

```

project-director

```

The Project Director (AGENT-001) owns this command and its execution.


# Required Permissions

The executing agent needs:

- Read access to `docs/`, `.ai-memory/`
- Write access to delete files in `docs/` and `.ai-memory/`
- Bash access for file removal (`rm`)


# Execution

The command follows:


```

Discover Init-Created Files

↓

Build Deletion List

↓

Display Preview

↓

Human Confirmation

↓

Delete Files

↓

Recreate AI Memory Files

↓

Verify

↓

Report Summary

```


---

## Step 1 — Discover Init-Created Files

Check which init-created files currently exist on disk.

Search for each file in the target list:

1. `docs/project/requirements/personas.md`
2. `docs/project/requirements/user-stories.md`
3. `docs/project/requirements/acceptance-criteria.md`
4. `docs/project/requirements/success-criteria.md`
5. `docs/analysis/functional-requirements.md`
6. `docs/analysis/non-functional-requirements.md`
7. `docs/analysis/use-cases.md`
8. `docs/analysis/workflows.md`
9. `docs/architecture/system-overview.md`
10. `docs/architecture/domain-model.md`
11. `docs/architecture/component-design.md`
12. `docs/project/planning/roadmap.md`
13. `docs/project/planning/feature-catalog.md`
14. `docs/project/planning/milestones.md`
15. `docs/project/planning/task-board.md`
16. `docs/project/planning/trace-bullets.md`
17. `docs/adr/ADR-001-*.md` (glob match)
18. `docs/adr/ADR-002-*.md` (glob match)
19. `docs/adr/ADR-003-*.md` (glob match)
20. `docs/adr/ADR-004-*.md` (glob match)
21. `docs/adr/ADR-005-*.md` (glob match)
22. `docs/adr/ADR-006-*.md` (glob match)
23. `.ai-memory/current-state.md`
24. `.ai-memory/handoff.md`


---

## Step 2 — Build Deletion List

Collect all files that exist into a deletion list.

If the deletion list is empty, abort with:

```

No init-created files found. Nothing to reset.

```


---

## Step 3 — Display Preview

Show the user every file that will be deleted, grouped by phase:

```

The following files will be removed:

Requirements:
  - docs/project/requirements/personas.md
  - ...

Architecture Decisions:
  - docs/adr/ADR-001-resource-centric-domain.md
  - ...

AI Memory (will be recreated as empty):
  - .ai-memory/current-state.md
  - .ai-memory/handoff.md

Total: N files

```

No directories will be removed.


---

## Step 4 — Human Confirmation

Ask:

```

This will delete all files created by /init. Directory structure will be preserved.

Are you sure? (y/N)

```

If the user answers `n` or `N`, abort with no changes.

If the user answers `y` or `Y`, proceed to deletion.


---

## Step 5 — Delete Files

Delete each file in the deletion list:

```

rm -f <file-path>

```

Use `rm -f` to avoid errors if a file disappears between discovery and deletion.

Do not remove any directories.

AI memory files (`.ai-memory/current-state.md`, `.ai-memory/handoff.md`) are included in the deletion and will be recreated in the next step.


---

## Step 6 — Recreate AI Memory Files

Create empty AI memory files so the memory directory structure remains intact:

```

touch .ai-memory/current-state.md

touch .ai-memory/handoff.md

```


---

## Step 7 — Verify

After deletion and recreation, verify:

- each file in the deletion list no longer exists
- all parent directories still exist
- no unintended files were removed


---

## Step 8 — Report Summary

Report to the user:

```

Reset complete.

Deleted: <N> files
Recreated as empty: .ai-memory/current-state.md, handoff.md
Preserved: all directories, project direction files, and non-init files

Ready to re-run /init if needed.

```


---

# Edge Case Handling

| Condition | Behavior |
|---|---|
| No init-created files exist | Abort with "Nothing to reset" |
| A file is missing at delete time | Skip silently (already deleted) |
| User declines confirmation | Abort cleanly, no changes |
| A target file was edited after /init | Still deleted (reset is a clean slate) |


# Quality Gate

The command is complete only when:

✓ All init-created files removed (excluding project direction files)

✓ AI memory files recreated as empty

✓ All directories preserved

✓ No non-init files touched

✓ User informed of result


# Golden Rule

Reset removes initialization artifacts.

It preserves project direction files, directories, company definitions, AI rules, agent configurations, and source code.

AI memory files are wiped clean (deleted and recreated as empty).

Run `/init` again after reset to recreate the project blueprint.
