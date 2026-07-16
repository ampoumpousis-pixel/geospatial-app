# ADR-002: Modular Monolith Architecture

Status: Accepted

Date: 2026-07-14

---

## Context

The platform needs clear module boundaries while avoiding the operational complexity of distributed systems. The team size and project scale (small initial deployment, single organization) do not justify microservices.

However, future extraction of modules into separate services should be possible without redesign.

## Decision

Use a **Modular Monolith** architecture.

Key design choices:
- Django apps represent business capabilities with clear boundaries
- Internal communication uses Python function calls (not HTTP)
- Modules communicate through defined service interfaces
- No direct database access across module boundaries
- Module dependencies are explicit and acyclic
- Future extraction is supported by keeping module boundaries clean

## Consequences

Positive:
- Simple deployment (single application)
- No network latency between modules
- Easy debugging and testing
- Lower initial infrastructure cost
- Clean boundaries allow future service extraction

Negative:
- All modules share the same deployment unit
- Scaling requires vertical scaling or extracting hot modules
- Strict discipline required to maintain boundaries

## Alternatives Considered

1. Microservices — rejected due to operational complexity at current scale
2. Single Django app (no modularity) — rejected because it would create coupling and hinder future extraction
3. Service-based with message bus — rejected as over-engineering for current requirements
