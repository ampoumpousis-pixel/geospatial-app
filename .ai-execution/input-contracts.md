# Input Contracts

Version: 1.0

Purpose: Define exactly what each execution agent receives, where it comes from, and what it may trust. These contracts enforce the principle that execution agents are thin consumers of approved context — they do not discover, invent, or reinterpret their inputs.

---

## Common Contract

Every execution agent operates under the same input contract baseline. Agent-specific contracts extend this baseline — they do not override it.

### Universal Required Inputs

Every agent receives these, regardless of role:

| Input | Owner | Authority | Trust Level |
|---|---|---|---|
| Execution Package | Package Author (Phase 1: Project Director) | Execution Context | Trusted — the package is the agent's single source of execution scope |
| Implementation Plan task reference | Task Planner (AGENT-105) | Execution Planning | Trusted — the task description is the definition of what to build |
| Applicable Technical Design sections | Technical Planner (AGENT-103) | Engineering | Trusted — the design is the source of truth for behavior, API, and data model |
| Applicable engineering standards | Standards (`.ai-rules/`) | Engineering | Trusted — standards define the rules the implementation must follow |

### Universal Trust Rules

An agent may trust an input when:
- It is listed in the Execution Package.
- It is an approved artifact (Feature Specification, Technical Design, Engineering Approval, Implementation Plan).
- It is a standards file from `.ai-rules/`.
- It is version-locked and the versions match.

An agent must verify (not blindly trust) when:
- The input is a recommended read — the planner suggested it, but the agent must confirm its relevance.
- The input is an existing source file — the code may contain bugs, outdated patterns, or inconsistencies.

### Universal Forbidden Assumptions

No execution agent may assume:

| What the agent must not assume | Why it must not assume it | What to do instead |
|---|---|---|
| "The design is probably correct even though this part is unclear." | The agent is not the designer. | Escalate to Technical Planner (AGENT-103). |
| "I know what the acceptance criteria should be." | The agent is not the requirements analyst. | Use criteria from the Execution Package. |
| "This existing code pattern is correct, I'll copy it." | Existing code may be wrong or outdated. | Follow the Technical Design and standards. |
| "I need to read the entire codebase to understand the task." | Context creep violates budget and boundaries. | Follow the context expansion algorithm. |
| "I should also fix this unrelated bug I noticed." | Scope change without approval. | Report in review. Do not fix. |
| "The standard seems too strict for this case, I'll relax it." | The agent is not the standards owner. | Escalate to Project Director. |
| "I'll add a small contract/interface since the design missed it." | The agent is not the architect. | Escalate to Technical Planner. |
| "The version lock might be stale, but the task seems clear." | Stale packages produce invalid implementations. | Reject the package. Escalate. |

### Input Order of Trust

When inputs conflict, precedence is:

1. Technical Design (engineering authority — highest)
2. Feature Specification (product authority)
3. Engineering Standards (rule authority)
4. Execution Package (execution context authority)
5. Existing source code (lowest — implementation, not design)

If the Technical Design and existing code conflict, the Technical Design wins. The agent follows the design and notes the code discrepancy in review.

---

## Backend Implementation Agent

### Required Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Execution Package | Package Author | Execution Context | Complete task universe: task definition, boundaries, completion criteria, source versions |
| Implementation Plan task | Task Planner (AGENT-105) | Execution Planning | The specific task from the plan (task ID, description, dependencies) |
| Technical Design sections | Technical Planner (AGENT-103) | Engineering | API design, data model, business logic, component boundaries — only the sections referenced in the package |
| Engineering standards | Standards (`.ai-rules/`) | Engineering | `.ai-rules/team/engineering-standards.md` (backend-relevant sections), `.ai-rules/project/geospatial-rules.md` (domain rules) |
| Security standards | Standards (`.ai-rules/`) | Security | `.ai-rules/security/security-rules.md` — mandatory when the task touches authentication, authorization, input handling, or data exposure |
| Testing standards | Standards (`.ai-rules/`) | Quality | `.ai-rules/testing/verification-rules.md` (test structure, coverage requirements) |

### Optional Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Existing source files | Repository | Implementation | Existing models, views, serializers, utilities in the target app — listed in the package as Recommended Reads |
| Existing tests | Repository | Implementation | Test patterns to follow, test utilities to reuse — listed in the package as Recommended Reads |
| Related configuration | Repository | Implementation | `settings.py` sections, URL configuration, Django app registry — listed in the package as Recommended Reads |
| API Contract | Technical Planner (AGENT-103) | Engineering | Extracted view of the Technical Design API sections (Phase 2: standalone contract file) |
| Shared types | Technical Planner (AGENT-103) | Engineering | Type definitions shared across domains (Phase 2: standalone contract file) |

### Input Validation Obligations

Before beginning implementation, the backend agent must:

1. Verify that every source artifact version in the package metadata matches the current version.
2. Confirm the package status is "Ready for Implementation."
3. Confirm the owner field matches "Backend."
4. Read every Technical Design section referenced in the package.
5. Read every standard listed in the package.
6. Note any recommended reads — these are suggestions, not requirements.

If any validation fails, the agent stops and escalates per the escalation policy in `execution-framework.md`.

### Reading Authority

The backend agent may read:
- Any file within `platform/backend/**` (its owned domain).
- Any file explicitly listed as a Recommended Read in the package.
- Technical Design sections referenced in the package.
- Standards files listed in the package.
- `.ai-memory/current-state.md` at session start.

The backend agent must not read:
- Any file under `platform/frontend/**` unless explicitly permitted by the package.
- Any file under `platform/infrastructure/**` unless explicitly permitted by the package.
- Any governance document (`.company/`).
- Any feature specification for a different feature.
- Architectural sections not referenced in the package.

### Write Authority

The backend agent may write only within the Allowed Writes listed in the package. It may not create files outside those directories, even for tests or utilities.

---

## Frontend Implementation Agent

*Placeholder contract. Detailed in Iteration 3.*

### Required Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Execution Package | Package Author | Execution Context | Complete task universe with "Owner: Frontend" |
| Implementation Plan task | Task Planner (AGENT-105) | Execution Planning | Frontend-specific task from the plan |
| Technical Design sections | Technical Planner (AGENT-103) | Engineering | UI design, component architecture, state management, API contract sections |
| Engineering standards | Standards (`.ai-rules/`) | Engineering | `.ai-rules/team/engineering-standards.md` (frontend-relevant sections) |
| Testing standards | Standards (`.ai-rules/`) | Quality | `.ai-rules/testing/verification-rules.md` |

### Optional Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Existing source files | Repository | Implementation | Existing components, pages, hooks, utilities |
| Existing tests | Repository | Implementation | Test patterns and utilities |
| API Contract | Technical Planner (AGENT-103) | Engineering | API surface the frontend consumes (same contract backend implements) |

### Domain Boundaries

The frontend agent owns `platform/frontend/**`. It reads the same API design sections as the backend agent — this is how cross-team consistency is maintained through approved design, not direct communication.

---

## Infrastructure Implementation Agent

*Placeholder contract. Detailed in Iteration 4.*

### Required Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Execution Package | Package Author | Execution Context | Complete task universe with "Owner: Infrastructure" |
| Implementation Plan task | Task Planner (AGENT-105) | Execution Planning | Infrastructure-specific task from the plan |
| Technical Design sections | Technical Planner (AGENT-103) | Engineering | Deployment design, service boundaries, environment configuration |
| Engineering standards | Standards (`.ai-rules/`) | Engineering | Infrastructure-relevant standards |

### Optional Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Existing Docker files | Repository | Implementation | `docker-compose.yml`, `Dockerfile`, service configurations |
| Environment configuration | Repository | Implementation | `.env` templates, environment-specific settings |
| Deployment contract | Technical Planner (AGENT-103) | Engineering | Service boundaries, port mappings, volume mounts (Phase 2) |

### Domain Boundaries

The infrastructure agent owns `platform/infrastructure/**`. It may read backend or frontend configuration only when explicitly permitted by the package.

---

## Code Reviewer Agent

*Placeholder contract. Detailed in Iteration 2.*

### Required Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Execution Package | Package Author | Execution Context | The same package the developer agent received — provides scope, boundaries, and completion criteria |
| Code diff | Developer Agent | Engineering | The actual code changes to review |
| Implementation Plan task | Task Planner (AGENT-105) | Execution Planning | Task definition for scope verification |
| Technical Design sections | Technical Planner (AGENT-103) | Engineering | Design against which correctness is evaluated |
| Engineering standards | Standards (`.ai-rules/`) | Engineering | Standards against which quality is evaluated |

### Reviewer-Specific Inputs

| Input | Owner | Authority | Description |
|---|---|---|---|
| Completion claim | Developer Agent | Engineering | A statement from the developer agent declaring what was implemented and that all completion criteria are met |

### Review Authority

The reviewer evaluates implementation against:
- Completion criteria in the package.
- Technical Design sections referenced in the package.
- Engineering standards.
- Execution policies (allowed writes, prohibited actions, verification).

The reviewer does not:
- Rewrite code.
- Propose alternative implementations beyond what the design specifies.
- Change acceptance criteria.
- Modify the package.
- Approve work that violates execution boundaries.

The reviewer's output is a Review Result artifact. It reports findings — it does not make authoritative design or product decisions.

---

## Contract Governance

### Contract Ownership

Input contracts are owned by the Execution Framework. They are modified through the human-managed `.ai-execution/` directory. Agent-specific agent definitions (Iteration 1-4) must reference these contracts — they must not redefine them.

### Contract Evolution

When a new agent type is created, its input contract is added to this document. The common contract applies to all agent types automatically. Agent-specific sections only add role-specific inputs — they never subtract from the common contract.

### Contract Enforcement

A developer agent that receives fewer inputs than the contract requires must escalate. A reviewer that notices a missing required input must report it. The package author is responsible for providing all required inputs before marking the package "Ready for Implementation."

### Relationship With Agent Definitions

Agent definitions (e.g., `backend-implementation-agent.md`) reference this document for inputs. They do not replicate input lists. The agent definition adds role-specific workflow, ownership, and behavior — inputs are defined here, once.

---

## Input Summary Matrix

| Input | Backend | Frontend | Infrastructure | Reviewer |
|---|---|---|---|---|
| Execution Package | Required | Required | Required | Required |
| Implementation Plan task | Required | Required | Required | Required |
| Technical Design sections | Required | Required | Required | Required |
| Engineering standards | Required | Required | Required | Required |
| Security standards | When relevant | When relevant | When relevant | When relevant |
| Testing standards | Required | Required | — | — |
| Existing source files | Optional | Optional | Optional | — |
| Existing tests | Optional | Optional | — | — |
| Related configuration | Optional | — | Optional | — |
| API Contract | Optional (Phase 2) | Optional (Phase 2) | — | — |
| Shared types | Optional (Phase 2) | Optional (Phase 2) | — | — |
| Code diff | — | — | — | Required |
| Completion claim | — | — | — | Required |
