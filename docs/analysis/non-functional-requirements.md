# GeoSpatial Resource Platform — Non-Functional Requirements

Version: 1.0

Status: Draft

Purpose:
Define system quality attributes and operational constraints.

---

# NFR-01 — Scale

## NFR-01-01 — Users

Initial target: up to 100 registered users, up to 10 concurrent users.

## NFR-01-02 — Resources

Initial target: up to 10,000 resources with 500 GB total storage.

## NFR-01-03 — Organizations

Initial target: single organization (future multi-tenant capability).

## NFR-01-04 — Growth

The system should handle 2x growth without architectural changes.

---

# NFR-02 — Performance

## NFR-02-01 — Search Response

Search queries must return results within 2 seconds at p95 for up to 10,000 resources.

## NFR-02-02 — Page Load

Resource detail pages must load within 3 seconds at p95.

## NFR-02-03 — Map Preview

Map previews for vector resources must render within 5 seconds.

## NFR-02-04 — Upload Throughput

The system should accept file uploads at line speed (network-constrained).

## NFR-02-05 — API Response

API endpoints (non-search) must respond within 500 ms at p95.

---

# NFR-03 — Availability

## NFR-03-01 — Uptime

Target 99.5% uptime during business hours (08:00–18:00).

## NFR-03-02 — Maintenance

Maintenance windows should be outside business hours.

## NFR-03-03 — Recovery

System should recover from failure within 30 minutes.

## NFR-03-04 — Backup

Automated daily backups of database and file storage.

---

# NFR-04 — Security

## NFR-04-01 — Authentication

All API endpoints (except public resource access) require authentication.

## NFR-04-02 — Authorization

Access control must be enforced server-side for every resource operation.

## NFR-04-03 — Secrets

Passwords, API keys, and service credentials must not be stored in plain text.

## NFR-04-04 — HTTPS

All communication must use HTTPS in production.

## NFR-04-05 — Audit Trail

All resource mutations must be logged with user, timestamp, and action.

---

# NFR-05 — Storage

## NFR-05-01 — File Storage

The system must support configurable file storage backend (local or S3-compatible).

## NFR-05-02 — Database

PostgreSQL with PostGIS extension for all persistent data.

## NFR-05-03 — Backup

Database and file storage backups must be configurable.

---

# NFR-06 — Data Retention

## NFR-06-01 — Resource Retention

Resources remain in the system until explicitly deleted by authorized users.

## NFR-06-02 — Audit Retention

Audit logs retained for a minimum of 1 year (configurable).

## NFR-06-03 — Deletion

Deleted resources may be soft-deleted with a configurable purge interval.

---

# NFR-07 — Deployment

## NFR-07-01 — On-Premise

The system must be deployable on customer-controlled infrastructure.

## NFR-07-02 — Containerization

The system must use Docker containers for all components.

## NFR-07-03 — Environment Parity

Development, staging, and production environments must use the same container images.

---

# NFR-08 — Maintainability

## NFR-08-01 — Modularity

The backend must be organized into Django apps representing business capabilities.

## NFR-08-02 — Test Coverage

Core business logic must have at least 80% test coverage.

## NFR-08-03 — Documentation

Architecture decisions must be recorded as ADRs.

---

# NFR-09 — Browser Support

## NFR-09-01 — Desktop Browsers

Support latest two versions of Chrome, Firefox, Safari, and Edge (desktop).

## NFR-09-02 — Mobile Browsers

Support latest two versions of Chrome and Safari on mobile devices (responsive layout).

---

# NFR-10 — Internationalization

## NFR-10-01 — Language Support

The UI must support English initially, with a framework for additional languages.

---

# Open Questions

The following non-functional aspects require future validation:

- Expected backup/restore RPO and RTO targets
- Specific compliance requirements (e.g., GDPR, national geospatial data policies)
- Network bandwidth constraints at customer sites
- Whether high availability (active-active) is needed
- Specific SLAs for publishing operations
