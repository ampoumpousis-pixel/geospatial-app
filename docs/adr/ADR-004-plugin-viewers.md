# ADR-004: Plugin-Based Viewer Architecture

Status: Accepted

Date: 2026-07-14

---

## Context

The platform needs to support multiple visualization technologies (2D map, 3D globe, point cloud) and may need to add new viewers in the future. Direct coupling to any single viewer would make the system brittle.

## Decision

Implement a **Viewer Plugin Interface** that decouples resource visualization from specific viewer implementations.

Key design choices:
- Abstract Viewer interface with can_view(), get_viewer_url(), get_config() methods
- Each viewer (MapStore, CesiumJS, Potree) implements the interface
- Viewer selection is automatic based on resource type
- Viewers are configured at the admin level (URLs, API keys)
- New viewers can be added by implementing the interface

## Consequences

Positive:
- Core platform is independent of viewer implementations
- Easy to add new viewers
- Viewers can be upgraded independently
- Each viewer can be optimized for its specific technology

Negative:
- Additional abstraction layer
- Viewer interface must be generic enough to support diverse viewers
- Some viewer-specific features may not fit the interface cleanly

## Alternatives Considered

1. Hard-coded viewer for each resource type — rejected because it tightly couples platform to specific viewers
2. Single map library handling all types — rejected because no single library covers all required visualization types well
3. No viewer abstraction (direct embedding) — rejected because it prevents adding viewers without code changes
