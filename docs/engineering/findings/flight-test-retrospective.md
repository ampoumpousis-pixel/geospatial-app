# F-002 Flight Test — Retrospective

## Experiment Context

| Field | Value |
|---|---|
| Pipeline version | Phase 2.1 |
| Validation baseline | 8/8 tests passed (2026-07-26) |
| Preconditions | P-001 (F-001 ~10% implemented), P-002 (no Group model) |
| Constraint | C-001 (no subagent runtime — manual orchestration) |
| Execution date | 2026-07-27 |

## Architecture Held?

**Yes.** All Phase 2 invariants preserved throughout the F-002 run:

| Invariant | Owner | Status |
|---|---|---|
| Origin preserved | Command layer | ✅ |
| No execution branching on `source.type` | Execution Package Agent | ✅ (N/A at design level) |
| `TD-` decisions explicitly recorded | Technical Planner | ✅ 7 TD decisions |
| No architecture assumptions by Task Planner (B4) | Task Planner | ✅ 15 granular tasks, no shortcuts |
| Manifest conforms to schema v1.0 | Task Planner | ✅ |
| Human gate reached exactly once | Workflow orchestration | ✅ |
| Execution packages origin-agnostic (D2) | Command layer | ✅ (manifest level) |
| All artefacts at deterministic locations | Command layer | ✅ |

## Framework Confidence

| Pipeline Stage | Confidence | Evidence |
|---|---|---|
| Feature Planning | High | Correctly identified catalogue gap (no Group model). Produced comprehensive spec with Human Decisions. |
| Technical Planning | High | 7 TD decisions with alternatives, 14 engineering scenarios, complete API/data model/runtime contracts. |
| Engineering Review | High | Caught 2 blocking inconsistencies (audit transaction boundary, API contract gap) on first pass. |
| Task Planning | High | 15 granular tasks, 7-phase execution plan, 3 verified parallel groups, no B4 regression. |
| Human Gate | Functional | Approval recorded. Gate question was about engineering scope, not implementation detail. |
| Execution Pipeline | Not tested | Implementation of 15 tasks deferred (feature delivery, not framework test). |

## Provenance Note

F-002 is the first feature produced by the validated engineering pipeline that integrates with **pre-framework code**. F-001 was planned before the pipeline matured and was only partially implemented (~10%), without a canonical task manifest. Therefore, a successful F-002 demonstrates that the framework can integrate safely with existing code (the User model, authService.ts stubs). It does **not** yet demonstrate a fully pipeline-produced dependency chain, where upstream and downstream features are both generated through the validated workflow.

## Framework Improvements Needed

| ID | Improvement | Source | Priority |
|---|---|---|---|
| FI-001 | Formalize "No finding" outcome tracking — capture when a watch item is inspected and confirmed clean | Obs-F002-03, Obs-F002-05 | F1 |
| FI-002 | Taxonomy gap: "Unexpected" category was used for valid-but-surprising observations. Consider formal sub-categories within "unexpected" | Obs-F002-02 | F1 |
| FI-003 | Revision loop produces superseded artifacts (TD v1.0, Review v1.0) that need lifecycle management (archive/purge) | Step 2 revision loop | F2 |
| FI-004 | B4 and D2 invariants are trivially satisfied at design/manifest level. They require execution-level testing to be meaningful | Obs-F002-06 | F2 |

## Unexpected Behaviour

| ID | Observation | Significance |
|---|---|---|
| UB-001 | Feature Planner silently included full Group/Role scope despite catalogue gap, rather than escalating it as a product discovery blocker | Low — Feature Planner's job is to produce a spec, not manage scope risk |
| UB-002 | Engineering Review caught 2 blocking issues on first pass — the review process is working correctly | Positive — confirms review integrity |
| UB-003 | The revision loop (REVISIONS REQUIRED → revise → re-review → APPROVED) completed in a single iteration | Positive — issues were localized and easily fixed |

## Lifecycle Requirements Extracted

The following lifecycle needs were observed during the flight test. These will become inputs for lifecycle command design.

| ID | Observation | Candidate Command | Evidence |
|---|---|---|---|
| LC-001 | Revision loop created TD v1.0 which was superseded by v1.1. The v1.0 artifact is no longer needed but persists. | `/lifecycle archive` | TD v1.0 remains on disk after v1.1 replaces it |
| LC-002 | Engineering Review v1.0 was invalidated when TD was revised. Review v2.0 replaced it. | `/lifecycle archive` | Review v1.0 is superseded |
| LC-003 | No mechanism to know which artifact versions are "current" vs "superseded" without reading each file's metadata | `/lifecycle status` | Discovery during revision loop |
| LC-004 | Artifacts from different pipeline stages reference each other by version. If a reader finds v1.0 first, they don't know v1.1 exists | `/lifechain trace` | Required manual version chain inspection |
| LC-005 | Feature spec was never revised — it's the stable contract. Only downstream artifacts were revised. | `/lifecycle diff` | Revision loop modified TD and Review but not spec |

## Governance Rules Confirmed

The following governance rules were exercised and confirmed correct:

1. **Revision loop invalidation chain:** Design revision → invalidates review → requires re-review. Confirmed: AGENT-103 revised → AGENT-104 re-reviewed → second review supersedes first.
2. **Approval chain validation:** AGENT-105 validated all predecessor artifacts before producing manifest. Confirmed.
3. **Human gate boundary:** The approval question was about engineering scope and decisions, not implementation details. Confirmed.
4. **B4 prohibition:** Task Planner did not use framework-pattern assumptions to downgrade complexity. Confirmed.

## Feature Findings Transfer

Product-level observations from the flight test are captured in `docs/engineering/findings/feature-findings.md`.
Framework-level findings are captured in `docs/engineering/findings/flight-test-findings.md`.
Engineering decisions are captured in `docs/project/features/F-002/decision-log.md`.

## Next Priorities

1. ✅ **0 F3 violations** — architecture holds. Proceed with lifecycle command implementation.
2. Implement `/lifecycle archive`, `/lifecycle unarchive`, `/lifecycle purge` based on LC-001 through LC-005.
3. Run F-003 (Resource Upload) to continue stress-testing the pipeline with a different feature domain.
4. Move lifecycle requirements from evidence collection to command implementation spec.
