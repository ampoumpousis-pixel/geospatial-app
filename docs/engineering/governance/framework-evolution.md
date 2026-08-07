# Framework Evolution Log

## Purpose

Changelog for the engineering framework itself. Records when invariants were
proposed, adopted, and validated. Future contributors can trace why any
framework rule exists without reading every retrospective.

## Version History

| Version | Source | Date | Changes |
|---|---|---|---|
| v1.0 | Phase 2 | 2026-07-26 | **Technical invariants established and validated.** FI-T-001 through FI-T-005 proven by Phase 2 validation suite (8/8 tests passed). |
| v1.1 | F-002 Flight Test | 2026-07-27 | **Governance invariants proposed.** FI-G-001 through FI-G-004 discovered during F-002 flight test. See `docs/engineering/findings/flight-test-retrospective.md`. |
| v1.2 | Phase 3.5 | 2026-07-27 | **Governance invariants adopted.** FI-G-001 through FI-G-004 encoded into Feature Planner prompts (`feature-create.md`), Human Gate prompts (`feature-design-flow.md`), governance encoding rules (`governance-encoding.md`), and lifecycle commands (`lifecycle-archive.md`, `lifecycle-trace.md`, `lifecycle-status.md`, `lifecycle-diff.md`). |
| v1.3 | F-003 Flight Test | 2026-08-05 | **Governance invariants validated.** FI-G-001 through FI-G-004 promoted to Validated on real-run evidence from the F-003 flight test. F-003 provided the positive control for the governance model: the same authority-conflict pressure that broke F-002 was forced to become a visible decision. Full per-invariant evidence in §"v1.3 Validation Evidence". Report: `docs/engineering/findings/F-003/F-003-flight-test-report.md`. |
| v1.4 | Phase 4 Validation | 2026-08-06 | **Frontend Integration Invariant proposed.** FI-I-001 (Reuse Evidence) proposed by the Phase 4 validation of the Frontend Integration Planner pipeline. The F-022 and F-023 flight tests (positive controls) demonstrated that the planner verifies codebase evidence before declaring reuse and correctly distinguishes new-surface from existing-surface features. Evidence: `docs/engineering/validation/phase-4-validation.md`, `docs/engineering/findings/F-022/`, `docs/engineering/findings/F-023/`. Phase 4 also surfaced F1 framework-encoding gaps (authority-map read, Scope Comparison template, FIP section references, reviewer source-inspection permission, work-path permissions) and one F2 gap (work path `/work:escalate` Step A2 not functional with live agents). |
| v1.5 | Phase 4 Stabilization | 2026-08-06 | **Stabilization pass before the first execution test.** (1) FI-I-001 renamed Reuse Evidence → **Evidence-Based Architecture Invariant** (applies to any agent consuming project artifacts, not just frontend). (2) **FI-I-002 — Semantic Artifact References** proposed and encoded (A1): FIP, reviewer, and task-planner agent files now reference upstream sections by heading semantics, not position numbers (fixes Obs-F022-04). (3) **FI-I-003 — Implementation Completeness** proposed for validation by the F-030 execution test: implementation decisions must trace to upstream artifacts or explicit standards; new architecture escalates. (4) Execution metrics defined (architectural inventions, backend source reads, silent assumptions, clarifications raised, boundary violations). (5) Deferred: formal Execution Readiness Validation phase (shared across implementation agents) and the work-path `/work:escalate` re-test (permission fix applied; requires a new runtime session). |
| v1.6 | F-030 First Execution Test | 2026-08-07 | **Execution governance failure → Execution Authorization invariant.** The first execution-milestone test (F-030 — User Display Name) validated the planning pipeline but FAILED on the primary behavior under test: execution governance allowed implementation to proceed despite an incomplete execution contract. The frontend implementation agent passed its readiness gate with two open contract items (missing PUT response contract; missing display_name validation constraints), implemented both components, and deferred the required escalations — a governance failure, not an implementation failure (the agent behaved as LLMs naturally do; the gate was not authoritative). Findings: `docs/engineering/findings/F-030/F-030-execution-test-report.md` (Obs-F030-01..05). **Actions:** (1) **FI-W-001 — Execution Authorization** proposed as a workflow-layer invariant (framework-owned gate: NOT AUTHORIZED → zero writes, structured escalation only; mechanically verifiable Filesystem Created/Modified/Deleted = 0). (2) Frontend implementation agent hardened: hard Pre-Implementation Authorization step (Step 4) replaces soft validate text; verdict format with derived escalation owners per issue. (3) Step budget 15→30. (4) Orphaned components archived to `docs/engineering/findings/F-030/evidence/`. (5) F-030 promoted to a permanent 3-rung execution regression benchmark (2 ambiguities → must block; 1 → must block; 0 → must implement). |

## Invariant Lifecycle Tracking

### Technical (Phase 2)

| Invariant | v1.0 | v1.1 | v1.2 | v1.3 |
|---|---|---|---|---|
| FI-T-001 | Validated | — | — | — |
| FI-T-002 | Validated | — | — | — |
| FI-T-003 | Validated | — | — | — |
| FI-T-004 | Validated | — | — | — |
| FI-T-005 | Validated | — | — | — |

### Governance (Phase 3)

| Invariant | v1.0 | v1.1 | v1.2 | v1.3 |
|---|---|---|---|---|
| FI-G-001 | — | Proposed | Adopted | Validated | — |
| FI-G-002 | — | Proposed | Adopted | Validated | — |
| FI-G-003 | — | Proposed | Adopted | Validated | — |
| FI-G-004 | — | Proposed | Adopted | Validated | — |

### Frontend Integration (Phase 4)

| Invariant | v1.0 | v1.1 | v1.2 | v1.3 | v1.4 | v1.5 | v1.6 |
|---|---|---|---|---|---|---|---|
| FI-I-001 | — | — | — | — | Proposed (as Reuse Evidence) | Proposed (renamed Evidence-Based Architecture) | Proposed |
| FI-I-002 | — | — | — | — | — | Proposed | Proposed |
| FI-I-003 | — | — | — | — | — | Proposed | Proposed |

### Workflow (Phase 4 Stabilization)

| Invariant | v1.0 | v1.1 | v1.2 | v1.3 | v1.4 | v1.5 | v1.6 |
|---|---|---|---|---|---|---|---|
| FI-W-001 | — | — | — | — | — | — | Proposed |

## v1.3 Validation Evidence

Per-invariant evidence from the F-003 flight test. Each entry names the artifact a
future reader can open to verify the promotion — no need to re-derive the chain.

| Invariant | Evidence | Behavioural Claim |
|---|---|---|
| FI-G-001 — Authority Precedence | `docs/project/features/F-003/authority-map.md` (precedence declared pre-run); `feature-spec.md` §10, §17 (EAF-F003-001), §22 (Scope Comparison); `engineering-approval.md` §2-3 | The catalogue/operator metadata conflict was forced to become a visible decision (EAF + recorded operator resolution HD-F003-001), not silently resolved by the planner — the exact F-002 failure mode inverted |
| FI-G-002 — Evidence Preservation | `docs/engineering/archive/F-003/engineering/technical-plans/F-003/` (TD v1.0 + `.archived`); `docs/engineering/archive/F-003/engineering/reviews/F-003/` (Review v1.0 + `.archived`); `/lifecycle diff F-003 td v1.0 v1.1` output | A natural revision loop (2 genuine review findings) preserved the full version chain — archive before overwrite executed; chain reconstructable |
| FI-G-003 — Decision Traceability | `/lifecycle trace F-003` output (product input → spec → TD v1.0→v1.1 → review v1.0→v2.0 → approval → manifest); native signal IDs (EAF/TD/SC) preserved across artifacts | Provenance chain reconstructable from artifacts alone; the framework preserves why a decision existed, not just the final state |
| FI-G-004 — Explicit Scope Approval | `engineering-approval.md` §2 (scope comparison table), §3 (approval questions); gate presentation (operator vs spec scope, authorization question) | The Human Gate validated both technical coherence AND scope authority — the F-002 gate gap closed |

## Evidence Index

| Version | Evidence Source |
|---|---|
| v1.0 | Phase 2 validation suite (8/8 tests) |
| v1.1 | F-002 flight test retrospective (`docs/engineering/findings/flight-test-retrospective.md`) |
| v1.2 | Phase 3.5 Governance Verification (`docs/engineering/governance/governance-encoding.md`) |
| v1.3 | F-003 flight test (`docs/engineering/findings/F-003/F-003-flight-test-report.md`; per-invariant evidence in §"v1.3 Validation Evidence") |
