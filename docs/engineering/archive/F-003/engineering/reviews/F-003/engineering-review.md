# F-003 — Resource Upload — Engineering Review

## 1. Metadata

| Field | Value |
|---|---|
| Feature ID | F-003 |
| Feature Title | Resource Upload |
| Reviewed Artifacts | feature-spec.md v1.0, technical-design.md v1.0 |
| Review Version | 1.0 |
| Recommendation | REVISIONS REQUIRED |
| Owner | AGENT-104 — Engineering Design Reviewer |
| Created | 2026-08-05 |
| Updated | 2026-08-05 |
| Next Intended Owner | AGENT-103 — Technical Planner (revision) |

## 2. Executive Summary

The Technical Design v1.0 for F-003 is architecturally sound and scope-faithful. It correctly follows the component-design.md module layout (new `resources` and `attachments` apps), respects the operator authority map (no manual metadata entry — FR-F003-008), and treats the F-001 dependency as an explicit, testable constraint rather than a silent assumption (TD-F003-007, INT-F003-002).

Two blocking findings must be resolved before approval:

1. **SC-F003-001** — The degraded authentication mode (TD-F003-007) is internally contradictory and leaves resource ownership undefined. ES-F003-006 states upload succeeds without a session, then self-corrects mid-scenario to require an authenticated session — with no mechanism for determining the `owner` of a Resource when no session exists. Since `owner` is a NOT NULL FK (DM-F003-001), degraded mode as specified cannot actually work.

2. **SC-F003-002** — The upload runtime flow (§13, steps 5-6) creates the Attachment before the Resource, but the Attachment model (DM-F003-002) declares `resource` as a required FK with ON DELETE CASCADE. An Attachment cannot be persisted before its Resource exists. The creation order contradicts the schema.

Both findings are concrete, evidenced, and resolvable. The design is otherwise well-formed.

## 3. Architecture Findings

### AF-F003-001 — Architecture fit is sound

The new `resources` and `attachments` apps follow `component-design.md` exactly (lines 95-155). Attachment as a file-storage abstraction serving future F-008 (download) and F-012 (versioning) is the correct decomposition. No new ADR is required; no architectural-level decision is being made. PASS.

### AF-F003-002 — Scope fidelity verified

The design contains no manual metadata fields (API-F003-001 explicitly lists their absence; §13 flow collects none). ADR-006's key-value metadata model is correctly deferred to F-004 per HD-F003-001. Technical metadata (size, format, checksum) lives on Attachment (TD-F003-003), which is consistent with ADR-006's "standard fields remain on Resource; automatic extraction populates known keys" — a defensible F-003 boundary. PASS.

### AF-F003-003 — F-001 dependency surfaced, not assumed

TD-F003-007, INT-F003-002, TR-F003-003, and EA-F003-001 collectively make the F-001 gap explicit with a config-gated posture. This is exactly the transparency the flight-test authority map requires. PASS (with the caveat that the degraded mode itself is defective — SC-F003-001).

## 4. Semantic Consistency Review

### SC-F003-001 — Degraded auth mode: ownership undefined, scenario self-contradicts (BLOCKING)

TD-F003-007 states: when `UPLOAD_AUTH_REQUIRED=False`, "the endpoint accepts uploads without session enforcement." ES-F003-006 then contradicts this mid-scenario: "requests WITHOUT auth SHALL be rejected with 401 if owner cannot be determined... **Correction:** degraded mode applies to environments where the auth endpoint exists in tests."

The contradiction: if the endpoint truly accepts uploads without a session, there is no authenticated user, and `Resource.owner` (NOT NULL FK, DM-F003-001) cannot be set — the upload cannot succeed. If the endpoint instead requires a session, the flag has no effect and degraded mode is meaningless. The design must define: who is the owner in degraded mode (e.g., a configured system/fallback owner), and reconcile the scenario with the decision.

**Required change:** (a) resolve owner attribution in degraded mode (e.g., dedicated system owner record, or owner required even in degraded mode, making degraded mode only relax enforcement where a test session exists), (b) rewrite ES-F003-006 so it does not self-contradict, (c) update TR-F003-004/§13 flow accordingly.

### SC-F003-002 — Attachment-before-Resource creation order contradicts FK (BLOCKING)

§13 Upload Success Flow steps 5-6 create Attachment then Resource. DM-F003-002 defines `resource` as a required FK (ON DELETE CASCADE). Persisting an Attachment first violates the schema. CMP-F003-001 mentions "create Attachment + Resource (in one transaction)" without ordering.

**Required change:** Define creation order as Resource-first then Attachment (Attachment references the Resource), or make Attachment.resource nullable with backfill — the former is clearly preferred. Update §13 flow, CMP-F003-001, and the failure-path ordering (what is deleted if Resource creation fails after Attachment exists — currently the design says the reverse).

### SC-F003-003 — Model↔API field agreement verified

API-F003-001 response fields (id, attachment_id, filename, size, format, checksum, created_at) map to DM-F003-002 fields (original_filename, file_size, format, checksum, created_at) plus Resource.id. No orphan fields. PASS.

### SC-F003-004 — Validation↔Failure-path alignment verified

ES-F003-002/003/004 failure scenarios all state "no records, no orphaned storage key," consistent with CMP-F003-001 and §13. ES-F003-008 (storage write failure) matches §17. PASS.

### SC-F003-005 — Configuration↔Settings agreement verified

MAX_UPLOAD_SIZE, ALLOWED_UPLOAD_FORMATS, UPLOAD_AUTH_REQUIRED appear consistently in DM-F003-003, CMP-F003-001, TC-F003-006, and §10 error contracts. PASS.

### SC-F003-006 — Decision↔Design propagation verified

TD-F003-001 → apps; TD-F003-002 → DM-F003-002 storage fields; TD-F003-005 → CMP-F003-002 tiers; TD-F003-006 → §13 single-pass; TD-F003-007 → API-F003-001 auth gating. All decisions propagate to their components. PASS.

### SC-F003-007 — Acceptance criteria coverage verified

AC-F003-001 through AC-F003-005 all map to design responses (§3 traceability table). PASS.

## 5. Missing Decisions

### MD-F003-001 — Multi-file format handling (SHP requires companion files)

A `.shp` without `.shx`, `.dbf`, and `.prj` is not a usable shapefile. The format allowlist example includes `shp`, but the design defines single-file upload with no companion-file mechanism (TD-F003-004). The design does not decide whether a bare `.shp` is accepted, rejected, or whether multi-file upload is deferred. **Not blocking** — single-file upload is a legitimate F-003 contract — but the decision should be documented to avoid silent ambiguity downstream.

## 6. Risks

### RSK-F003-001 — Degraded auth flag reaching production

TR-F003-004 covers this adequately (default True, production override, warning log). Consistent with the design's stance. Acceptable.

### RSK-F003-002 — Format detection false rejections

TR-F003-001 mitigation (per-format tiering) is sound. The allowlist example `["tiff", "geotiff"]` is redundant (GeoTIFF IS TIFF); recommend collapsing to avoid confusion in FormatDetector logic. Advisory.

### RSK-F003-003 — F-001 contract change

TR-F003-003 and INT-F003-002 document the assumption. Acceptable for flight-test stage.

## 7. Required Changes

| ID | Finding | Type | Required |
|---|---|---|---|
| SC-F003-001 | Degraded auth ownership undefined + ES-F003-006 self-contradiction | Blocking | Resolve before re-review |
| SC-F003-002 | Attachment-before-Resource creation order violates FK | Blocking | Resolve before re-review |

## 8. Advisories

### AD-F003-001 — Document single-file upload limitation for multi-file formats

Resolve MD-F003-001 explicitly in the design (accept bare `.shp` with documented limitation, or defer).

### AD-F003-002 — Collapse redundant allowlist entries

`["tiff", "geotiff"]` — document that GeoTIFF is a TIFF flavor to keep FormatDetector mapping unambiguous.

## 9. Prior Finding Resolution

None — first review of this design (v1.0).

## 10. Final Recommendation

**REVISIONS REQUIRED**

The design is architecturally sound, scope-faithful, and treats the F-001 dependency with the required transparency. Two blocking semantic inconsistencies (SC-F003-001, SC-F003-002) must be resolved before approval. Both are small, well-scoped corrections to the degraded-auth model and the creation-order flow.

**Next:** AGENT-103 revises Technical Design to v1.1. Per FI-G-002, the superseded v1.0 SHALL be archived before v1.1 is written (orchestrator invokes `/lifecycle archive`).
