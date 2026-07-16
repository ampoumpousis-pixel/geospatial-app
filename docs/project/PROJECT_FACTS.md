# GeoSpatial Resource Platform — Project Facts

Version:

1.0


Status:

Foundation Phase


Purpose:

Provide a stable reference containing the fundamental facts of the project.

This document represents the current known truth of the system.

Changes to this document require deliberate review.

---

# Project Identity

Name:

GeoSpatial Resource Platform


Project Type:

Production-grade geospatial resource management platform


Domain:

Geospatial data management, discovery, visualization, publishing, and sharing.


---

# Mission

Build a flexible platform where organizations can manage, discover, visualize, and share geospatial and non-geospatial resources.

The platform treats all managed assets as Resources.

A Resource may represent:

- spatial datasets
- documents
- images
- videos
- reports
- styles
- metadata
- external services
- collections
- projects

---

# Core Domain Principle

The fundamental domain object is:

Resource


The platform is NOT designed around GIS Layers.

Layers are considered visualization and publishing concepts.

Resources are the primary business objects.

---

# Target Users

Initial user groups:

## Organizations

Organizations manage geospatial assets and publish information.


## Data Managers

Responsible for:

- uploading resources
- managing metadata
- controlling access


## GIS Professionals

Responsible for:

- spatial analysis
- visualization
- publishing


## Public Users

Responsible for:

- discovering
- viewing
- downloading available resources

---

# Technology Foundation

## Backend

Framework:

Django 5

API:

Django REST Framework


## Database

PostgreSQL

Extension:

PostGIS


## Background Processing

Celery

Redis


## Frontend

Framework:

React

Language:

TypeScript

UI:

Material UI


## Visualization

Supported technologies:

- GeoServer
- MapStore
- CesiumJS
- Potree


## Storage

Supported:

- Local storage
- S3 compatible storage
- MinIO

---

# Architectural Constraints

The system follows:

## Modular Monolith Architecture

The initial system must NOT use microservices.


Reason:

Maintain simplicity while preserving future evolution paths.

---

## Resource-Centric Design

Business logic must be organized around Resources.

Layers are not the primary abstraction.

---

## Plugin-Oriented Extensions

The platform should support future extension through:

- viewer plugins
- publisher plugins
- storage adapters

---

## Future Event Capability

The system should be designed so future event-driven architecture is possible.

Events are not implemented initially.

---

# Core Functional Areas

The platform must support:

- resource management
- metadata management
- attachments
- relationships
- permissions
- visualization
- publishing
- search
- harvesting
- downloads
- auditing

---

# Initial Visualization Targets

Supported viewers:

## 2D

MapStore


## 3D Globe

CesiumJS


## Point Cloud

Potree


The core platform must remain independent of viewer implementations.

---

# Data Philosophy

All assets are treated as managed resources.

Resources may contain:

- metadata
- files
- relationships
- permissions
- visualization configuration
- publishing information

---

# Development Philosophy

The project follows:

- requirements before implementation
- architecture before coding
- trace bullets before large features
- automated verification
- continuous documentation
- incremental delivery

---

# Current Development Phase

Phase:

Engineering Foundation


Completed:

- Virtual company structure
- Engineering principles
- Workflow definition
- Project initialization planning


Current:

Creating project knowledge foundation


Next:

- Requirements discovery
- Architecture design
- Feature planning

---

# Important Constraints

Avoid:

- building a GeoNode clone
- treating layers as the main object
- unnecessary microservices
- premature complexity
- undocumented decisions

---

# Source of Truth Priority

When conflicts occur, use this priority:

1. Human decisions
2. Approved ADRs
3. PROJECT_FACTS.md
4. Requirements documents
5. Implementation details