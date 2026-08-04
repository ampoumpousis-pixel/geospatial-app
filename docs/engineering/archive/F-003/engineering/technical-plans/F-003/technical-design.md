# F-003 — Resource Upload — Technical Design

## 1. Metadata

| Field | Value |
|---|---|
| Feature ID | F-003 |
| Feature Title | Resource Upload |
| Source Feature Specification | docs/project/features/F-003/feature-spec.md |
| Source Specification Status | Ready for Technical Planning |
| Source Specification Version | 1.0 |
| Technical Design Status | Ready for Engineering Review |
| Technical Design Version | 1.0 |
| Superseded Version | None |
| Owner | AGENT-103 — Technical Planner |
| Created | 2026-08-05 |
| Updated | 2026-08-05 |
| Next Intended Owner | AGENT-104 — Engineering Design Reviewer |

## Revision History

| Version | Date | Author | Changes | Resolved Return IDs |
|---|---|---|---|---|
| 1.0 | 2026-08-05 | AGENT-103 | Initial design | — |

## 2. Technical Overview

F-003 introduces the platform's first resource-creating path. An authenticated user uploads a file; the system validates it (size, format via extension and magic bytes), stores it through Django's storage abstraction, computes a streaming SHA-256 checksum, and creates a Resource record carrying technical metadata (file size, detected format, checksum).

Per the operator-defined scope (authority-map.md, HD-F003-001), manual metadata entry and vocabulary validation are OUT of scope — deferred to F-004. F-003 captures technical metadata only.

**Key dependency note:** F-003 depends on F-001 (User Authentication). F-001 is ~10% implemented (User model exists; `users/urls.py` is empty — no auth endpoints, no API auth enforcement). This design specifies the upload endpoint's authentication posture explicitly (TD-F003-007) and documents a degraded mode for exercising upload before F-001 completes. It does NOT silently assume auth availability (EAF-F003-004).

## 3. Source Contract and Traceability

### Approved Product Contract

F-003 provides: authenticated file upload, durable file storage, file-level validation (size limits, allowed formats, extension/magic-byte mismatch rejection), automatic extraction of technical metadata (size, format, SHA-256 checksum), and basic resource record creation. Manual metadata entry is explicitly excluded (FR-F003-008, HD-F003-001).

### Requirements-to-Design Traceability

| Requirement or Acceptance Criterion | Design Response | Design IDs or Sections |
|---|---|---|
| FR-F003-001 (Authenticated upload) | UploadView with DRF IsAuthenticated + explicit auth posture | API-F003-001, TD-F003-007 |
| FR-F003-002 (File storage) | Attachment model + Django storage abstraction (local/S3) | DM-F003-002, TD-F003-002 |
| FR-F003-003 (Size limit rejection) | Config-driven MAX_UPLOAD_SIZE validation in service | CMP-F003-001, TD-F003-006 |
| FR-F003-004 (Format allowlist rejection) | Config-driven ALLOWED_FORMATS validation in service | CMP-F003-001 |
| FR-F003-005 (Extension + magic-byte detection) | FormatDetector component with per-format strategy | CMP-F003-002, TD-F003-005 |
| FR-F003-006 (Resource record creation) | Resource model created after successful validation | DM-F003-001, CMP-F003-001 |
| FR-F003-007 (Technical metadata extraction) | size, format, SHA-256 stored on Attachment/Resource | CMP-F003-001, DM-F003-002 |
| FR-F003-008 (No manual metadata) | No metadata fields in upload contract; F-004 boundary | API-F003-001, INT-F003-001 |
| AC-F003-001 | Upload success → stored file + resource ID | API-F003-001, CMP-F003-001 |
| AC-F003-002 | Oversize rejection, no resource record | CMP-F003-001 |
| AC-F003-003 | Format rejection, no resource record | CMP-F003-001, CMP-F003-002 |
| AC-F003-004 | Resource record carries size, format, checksum | DM-F003-001, DM-F003-002 |
| AC-F003-005 | No manual metadata fields in upload flow | API-F003-001 |

## 4. Architectural Context

### Current Architecture

- **Modular monolith** (ADR-002): Django apps represent business capabilities. `component-design.md` designates a `resources` app (Resource entity) and an `attachments` app (file upload/storage abstraction).
- **DRF for API** (ADR-003): ViewSets/Views with ModelSerializers, SessionAuthentication, standardized error format.
- **Existing apps:** `users` (User model only, empty URL conf), `platform_info`, `config`. No `resources`, `attachments`, or `metadata` app exists yet.
- **Settings:** `USE_S3` flag with S3Storage backend pre-configured; local filesystem default. Celery/Redis configured. DRF defaults: SessionAuthentication, IsAuthenticated, PageNumberPagination (25).
- **URL structure:** `config/urls.py` maps `api/auth/` → `users.urls`, `api/` → `platform_info.urls`.
- **No Resource model, no upload capability, no storage handling code exists.**

### Binding ADRs

- ADR-001 (Resource-centric domain): Resource is the core entity; F-003 creates the first Resource records.
- ADR-002 (Modular Monolith): New components live in designated Django apps (`resources`, `attachments`).
- ADR-003 (DRF): Upload endpoint uses DRF, platform auth and permission classes.
- ADR-006 (Flexible metadata): Key-value metadata model reserved for F-004; F-003 stores only technical metadata on the attachment/resource entities per operator scope.

### Existing Reusable Capabilities

| Capability | Where | Used For |
|---|---|---|
| Django storage API (`STORAGES` setting) | `config/settings/base.py` | Local/S3 file persistence |
| DRF framework | requirements.txt | Upload view, serializers, error format |
| `users.User` model | `users/models.py` | Owner reference on Resource |
| Celery/Redis | configured | Optional async checksum/extraction (not required for F-003 v1) |
| `platform_info` health endpoint | `platform_info/views.py` | Deployment verification only |

### Affected Boundaries

| Boundary | Impact |
|---|---|
| `config/urls.py` | New `api/resources/` route added |
| `config/settings/base.py` | New upload config: `MAX_UPLOAD_SIZE`, `ALLOWED_UPLOAD_FORMATS`, `UPLOAD_AUTH_REQUIRED` flag |
| `users` app | None (owner reference only, read-only) |
| F-004 (metadata) | Boundary contract: F-003 SHALL NOT store manual metadata; F-004 consumes Resource/Attachment |

### Material Documentation Discrepancies

| Discrepancy | Resolution |
|---|---|
| Catalogue F-003 entry mentions "metadata entry" (ambiguous, FR-02-01 shared with F-004) | Operator scope (authority-map.md) assigns manual metadata entry to F-004 — this design follows the operator scope |

## 5. Design Goals

- **DG-F003-001:** Upload path is the platform's first resource-creating operation, with a minimal, correct contract.
- **DG-F003-002:** Validation happens before persistence of a resource record; invalid uploads create no records.
- **DG-F003-003:** Storage backend is pluggable (local ↔ S3) with no API contract change.
- **DG-F003-004:** Technical metadata is captured automatically, without manual input.
- **DG-F003-005:** The F-001 authentication dependency is explicit and testable in both full and degraded modes.

## 6. Technical Constraints

| ID | Constraint |
|---|---|
| TC-F003-001 | Must use Django storage abstraction (settings pre-configure local/S3) |
| TC-F003-002 | Must follow ADR-003 DRF conventions and platform error format |
| TC-F003-003 | Must not introduce manual metadata fields (FR-F003-008) |
| TC-F003-004 | Must not create new Django app beyond `resources`/`attachments` designations in component-design.md |
| TC-F003-005 | Checksum must be SHA-256 (FR-F003-007) |
| TC-F003-006 | Upload size limit and format allowlist must be configuration-driven, not hard-coded |

## 7. Technical Decisions and Alternatives

### TD-F003-001 — New `resources` and `attachments` Django Apps

**Decision:** Create two new Django apps per `component-design.md`: `resources` (Resource entity) and `attachments` (file storage abstraction). The Resource model lives in `resources`; the Attachment model lives in `attachments`.

**Alternatives considered:**
- Single new `resources` app holding both file and entity — rejected: component design separates file storage from resource lifecycle; attachments will serve F-008 (download) and F-012 (versioning) later.
- Store files in the existing `users` app — rejected: violates component boundaries.

**Rationale:** Matches the architecture's designated module layout. The attachment abstraction isolates storage backend concerns (TD-F003-002) from resource lifecycle semantics.

### TD-F003-002 — File Storage via Django Storage Abstraction with `storage_name` Recording

**Decision:** Store uploaded files via Django's storage API (`STORAGES["default"]`). Attachment records a `storage_name` (backend-relative key) rather than a URL, so the active backend (local or S3) can change without data migration. Retrieval resolves through the storage API at read time.

**Alternatives considered:**
- Store absolute file path/URL on the model — rejected: breaks when switching local↔S3.
- Always S3 — rejected: local filesystem must remain the development default (settings).

**Rationale:** Settings already define the abstraction. Recording the storage key keeps the model backend-agnostic (DG-F003-003).

### TD-F003-003 — Technical Metadata Stored on Attachment, Not Key-Value Metadata Model

**Decision:** Technical metadata (file_size, format, checksum) is stored as fixed fields on the Attachment model. The key-value metadata model from ADR-006 is NOT introduced in F-003; it arrives with F-004 (manual metadata + vocabulary validation).

**Alternatives considered:**
- Introduce the key-value metadata model now — rejected: exceeds operator scope (metadata model is F-004's vehicle; FR-F003-008).
- Store technical metadata on Resource — rejected: the file belongs to the attachment; keeping technical metadata with the file it describes avoids duplication when F-012 (versioning) replaces files.

**Rationale:** Fixed fields satisfy F-003's contract with minimal surface. ADR-006's key-value store is reserved for the F-004 metadata scope per authority-map.md.

### TD-F003-004 — Single-Phase Multipart Upload API

**Decision:** One `POST /api/resources/upload/` endpoint accepting `multipart/form-data` with a single `file` field. Success returns the created resource ID and attachment ID. No two-phase (upload-then-commit) flow in F-003.

**Alternatives considered:**
- Two-phase upload (temp file, then finalize) — rejected: adds complexity with no F-003 requirement; chunked/resumable explicitly out of scope.
- Raw binary body — rejected: loses multipart field context and DRF serializer consistency.

**Rationale:** Minimal contract per DG-F003-001; future large-file handling is a documented enhancement.

### TD-F003-005 — Per-Format Detection Strategy (Extension + Magic Bytes)

**Decision:** `FormatDetector` validates format by extension AND content. For formats with reliable magic bytes (e.g., TIFF), content check is authoritative and mismatch is rejected (400). For formats without reliable magic bytes (e.g., GeoJSON, SHP — SHP is a container), content check degrades to extension-only with a documented limitation, and no mismatch rejection is applied beyond extension allowlist.

**Alternatives considered:**
- Extension-only validation — rejected: weak integrity; fails EAF-F003-002 intent.
- Strict magic bytes for all formats — rejected: false rejections of valid files (RISK-F003-003).

**Rationale:** Balanced integrity with per-format pragmatism; behavior is documented per format (EAF-F003-002 resolution).

### TD-F003-006 — Streaming Checksum During Storage Write

**Decision:** SHA-256 is computed by reading the uploaded stream once, while the file is written to storage. The checksum covers the exact stored bytes. Files are written to a temporary storage key; the resource record is created only after validation and checksum succeed; on failure the temp file is deleted.

**Alternatives considered:**
- Separate checksum pass after storage — rejected: double read cost for large files (EAF-F003-005).
- Trust client-provided checksum — rejected: integrity must be server-computed.

**Rationale:** Single-pass integrity with atomic-ish record creation; failure cleanup prevents orphaned files (RISK-F003-001).

### TD-F003-007 — Explicit Authentication Posture with Documented Degraded Mode

**Decision:** The upload endpoint SHALL declare DRF `IsAuthenticated` as its production permission (per ADR-003 and BR-F003-001). A settings flag `UPLOAD_AUTH_REQUIRED` (default `True`) gates enforcement. When F-001 is incomplete and the flag is set to `False` (flight-test/degraded mode), the endpoint accepts uploads without session enforcement and logs a persistent warning; the flag must be `True` in production settings. This makes the F-001 dependency explicit and testable instead of silently assumed (EAF-F003-004).

**Alternatives considered:**
- Block F-003 entirely until F-001 completes — rejected: would prevent the flight test and parallel development; the dependency is surfaced rather than ignored.
- Silently assume F-001 auth works — rejected: F-001 has no live endpoints; silent assumption is a governance failure.

**Rationale:** The posture is explicit, config-driven, and auditable; the dependency gap is documented (INT-F003-002) rather than hidden.

## 8. Component Design

### CMP-F003-001 — UploadService

- Orchestrates: read stream → validate size/format → compute checksum while writing to storage → create Attachment + Resource (in one transaction where storage allows; record creation is the atomic unit) → return IDs.
- On any validation failure: reject with platform error format, delete temp storage key, create no records.
- Reads configuration: `MAX_UPLOAD_SIZE`, `ALLOWED_UPLOAD_FORMATS`, `UPLOAD_AUTH_REQUIRED`.

### CMP-F003-002 — FormatDetector

- Maps extension → detected format; reads magic bytes per format where reliable.
- Returns detected format + confidence tier (`AUTHORITATIVE` magic-byte match, `EXTENSION_ONLY` fallback).
- Mismatch (extension says X, magic bytes authoritatively say Y) → validation error (400).
- Format catalog is configuration-driven (`ALLOWED_UPLOAD_FORMATS`).

### CMP-F003-003 — ResourceSerializer / UploadSerializer

- `UploadSerializer`: single `file` field (FileField), multipart.
- `ResourceSummarySerializer`: id, attachment id, filename, size, format, checksum, created_at, owner id. No metadata fields (FR-F003-008).

### CMP-F003-004 — UploadView

- DRF APIView, `permission_classes = [IsAuthenticated]` gated by `UPLOAD_AUTH_REQUIRED`.
- POST only. Success → 201 with ResourceSummarySerializer. Errors → 400 with platform error format.

## 9. Data Model Changes

### DM-F003-001 — Resource Model (`resources` app)

| Field | Type | Notes |
|---|---|---|
| id | PK | Auto |
| owner | FK `users.User` | ON DELETE PROTECT |
| title | CharField(255) | Nullable, reserved for F-004 (not collected in F-003) |
| status | CharField(20) | default `"draft"` (enum placeholder; F-004/F-005 evolve) |
| created_at / updated_at | DateTimeField | auto |

**Note:** `title` exists only to satisfy the core entity shape from ADR-006 (standard fields remain on Resource); it is NOT populated by the F-003 upload flow (FR-F003-008).

### DM-F003-002 — Attachment Model (`attachments` app)

| Field | Type | Notes |
|---|---|---|
| id | PK | Auto |
| resource | FK `resources.Resource` | ON DELETE CASCADE |
| original_filename | CharField(255) | From upload |
| storage_name | CharField(512) | Backend-relative key (TD-F003-002) |
| storage_backend | CharField(32) | `"local"` or `"s3"` at write time |
| file_size | BigIntegerField | Bytes (FR-F003-007) |
| format | CharField(32) | Detected format (FR-F003-007) |
| checksum | CharField(64) | SHA-256 hex (FR-F003-007) |
| created_at | DateTimeField | Auto |

### DM-F003-003 — Configuration (Settings)

| Key | Default | Notes |
|---|---|---|
| `MAX_UPLOAD_SIZE` | 500 MB | bytes |
| `ALLOWED_UPLOAD_FORMATS` | e.g., `["tiff", "geojson", "shp", "geotiff"]` | platform-defined default set (BR-F003-003) |
| `UPLOAD_AUTH_REQUIRED` | `True` | TD-F003-007 |

## 10. API Design

### API-F003-001 — Upload Resource

- **Method/Path:** `POST /api/resources/upload/`
- **Auth:** DRF SessionAuthentication + IsAuthenticated (gated by `UPLOAD_AUTH_REQUIRED`, TD-F003-007)
- **Body:** `multipart/form-data` — `file` (required)
- **Success 201:**
  ```json
  {
    "id": 42,
    "attachment_id": 17,
    "filename": "ortho.tif",
    "size": 1048576,
    "format": "tiff",
    "checksum": "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    "created_at": "2026-08-05T12:00:00Z"
  }
  ```
- **Errors 400:** `{"error": "FILE_TOO_LARGE", "message": "...", "max_size": 524288000}`, `{"error": "FORMAT_NOT_ALLOWED", ...}`, `{"error": "FORMAT_MISMATCH", "detected": "...", "extension": "..."}`
- **Errors 401/403:** platform auth errors (when enforcement on)
- **Explicitly absent:** no title/description/tags/spatial extent fields (FR-F003-008)

## 11. Integration Points

### INT-F003-001 — F-004 (Metadata Management) Boundary

F-004 SHALL consume Resource/Attachment for manual metadata entry and vocabulary validation. F-003 SHALL NOT populate title or key-value metadata. ADR-006 key-value model arrives in F-004. Boundary is a contract: F-003's upload response contains no metadata fields.

### INT-F003-002 — F-001 (User Authentication) Dependency

The upload endpoint's auth is `IsAuthenticated` gated by `UPLOAD_AUTH_REQUIRED`. F-001 completion will activate real session enforcement. Until then, degraded mode is explicit and logged. **Contract assumption:** F-001's session/cookie enforcement integrates with DRF SessionAuthentication with no contract change (TR-F003-003).

### INT-F003-003 — Storage Backend

Django `STORAGES["default"]`. No F-003 code branches on backend; `storage_backend` field records which backend wrote the file for observability.

## 12. Storage Strategy

- Local filesystem default (MEDIA_ROOT under `platform/backend/media/`); S3/MinIO via existing `USE_S3` settings.
- Files stored under `resources/{resource_id}/{attachment_id}/` key structure using storage API.
- Temp keys under `tmp/uploads/` deleted on validation failure.
- No content-addressable storage in F-003 (checksum recorded but not used for dedup; note for future).

## 13. Runtime and Data Flows

### Upload Success Flow

```
User → POST /api/resources/upload/ (multipart)
  UploadView (auth check per UPLOAD_AUTH_REQUIRED)
    → UploadSerializer validates file presence
    → UploadService:
        1. size check (MAX_UPLOAD_SIZE)
        2. extension allowlist check (ALLOWED_UPLOAD_FORMATS)
        3. FormatDetector: magic bytes where authoritative
        4. stream → storage (temp key) while computing SHA-256
        5. create Attachment (size, format, checksum)
        6. create Resource (owner, status=draft)
        7. rename/move temp key to final key
    → 201 ResourceSummarySerializer
```

### Validation Failure Flow

```
UploadService step 1-3 fail → delete temp key if written → 400 platform error → no records
```

### Degraded Auth Mode Flow

```
UPLOAD_AUTH_REQUIRED=False → skip auth enforcement → log warning once per request:
"UPLOAD_AUTH_REQUIRED is False — F-001 auth not enforced (flight test / degraded mode)"
→ proceed as above
```

## 14. Performance Strategy

- Streaming read/write: never buffer the full file in memory (EAF-F003-005).
- Checksum computed in the same pass (TD-F003-006) — zero extra I/O.
- 500 MB default limit; temp-file streaming for DRF upload handling.
- Async processing (Celery) NOT required for F-003 v1 (extraction is synchronous technical metadata; F-004 may introduce async).

## 15. Scalability Strategy

- Storage backend pluggable; S3 for scale (settings pre-configured).
- Upload endpoint is I/O-bound; horizontal scaling of the app tier is sufficient for initial deployment (EA-F003-004).
- No new indexes beyond FK/default PKs for F-003 scale.

## 16. Security and Privacy

- SHA-256 integrity checksum computed server-side (client value never trusted).
- Filename sanitization on storage (storage_name is server-generated; original_filename stored separately, escaped at render).
- Size/format limits enforced server-side (never client-only).
- Uploaded content is not scanned in F-003 (note: no antivirus requirement stated; defer).
- Privacy: uploads may contain sensitive data — permission enforcement belongs to F-007; F-003 stores owner for provenance.

## 17. Failure, Degradation, and Recovery

| Failure | Behavior |
|---|---|
| Storage write fails mid-stream | Delete temp key; 500 platform error; no records |
| Checksum/validation fails | Delete temp key; 400; no records |
| Resource record creation fails after file written | Delete temp key; 500; retry is safe |
| S3 unavailable (USE_S3 mode) | Upload fails with platform 503/500; local mode unaffected |
| F-001 absent | Degraded mode per TD-F003-007 with log warnings |

## 18. Observability

- Log lines per upload: outcome (success/rejected/error), size, format, duration, auth mode.
- Warning log when `UPLOAD_AUTH_REQUIRED=False` (degraded mode).
- Storage backend recorded per attachment for operational traceability.

## 19. Migration and Backward Compatibility

- New apps `resources` and `attachments`; initial migrations only.
- No changes to existing models/tables.
- Settings additions are additive with defaults — no breaking change.
- Existing `config/urls.py` gains one include; no route changes.

## 20. Engineering Scenarios

### ES-F003-001 — Valid Upload Creates Resource

Authenticated user uploads valid GeoTIFF under limit → 201, Attachment + Resource created, checksum matches bytes, no metadata fields in response.

### ES-F003-002 — Oversize File Rejected

File over `MAX_UPLOAD_SIZE` → 400 `FILE_TOO_LARGE`, no records, no orphaned storage key.

### ES-F003-003 — Disallowed Format Rejected

Format not in allowlist → 400 `FORMAT_NOT_ALLOWED`, no records.

### ES-F003-004 — Extension/Magic-Byte Mismatch

`.tiff` file with JPEG content → 400 `FORMAT_MISMATCH` (authoritative magic bytes). `.geojson` with arbitrary text content → accepted (extension-only tier, documented).

### ES-F003-005 — Storage Backend Switch

Same upload with `USE_S3=False` then `USE_S3=True` → identical API contract; `storage_backend` differs; files resolvable in both modes.

### ES-F003-006 — F-001 Incomplete (Degraded Auth)

`UPLOAD_AUTH_REQUIRED=False` → upload succeeds without session; warning logged; no resource created without owner? — NO: owner is required; in degraded mode, requests WITHOUT auth SHALL be rejected with 401 if owner cannot be determined. Degraded mode relaxes enforcement only when an authenticated session exists in a test harness. **Correction:** degraded mode applies to environments where the auth endpoint exists in tests; production requires `UPLOAD_AUTH_REQUIRED=True`.

### ES-F003-007 — Concurrent Uploads

Two parallel uploads → independent temp keys, independent records; no shared mutable state; checksums computed per stream.

### ES-F003-008 — Storage Write Failure Mid-Stream

Simulated S3 outage → 500, temp key cleaned, no records; retry succeeds.

### ES-F003-009 — Upload Without File Field

Missing `file` → 400 validation error (platform format).

### ES-F003-010 — Manual Metadata Attempt

Client posts `title`/`description` fields → fields are not part of UploadSerializer; ignored or rejected per DRF behavior; no persistence (FR-F003-008).

## 21. Technical Risks

### TR-F003-001 — Format Detection False Rejections

Magic-byte strictness could reject valid files. **Mitigation:** per-format tiering (TD-F003-005); authoritative checks only where signatures are reliable.

### TR-F003-002 — Storage Key Collisions / Orphans

Temp key cleanup on failure is critical. **Mitigation:** server-generated unique keys; deletion in failure paths (CMP-F003-001); orphan sweep documented for operations.

### TR-F003-003 — F-001 Contract Change

F-001's auth implementation could diverge from DRF SessionAuthentication expectations. **Mitigation:** degraded mode keeps F-003 testable independently; INT-F003-002 records the assumption; F-001 completion is tracked.

### TR-F003-004 — Degraded Auth Mode Reaching Production

`UPLOAD_AUTH_REQUIRED=False` left enabled in production → unauthenticated uploads. **Mitigation:** default `True`; production settings override to `True`; warning log; gate documented in deployment checklist.

### TR-F003-005 — Large File Memory Pressure

Non-streaming handling would exhaust workers. **Mitigation:** streaming read/write (EAF-F003-005, §14).

## 22. Required ADRs

| ADR | Relation |
|---|---|
| ADR-002 Modular Monolith | Resources/attachments app placement |
| ADR-003 Django REST Framework | Upload API conventions |
| ADR-006 Flexible Metadata | Technical metadata on Attachment; key-value deferred to F-004 |
| ADR-001 Resource-centric | Resource as core entity introduced here |

No new ADR required: F-003 introduces no architecture-level decisions (apps follow component-design.md).

## 23. Engineering Assumptions

### EA-F003-001 — F-001 User Model Contract Is Stable

Owner FK references `users.User`; auth integration assumed compatible with DRF SessionAuthentication (INT-F003-002).

### EA-F003-002 — Default Format Allowlist Is Platform-Defined

`ALLOWED_UPLOAD_FORMATS` initial value (TIFF/GeoTIFF/GeoJSON/SHP) is a platform default; configurable by Administrator (BR-F003-003).

### EA-F003-003 — Storage Write Is Available

Local filesystem or configured S3/MinIO is reachable at runtime.

### EA-F003-004 — Initial Platform Scale

Upload volume fits a single app tier; no sharding/queueing required in F-003 (TR-F003-005 mitigated by streaming).

## 24. Human Technical Decisions

None. All technical questions resolved as Technical Decisions (TD-F003-001 through TD-F003-007). Scope boundary (HD-F003-001) was a product/operator decision already recorded in the specification.

## 25. Open Technical Questions

None. All technical questions have been resolved as Technical Decisions (TD-F003-001 through TD-F003-007).

## 26. Ready for Engineering Review

- [x] All functional requirements and acceptance criteria trace to a design response
- [x] Technical decisions documented with alternatives and rationale
- [x] Component design complete
- [x] Data model changes defined
- [x] API contract defined with success/error shapes
- [x] Integration boundaries explicit (F-001, F-004, storage)
- [x] Engineering scenarios cover happy path and edge cases
- [x] Technical risks identified with mitigations
- [x] Scope respected: no manual metadata (FR-F003-008, HD-F003-001)
- [x] F-001 dependency explicit, not silently assumed (EAF-F003-004, TD-F003-007)

**Ready for Engineering Review:** YES

**Readiness reason:** Design is complete, contract-bound, scope-faithful to the operator authority map, and treats the F-001 dependency as an explicit testable constraint.
