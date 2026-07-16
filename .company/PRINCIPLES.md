# GeoSpatial Platform Engineering Principles

Version:

1.0

Purpose:

Define the engineering principles that guide all human and AI contributors working on this project.

These principles have priority over convenience, speed, or short-term implementation choices.

---

# Principle 1 — Understand Before Building

No implementation starts without understanding:

- the user problem
- expected behavior
- success criteria
- constraints
- risks

Requirements come before solutions.

---

# Principle 2 — Requirements Before Architecture, Architecture Before Code

The engineering sequence is:
Problem

↓

Requirements

↓

Architecture

↓

Implementation

↓

Verification


Skipping stages creates technical debt and unreliable systems.

---

# Principle 3 — Build the Simplest Correct Solution

Prefer:

- simplicity
- clarity
- maintainability
- explicit design

Avoid:

- unnecessary abstraction
- speculative features
- premature optimization
- complex frameworks without need

---

# Principle 4 — YAGNI (You Aren't Gonna Need It)

Do not build future possibilities before current requirements justify them.

Examples:

Avoid creating:

- unused extension points
- unnecessary services
- premature event systems
- complex abstractions

Future-ready does not mean future-built.

---

# Principle 5 — Modular Design

Software should be organized around clear responsibilities.

Modules should have:

- clear boundaries
- defined ownership
- minimal coupling
- explicit interfaces

A component should have one clear reason to change.

---

# Principle 6 — Trace Bullets Before Large Features

Large features begin with a small complete path through the system.

Example:
User Interface

↓

API

↓

Business Logic

↓

Database

↓

Response


Trace bullets reveal:

- unknown dependencies
- architectural problems
- technology risks

before large investments are made.

---

# Principle 7 — One Feature, One Development Cycle

A development session should focus on one clearly defined feature.

Each feature should have:

- identifier
- requirements
- acceptance criteria
- implementation plan
- tests
- verification result

Avoid:

"Build the whole subsystem."

Prefer:

"Implement FEATURE-ID-001."

---

# Principle 8 — Verification Is Mandatory

Nothing is considered complete without evidence.

Evidence may include:

- automated tests
- acceptance scenarios
- screenshots
- validation reports
- review results

The question is never:

"Did we write code?"

The question is:

"Does the system behave correctly?"

---

# Principle 9 — Independent Evaluation

The creator of a solution should not be the only judge of correctness.

Development and evaluation are separate responsibilities.

Workflow:
Developer

↓

Evaluator

↓

Feedback

↓

Improvement

↓

Verification


---

# Principle 10 — Architecture Decisions Are Explicit

Important decisions must be documented.

Architecture decisions require:

- context
- options considered
- decision
- consequences

All significant decisions become ADRs.

---

# Principle 11 — Knowledge Must Survive Sessions

AI sessions are temporary.

Project knowledge is permanent.

Every session should leave behind:

- progress updates
- decisions
- discovered problems
- lessons learned

Future agents should continue from artifacts, not memory of conversations.

---

# Principle 12 — Separate Knowledge Types

The project maintains two kinds of knowledge.

## Semantic Knowledge

Stable facts:

- rules
- standards
- architecture
- conventions
- decisions

Stored in:
.ai-rules/
docs/


---

## Episodic Memory

Project history:

- completed work
- failed attempts
- current state
- handoffs

Stored in:
.ai-memory/


---

# Principle 13 — Explicit Agent Authority

Every agent must know:

- what it can decide
- what it can modify
- what requires escalation

Agents must not silently change:

- requirements
- architecture
- scope
- security policies

---

# Principle 14 — Errors Become Knowledge

Repeated mistakes become permanent improvements.

When a problem occurs:

1. Fix the immediate issue.
2. Document the cause.
3. Add prevention guidance.
4. Update rules or tests.

A solved problem should not return.

---

# Principle 15 — Security by Design

Security is considered from the beginning.

Consider:

- authentication
- authorization
- data protection
- secrets management
- safe defaults

Security is not a final review step.

---

# Principle 16 — Human Direction, AI Acceleration

Humans provide:

- goals
- priorities
- strategic decisions
- approval of major changes

AI provides:

- analysis
- implementation assistance
- verification assistance
- documentation

AI accelerates engineering.

Humans maintain responsibility.
