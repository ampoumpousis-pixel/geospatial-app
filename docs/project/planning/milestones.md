# GeoSpatial Resource Platform — Milestones

Version: 1.0

Status: Draft

Purpose:
Define major delivery checkpoints and their completion criteria.

---

# Milestone 0 — Engineering Foundation

Status: In Progress

Goal:
Establish the engineering environment before development begins.

Completion Criteria:
- ✓ Virtual company structure defined
- ✓ Engineering principles established
- ✓ Development workflow defined
- ✓ Agent roles defined
- ✓ Project facts documented
- ✓ Project scope documented
- ✓ Project glossary created
- ✓ AI rules created
- ✓ AI memory system initialized
- ✓ OpenCode environment configured
- ✓ Project initialization complete (requirements, analysis, architecture, planning)

---

# Milestone 1 — Core MVP

Goal:
Deliver a minimal viable platform that supports the complete resource lifecycle: upload, manage, discover, and download.

## Included Features

| Feature | Priority |
|---|---|
| F-001 — User Authentication | P0 |
| F-002 — User and Group Management | P0 |
| F-003 — Resource Upload | P0 |
| F-004 — Resource Metadata Management | P0 |
| F-005 — Resource Search | P0 |
| F-006 — Resource Detail View | P0 |
| F-007 — Permission Management | P0 |
| F-008 — File Download | P0 |

## Completion Criteria

- Data Manager can upload a file, add metadata, and set permissions
- Public User can search, view, and download publicly accessible resources
- Administrator can manage users and groups
- All P0 features have acceptance tests passing
- API is documented (OpenAPI schema)
- Deployment documentation exists

---

# Milestone 2 — Visualization and Publishing

Goal:
Add 2D map visualization and OGC service publishing.

## Included Features

| Feature | Priority |
|---|---|
| F-009 — 2D Map Preview | P1 |
| F-010 — OGC Service Publishing (WMS/WFS) | P1 |
| F-012 — Resource Update and Versioning | P1 |
| F-013 — Audit Log | P1 |
| F-021 — Raster Preview on 2D Map | P2 (sequenced with F-009) |

## Completion Criteria

- GIS Professional can publish a vector dataset as WMS and WFS
- Public User can preview geospatial resources on a 2D map
- Public User can preview raster datasets on a 2D map
- Data Manager can update resources with version tracking
- Administrator can review audit logs
- All P1 features have acceptance tests passing
- F-021 raster preview acceptance criteria pass

---

# Milestone 3 — Organization and Discovery

Goal:
Improve resource organization and discovery capabilities.

## Included Features

| Feature | Priority |
|---|---|
| F-011 — Collection and Project Organization | P1 |

## Completion Criteria

- Data Manager can organize resources into collections
- Public User can browse collections
- Search includes collection and project filters

---

# Milestone 4 — Advanced Visualization

Goal:
Enable 3D and point cloud visualization.

## Included Features

| Feature | Priority |
|---|---|
| F-014 — 3D Globe Preview (CesiumJS) | P2 |
| F-015 — Point Cloud Preview (Potree) | P2 |
| F-016 — Resource Archival | P2 |
| F-017 — Raster Publishing (WMTS) | P2 |

## Completion Criteria

- GIS Professional can publish raster data as WMTS
- Public User can view 3D terrain and point cloud resources
- Data Manager can archive outdated resources

---

# Milestone 5 — Polish and Extension

Goal:
Add remaining features and polish.

## Included Features

| Feature | Priority |
|---|---|
| F-018 — Style Management (SLD) | P3 |
| F-019 — External Link Resources | P3 |
| F-020 — Email Notifications | P3 |

## Completion Criteria

- GIS Professional can manage layer styles
- External URLs can be cataloged as resources
- Users receive email notifications for async operations
- Platform is stable and performant under target scale
