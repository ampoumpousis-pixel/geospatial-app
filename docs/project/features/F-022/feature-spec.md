# F-022 — Geocalendar Timelines

- **Feature ID:** F-022
- **Status:** Draft
- **Priority:** P2 (Nice to have)
- **Dependencies:** F-003, F-004, F-005, F-009; Enhancement from F-014
- **Related Requirements:** FR-03-03 (temporal search), FR-06-01 (map visualization)

---

## 1. Problem / Opportunity

### Problem
Users working with time-series geospatial data (satellite imagery, environmental monitoring, change detection) have no way to explore resources organized by time. The platform currently supports keyword, spatial, and faceted search (F-005), but temporal browsing is limited to manual metadata inspection. Users cannot answer questions like "what resources do we have for this area in June 2024?" or "show me how this region changed over time."

### Opportunity
A geocalendar timeline feature would make the platform the go-to tool for temporal geospatial discovery. It bridges the gap between static catalog browsing and time-series analysis, serving both casual users (browsing by date) and power users (animating change over time).

---

## 2. User Personas

| Persona | Role | Need |
|---|---|---|
| **Researcher** | Academic studying land-use change | Browse satellite imagery by acquisition date; compare same area across months/years |
| **Environmental Monitor** | Government/NGO analyst tracking deforestation, flooding, etc. | Filter resources by date range; animate changes on the map |
| **GIS Manager** | Internal platform administrator | Understand data coverage gaps temporally; ensure complete temporal metadata |
| **Casual Browser** | Occasional platform user | Browse recently added resources; find resources by "when" as easily as "where" |

---

## 3. Functional Requirements

### FR-022-01 — Timeline View
A horizontal timeline displaying resources as markers/thumbnails positioned by their temporal attribute (acquisition date, creation date, or user-selected field).

- Timeline shall support zoom levels: decade, year, month, week, day
- Resources shall be clustered on the timeline at higher zoom levels to avoid overlap
- Clicking a resource marker shall show a preview tooltip (title, date, thumbnail)
- Clicking the preview shall navigate to the resource detail view (F-006)

### FR-022-02 — Calendar View
A month/year calendar grid overlay showing resource density per day.

- Days with resources shall be visually highlighted (color intensity based on count)
- Clicking a day shall filter the resource list to that day's resources
- The calendar shall support month-to-month navigation and year selection

### FR-022-03 — Map-Timeline Synchronization
The timeline/calendar shall be synchronized with the 2D map preview (F-009).

- Panning/zooming the map shall filter timeline markers to the visible bounding box
- Selecting a time range on the timeline shall filter map features to resources within that range
- A playback/ animation mode shall step through time, updating the map for each frame

### FR-022-04 — Temporal Search Integration
The timeline shall integrate with the search interface (F-005).

- Search results shall display a timeline summary showing temporal distribution
- Users shall be able to refine search by date range via the timeline/calendar
- Temporal facets (year, month, season) shall appear in the faceted search panel

### FR-022-05 — Temporal Metadata Support
Resources must carry temporal metadata to appear on the timeline.

- The timeline shall respect `acquisition_date`, `creation_date`, and a configurable custom date field
- Resources without temporal metadata shall be excluded from the timeline (with a notice)
- Bulk date assignment shall be supported for existing resources (via F-004 metadata management)

### FR-022-06 — Animation / Playback Mode
An animation mode that iterates through a date range, updating the map for each time step.

- Configurable frame rate (speed slider)
- Play, pause, step forward, step backward controls
- Frame indicator showing current date/time step
- Export animation as GIF or video sequence (future enhancement)

---

## 4. Acceptance Criteria

| ID | Criterion | Verification |
|---|---|---|
| AC-01 | Timeline renders resources grouped by date | Manual QA with 100+ dated resources |
| AC-02 | Calendar view highlights days with resources | Integration test |
| AC-03 | Panning the map filters timeline to visible area | Integration test |
| AC-04 | Selecting date range on timeline filters map | Integration test |
| AC-05 | Temporal search facet returns correct counts | Unit test |
| AC-06 | Animation plays through date range at configured speed | Manual QA |
| AC-07 | Resources without dates show exclusion notice | Unit test |
| AC-08 | Timeline handles 10,000+ resources without freezing | Performance test (< 2s render) |

---

## 5. Out of Scope

| Item | Rationale |
|---|---|
| Server-side timeline tile generation | Timeline is client-side; server provides filtered data |
| Export animation as GIF/video | Complex; deferred to post-MVP enhancement |
| 3D globe timeline integration (F-014) | Enhancement path; not in initial scope |
| Custom user-defined temporal aggregations | Use faceted search for custom grouping |
| Real-time streaming resource updates | WebSocket updates deferred to future |
| Mobile-native timeline gestures | Desktop-first; mobile responsiveness in later iteration |

---

## 6. User Stories

### Core Flow
```
As a researcher,
I want to browse satellite imagery on a timeline,
so that I can quickly find resources by acquisition date.
```

### Temporal Search
```
As an environmental monitor,
I want to filter resources by date range on the search results page,
so that I can narrow down relevant data for my analysis period.
```

### Map Animation
```
As a GIS analyst,
I want to animate resources on the map across a date range,
so that I can visually observe change over time.
```

### Coverage Gaps
```
As a GIS manager,
I want to see temporal coverage gaps on a calendar,
so that I can prioritize data acquisition efforts.
```

---

## 7. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| F-003 — Resource Upload | Required | Resources must be uploaded with temporal metadata |
| F-004 — Resource Metadata Management | Required | Date fields must be viewable/editable |
| F-005 — Resource Search | Required | Temporal facets and search integration |
| F-009 — 2D Map Preview | Required | Map-timeline synchronization |
| F-014 — 3D Globe Preview | Enhancement | Future 3D timeline integration |

---

## 8. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Timeline performance with 10K+ resources | High | Medium | Virtual scrolling, clustering, server-side pre-filtering |
| Inconsistent temporal metadata across resources | Medium | High | Default to `created_at`; bulk date assignment tool; clear documentation |
| Browser rendering of animation frames | Medium | Low | Use requestAnimationFrame; limit frame resolution |
| User confusion between timezone-localized dates | Medium | Medium | Store dates in UTC; display in user's configured timezone |

---

## 9. Technical Notes

- Timeline rendering: Use a lightweight canvas-based or virtual-DOM timeline library (e.g., vis-timeline, d3-based custom component)
- Calendar view: Simple CSS-grid calendar with dynamic highlighting
- State management: Timeline bounds, selected range, animation state in application store (Redux/Zustand)
- API: Extend search endpoint to support `date_from`, `date_to`, `date_field` query parameters
- Date format: ISO 8601 (YYYY-MM-DD) throughout; timezone handled at display layer

---

## 10. Open Questions

1. Should the timeline default to the resource's `acquisition_date` or a configurable field?
2. Should animation playback be limited to raster/imagery resources only, or all resource types?
3. What is the maximum practical date range for animation mode?
4. Should calendar view show resource count per day or a simple binary indicator?
