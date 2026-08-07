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

## F-022 — User Notifications

Description:
Users can see system-generated notifications, mark them as read, and configure notification preferences. Frontend surfaces: notification indicator (bell) in the application header, a Notification Center page, and a notification preferences section.

Business Value:
Keeps users informed about platform events without polling.

Priority: Test (pipeline validation vehicle — isolated, not a dependency of other features)

Dependencies: None (uses the platform User identity; does not depend on F-001 delivery)

Related Requirements: None (test feature)

Acceptance Criteria:
- Users can view unread notification count
- Users can view the notification list
- Users can mark notifications as read
- Users can configure notification preferences

Risks: None (no production impact; cross-cutting frontend surface by design for planner testing)

---

## F-023 — Recent Activity Panel

Description:
Add a Recent Activity panel to the existing platform home page, showing a small list of recent platform events fetched from the backend.

Business Value:
Provides a lightweight at-a-glance activity overview on the existing home surface.

Priority: Test (pipeline validation vehicle — isolated, not a dependency of other features)

Dependencies: None

Related Requirements: None (test feature)

Acceptance Criteria:
- Home page displays a Recent Activity panel
- Panel fetches recent activity from a backend endpoint
- No dedicated activity page or route is created

Risks: None (no production impact)

---

## F-024 — Automatic Data Retention

Description:
Scheduled background job that expires and removes stale records (expired sessions, superseded temporary data) according to configured retention periods. Purely backend; no user-facing surface.

Business Value:
Keeps operational data bounded without manual cleanup.

Priority: Test (pipeline validation vehicle — backend-only negative test for the frontend-integration trigger)

Dependencies: None

Related Requirements: None (test feature)

Acceptance Criteria:
- A scheduled retention job runs on a configured interval
- Expired records are removed per retention policy
- No user-facing surface exists

Risks: None (no production impact)

---

## F-030 — User Display Name

Description:
Identified users can view and update their display name on a profile page. The profile page is a new surface reached via a local navigation link on the existing home page. Backend exposes GET /api/profile/ and PUT /api/profile/.

Business Value:
First execution-milestone test feature — validates the artifact-driven implementation pipeline on a minimal, isolated feature.

Priority: Test (execution validation vehicle — isolated, no other feature depends on it)

Dependencies: None

Related Requirements: None (test feature)

Acceptance Criteria:
- A profile page exists at /profile
- The home page links to the profile page
- Users can view and update their display name
- Only the authenticated user can modify their own display name

Risks: None (no production impact)

---

## F-TEST-001 — System Info Display (Pipeline Validation)

Description:
Simple health-check endpoint that returns system information (version, database status, uptime). Frontend displays the result via a button component. Infrastructure verifies container health. Designed to validate the end-to-end automated planning → contracts → execution packages → developer agents pipeline.

Business Value:
Internal — validates the execution pipeline without touching production features.

Priority: Test (not a production feature)

Dependencies: None (standalone test, isolated from production features)

Related Requirements: None (test feature)

Acceptance Criteria:
- Backend endpoint `GET /api/system-info/` returns 200 with JSON
- Frontend button component calls endpoint and displays result
- Infrastructure verification confirms containers running and endpoint reachable
- All 3 contract-bound packages generated from task manifest
- Selective contract invalidation works

Risks: None (no production impact)

---

## F-TEST-002 — Test Feature Regression

Description:
Phase 2 command layer validation. Verify the feature pipeline produces correct artifacts.

Business Value:
Framework validation — no product value.

Priority: Test

Dependencies: None

Acceptance Criteria:
- Feature spec, technical design, engineering review, approval, and task manifest all produced

Risks: None

---

# Priority Summary

| Priority | Count | Features |
|---|---|---|---|
| P0 | 8 | F-001 through F-008 |
| P1 | 5 | F-009, F-010, F-011, F-012, F-013 |
| P2 | 5 | F-014, F-015, F-016, F-017, F-021 |
| P3 | 3 | F-018, F-019, F-020 |
| Test | 6 | F-022, F-023, F-024, F-030, F-TEST-001, F-TEST-002 |
