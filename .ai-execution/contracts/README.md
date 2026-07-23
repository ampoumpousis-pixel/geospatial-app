# Contracts

Contracts are extracted views of the Technical Design. They define interfaces, schemas, and boundaries that implementation agents depend on.

Contracts are **owned by the Technical Planner (AGENT-103)**. They derive from approved design — never from implementation code.

In Phase 1, contracts remain embedded inside `technical-design.md`. Standalone contract files will be extracted in Phase 2 when cross-team coordination requires explicit, version-locked contract artifacts.

Planned contracts:
- `api-contract.md` — API endpoints, request/response schemas, error codes
- `database-contract.md` — Schema ownership, migration rules, data integrity boundaries
- `shared-types.md` — Type definitions shared across backend and frontend
- `deployment-contract.md` — Docker, environment variables, service boundaries
