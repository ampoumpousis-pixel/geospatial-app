# GeoSpatial Resource Platform — Acceptance Criteria

Version: 1.0

Status: Draft

Purpose:
Define observable, measurable, and testable acceptance criteria for key user stories.

---

# US-PUB-001 — Resource Discovery

## AC-PUB-001-1 — Keyword Search

Given a set of published resources with titles and descriptions
When a public user enters a keyword in the search field
Then results matching the keyword in title or description are displayed.

## AC-PUB-001-2 — Spatial Filter

Given resources have spatial extent metadata
When a public user draws a bounding box or selects a region
Then only resources intersecting that region are shown.

## AC-PUB-001-3 — Type Filter

Given resources of different types (vector, raster, document, etc.)
When a public user filters by resource type
Then only resources of the selected type are displayed.

## AC-PUB-001-4 — Empty Results

Given no resources match the current search criteria
When the search completes
Then a clear "no results found" message is displayed with suggestions.

---

# US-PUB-003 — Resource Detail View

## AC-PUB-003-1 — Metadata Display

Given a public user opens a resource detail page
Then all available metadata fields are displayed (title, description, type, owner, spatial extent, dates, tags).

## AC-PUB-003-2 — Map Preview

Given the resource has spatial data and a compatible viewer
Then a map preview of the resource is displayed on the detail page.

## AC-PUB-003-3 — Related Resources

Given the resource has defined relationships to other resources
Then related resources are listed with links.

## AC-PUB-003-4 — Download Option

Given the resource has downloadable files and the user has permission
Then download links are displayed with file format and size.

---

# US-PUB-005 — Resource Download

## AC-PUB-005-1 — Single File Download

Given a public user clicks a download link for a resource
Then the file download starts within 5 seconds.

## AC-PUB-005-2 — Download Permission

Given a resource is not public
When a public user attempts to download it
Then access is denied with an appropriate message.

## AC-PUB-005-3 — Download Tracking

Given a user downloads a resource
Then the download event is recorded in the audit log.

---

# US-DM-001 — Resource Upload

## AC-DM-001-1 — File Upload

Given a data manager is on the upload page
When they select a supported file and submit
Then the file is uploaded and a new resource is created with basic metadata extracted.

## AC-DM-001-2 — Large File Upload

Given a data manager uploads a file larger than 100 MB
Then the upload is processed asynchronously and the user receives a progress notification.

## AC-DM-001-3 — Unsupported Format

Given a data manager uploads an unsupported file format
Then an error message is displayed listing supported formats.

## AC-DM-001-4 — Upload Validation

Given a data manager submits upload without required metadata fields
Then the upload is rejected with specific field validation errors.

---

# US-DM-002 — Metadata Entry

## AC-DM-002-1 — Required Fields

Given a data manager is editing resource metadata
Then required fields are clearly marked and must be completed before saving.

## AC-DM-002-2 — Auto-Extraction

Given a data manager uploads a geospatial file with embedded metadata
Then available metadata (spatial extent, CRS, format) is pre-populated automatically.

## AC-DM-002-3 — Metadata Validation

Given a data manager enters invalid metadata values
Then field-level validation errors are displayed.

---

# US-DM-004 — Access Control

## AC-DM-004-1 — Grant Access

Given a data manager owns a resource
Then they can grant read, write, or manage permissions to specific users or groups.

## AC-DM-004-2 — Permission Enforcement

Given a user without read permission attempts to view a resource
Then the resource detail page is not displayed.

## AC-DM-004-3 — Permission Change Audit

Given a data manager changes permissions on a resource
Then the change is recorded in the audit log.

---

# US-GIS-001 — Dataset Publishing

## AC-GIS-001-1 — WMS Publication

Given a GIS professional selects a published vector resource for WMS publishing
Then the resource becomes available as a WMS layer within 5 minutes.

## AC-GIS-001-2 — WFS Publication

Given a GIS professional selects a vector resource for WFS publishing
Then the resource becomes available as a WFS feature type with queryable attributes.

## AC-GIS-001-3 — Publishing Status

Given a publication is in progress
Then the user can see the current status of the publishing operation.

## AC-GIS-001-4 — Publication Failure

Given a publishing operation fails
Then the user receives an error message with details about the failure.

---

# US-ADM-001 — User Management

## AC-ADM-001-1 — Create User

Given an administrator is on the user management page
When they create a new user with email and password
Then the user can log in with the provided credentials.

## AC-ADM-001-2 — Deactivate User

Given an administrator deactivates a user account
Then the user cannot log in and existing sessions are invalidated.

---

# US-ADM-005 — Audit Log

## AC-ADM-005-1 — Resource Events

Given resources have been created, updated, or deleted
When an administrator views the audit log
Then all resource lifecycle events are listed with timestamp, user, and action.

## AC-ADM-005-2 — Log Filtering

Given the audit log contains many events
When an administrator filters by date range or user
Then only matching events are displayed.

---

# Completion Notes

Acceptance criteria should be converted to automated tests during implementation.

Each AC maps to one or more test cases.

Not all stories have ACs defined here — add as implementation progresses.
