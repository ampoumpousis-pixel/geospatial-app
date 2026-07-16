# GeoSpatial Resource Platform — Personas

Version: 1.0

Status: Draft — validated by human owner

Purpose:
Define the user types that interact with the platform.

---

# Persona 1 — Public User

## Description

A member of the general public accessing published geospatial resources.

## Goals

- discover available resources
- view resource information and metadata
- visualize resources on maps
- download resources when permitted

## Responsibilities

- search for resources
- browse collections
- view resource details
- use embedded viewers
- download public datasets

## Permissions

- read published resources
- download publicly available data
- no write or administrative access

## Pain Points

- cannot find relevant resources due to poor search
- unclear metadata makes resources unusable
- slow loading of large datasets
- no guidance on available data

## Success Definition

Can find, view, and download the resource they need without assistance.

---

# Persona 2 — Data Manager

## Description

An internal organizational user responsible for uploading, maintaining, and organizing resources.

## Goals

- add resources to the platform
- manage metadata quality
- organize resources into collections
- control who can access resources

## Responsibilities

- upload resources (files, datasets, documents)
- fill and maintain metadata
- organize resources in collections and projects
- set access permissions
- update and archive resources

## Permissions

- create, read, update, archive own resources
- manage metadata on assigned resources
- manage permissions on owned resources
- view all public resources

## Pain Points

- uploading large datasets is slow or unreliable
- metadata entry is tedious and repetitive
- unclear how to organize resources effectively
- permission management is confusing

## Success Definition

Can upload a resource once and have its metadata, permissions, and organization handled efficiently.

---

# Persona 3 — GIS Professional

## Description

An internal power user who performs spatial analysis, creates visualizations, and publishes services.

## Goals

- prepare spatial data for public consumption
- create map visualizations
- publish OGC services (WMS, WFS, WMTS)
- integrate with desktop GIS tools

## Responsibilities

- configure how resources are visualized
- publish resources through GeoServer
- manage layer styles and symbology
- validate data quality before publication
- set up 3D visualizations (point clouds, terrain)

## Permissions

- all Data Manager permissions
- publish resources to external services
- configure viewer settings
- manage resource relationships

## Pain Points

- publishing workflow is complex and manual
- limited support for advanced visualization types
- difficulty managing layer styles
- performance issues with large 3D datasets

## Success Definition

Can take a raw dataset through to a published, styled service with minimal manual steps.

---

# Persona 4 — Administrator

## Description

The system administrator responsible for platform configuration, user management, and operational health.

## Goals

- manage users, groups, and roles
- monitor system health
- configure platform settings
- ensure security and compliance

## Responsibilities

- create and manage user accounts
- define roles and permission groups
- monitor storage and performance
- manage system configuration
- oversee integration services (GeoServer, viewers)

## Permissions

- full system access
- user and group management
- system configuration
- access to all resources

## Pain Points

- no visibility into system usage and performance
- user management is manual
- troubleshooting publishing issues is difficult
- no audit trail for resource changes

## Success Definition

Can manage the platform, users, and integrations from a single interface with clear monitoring.

---

# Persona Discovery Notes

These personas are derived from:

- PROJECT_FACTS.md (Target Users section)
- Human owner validation (public-sector global organization, public + internal power users)

Assumptions:

Assumption:
Internal users (Data Manager, GIS Professional) exist within the same organization.

Reason:
Human owner described "global organization public sector that serve data to public but also do internal work as power users."

Validation Needed:
Confirm whether multiple organizations will share a single platform instance or each has its own instance.

Impact If Wrong:
Multi-tenancy requirements would need to be added to architecture scope.
