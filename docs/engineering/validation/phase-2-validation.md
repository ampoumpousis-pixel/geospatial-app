# Phase 2 — Command Layer Validation

Version: 1.0
Status: Pending
Purpose: Validate the four architectural invariants of the command layer before proceeding to real feature implementation.

---

## Phase 2 Exit Criteria

Phase 2 is complete when all of the following are true:

- ✅ Pipeline Health Check passes.
- ✅ Feature Regression passes without changes to the existing feature workflow.
- ✅ Work Lifecycle passes for a Level 1 work request.
- ✅ Escalation Gate correctly prevents Level 3 work from entering execution.
- ✅ Complexity Routing correctly classifies Level 1, Level 2 and Level 3 work.
- ✅ Manifest Equivalence confirms feature- and work-originated manifests differ only in permitted metadata.
- ✅ Execution Equivalence confirms identical execution behaviour regardless of origin.
- ✅ Negative Architecture Test confirms no origin-specific branching exists in the execution layer.

Success criterion: The engineering platform exposes two independent planning entry points (Feature and Work) that converge into a single, origin-agnostic execution pipeline.

---

## Platform Limitation

The current subagent runtime does not reliably honour updated JSON file write permissions after agent definition changes. As a result, AGENT-105 (Task Planner) embeds the generated `task-manifest.json` content in `implementation-plan.md`, and the command layer extracts it into the canonical JSON artifact. This is a runtime constraint rather than an architectural limitation and affects both Feature and Work pipelines equally.

All task-manifest.json artifacts referenced in this validation suite are produced via this extraction pattern unless otherwise noted.

---

## Invariants Under Test

1. **Two entry points** — Feature and Work request paths exist and produce compatible knowledge.
2. **One convergence point** — Task Planner (AGENT-105) accepts both inputs and produces the same artifact format.
3. **One execution pipeline** — Downstream agents (Package Generator, Coordinator, Developer Agents, Reviewer) are origin-agnostic.
4. **One escalation path** — Complex work escalates to Technical Design rather than leaking into execution.

---

## Test Structure

Each test follows this schema:

```markdown
## Test [ID] — [Title]

**Primary Invariant:** [The invariant being validated]

**Purpose:** [What behaviour is being proven]

**Failure Impact:** [Why failure matters — what operation breaks]

**Preconditions:** [What must be true before running]

**Steps:**
1. [Exact command + input]
2. [Next command + input]

**Expected Results:**
- [Observable outcome]
- [Observable outcome]

**Pass Criteria:** [Minimum conditions for PASS]

**Status:** ⬜ PENDING / ✅ PASS / ❌ FAIL
**Date:**
**Evidence:**
**Observations:**
```

---

## 0. Pipeline Health Check

**Primary Invariant:** Environment is known-good before any test runs.

**Purpose:** Eliminate false failures caused by stale state or missing infrastructure.

**Failure Impact:** Test failures cannot be trusted — they may be caused by environment issues, not architectural defects.

### Steps

1. Verify required agents exist:
   - `.opencode/agents/planning/feature-planner.md`
   - `.opencode/agents/planning/technical-planner.md`
   - `.opencode/agents/planning/task-planner.md`
   - `.opencode/agents/review/code-reviewer-agent.md`
   - `.opencode/agents/review/engineering-approval-gate.md`
   - `.opencode/agents/review/engineering-approval-review.md`
   - `.opencode/agents/development/execution-coordinator-agent.md`
   - `.opencode/agents/development/execution-package-agent.md`

2. Verify required command files exist:
   - `.opencode/commands/feature-create.md` (CMD-200)
   - `.opencode/commands/feature-design-flow.md` (CMD-210)
   - `.opencode/commands/feature-exec-flow.md` (CMD-211)
   - `.opencode/commands/work-create.md` (CMD-212)
   - `.opencode/commands/work-execute.md` (CMD-213)
   - `.opencode/commands/work-escalate.md` (CMD-214)
   - `.opencode/commands/status.md` (CMD-207)

3. Verify governance documents exist:
   - `.company/command-registry.md`
   - `.company/engineering-workflow.md` (with origin-agnostic execution rule + command gate rule)

4. Verify no stale execution state exists for test IDs:
   - `docs/engineering/execution-state/F-002.json` should not exist
   - `docs/engineering/execution-state/W-001.json` should not exist
   - `docs/engineering/execution-state/W-002.json` should not exist
   - `docs/engineering/execution-state/W-003.json` should not exist

5. Verify AGENT-105 (Task Planner) contains Work path:
   - Has read permission for `docs/project/work/*/work-request.md`
   - Has edit permission for `docs/project/work/*/assessment.md`
   - Has `mkdir -p` for `W-*` directories
   - Contains Work Input Path section with Level 1/2/3 classification

### Pass Criteria

Health check runs without errors or warnings. All required files exist. No stale state for test IDs.

---

## 1. Test C — Feature Regression

**Primary Invariant:** Two entry points — the existing feature pipeline is unchanged.

**Purpose:** Confirm that the new command layer does not break the proven Phase 1 feature workflow.

**Failure Impact:** The existing feature pipeline is broken. No feature can progress from spec to manifest. Phase 1 work is invalidated.

### Preconditions

- F-002 exists in `docs/project/planning/feature-catalog.md`
- Pipeline Health Check passes

### Steps

1. Create the feature specification:
   ```
   /feature:create F-002 User and Group Management
   ```

2. Run the full design flow:
   ```
   /feature:design-flow F-002
   ```

3. At the human approval gate, approve the design.

### Expected Results

- `docs/project/features/F-002/feature-spec.md` created (by AGENT-102)
- `docs/engineering/technical-plans/F-002/technical-design.md` created (by AGENT-103)
- `docs/engineering/reviews/F-002/engineering-review.md` created (by AGENT-104)
- `docs/engineering/approvals/F-002/engineering-approval.md` created (by Approval Gate)
- `docs/engineering/task-plans/F-002/task-manifest.json` created (by AGENT-105)
- `docs/engineering/task-plans/F-002/implementation-plan.md` created (by AGENT-105)
- Manifest uses `manifest_version: "1.0"` format (feature-standard)
- Task IDs use `T-F002-NNN` naming
- All four pipeline stages completed in order
- No errors, no skipped steps

### Pass Criteria

The feature pipeline produces exactly the same artifact chain as F-TEST-001 (Phase 1 validation). The new command layer does not interfere with the existing flow.

---

## 2. Test A — Work Lifecycle

**Primary Invariant:** Two entry points — standalone work enters the engineering pipeline.

**Purpose:** Prove a work request can enter the system without a feature spec or technical design.

**Failure Impact:** Standalone work cannot enter the engineering pipeline. The system only handles features. Everyday operational changes have no path into the execution engine.

### Preconditions

- Pipeline Health Check passes
- No `docs/project/work/W-001/` directory exists

### Steps

1. Create the work request:
   ```
   /work:create Change button hover colour from #ccc to #2563eb
   ```

2. Execute the work:
   ```
   /work:execute W-001
   ```

### Expected Results

**Step 1 — Create:**
- `docs/project/work/W-001/work-request.md` created
- Directory `docs/project/work/W-001/` created
- Artifact contains: Metadata (W-001), Intent, Expected Outcome, Scope, Acceptance Criteria
- No assessment, no manifest, no packages created yet
- Console confirms W-001 ID and suggests `/work:execute W-001`

**Step 2 — Execute:**
- `docs/project/work/W-001/assessment.md` created
- Assessment shows Level 1 classification
- Level determination table populated (single domain, ≤3 files, no contract changes)
- `docs/engineering/task-plans/W-001/task-manifest.json` created
- Manifest uses `manifest_version: "1.1"`
- `source.type` is `"work"`, `source.id` is `"W-001"`
- Exactly 1 task with `id: "T-W001-001"`
- Task executor: `frontend-implementation-agent`
- Execution pipeline triggers: packages generated, coordinator dispatches
- Review completes

### Pass Criteria

A work request entered the system, was assessed, produced a valid manifest, and was dispatched through the execution pipeline — all without a feature spec or technical design.

---

## 3. Test E — Escalation Gate

**Primary Invariant:** One escalation path — complex work routes through Technical Design.

**Purpose:** Confirm that Level 3 work correctly escalates and does not leak into execution.

**Failure Impact:** Complex work that needs architecture decisions enters execution without design. Developer agents make architecture choices they should not.

### Preconditions

- Pipeline Health Check passes
- No `docs/project/work/W-003/` directory exists

### Steps

1. Create a complex work request:
   ```
   /work:create Replace session-based authentication with JWT tokens
   ```

2. Execute (expect escalation):
   ```
   /work:execute W-003
   ```

3. Escalate through the full engineering pipeline:
   ```
   /work:escalate W-003
   ```

### Expected Results

**Step 1 — Create:**
- `docs/project/work/W-003/work-request.md` created normally.

**Step 2 — Execute (Level 3):**
- `assessment.md` created with Level 3 classification
- Level determination table shows:
  - Auth/security change: Yes
  - API contract change: Yes
  - Multiple domains affected: Yes
- **No task-manifest.json created**
- **No execution packages created**
- Console output: `Work Escalated — Level 3`
- Escalation detail section populated in assessment
- Next step: `/work:escalate W-003`

**Step 3 — Escalate:**
- `docs/engineering/technical-plans/W-003/technical-design.md` created (AGENT-103)
- `docs/engineering/reviews/W-003/engineering-review.md` created (AGENT-104)
- `docs/engineering/approvals/W-003/engineering-approval.md` created (Approval Gate)
- `docs/engineering/task-plans/W-003/task-manifest.json` created (AGENT-105)
- Manifest carries `source.type: "work"`, `source.id: "W-003"`
- Console confirms escalation complete, ready for `/work:execute W-003`

### Pass Criteria

Level 3 work is blocked at the assessment phase. No execution artifacts are created until the escalation pipeline completes. The manifest retains work-origin metadata.

---

## 4. Test B — Complexity Routing

**Primary Invariant:** One convergence point — Task Planner correctly classifies complexity.

**Purpose:** Validate the Task Planner's complexity classification engine produces the correct routing decision for Level 1, Level 2, and Level 3 work.

**Failure Impact:** The Task Planner misroutes work:
- Simple work escalates unnecessarily (wasted engineering cycles)
- Complex work executes without design (architecture decisions made by developer agents)

### Preconditions

- Pipeline Health Check passes
- No `docs/project/work/W-001/`, `W-002/`, `W-003/` directories exist (use different IDs if running alongside Test A and E)

### Steps

Three sub-tests:

**B.1 — Level 1 (Direct):**
```
/work:create Change colour of the submit button from green to blue
/work:execute W-004
```
Expect: 1 task, `frontend-implementation-agent`, no escalation.

**B.2 — Level 2 (Planned):**
```
/work:create Add CSV export button to the resource list with download dialog
/work:execute W-005
```
Expect: Multiple tasks (component + integration), single domain (frontend), no escalation.

**B.3 — Level 3 (Escalate):**
```
/work:create Add support for multiple authentication providers (Google, GitHub)
/work:execute W-006
```
Expect: Assessment only. Auth changes, integration changes, architecture decisions. Escalate.

### Expected Results

**B.1:**
- assessment.md: Level 1
- Manifest: 1 task
- No escalation

**B.2:**
- assessment.md: Level 2
- Manifest: 2+ tasks
- All tasks same domain
- Dependency graph resolved
- No escalation

**B.3:**
- assessment.md: Level 3
- No manifest
- Escalation detail with affected contracts

### Pass Criteria

All three sub-tests produce the correct classification. The Task Planner's decision engine distinguishes simple, planned, and architecture-level work without false positives or false negatives.

---

## 5. Test D1 — Manifest Structural Equivalence

**Primary Invariant:** One execution pipeline.

**Purpose:** Confirm that feature-originated and work-originated manifests share an identical structural contract.

**Failure Impact:** The execution pipeline must branch on format differences. Feature and work work items require separate handling — the system has secretly become two execution paths.

### Preconditions

- Test C (Feature Regression) has generated a feature manifest at `docs/engineering/task-plans/F-002/task-manifest.json`
- Test A (Work Lifecycle) has generated a work manifest at `docs/engineering/task-plans/W-001/task-manifest.json`

### Steps

1. Read both manifests.
2. Compare all structural fields.

### Comparison

| Field | Feature Manifest | Work Manifest | Equivalent? |
|-------|-----------------|---------------|-------------|
| `manifest_version` | `"1.0"` | `"1.1"` | ✅ Different version allowed |
| `source` | Not present (uses `source_versions`) | Present with `type:"work"` | ✅ Different structure allowed |
| `feature` | Present with `id: "F-002"` | Not present | ✅ Allowed — origin metadata differs |
| `tasks` array | Present | Present | ✅ Must match |
| `tasks[].id` | `T-F002-NNN` | `T-W001-NNN` | ✅ Prefix differs by design |
| `tasks[].domain` | backend/frontend/etc | frontend | ✅ Values differ, structure identical |
| `tasks[].executor` | agent name | agent name | ✅ Structure identical |
| `tasks[].execution_type` | implementation/etc | implementation | ✅ Structure identical |
| `tasks[].retry_limit` | 1 | 1 | ✅ Must match |
| `tasks[].summary` | string | string | ✅ Structure identical |
| `tasks[].description` | string | string | ✅ Structure identical |
| `tasks[].files` | array of paths | array of paths | ✅ Structure identical |
| `tasks[].allowed_writes` | array of globs | array of globs | ✅ Structure identical |
| `tasks[].contracts` | array of contract refs | may be empty | ✅ Contracts optional for work |
| `tasks[].dependencies` | array of task IDs | array of task IDs | ✅ Structure identical |
| `tasks[].design_refs` | references technical-design.md | references work-request.md | ✅ Source differs, structure identical |
| `tasks[].completion_criteria` | array of criteria | array of criteria | ✅ Structure identical |

### Pass Criteria

The two manifests differ only in the permitted fields:
- `manifest_version` (1.0 vs 1.1)
- `source` vs `source_versions` + `feature`
- `design_refs` content (source document reference)
- `contracts` (may be empty for work)
- Task ID prefixes (F vs W)

All structural fields in the `tasks[]` entries are identical in format, type, and schema.

---

## 6. Test D2 — Execution Behaviour Equivalence

**Primary Invariant:** One execution pipeline.

**Purpose:** Confirm that running both manifests through the execution pipeline produces identical behaviour at every stage — packaging, state transitions, agent dispatch, and review.

**Failure Impact:** Even though the manifests look structurally similar, the execution pipeline treats work-originated tasks differently. Two diverging execution systems exist.

### Preconditions

- Test D1 passes (manifests are structurally equivalent).
- Both manifests have gone through execution:
  - Feature manifest from Test C has completed `/feature:exec-flow F-002`
  - Work manifest from Test A has completed `/work:execute W-001` (Level 1 direct execution)

### Steps

1. Compare execution state schemas for F-002 and W-001.
2. Compare execution package structure and required fields.
3. Compare the developer agent experience: does the package format differ?
4. Compare the code reviewer input: does the review package differ?

### Expected Results

- Execution Package Agent generates packages with identical structure (same sections, same required fields).
- Execution Coordinator creates state files with identical schema.
- Developer agents receive identical package structures (the content differs by task, but the format is the same).
- Code Reviewer receives identical review input structures.
- Only differences: origin metadata in the package header (source.type, source.id).

### Pass Criteria

The execution lifecycle is identical for both origins. Any difference in package structure, state schema, agent input format, or review format is a failure of origin-agnostic execution.

---

## 7. Negative Architecture Test

**Primary Invariant:** One execution pipeline — enforced by policy.

**Purpose:** Confirm there is zero origin-specific branching in the execution layer. This is an architectural lint test.

**Failure Impact:** The execution layer has become origin-aware. A future agent may alter its behaviour based on whether work came from a feature or a work request, undoing the convergence architecture.

### Preconditions

- Pipeline Health Check passes

### Steps

1. Search the execution layer for forbidden patterns.

**Scope (execution layer only — not planning):**
- `.opencode/agents/development/execution-coordinator-agent.md`
- `.opencode/agents/development/execution-package-agent.md`
- `.opencode/agents/development/backend-implementation-agent.md`
- `.opencode/agents/development/frontend-implementation-agent.md`
- `.opencode/agents/development/infrastructure-implementation-agent.md`
- `.opencode/agents/review/code-reviewer-agent.md`
- `.ai-execution/execution-framework.md`
- `.ai-execution/execution-package.md`

**Forbidden patterns (case-insensitive):**
- `source.type`
- `if source`
- `origin type`
- `if feature`
- `if work`
- `origin-specific`
- `branch on`

### Expected Results

Zero matches for any forbidden pattern in the execution layer.

Any match is a design violation — the agent must be made origin-agnostic.

### Pass Criteria

No origin-specific branching exists in the execution layer. The execution layer is completely origin-agnostic by static analysis.

---

## 8. Automation Candidates

After manual validation passes on real features, automate the deterministic checks:

| Check | Type | Priority |
|-------|------|----------|
| Manifest JSON schema validation | Automated | High |
| Execution state JSON schema validation | Automated | High |
| Required artifact existence per pipeline stage | Automated | Medium |
| No `source.type` branching in execution agents | Static lint | High |
| Directory structure matches ID convention (F-XXX → correct paths) | Automated | Medium |
| Task ID naming convention (T-FXXX-NNN, T-WXXX-NNN) | Automated | Low |

The following should remain manual:

- Complexity classification accuracy (judgment-based)
- Escalation decision correctness (judgment-based)
- Quality of generated task decompositions (judgment-based)
- Engineering review outcomes (judgment-based)

---

## Validation Summary

**Phase 2 Exit Criteria** — run this after all tests complete:

| Test | Status | Date |
|------|--------|------|
| 0. Pipeline Health Check | ✅ PASS | 2026-07-26 |
| 1. Test C — Feature Regression | ✅ PASS | 2026-07-26 |
| 2. Test A — Work Lifecycle | ✅ PASS | 2026-07-26 |
| 3. Test E1 — Prevention Gate | ✅ PASS | 2026-07-26 |
| 4. Test E2 — Escalation Pipeline | ✅ PASS | 2026-07-26 |
| 5. Test B — Complexity Routing | ✅ PASS WITH FINDING → RESOLVED | 2026-07-26 |
| 6. Test D1 — Execution Contract Equivalence | ✅ PASS | 2026-07-26 |
| 7. Test D2 — Execution Layer Independence | ✅ PASS WITH FINDING → RESOLVED | 2026-07-26 |
| 8. Negative Architecture Test | ✅ PASS | 2026-07-26 |

**All tests passed:** ✅ **8/8**

**Phase complete:** ✅ **Phase 2 validated**

**Known limitations:**
- AGENT-105 cannot write `task-manifest.json` directly due to subagent permission caching. JSON is embedded in `implementation-plan.md` and extracted by the command layer. See `docs/engineering/constraints/subagent-permission-runtime.md` for details.

### B4 Finding — Resolved

**Test:** B4 — Boundary Ambiguity (W-TEST-006)

**Initial result:** The Task Planner classified ambiguous work (API availability unspecified) as Level 2 using framework-pattern reasoning: "Django REST Framework normally handles this pattern." This violated the conservative escalation rule.

**Root cause:** The Ambiguity Escalation Rule was missing from task-planner.md. The agent was not explicitly forbidden from inferring missing architectural facts from framework knowledge.

**Resolution:**
1. Ambiguity Escalation Rule added to task-planner.md — requirements ambiguity is Level 3 when resolving it requires assuming a system boundary
2. Test 18 strengthened — explicit forbidden reasoning patterns (framework knowledge, repository inspection, common patterns)
3. Test 21 (counter-test) added — non-architectural vagueness does NOT escalate
4. Classification Source Assertion added to assessment template — reasoning must identify source of classification

**Re-run result:** ✅ Level 3. Assessment documents: "Requirements ambiguity: Yes — API availability is unspecified." No manifest, no execution artifacts.

**Counter-test (Test 21) result:** ✅ Level 2. Loading spinner ambiguity correctly flagged as implementation discretion.

**Lesson:** This was a governance constraint, not an agent logic failure. The classification engine works correctly when the policy boundary is explicit and testable.

### D1 Finding — Execution Contract Equivalence

**Result:** ✅ PASS

All four manifests (F-TEST-002, W-TEST-001, W-TEST-002, W-TEST-004):
- Share `manifest_version: "1.0"` — no version drift
- Have identical task object structures (all 13 required fields present)
- Differ only in permitted metadata: `source.type`, `source.id`, `design_refs`, `contracts` (empty for work), task ID prefixes

Schema version agreement confirmed. No path can silently emit a version the other rejects.

### D2 Finding — Execution Layer Independence

**Result:** ✅ PASS WITH FINDING → RESOLVED

The Execution Package Agent was tested with both a feature-origin manifest (F-TEST-002) and a work-origin manifest (W-TEST-004).

**Behavioral finding:** The package generator does NOT branch on `source.type` for execution behavior.

**Metadata finding — RESOLVED:** The template previously had a `Feature:` field that mislabeled work-origin tasks. This was replaced with an `Origin:` block containing `type` and `id`. Verification confirmed:

- Template layer: Zero remaining `Feature:` fields in `execution-package.md`
- Generated artifact layer: `Origin:` with `type: feature|work` and `id: F-XXX|W-XXX`
- Independence layer: Negative Architecture Test confirms no `origin.type` branching in execution agents

The metadata header is now origin-agnostic. Origin is data carried through execution, not a control signal.

### Negative Architecture Test

**Result:** ✅ PASS

Searched 14 files across the execution layer (development agents, review agents, .ai-execution framework) for origin-specific branching patterns: `source.type`, `if work`, `if feature`, `origin-specific`, `branch on`.

14/14 files clean. One false positive in engineering-approval-review.md ("If source inspection is not permitted" — refers to code source inspection, not manifest origin type).

**Conclusion:** The execution layer has zero origin-specific branching. Any future agent that introduces `if source.type` branching would be detected by this static check.

**Evidence location:**

**Observations:**
