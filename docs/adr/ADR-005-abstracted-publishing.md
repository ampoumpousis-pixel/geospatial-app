# ADR-005: Abstracted Publishing Layer

Status: Accepted

Date: 2026-07-14

---

## Context

The platform publishes resources as OGC services. GeoServer is the initial publishing target, but the architecture should not be locked to a single publishing system.

## Decision

Implement a **Publisher Abstraction Interface** that decouples the platform from specific publishing backends.

Key design choices:
- Abstract Publisher interface with publish(), unpublish(), get_status() methods
- GeoServerPublisher implements the interface for GeoServer integration
- Publishing operations are asynchronous (Celery jobs)
- Published service metadata (URLs, type, status) is stored in the platform database
- Future publishers (e.g., MapServer, cloud-native) can be added by implementing the interface

## Consequences

Positive:
- GeoServer can be replaced or augmented without platform changes
- Publishing logic is isolated and testable
- Standardized publishing workflow regardless of backend

Negative:
- Interface must be generic enough for multiple backend types
- Some GeoServer-specific features may require extension points
- Additional abstraction layer

## Alternatives Considered

1. Direct GeoServer coupling — rejected because it creates vendor lock-in
2. OGC API standard compliance only — rejected because not all publishers support the same standards equally
