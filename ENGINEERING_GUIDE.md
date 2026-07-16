# GeoSpatial Platform Engineering Guide

Version:

1.0


Purpose:

Explain the organization of the repository and how humans and AI agents should use each knowledge layer.

This document is the entry point for understanding the engineering environment.

---

# Repository Philosophy

The repository is organized into knowledge layers.


Company Governance

↓

AI Rules

↓

Project Knowledge

↓

Project Memory

↓

Implementation

↓

Verification


Each layer has a different purpose.

Agents should read the appropriate layer before acting.

---

# Knowledge Architecture

## .company/

Purpose:

The company governance layer.

Contains the identity, principles, workflow, and roles of the virtual software company.

This layer changes slowly.


Structure:


.company/

COMPANY.md

PRINCIPLES.md

WORKFLOW.md

ROLES.md

VERSION.md



## COMPANY.md

Purpose:

"Who we are"

Defines:

- company identity
- mission
- operating model
- engineering philosophy


---

## PRINCIPLES.md

Purpose:

"How we behave"

Defines:

- engineering values
- decision principles
- quality expectations
- AI collaboration rules


---

## WORKFLOW.md

Purpose:

"How work moves"

Defines:

- development lifecycle
- phases
- quality gates
- completion criteria


---

## ROLES.md

Purpose:

"Who does what"

Defines:

- agent responsibilities
- authority boundaries
- escalation rules


---

# docs/project/

Purpose:

The project knowledge layer.

Contains information specific to the GeoSpatial Resource Platform.

This layer describes the system being built.


Structure:


docs/project/

PROJECT_FACTS.md

PROJECT_SCOPE.md

PROJECT_STATUS.md

PROJECT_GLOSSARY.md


---

## PROJECT_FACTS.md

Purpose:

"What is always true"


Contains:

- mission
- technologies
- architecture constraints
- fundamental decisions


Characteristics:

- stable
- rarely changed
- trusted by all agents


---

## PROJECT_SCOPE.md

Purpose:

"What we are building"


Contains:

- included functionality
- excluded functionality
- future possibilities


Protects against:

- scope creep
- unnecessary complexity


---

## PROJECT_STATUS.md

Purpose:

"Where we are right now"


Contains:

- current phase
- active tasks
- blockers
- completed milestones
- next actions


Characteristics:

- frequently updated
- operational document


---

## PROJECT_GLOSSARY.md

Purpose:

"How we speak"


Contains:

- domain definitions
- technical vocabulary
- shared terminology


Prevents:

- ambiguous interpretation
- inconsistent agent reasoning


---

# .ai-rules/

Purpose:

The permanent instruction layer for AI agents.

Contains:

- organization rules
- coding standards
- security rules
- technology conventions
- project-specific instructions


Rules are hierarchical:


Organization Rules

↓

Team Rules

↓

Project Rules

↓

Task Rules


---

# .ai-memory/

Purpose:

The long-term memory system.

AI sessions are temporary.

Memory preserves continuity.


Contains:


current-state.md

handoff.md

decisions.md

errors.md

lessons-learned.md


---

## current-state.md

Current system understanding.

Example:

- completed features
- active architecture
- known limitations


---

## handoff.md

Session transition document.

Before an agent finishes work it records:

- what was done
- what remains
- next action


---

## errors.md

Known failure patterns.

Example:

"All React pages were missing loading states."

Solution:

"Always use shared AsyncState component."


Purpose:

Prevent repeating mistakes.


---

# .opencode/

Purpose:

AI execution layer.

Contains:

- agent definitions
- commands
- workflows
- templates
- automation


Example:


.opencode/

agents/

commands/


---

# Agent Reading Order

Before starting work, agents should read:

ENGINEERING_GUIDE.md
.company/
.ai-rules/
docs/project/
.ai-memory/
Assigned task

---

# Documentation Ownership

| Information | Location |
|-|-|
| Company identity | .company |
| Engineering principles | .company |
| Project truth | docs/project |
| Current progress | PROJECT_STATUS.md |
| Permanent AI instructions | .ai-rules |
| Session continuity | .ai-memory |
| Agent definitions | .opencode |
| Implementation | source code |

---

# Golden Rule

Do not put information in the wrong layer.

Examples:

Bad:

Architecture decision in memory only.

Good:

Architecture decision → ADR.

Memory records that the decision exists.

---

Bad:

Temporary bug fix rule in project facts.

Good:

Bug prevention rule → .ai-rules.

---

Bad:

Current task status in glossary.

Good:

Current task status → PROJECT_STATUS.md.

---

# Final Principle

The repository is not only code.

It is the shared operating environment of humans and AI agents.

Good structure creates good decisions.