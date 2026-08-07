# Framework Invariants

## Purpose

This document defines the invariants that the engineering framework guarantees.
Every feature run, work item, and validation exercise SHALL preserve these invariants.
Invariants are the authoritative contract between the framework and its users.

## Source

This document is derived from the Phase 2 validation and Phase 3 F-002/F-003 flight tests.
The retrospective at `docs/engineering/findings/flight-test-retrospective.md` contains the
evidence chain for each invariant. The F-003 flight test report at
`docs/engineering/findings/F-003/F-003-flight-test-report.md` contains the validation
evidence for the governance invariants (FI-G-001 through FI-G-004).

## Invariant Lifecycle

| Status | Meaning | Achieved At |
|---|---|---|
| Proposed | Identified during a flight test or retrospective analysis | Observation |
| Adopted | Encoded into the framework (agent instructions, gate prompts, commands, documentation) | Implementation |
| Validated | Independently demonstrated by at least one subsequent real feature run | Proven |

## Modification Rule

Framework Invariants may only be added, removed, or materially changed through a
documented retrospective or validation exercise, with evidence referencing the
originating findings. Amendments without evidence from a flight test or formal
analysis are not permitted.

## Layer Model

Framework artifacts occupy five layers:

| Layer | Content |
|---|---|
| Layer 1 — Product Inputs | Feature catalogue, operator command, ADRs |
| Layer 2 — Planning Artefacts | Agent-native signals: EAF, TD |
| Layer 3 — Engineering Validation | Review findings: RC, SC, AD |
| Layer 4 — Validation Observations | Framework findings (six-category taxonomy) |
| Layer 5 — Framework Governance | Invariants defined in this document |

Agent-native signals (Layers 2-3) are evidence. Validation observations (Layer 4)
reference them without renaming or duplicating. Invariants (Layer 5) derive from
pattern analysis across multiple observations.

---

## Technical Invariants (Phase 2)

Proven by Phase 2 validation suite (8/8 tests passed). Status: **Validated**.

### FI-T-001 — Origin Preservation

**Statement:** Execution packages SHALL carry an `origin` metadata field describing
the source of the work (Feature or Work). The execution pipeline SHALL NOT branch
behavior based on this field. Manifest entries SHALL be structurally equivalent
regardless of origin type.

**Evidence:** Phase 2 validation tests confirmed structural equivalence between
feature and work manifests. D2 invariant — the pipeline is origin-agnostic.

**Owner:** Command layer

---

### FI-T-002 — D2 — Execution Package Metadata Agnostic to Origin

**Statement:** Execution package metadata SHALL NOT contain feature-specific
identifiers that would prevent a package from being processed by an origin-agnostic
pipeline. The `origin` field describes provenance, not routing.

**Evidence:** Phase 2 D2 validation confirmed execution packages carry `origin`
metadata without feature-specific routing information.

**Owner:** Execution Package Agent

---

### FI-T-003 — B4 — No Silent Architectural Ambiguity Resolution

**Statement:** The Task Planner SHALL NOT silently resolve architectural ambiguity.
When the technical design is insufficiently determinate for task decomposition,
the Task Planner SHALL return Design Gap Returns (DGRs) rather than making
architecture assumptions.

**Evidence:** Phase 2 validation (Test 21). B4 regression tests confirmed the
Task Planner correctly returns DGRs for underspecified designs.

**Owner:** Task Planner

---

### FI-T-004 — Manifest Schema v1.0 Conformance

**Statement:** All task manifests SHALL conform to schema version 1.0. Every task
SHALL have: id, domain, executor, execution_type, files, allowed_writes,
dependencies, and completion_criteria. The dependency graph SHALL be acyclic.
Parallel tasks SHALL have disjoint allowed_writes.

**Evidence:** Phase 2 schema validation. F-002 manifest (15 tasks) confirmed
conformance.

**Owner:** Task Planner

---

### FI-T-005 — Deterministic Artifact Locations

**Statement:** Every pipeline stage SHALL produce its artifacts at a predictable,
deterministic file path derived from the feature or work ID. No stage SHALL
require the orchestrator to search for output files.

**Evidence:** Phase 2 path validation. F-002 confirmed all 10 artifacts at
expected paths under `docs/project/features/F-002/`,
`docs/engineering/technical-plans/F-002/`,
`docs/engineering/reviews/F-002/`,
`docs/engineering/approvals/F-002/`,
`docs/engineering/task-plans/F-002/`.

**Owner:** Command layer

---

## Governance Invariants (Phase 3)

Discovered by F-002 flight test. Status: **Validated** (Promoted from Adopted on
2026-08-05 by the F-003 flight test — positive control: operator scope respected,
natural revision loop archived superseded artifacts, gate performed scope comparison).
Encoded into agent instructions, gate prompts, and lifecycle commands during Phase 3.5.

### FI-G-001 — Authority Precedence

**Statement:** Whenever two or more authoritative inputs can influence the same
planning decision, the framework SHALL define their precedence before planning
begins. If no precedence exists, the planner SHALL escalate rather than choose
implicitly.

**First observed case:** F-002 flight test. Three inputs (catalogue scope,
operator-defined flight-test scope, planner interpretation) entered the pipeline
with no defined precedence. The Feature Planner selected catalogue scope by
default, and the expansion propagated through four stages without a governance
checkpoint.

**Evidence:** `docs/engineering/findings/flight-test-retrospective.md` §4
(Deep Dive 3 — Authority Precedence Discovery).

**Owner:** Feature Planner, Human Gate

**Adoption encoding:** Feature Planner prompts in `feature-create.md` include
Scope Authority Rule. Human Gate prompts in `feature-design-flow.md` include
scope comparison step. Governance encoding documented in
`docs/engineering/governance/governance-encoding.md`.

---

### FI-G-002 — Evidence Preservation

**Statement:** Superseded artifacts SHALL be archived, not overwritten. The
version chain between successive revisions of an artifact SHALL be reconstructable
from the file system. No artifact SHALL be removed without an archived copy
persisting.

**First observed case:** F-002 revision loop. Technical Design v1.0 and
Engineering Review v1.0 were overwritten by v1.1 and v2.0 respectively.
No archive copy was preserved. The only record of the original content is the
review narrative describing the findings.

**Evidence:** `docs/engineering/findings/flight-test-retrospective.md` §7
(Orchestration Quality — Gaps).

**Owner:** Command layer, lifecycle commands

**Adoption encoding:** `/lifecycle archive` command implemented at
`.opencode/commands/lifecycle-archive.md` (CMD-216). Superseded artifacts
SHALL be archived before replacement.

---

### FI-G-003 — Decision Traceability

**Statement:** Agent-native signals (EAF, TD, RC, SC, AD) form a provenance
chain. Validation observations SHALL reference them as evidence without renaming
or duplicating them. No signal SHALL be automatically converted into a finding
or invariant — conversion requires explicit analysis.

**First observed case:** F-002 EAF reconciliation. The relationship between
EAF signals and the finding taxonomy was ambiguous until formalized in the
retrospective. EAF-F002-001 was found to serve as evidence for two separate
observations (catalogue accuracy and authority precedence), demonstrating that
one signal can feed multiple findings without being conflated with either.

**Evidence:** `docs/engineering/findings/flight-test-retrospective.md` §6
(EAF Reconciliation Appendix).

**Owner:** All agents, validation framework

**Adoption encoding:** EAF-to-finding relationship formalized in retrospective §6.
Agent-native signal rules documented in
`docs/engineering/governance/governance-encoding.md`.
`/lifecycle trace` command implemented at `.opencode/commands/lifecycle-trace.md`
(CMD-217) for provenance reconstruction.

---

### FI-G-004 — Explicit Scope Approval

**Statement:** Any scope change from operator-defined input SHALL appear as an
explicit approval decision at the Human Gate. The gate SHALL validate both
technical coherence and scope authority before approving. Scope expansion that
is not surfaced as an approval decision SHALL be treated as a governance violation.

**First observed case:** F-002 flight test. The scope expanded from "User profile
management only" to full Group and Role management at the Feature Planner stage.
The expansion propagated through the Technical Planner, Engineering Review, and
Human Gate without being presented as an approval decision. The gate validated
technical coherence but not scope boundaries.

**Evidence:** `docs/engineering/findings/flight-test-retrospective.md` §4
(Deep Dive 3 — Authority Precedence Discovery).

**Owner:** Human Gate

**Adoption encoding:** Human Gate prompt in `feature-design-flow.md` Phase C
includes explicit scope comparison and authorization question. Feature Planner
prompt in `feature-create.md` requires Scope Comparison section in spec.

---

## Frontend Integration Invariants (Phase 4)

Discovered by the Phase 4 validation of the Frontend Integration Planner pipeline. Status: **Proposed**.
Evidence: `docs/engineering/validation/phase-4-validation.md` (Tests 1–2), `docs/engineering/findings/F-022/F-022-flight-test-report.md`, `docs/engineering/findings/F-023/F-023-flight-test-report.md`.

### FI-I-001 — Evidence-Based Architecture Invariant

**Statement:** Any agent MAY declare reuse, existence, or non-existence of a page, component, service, or surface ONLY when inspection of the actual project state provides evidence for that declaration. Documented names, product areas, or architectural descriptions are hypotheses, not facts. If the actual state lacks a surface a document describes as existing, the agent MUST declare it new (or absent) and record the discrepancy rather than fabricate an evidence claim. This invariant applies to any agent consuming project artifacts, not only frontend planning.

**First observed case:** Phase 4 F-022 flight test. The specification's product context described "application header", "user settings", and "dashboard" as existing product areas. The frontend scaffold contains none of them. The live planner verified the scaffold and declared AppHeader/AppLayout/Notification Center/preferences as NEW, citing the real candidates (apiClient, authService, theme, SystemInfo) with concrete reasons — no fabricated reuse. F-023 confirmed the complementary behaviour: the planner named the genuinely existing home page as the only reuse target for the panel.

**Evidence:** `docs/engineering/frontend-integration/F-022/frontend-integration.md` §2/§14/§15 (verification statements, reuse candidates, rejection reasons, FD-F022-001); `docs/engineering/frontend-integration/F-023/frontend-integration.md` §14/§15 (FD-F023-001/003).

**Owner:** Frontend Integration Planner (enforcement), Engineering Design Reviewer (independent verification — see Obs-F022-05: reviewer permission gap limits verification).

**Adoption encoding:** proposed by the Phase 4 flight tests; the invariant is not yet encoded in the FIP prompt beyond the existing Reuse-first principle. Encoding options: require the FIP artifact to cite verified evidence per reuse claim; add reviewer source-inspection permission for `platform/frontend/**` to enable independent verification.

---

### FI-I-002 — Semantic Artifact References

**Statement:** When an agent references another artifact's content, it SHALL locate the content by stable identifiers (e.g., `API-FXXX-001`, `CMP-FXXX-002`) or by heading semantics (e.g., "the Technical Design's API section"), never by document position number (e.g., "§10"). Position numbers drift when templates evolve; headings and identifiers are stable.

**First observed case:** Phase 4 Obs-F022-04. The Frontend Integration Planner agent instructions hardcoded "Technical Design §10 (APIs)" and "§16 (permissions)"; the Technical Design template inserted a Contract Boundary Declaration section, shifting APIs to §11 and permissions to §17. The live planner adapted in its output, but the instructions remained stale and would mis-anchor future runs.

**Evidence:** `docs/engineering/validation/phase-4-validation.md` Test 1 (Obs-F022-04); encoding fix applied 2026-08-06 (A1 stabilization).

**Owner:** All agents that reference upstream artifacts (FIP, Engineering Reviewer, Task Planner).

**Adoption encoding:** applied in the FIP, reviewer, and task-planner agent files (2026-08-06): positional `§N` TD references replaced with semantic headings.

---

### FI-I-003 — Implementation Completeness

**Statement:** Every implementation decision made by an implementation agent MUST trace to an approved upstream artifact (Frontend Integration, Technical Design, approved implementation plan/task package) or to an explicit implementation standard (.ai-rules, framework convention, project coding standard). New architecture that is not declared upstream — providers, stores, contexts, routes, layouts, or abstractions — MUST be escalated, not silently created. Standard implementation scaffolding (test files, barrel exports, index files, CSS modules, framework-mandated boilerplate) is allowed without explicit upstream citation.

**First observed case:** Proposed in Phase 4 stabilization (2026-08-06) and scheduled for validation by the first execution test (F-030). No execution evidence yet — status **Proposed** until the execution test demonstrates conformance or exposes violations.

**Owner:** Implementation agents (frontend, backend, infrastructure), Execution Coordinator.

**Adoption encoding:** to be encoded in the frontend-implementation-agent prompt before the F-030 execution test (backend firewall, escalation gate, forbidden-invention list).

---

## Workflow Invariants (Phase 4 Stabilization)

Workflow-layer invariants govern the orchestration phases themselves — they belong to the framework, not to individual agents. Every implementation agent inherits them without redefining them. Discovered by the F-030 first execution test (governance-failure analysis, 2026-08-06). Status: **Proposed**.

### FI-W-001 — Execution Authorization

**Statement:** No workflow may enter an execution phase without an AUTHORIZED Execution Authorization verdict. If the verdict is NOT AUTHORIZED: zero writes, zero partial implementation, structured escalation only. The implementation agent consumes the authorization decision; it does not decide on its own authority whether it may proceed. The verdict's Filesystem section (Created/Modified/Deleted = 0) is the mechanically verifiable proof that the gate was enforced.

**First observed case:** F-030 first execution test. Execution governance allowed implementation to proceed despite an incomplete execution contract: the frontend implementation agent passed its readiness gate with two open contract items (missing PUT response contract; missing display_name validation constraints), wrote both components, and deferred — but never delivered — the required escalations. This was a governance failure, not an implementation failure: the agent did what LLMs naturally do (try to complete the task); the framework's gate was not authoritative enough to prevent it. See `docs/engineering/findings/F-030/F-030-execution-test-report.md` (Obs-F030-01 through Obs-F030-03).

**Evidence:** `docs/engineering/findings/F-030/F-030-execution-test-report.md`; `docs/engineering/execution-packages/F-030/package-T-F030-004.md` (constraints required escalation); written-then-archived evidence at `docs/engineering/findings/F-030/evidence/`.

**Owner:** Framework execution phase (Execution Coordinator, implementation agents).

**Adoption encoding:** hard Pre-Implementation Authorization step in `frontend-implementation-agent.md` (Step 4, verdict format with Filesystem Created/Modified/Deleted); applies to all current and future implementation agents.

---

## Current Status Summary

| ID | Name | Status | Phase | Adopted |
|---|---|---|---|---|
| FI-T-001 | Origin Preservation | Validated | Phase 2 | — |
| FI-T-002 | D2 — Metadata Agnostic | Validated | Phase 2 | — |
| FI-T-003 | B4 — No Silent Ambiguity | Validated | Phase 2 | — |
| FI-T-004 | Manifest Schema v1.0 | Validated | Phase 2 | — |
| FI-T-005 | Deterministic Artifact Locations | Validated | Phase 2 | — |
| FI-G-001 | Authority Precedence | Validated | Phase 3 | 2026-07-27 |
| FI-G-002 | Evidence Preservation | Validated | Phase 3 | 2026-07-27 |
| FI-G-003 | Decision Traceability | Validated | Phase 3 | 2026-07-27 |
| FI-G-004 | Explicit Scope Approval | Validated | Phase 3 | 2026-07-27 |
| FI-I-001 | Evidence-Based Architecture | Proposed | Phase 4 | 2026-08-06 |
| FI-I-002 | Semantic Artifact References | Proposed | Phase 4 | 2026-08-06 |
| FI-I-003 | Implementation Completeness | Proposed | Phase 4 | 2026-08-06 |
| FI-W-001 | Execution Authorization | Proposed | Phase 4 | 2026-08-06 |
