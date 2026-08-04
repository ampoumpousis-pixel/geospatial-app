# Governance Encoding — Agent Prompt Rules

## Purpose

This document encodes the governance invariants discovered during Phase 3 (F-002)
into actionable rules that orchestrators SHALL include when invoking agents.
This is the "Adopted" state of FI-G-001 through FI-G-004.

## Source

`docs/engineering/governance/framework-invariants.md` (FI-G-001 through FI-G-004)
`docs/engineering/findings/flight-test-retrospective.md` (Deep Dives 3-4, EAF Appendix)

---

## FI-G-001 — Authority Precedence

### Rule for Feature Planner prompts

When providing input to the Feature Planner (AGENT-102), the orchestrator SHALL:

1. **State the authoritative scope source explicitly.** If the operator command defines
   a scope boundary that differs from the catalogue entry, the operator scope SHALL
   take precedence. The orchestator SHALL include language such as:

   > "The operator-defined scope for this feature run is: [specific scope].
   > The catalogue entry at feature-catalog.md may describe a broader scope.
   > You SHALL NOT expand beyond the operator-defined scope unless explicitly
   > authorized. If you identify a gap between the operator scope and the
   > catalogue entry, document it as an EAF but do not spec beyond the
   > operator scope."

2. **If no operator scope is provided**, the catalogue entry is authoritative.

3. **If the planner identifies a legitimate need to expand scope**, they SHALL
   raise an EAF documenting the expansion opportunity. Scope expansion SHALL NOT
   be included in the feature specification without prior authorization.

### Rule for Human Gate prompts

When presenting the approval gate, the orchestrator SHALL include:

> "Does the feature specification match the operator-defined scope? If the scope
> has changed from the original operator input, this change must be explicitly
> acknowledged before approval."

---

## FI-G-002 — Evidence Preservation

### Rule for revision loops

When a revision loop is triggered (REVISIONS REQUIRED), the orchestrator SHALL
invoke `/lifecycle archive` for the current artifact before the revised version
is written. This ensures:

- The superseded version is preserved with `.archived` metadata
- The version chain remains reconstructable
- `/lifecycle trace` and `/lifecycle diff` can reference the original

### Rule for agents revising artifacts

Agents revising an artifact SHALL increment the version in the artifact metadata
(Section 1, Revision History). The orchestrator is responsible for archiving the
previous version.

---

## FI-G-003 — Decision Traceability

### Rule for agent-native signals

Agents SHALL:

- Prefix their decisions/signals with the appropriate identifier (EAF, TD, RC, SC, AD)
- Include the identifier in the artifact section heading
- Reference related identifiers in other sections where applicable

Orchestrators SHALL:

- Reference agent-native signals as evidence in validation observations
- Not rename or reclassify EAF/TD/RC/SC/AD signals in findings
- Trace the provenance chain in the retrospective

---

## FI-G-004 — Explicit Scope Approval

### Rule for Human Gate

The Human Approval Gate SHALL include a specific scope-acknowledgment step:

1. Present the operator-defined scope (from Step 0 or original command)
2. Present the feature specification scope (from feature-spec.md §10)
3. Ask the approver:

   > "Does the feature specification match the authorized scope, or has scope
   > been expanded? If scope has changed, do you authorize the new scope?"

4. Record the scope decision in the approval artifact

### Rule for Feature Planner

The Feature Planner SHALL include a "Scope Comparison" section in the feature
specification that explicitly lists:

- The operator-defined scope (or catalogue scope if no operator scope provided)
- The feature specification scope (what the spec actually covers)
- Any differences between them
- For each difference: "Authorized" or "Proposed as expansion (requires approval)"

---

## Technical Regression Verification

Encoding governance invariants SHALL NOT modify or weaken technical invariants.
The following checks SHALL be performed during Phase 3.5:

| Invariant | Verification |
|---|---|
| FI-T-001 | Manifest origin field preserved |
| FI-T-002 | Execution packages do not branch on origin type |
| FI-T-003 | Task Planner still returns DGRs on underspecified designs |
| FI-T-004 | Manifest schema validated against v1.0 |
| FI-T-005 | Artifact paths remain deterministic |
