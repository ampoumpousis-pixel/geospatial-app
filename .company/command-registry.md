# Command Registry

Version: 1.0

Purpose: Define every human-operable command in the engineering system. This is the contract between the human operator and the agent pipeline.

---

## Principles

Commands are entry points only. They:

- parse input
- locate or create artifacts
- invoke agents
- pass parameters
- trigger approved flows

Commands never:

- contain engineering logic
- make architectural decisions
- modify artifacts directly
- branch behavior based on origin type
- hide workflow logic that belongs to agents

Workflow behavior belongs to agents and execution artifacts. The command layer is thin, declarative, and boring.

---

## Command Categories

### User-Facing Commands

The normal developer experience. These are the primary interface.

| Command | Invokes | Creates | Next |
|---------|---------|---------|------|
| `/feature:create` | AGENT-102 Feature Planner | `feature-spec.md` | `/feature:design-flow` |
| `/feature:design-flow` | AGENT-103 → 104 → Gate → 105 | `technical-design.md`, `implementation-plan.md`, `task-manifest.json` | `/feature:exec-flow` |
| `/feature:exec-flow` | Validate → Package → Run | `execution-packages`, `execution-state` | `/status` |
| `/work:create` | None (artifact creation) | `work-request.md` | `/work:execute` |
| `/work:execute` | AGENT-105 Task Planner → Execution pipeline | `assessment.md`, `task-manifest.json` | `/status` |
| `/work:escalate` | AGENT-103 Technical Planner → Review → Gate | `technical-design.md` | `/work:execute` |
| `/status` | None (state read) | — | — |
| `/resume` | Execution Coordinator | — | — |

### Pipeline Control Commands

Recovery, debugging, and manual intervention. Not part of the normal happy path.

| Command | Invokes | Purpose |
|---------|---------|---------|
| `/feature:design` | AGENT-103 Technical Planner | Create technical design independently |
| `/feature:approve-design` | Engineering Approval Gate | Record human approval decision |
| `/feature:plan` | AGENT-105 Task Planner | Create task manifest independently |
| `/feature:validate` | None (stateless read) | Validate manifest, contracts, packages |
| `/feature:package` | Execution Package Agent | Generate execution packages independently |
| `/feature:run` | Execution Coordinator | Start execution independently |
| `/feature:review` | Code Reviewer | Trigger review independently |

---

## Command Details

### /feature:create

**Command ID:** CMD-200

**Purpose:** Create a feature request.

**Invokes:** AGENT-102 — Feature Planner

**Input:** Natural language feature description.

**Flow:**

```
Parse description
    ↓
Assign next available F-XXX ID (reading feature catalog + existing directories)
    ↓
Create feature catalog entry if not present
    ↓
Create docs/project/features/F-XXX/ directory
    ↓
Invoke AGENT-102 with assigned feature ID and description
    ↓
AGENT-102 produces feature-spec.md
    ↓
STOP
```

**Creates:** `docs/project/features/F-XXX/feature-spec.md`

**Next:** `/feature:design-flow F-XXX`

---

### /feature:design-flow

**Command ID:** CMD-210

**Purpose:** Full planning pipeline from feature spec to task manifest.

**Flow:**

```
AGENT-103 (Technical Planner)
    ├── Reads feature-spec.md
    ├── Produces technical-design.md
    ├── Declares contract boundaries
    ↓
AGENT-104 (Engineering Design Reviewer)
    ├── Reads technical-design.md + feature-spec.md
    ├── Produces engineering-review.md
    ├── If REVISIONS REQUIRED → loops back to AGENT-103
    ↓
Engineering Approval Gate (Human checkpoint)
    ├── Human reviews design + review
    ├── Decision: APPROVED / REQUEST CHANGES / NOT REQUIRED
    ├── If REQUEST CHANGES → loops back to AGENT-103
    ↓
AGENT-105 (Task Planner)
    ├── Validates approval chain
    ├── Decomposes design into tasks
    ├── Produces implementation-plan.md + task-manifest.json
    ↓
STOP
```

**Creates:** `technical-design.md`, `engineering-review.md`, `engineering-approval.md`, `implementation-plan.md`, `task-manifest.json`

**Next:** `/feature:exec-flow F-XXX`

---

### /feature:exec-flow

**Command ID:** CMD-211

**Purpose:** Validate and execute a feature's task manifest.

**Flow:**

```
Validation (stateless read)
    ├── Manifest schema valid?
    ├── Contract dependency versions match?
    ├── Package completeness valid?
    ├── Ownership conflicts?
    ├── If BLOCKED → STOP with reason
    ↓
Execution Package Agent
    ├── Reads task-manifest.json
    ├── Generates per-task execution packages
    ↓
Execution Coordinator
    ├── Creates execution state
    ├── Dispatches tasks to developer agents
    ├── Monitors progress
    ├── Routes completed tasks through Code Reviewer
    ↓
STOP (monitor with /status)
```

**Creates:** `execution-packages/`, `execution-state/F-XXX.json`

**Next:** `/status F-XXX`

---

### /work:create

**Command ID:** CMD-212

**Purpose:** Create a standalone work request. For operational engineering changes that do not require a full feature lifecycle.

**Invokes:** None. This command creates the artifact directly.

**Input:** Natural language work description.

**Flow:**

```
Parse description
    ↓
Assign next available W-XXX ID (reading docs/project/work/)
    ↓
Create docs/project/work/W-XXX/ directory
    ↓
Write work-request.md from the description
    ↓
STOP
```

**Creates:** `docs/project/work/W-XXX/work-request.md`

**Next:** `/work:execute W-XXX`

---

### /work:execute

**Command ID:** CMD-213

**Purpose:** Execute a work request. The Task Planner assesses complexity and either produces a manifest directly or escalates to Technical Design.

**Invokes:** AGENT-105 — Task Planner (Work path), then execution pipeline.

**Flow:**

```
AGENT-105 (Task Planner — Work input)
    ├── Reads work-request.md
    ├── Produces assessment.md (Level 1, 2, or 3)
    ├── Level 1 or 2:
    │   ├── Produces task-manifest.json
    │   └── Triggers execution pipeline
    │       ├── Execution Package Agent
    │       ├── Execution Coordinator
    │       └── Developer Agents + Code Reviewer
    ├── Level 3:
    │   └── STOP — Technical Design required
    │
    ↓
STOP (monitor with /status)
```

**Creates:** `assessment.md`, `task-manifest.json`, `execution-packages/`, `execution-state/W-XXX.json`

**Next:** `/status W-XXX`, or `/work:escalate W-XXX` (Level 3)

---

### /work:escalate

**Command ID:** CMD-214

**Purpose:** Route a Level 3 work request through Technical Design. Converts a work request into a feature-style engineering pipeline.

**Invokes:** AGENT-103 → AGENT-104 → Engineering Approval Gate → AGENT-105.

**Input:** W-XXX (must already have a Level 3 assessment).

**Flow:**

```
Read work-request.md + assessment.md
    ↓
AGENT-103 (Technical Planner)
    ├── Designs technical solution
    ├── Declares contract boundaries
    ├── Produces technical-design.md at docs/engineering/technical-plans/W-XXX/
    ↓
AGENT-104 (Engineering Design Reviewer)
    ├── Reviews the design
    ├── Produces engineering-review.md
    ↓
Engineering Approval Gate
    ├── Human decision
    ├── Records engineering-approval.md
    ↓
AGENT-105 (Task Planner)
    ├── Validates approval chain
    ├── Produces task-manifest.json (with source.type: "work")
    ↓
STOP (ready for /work:execute W-XXX to continue to execution)
```

**Creates:** `technical-design.md`, `engineering-review.md`, `engineering-approval.md`, updated `task-manifest.json`

**Next:** `/work:execute W-XXX`

---

### /status

**Command ID:** CMD-207

**Purpose:** Report execution progress for a feature or work item.

**Invokes:** None. Stateless read.

**Input:** F-XXX or W-XXX.

**Flow:**

```
Read execution-state/F-XXX.json or W-XXX.json
    ↓
Parse task states
    ↓
Report:
    ├── Total tasks
    ├── Completed
    ├── In Progress
    ├── Pending
    ├── Failed
    ├── Blocked
    └── Per-task status with domain and executor
    ↓
STOP
```

**Creates:** Nothing. Terminal report only.

---

### /resume

**Command ID:** CMD-208

**Purpose:** Resume execution from the last valid state. Reads execution state and continues.

**Invokes:** Execution Coordinator (resume mode).

**Input:** F-XXX or W-XXX.

**Flow:**

```
Read execution-state/F-XXX.json or W-XXX.json
    ↓
Identify last valid state
    ↓
Execution Coordinator continues from that point
    ↓
STOP (monitor with /status)
```

**Creates:** Nothing new. Updates existing execution state.

---

### /feature:design

**Command ID:** CMD-201

**Purpose:** Create technical design independently. Pipeline control — used for recovery or manual re-execution.

**Invokes:** AGENT-103 — Technical Planner.

**Input:** F-XXX.

**Creates:** `docs/engineering/technical-plans/F-XXX/technical-design.md`

---

### /feature:approve-design

**Command ID:** CMD-202

**Purpose:** Record human approval decision. Pipeline control.

**Invokes:** Engineering Approval Gate.

**Input:** F-XXX.

**Creates:** `docs/engineering/approvals/F-XXX/engineering-approval.md`

---

### /feature:plan

**Command ID:** CMD-203

**Purpose:** Create task manifest independently. Pipeline control.

**Invokes:** AGENT-105 — Task Planner.

**Input:** F-XXX.

**Creates:** `docs/engineering/task-plans/F-XXX/implementation-plan.md`, `task-manifest.json`

---

### /feature:validate

**Command ID:** CMD-204

**Purpose:** Validate manifest completeness before execution. Pipeline control.

**Invokes:** None. Stateless read.

**Input:** F-XXX.

**Checks:**
- Manifest schema is valid
- Contract dependency versions match Technical Design
- All packages exist for declared tasks
- No overlapping allowed writes in parallel tasks
- Dependency graph is acyclic

**Output:** PASS with task count, or BLOCKED with specific failures.

---

### /feature:package

**Command ID:** CMD-205

**Purpose:** Generate execution packages independently. Pipeline control.

**Invokes:** Execution Package Agent.

**Input:** F-XXX.

**Creates:** `docs/engineering/execution-packages/F-XXX/package-T-FXXX-*.md`

---

### /feature:run

**Command ID:** CMD-206

**Purpose:** Start execution independently. Pipeline control.

**Invokes:** Execution Coordinator.

**Input:** F-XXX.

**Creates:** `docs/engineering/execution-state/F-XXX.json`

---

### /feature:review

**Command ID:** CMD-209

**Purpose:** Trigger code review manually. Pipeline control.

**Invokes:** Code Reviewer.

**Input:** F-XXX or T-FXXX-NNN.

**Creates:** `docs/engineering/reviews/`

---

## Convergence

```
/feature:create                    /work:create
      │                                  │
      ▼                                  ▼
feature-spec.md                   work-request.md
      │                                  │
      ▼                                  │
/feature:design-flow                     │
(design → review → gate → plan)          │
      │                                  │
      ▼                                  ▼
task-manifest.json              /work:execute
      │                           (task planner → manifest)
      │                                  │
      └──────────────┬───────────────────┘
                     │
                     ▼
            Execution Pipeline
            (validate → package → run → review)
                     │
                     ▼
                 /status
```

---

## Governance Rules

1. Commands select pipeline entry points. They do not implement workflow logic. Workflow behavior belongs to agents and execution artifacts.

2. Execution artifacts are origin-agnostic. Feature-originated and work-originated manifests must produce identical execution behavior. Origin metadata exists only for traceability and reporting.

3. Composite commands are the product. Individual pipeline control commands are the mechanism. The normal developer experience uses user-facing commands only.

---

## Reserved Commands

These command names are reserved for future implementation. They must not be used for unrelated purposes.

### /lifecycle

**Purpose:** Manage artifact lifecycle states for features and work items.

**Sub-commands:**
- `archive` — Move an artifact to archived state. Preserves all data, removes from active listings.
- `unarchive` — Restore an archived artifact to its previous state.
- `purge` — Destructive removal of all associated artifacts. Irreversible.

**Aliases:**
- `/feature:archive` → `/lifecycle archive`
- `/feature:unarchive` → `/lifecycle unarchive`
- `/feature:purge` → `/lifecycle purge`
- `/work:archive` → `/lifecycle archive`
- `/work:unarchive` → `/lifecycle unarchive`
- `/work:purge` → `/lifecycle purge`

**Status:** Reserved. Implemented after Phase 3 flight testing with F-002.
**Design source:** Evidence collected during real feature work will define lifecycle semantics.

**Command IDs:** CMD-216 through CMD-221 (held for `/lifecycle` sub-commands and aliases)
