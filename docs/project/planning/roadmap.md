# GeoSpatial Resource Platform — Delivery Roadmap

Version: 1.0

Status: Draft

Purpose:
Define the strategic delivery sequence for the project.

---

# Roadmap Overview

```
Milestone 0: Engineering Foundation
    ↓
Milestone 1: Core MVP (P0 features)
    ↓
Milestone 2: Visualization & Publishing (P1 features)
    ↓
Milestone 3: Organization & Discovery
    ↓
Milestone 4: Advanced Visualization (P2 features)
    ↓
Milestone 5: Polish & Extension (P3 features)
```

---

# Phase Sequencing Rationale

## Why Core MVP First

The eight P0 features (upload, metadata, search, detail view, permissions, download, users) form a complete value chain:

```
User authenticates
    ↓
Uploads a resource with metadata
    ↓
Sets permissions
    ↓
Users search and discover
    ↓
Users view details and preview
    ↓
Users download if permitted
```

This creates the foundation that all subsequent features build upon.

## Why Visualization Before Publishing

2D map preview provides immediate value to public users and helps validate the viewer abstraction before the more complex publishing system is built.

## Why Publishing Is Milestone 2

GeoServer integration requires:
- Publisher abstraction
- Asynchronous job infrastructure
- GeoServer configuration and administration
- Error handling for external system failures

This is the most technically complex feature and benefits from having the core platform stable first.

---

# Delivery Strategy

## Trace Bullet First

Before full Milestone 1 implementation, build a trace bullet:

```
User login → Upload a file → View resource detail → Search for resource → Download file
```

This validates:
- Authentication and session management
- File upload and storage pipeline
- Resource and metadata models
- Search indexing
- Permission enforcement
- Download flow

## Incremental Delivery

Each milestone delivers working, testable functionality.

No milestone depends on a future milestone.

---

# Timeline Notes

There are no fixed deadlines for this project.

The roadmap is sequenced by dependency and risk:

- Lowest risk features first (P0 core)
- Highest complexity feature (publishing) after platform is stable
- Lowest value features last (P3)

Estimated effort order (rough):
- Milestone 1: Largest effort (8 features, foundational)
- Milestone 2: Medium effort (4 features, includes complex GeoServer integration)
- Milestones 3-5: Smaller effort (1-4 features each, building on existing infrastructure)
