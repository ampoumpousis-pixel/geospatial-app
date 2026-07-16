# GeoSpatial Resource Platform — Use Cases

Version: 1.0

Status: Draft

Purpose:
Define detailed use cases for key user-system interactions.

---

# UC-01 — Upload and Register a Resource

## Actor

Data Manager

## Preconditions

- User is authenticated
- User has upload permission
- A supported file is available locally

## Main Flow

1. User navigates to the upload page
2. User selects a file from local storage
3. User enters required metadata fields
4. User submits the upload form
5. System validates the file format and metadata
6. System uploads the file to storage
7. System extracts available metadata from the file
8. System creates a Resource record with provided and extracted metadata
9. System generates a thumbnail if applicable
10. System confirms successful upload with resource detail link

## Alternative Flows

### 1a — Large File
1. At step 5, system detects file > 100 MB
2. System initiates asynchronous upload job
3. User receives confirmation that upload is queued
4. System notifies user when upload and processing are complete

### 1b — Validation Failure
1. At step 5, system detects invalid file format or missing required metadata
2. System returns validation errors
3. User corrects errors and resubmits

### 1c — Upload Failure
1. At step 6, upload fails due to network or storage error
2. System shows error message with retry option
3. User can retry or cancel

## Postconditions

- Resource exists in the system with status "draft"
- Metadata is stored and searchable
- File is stored in configured storage backend

---

# UC-02 — Search and Discover Resources

## Actor

Public User

## Preconditions

- None (user may be unauthenticated)

## Main Flow

1. User enters a keyword in the search bar
2. User optionally applies filters (type, spatial extent, date)
3. System queries the resource catalog
4. System displays matching results with title, type, thumbnail, and spatial extent
5. User browses results using pagination
6. User clicks a result to view details

## Alternative Flows

### 2a — No Results
1. At step 4, no resources match
2. System displays "no results" message with suggestions (remove filters, try different keywords)

### 2b — Spatial Search
1. At step 2, user draws a bounding box on a map
2. System filters results to resources intersecting the bounding box

## Postconditions

- User has found relevant resources or confirmed none exist for their criteria

---

# UC-03 — Publish a Resource as WMS

## Actor

GIS Professional

## Preconditions

- User is authenticated
- User has publish permission
- Resource exists and has been uploaded
- GeoServer connection is configured

## Main Flow

1. User selects a resource from the catalog
2. User opens the publishing panel
3. User selects WMS as the service type
4. User configures publishing options (layer name, CRS, bounding box)
5. User clicks Publish
6. System validates resource compatibility for WMS publishing
7. System initiates publishing job to GeoServer
8. System displays publishing progress status
9. GeoServer creates the WMS layer
10. System updates resource status to "published"
11. System displays the WMS URL for the published layer

## Alternative Flows

### 3a — Publishing Failure
1. At step 7, GeoServer returns an error
2. System marks publishing as failed
3. System displays error details
4. User can review and retry

### 3b — Incompatible Resource
1. At step 6, system determines resource type is not publishable as WMS
2. System displays compatible service options
3. User selects an alternative service type

## Postconditions

- Resource is published as WMS service
- WMS URL is stored with the resource
- Resource status is "published"

---

# UC-04 — Manage Resource Permissions

## Actor

Data Manager

## Preconditions

- User is authenticated
- User owns or has manage permission on the resource

## Main Flow

1. User opens the resource management page
2. User selects the sharing/permissions tab
3. System displays current permissions
4. User adds a user or group
5. User selects permission level (view, download, edit, manage)
6. System saves the permission
7. System updates the permission display

## Alternative Flows

### 4a — Remove Permission
1. At step 4, user removes an existing user/group entry
2. System confirms removal
3. System updates permissions

### 4b — Make Public
1. User toggles the public access option
2. System confirms resource is now publicly accessible
3. System logs the permission change

## Postconditions

- Resource permissions are updated
- Audit log records the change

---

# UC-05 — View 3D Point Cloud

## Actor

Public User

## Preconditions

- Public user is on the resource detail page
- Resource is a point cloud type
- Resource is publicly accessible

## Main Flow

1. System detects the resource is point cloud type
2. System displays the Potree viewer in the resource detail page
3. System streams point cloud data to the viewer
4. User navigates the 3D scene (rotate, zoom, pan)
5. User can toggle point attributes (e.g., elevation, intensity)

## Postconditions

- User has explored the point cloud in 3D

---

# UC-06 — Configure a New User

## Actor

Administrator

## Preconditions

- Administrator is authenticated
- Administrator has admin privileges

## Main Flow

1. Administrator navigates to user management
2. System displays list of existing users
3. Administrator clicks "Create User"
4. Administrator enters email, username, and password
5. Administrator assigns user to groups
6. System creates the user account
7. System displays confirmation

## Alternative Flows

### 6a — Duplicate Email
1. At step 6, email already exists
2. System returns validation error
3. Administrator corrects the email

## Postconditions

- User account exists
- User can log in with created credentials
