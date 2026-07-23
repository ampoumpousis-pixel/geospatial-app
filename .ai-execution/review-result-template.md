# Review Result Template

Version: 1.0

Purpose: Define the artifact contract for every execution review result. This is a schema, not a workflow or policy. Produced by any validation agent (Code Reviewer, Security Reviewer, Architecture Reviewer).

---

## Required Fields

### Decision

```
Decision: PASS | FAIL | NEEDS CLARIFICATION
```

- **PASS** — Implementation satisfies all validation areas. Proceed to next stage.
- **FAIL** — One or more BLOCKER or MAJOR findings. Developer must fix and re-submit.
- **NEEDS CLARIFICATION** — Human decision required. Escalate.

### Validation

Each area receives a PASS/FAIL assessment:

| Area | Result | Evidence |
|---|---|---|
| Execution Package | PASS / FAIL | |
| Architecture | PASS / FAIL | |
| Acceptance Criteria | PASS / FAIL | |
| Boundary | PASS / FAIL | |
| Standards | PASS / FAIL | |
| Security | PASS / FAIL | |
| Testing | PASS / FAIL | |

**Execution Package** validates that the package correctly defined the task (allowed writes include all needed files, design references cover the implementation, completion criteria are testable).

**Boundary** validates that files changed are within the package's Allowed Writes.

### Findings

Each finding requires:

```markdown
| Severity | Area | Description | Evidence | Required Action |
|---|---|---|---|---|
| BLOCKER / MAJOR / MINOR / OBSERVATION | [validation area] | [description] | [file, line, or command output] | [what must change] |
```

**Severity:**

| Level | Decision Impact | Example |
|---|---|---|
| BLOCKER | FAIL — cannot proceed | Changed files outside boundary, violated design, security issue, missing required acceptance criteria |
| MAJOR | FAIL — must fix before re-review | Missing validation, incorrect error handling, insufficient test coverage |
| MINOR | PASS WITH NOTES — does not block | Naming improvement, missing docstring |
| OBSERVATION | PASS — future improvement | Performance suggestion, code clarity note |

### Evidence

```markdown
Files Reviewed:
- [file path]
- [file path]

Commands Verified:
- [command]: [result]
- [command]: [result]

References:
- [Technical Design section]
- [Standard file]
```
