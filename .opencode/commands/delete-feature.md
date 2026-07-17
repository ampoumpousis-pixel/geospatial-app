# Command: Delete Feature

Version:

1.0

Command ID:

CMD-002


# Purpose

Delete a feature and all associated artifacts from the project.

This command removes:

- feature specification directory (`docs/project/features/F-XXX/`)
- technical plan directory (`docs/engineering/technical-plans/F-XXX/`)
- feature entry from the feature catalog (`docs/project/planning/feature-catalog.md`)


# When To Use

Use this command when:

- a feature is cancelled or deprioritized indefinitely
- a feature is consolidated into another feature
- a feature was created in error

Do not use this command for:

- editing or updating an existing feature
- changing feature priority
- adding new features


# Core Rule

This command is destructive. Feature deletion cannot be undone.

The command must:

- require explicit human confirmation before deletion
- check for dependent features and warn the user
- validate the feature ID format before proceeding
- preserve all other project documents


# Command Owner

Agent:

```

project-director

```

The Project Director (AGENT-001) owns this command and its execution.


# Required Permissions

The executing agent needs:

- Read access to `docs/project/features/`
- Read access to `docs/engineering/technical-plans/`
- Read/Write access to `docs/project/planning/feature-catalog.md`
- Read/Write access to `docs/project/PROJECT_STATUS.md`
- Bash access for directory deletion (`rm -rf`)


# Execution

The command follows:


```

Receive Feature ID

↓

Validate Format

↓

Discover Existing Artifacts

↓

Dependency Scan

↓

Human Confirmation

↓

Delete Directories

↓

Update Feature Catalog

↓

Update Project Status

↓

Verify

↓

Report Summary

```


---

## Step 1 — Receive Feature ID

Accept the feature ID from the user.

Expected format:

```

F-XXX

```

Where `F` is uppercase, followed by a hyphen and exactly three digits.

Examples:

- `F-001`
- `F-022`

Accept the ID with or without the `F-` prefix (normalize to uppercase `F-XXX`).


---

## Step 2 — Validate Format

Check that the input matches the pattern `F-\d{3}` (uppercase F, hyphen, three digits).

If the format is invalid:

Reject with:

```

Invalid feature ID format. Expected F-XXX (e.g., F-022).

```

Do not proceed.


---

## Step 3 — Discover Existing Artifacts

Check which artifacts exist for the given feature ID:

1. Feature spec directory: `docs/project/features/F-XXX/`
2. Technical plan directory: `docs/engineering/technical-plans/F-XXX/`
3. Feature catalog entry: `docs/project/planning/feature-catalog.md` — search for `## F-XXX` heading

If nothing exists in any location:

Abort with:

```

Feature F-XXX not found in any location. Nothing to delete.

```

Otherwise, record what exists and what is missing for the summary.


---

## Step 4 — Dependency Scan

Read `docs/project/planning/feature-catalog.md` and parse all `Dependencies:` lines.

If any feature entries list `F-XXX` as a dependency:

- collect all dependent feature IDs
- display them to the user

Example warning:

```

Warning: The following features list F-XXX as a dependency:

  - F-00Y — Feature Name
  - F-00Z — Another Feature

These features will have broken dependency references after deletion.

```

Ask:

```

Proceed with deletion anyway? (y/N)

```

If the user answers `n` or `N`, abort the command.

If no features depend on F-XXX, continue silently.


---

## Step 5 — Human Confirmation

Display a summary of what will be affected:

```

Will delete:
  ✓ docs/project/features/F-XXX/               (exists)
  ✗ docs/engineering/technical-plans/F-XXX/    (not found, skipped)
  ✓ feature-catalog entry for F-XXX            (exists)

```

Ask:

```

Are you sure? This cannot be undone. (y/N)

```

If the user answers `n` or `N`, abort the command.

If the user answers `y` or `Y`, proceed to execution.


---

## Step 6 — Delete Directories

Delete each directory that exists:

6.1. Feature spec directory:

```

rm -rf docs/project/features/F-XXX/

```

6.2. Technical plan directory:

```

rm -rf docs/engineering/technical-plans/F-XXX/

```

Skip any directory that does not exist. Do not error.


---

## Step 7 — Update Feature Catalog

Read `docs/project/planning/feature-catalog.md`.

### 7.1 — Remove Feature Entry

Locate the feature entry starting with `## F-XXX`. Remove the entire entry block including:

- the `## F-XXX — Name` heading
- all lines until the next `## ` heading or end of file
- the preceding `---` separator (if present)

### 7.2 — Update Priority Summary Table

Locate the `# Priority Summary` section at the end of the file.

Find the table row matching the feature's priority level (P0, P1, P2, or P3).

Decrement the count in the `Count` column by 1.

If the count drops to 0, remove the entire row from the table.

Example:

Before:

```

| P2 | 6 | F-014, F-015, F-016, F-017, F-021, F-022 |

```

After deleting F-022:

```

| P2 | 5 | F-014, F-015, F-016, F-017, F-021 |

```

### 7.3 — Save

Write the updated catalog back to `docs/project/planning/feature-catalog.md`.


---

## Step 8 — Update Project Status

Read `docs/project/PROJECT_STATUS.md`.

If the document references `F-XXX` anywhere in its content:

- locate the reference
- update or remove it as appropriate (e.g., remove from active work items table if present)
- do not add new content unrelated to the deletion

If no references to F-XXX exist, skip this step.


---

## Step 9 — Verify

After all operations complete, verify:

- `docs/project/features/F-XXX/` no longer exists
- `docs/engineering/technical-plans/F-XXX/` no longer exists
- `docs/project/planning/feature-catalog.md` no longer contains `## F-XXX`
- Priority Summary counts are consistent with remaining features


---

## Step 10 — Report Summary

Report to the user:

```

Delete feature F-XXX complete.

Deleted:
  - docs/project/features/F-XXX/
  - feature-catalog entry for F-XXX

Not found (skipped):
  - docs/engineering/technical-plans/F-XXX/

Updated:
  - feature-catalog priority summary

```

---

# Edge Case Handling

| Condition | Behavior |
|---|---|
| Feature folder exists but no catalog entry | Delete folders, warn about missing catalog entry |
| Catalog entry exists but no folders | Remove catalog entry, warn about missing folders |
| Feature is dependency of other features | Warn and list dependents, ask to proceed |
| Priority count drops to 0 after deletion | Remove that priority row from summary table |
| Feature ID does not match F-XXX format | Reject with format error |
| No artifacts found anywhere | Abort with "nothing to delete" message |
| User declines confirmation | Abort cleanly with no changes |


# Quality Gate

The command is complete only when:

✓ Feature directories deleted (or confirmed absent)

✓ Feature catalog entry removed

✓ Priority summary counts updated

✓ Project status checked and updated if needed

✓ Dependent features warned about (if any existed)


# Golden Rule

This command removes project artifacts permanently.

Always require human confirmation.

Always check for dependent features before proceeding.

Never modify documents outside the defined scope.
