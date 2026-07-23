# Context Management

Version: 1.0

Purpose: Define how execution agents acquire, expand, and limit context. This document answers two questions: what context is provided to an agent before it starts, and how the agent expands context if the initial package is insufficient.

Context is the single most important factor in implementation quality. Agents fail more often from receiving the wrong context than from receiving the wrong instructions.

This document is part of the execution framework. It implements the context policy defined in `execution-framework.md`. For the full pipeline, see `execution-artifact-map.md`.

---

## Part 1 — The Execution Context Package

Every task begins with a pre-assembled context package. The agent does not discover its universe — it receives it.

### Package Contents

| Field | Required | Description |
|---|---|---|
| Task ID and description | Yes | What to implement. From the Implementation Plan. |
| Technical Design references | Yes | Specific sections the task depends on (API design, data model, component boundaries). Not the entire document — relevant sections only. |
| Engineering standards | Yes | Which `.ai-rules/` files apply (backend standards, security rules, geospatial rules, verification rules). |
| Allowed writes | Yes | Directories the agent may modify. Wildcard format: `platform/backend/auth/**`. |
| Recommended reads | No | Files likely relevant — adjacent code, related tests, utility modules. Pre-selected by the planner. |
| Avoid | No | Files or directories the agent must not read. Prevents context creep into unrelated domains. |
| Completion criteria | Yes | How to know when the task is done. Acceptance criteria from the Technical Design. |
| Dependencies | No | Upstream tasks that must be complete before this one starts. |
| Contracts | No | API contract, shared types, or event schemas relevant to this task. |

### Why Pre-Assembled

Every agent discovering context independently leads to:
- Inconsistent reading (two agents read different things for the same task).
- Budget exhaustion (reading the entire repository to find relevant files).
- Cross-boundary creep (a backend agent reading frontend code without permission).

The package gives the agent exactly what it needs to start. Most tasks should require zero additional context acquisition.

---

## Part 2 — Context Expansion Algorithm

If the initial package is insufficient — missing a file, an interface definition, or a pattern to follow — the agent expands context in this order. Each layer is exhausted before moving to the next.

### Layer 1 — Read Referenced Design Sections (always)

Before writing any code, read every Technical Design section referenced in the package. This is the source of truth. Do not skip this step.

### Layer 2 — Read Referenced Standards (always)

Read every standards file listed in the package. These define the rules the implementation must follow.

### Layer 3 — Read Recommended Files (if listed)

If the package includes recommended reads, read them. These were selected by the planner as likely relevant.

### Layer 4 — Read Adjacent Files (locality-first)

If more context is needed, read files adjacent to the implementation. Adjacent means:
- In the same Django app or module.
- In the same React component tree or feature directory.
- In the same test directory.
- Files that the target file directly imports.

Read at most 5 adjacent files before escalating.

### Layer 5 — Repository Search (only if unresolved)

If adjacent reading does not resolve the ambiguity:

1. Search for a specific pattern, import, or class name — not a general topic.
2. Read only the matching file, not the entire directory.
3. If one search is sufficient, stop. Do not chain searches.
4. Read at most 3 files from search results.

### Layer 6 — Escalate

If Layers 1-5 do not provide enough context to complete the task:
- Stop.
- Report what is missing and what was attempted.
- Escalate to the Project Director.

Do not keep reading. More context past this point indicates a planning gap, not a reading problem.

---

## Context Budget

Every agent has a context budget — a hard limit on how much it reads before implementation.

| Phase | Budget |
|---|---|
| Read design sections | Unlimited (these are mandatory) |
| Read standards | Unlimited (these are mandatory) |
| Read recommended files | Up to 5 files |
| Read adjacent files | Up to 5 files |
| Repository search | Up to 3 files |
| Total files read (excluding design + standards) | 15 files maximum |

If the agent reaches 15 files and is still unsure, it escalates. This prevents an agent from reading the entire codebase under the guise of "understanding the project."

---

## Locality-First Rules

When expanding context, prefer files that are close to the task's target area:

| Task Target | Preferred Locality |
|---|---|
| `platform/backend/auth/views.py` | `platform/backend/auth/` first, `platform/backend/` second, nowhere else |
| `platform/frontend/src/components/Login/` | `Login/` first, `src/components/` second, `src/` third |
| `platform/infrastructure/docker/` | `docker/` first, `infrastructure/` second |

Cross-boundary reading requires explicit permission from the Execution Package. A backend agent reading frontend code without permission is a policy violation, regardless of intent.

---

## Forbidden Context Expansion

These rules are as important as the expansion rules. They prevent context creep — the gradual expansion of reading scope that consumes the budget without producing value.

**A Backend agent must not read frontend code unless:**
- The task explicitly references it.
- The Technical Design explicitly references it.
- The Execution Package explicitly permits it.

**A Frontend agent must not read backend code unless:**
- The task explicitly references it (e.g., API contract section in the Technical Design).
- The Execution Package explicitly permits it.

**An Infrastructure agent must not read application code unless:**
- The task explicitly references it (e.g., configuring a service that backend code depends on).
- The Execution Package explicitly permits it.

**No agent may read:**
- `docs/features/` for a different feature.
- `docs/architecture/` sections unrelated to the task.
- `.company/` governance documents (these are for reference by the framework, not individual tasks).
- `.ai-memory/` files except `current-state.md` at session start.

---

## Stop Conditions

The agent must stop reading and proceed to implementation when:

1. It can answer: what to implement, where to write, what rules to follow, and what completion looks like.
2. It has read the mandatory layers (design, standards).
3. It has attempted adjacent reading or search and found what it needed.
4. It reaches the file budget without resolution → escalate, do not continue reading.

The agent must stop reading and escalate when:

1. The design is ambiguous — the Technical Design does not define behavior clearly enough to implement.
2. The task scope exceeds the package — the agent needs to write to a directory not listed in allowed writes.
3. The budget is exhausted without resolution.
4. A required file or interface is missing from the repository.
5. Standards conflict with each other and the conflict cannot be resolved locally.

---

## Relationship With `.ai-memory/`

Context Management handles *within-session* reading. The `.ai-memory/` system handles *between-session* continuity.

At session start, an agent reads:
- `.ai-memory/current-state.md` — to understand project phase and context.
- `.ai-memory/handoff.md` — if continuing from a prior session.

These are session initialization reads, not task-context reads. They do not count against the file budget.
