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
| FI-G-001 | — | Proposed | Adopted | Validated |
| FI-G-002 | — | Proposed | Adopted | Validated |
| FI-G-003 | — | Proposed | Adopted | Validated |
| FI-G-004 | — | Proposed | Adopted | Validated |

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
