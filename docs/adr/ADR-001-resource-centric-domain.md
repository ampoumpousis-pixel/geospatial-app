# ADR-001: Resource-Centric Domain Model

Status: Accepted

Date: 2026-07-14

---

## Context

Traditional GIS platforms are built around the concept of layers. However, this project manages a broader range of digital assets including documents, imagery, video, point clouds, and external services. A layer-centric model forces non-spatial assets into inappropriate abstractions.

The platform needs a unified domain model that can represent any managed digital asset consistently.

## Decision

Adopt **Resource** as the primary domain object. All managed assets — spatial and non-spatial — are modeled as Resources.

Key design choices:
- Resources have a type discriminator (enum) to distinguish subtypes
- Resources carry metadata, attachments, relationships, and permissions uniformly
- Layers are a visualization/publishing concept derived from Resources, not a core entity
- The domain model is built around Resource, not around GIS Layer

## Consequences

Positive:
- Single unified model for all asset types
- Consistent permission, search, and metadata across all content
- Simpler to extend with new resource types
- Avoids forcing non-spatial data into layer abstractions

Negative:
- Requires explicit type-awareness in UI (different resource types need different treatments)
- GIS professionals accustomed to layer-centric tools may need orientation

## Alternatives Considered

1. Layer-centric model (like GeoNode) — rejected because it poorly models non-spatial assets
2. Separate models for each asset type — rejected because it duplicates cross-cutting concerns (permissions, metadata, search)
3. Polymorphic model with shared base — considered but Resource with type enum chosen for simplicity in a modular monolith
