# GeoSpatial Resource Platform — Project Glossary

Version:

1.0


Purpose:

Define common terminology used throughout the project.

This glossary ensures humans and AI agents use consistent meanings.

---

# Core Domain Terms

## Resource

Definition:

The primary domain object of the platform.

A Resource represents any managed digital asset.

Examples:

- vector dataset
- raster dataset
- document
- image
- video
- report
- 3D asset
- external service


A Resource may contain:

- metadata
- attachments
- relationships
- permissions
- visualization configuration

---

## Layer

Definition:

A visualization or publishing concept.

A Layer is NOT the primary business object.


Examples:

- GeoServer WMS layer
- MapStore map layer


A Resource may produce one or more Layers.

---

## Dataset

Definition:

A structured collection of data.

Examples:

- vector feature collection
- raster coverage
- point cloud


A Dataset is a type of Resource.

---

## Asset

Definition:

Any stored digital object managed by the platform.

Examples:

- file
- image
- document
- dataset


---

## Metadata

Definition:

Information describing a Resource.

Examples:

- title
- description
- owner
- creation date
- spatial extent
- coordinate reference system

---

## Attachment

Definition:

A file or external object associated with a Resource.

Examples:

- PDF documentation
- image
- style file
- report

---

## Relationship

Definition:

A connection between Resources.

Examples:

- HAS_DOCUMENT
- DERIVED_FROM
- RELATED_TO
- PART_OF

---

## Project

Definition:

A logical grouping of related Resources.

Used for organizing work and collaboration.

---

## Collection

Definition:

A group of Resources assembled for discovery or presentation.

---

# Geospatial Terms

## Vector Data

Data represented using geometries:

- points
- lines
- polygons


---

## Raster Data

Grid-based spatial data.

Examples:

- satellite imagery
- elevation models

---

## Point Cloud

Large collections of 3D points.

Examples:

- LiDAR data


---

## Terrain

Representation of elevation surfaces.

---

## 3D Tiles

Streaming format for large 3D datasets.

---

## Coordinate Reference System (CRS)

A system defining how spatial coordinates relate to the Earth.

Examples:

- EPSG:4326
- EPSG:3857

---

# Platform Terms

## Viewer

A component responsible for visualizing Resources.

Examples:

- MapStore
- CesiumJS
- Potree


Viewers are plugins.

---

## Publisher

A component that exposes Resources through external services.

Example:

GeoServer


---

## Harvester

A component that imports or synchronizes external metadata/resources.

---

## Trace Bullet

A minimal complete implementation path.

Example:

User Interface

↓

API

↓

Database

↓

Verification


Purpose:

Validate architecture early.

---

# Agent Terms

## Memory Tattoo

Persistent project state written by agents before ending sessions.

---

## Context Isolation

Providing agents only the information required for their task.

---

## Evaluator-Optimizer Loop

A workflow where:

one agent creates

↓

another evaluates

↓

feedback improves result

---

# Naming Rule

When a term is ambiguous:

Prefer the project glossary definition over external assumptions.