# ADR-003: Django REST Framework for API Layer

Status: Accepted

Date: 2026-07-14

---

## Context

The platform requires a REST API for frontend communication and potential external integration. The backend technology is already Django 5.

## Decision

Use **Django REST Framework (DRF)** for building the API layer.

Key design choices:
- ViewSets with ModelSerializers for standard CRUD endpoints
- Custom API views for complex operations (publishing, search)
- Token-based authentication (DRF TokenAuth) initially
- OpenAPI schema generation via drf-spectacular
- Standardized error response format

## Consequences

Positive:
- Tight integration with Django ORM
- Mature, well-documented framework
- Built-in browsable API for development
- Strong serialization and validation
- Easy permission integration

Negative:
- Tied to Django ecosystem
- Some API patterns require override of DRF defaults

## Alternatives Considered

1. GraphQL (Graphene-Django) — rejected because the API is primarily CRUD with minimal complex queries
2. FastAPI — rejected because Django is the chosen backend framework
3. Plain Django views — rejected because DRF provides better API ergonomics
