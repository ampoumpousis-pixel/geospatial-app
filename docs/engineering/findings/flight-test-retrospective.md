# F-002 Real Feature Flight Test — Retrospective

## Flight Test Context

| Field | Value |
|---|---|
| Pipeline version | Phase 2.1 |
| Validation baseline | 8/8 tests passed (2026-07-26) |
| Framework version | Phase 2 command layer |
| Execution date | 2026-07-27 |
| Preconditions | P-001 (F-001 ~10% implemented), P-002 (no Group model) |
| Constraint | C-001 (no subagent runtime — manual orchestration) |

## 1. Framework Layer Model

The flight test discovered that framework artifacts occupy five distinct layers. These are formalized here to explain how F-002 observations map to framework governance.

| Layer | Content | Examples from F-002 |
|---|---|---|
| Layer 1 — Product Inputs | Feature catalogue, operator command, ADRs | `feature-catalog.md` §37-49, flight-test scope definition |
| Layer 2 — Planning Artefacts | Agent-native signals produced during engineering work | EAF-F002-001 through EAF-F002-007, TD-F002-001 through TD-F002-007 |
| Layer 3 — Engineering Validation | Review findings and required changes | RC-F002-001, RC-F002-002, SC-F002-001, SC-F002-002, AD-F002-001 through AD-F002-003 |
| Layer 4 — Validation Observations | Framework observations classified by existing taxonomy | Six-category findings (command-layer, agent-instruction, etc.) |
| Layer 5 — Framework Governance | Invariants that future pipeline runs must preserve | FI-T-001 through FI-T-005, FI-G-001 through FI-G-004 |

The flow across layers:

```
Layer 1 — Product Inputs
    ↓
Layer 2 — Planning Artefacts (EAF, TD)
    ↓
Layer 3 — Engineering Validation (RC, SC, AD)
    ↓
Layer 4 — Validation Observations (findings)
    ↓
Layer 5 — Framework Governance (invariants)
```

## 2. Deep Dive 1 — Blocking Finding Review

Two blocking findings were identified during Engineering Review v1.0. Both were resolved through a revision loop, producing Technical Design v1.1 and Engineering Review v2.0.

### SC-F002-001 — Audit Event Transaction Boundary Contradiction

**Evidence:**
The sequence diagram in Section 13 of Technical Design v1.0 showed `INSERT AuditEvent` occurring before `COMMIT`, placing audit inside the database transaction. The narrative text in Section 17 stated audit was "best-effort and outside the transaction." CMP-F002-007 and ES-F002-007 also stated audit failure must not block the primary operation. The diagram and narrative contradicted each other.

**Impact:**
An implementer following the sequence diagram would place the audit INSERT inside the transaction. If the audit INSERT failed (e.g., database error), the entire transaction would roll back — including the user deactivation. This directly violated the stated best-effort audit behavior (ES-F002-007).

**Resolution:**
Technical Design v1.1 corrected both sequence diagrams (User Deactivation Flow, Role Assignment Flow) to show `COMMIT` occurring before `INSERT AuditEvent`. All API endpoint specifications (API-F002-004 through API-F002-010) were updated to consistently state audit events are recorded "after the transaction commits (best-effort, outside the transaction)."

**Interpretation:**
This was a real design correction. The revision changed implementation behavior — an implementer following v1.0 would have produced incorrect transaction handling. The review loop prevented an implementation defect from reaching the manifest.

### SC-F002-002 — System Role Name Update Protection Not Specified in API Contract

**Evidence:**
TD-F002-007 asserted "the role update API prevents changing the name of system roles" and TR-F002-004 relied on this protection as its primary mitigation. However, API-F002-009 (Role CRUD) did not document this constraint. The API specification listed delete protection for system roles but was silent on update restrictions.

**Impact:**
An implementer building the Role update endpoint from API-F002-009 would not know to add validation preventing system role name changes. If the Administrator role's name was changed via the API, the `IsAdministrator` permission class (which identifies the role by `name="Administrator"`) would break, potentially locking out all administrators or granting admin access to wrong users.

**Resolution:**
Technical Design v1.1 added an explicit "Update protection" paragraph to API-F002-009 documenting the constraint. The error contract was updated to include "system role name change attempt" as a 400 error condition.

**Interpretation:**
This was a contract completeness gap. The technical intent was present in TD-F002-007 but had not propagated to the API specification. The review enforced the TD-to-API contract propagation rule.

### Revision Loop Verdict

The review loop produced a genuine design correction (SC-F002-001 changed implementation behavior) and a contract completeness fix (SC-F002-002 propagated a decision to the API specification). Both issues were resolved in a single revision cycle. This confirms the Engineering Review stage is functioning as a design integrity gate, not a documentation ceremony.

```
Technical Design v1.0
    ↓
Engineering Review v1.0
    ↓
    └── RC-F002-001, RC-F002-002 (blocking)
    ↓
Technical Design v1.1 (revised)
    ↓
Engineering Review v2.0
    ↓
    └── Both findings resolved, recommendation: READY FOR APPROVAL
    ↓
Human Gate → APPROVED
    ↓
Task Manifest + Implementation Plan
```

---

## 3. Deep Dive 2 — Catalogue Accuracy

The F-002 catalogue entry at `feature-catalog.md` §37-49:

```
F-002 — User and Group Management
Administrative interface for managing users, groups, and roles.
Priority: P0 (Mandatory)
Dependencies: F-001
```

At execution time, the platform had a `User` model (Django AbstractUser) but no custom Group model, no Role model, and no RBAC infrastructure. Django's built-in `django.contrib.auth.models.Group` was available in the framework but was not wired into any app, URL, or API endpoint.

**Provenance chain:**

```
feature-catalog.md
    "User and Group Management"
    ↓
feature-spec.md §3 line 38
    "the platform currently has no Group model wired into the application"
    ↓
EAF-F002-001
    "Group Model Approach — evaluate whether to extend Django's built-in
     Group or create a new custom one"
    ↓
TD-F002-001
    Custom Group model in users app (not Django's built-in)
    ↓
AF-F002-001 (Engineering Review)
    "custom Group model decision is well-justified"
    ↓
This retrospective
```

**Ownership:**
The gap between catalogue description and platform reality is owned by **product roadmap accuracy**, not by the engineering framework. The pipeline correctly identified the gap (EAF-F002-001), propagated it to the Technical Planner (TD-F002-001), and the Technical Planner resolved it with an explicit architectural decision. No stage silently assumed Groups existed. No stage converted the product input problem into an engineering defect.

**Verdict:**
The framework correctly attributed the source of uncertainty. The gap was surfaced, documented, and resolved at the appropriate engineering layer.

---

## 4. Deep Dive 3 — Authority Precedence Discovery

### Evidence

Three authoritative inputs entered the pipeline simultaneously:

| Input | Source | Content |
|---|---|---|
| Catalogue | `feature-catalog.md` | "User and Group Management" — full scope including Groups and Roles |
| Operator command | `real-feature-flight-test.md` §165-177 | "User profile management only. Excluded: Group management, Admin UI, Auth changes" |
| Planner interpretation | Feature Planner's product discovery | "Catalogue scope is more authoritative" — implicit assumption |

**Observed result:**
The feature specification (`feature-spec.md`) expanded beyond the operator-defined flight-test scope. Goals G-F002-003 through G-F002-006 introduced Group CRUD, Role definition, role-permission association, and role assignment. User stories US-F002-004 through US-F002-006 described Group and Role management. The Technical Planner designed custom Group and Role models. The manifest contains 15 tasks covering full Group, Role, and user management — including the 8 tasks for Group/Role infrastructure explicitly excluded from the flight-test scope.

**The expansion propagated through four stages without encountering a governance checkpoint responsible for validating scope authority:**

| Stage | Action | Scope checkpoint? |
|---|---|---|
| Feature Planner | Specced full Groups + Roles | None — no precedence rule between catalogue and operator scope |
| Technical Planner | Designed custom Group model, Role model, admin endpoints | None — designed what the spec requested |
| Engineering Review | Reviewed internal consistency (SC-F002-001, SC-F002-002) | None — reviewed technical correctness, not scope boundaries |
| Human Gate | Approved the design | None — question was about engineering decisions, not scope |

### Interpretation

This was not an agent failure. The Feature Planner correctly surfaced the catalogue gap via EAF-F002-001. The Technical Planner correctly designed what was specified. The Engineering Review correctly identified internal inconsistencies. The Human Gate correctly validated technical coherence.

The failure mode is architectural, not behavioral:

```
Multiple valid authorities (catalogue, operator command, planner interpretation)
    ↓
No defined precedence rule
    ↓
Planner implicitly selects one (catalogue)
    ↓
Scope propagates uncontested
```

This is structurally identical to the B4 discovery:

| Case | Input conflict | Missing rule | Outcome |
|---|---|---|---|
| B4 | Ambiguous architecture | B4 — no silent architectural resolution | Task Planner guessed |
| F-002 | Conflicting scope authorities | **Authority Precedence** | Feature Planner guessed |

Both were cases of "agent had multiple legitimate inputs, framework had no rule, agent chose one."

### Conclusion

| Property | Verdict | Evidence |
|---|---|---|
| Transparency — did the pipeline expose the uncertainty? | **Passed** | EAF-F002-001 documented the Group model gap. Gap propagated through the full provenance chain. |
| Authority resolution — who was authorized to decide the scope? | **Missing from framework** | Three inputs with no precedence rule. Planner prioritized catalogue by default, not by design. |

### Governance Outcome

```
FI-G-001 — Authority Precedence

Whenever two or more authoritative inputs can influence the same planning
decision, the framework SHALL define their precedence before planning
begins. If no precedence exists, the planner SHALL escalate rather than
choose implicitly.

First observed case: catalogue scope vs operator-defined flight-test scope.
Generalizes to: roadmap vs ADR, command vs company policy, customer
request vs security policy, work item vs feature defaults.

Status: Proposed
```

---

## 5. Deep Dive 4 — Unexpected Findings

### Obs-F002-01 — Feature Planner Absorbed Catalogue Gap Into Full Scope Spec

**Transparency behaviour (passed):**
The Feature Planner detected the platform's missing Group/Role infrastructure and surfaced it via EAF-F002-001 through EAF-F002-007. The gap was never hidden. This is what the Pre-Flight Watchlist asked for: "Product ambiguity converted into false completeness — e.g., silently including group management because the catalog says so." The planner did not go fully silent.

**Authority behaviour (failed):**
Despite surfacing the gap, the Feature Planner expanded scope to match the catalogue's full ambition rather than staying within the operator-defined flight-test boundary. This is the Authority Precedence gap documented in Deep Dive 3.

**Recorded as:** Two independent observations feeding FI-G-001 (authority) and the existing transparency record.

### Obs-F002-02 — Role Model Extrapolation

The Feature Planner created a full Role model (name, description, permission set, user assignments) from the catalogue mentioning "roles." This is valid product discovery behavior — the catalogue said "roles," the planner elaborated what that might mean. Not a framework defect.

**Recorded as:** Product discovery behavior. No finding generated.

### Obs-F002-04 — Engineering Review Caught Blocking Inconsistencies

The review identified two real issues on first pass. Both were resolved in a single revision cycle. This confirms review integrity.

**Recorded as:** Positive observation. Candidate for automated validation: sequence-diagram-vs-narrative-text consistency checking (future test).

---

## 6. EAF Reconciliation Appendix

The Flight Test Findings taxonomy and the agent-native signal system are separate concepts that were distinguished during this flight test.

**Relationship:**

```
Agent-native signals (Layer 2, Layer 3)

EAF — Engineering Attention Flag (Feature Planner)
TD  — Technical Decision (Technical Planner)
RC  — Required Change (Engineering Reviewer)
SC  — Semantic Consistency finding (Engineering Reviewer)
AD  — Advisory (Engineering Reviewer)

    ↓ referenced by (not replaced by)

Validation observations (Layer 4)

Six-category taxonomy:
command-layer | agent-instruction | template-schema |
validation-rule | human-gate | catalogue-accuracy | unexpected

    ↓ analyzed into (not converted into)

Framework invariants (Layer 5)

FI-T-XXX technical | FI-G-XXX governance
```

**Rules:**
- EAFs are evidence. Findings are interpretations of behavior. Invariants are generalized rules derived from repeated observations.
- No automatic conversion: EAF ≠ Finding, TD ≠ Finding, RC ≠ Invariant.
- A validation observation may reference one or more agent-native signals as evidence.
- Agent-native signals may generate zero, one, or many findings depending on how downstream agents handle them.

**Example trace from F-002:**

```
EAF-F002-001 (Group Model Approach)
    → TD-F002-001 (custom Group model)
    → no finding (resolved cleanly)

EAF-F002-003 (Session Invalidation)
    → TD-F002-004 (database session deletion)
    → SC-F002-001 (transaction boundary contradiction)
    → FI-G-003 (Decision Traceability — provenance chain preserved)

EAF-F002-001 also
    → catalogue-accuracy observation (gap surfaced)
    → authority-precedence observation (scope still expanded despite gap)
    → FI-G-001 (Authority Precedence)
```

---

## 7. Orchestration Quality

### Successes

- **Deterministic artifact chain:** Every stage produced artifacts at predictable paths. No orchestrator needed to search for files.
- **No artifact hand-repair:** Every artifact was produced directly by the agent responsible for it. No manual correction.
- **No agent context leakage:** Each agent received its input from the preceding artifact, not from conversation history. The artifact chain carried all context.
- **Revision loop completed in one cycle:** REVISIONS REQUIRED → Technical Planner revised → Engineering Review re-reviewed → APPROVED. No loop escalation.
- **Human Gate boundary:** The approval question was about engineering scope and decisions, not about implementation details or serializer classes.

### Gaps

- **Superseded artifacts overwritten:** Technical Design v1.0 and Engineering Review v1.0 were replaced by v1.1 and v2.0 respectively. No archive exists. The only record of what v1.0 contained is the review narrative describing the findings.
- **Invariant checklist manually ticked:** Every stage transition required the orchestrator to manually verify invariants. No automated validation.
- **No automated provenance reconstruction:** Determining which artifacts were current vs superseded required reading version headers in each file.

These gaps feed FI-G-002 (Evidence Preservation) and inform the lifecycle command requirements.

---

## 8. Framework Invariants Registration

### Technical Invariants (Phase 2 — Validated)

| ID | Name |
|---|---|
| FI-T-001 | Origin Preservation — execution packages carry origin, not feature ID |
| FI-T-002 | D2 — execution package metadata is agnostic to origin type |
| FI-T-003 | B4 — Task Planner must not silently resolve architectural ambiguity |
| FI-T-004 | Manifest schema v1.0 conformance |
| FI-T-005 | Deterministic artifact locations |

### Governance Invariants (Phase 3 — Proposed)

| ID | Name | Status | Evidence |
|---|---|---|---|
| FI-G-001 | **Authority Precedence** — whenever two or more authoritative inputs can influence the same planning decision, the framework SHALL define their precedence before planning begins. If no precedence exists, the planner SHALL escalate rather than choose implicitly. | Proposed | Deep Dive 3 — catalogue scope vs operator-defined flight-test scope. |
| FI-G-002 | **Evidence Preservation** — superseded artifacts SHALL be archived, not overwritten. Version chains must be reconstructable. | Proposed | Orchestration Quality — v1.0 TD and v1.0 Review overwritten without archive. |
| FI-G-003 | **Decision Traceability** — agent-native signals (EAF, TD, RC, SC, AD) form a provenance chain. Validation observations SHALL reference them without renaming or duplicating them. | Proposed | EAF Reconciliation — the EAF-to-finding relationship was ambiguous until formalized in this retrospective. |
| FI-G-004 | **Explicit Scope Approval** — any scope change from operator-defined input SHALL appear as an explicit approval decision at the Human Gate. The gate SHALL validate both technical coherence and scope authority before approving. | Proposed | Deep Dive 3 — scope expansion transited four stages without a checkpoint. The Human Gate validated technical coherence but not scope boundaries. |

### Next Status Milestones

- **Phase 3.5** — Encode FI-G-001 through FI-G-004 into agent instructions, gate prompts, and lifecycle commands. **Promote: Proposed → Adopted.**
- **F-003** — Observe whether the adopted governance invariants change framework behavior under a new real feature. **Promote: Adopted → Validated** where evidence supports.
