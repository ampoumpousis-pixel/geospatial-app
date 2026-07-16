# ADR-006: Flexible Metadata Storage

Status: Accepted

Date: 2026-07-14

---

## Context

Resources may have widely varying metadata requirements. A vector dataset needs spatial extent, CRS, and attribute schema. A document needs author, page count, and publication date. A fixed-column metadata model would either be very wide (many nullable columns) or require schema changes for each new resource type.

## Decision

Use a **key-value metadata model** rather than fixed columns.

Key design choices:
- Metadata is stored as rows: (resource_id, key, value, data_type)
- Standard metadata fields (title, description) remain on the Resource model
- Type-specific metadata is stored in the key-value model
- Automatic extraction populates known metadata keys
- Metadata schema validation is application-level, not database-level
- Common metadata keys are documented for consistency

## Consequences

Positive:
- Any resource type can have arbitrary metadata without schema changes
- Easy to add new metadata fields
- Simple query pattern for metadata-based search
- Natural fit for metadata standards (ISO 19115, Dublin Core)

Negative:
- No database-level type enforcement for metadata values
- Querying across metadata keys requires careful indexing
- Application code must validate metadata consistency
- Reporting across metadata values is more complex

## Alternatives Considered

1. Fixed columns per resource type (table-per-type) — rejected because it requires schema changes for new types
2. JSON/JSONB field on Resource — rejected because it's harder to query individual keys efficiently
3. Separate metadata tables per resource type — rejected because it duplicates infrastructure
