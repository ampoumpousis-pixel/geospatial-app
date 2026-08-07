# F-022 Flight Test Report — Frontend Integration Planner (Cross-Cutting Surface)

## 1. Metadata

| Field | Value |
|---|---|
| Flight Test | F-022 — User Notifications |
| Date | 2026-08-06 |
| Purpose | Validate the Frontend Integration Planner on a cross-cutting, multi-surface feature (new pages + app-shell integration + permissions + state) |
| Invariants Under Test | FI-I-001 (Reuse Evidence, proposed), FIP pipeline (Phase A2, two-track, DGR routing), FI-G-001/002/003/004 regression |
| Report Status | Final |

## 2. Test Design

- Vehicle: **F-022 — User Notifications** (real feature, isolated, Test priority, planning-only).
- Operator scope declared pre-run in `docs/project/features/F-022/authority-map.md` (FI-G-001).
- Deliberate trap: the spec's product context names "existing" product areas (header, settings, dashboard) that do NOT exist in the minimal frontend scaffold. The FIP must verify and declare them new (FI-I-001), never fabricate reuse.
- Assertions split: **Must pass** (surfaces identified, existing/new correctly classified, artifact generated, traceability, Task Planner consumption, no invented reuse) vs **Observed** (state-ownership quality, hierarchy quality, naming — recorded, not failures).

## 3. Baseline

- Frontend scaffold: single `/` route in `App.tsx`, `SystemInfo.tsx`, `apiClient.ts`, `authService.ts`, `theme.ts`, `main.tsx` (React Query provider). NO header, NO settings, NO dashboard.
- No `docs/engineering/frontend-integration/` directory before the run.

## 4. Pipeline Run

| Stage | Result | Evidence |
|---|---|---|
| AGENT-102 | PASS | spec v1.0, `Has User-Facing Surface: Yes`, Ready for Technical Planning |
| AGENT-103 | PASS | TD v1.0, 7 decisions, 6 APIs, 3 models, 3 contracts, contract boundary declared |
| FIP | PASS | frontend-integration v1.0: 3 pages (2 new, 1 modified), 2 new routes, 10 components (9 new, 1 modified, 0 fabricated) |
| AGENT-104 | PASS | review v1.0 READY FOR APPROVAL, 0 blocking, Phase 4.5 executed |
| Gate | PASS | APPROVED; scope comparison (FR-F022-001 expansion authorized); boundary question (AppHeader/AppLayout) confirmed; version lock includes FIP 1.0 |
| AGENT-105 | PASS | 17 tasks; `source_versions.frontend_integration: "1.0"`; 9 frontend tasks trace to FIP IDs |

## 5. Assertion Verdicts

### Must pass
- **Surfaces identified** — VALIDATED (root modified; Notification Center + Preferences new)
- **Existing vs new correctly classified** — VALIDATED (AppHeader/AppLayout declared NEW with codebase verification; no fabricated "existing header")
- **Artifact generated** — VALIDATED (16-section artifact at deterministic path)
- **Traceability maintained** — VALIDATED (UI Behaviour Matrix covers all FR/AC; 6/6 APIs mapped; permission gated)
- **Task Planner consumes artifact** — VALIDATED (manifest FIP pin + FIP ID references on all frontend tasks)
- **No invented code reuse** — VALIDATED (reuse candidates: apiClient, authService, theme, SystemInfo, React Query provider — all real, with concrete reasons)

### Observed (quality signals)
- State ownership: central `NotificationSyncService` owns unread count/list/preferences; page cursor + draft toggles are page/form-local. Matches TD CMP-F022-006.
- Tooling boundary: framework-aware, not implementation-prescriptive. React Query named only as an existing reused capability.

## 6. Findings

| ID | Category | Severity | Status |
|---|---|---|---|
| Obs-F022-01 | template-schema / validation-rule | F1 | Feature Planner cannot read `authority-map.md` (FI-G-001 encoding unreadable by live planner) → fix: add read permission |
| Obs-F022-02 | template-schema | F1 | Feature Planner template lacks FI-G-004 "Scope Comparison" section → fix: add to template |
| Obs-F022-03 | template-schema | F1 | `.gitignore` omits `docs/engineering/frontend-integration/` → fix |
| Obs-F022-04 | template-schema | F1 | FIP hardcodes TD §10/§16/§8; actual TD is §11/§17/§9 (Contract Boundary Declaration shifts sections) → fix: make references section-name-based |
| Obs-F022-05 | template-schema | F1 | Reviewer permission denies `platform/**` read → cannot independently verify FIP reuse claims (FI-I-001 enforcement gap) → fix: add read permission |
| Obs-F022-06 | agent-instruction | F0 | Positive control: FIP verified spec's "existing" claims and declared surfaces new (no fabrication) |

## 7. Invariant Verdicts (regression)

| Invariant | Verdict |
|---|---|
| FI-G-001 Authority Precedence | PASS — operator scope declared; planner respected catalog scope; one authorized expansion surfaced at the gate (FR-F022-001 generation mechanism) |
| FI-G-002 Evidence Preservation | PASS — exercised in Test 5: FIP v1.0 archived with `.archived` metadata before v1.1 |
| FI-G-003 Decision Traceability | PASS — EAF/TD/API/CMP/FD IDs preserved across artifacts; lifecycle-traceable |
| FI-G-004 Explicit Scope Approval | PASS — gate presented scope comparison + differences + boundary question; recorded in approval |
| FI-T-001..005 | PASS — no technical-invariant regression (origin-agnostic, manifest schema, deterministic paths) |
| FI-I-001 Reuse Evidence (proposed) | **POSITIVE CONTROL** — planner verified codebase before declaring reuse; zero fabricated reuse |

## 8. Conclusion

**PASS.** The cross-cutting feature produced a trustworthy frontend architecture artifact. The pipeline's success criterion (artifact trustworthiness, not LLM design quality) was met. Findings are F0/F1 framework-encoding gaps; none invalidate the artifact.

## 9. Next Steps

- Fix F1 findings (permission blocks, template Scope Comparison, .gitignore, section-name references).
- Validate the version-mismatch/two-track/DGR paths (Tests 4–6) — see phase-4-validation.md.
