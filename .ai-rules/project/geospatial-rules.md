# GeoSpatial Platform Project Rules

Version:

1.0


Applies to:

All agents working on the GeoSpatial Resource Platform.

Purpose:

Define project-specific engineering rules and domain constraints.

These rules override generic assumptions about GIS platforms.

---

# Rule 1 — Resource Is the Core Domain Object

The primary business entity is:

Resource


Everything managed by the platform is modeled as a Resource.

Examples:

- vector dataset
- raster dataset
- point cloud
- document
- image
- video
- report
- 3D asset
- external service

---

# Rule 2 — Do Not Build Around Layers

Layers are NOT the main domain concept.

A Layer is only:

- a visualization concept
- a publishing concept
- a rendering representation


Examples:

A Resource may produce:

```

Resource

↓

GeoServer Layer

↓

WMS/WFS Service

```

or:

```

Resource

↓

Cesium Visualization

↓

3D Tiles

```

---

# Rule 3 — Resource Types Are Extensible

The system should support different Resource types.

Avoid designs that assume only:

- vector layers
- raster layers


Future resource types should be possible without redesigning the core system.

---

# Rule 4 — Modular Monolith Architecture

The initial architecture is:

Modular Monolith


Do not create:

- microservices
- unnecessary APIs between internal modules
- distributed complexity


Modules communicate through:

- clear interfaces
- services
- domain boundaries

---

# Rule 5 — Business Logic Does Not Belong in Views

Django views and API endpoints should coordinate requests.

They should not contain:

- complex business rules
- publishing logic
- permission decisions
- processing workflows

Prefer:

```

API

↓

Application Service

↓

Domain Logic

↓

Infrastructure

```

---

# Rule 6 — Django Application Boundaries Matter

Django apps represent business capabilities.

Avoid creating apps only because of database tables.

Prefer:

```

resources

metadata

attachments

permissions

publishers

viewers

search

```

over:

```

resource_table

metadata_table

attachment_table

```

---

# Rule 7 — PostGIS Is the Spatial Foundation

Spatial functionality should use:

PostgreSQL + PostGIS


Use PostGIS for:

- geometry storage
- spatial queries
- bounding boxes
- spatial relationships


Do not create custom spatial storage mechanisms without strong justification.

---

# Rule 8 — GeoServer Is a Publisher

GeoServer is not the core system.

The relationship is:

```

Resource

↓

Publisher

↓

GeoServer

↓

OGC Services

```

The platform owns resources.

GeoServer exposes them.

---

# Rule 9 — Viewers Are Plugins

Visualization systems are external capabilities.

Examples:

- MapStore
- CesiumJS
- Potree


The platform should not depend directly on viewer implementations.

Use:

```

Resource

↓

Viewer Selection

↓

Viewer Plugin

↓

Visualization

```

---

# Rule 10 — Metadata Is First Class

Metadata is not an optional description field.

Resources require support for:

- descriptive metadata
- technical metadata
- spatial metadata
- lifecycle information

---

# Rule 11 — Relationships Are First Class

Do not hard-code every relationship.

Avoid:

```

resource.document_id

resource.image_id

resource.video_id

```

Prefer a generic relationship system.

Examples:

```

Resource A

HAS_DOCUMENT

Resource B

```

---

# Rule 12 — Media Is a First Class Asset

Documents and media are not secondary attachments.

The platform manages:

- datasets
- documents
- images
- videos
- reports

using a common resource philosophy.

---

# Rule 13 — Publishing Must Be Abstracted

Do not couple resources directly to GeoServer.

Use publisher abstractions.

Example:

```

Publisher Interface

```
    |
```

---

GeoServer Publisher

Future Publisher

```

---

# Rule 14 — Storage Must Be Abstracted

Do not hard-code file storage.

Support:

- local filesystem
- S3 compatible storage
- MinIO


Use storage abstraction boundaries.

---

# Rule 15 — Background Work Uses Jobs

Long operations must not block requests.

Examples:

- thumbnail generation
- metadata extraction
- harvesting
- publishing
- indexing
- 3D processing


Use:

Celery + Redis

---

# Rule 16 — GIS Processing Requires Explicit Ownership

Before adding spatial processing:

Define:

- who needs it
- why it exists
- expected input/output
- performance requirements

Avoid building generic GIS tools without requirements.

---

# Rule 17 — Future Event Compatibility

Do not implement event-driven architecture yet.

However:

Design so future events are possible.

Examples:

```

ResourceCreated

MetadataUpdated

AttachmentAdded

DatasetPublished

```

Modules should avoid hidden coupling.

---

# Rule 18 — Large Data Awareness

Assume geospatial data can be large.

Consider:

- streaming
- asynchronous processing
- storage limits
- indexing
- pagination
- previews


Never assume small datasets.

---

# Rule 19 — API Design

APIs should expose business concepts.

Prefer:

```

/resources/

/collections/

/projects/

/publishers/

```

Avoid exposing implementation details.

---

# Rule 20 — Domain Language

Use the project glossary.

When uncertain:

PROJECT_GLOSSARY.md

is the authority.

---

# Geospatial Golden Rule

The platform manages resources.

Maps, layers, viewers, and services are ways of using those resources.

They are not the foundation.
```

---