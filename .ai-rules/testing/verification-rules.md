# Testing and Verification Rules

Version:

1.0


Applies to:

- QA Agent
- Developer Agents
- Architecture Agents
- Evaluator Agents


Purpose:

Define how the company verifies that software works correctly.

---

# Testing Philosophy

Testing is not a final activity.

Testing begins during requirements discovery.

The engineering chain is:

```

User Need

↓

Requirement

↓

Acceptance Criteria

↓

BDD Scenario

↓

Automated Test

↓

Implementation

```

---

# Rule 1 — Acceptance Criteria Before Implementation

A feature should not begin implementation without clear acceptance criteria.

Every feature must define:

- expected behavior
- success conditions
- failure conditions
- edge cases

---

# Rule 2 — Behavior Driven Development

User-facing behavior should be expressed using:

Given / When / Then


Example:

```

Given

a user has permission to view a resource

When

the user opens the resource page

Then

the resource metadata and available actions are displayed

```

---

# Rule 3 — Tests Trace Back to Requirements

Every important test should answer:

"What requirement does this verify?"

Maintain traceability:

```

Requirement ID

↓

Acceptance Criteria ID

↓

Test ID

↓

Implementation

```

---

# Rule 4 — Test Pyramid

Prefer:

```

```
    End-to-End Tests

          ▲

  Integration Tests

          ▲

      Unit Tests
```

```

Most tests should be fast and isolated.

---

# Rule 5 — Unit Tests

Use unit tests for:

- business logic
- calculations
- validation rules
- domain behavior

Avoid testing framework behavior.

---

# Rule 6 — Integration Tests

Use integration tests for:

- APIs
- database interactions
- external services
- permissions

Examples:

- Resource creation API
- Publishing workflow
- File upload process

---

# Rule 7 — End-to-End Tests

Use end-to-end tests for critical user journeys.

Examples:

```

Upload Resource

↓

Generate Metadata

↓

Preview Resource

↓

Publish Resource

```

---

# Rule 8 — Boundary Testing

Agents must consider:

- minimum values
- maximum values
- empty states
- invalid inputs
- missing permissions
- large datasets
- network failures

---

# Rule 9 — Test Data Strategy

Create realistic datasets.

Test datasets should include:

## Normal Cases

Expected valid scenarios.


## Boundary Cases

Limits of the system.


## Failure Cases

Invalid or unexpected situations.


## Large Data Cases

Performance validation.

---

# Rule 10 — Regression Protection

When modifying existing functionality:

Identify affected behavior.

Update:

- existing tests
- regression suites
- documentation


A bug fix should prevent the same bug returning.

---

# Rule 11 — Evaluator-Optimizer Workflow

Implementation requires independent evaluation.

Process:

```

Developer Agent

↓

Evaluator Agent

↓

Issues Identified

↓

Developer Improvement

↓

Re-evaluation

```

The evaluator must be independent.

---

# Rule 12 — Definition of Done

A feature is complete only when:

✓ Requirements exist

✓ Acceptance criteria exist

✓ Tests exist

✓ Implementation complete

✓ Verification passed

✓ Documentation updated

✓ Memory updated

---

# Rule 13 — Failure Reporting

Agents must distinguish:

## Empty Result

Meaning:

"The system worked but found nothing."


## Error

Meaning:

"The operation failed."


Never hide failures as empty results.

---

# Rule 14 — Structured Test Results

Test reports should include:

```

Test ID

Requirement ID

Result

Evidence

Failure Details

Recommended Action

```

---

# Rule 15 — AI Verification Checklist

Before approving generated code, evaluate:

## Correctness

Does it satisfy the requirement?


## Completeness

Was every requested component delivered?


## Simplicity

Was unnecessary complexity introduced?


## Security

Are risks introduced?


## Maintainability

Can future agents understand it?


---

# Rule 16 — UI Verification

Frontend features must verify:

- loading states
- empty states
- error states
- permission states
- responsive behavior

---

# Rule 17 — API Verification

APIs must verify:

- authentication
- authorization
- validation
- error responses
- pagination
- performance considerations

---

# Rule 18 — Data Verification

Database changes require checking:

- migrations
- constraints
- indexes
- data integrity

---

# Rule 19 — Performance Awareness

For geospatial systems consider:

- large files
- spatial queries
- rendering performance
- background processing
- concurrent users

---

# Rule 20 — Quality Memory

When recurring issues appear:

Document them.

Location:

```

.ai-memory/errors.md

```

or:

```

.ai-rules/testing/

```

depending on whether the issue is temporary or systemic.

---

# Quality Golden Rule

A feature is not finished when code exists.

A feature is finished when behavior is proven.
```

---