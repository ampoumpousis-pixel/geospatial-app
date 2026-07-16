# GeoSpatial Resource Platform — Feature Catalog

Version: 1.0

Status: Draft

Purpose:
List all identified features with priority, dependencies, and business value.

---

# Feature List

## F-001 — User Authentication

Description:
User registration, login, logout, and session management.

Business Value:
Foundation feature — all other features depend on user identity.

Priority: P0 (Mandatory)

Dependencies: None

Related Requirements: FR-05-01, FR-05-02

Acceptance Criteria:
- Users can log in with username and password
- Unauthenticated users are redirected to login
- Session timeout is configurable

Risks: Low

---

## F-002 — User and Group Management

Description:
Administrative interface for managing users, groups, and roles.

Business Value:
Enables access control and organizational structure.

Priority: P0 (Mandatory)

Dependencies: F-001

Related Requirements: FR-05-03, FR-05-04, FR-11-01

---

## F-003 — Resource Upload

Description:
File upload with metadata entry, validation, and automatic extraction.

Business Value:
Primary data ingestion path — core to the platform's value.

Priority: P0 (Mandatory)

Dependencies: F-001

Related Requirements: FR-01-01, FR-01-02, FR-02-01, FR-02-02, FR-08-01, FR-08-02

Risks: Medium (large file handling, format support breadth)

---

## F-004 — Resource Metadata Management

Description:
Viewing, editing, and validating resource metadata.

Business Value:
Makes resources discoverable and usable.

Priority: P0 (Mandatory)

Dependencies: F-003

Related Requirements: FR-02-01, FR-02-03

---

## F-005 — Resource Search

Description:
Keyword, spatial, and faceted search across the resource catalog.

Business Value:
Primary discovery mechanism for all users.

Priority: P0 (Mandatory)

Dependencies: F-003, F-004

Related Requirements: FR-03-01, FR-03-02, FR-03-03, FR-03-04, FR-03-05

Risks: Medium (spatial search performance)

---

## F-006 — Resource Detail View

Description:
Detail page showing metadata, map preview, attachments, and actions.

Business Value:
Destination page for resource discovery and consumption.

Priority: P0 (Mandatory)

Dependencies: F-003, F-004

Related Requirements: US-PUB-003

---

## F-007 — Permission Management

Description:
Object-level access control for resources.

Business Value:
Enables controlled sharing and protects sensitive data.

Priority: P0 (Mandatory)

Dependencies: F-001, F-002, F-003

Related Requirements: FR-05-05, FR-05-06

---

## F-008 — File Download

Description:
Download resource files with permission enforcement.

Business Value:
Primary data access path for users.

Priority: P0 (Mandatory)

Dependencies: F-003, F-007

Related Requirements: FR-08-03

---

## F-009 — 2D Map Preview

Description:
MapStore-based 2D visualization of geospatial resources.

Business Value:
Essential for understanding spatial data before downloading.

Priority: P1 (Important)

Dependencies: F-006, GeoServer integration

Related Requirements: FR-06-01, FR-06-04, FR-06-05

---

## F-010 — OGC Service Publishing (WMS/WFS)

Description:
Publishing resources as OGC web services via GeoServer.

Business Value:
Enables external GIS tools to consume platform data.

Priority: P1 (Important)

Dependencies: F-003, GeoServer deployment

Related Requirements: FR-07-01, FR-07-02, FR-07-04, FR-07-05

Risks: Medium (GeoServer integration complexity)

---

## F-011 — Collection and Project Organization

Description:
Organizing resources into collections and projects.

Business Value:
Improves discoverability and workflow organization.

Priority: P1 (Important)

Dependencies: F-003

Related Requirements: FR-04-01, FR-04-02, FR-04-03

---

## F-012 — Resource Update and Versioning

Description:
Replacing resource files with version tracking.

Business Value:
Supports data updates without losing history.

Priority: P1 (Important)

Dependencies: F-003

Related Requirements: FR-01-03, FR-01-06

---

## F-013 — Audit Log

Description:
Track resource lifecycle events for compliance and troubleshooting.

Business Value:
Required for data governance and accountability.

Priority: P1 (Important)

Dependencies: F-001, F-003

Related Requirements: FR-10-01, FR-10-02, FR-10-03

---

## F-014 — 3D Globe Preview (CesiumJS)

Description:
3D visualization of terrain and 3D resources.

Business Value:
Enables exploration of elevation and 3D data.

Priority: P2 (Nice to have)

Dependencies: F-006, F-009 viewer abstraction

Related Requirements: FR-06-02, FR-06-05

---

## F-015 — Point Cloud Preview (Potree)

Description:
Point cloud visualization for LAS/LAZ resources.

Business Value:
Enables LiDAR data exploration in the browser.

Priority: P2 (Nice to have)

Dependencies: F-006, F-009 viewer abstraction

Related Requirements: FR-06-03, FR-06-05

---

## F-016 — Resource Archival

Description:
Archiving resources to remove from active catalog without data loss.

Business Value:
Lifecycle management for outdated resources.

Priority: P2 (Nice to have)

Dependencies: F-003

Related Requirements: FR-01-04

---

## F-017 — Raster Publishing (WMTS)

Description:
Publishing raster datasets as WMTS tile services.

Business Value:
Efficient access to large imagery and elevation data.

Priority: P2 (Nice to have)

Dependencies: F-010

Related Requirements: FR-07-03

---

## F-018 — Style Management (SLD)

Description:
Applying and managing SLD styles for published layers.

Business Value:
Visual consistency for published map services.

Priority: P3 (Future)

Dependencies: F-010

Related Requirements: US-GIS-003

---

## F-019 — External Link Resources

Description:
Support external web services and URLs as resources.

Business Value:
Catalog non-file resources alongside uploaded data.

Priority: P3 (Future)

Dependencies: F-003

---

## F-020 — Email Notifications

Description:
Email notifications for upload completion, publishing status, and errors.

Business Value:
Keeps users informed without polling.

Priority: P3 (Future)

Dependencies: F-001

---

## F-021 — Raster Preview on 2D Map

Description:
Server-side tile generation and MapStore-based preview of raster datasets (GeoTIFF, JPEG2000, etc.) on the 2D map viewer. Falls back to extent outline for oversized rasters; uses published WMS/WMTS services when available.

Business Value:
Enables visual assessment of raster data without downloading, completing the full resource discovery flow for raster datasets.

Priority: P2 (Nice to have) — but delivery-sequenced with F-009 (2D Map Preview) in Milestone 2

Dependencies: F-003, F-006, F-007, F-009; Enhancement from F-010, F-017

Related Requirements: FR-06-01, US-PUB-003, US-PUB-004, US-GIS-006

Risks: Medium (GDAL dependency, tile generation performance for large rasters, tile cache storage)

---

## F-022 — Geocalendar Timelines

Description:
Visual timeline and calendar-based interface for exploring geospatial resources by acquisition date, creation date, or other temporal attributes. Combines a temporal timeline/calendar view with a synchronized map display, enabling users to browse, filter, and animate resources through time.

Business Value:
Unlocks temporal discovery of geospatial data — essential for change detection, time-series analysis, and monitoring workflows. Differentiates the platform from static catalog solutions.

Priority: P2 (Nice to have)

Dependencies: F-003, F-004, F-005, F-009; Enhancement from F-014

Related Requirements: FR-03-03 (temporal search), FR-06-01 (map visualization)

Risks: Medium (timeline performance with large datasets, temporal metadata consistency)

---

# Priority Summary

| Priority | Count | Features |
|---|---|---|
| P0 | 8 | F-001 through F-008 |
| P1 | 5 | F-009, F-010, F-011, F-012, F-013 |
| P2 | 6 | F-014, F-015, F-016, F-017, F-021, F-022 |
| P3 | 3 | F-018, F-019, F-020 |
