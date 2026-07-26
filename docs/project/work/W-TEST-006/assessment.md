# W-TEST-006 — Work Assessment

## Metadata

**Work ID:** W-TEST-006
**Title:** Add data export for resource metadata as CSV
**Assessment Version:** 1.0
**Assessed by:** AGENT-105 — Task Planner
**Created:** 2026-07-26

## Complexity Classification

**Level:** 3
**Classification reason:** Work request does not establish whether an API endpoint for CSV export exists. Resolving the ambiguity requires assuming the existence, absence, or design of a system boundary.
**Classification source:** API availability is unspecified. No framework knowledge or repository inspection used.

## Level Determination

| Criterion | Value | Reason |
|-----------|-------|--------|
| Domains affected | Unknown | The request specifies frontend (button) but backend scope (API endpoint) is undetermined |
| API contract change | Yes/Unknown | The request does not establish whether an existing API endpoint can serve the CSV data |
| DB schema change | No | Read-only export of existing resource metadata |
| Service boundary change | Unknown | The API endpoint is the system boundary between frontend and backend |
| Auth/security change | Unknown | Depends on whether a new endpoint needs authentication or existing controls suffice |
| Architecture decision needed | Yes | The existence and design of the API endpoint is an architectural decision |
| Requirements ambiguity | Yes | API availability is unspecified — three possible implementations exist with different architectures |

## Disposition

| Technical Design Required? | Yes |
| Task Count | N/A — escalated |
| Generated Manifest | Not generated — Level 3 escalation |

## Escalation Detail

**Reason:** The work request specifies a frontend UI change (CSV export button on resource list page) but does NOT establish whether a CSV export API endpoint exists. The API endpoint is the system boundary between the frontend button action and the backend data service. Determining the existence, design, and contract of this API endpoint requires assuming architectural facts that are not present in the work request.

**Ambiguity Resolution Required:**
1. Whether a CSV export API endpoint exists, requires creation, or is unnecessary
2. The API endpoint contract (URL, HTTP method, parameters, response format)
3. The integration contract between the frontend button and the backend service
4. The CSV data format, column specification, and filtering/scope considerations

**Next owner:** AGENT-103 — Technical Planner
