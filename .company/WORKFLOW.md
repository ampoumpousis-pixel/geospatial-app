# GeoSpatial Platform Engineering Workflow

Version:

1.0

Purpose:

Define the standard lifecycle used to transform ideas into verified software.

Every feature, regardless of size, follows this workflow unless explicitly approved otherwise.

---

# Overview

The company follows a structured engineering lifecycle:

```

Idea

↓

Discovery

↓

Requirements

↓

Architecture

↓

Planning

↓

Trace Bullet

↓

Implementation

↓

Evaluation

↓

Knowledge Update

↓

Completed Feature

```

---

# Phase 0 — Project Initialization

Purpose:

Create the engineering environment before development begins.

Activities:

- initialize project structure
- create documentation system
- establish rules
- define project facts
- configure agent environment

Outputs:

```

.company/

.ai-rules/

.ai-memory/

docs/project/

```

Owner:

Initializer Agent

---

# Phase 1 — Discovery

Purpose:

Understand the problem before designing solutions.

Questions:

- Who are the users?
- What problem are we solving?
- Why does this system need to exist?
- What outcomes define success?

Activities:

- stakeholder analysis
- user identification
- domain exploration
- business goals discovery

Outputs:

```

VISION.md

PERSONAS.md

USER_JOURNEYS.md

SUCCESS_CRITERIA.md

```

Owner:

Requirements Agent

---

# Phase 2 — Requirements Definition

Purpose:

Translate user needs into clear system behavior.

Activities:

- functional requirements
- non-functional requirements
- user stories
- acceptance criteria
- BDD scenarios
- edge cases

Every requirement should answer:

"What should the system do?"

Outputs:

```

FUNCTIONAL_REQUIREMENTS.md

NON_FUNCTIONAL_REQUIREMENTS.md

USER_STORIES.md

ACCEPTANCE_CRITERIA.md

```

Owner:

Requirements Agent

---

# Phase 3 — Architecture

Purpose:

Design the solution before implementation.

Activities:

- domain modeling
- system boundaries
- database design
- API design
- security design
- deployment design
- technology decisions

Outputs:

```

SYSTEM_OVERVIEW.md

DOMAIN_MODEL.md

DATABASE.md

API.md

ADR documents

```

Owner:

Architecture Agent

---

# Phase 4 — Planning

Purpose:

Transform architecture into executable work.

Activities:

- create feature map
- define dependencies
- prioritize work
- identify risks
- create trace bullets

Outputs:

```

FEATURE_MAP.md

TASK_BACKLOG.md

DEPENDENCY_GRAPH.md

TRACE_BULLETS.md

```

Owner:

Planning Agent

---

# Phase 5 — Trace Bullet

Purpose:

Validate the architecture with the smallest complete implementation path.

A trace bullet crosses all required layers:

Example:

```

Frontend

↓

API

↓

Business Logic

↓

Database

↓

Verification

```

Goals:

- discover technical risks early
- validate assumptions
- prove integration paths

Owner:

Developer Agent

---

# Phase 6 — Feature Implementation

Purpose:

Implement one approved feature.

Every feature requires:

```

Feature Specification

↓

Implementation Plan

↓

Code Changes

↓

Tests

↓

Review

```

Developer responsibilities:

- follow architecture
- respect rules
- minimize changes
- maintain tests

Owner:

Developer Agent

---

# Phase 7 — Evaluation

Purpose:

Independently verify correctness.

Evaluator checks:

## Requirements

Does the feature satisfy acceptance criteria?

## Architecture

Does implementation follow decisions?

## Quality

Is code maintainable?

## Security

Are risks introduced?

## Testing

Are behaviors verified?

Outputs:

```

QUALITY_REPORT.md

TEST_RESULTS.md

```

Owner:

QA/Evaluator Agent

---

# Phase 8 — Knowledge Update

Purpose:

Ensure the company learns from every development cycle.

Update:

```

.ai-memory/current-state.md

.ai-memory/handoff.md

.ai-memory/errors.md

docs/project/PROJECT_STATUS.md

```

Record:

- completed work
- decisions
- discovered issues
- future actions

Owner:

Knowledge Agent

---

# Feature Completion Criteria

A feature is complete only when:

✓ Requirements exist

✓ Acceptance criteria exist

✓ Implementation exists

✓ Tests pass

✓ Evaluation completed

✓ Documentation updated

✓ Memory updated

---

# Change Management

Changes affecting:

- architecture
- security
- data models
- major workflows

require:

1. Impact analysis
2. Architecture review
3. ADR update if necessary

---

# Session Workflow

Every AI development session follows:

```

1. Read company context

2. Read project facts

3. Read current memory

4. Understand assigned task

5. Plan work

6. Execute changes

7. Verify result

8. Update memory

9. Create handoff

```

---

# Session Handoff Requirement

Before ending a session, the responsible agent must update:

```

.ai-memory/handoff.md

```

with:

- completed actions
- remaining work
- discovered problems
- next recommended action

The next agent continues from the handoff document.

---

# Continuous Improvement

The workflow itself may evolve.

Changes require:

- documented reason
- impact analysis
- version update

The company improves its process through experience.

---
