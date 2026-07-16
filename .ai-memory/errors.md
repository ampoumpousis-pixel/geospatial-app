# AI Error Prevention Memory

Version:

1.0


Purpose:

Capture recurring problems, mistakes, and prevention strategies.

This document allows future agents to learn from previous failures.

---

# Error Format

## Error ID

ERR-XXX


Date:

YYYY-MM-DD


Category:

- Architecture
- Backend
- Frontend
- Database
- Testing
- Security
- Workflow


Problem:

What happened?


Root Cause:

Why did it happen?


Impact:

What was affected?


Detection:

How was it discovered?


Solution:

How was it fixed?


Prevention:

How should future agents avoid it?


Promotion:

Should this become a permanent rule?

---

# Known Errors


## ERR-001

Date:

2026-07-14


Category:

AI Workflow


Problem:

Agent attempted implementation before completing architecture planning.


Root Cause:

AI optimized for immediate code generation instead of following project workflow.


Impact:

Potential unnecessary rework.


Detection:

Architecture review.


Solution:

Stopped implementation and returned to planning phase.


Prevention:

Agents must follow:


Understand

↓

Plan

↓

Implement

↓

Verify


before coding.


Promotion:

Already covered by organization rules.


---

## ERR-002

Date:

2026-07-14


Category:

Architecture


Problem:

GIS concepts were incorrectly centered around Layers.


Root Cause:

Traditional GIS systems often use layers as primary concepts.


Impact:

Could limit support for documents, media, and non-map resources.


Detection:

Architecture review.


Solution:

Redefined Resource as the primary domain object.


Prevention:

Always check PROJECT_GLOSSARY.md before designing GIS functionality.


Promotion:

Promoted to project rules.

---

# Error Categories

## Architecture Errors

Examples:

- wrong abstraction
- unnecessary complexity
- coupling


---

## Backend Errors

Examples:

- business logic in views
- missing validation
- poor API design


---

## Frontend Errors

Examples:

- duplicated components
- missing loading states
- inconsistent UI patterns


---

## Database Errors

Examples:

- missing indexes
- bad relationships
- migration issues


---

## Testing Errors

Examples:

- missing acceptance criteria
- no regression coverage


---

## Security Errors

Examples:

- exposed secrets
- permission mistakes


---

# Promotion Rule

When an error repeats:


First occurrence

↓

errors.md

Repeated pattern

↓

team rule

Critical issue

↓

organization rule


---

# AI Review Question

Before completing work ask:

"Did this create a new mistake pattern that future agents should know?"