# Command: Initialize Project

Version:

1.2


Command ID:

CMD-001


Purpose:

Initialize or continue a project discovery cycle by coordinating the virtual software company.

This command transforms project ideas, existing knowledge, and business goals into a validated project blueprint.

The command does not write production code.

The result is:

- validated project understanding
- requirements foundation
- system analysis
- architecture blueprint
- delivery roadmap


---

# First Execution Rule

IMPORTANT:

This is the first execution of the AI company.

Operate interactively.

Before producing final artifacts:

- inspect existing project knowledge
- ask clarification questions
- identify assumptions
- validate understanding

Do not invent missing business information.

Do not start implementation.


---

# When To Use

Use this command when:

- starting a new project
- onboarding the AI company to an existing project
- validating an early concept
- preparing a project before implementation


Do not use this command for:

- feature implementation
- bug fixes
- small technical changes


---

# Core Principle

Agents are joining an existing organization.

They must:

- read existing knowledge first
- preserve valuable information
- improve documents incrementally
- maintain historical decisions
- avoid unnecessary complexity


Never recreate project knowledge from zero if documents already exist.


---

# Command Owner

Agent:

```

project-director

```


The Project Director coordinates the workflow and ensures the correct work happens in the correct order.


Responsibilities:

- manage discovery workflow
- coordinate specialist agents
- protect project quality
- maintain project direction
- approve transition between phases


---

# Execution Model

The command follows:


```

Review Existing Knowledge

↓

Understand Project

↓

Ask Questions

↓

Create Execution Plan

↓

Human Approval

↓

Generate / Update Documents

↓

Verify Outputs

↓

Update Memory

```


During the first execution:

The agent must wait for approval before modifying project documentation.


---

# Phase 0 — Knowledge Review

Owner:

Project Director


Before starting discovery:

Read:


```

.company/

.ai-rules/

.ai-memory/

docs/project/

docs/architecture/

docs/adr/

```


Review:

- existing project facts
- project scope
- previous decisions
- current status
- known risks
- existing requirements


Output:

A summary of current project understanding.


---

# Document Preservation Rules

Before modifying any document:


1. Check if the document already exists.
2. Read and understand existing content.
3. Preserve confirmed information.
4. Add new knowledge only when justified.
5. Never silently remove historical decisions.


If information conflicts:

Record:

- conflict
- affected document
- possible resolution
- required decision


---

# Assumption Management

Agents must separate:

Facts

from

Assumptions.


When information is inferred:


Record:

```

Assumption:

Reason:

Validation Needed:

Impact If Wrong:

```


Assumptions must never be presented as confirmed requirements.


---

# Phase 1 — Project Direction

Agent:

```

project-director

```


Responsibilities:

- understand project goals
- validate objectives
- establish scope
- identify stakeholders
- define success criteria
- identify constraints
- define initial roadmap direction


Owned Documents:


```

docs/project/

PROJECT_FACTS.md

PROJECT_SCOPE.md

PROJECT_STATUS.md

```


---

## PROJECT_FACTS.md

Purpose:

"What is always true"


Maintain:

- confirmed facts
- constraints
- important assumptions
- foundational decisions


Rules:

- preserve existing facts
- append confirmed knowledge
- do not remove history silently


---

## PROJECT_SCOPE.md

Purpose:

"What we are building"


Maintain:

- goals
- boundaries
- included capabilities
- excluded capabilities
- project vision


---

## PROJECT_STATUS.md

Purpose:

"Where we are now"


Maintain:

- completed work
- current activities
- blockers
- risks
- next actions


---

# Phase 2 — Requirements Discovery

Agent:

```

requirements-analyst

```


Responsibilities:

Discover:

- users
- personas
- problems
- business goals
- capabilities
- user stories
- acceptance criteria
- success criteria


Owned Documents:


```

docs/project/requirements/

personas.md

user-stories.md

acceptance-criteria.md

success-criteria.md

```


Rules:

Do not create personas from assumptions without marking them clearly.

Validate:

- who uses the system
- why they use it
- what success means


---

# Phase 3 — System Analysis

Agent:

```

system-analyst

```


Responsibilities:


Analyze:

- system behavior
- actors
- workflows
- functional requirements
- non-functional requirements
- operational expectations


Owned Documents:


```

docs/analysis/

functional-requirements.md

non-functional-requirements.md

use-cases.md

workflows.md

diagrams/

```


Non-functional analysis should consider:

- users and concurrency
- data volumes
- performance
- availability
- security
- retention
- operational constraints


---

# Phase 4 — Architecture Design

Agent:

```

solution-architect

```


Responsibilities:

Create:

- system architecture
- domain model
- component boundaries
- integration design
- deployment direction
- technical decisions


Owned Documents:


```

docs/architecture/

system-overview.md

domain-model.md

component-design.md

diagrams/

```


---

# Diagram Management

Before creating diagrams:

1. Check existing diagrams.
2. Preserve useful diagrams.
3. Improve when needed.
4. Create new diagrams only when valuable.


Preferred format:

Mermaid.


Examples:

- system context
- component diagrams
- workflows
- deployment diagrams


---

# Architectural Decisions

Location:


```

docs/adr/

```


Rules:

- important decisions require ADRs
- ADRs are historical records
- old decisions are preserved
- changes require explanation


---

# Phase 5 — Project Planning

Owner:

Project Director


Collaborators:

- Requirements Analyst
- Solution Architect


Purpose:

Transform requirements and architecture into an executable delivery roadmap.


Create or update:


```

docs/project/planning/

roadmap.md

feature-catalog.md

milestones.md

task-board.md

trace-bullets.md

```


---

# Feature Definition

Each feature contains:


- feature ID
- name
- description
- business value
- related requirements
- acceptance criteria
- priority
- dependencies
- risks
- status


---

# Trace Bullet Strategy

Identify risky unknowns first.


A trace bullet is:

A minimal end-to-end implementation proving a complete system path.


Example:


```

User

↓

Frontend

↓

API

↓

Database

↓

External System

↓

Verification

```


Purpose:

- validate assumptions
- discover technical limitations early
- reduce implementation risk


---

# Documentation Minimalism

Create only documents that provide value.


Avoid:

- duplicate information
- unnecessary reports
- repeated explanations


Prefer:

One authoritative document

over

multiple overlapping documents.


---

# Quality Gate

The command is complete only when:


## Project

✓ Goals understood

✓ Scope documented

✓ Success criteria defined

✓ Assumptions identified


## Requirements

✓ User stories exist

✓ Acceptance criteria exist

✓ Unknowns identified


## Analysis

✓ Functional requirements exist

✓ Non-functional requirements considered

✓ Workflows documented


## Architecture

✓ System boundaries defined

✓ Major components identified

✓ Risks documented

✓ ADRs created where needed


## Planning

✓ Features identified

✓ Roadmap created

✓ Milestones defined

✓ Trace bullets identified


---

# Memory Update

Before completion update:


```

.ai-memory/current-state.md

.ai-memory/handoff.md

```


Include:


- current project state
- completed phases
- created documents
- decisions made
- unresolved questions
- recommended next action


Do not mark discovery complete if important questions remain open.


---

# Failure Handling

If any phase cannot complete:


Do not continue silently.


Record:


- failed phase
- reason
- missing information
- required decision


---

# Expected Result

After successful execution:


```

Existing Project Knowledge

↓

Validated Project Direction

↓

Requirements Foundation

↓

System Understanding

↓

Architecture Blueprint

↓

Feature Roadmap

↓

Ready For Development Planning

```


---

# Golden Rule

Do not build software before understanding the problem.

The purpose of this command is to create the foundation that allows future agents to build correctly.