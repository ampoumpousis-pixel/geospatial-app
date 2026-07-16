# GeoSpatial Resource Platform — Domain Model

Version: 1.0

Status: Draft

Purpose:
Define the core domain entities, their relationships, and boundaries.

---

# Core Domain

The platform centers around the **Resource** entity.

```mermaid
classDiagram
    class Resource {
        +UUID id
        +string title
        +string description
        +ResourceType type
        +User owner
        +datetime created_at
        +datetime updated_at
        +ResourceStatus status
        +Geometry spatial_extent
        +string crs
        +boolean is_public
    }

    class ResourceType {
        <<enumeration>>
        VECTOR_DATASET
        RASTER_DATASET
        POINT_CLOUD
        DOCUMENT
        IMAGE
        VIDEO
        EXTERNAL_LINK
    }

    class ResourceStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        ARCHIVED
    }

    class Metadata {
        +UUID id
        +Resource resource
        +string key
        +string value
        +string data_type
    }

    class Attachment {
        +UUID id
        +Resource resource
        +string filename
        +string mime_type
        +bigint size
        +string storage_path
        +string storage_backend
        +datetime uploaded_at
    }

    class Relationship {
        +UUID id
        +Resource source
        +Resource target
        +RelationshipType type
        +string label
    }

    class RelationshipType {
        <<enumeration>>
        DERIVED_FROM
        HAS_DOCUMENT
        RELATED_TO
        PART_OF
        REPLACES
    }

    class Collection {
        +UUID id
        +string name
        +string description
        +User owner
        +datetime created_at
    }

    class Project {
        +UUID id
        +string name
        +string description
        +User owner
        +datetime created_at
    }

    Resource "1" --> "1" ResourceType
    Resource "1" --> "1" ResourceStatus
    Resource "1" --> "*" Metadata
    Resource "1" --> "*" Attachment
    Resource "1" --> "*" Relationship : source
    Resource "1" --> "*" Relationship : target
    Collection "*" --> "*" Resource
    Project "1" --> "*" Resource
```

---

# Identity and Access Domain

```mermaid
classDiagram
    class User {
        +UUID id
        +string username
        +string email
        +string password_hash
        +boolean is_active
        +datetime created_at
    }

    class Group {
        +UUID id
        +string name
        +string description
    }

    class Role {
        +UUID id
        +string name
        +PermissionSet permissions
    }

    class ResourcePermission {
        +UUID id
        +Resource resource
        +User user
        +Group group
        +PermissionLevel level
    }

    class PermissionLevel {
        <<enumeration>>
        VIEW
        DOWNLOAD
        EDIT
        MANAGE
    }

    User "*" --> "*" Group
    Group "*" --> "*" Role
    User "1" --> "*" ResourcePermission
    Group "1" --> "*" ResourcePermission
    ResourcePermission "*" --> "1" Resource
    ResourcePermission "*" --> "1" PermissionLevel
```

---

# Publishing Domain

```mermaid
classDiagram
    class Publisher {
        <<interface>>
        +publish(resource, config)
        +unpublish(resource)
        +get_status(resource)
    }

    class GeoServerPublisher {
        +base_url
        +username
        +password
        +publish(resource, config)
        +unpublish(resource)
        +get_status(resource)
    }

    class PublishedService {
        +UUID id
        +Resource resource
        +string service_type
        +string service_url
        +string layer_name
        +datetime published_at
        +ServiceStatus status
    }

    class ServiceType {
        <<enumeration>>
        WMS
        WFS
        WMTS
    }

    class ServiceStatus {
        <<enumeration>>
        ACTIVE
        ERROR
        REMOVED
    }

    Publisher <|.. GeoServerPublisher
    Resource "1" --> "*" PublishedService
    PublishedService "1" --> "1" ServiceType
    PublishedService "1" --> "1" ServiceStatus
```

---

# Visualization Domain

```mermaid
classDiagram
    class Viewer {
        <<interface>>
        +can_view(resource_type)
        +get_viewer_url(resource)
        +get_config(resource)
    }

    class MapStoreViewer {
        +can_view(resource_type)
        +get_viewer_url(resource)
        +get_config(resource)
    }

    class CesiumViewer {
        +can_view(resource_type)
        +get_viewer_url(resource)
        +get_config(resource)
    }

    class PotreeViewer {
        +can_view(resource_type)
        +get_viewer_url(resource)
        +get_config(resource)
    }

    Viewer <|.. MapStoreViewer
    Viewer <|.. CesiumViewer
    Viewer <|.. PotreeViewer
```

---

# Job Domain

```mermaid
classDiagram
    class Job {
        +UUID id
        +string task_name
        +string status
        +dict arguments
        +dict result
        +datetime created_at
        +datetime completed_at
        +string error_message
    }

    class JobStatus {
        <<enumeration>>
        PENDING
        RUNNING
        COMPLETED
        FAILED
        CANCELLED
    }

    Job "1" --> "1" JobStatus
```

---

# Domain Boundaries Summary

| Module | Core Entities | Responsibility |
|---|---|---|
| Resources | Resource, ResourceType, ResourceStatus | Resource lifecycle |
| Metadata | Metadata | Flexible metadata key-value store |
| Attachments | Attachment | File storage abstraction |
| Relationships | Relationship, RelationshipType | Links between resources |
| Organization | Collection, Project | Resource grouping |
| Identity | User, Group, Role | Users and authentication |
| Permissions | ResourcePermission, PermissionLevel | Object-level access control |
| Publishing | Publisher (interface), GeoServerPublisher, PublishedService | OGC service publishing |
| Visualization | Viewer (interface), MapStoreViewer, CesiumViewer, PotreeViewer | Resource visualization |
| Jobs | Job, JobStatus | Background processing |
