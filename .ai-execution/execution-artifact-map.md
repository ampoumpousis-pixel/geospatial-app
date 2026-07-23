# Execution Artifact Map

Version: 1.0

Purpose: Map every artifact in the engineering pipeline — from product definition through implementation and review. This answers "who produces what, who consumes what, and who has authority" before the question arises.

---

## Full Pipeline

```
Feature Planner (AGENT-102)
        │
        ▼
Feature Specification
        │
        ▼
Technical Planner (AGENT-103)
        │
        ▼
Technical Design
        │
        ▼
Engineering Reviewer (AGENT-104) ──► Engineering Review
        │
        ▼
Engineering Approval Gate ──► Engineering Approval
        │
        ▼
Task Planner (AGENT-105)
        │
        ▼
Implementation Plan
        │
        ▼
(Execution Coordinator — Phase 2)     ← Phase 1: hand-crafted
        │
        ▼
Execution Package
        │
        ├──────────────────────┐
        ▼                      ▼
Backend Agent            Frontend Agent
Infrastructure Agent
        │                      │
        ▼                      ▼
Code                           Code
        │                      │
        └──────────┬───────────┘
                   ▼
Code Reviewer
                   ▼
Review Result
```

---

## Artifact Table

| Artifact | Producer | Consumer | Authority |
|---|---|---|---|
| Feature Specification | Feature Planner (AGENT-102) | Technical Planner (AGENT-103) | Product |
| Technical Design | Technical Planner (AGENT-103) | Engineering Reviewer (AGENT-104), Task Planner (AGENT-105), Developer Agents, Code Reviewer | Engineering |
| Engineering Review | Engineering Reviewer (AGENT-104) | Engineering Approval Gate, Task Planner (AGENT-105) | Advisory |
| Engineering Approval | Engineering Approval Gate | Task Planner (AGENT-105), Developer Agents (via version lock) | Approval |
| Implementation Plan | Task Planner (AGENT-105) | Execution Coordinator (Phase 2), Developer Agents (Phase 1: hand-crafted packages) | Execution Planning |
| Execution Package | Execution Coordinator (Phase 2) / Hand-crafted (Phase 1) | Developer Agents, Code Reviewer | Execution Context |
| Code (Backend) | Backend Implementation Agent | Code Reviewer, Frontend Agent (via contracts) | Engineering |
| Code (Frontend) | Frontend Implementation Agent | Code Reviewer | Engineering |
| Code (Infrastructure) | Infrastructure Implementation Agent | Code Reviewer, Developer Agents | Engineering |
| Review Result | Code Reviewer | Developer Agents, Project Director | Quality |

---

## Version Lock Chain

```
Feature Specification vN
        │
        ▼
Technical Design vM ──── references Feature Spec vN
        │
        ▼
Engineering Review vP ── references Feature Spec vN + Technical Design vM
        │
        ▼
Engineering Approval vQ ─ references Technical Design vM + Engineering Review vP
        │
        ▼
Implementation Plan vR ─ references all upstream versions
        │
        ▼
Execution Package ────── references Implementation Plan vR + Technical Design vM
```

Any upstream version change invalidates all downstream artifacts. The Execution Package inherits this constraint.

---

## Authority Levels

| Authority | Who Sets It | Examples |
|---|---|---|
| Product | Feature Planner + Human Owner | What to build, user stories, acceptance criteria |
| Engineering | Technical Planner (AGENT-103) | Architecture, API design, data model, component boundaries |
| Approval | Engineering Approval Gate + Human | Whether the design is accepted for implementation |
| Execution Planning | Task Planner (AGENT-105) | Task decomposition, ordering, dependency resolution |
| Execution Context | Execution Coordinator (Phase 2) | Per-task boundaries, allowed writes, standards loading |
| Quality | Code Reviewer | Correctness, standards, completeness |

No artifact may be created at a lower authority level than its upstream dependencies. Execution consumes approved knowledge — it does not create it.

For the execution philosophy, lifecycle, and policies that govern every artifact in this map, see `execution-framework.md`. For how agents acquire context to produce artifacts, see `context-management.md`.
