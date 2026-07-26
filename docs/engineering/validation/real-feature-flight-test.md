# Real Feature Flight Test — F-002

Version: 1.0
Status: Prepared, pending execution

---

## Purpose

Validate that the engineering framework handles real product requirements while preserving the architectural invariants proven in Phase 2.

This is not a pass/fail replacement for Phase 2. It is a controlled observation framework.

---

## Finding Classification

Every observation must be assigned to exactly one primary category.

| Category | Question |
|----------|----------|
| `command-layer` | Did the workflow orchestration fail? |
| `agent-instruction` | Did an agent violate an explicit responsibility boundary? |
| `template-schema` | Did the framework lack a place to express a valid concept? |
| `validation-rule` | Was there behavior that should have been automatically prevented? |
| `human-gate` | Was a human decision missing, unclear, or too early/late? |
| `catalogue-accuracy` | Was the input itself inaccurate, outdated, or incomplete before entering the pipeline? |

### Category Detail

#### command-layer

**Question:** Did the workflow orchestration fail?

**Examples:**
- Human approval was bypassed.
- Pipeline stage was skipped.
- State transition was incorrect.

**Possible fixes:** command flow, state transitions, gate handling, artifact sequencing.

---

#### agent-instruction

**Question:** Did an agent violate an explicit responsibility boundary?

**Examples:**
- Task Planner used framework-pattern reasoning to bypass escalation (B4 class regression).
- Feature Planner made a technical decision.
- Technical Planner skipped contract declarations.

**Possible fixes:** agent prompt, responsibility definition, prohibited behaviors list.

---

#### template-schema

**Question:** Did the framework lack a place to express a valid concept?

**Examples:**
- Package metadata had no slot for work origin (D2 class finding).
- Assessment template missing a classification field.
- Review template missing a required analysis dimension.

**Possible fixes:** markdown template, JSON schema, artifact contract.

---

#### validation-rule

**Question:** Was there behavior that should have been automatically prevented?

**Examples:**
- Two manifest versions passed comparison without flagging drift.
- Parallel tasks with overlapping allowed writes not detected.
- Contract version mismatch not caught.

**Possible fixes:** test, assertion, lint rule, architecture check, automated gate.

---

#### human-gate

**Question:** Was a human decision missing, unclear, or too early/late?

**Examples:**
- Technical decision presented after implementation had started.
- Approval question asked about implementation detail instead of engineering decision.
- No gate existed where one was needed.

**Possible fixes:** approval boundary, decision template, escalation criteria.

---

#### catalogue-accuracy ⭐

**Question:** Was the input itself inaccurate, outdated, or incomplete before entering the pipeline?

**Examples:**
- Feature catalog entry references a model or service that doesn't exist yet.
- Dependencies listed in catalog are stale.
- Feature scope exceeds what the current codebase supports.

**Important distinction:** A stale roadmap entry is not a framework failure. The framework should survive inaccurate input — but the finding identifies where the pipeline absorbed ambiguity that product discovery should have resolved.

**Possible fixes:** update feature catalogue, improve product discovery process, split feature scope.

---

## Finding Severity

| Level | Label | Meaning | Action |
|-------|-------|---------|--------|
| F0 | Noise | No action needed. | None. Cosmetic improvement, wording preference. |
| F1 | Local improvement | Fix after current run. | Address in next feature cycle. |
| F2 | Architectural risk | Must fix before scaling. | Track as technical debt. Fix before adding more features or agents. |
| F3 | Invariant violation | **Hard stop.** | Stop the flight test immediately. An F3 means something the architecture was supposed to prevent has occurred — manifest leaking past escalation gate, execution proceeding on unapproved design, agent branching on `source.type`. Continuing produces contaminated evidence. |

### F3 Rule

An invariant violation is not "interesting data." Everything downstream of an F3 operates on a corrupted premise. The flight test must stop. The root cause must be identified and fixed before any further pipeline execution continues.

F0–F2 let the run continue. Observations are collected and resolved after the run.

---

## Finding Format

Every finding recorded during the flight test must use this structure:

```markdown
## Finding F002-XXX — Title

Category: [one of the six categories]
Severity: F0/F1/F2/F3
Evidence: [what happened, what was observed]
Resolution owner: [the role or agent responsible for a fix]
Status: Open / In Progress / Resolved
```

---

## F-002 Pre-Flight Watchlist

| Agent | Watch For | Tied To |
|-------|-----------|---------|
| Feature Planner | Product ambiguity converted into false sense of completeness | Catalogue-accuracy |
| Technical Planner | Unstated system boundary resolved without a recorded technical decision | Agent-instruction |
| Task Planner | Requirements ambiguity silently converted into implementation assumptions (B4 regression) | Agent-instruction |
| Execution Pipeline | Feature-specific metadata leaking into generic execution artifacts (D2 regression) | Template-schema |
| Human Gate | Implementation details presented as approval questions instead of unresolved engineering decisions | Human-gate |
| Catalogue | Feature definition itself as the source of ambiguity | Catalogue-accuracy |

---

## F-002 Scope

### Catalog Entry (unmodified — capture, do not edit)

```
F-002 — User and Group Management
```

### Flight Test Scope (defined during discovery)

```
User Management (scoped):
- List registered users
- View user profile / basic info
- Update own profile (display name, email)

Excluded:
- Group management
- Admin UI
- Auth changes
```

The difference between the catalog entry and the operational scope is itself evidence. If the platform has no group model, that is a `catalogue-accuracy` finding to record, not a problem to silently fix.

---

## Lifecycle Notes

During the F-002 flight test, maintain a running list at:
`docs/engineering/findings/lifecycle-notes.md`

Every time you think "I wish I could archive this" or "this artifact should disappear" or "this shouldn't be deleted because...", write it down. These become the requirements for the lifecycle system implemented after Phase 3.

---

## Phased Exit Criteria

Phase 3 is complete when:

- [ ] F-002 feature specification created
- [ ] Technical design produced
- [ ] Engineering review completed
- [ ] Human approval recorded
- [ ] Task manifest created
- [ ] Findings collected, classified by category and severity
- [ ] F3 violations (if any) resolved before further execution
- [ ] Lifecycle notes captured
- [ ] No Phase 2 invariants regressed
