# Command: Work Create

Version: 1.0

Command ID: CMD-212

---

# Purpose

Create a standalone work request for operational engineering changes that do not require a full feature lifecycle.

Use this command for:
- UI style changes ("Change button hover color")
- Small bug fixes ("Fix pagination off-by-one")
- Refactoring within a single domain
- Configuration changes
- Adding tests for existing code

Do not use this command for:
- New product capabilities (use `/feature:create`)
- Changes affecting multiple architecture layers (this will be caught by complexity assessment at `/work:execute`)
- Changes requiring security or authentication redesign

---

# Core Rule

This command creates an artifact. It does not invoke agents. It does not assess complexity. It does not execute work. Creation and assessment are separate lifecycle stages.

---

# Execution

When invoked:

1. Parse the work description from the user input.

2. Assign the next available W-XXX ID:
   - Read `docs/project/work/` directory listing.
   - Find the highest existing W number (e.g., W-003).
   - Assign W-004.
   - If no work directory exists yet, start from W-001.

3. Create the work directory:
   ```
   mkdir -p docs/project/work/W-XXX
   ```

4. Create the work request artifact at:
   ```
   docs/project/work/W-XXX/work-request.md
   ```

5. Populate the work request with the following template:

```markdown
# W-XXX — Work Request

## Metadata

| Work ID | W-XXX |
| Title | [Derived from description] |
| Requester | Human |
| Created | [Current date] |
| Status | Draft |
| Version | 1.0 |

## Intent

[User's original description, preserved verbatim]

## Expected Outcome

[Observable results after completion]
- [Derived from the intent]

## Scope

**Affected area(s):**
- [Derived: frontend / backend / infrastructure / integration]

**Known constraints:**
- [If the user mentioned any, include here]

## Acceptance Criteria

- **AC-WXXX-001:** [Derived from the intent]
- **AC-WXXX-002:** [Derived from the intent]

## Technical Hints (optional)

**Possible files:**
[If the user mentioned specific files, paths, or components]

**Known risks:**
[If applicable]

## Escalation Flags (optional)

[If the work may be more complex than it appears]
```

6. Read the file back from the filesystem and verify it was persisted correctly.

---

# Forbidden Actions

This command MUST NOT:
- invoke any agent
- assess complexity
- create task manifests
- create execution packages
- modify any file other than `docs/project/work/W-XXX/work-request.md`
- modify the feature catalog or any feature artifacts

---

# User Examples

```
/work:create Change login button color to #2563eb
/work:create Add right-click context menu to resource list items
/work:create Fix pagination off-by-one error on search results page
/work:create Add toast notification on successful resource upload
```

---

# Completion

The command is complete when:
- `docs/project/work/W-XXX/work-request.md` has been written and verified on the filesystem.
- The user is presented with the assigned W-XXX ID and the `/work:execute W-XXX` next step.

---

# Output

```
✓ Work Request Created

Work:
W-XXX — [Title]

Artifact:
docs/project/work/W-XXX/work-request.md

Next:
/work:execute W-XXX
```

---

# Golden Rule

The command creates intent. The Task Planner creates execution knowledge. These are separate lifecycle stages.
