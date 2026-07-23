# Execution Lessons — Design Journal

A lightweight record of what each iteration taught us. Not a framework document. Design rationale for the execution layer.

---

## Iteration 1 — Backend Vertical Slice (T-F001-1.1)

- **Execution Type emerged from necessity.** T-F001-1.1 was pure verification — all bootstrap config already correct. The agent correctly identified no code changes were needed, but the workflow had no explicit branch for this. Led to adding Execution Type to the package spec in 1.5.
- **Bash permissions were too restrictive.** The original flat allowlist (ruff, mypy, python manage.py test, mkdir) didn't cover inspection commands needed for verification: `check`, `showmigrations`, `shell`, `pip list`. Led to capability domains in 1.5.
- **Docker coupling surfaced immediately.** Running verification inside the container exposed that the agent needed to know Django commands run inside Docker, but embedding `docker exec docker-backend-1` in the agent would couple it to infrastructure. Led to the Execution Environment Rule in the framework.
- **Session initialization was implicit.** `context-management.md` said to read `current-state.md` at session start, but the agent workflow didn't include it. Led to Step 0 in 1.5.
- **Context budget is not the bottleneck yet.** Read ~9 files in Iteration 1 (budget 15). The budget isn't restrictive, which is good — it means the algorithm is selecting the right files.
- **Version-locking works.** Validated all 5 source artifact versions against upstream before proceeding. No mismatches found, but the mechanism itself is sound.
- **Completion report format is good.** The structured report (files, verification, acceptance, boundary) provides everything a reviewer needs.

## Iteration 1.5 — Hardening (T-F001-1.2)

- **Knowledge Lifecycle axiom replaced the single-sentence principle.** "Planning creates knowledge. Execution consumes knowledge. Review validates knowledge. Approval authorizes knowledge." Describes the entire system, not just execution. Future roles (Tester, Release) fit naturally.
- **Execution Type proves its value.** Declaring `Implementation` vs `Verification` in the package lets the agent know in Step 1 whether code changes are expected. Doesn't split the workflow — just influences expected activities.
- **Capability domains scale better than command lists.** Inspection, Testing, Linting, Type Checking, Database, Dependencies — each maps to 2-3 commands. Backend maps them to Django commands. Frontend will map them to npm/jest/eslint. Infrastructure maps differently. Much cleaner.
- **Execution Environment Rule prevented Docker leak.** The agent says "execute commands according to the project's configured execution environment." The framework handles the how. Infra knowledge stays in the framework.
- **Context budget still unstressed.** Read only 3 files for T-F001-1.2. Wait for complex multi-file tasks before adjusting the 15-file limit.
- **Lint/typecheck tools missing from Docker container.** Bootstrapped image had no ruff/mypy. Fixed in this iteration. Without these, verification is incomplete and reviews are ambiguous.
- **`platform/` is in `.gitignore`.** Code changes aren't tracked by git. Expected for bootstrapped dev environment, but production projects would need this reversed.
- **Framework layers exercised simultaneously.** Even a simple task (add 2 constants, create 1 check) touched three hardening additions: Execution Type, Environment Rule, and Capability Domains. That's a strong signal the additions are the right ones.

## Patterns observed

- **Every iteration discovers infrastructure, not architecture problems.** Iteration 1 found missing bash commands and Docker coupling. Iteration 1.5 found missing lint tools. None found "the architecture is wrong" or "the design is incomplete." The separation between planning and execution is holding.
- **Thin agents, thick foundation actually works.** The backend agent is 327 lines. The framework is 4 documents. The agent doesn't duplicate policies, context rules, or input contracts — it references them. Adding capability domains to the agent automatically improved verification for every future task without changing the framework.
- **Two knowledge speeds emerging.** Stable knowledge (policies, standards, architecture, authority) changes slowly. Runtime knowledge (execution packages, completion reports, evidence, reviews) changes every task. This split will become more important as orchestration enters the picture.

## Open questions for later

- Is 15 files the right context budget? Both tasks used <10. Test with T-F001-3.1 (Login endpoint — multi-file creation) to stress it.
- Should the completion report become a formal "Execution Evidence" artifact? It already has the structure. Formalizing it would give the reviewer structured input.
- When should lint/typecheck failures block completion vs be reported? Currently the agent is blocked. Some failures (missing stubs, pre-existing issues) shouldn't block progress.

## Iteration 2 — Code Reviewer (T-F001-1.2 review)

- **Reviewer PASS validates the execution loop, not just the code.** The reviewer passed with zero findings from the developer's changes. This confirms the execution layer works end-to-end: Plan → Package → Execute → Report → Review. A false positive (inventing issues on clean code) would be worse than a false negative.
- **Independent verification works as designed.** The reviewer verified each claim: files changed (actual vs reported), commands run (re-executed), acceptance criteria (runtime verification). The reviewer didn't trust the completion report — it validated claims against the repository.
- **Pre-existing issues are correctly classified.** Ruff found `import os` unused (MINOR — pre-existing, not from this task). Mypy found missing third-party stubs (OBSERVATION — pre-existing, not from this task). The reviewer didn't fail the task for code it didn't touch.
- **Files Changed handshake works.** Developer declared: base.py (modified), checks.py (created). Reviewer confirmed: only those two files, both within Allowed Writes. The mandatory section in the completion report enables independent verification.
- **Seven-area validation matrix is the right scope.** Execution Package, Architecture, Acceptance Criteria, Boundary, Standards, Security, Testing. Each area has a clear question and independent evidence. No area had ambiguous criteria.
- **Review context was bounded.** Reviewer read 2 files (settings, checks.py) plus package, design references, and standards. Did not explore frontend, infrastructure, or unrelated backend code. Broader read permissions did not lead to uncontrolled exploration.
- **Review Result artifact works as a contract.** The four-section schema (Decision, Validation, Findings, Evidence) was produced cleanly. The format is ready for consumption by the next stage in the pipeline.
- **First closed-loop execution complete.** Plan → Execute → Review → Accept. The execution layer is no longer a one-way pipeline.

## Iteration 2.5 — Template Extraction

- **Two agents, enough evidence for extraction.** Backend (executor) and Reviewer (validator) share: identity structure, session init, context loading, authority skeleton, escalation format, completion philosophy, standards table, framework references. Extracted to `generic-agent-template.md`.
- **Template as adapter, not source of truth.** The template references framework rules — it never copies them. "Context loading follows `context-management.md`" not "agents must read 15 files." Keeps framework as the single source of policy.
- **Agents remain identity-complete.** After refactoring, a reader who opens only the backend agent can still answer: ownership (`platform/backend/**`), capabilities (6 domains), first action (validate package), evidence output (completion report with Files Changed). No need to open the template.
- **YAML frontmatter dominates agent size.** Backend agent: 287 lines total, 85 lines of bash permissions. Markdown body: 202 lines. The bash allowlist (capability domains → specific commands) is necessarily verbose. Future optimization: reference capability domains in framework, map commands in agent.

## Iteration 0-2.5 Maturity Checkpoint

### Validated Execution Mechanics

- Package consumption with version-locking
- Bounded context (15-file budget, locality-first algorithm)
- Developer execution (Implementation + Verification types)
- Independent review (7-area validation matrix)
- Evidence handshake (Files Changed → independent verification)
- Closed-loop acceptance (Plan → Execute → Review → PASS)
- Agent abstraction extraction from real execution evidence
- Execution capabilities as domain-abstracted commands
- Execution Type as intent metadata
- Knowledge Lifecycle as system-wide axiom
- **Multi-domain execution** — frontend agent implemented auth service consuming same Technical Design API contracts as backend, with zero cross-domain communication
- **Existing reviewer validates new domain** — same review framework, same 7-area matrix, same artifact contract. No changes needed.

### Not Yet Validated

- Contract evolution (API contract changes → downstream invalidation)
- Refactoring workflow
- Orchestration / concurrent agent execution
- CI integration / deployment pipeline
- Escalation under ambiguous design
- Context budget stress (complex multi-file tasks)

## Iteration 3 — Frontend Agent (T-F001-6.1)

### Outcome A — Architecture Validated

- **Cross-domain execution works.** Frontend implemented `authService.ts` + `apiClient.ts` consuming the same Technical Design API contracts as the backend. Zero backend files read. No direct communication between agents. Technical Design acted as the communication layer.
- **Same execution package, context algorithm, workflow, and reviewer work across domains.** No domain-specific framework changes needed.
- **API contracts in Technical Design were sufficient.** All 8 API endpoint specs (API-F001-001 through API-F001-008) provided enough detail for independent frontend implementation. No contract pressure discovered.
- **Frontend agent is thinner than backend.** Most complexity inherited from `generic-agent-template.md`. Capability domains (Testing, Linting, Type Checking, Inspection, Dependencies) mapped to npm ecosystem instead of Django.
- **7-point test matrix:** Package ✅, Context ✅ (3/15 files), Independence ✅ (zero backend reads), Design ✅, Capabilities ✅ (tsc), Evidence ✅, Review ✅.
- **Existing reviewer produced clean PASS** with cross-domain independence noted as observation — no new review categories needed.

### Open questions (updated)

- Contract pressure test: T-F001-6.1 had well-documented API specs. A task with ambiguous API behavior would test the "escalate, don't compensate" rule.
- Infrastructure agent (Iteration 4): third domain should be thinner still — mostly proving the pattern generalizes.

## Iteration 4 — Infrastructure Agent (T-F001-INFRA)

### Outcome A — Architecture Validated (Third Domain)

- **Infrastructure verification works within the same framework.** Agent validated Docker Compose config, service inventory, and runtime state using runtime commands exclusively. No application source files read. No infrastructure files modified. Allowed Writes: None respected.
- **Verification Type generalizes correctly.** Same concept from T-F001-1.1 (backend verification, no code changes) applied to infrastructure domain. Allowed Writes: None is a first-class package constraint understood by the third agent type.
- **Cross-boundary escaltion rules are in place.** Agent explicitly lists what belongs to other agents (CORS → Backend, ports → Technical Planner, secrets → Security Reviewer). These rules prevent infrastructure from accidentally modifying application behavior.
- **Runtime Operations named correctly.** Not "Deployment" — avoids implying production authority in Phase 1. Commands are verification-first: operational commands used only when required by the package.
- **Existing reviewer produces clean PASS.** Third domain in a row. Same 7-area validation matrix. Zero findings. Cross-domain independence observed as the key evidence.
- **5 cross-boundary escalation triggers documented.** Infrastructure is the domain where accidental cross-boundary changes are easiest. Explicit triggers prevent this.

---

## Phase 1 — Execution Foundation: Complete

### Validated Execution Mechanics (14 items)

1. Execution Package consumption with version-locking
2. Bounded context (15-file budget, locality-first algorithm)
3. Implementation execution (code writes within boundaries)
4. Verification execution (no-code-change tasks)
5. Independent review (7-area validation matrix)
6. Evidence handshake (Files Changed → independent verification)
7. Closed-loop acceptance (Plan → Execute → Review → PASS)
8. Agent abstraction from real execution evidence
9. Execution capabilities as domain-abstracted commands
10. Execution Type as intent metadata
11. Knowledge Lifecycle as system-wide axiom
12. **Multi-domain execution** — Backend + Frontend + Infrastructure
13. **Shared reviewer across domains** — same framework, no domain-specific changes
14. **Generic agent template** — validated by 4 agent types (3 executors + 1 reviewer)

### Validated Domains (3/3)

```
                Technical Design
                       │
          +------------+------------+
          │            │            │
          ▼            ▼            ▼
 Backend Agent  Frontend Agent  Infrastructure Agent
 Django/DRF     React/TS         Docker/runtime

          │            │            │
          +------------+------------+
                       │
                       ▼
               Code Reviewer
```

### Agent Registry (6 agents)

```
.opencode/agents/
    generic-agent-template.md              ← shared skeleton
    backend-implementation-agent.md        ← Python/Django
    frontend-implementation-agent.md       ← React/TypeScript
    infrastructure-implementation-agent.md ← Docker/runtime
    code-reviewer-agent.md                 ← independent validation
```

### Deferred to Phase 2 (6 items)

- Contract evolution (extracting standalone contracts from Technical Design)
- Orchestration / concurrent agent execution
- Context budget stress (complex multi-file tasks)
- CI integration / deployment pipeline
- Escalation under ambiguous design
- Refactoring workflow

