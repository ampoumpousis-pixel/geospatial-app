# Subagent Permission Runtime Constraint

**Status:** Known platform limitation

---

## Symptom

Agent permission declarations defined in the agent frontmatter are not refreshed for already-running subagent runtime instances. An agent whose definition includes correct `write` or `edit` permissions may still be unable to write to those paths when invoked, because the runtime loaded the agent configuration before the permissions were updated.

---

## Detection

1. Agent definition file contains the required write permission pattern.
2. Agent execution output confirms the file could not be written.
3. Manual command-layer extraction using the same path succeeds.

---

## Affected Components

**Current:**
- AGENT-105 (Task Planner) — cannot write `task-manifest.json` directly. JSON content is embedded in `implementation-plan.md` and extracted by the command layer.

**Potential:**
- Any subagent that writes files to controlled artifact paths may encounter the same limitation if agent definitions are updated while runtimes are cached.

---

## Workaround

The agent emits the canonical content into a permitted file path (typically `implementation-plan.md`). The command layer (the outer execution context that invoked the subagent) performs the final artifact write to the intended path.

For AGENT-105 specifically:

1. Task Planner generates `implementation-plan.md` with an embedded `json` code block containing the full task manifest.
2. After the agent completes, the command layer extracts the JSON block and writes it to `task-manifest.json`.
3. Both the canonical `task-manifest.json` and the embedded copy in `implementation-plan.md` are kept — they are identical and serve as redundancy.

---

## Architectural Impact

**None.** The artifact ownership model remains unchanged:

| Artifact | Owner | Status |
|----------|-------|--------|
| `task-manifest.json` | AGENT-105 Task Planner | Content produced by agent |
| `implementation-plan.md` | AGENT-105 Task Planner | Content produced by agent |

The limitation affects only file transport — the path the agent directly writes to — not the identity of the artifact or the authority of the agent to produce it.

**Affects both Feature and Work origins equally.** This is not a path-dependent limitation.

---

## Future Action

Track against runtime permission refresh capability. If the platform introduces runtime re-read of agent definitions, remove this workaround and let AGENT-105 write `task-manifest.json` directly.
