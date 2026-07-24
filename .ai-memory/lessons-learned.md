# AI Engineering Lessons Learned

Version:

1.0


Purpose:

Capture experience, successful approaches, and workflow improvements.

---

# Lesson Format

## Lesson ID

LESSON-XXX


Date:

YYYY-MM-DD


Situation:

What happened?


Observation:

What was learned?


Impact:

Why does it matter?


Recommendation:

What should future agents do?


---

# Lessons


## LESSON-001

Date:

2026-07-14


Situation:

Designing a complex software platform with AI agents.


Observation:

A structured repository of knowledge produces better agent decisions than relying on conversation history.


Impact:

Reduced context loss.


Recommendation:

Maintain:

- company documents
- project documents
- AI rules
- memory files


---

## LESSON-002

Date:

2026-07-14


Situation:

Planning geospatial platform architecture.


Observation:

The Resource abstraction provides more flexibility than a Layer-centered model.


Impact:

Supports datasets, documents, media, and services consistently.


Recommendation:

Keep Resource as the domain foundation.


---

## LESSON-003

Date:

2026-07-14


Situation:

Working with AI-generated code.


Observation:

AI performs better with small complete tasks than large vague objectives.


Impact:

Higher quality implementation.


Recommendation:

Use:

- trace bullets
- small tasks
- evaluator review

---

## LESSON-004

Date:

2026-07-24


Situation:

Frontend agent created a React component that called a backend API endpoint. All static checks passed (tsc, lint, boundaries). But when a human tester clicked the button, it failed because the Vite proxy wasn't configured to forward requests to the backend Docker container.


Observation:

Static analysis is not sufficient for frontend components that consume backend APIs. The component compiled and rendered correctly — but couldn't reach the backend at runtime. The verification step must distinguish between static checks (TypeScript, lint) and runtime checks (actual HTTP request flow).


Impact:

A feature that passed all agent verification checks was broken for the user. The reviewer would have PASSed clean-looking code that didn't function.


Recommendation:

Frontend agents must run runtime verification when tasks involve API-consuming components. Start the dev server, verify the HTTP request/response works end-to-end. Also, planning should identify infrastructure dependencies (proxy configs, routing) when decomposing API-consuming frontend tasks.

---

# Future Lessons

New lessons should be added as the project evolves.