# Flight Test Findings — F-002

## Flight Test Context

| Field | Value |
|---|---|
| Pipeline version | Phase 2.1 |
| Validation baseline | 8/8 tests passed (2026-07-26) |
| Framework version | Phase 2 command layer |
| Execution date | 2026-07-27 |

## Known Preconditions (recorded before execution)

### P-001 — F-001 Partially Implemented

F-001 (User Authentication) is approximately 10% implemented (3 of 31 tasks completed).
No backend API endpoints (views, serializers, permissions) exist. No frontend auth pages
or AuthContext exist. The platform has a User model, authService.ts stubs, and settings
configuration, but zero live auth endpoints.

**Expected behaviour:** The framework should surface this dependency gap rather than
silently working around it. Technical decisions that terminate early because required
auth infrastructure is missing should be explicitly recorded, not absorbed.

### P-002 — No Group Model

The platform has no `Group` model or RBAC infrastructure. Django's built-in
`django.contrib.auth.models.Group` exists in the framework but is not wired into
any app, URL, or API endpoint. The F-002 catalog entry references "User and Group
Management" that the platform cannot currently support.

**Expected behaviour:** The Feature Planner should encounter this gap during product
discovery. The gap should surface as a scope decision, not be silently ignored.

## Known Constraints

### C-001 — No Subagent Runtime

The engineering framework defines agents (AGENT-102 through AGENT-105) as conceptual
workflow actors. There is no automated subagent runtime — the orchestrator (me) emulates
each agent's role. This means the pipeline has no parallel dispatch, no automatic state
transitions, and no automated validation between stages.

**Impact on this flight test:** Every stage transition requires manual verification of
the invariant checklist. No stage can proceed until the orchestrator explicitly confirms
the previous stage's output passes invariant checks.

## Invariant Checklist (per-stage, with owners)

| Invariant | Owner | Verified |
|---|---|---|
| Origin preserved (`Feature:` not `Origin:`) | Command layer | □ |
| No execution branching on `source.type` | Execution Package Agent | □ |
| `TD-` technical decisions explicitly recorded | Technical Planner | □ |
| No architecture assumptions by Task Planner (B4) | Task Planner | □ |
| Manifest conforms to schema v1.0 | Task Planner | □ |
| Human gate reached exactly once | Workflow orchestration | □ |
| Execution packages origin-agnostic (D2) | Command layer | □ |
| All artefacts at deterministic locations | Command layer | □ |

---

## Finding Classification Categories

| Category | Question |
|---|---|
| `command-layer` | Did the workflow orchestration fail? |
| `agent-instruction` | Did an agent violate an explicit responsibility boundary? |
| `template-schema` | Did the framework lack a place to express a valid concept? |
| `validation-rule` | Was there behavior that should have been automatically prevented? |
| `human-gate` | Was a human decision missing, unclear, or too early/late? |
| `catalogue-accuracy` | Was the input itself inaccurate, outdated, or incomplete? |
| `unexpected` | Surprise observation not fitting any predefined category |
| `lifecycle` | Observation relevant to artifact lifecycle management |

---

## Step 1 — Feature Creation: Observations

### Obs-F002-01 — Feature Planner absorbed catalogue gap into full scope spec

| Field | Value |
|---|---|
| Category | catalogue-accuracy (with agent-instruction consideration) |
| Severity | F1 |
| Evidence | `feature-spec.md` §3 line 38 (gap identified) + full Group/Role spec |
| Observed behaviour | Planner identified "platform has no Group model, no Role concept" but produced full Group CRUD and Role management requirements without escalating the dependency gap as a potential blocker |
| Expected behaviour | Planner documents the gap as an engineering attention flag or scope note, preserving it for the Technical Planner to resolve |
| Resolution | Not a framework failure — the Feature Planner's job is product discovery, not engineering dependency resolution. The catalogue-accuracy finding (P-002) is the root cause. |

### Obs-F002-02 — Feature Planner introduced Role model not in catalog

| Field | Value |
|---|---|
| Category | Unexpected |
| Severity | F0 (noise) — note for observation only |
| Evidence | `feature-spec.md` §8, BR-F002-008 through BR-F002-012 |
| Observed behaviour | Planner created a full Role model (name, description, permission set, user assignments) despite the catalog mentioning "roles" only as a high-level concept. The Role model is an extrapolation from "roles" in the catalog description, not a direct requirement. |
| Expected behaviour | N/A — Roles could be a valid product discovery outcome. The planner extrapolated reasonably. |
| Resolution | None needed. Informational — the Technical Planner will decide whether roles are in scope. |

---

---

## Step 2 Phase A — Technical Design: Invariant Checklist

| Invariant | Owner | Verified | Notes |
|---|---|---|---|
| Origin preserved | Command layer | ✅ | Feature pipeline, no origin metadata |
| TD- decisions explicitly recorded | Technical Planner | ✅ | 7 TD decisions (TD-F002-001 through TD-F002-007) |
| No architecture assumptions by Task Planner (B4) | Task Planner | N/A | Task Planner not yet invoked |
| Human gate reached exactly once | Workflow orchestration | N/A | Phase C not yet reached |
| All artefacts at deterministic locations | Command layer | ✅ | `docs/engineering/technical-plans/F-002/technical-design.md` |

### Phase A Observations

**Obs-F002-03 — Technical Planner introduced custom Group model alongside Django's built-in**

| Field | Value |
|---|---|
| Category | Unexpected |
| Severity | F0 (noise) |
| Evidence | `technical-design.md` TD-F002-001, DM-F002-002 |
| Observed behaviour | Planner created a custom `users.Group` model that coexists with `django.contrib.auth.models.Group`. This creates a naming collision requiring explicit imports. |
| Expected behaviour | N/A — This is a valid technical decision with documented consequences. |
| Resolution | None needed. The consequence is documented in TD-F002-001. |

---

---

## Step 2 Phase B — Engineering Review: Observations

**Obs-F002-04 — Engineering Review correctly identified blocking inconsistencies**

| Field | Value |
|---|---|
| Category | Unexpected |
| Severity | F0 (noise) — framework working correctly |
| Evidence | `engineering-review.md` SC-F002-001, SC-F002-002 |
| Observed behaviour | Engineering Reviewer identified 2 blocking findings: (1) audit transaction boundary contradiction between sequence diagram and narrative text, (2) system role name update protection not documented in API spec. Reviewer issued REVISIONS REQUIRED. |
| Expected behaviour | N/A — This is the framework working as designed. The review process caught inconsistencies that would have caused implementation errors. |
| Resolution | None needed. The framework is functioning correctly. Proceed with revision loop per workflow. |

**Invariant Checklist Update (Phase B):**

| Invariant | Owner | Verified | Notes |
|---|---|---|---|
| Origin preserved | Command layer | ✅ | Feature pipeline, no origin metadata |
| TD- decisions explicitly recorded | Technical Planner | ✅ | 7 TD decisions documented |
| No architecture assumptions by Task Planner (B4) | Task Planner | N/A | Task Planner not yet invoked |
| Human gate reached exactly once | Workflow orchestration | N/A | Phase C not yet reached |
| All artefacts at deterministic locations | Command layer | ✅ | `docs/engineering/reviews/F-002/engineering-review.md` |

---

## Step 2 Phase D — Task Planning: Invariant Checklist

| Invariant | Owner | Verified | Notes |
|---|---|---|---|
| Origin preserved | Command layer | ✅ | Manifest uses `"origin": "Feature"` |
| TD- decisions explicitly recorded | Technical Planner | ✅ | 7 TD decisions in technical design v1.1 |
| No architecture assumptions by Task Planner (B4) | Task Planner | ✅ | 15 granular tasks, no framework-pattern shortcuts |
| Human gate reached exactly once | Workflow orchestration | ✅ | Engineering approval recorded |
| Manifest conforms to schema v1.0 | Task Planner | ✅ | `manifest_version: "1.0"`, all required fields present |
| All artefacts at deterministic locations | Command layer | ✅ | All F-002 artifacts at expected paths |

### Phase D Observations

**Obs-F002-05 — Task Planner preserved full complexity (B4 invariant holds)**

| Field | Value |
|---|---|
| Category | validation-rule (negative) |
| Severity | F0 — No finding |
| Evidence | `task-manifest.json` with 15 tasks, `implementation-plan.md` with 7 phases |
| Observed behaviour | Task Planner produced 15 granular tasks (8 backend, 7 frontend) with correct dependency chains, 3 verified parallel groups with disjoint write sets, and 42 design elements traced to tasks. |
| Expected behaviour | B4 regression would manifest as combining multiple independent concerns into single tasks. Did not occur. |

---

## Step 3 — Execution Flow Validation

### Manifest Structural Validation

| Check | Result | Notes |
|---|---|---|
| Manifest JSON well-formed | ✅ | Valid JSON schema |
| manifest_version is valid | ✅ | `"1.0"` |
| Every task has id, domain, executor, execution_type, files, allowed_writes, completion_criteria | ✅ | All 15 tasks complete |
| Contract dependency versions match Technical Design | ✅ | Contracts match TD v1.1 |
| Dependency graph is acyclic | ✅ | 6 chains, no cycles |
| All dependency task IDs exist in manifest | ✅ | All references valid |
| Parallel tasks have disjoint allowed_writes | ✅ | 3 parallel groups confirmed disjoint |

### D2 Invariant Check

| Check | Result | Notes |
|---|---|---|
| Manifest uses `"origin": "Feature"` | ✅ | Not `"Feature:"` |
| No `source.type` branching | ✅ | Not applicable at manifest level |
| Execution packages inherit origin correctly | ⚠️ Not executed | Packages not generated (implementation pending) |

**Obs-F002-06 — Execution pipeline did not run (scope note)**

| Field | Value |
|---|---|
| Category | Unexpected |
| Severity | F0 — scope clarification |
| Evidence | This flight test |
| Observed behaviour | The flight test validated the framework through the design flow (spec → design → review → approval → manifest). Execution of 15 implementation tasks (actual code writing) was deferred as it represents feature delivery, not framework testing. |
| Expected behaviour | The framework supports execution through the `exec-flow` pipeline. The Validate phase confirmed the manifest is structurally sound. The Package/Run/Review phases would produce execution packages and dispatch to implementation agents when triggered. |

---

## Finding Severity

| Level | Meaning | Action |
|---|---|---|
| F0 | Noise | None. Cosmetic. |
| F1 | Local improvement | Fix after current run. |
| F2 | Architectural risk | Track as technical debt. Fix before scaling. |
| F3 | Invariant violation | **Hard stop.** |
