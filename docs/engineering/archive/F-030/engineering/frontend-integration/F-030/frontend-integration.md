# F-030 — User Display Name — Frontend Integration

## 1. Metadata
| Field | Value |
|---|---|
| Feature ID | F-030 |
| Source Feature Specification | docs/project/features/F-030/feature-spec.md |
| Source Feature Specification Version | 1.0 |
| Source Technical Design | docs/engineering/technical-plans/F-030/technical-design.md |
| Source Technical Design Version | 1.0 |
| Frontend Integration Version | 1.0 |
| Superseded Version | None |
| Owner | Frontend Integration Planner |
| Status | Ready for Engineering Review |
| Created | 2026-08-07 |
| Next Intended Owner | AGENT-104 — Engineering Design Reviewer |

## Revision History
| Version | Date | Author | Changes | Resolved Return IDs |
|---|---|---|---|---|
| 1.0 | 2026-08-07 | Frontend Integration Planner | Initial integration | — |

## 2. Page Inventory
Every page this feature touches.

### P-F030-001 — Profile Page
**Type:** New
**Path:** /profile
**Purpose:** Authenticated user views and updates their own display name, with loading, save, and error states
**Permission gate:** Authenticated session (DRF `IsAuthenticated` — TD-F030-003, TD §17)
**Feature source:** FR-F030-001, FR-F030-003, FR-F030-004, FR-F030-005, FR-F030-006; AC-F030-001, AC-F030-003, AC-F030-004, AC-F030-005, AC-F030-006, AC-F030-007; US-F030-001, US-F030-002

### P-F030-002 — Home Page
**Type:** Existing (modified)
**Path:** /
**Purpose:** Existing platform home surface; gains a single "Profile" link element within its existing content; no other behavior change (BR-F030-004)
**Permission gate:** None (existing public page; the link is static content)
**Feature source:** FR-F030-002, AC-F030-002, BR-F030-004

## 3. Route Map
### New Routes
| Route | Page | Parameters | Permission |
|---|---|---|---|
| /profile | P-F030-001 | none | Authenticated session (DRF `IsAuthenticated` — TD-F030-003, TD §17) |

### Modified Routes
None. The existing `/` route element stays unchanged; the home page "Profile" link is a content-level addition inside the existing home page content and is not a route change (BR-F030-004).

### Removed Routes
(When applicable) None.

**Route conflict verification:** The existing route set contains only `/` (inspected in the frontend codebase). The new `/profile` route does not conflict with any existing route.

## 4. Navigation Changes
| Entry | Type | Target | Location | Condition |
|---|---|---|---|---|
| "Profile" link | New (local link element within existing content) | /profile | Existing home page content on the `/` route | Always visible (static content) |

**Navigation note:** No global navigation surface exists in the application; the feature introduces local navigation only. No app shell, header, sidebar, layout provider, navigation context, or other navigation infrastructure is introduced.

## 5. Page Flow
Ordered sequence of user navigation through feature pages.
```
1. / → Home Page (existing, modified) — content now includes a "Profile" link
2. Click "Profile" link → /profile (P-F030-001, new) — client-side route navigation; no API call for navigation
3. ProfilePage mounts → GET /api/profile/ (API-F030-001) → Loading → Loaded (current display name rendered) or Error (AC-F030-006)
4. User edits display name and submits → PUT /api/profile/ (API-F030-002) → Saving → Success (updated value reflected with success indication, mechanism per TD Open Contract Item 1) or Error (stored value unchanged, AC-F030-006)
5. Unauthenticated access attempt → API returns 401 → apiClient dispatches auth:unauthorized → F-001 flow redirects to login (AC-F030-007)
6. User returns to home via browser back → / (existing, unchanged)
```

## 6. UI Behaviour Matrix
Bridges every user-facing Feature Specification requirement to implementation.

| # | User Action | Trigger | Backend (TD ref) | Result |
|---|---|---|---|---|
| 1 | Open profile page from home | Click "Profile" link on the home page | None (client-side route navigation) | Router navigates to /profile; ProfilePage mounts (FR-F030-001, FR-F030-002; AC-F030-001, AC-F030-002) |
| 2 | View current display name | Page loads (automatic) | API-F030-001: GET /api/profile/ | ProfilePage shows Loading then Loaded; current display name rendered (FR-F030-003; AC-F030-003; US-F030-001) |
| 3 | Update display name | Submit a new value on the profile form | API-F030-002: PUT /api/profile/ | ProfilePage shows Saving then Success; updated value reflected with a success indication (mechanism per TD Open Contract Item 1) (FR-F030-004, FR-F030-006; AC-F030-004; US-F030-002) |
| 4 | Update fails | Submit a new value; PUT fails (network, validation, server) | API-F030-002 (failure path) | ProfilePage shows Error; stored display name unchanged (FR-F030-006; AC-F030-006) |
| 5 | Load fails | Page loads; GET fails | API-F030-001 (failure path) | ProfilePage shows Error; no stale value shown (FR-F030-006; AC-F030-006) |
| 6 | Unauthenticated user opens /profile | Navigate to /profile without a session | API-F030-001 or API-F030-002 returns 401 | apiClient dispatches auth:unauthorized; F-001 flow redirects to login; no display name rendered or modified (FR-F030-005; AC-F030-005, AC-F030-007) |

**Traceability:** Each row maps to Feature Specification requirements (FR-F030-NNN) and acceptance criteria (AC-F030-NNN). All user-facing requirements and acceptance criteria are covered. No row invents behavior beyond the Feature Specification.

## 7. Page Responsibility Matrix
Per page, what it owns and what it explicitly does not own.

| Page | Owns | Explicitly Does NOT Own |
|---|---|---|
| /profile (P-F030-001, new) | Display-name display and edit form; loading/save/error states; profile data fetching and submission via apiClient (GET/PUT) | Home page content; navigation chrome (none exists in the application); authentication and session handling (owned by F-001); global navigation; other profile fields or settings; avatar |
| / (P-F030-002, modified) | Existing home page content; the single "Profile" link element added within it | Profile page content and state; profile data fetching; any other navigation behavior; any other new behavior (BR-F030-004) |

## 8. Page Ownership Matrix
| Page | Type | Feature Components | Reused/Modified Components |
|---|---|---|---|
| /profile | New | C-F030-001 (ProfilePage), C-F030-002 (ProfileDisplayNameForm) | apiClient (reused service) |
| / | Existing (modified) | None (the link is a content-level element, not a new component) | Home page content (modified — adds "Profile" link element) |

## 9. Component Hierarchy
### P-F030-001 — Profile Page
```
ProfilePage (New — C-F030-001)
└── ProfileDisplayNameForm (New — C-F030-002)
```
(ProfilePage consumes apiClient for GET/PUT; apiClient is a reused service, not part of the component tree.)

### P-F030-002 — Home Page
```
Home page content (existing inline content on the / route — modified)
└── "Profile" link element (added within existing content; content-level, not a new component)
```

## 10. Component Catalog
### C-F030-001 — ProfilePage
**Type:** New
**Page:** P-F030-001
**Responsibility:** Page-level container for the /profile route. On mount, fetches the authenticated user's display name via apiClient (API-F030-001); renders Loading / Loaded / Saving / Success / Error states per the Technical Design state machine (TD §14); owns the display value and the state phase; delegates display and edit to ProfileDisplayNameForm; submits updates via apiClient on save (API-F030-002).
**APIs consumed:** API-F030-001 (GET /api/profile/), API-F030-002 (PUT /api/profile/)
**Permission gate:** Authenticated session (DRF `IsAuthenticated` — TD-F030-003); 401 → apiClient dispatches auth:unauthorized → F-001 login flow
**State:** displayName (current stored value); phase (Loading / Loaded / Saving / Success / Error)
**Requires empty/error handling:** Y

### C-F030-002 — ProfileDisplayNameForm
**Type:** New
**Page:** P-F030-001
**Responsibility:** Presents the current display name; captures a new display name; exposes a save action to ProfilePage; holds the draft input value.
**APIs consumed:** (none — API calls are performed by parent C-F030-001 via apiClient)
**Permission gate:** (none — inherits from parent)
**State:** editValue (ephemeral draft input value; reset on load and after a confirmed save)
**Requires empty/error handling:** N (success/error indication is rendered by the parent from the state phase)

## 11. API-to-Component Mapping
| API (TD §11) | Component | Method | Purpose |
|---|---|---|---|
| API-F030-001 — GET /api/profile/ | C-F030-001 (ProfilePage) | GET | Fetch the authenticated user's current display name on page load |
| API-F030-002 — PUT /api/profile/ | C-F030-001 (ProfilePage) | PUT | Persist the submitted display name on save |

**Open contract dependency:** The PUT success response contract and the display_name validation constraints are deliberately OPEN in the Technical Design (§11 Open Contract Items 1 and 2). This integration does not resolve them: the success-indication mechanism (UI Behaviour Matrix row 3) and any client-side validation remain dependencies on the resolved contracts and must be escalated as NEEDS CLARIFICATION by the implementation agent. The error path (stored value unchanged on failure — AC-F030-006) is contract-independent and is fully specified above.

## 12. Permission Mapping
| Permission (TD ref) | Gate Location | Mechanism | Deny Behaviour |
|---|---|---|---|
| Authenticated session (DRF `IsAuthenticated` — TD-F030-003, TD §17) | Route /profile | Backend enforcement: unauthenticated GET/PUT return 401 with no data (TD §17, AC-F030-007); no route-guard infrastructure exists in the frontend, so the frontend surfaces denial through the apiClient 401 event dispatch | apiClient dispatches auth:unauthorized; the F-001 flow redirects to login; no display name is rendered or modified |
| Authenticated session (DRF `IsAuthenticated` — TD-F030-003, TD §17) | C-F030-001 (ProfilePage) | apiClient response interceptor dispatches auth:unauthorized on any 401 from API-F030-001/002 | F-001 flow redirects to login; page does not render a display name or allow a save |

**Note:** There is no authenticated-but-forbidden case for this feature (TD §17); 403 does not apply. Denial is exclusively the unauthenticated 401 path.

## 13. State Ownership
| State | Conceptual Owner | Notes |
|---|---|---|
| displayName: string \| unset | C-F030-001 (ProfilePage) | Loaded from API-F030-001 on mount; single source of truth; passed to ProfileDisplayNameForm; updated only on a confirmed save |
| phase: Loading / Loaded / Saving / Success / Error | C-F030-001 (ProfilePage) | Local UI state machine per TD CMP-F030-002 and §14: Idle → Loading → Loaded/Error; Loaded → Saving → Success/Error |
| editValue: string (draft input) | C-F030-002 (ProfileDisplayNameForm) | Ephemeral draft value in the edit control; reset on load and after a confirmed save |

## 14. Reuse Opportunities
### Reused Without Change
| Component | Location |
|---|---|
| apiClient | Existing frontend service layer (axios instance; base URL /api/, CSRF header on mutating requests, 401 event dispatch) — reused for GET/PUT |
| Route registration (react-router) | Existing frontend routing infrastructure — reused to register the new /profile route and the home page link |

### Modified
| Component | Location | Modification |
|---|---|---|
| Home page content (inline content of the existing `/` route) | Existing home page surface | Add a single "Profile" link element within the existing content (content-level; BR-F030-004) |

### Not Reused
| Candidate | Location | Reason |
|---|---|---|
| SystemInfo | Existing frontend component | Domain-specific system-status component (version, database status, uptime); it is not a page container or an edit form and cannot render a profile display/edit surface. Its local-state data-fetching pattern is mirrored by ProfilePage, but the component itself is not reusable |
| authService | Existing frontend service | F-001 session stubs; not consumed by F-030 — authentication and the login redirect are owned by F-001 (INT-F030-001). Session-establishment endpoints are not yet available (TR-F030-001) |

### New Components — Justification
| Component | Why New | Candidates Evaluated |
|---|---|---|
| C-F030-001 (ProfilePage) | No page or container exists for a profile surface — the frontend contains only the home route content and SystemInfo | SystemInfo — insufficient (domain-specific status component, not a page container); home route content — must remain the home surface per BR-F030-004 |
| C-F030-002 (ProfileDisplayNameForm) | No application-level form/edit component exists in the scaffold | SystemInfo — insufficient (read-only status, no edit form); no other form component exists in the codebase |

## 15. Frontend Design Decisions
### FD-F030-001 — Local navigation only; no navigation infrastructure
**Context:** FR-F030-002 requires a "Profile" link on the home page; BR-F030-004 limits the home page change to that link. Inspection confirms the frontend has no app shell, header, sidebar, or global navigation surface.
**Selected approach:** A single link element is added within the existing home page content on the `/` route; the new `/profile` route is registered in the existing route set. No new navigation component, shell, header, layout provider, or navigation context is introduced.
**Alternatives considered:** A shared app shell with header/sidebar navigation — rejected: out of scope (Feature Specification §10) and would modify the entire application surface, contradicting BR-F030-004 and TD CMP-F030-003.
**Rationale:** The scaffold has no navigation surface; introducing one exceeds the approved scope. A content-level link satisfies FR-F030-002 with minimal surface change.
**Consequences:** The profile page is reachable only from the home page; no global navigation entry exists or is added.
**TD dependency:** CMP-F030-003 (Home Page Profile Link), BR-F030-004.

### FD-F030-002 — ProfilePage owns a page-local state machine
**Context:** FR-F030-006 requires loading, save, and error states. TD CMP-F030-002 fixes a local UI state machine and rejects a global store for a single-field page.
**Selected approach:** C-F030-001 (ProfilePage) owns the display value and the phase (Loading / Loaded / Saving / Success / Error) locally; no global store is introduced.
**Alternatives considered:** React Query / global store — rejected by TD-F030-005 (single page, single field; unnecessary coupling).
**Rationale:** Mirrors the existing local-state data-fetching pattern in the scaffold and matches the Technical Design state machine (§14).
**Consequences:** State is scoped to the page; the page re-fetches on mount; no cross-page profile state exists.
**TD dependency:** CMP-F030-002, TD §14 (Profile page state transitions), TD-F030-005.

### FD-F030-003 — All profile HTTP through apiClient
**Context:** TD INT-F030-002 fixes apiClient as the single HTTP access path (session cookie, CSRF header on mutating requests, 401 event dispatch).
**Selected approach:** ProfilePage performs GET and PUT through apiClient. (Note: the existing SystemInfo component uses raw axios; the profile page does not follow that pattern.)
**Alternatives considered:** Raw axios calls (SystemInfo pattern) — rejected: bypasses the CSRF header and 401 event dispatch required for PUT and unauthenticated handling (TR-F030-005).
**Rationale:** Reuses the existing service layer; CSRF-safe PUT; unauthenticated denial is routed through the existing auth:unauthorized mechanism.
**Consequences:** A 401 on GET or PUT dispatches auth:unauthorized and routes to the F-001 login flow (AC-F030-007).
**TD dependency:** INT-F030-002, apiClient (TD §5), TR-F030-005.

### FD-F030-004 — Technical Design open contract items remain open
**Context:** TD §11 records two deliberately open contract items: the PUT success response contract (Open Contract Item 1) and the display_name validation constraints (Open Contract Item 2).
**Selected approach:** This integration does not resolve either item. The success-indication mechanism for a saved change and any client-side validation constraints are declared as open dependencies. The implementation agent must escalate both as NEEDS CLARIFICATION rather than invent defaults. The error path (stored value unchanged on failure — AC-F030-006) is contract-independent and is fully specified here.
**Alternatives considered:** Assuming a default success contract (e.g., a status code plus refetch) or a default maximum length — rejected: violates the execution-milestone test contract (TD §11) and risks TR-F030-002 and TR-F030-003.
**Rationale:** Faithfulness to the approved Technical Design and the controlled execution test.
**Consequences:** UI Behaviour Matrix row 3 and §11 record the open dependency; success-indication and validation behavior cannot be finalized until the contracts are resolved.
**TD dependency:** API-F030-002, TD §11 Open Contract Items 1 and 2.

## 16. Ready for Review
- [x] Every user-facing Feature Specification requirement traces to a page or component
- [x] UI Behaviour Matrix covers every user-facing requirement and acceptance criterion
- [x] Every user-facing API from Technical Design §11 is mapped to at least one component
- [x] Every user-facing permission from Technical Design is gated on a page, route, or component
- [x] New routes verified against existing route map (no conflicts)
- [x] Component hierarchy is complete for every declared page
- [x] Reuse analysis is thorough (candidates listed, reasons documented for rejections)
- [x] API-to-component mapping is complete and traceable
- [x] Permission mapping specifies deny behaviour for every gate
- [x] State ownership is declared for every stateful component (conceptual only)
- [x] Empty/error handling boolean set for every data-consuming component
- [x] Page Responsibility Matrix covers every page (owns and does-not-own columns filled)
- [x] Every Frontend Design Decision propagates to affected sections
- [x] No backend architecture decisions (APIs, permissions, data models)
- [x] No visual design decisions (colours, typography, spacing, animations, icons)
- [x] No implementation instructions (file paths, code, test plans)
- [x] No product behaviour invented beyond the Feature Specification

**Open contract items:** Technical Design Open Contract Items 1 (PUT success response contract) and 2 (display_name validation constraints) are recorded as open dependencies in §11, §13, §15 (FD-F030-004), and the UI Behaviour Matrix row 3. They are product-contract ambiguities outside this planner's authority and are intentionally not resolved here.

**Ready for Review:** YES
**Readiness reason:** The integration is minimal and faithful to the scaffold: one new page (/profile) with two new components wired to API-F030-001/002 through the existing apiClient, one content-level home page link, local-only navigation, and the authenticated-session gate mapped to the route and page with explicit deny behaviour. The two Technical Design open contract items are left open as dependencies, and all ready-for-review checks pass.
