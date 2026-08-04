# Command: Feature Create

Version: 1.0

Command ID: CMD-200

---

# Purpose

Create a new feature request. Assigns a feature ID, creates the feature directory, and invokes the Feature Planner to produce a feature specification.

---

# Core Rule

This command assigns the ID, creates the directory and catalog entry, then invokes the agent. It does not perform product discovery — that is AGENT-102's job.

---

# Execution

When invoked:

1. Parse the feature description from user input.

2. Check if the user specified an existing feature ID (e.g., F-003):
   - If yes and the catalog entry exists → use that ID.
   - If yes and no catalog entry → STOP with "Feature ID not found in catalog."
   - If no ID specified → assign the next available F-XXX ID.

3. Determine next available ID:
   - Read `docs/project/planning/feature-catalog.md` for existing entries.
   - Read `docs/project/features/` directory listing.
   - Pick the lowest number after the highest existing (e.g., F-003 if F-001 and F-002 exist).
   - Skip F-TEST-001 in counting.

4. Update the feature catalog if this is a new feature:
   - Append a minimal entry to `docs/project/planning/feature-catalog.md`:
     ```
     ## F-XXX — [Title]
     Description: [User's description]
     Priority: TBD
     Status: In Discovery
     Dependencies: None
     ```

5. Create the feature directory:
   ```
   mkdir -p docs/project/features/F-XXX
   ```

6. Activate AGENT-102 — Feature Planner.
   - Pass the assigned feature ID and the user's original description.
   - Pass the operator-defined scope boundary if one is provided by the user.
     If no explicit scope is provided, the catalogue entry is authoritative.
   - Include the Scope Authority Rule (FI-G-001):
     > The operator-defined scope takes precedence over the catalogue entry.
     > You SHALL NOT expand beyond the operator-defined scope unless
     > explicitly authorized. If you identify a gap between the catalogue
     > and the operator scope, document it as an EAF but do not spec beyond
     > the operator scope.
   - AGENT-102 performs product discovery and produces:
     ```
     docs/project/features/F-XXX/feature-spec.md
     ```
   - The feature spec SHALL include a "Scope Comparison" section listing:
     operator scope, spec scope, and any differences.

7. Return the AGENT-102 console summary.

---

# Forbidden Actions

This command MUST NOT:
- perform product discovery (that's AGENT-102)
- modify the feature-spec.md directly
- assign priorities, milestones, or roadmaps
- invoke downstream agents (AGENT-103, etc.)

---

# User Examples

```
/feature:create Add password reset functionality
/feature:create F-004 Resource Metadata Management
/feature:create Implement real-time notifications for resource updates
```

---

# Output

As returned by AGENT-102 — typically:

```
✓ Feature Specification Created

Feature:
F-XXX — [Title]

Artifact:
docs/project/features/F-XXX/feature-spec.md

Next:
/feature:design-flow F-XXX
```

---

# Golden Rule

Feature creation assigns identity. Feature planning answers questions. Execution builds solutions. These are separate lifecycle stages.
