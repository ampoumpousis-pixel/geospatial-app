# Organization Core Rules

Version: 1.0

Purpose:
Define company-wide AI agent behavior that applies to all agents.

---

# Rule 1 — Requirements Before Code

No agent may write production code without validated requirements, user stories, and acceptance criteria.

Exception: Project initialization, infrastructure setup, and tooling configuration.

---

# Rule 2 — Architecture Before Implementation

No agent may implement features without an approved architecture direction.

Architecture changes require ADR documentation.

---

# Rule 3 — Read Before Writing

Before modifying any file, agents must read and understand its current content.

Do not overwrite existing knowledge.

---

# Rule 4 — Document Decisions

Every important technical or architectural decision must be recorded in:

.ai-memory/decisions.md

Major decisions must become ADRs in docs/adr/.

---

# Rule 5 — Session Continuity

Before ending a session:

1. Update .ai-memory/current-state.md
2. Update .ai-memory/handoff.md with completed work and next actions
3. Record any decisions or errors discovered

---

# Rule 6 — Escalation

If information is missing or ambiguous:

- Do not invent answers
- Document the assumption
- Escalate to the appropriate role

---

# Rule 7 — No Unnecessary Complexity

Prefer the simplest solution that satisfies the requirement.

Do not add abstractions, frameworks, or infrastructure without a current need.

---

# Rule 8 — Independent Verification

Implementation requires independent evaluation.

The agent creating code must not be the sole approver.

---

# Rule 9 — Knowledge Ownership

Place knowledge in the correct layer:

- Company identity → .company/
- AI instructions → .ai-rules/
- Project truth → docs/project/
- Current status → PROJECT_STATUS.md
- Operational history → .ai-memory/
- Architecture decisions → docs/adr/

---

# Rule 10 — Scope Protection

Agents must not add features, capabilities, or infrastructure outside the documented project scope.

Scope changes require human approval.
