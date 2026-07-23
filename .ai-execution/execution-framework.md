# Execution Framework

Version: 1.0

Purpose: Define how implementation agents operate. This document establishes the philosophy, lifecycle, and policies that every execution agent must follow. It extends the governance layer — it does not duplicate it.

Governance documents this framework builds on: `PRINCIPLES.md`, `ROLES.md`, `approval-policy.md`, `engineering-workflow.md`, `review-matrix.md`.

Companion documents: `context-management.md` (how agents read), `execution-artifact-map.md` (full pipeline artifact ecosystem).

---

## Core Principle

**Execution consumes approved knowledge — it does not create it.**

Every execution decision flows from this principle:

- Developer agents implement the approved design. They do not redesign.
- Reviewers identify issues against standards and design. They do not change architecture.
- Contracts derive from the Technical Design. Code does not define contracts.
- Context starts with approved artifacts. The repository is consulted only if necessary.
- Implementation stays inside defined boundaries.

---

## Execution Lifecycle

```
Approved Task
        │
        ▼
Execution Package (prepared by planner/coordinator)
        │
        ▼
Developer Agent (read package → expand context if needed → implement)
        │
        ▼
Code Review
        │
        ├─────────────────┐
        ▼                 ▼
Pass                Issues Found
        │                 │
        ▼                 ▼
Complete        (Phase 2 governance: fix, escalate, or accept)
```

The lifecycle is intentionally linear. Developer agents do not edit the plan, the package, or the design. They implement what was approved and verify their work. Review happens after implementation, not during it.

---

## Execution Philosophy

### Approved Knowledge Is the Source of Truth

The Technical Design defines what to build. The Implementation Plan defines the task breakdown. The Execution Package defines the task boundaries. The developer agent reads these, implements them, and stops.

If the design is missing information the agent needs, the agent escalates. It does not fill gaps with assumptions.

### Thin Agents, Thick Foundation

Developer agents are thin — they inherit policies, standards, and context rules from the framework. Their prompt adds only role-specific ownership (which directories they own, which standards apply to them).

This means improving the framework improves every agent. Changing a policy in one place propagates to all implementors.

### Boundaries Are Enforced, Not Suggested

The Execution Package defines what an agent may write to and what it may not. These are hard constraints. An agent that writes outside its boundaries has failed the task, regardless of code quality.

### Verification Is Part of Implementation

A developer agent must verify its own work before submitting for review. The review layer is independent validation, not a substitute for self-verification.

---

## Execution Policies

These policies extend the governance in `ROLES.md` and `approval-policy.md`. Every execution agent inherits them.

### Ownership Policy

Every directory in the project has a single owner agent type.

| Directory | Owner |
|---|---|
| `platform/backend/**` | Backend Implementation Agent |
| `platform/frontend/**` | Frontend Implementation Agent |
| `platform/infrastructure/**` | Infrastructure Implementation Agent |
| `.ai-execution/**` | Execution Framework (human-managed) |
| `.company/**` | Governance (human-managed) |
| `.ai-rules/**` | Standards (human-managed) |
| `.ai-memory/**` | Knowledge Manager |
| `docs/**` | Respective planning agents |

An agent writes only to directories it owns. Cross-ownership changes require coordination through contracts or explicit task assignment.

### Allowed Writes Policy

The Execution Package defines allowed writes for each task at directory granularity.

Format: `platform/backend/auth/**`

Rules:
- An agent writes only to directories listed in the package.
- An agent reads freely within its owned directories.
- An agent reads outside its owned directories only as permitted by the package and context rules.
- Writing outside allowed directories is a policy violation.

### Prohibited Actions

Execution agents must never:

- Modify approved design documents (Technical Design, Feature Specification).
- Modify requirements or acceptance criteria.
- Modify architecture decisions (ADRs).
- Modify standards or rules.
- Modify governance documents.
- Change the task scope without escalation.
- Write outside directories listed in the Execution Package.
- Reference implementation code from an unrelated domain without explicit permission.
- Create new contracts or interfaces without escalation.

### Escalation Policy

An execution agent must escalate when:

| Condition | Escalate To |
|---|---|
| Design is ambiguous or incomplete | Technical Planner (AGENT-103) |
| Task scope exceeds the package | Project Director |
| Required file is outside allowed writes | Project Director |
| Discovered a bug in existing code unrelated to the task | Report in review, do not fix |
| Found a security vulnerability | Security Reviewer |
| Standards conflict with the task | Project Director |
| Cannot complete without more context than budget allows | Project Director |

The agent must stop work and escalate. It must not proceed with assumptions.

### Verification Policy

Before submitting code for review, the developer agent must:

1. Run all existing tests in the affected modules.
2. Run all new tests added for the task.
3. Run the linter and type checker on changed files.
4. Verify the implementation against acceptance criteria from the Technical Design.
5. Verify no files outside the allowed writes were modified.

A task is not ready for review until all five checks pass.

### Completion Policy

A task is complete when:

- Code is written and verified.
- Code review passes.
- Knowledge is recorded (memory update, handoff if session ends).

The agent declares completion. The reviewer confirms it. The gateway is always independent verification.

---

## Relationship With Governance

This framework does not replace `.company/` governance. It extends it for the execution domain.

| Governance Answers | Execution Framework Answers |
|---|---|
| How the company works | How implementation works |
| Who has authority over what | Who writes which directories |
| When approval is required | When escalation is required |
| What reviews are needed | How to self-verify before review |
| How planning pipeline flows | How execution lifecycle flows |

When a policy exists in both layers, the execution layer is more specific. The governance layer is authoritative. An execution agent follows both, with governance taking precedence in conflicts.
