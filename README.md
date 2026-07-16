# Engineering Operating System Guide

## Repository Philosophy

This repository is organized into four knowledge layers:

Company

↓

Rules

↓

Project Knowledge

↓

Implementation


---

# .company/

Purpose:

The identity and governance layer.

Contains:

COMPANY.md

Who we are.


PRINCIPLES.md

How we make decisions.


WORKFLOW.md

How work moves.


ROLES.md

Who does what.


VERSION.md

Current operating system version.


---

# docs/project/

Purpose:

Project-level truth.

Contains:


PROJECT_FACTS.md

"What is always true"

Stable facts:

- mission
- technologies
- architectural constraints
- core principles


Changes rarely.


---

PROJECT_SCOPE.md

"What we are building"


Defines:

- included functionality
- excluded functionality
- future possibilities


Protects against scope creep.


---

PROJECT_STATUS.md

"Where we are right now"


Changes frequently.

Contains:

- current phase
- active tasks
- blockers
- next actions


Updated after meaningful work.


---

PROJECT_GLOSSARY.md

"How we speak"


Defines:

- domain terms
- technical vocabulary
- abbreviations


Prevents misunderstandings.


---

# .ai-rules/

Purpose:

Permanent instructions for AI agents.

Contains:

- organization rules
- team conventions
- project-specific rules


---

# .ai-memory/

Purpose:

Agent continuity between sessions.

Contains:

- current state
- handoffs
- lessons
- errors


---

# .opencode/

Purpose:

AI execution layer.

Contains:

- agents
- commands
- workflows
- templates


---

# Golden Rule

Documentation ownership:

Company documents define governance.

Project documents define truth.

Memory documents define history.

Code defines implementation.

Agents must read the appropriate layer before acting.