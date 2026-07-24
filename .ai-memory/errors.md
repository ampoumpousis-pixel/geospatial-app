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

## ERR-003

Date:

2026-07-24


Category:

Frontend / Infrastructure


Problem:

Frontend component passed all static verification checks (tsc, lint, boundaries) but failed at runtime when the user clicked the button. The component called `/api/system-info/` which returned "Failed to fetch" because the Vite proxy was pointing to `localhost:8000` instead of the Docker service name `backend:8000`.


Root Cause:

The agent verified with static analysis only. It never started the dev server or clicked the button to confirm the component actually reaches the backend. The Vite proxy config was outside the task's Allowed Writes — the planning didn't identify it as a dependency. Three gaps: (1) planning didn't list vite.config.ts as affected, (2) agent didn't have permission to modify it, (3) verification stopped at compile check.


Impact:

Fully working component appeared broken to the user. Two additional files (App.tsx, vite.config.ts) needed modification before the feature worked end-to-end — neither was in the original package's Allowed Writes.


Detection:

Manual button click by human tester revealed the runtime failure.


Solution:

Fixed proxy target from `localhost:8000` → `backend:8000`. Added App.tsx and vite.config.ts to the task manifest and expanded Allowed Writes in the execution package. Restarted frontend container to pick up changes.


Prevention:

Frontend agents must run runtime verification when tasks involve API-consuming components. Static analysis (tsc, lint) is insufficient. The verification step must include:

- Static checks: TypeScript compilation, linting, import validation
- Runtime checks: Start dev server, verify component renders, verify API calls succeed

Additionally, planning (AGENT-105) should identify infrastructure dependencies (proxy configs, routing files) when a task creates components that call backend endpoints.


Promotion:

Promoted to frontend agent rules (Step 6 — Verify).

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