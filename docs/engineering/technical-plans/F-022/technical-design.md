# F-022 — Geocalendar Timelines — Technical Design

## 1. Metadata

| Field | Value |
|---|---|
| **Feature ID** | F-022 |
| **Feature Name** | Geocalendar Timelines |
| **Technical Design Version** | 1.0 |
| **Status** | Draft |
| **Author** | AGENT-103 — Technical Planner |
| **Date** | 2026-07-16 |
| **Priority** | P2 (Nice to have) |
| **Dependencies** | F-003, F-004, F-005, F-009 |
| **Enhancement Path** | F-014 (3D Globe Preview) |

---

## 2. Technical Overview

F-022 adds a temporal browsing and discovery layer to the GeoSpatial Resource Platform. It introduces: (a) a horizontal timeline visualization for resources positioned by temporal attributes, (b) a calendar-density view, (c) two-way synchronization with the 2D map preview (F-009), (d) temporal search integration with F-005, and (e) an animation/playback mode for iterating through time on the map.

The feature is predominantly **frontend-heavy** (React + TypeScript + Material UI rendered timeline components) but requires **extended backend API support** (temporal query parameters on search, temporal aggregation endpoint, temporal metadata conventions). No new Django app is needed; the feature extends the existing `search` and `metadata` modules.

---

## 3. Source Feature Specification

- **File**: `docs/project/features/F-022/feature-spec.md`
- **Feature ID**: F-022 ✓
- **Status**: Draft
- **Acceptance Criteria**: AC-01 through AC-08 defined ✓
- **Ready for Technical Planning**: Implied by task instruction; formal marker should be added post-approval
- **Dependencies**: F-003, F-004, F-005, F-009; Enhancement from F-014
- **Open Questions**: 4 documented in spec §10 — resolved in §27 (Human Technical Decisions) below

---

## 4. Architectural Context

### 4.1 Module Alignment

The feature does not introduce a new Django module. It extends existing modules:

| Module | Role in F-022 |
|---|---|
| **resources** | Supplies `Resource.created_at` / `Resource.updated_at` as fallback temporal fields; no model changes |
| **metadata** | Houses temporal metadata (`acquisition_date`, `creation_date`, custom date fields) via key-value model (ADR-006); requires documented key conventions |
| **search** | Primary API extension target — new query params, temporal aggregation endpoint, faceted date counts |
| **visualization** | No changes needed; timeline is a standalone UI component. The 2D map (MapStore) integration is via existing F-009 map store/state |

### 4.2 Frontend Architecture Fit

The frontend component hierarchy (defined in `component-design.md`) includes shared components for `Map Preview`, `Search Bar`, `Filter Panel`, and an `API Client Layer`. F-022 adds a `Timeline Panel` shared component that integrates with the existing search and map systems.

State management (React Context / Redux per system-overview.md) receives a new slice/context for timeline state.

### 4.3 ADR Alignment

| ADR | Constraint | Compliance |
|---|---|---|
| ADR-001 (Resource-Centric) | Temporal data associated with Resource | ✓ Dates on Resource model + Metadata key-value pairs |
| ADR-002 (Modular Monolith) | No new module; extends search | ✓ |
| ADR-003 (DRF API) | REST endpoints for temporal data | ✓ ViewSets / custom endpoints |
| ADR-004 (Plugin Viewers) | Timeline is not a viewer — no conflict | ✓ |
| ADR-005 (Abstracted Publishing) | No publishing changes | ✓ |
| ADR-006 (Flexible Metadata) | Temporal fields stored as key-value | ✓ Requires key conventions (see §15) |

---

## 5. Design Goals

| Goal | Priority | Rationale |
|---|---|---|
| **Smooth interaction at 10K+ resources** | Critical | AC-08 mandates < 2 s render time for 10,000 resources |
| **Responsive map-timeline sync** | High | Users panning the map should see timeline update in < 500 ms |
| **Consistent date handling** | High | Resources may come from different sources with different timezones |
| **Low integration friction** | Medium | Timeline is optional; existing search + map flows must work unchanged when timeline is hidden |
| **Animation performance** | Medium | Animation frames must play at > 15 fps for a smooth experience |

---

## 6. Technical Constraints

1. **No new Django app** — feature extends `resources`, `metadata`, and `search` modules only.
2. **No WebSocket infrastructure** — all data flows are request-response (REST). Animation playback is purely client-side.
3. **No real-time updates** — timeline refreshes on user action or map pan, not via streaming.
4. **MapStore integration is via URL/API, not direct DOM access** — communication with MapStore goes through its public JavaScript API or URL state.
5. **Timeline library must be MIT/Apache-licensed** — must align with project licensing.
6. **All dates stored in UTC** — timezone conversion is a display-layer concern.

---

## 7. Non-Functional Requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Timeline render time for 10K resources | < 2 seconds (p95) |
| NFR-02 | Map pan → timeline update latency | < 500 ms |
| NFR-03 | Timeline → map filter latency | < 500 ms |
| NFR-04 | Animation frame rate | ≥ 15 fps for ≤ 500 resources, ≥ 8 fps for 500+ |
| NFR-05 | Search with temporal facets response time | < 2 seconds (p95) for 10K catalog |
| NFR-06 | Timeline UI memory footprint | < 100 MB for 10K resources |

---

## 8. Requirements-to-Design Traceability

| Requirement | Design Element(s) | Verification |
|---|---|---|
| FR-022-01 (Timeline View) | `TimelineView` component, `TemporalAggregationAPI`, clustering logic | AC-01 (100+ resources) |
| FR-022-02 (Calendar View) | `CalendarView` component, `TemporalAggregationAPI` (day-level counts) | AC-02 |
| FR-022-03 (Map-Timeline Sync) | `MapSync` hook, `TimelineStore`, `MapStore` integration | AC-03, AC-04 |
| FR-022-04 (Temporal Search Integration) | Extended `SearchAPI` params, `TemporalSearchFacet` component | AC-05 |
| FR-022-05 (Temporal Metadata Support) | Temporal key conventions in metadata module, fallback logic | AC-07 |
| FR-022-06 (Animation Mode) | `AnimationControls` component, `AnimationEngine` utility | AC-06 |
| AC-08 (Performance) | Virtual scrolling, clustering, lazy loading | AC-08 (perf test < 2 s) |

---

## 9. Reuse Analysis

| Existing Capability | Decision | Reason |
|---|---|---|
| F-005 Search API (`/api/search/`) | **Extend** | Add `date_from`, `date_to`, `date_field` query params |
| F-005 Search facets | **Extend** | Add temporal aggregated facets (year, month) |
| F-009 Map Store (MapStore API) | **Reuse** | Use MapStore's map extent API to get viewport bounds for timeline filtering |
| F-004 Metadata CRUD (`/api/resources/{id}/metadata/`) | **Reuse** | Temporal date fields stored/edited via existing metadata endpoints |
| `Resource.created_at` / `updated_at` | **Reuse** | Used as fallback temporal fields when explicit dates are missing |
| Material UI (existing design system) | **Reuse** | Calendar grid, date pickers, tooltips, sliders from MUI |
| API Client Layer | **Reuse** | Existing `apiClient` for all new endpoint calls |
| Resource Detail View (F-006) | **Reuse** | Timeline marker preview navigates to F-006 detail page |
| React Router | **Reuse** | Navigation from timeline markers to resource detail |

---

## 10. Alternatives Considered

### 10.1 Timeline Rendering Library

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **vis-timeline** (vis.js community edition) | Mature, zoom/pan built-in, clustering, custom styling | Bundle size (~150 KB gzipped), React wrapper is third-party | **Selected** |
| Custom d3-based timeline | Full control, no extra dependency | Significant engineering effort (estim. 2-3 weeks), no built-in interactive features | Rejected — too high effort |
| Custom canvas-based timeline | Maximum performance for 10K+ points | No accessibility, no CSS styling, extreme development cost | Rejected |
| Airbnb's react-dates | Calendar already built | No timeline, map sync would be custom | Rejected — does not meet timeline requirement |

**Decision**: Use **vis-timeline** (community edition, MIT licensed) via the `react-vis-timeline` wrapper or a thin custom React wrapper. If the bundle size becomes a concern at scale, we can code-split the timeline module.

### 10.2 Calendar View Implementation

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **Custom MUI Grid calendar** | Consistent with design system, full control | Manual implementation of date math and density heatmap | **Selected** |
| react-calendar | Ready-made, lightweight | Different styling, limited density heatmap support | Rejected — MUI alignment preferred |
| FullCalendar | Very feature-rich | Heavy bundle, opinionated event model | Rejected — overkill |

### 10.3 Clustering Strategy

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **API-level aggregation** | Minimal data over the wire, scalable | Server load for aggregation queries | **Selected primary** — backend returns counts per time bucket |
| Client-side clustering | Full control, real-time | Requires fetching all resource dates (~10K), high memory | Rejected for initial load; used for zoom transitions |

### 10.4 Animation Engine

| Option | Pros | Cons | Decision |
|---|---|---|---|
| **requestAnimationFrame loop** | Smooth, browser-optimized | Must manage frame timing manually | **Selected** |
| setInterval | Simple | Janky, unreliable frame rate | Rejected |
| Framer Motion AnimatePresence | Good for transitions | Not designed for frame-by-frame time iteration | Rejected |

---

## 11. Component Design

### 11.1 React Component Tree

```
TimelinePanel                    ← Top-level container (toggleable from search/map toolbar)
├── TimelineToolbar              ← Zoom level buttons, date field selector, view toggle (timeline/calendar)
├── TimelineView                 ← Horizontal timeline (uses vis-timeline if loaded, or fallback)
│   ├── TimelineAxis             ← Time scale ruler (decade/year/month/week/day labels)
│   ├── TimelineMarkers          ← Container for markers/clusters
│   │   ├── TimelineMarker       ← Individual resource marker
│   │   └── TimelineCluster      ← Grouped marker (count badge + density bar)
│   ├── TimelineTooltip          ← Hover preview (title, date, thumbnail)
│   └── TimelineRangeSelector    ← Draggable range selection overlay
├── CalendarView                 ← Month/year grid with density heatmap (toggle)
│   ├── CalendarHeader           ← Month/year navigation arrows + month/year selector
│   ├── CalendarGrid             ← CSS grid of day cells
│   │   └── CalendarDay          ← Single day cell (color intensity = count)
│   └── CalendarLegend           ← Color scale legend
├── AnimationControls            ← Play/pause, step, speed slider
│   ├── PlayPauseButton
│   ├── StepForwardButton
│   ├── StepBackwardButton
│   └── SpeedSlider
└── TemporalSearchFacet          ← Facet chip group (years, months) for F-005 search integration

Shared types (TypeScript interfaces):
- TimelineResource { id, title, date (ISO 8601), dateField, thumbnail?, resourceType, detailUrl }
- TimelineBounds { start: Date, end: Date }
- ZoomLevel: 'decade' | 'year' | 'month' | 'week' | 'day'
- CalendarDayData { date: string, count: number, resources?: TimelineResource[] }
```

### 11.2 Backend Components

```
search/
├── views.py                     ← Extended: temporal aggregation endpoint
├── serializers.py               ← Extended: TemporalAggregationSerializer
├── filters.py                   ← Extended: DateRangeFilter, DateFieldFilter
├── urls.py                      ← Extended: new temporal routes

metadata/
├── temporal_keys.py             ← NEW: Temporal field key constants and conventions
```

### 11.3 Frontend Service Modules

```
frontend/src/
├── features/
│   └── timeline/
│       ├── components/          ← All timeline React components
│       ├── hooks/
│       │   ├── useTimelineStore.ts        ← Timeline state (Zustand)
│       │   ├── useMapSync.ts              ← Map-timeline two-way sync
│       │   ├── useAnimationEngine.ts      ← requestAnimationFrame loop
│       │   └── useTemporalSearch.ts       ← Search integration hook
│       ├── services/
│       │   ├── temporalApi.ts             ← API client for temporal endpoints
│       │   └── clusteringEngine.ts        ← Client-side clustering utility
│       ├── types.ts            ← TypeScript interfaces
│       └── constants.ts        ← Zoom levels, date formats, etc.
├── store/
│   └── timelineStore.ts        ← Zustand store slice
└── shared/
    └── utils/
        └── dateUtils.ts        ← Date formatting, timezone, aggregation helpers
```

---

## 12. Runtime and Data Flows

### 12.1 Initial Timeline Load

```
User opens search/map page with timeline enabled
    ↓
TimelinePanel mounts
    ↓
useTimelineStore initializes: defaultBounds = [today - 1 year, today], zoomLevel = 'month'
    ↓
useMapSync reads current map viewport bounds from MapStore API
    ↓
temporalApi.fetchTemporalAggregation({
    bbox: mapBounds,
    date_field: 'acquisition_date',
    bucket: 'month',          // determined by zoom level
    date_from: bounds.start,
    date_to: bounds.end
})
    ↓
API returns: { buckets: [{ date: '2024-01', count: 12 }, ...], total_with_dates: 342, total_without_dates: 15 }
    ↓
TimelineView renders markers/clusters from bucket data
CalendarView (if toggled) renders day-level density
    ↓
If zoom < 'week': fetch aggregated counts only
If zoom >= 'week': fetch individual resource date list for visible range
```

### 12.2 Map Pan → Timeline Update

```
User pans/zooms 2D map (MapStore)
    ↓
MapStore fires 'extentchanged' event
    ↓
useMapSync hook listens, debounces (300 ms)
    ↓
Reads new map extent: [minX, minY, maxX, maxY]
    ↓
Transforms to geographic bounding box
    ↓
temporalApi.fetchTemporalAggregation({ bbox: newBounds, ...currentFilters })
    ↓
TimelineStore updates bucket data
    ↓
TimelineView re-renders with new markers
```

### 12.3 Timeline Selection → Map Filter

```
User drags range selection on timeline, or clicks calendar day
    ↓
TimelineRangeSelector emits onRangeChange({ start, end })
    ↓
TimelineStore.setSelectedRange({ start, end })
    ↓
useMapSync applies date filter to map:
    - If map supports filter API: call MapStore.setLayerFilter('date-filter')
    - If no native filter: reload map layers with date range URL param
    ↓
MapStore view updates to show only resources in selected range
    ↓
(Optional) Search results list updates to show filtered resources
```

### 12.4 Animation Playback

```
User clicks Play
    ↓
AnimationControls → useAnimationEngine.start()
    ↓
useAnimationEngine reads: { range: [start, end], speed: '1 day/frame', currentDate }
    ↓
requestAnimationFrame loop:
    ↓
  For each frame:
    1. Advance currentDate by step (determined by speed + zoom level)
    2. TimelineStore.setCurrentFrame(currentDate)
    3. useMapSync filters map to currentDate +/- half-step
    4. FrameIndicator updates
    5. If currentDate >= end: stop / loop
    ↓
User clicks Pause → useAnimationEngine.stop()
User clicks Step → advance one frame manually
User adjusts SpeedSlider → useAnimationEngine.setSpeed(newSpeed)
```

### 12.5 Temporal Search Integration

```
User types search query in F-005 search bar
    ↓
SearchAPI called with { q: query, date_from, date_to }
    ↓
Results include temporal facet aggregations:
    { facet: 'year', values: [{ value: '2024', count: 45 }, { value: '2023', count: 32 }] }
    ↓
TemporalSearchFacet renders year/month chips
    ↓
User clicks a facet year → SearchAPI updated with year filter
    ↓
Results and timeline both update
```

---

## 13. Data Model Changes

### 13.1 No New Database Tables

The existing `metadata` key-value model (ADR-006) is sufficient. No new models or migrations are required.

### 13.2 Temporal Metadata Key Conventions

To ensure consistency across resources, temporal metadata keys MUST follow a documented convention:

| Key | Type | Required | Description |
|---|---|---|---|
| `temporal.acquisition_date` | `date` (ISO 8601) | No | When the resource data was originally acquired/captured |
| `temporal.creation_date` | `date` (ISO 8601) | No | When the resource file was created |
| `temporal.publication_date` | `date` (ISO 8601) | No | When the resource was published/released |
| `temporal.date_custom` | `date` (ISO 8601) | No | User-specified custom date |
| `temporal.date_custom_label` | `string` | No | Label for the custom date field |
| `temporal.date_precision` | `enum` | No | `day`, `month`, `year` — indicates precision of the date |

**Temporal field resolution order** (for timeline display):
1. `temporal.acquisition_date` (if present)
2. `temporal.creation_date` (if present)
3. `Resource.created_at` (fallback)
4. Exclude from timeline if none of the above (user notified)

### 13.3 Database Index Recommendation

For performance at 10K+ resources, add a composite index on the metadata table for temporal queries:

```sql
CREATE INDEX CONCURRENTLY idx_metadata_temporal
ON metadata (resource_id, key, value)
WHERE key LIKE 'temporal.%';
```

This is a query optimization, not a schema change. The index can be added via a Django migration in the `metadata` app.

---

## 14. API Design

### 14.1 Extended Search Endpoint

**Existing**: `GET /api/search/`

**Extended with temporal parameters**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `date_from` | `string` (ISO 8601 date) | No | Start of temporal filter range |
| `date_to` | `string` (ISO 8601 date) | No | End of temporal filter range |
| `date_field` | `string` | No | Temporal key to use (default: `temporal.acquisition_date`) |
| `date_bucket` | `enum` | No | Aggregation bucket: `year`, `month`, `week`, `day` |

**Response additions** (in existing search response):

```json
{
    "count": 1240,
    "next": "...",
    "previous": null,
    "results": [...],
    "temporal_facets": {
        "years": [
            {"value": "2024", "count": 450},
            {"value": "2023", "count": 320}
        ],
        "months": [
            {"value": "2024-01", "count": 45},
            {"value": "2024-02", "count": 52}
        ]
    },
    "temporal_summary": {
        "total_with_dates": 1200,
        "total_without_dates": 40,
        "date_range": {
            "earliest": "2020-01-15",
            "latest": "2026-06-30"
        }
    }
}
```

### 14.2 Temporal Aggregation Endpoint (New)

**Purpose**: Provides pre-aggregated time bucket counts for timeline rendering. This is the primary data source for the timeline view, optimized for speed over completeness.

**Endpoint**: `GET /api/search/temporal-aggregation/`

**Parameters**:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `bbox` | `string` (comma-separated floats) | No | Spatial filter: `minx,miny,maxx,maxy` |
| `date_field` | `string` | No | Temporal key (default: `temporal.acquisition_date`) |
| `date_from` | `string` (ISO 8601 date) | No | Range start |
| `date_to` | `string` (ISO 8601 date) | No | Range end |
| `bucket` | `enum` | **Yes** | `year`, `month`, `week`, `day` |
| `q` | `string` | No | Search query to intersect with temporal |
| `resource_types` | `string` (comma-separated) | No | Filter by resource type |

**Response**:

```json
{
    "buckets": [
        {"date": "2024-01", "count": 12},
        {"date": "2024-02", "count": 8}
    ],
    "total_in_range": 120,
    "total_without_date": 15,
    "date_field_used": "temporal.acquisition_date",
    "available_date_fields": [
        {"key": "temporal.acquisition_date", "label": "Acquisition Date", "count": 800},
        {"key": "temporal.creation_date", "label": "Creation Date", "count": 600},
        {"key": "resource.created_at", "label": "Upload Date", "count": 1240}
    ]
}
```

**Implementation notes**:
- The aggregation is performed in PostgreSQL using `date_trunc()` on the metadata value cast to date
- For `resource.created_at` fallback, query the Resource table directly
- Response should be cached for 60 seconds at the API gateway / Redis layer for repeated calls during map panning

### 14.3 Bulk Date Assignment Endpoint

**Extends existing**: `POST /api/resources/{id}/metadata/`

Add temporal metadata via existing metadata CRUD. No new endpoint needed.

For bulk operations (FR-022-05 mentions bulk date assignment), extend the existing batch metadata endpoint if it exists, or create:

**New**: `POST /api/resources/bulk-metadata/`

```json
{
    "resource_ids": ["uuid-1", "uuid-2"],
    "metadata": {
        "temporal.acquisition_date": "2024-06-15"
    }
}
```

---

## 15. Integration Points

| Integration | Direction | Mechanism | Notes |
|---|---|---|---|
| **Timeline ↔ MapStore (F-009)** | Bidirectional | MapStore JavaScript API (`mapStore.getMapConfig()`, extent events) | MapStore exposes map state via window events or its own React context |
| **Timeline ↔ Search API (F-005)** | One-way (timeline reads search) | HTTP GET to search endpoint with temporal params | Timeline acts as a search consumer |
| **Timeline ↔ Resource Metadata (F-004)** | One-way (read) | HTTP GET to metadata endpoint(s) | Timeline reads `temporal.*` keys from metadata |
| **Calendar ↔ Temporal Aggregation API** | One-way (read) | HTTP GET to `/api/search/temporal-aggregation/` | Calendar view fetches day-level counts |
| **Animation ↔ MapStore** | One-way (animation drives map) | MapStore URL update or filter API | Animation frame updates map display via date filter |

### 15.1 MapStore Integration Detail

MapStore (the 2D map viewer) is embedded in the page. Communication patterns:

1. **Read map bounds**: Access MapStore's state via its React context or the global `mapStore` object. MapStore exposes `currentExtent` and `projection` through its API.

2. **Apply temporal filter**: MapStore has a **LayerFilter** capability. We can apply a CQL filter on the WMS/WFS layer if the layer is served through GeoServer. Alternatively, for resource previews that are rendered via MapStore's own layer management, we can add/remove layer groups based on the date range.

3. **Animation**: Update the CQL filter on each animation frame. For raster resources, switch between different WMS time dimensions if available.

**Fallback**: If MapStore's filter API is insufficient, the frontend can:
- Collect resource IDs matching the temporal range
- Toggle visibility layers per resource
- Redraw the map layer with a filter parameter

---

## 16. Storage Strategy

### 16.1 Database

- Temporal metadata stored in the existing `metadata` table (key-value)
- `Resource.created_at` / `updated_at` exist on the `resources_resource` table
- No new tables required
- Recommended: composite index on `metadata(key, value)` for temporal query patterns (see §13.3)

### 16.2 Caching

- Temporal aggregation responses SHOULD be cached in Redis with a 30–60 second TTL
- Cache key format: `temporal_agg:{bbox_hash}:{date_field}:{bucket}:{date_from}:{date_to}:{q}`
- This prevents redundant aggregation queries during rapid map panning
- Cache invalidated when new resources are uploaded or metadata changes (via Celery signal)

### 16.3 Client-Side Storage

- Timeline marker data cached in React state (Zustand store)
- No IndexedDB or localStorage required for v1
- Future optimization: cache aggregated data in sessionStorage for back-navigation

---

## 17. Performance Strategy

### 17.1 Server-Side

| Technique | Application | Target |
|---|---|---|
| **Aggregation queries** | Temporal aggregation endpoint uses SQL `date_trunc` + `COUNT` | Returns in < 200 ms for 10K |
| **Paginated resource fetching** | Individual resource data only fetched at zoom ≥ week level | Limits payload size |
| **Database index** | Composite index on metadata key-value | Sub-millisecond lookups |
| **Redis caching** | Cache aggregation results for 30-60 s | Avoids redundant queries during panning |
| **PostgreSQL materialized temporal summary** | Future: materialized view of date distributions | For pre-aggregated year/month counts |

### 17.2 Client-Side

| Technique | Application | Target |
|---|---|---|
| **Debounced map sync** | 300 ms debounce on map extent change events | Prevents API flood during pan |
| **Virtual scrolling** | Timeline at week+/day zoom uses virtual list | Only render visible markers |
| **Clustering** | API-level aggregation at low zoom levels (decade/year/month) | Minimizes DOM nodes |
| **Lazy loading** | Fetch individual resource data only when zoomed in to week/day | Avoids 10K marker renders |
| **Code splitting** | Timeline components loaded via `React.lazy()` | Keep initial bundle small |
| **Memoization** | `React.memo` on TimelineMarker, CalendarDay | Avoid re-render of unchanged markers |

### 17.3 Pre-rendering Budget

| Zoom Level | Max Visible Markers | Render Strategy |
|---|---|---|
| Decade | ~10 clusters (one per year) | API aggregation + cluster elements |
| Year | ~12 clusters (one per month) | API aggregation + cluster elements |
| Month | ~30-31 markers or ~5 week clusters | API aggregation, virtual scroll |
| Week | ~7 markers | Individual resource data, virtual scroll |
| Day | Variable (depends on resources) | Individual resource data, virtual scroll |

---

## 18. Scalability Strategy

### 18.1 Catalog Growth

**0 – 1,000 resources**: No special handling needed. All markers can render individually.

**1,000 – 10,000 resources**: API aggregation at decade/year/month zoom. Virtual scrolling at week/day zoom. AC-08 certifies this range.

**10,000 – 100,000 resources**: Same strategy, but API aggregation becomes essential even at week zoom. May require additional database tuning:
- Partition `metadata` table by key prefix
- Add BRIN index on metadata value (date-sorted data)
- Increase Redis cache TTL for aggregation results

**> 100,000 resources**: Future consideration. Options include:
- Server-side tile generation for timeline (pre-rendered timeline tiles)
- Materialized views with periodic refresh
- Dedicated temporal search index (Elasticsearch)

### 18.2 Concurrent Users

- Aggregation endpoint is read-only and primarily serves cached data
- Concurrent panning of the same area hits the Redis cache
- Worst-case: 10 users panning different areas simultaneously generates 10 unique aggregation queries per second → database handles without issue at 10K scale

---

## 19. Security Considerations

| Concern | Mitigation |
|---|---|
| **Permission enforcement** | All temporal aggregation queries MUST respect resource permissions. Aggregation counts should only include resources the current user can view. The search API already enforces this; extend the same permission filter to temporal endpoints. |
| **Information leakage via temporal aggregation** | Bucket counts could reveal existence of sensitive resources in a date range even if user cannot see individual resources. Mitigation: aggregation counts must respect the same permission filters as search. Empty buckets for which the user has no access are excluded, not returned as zero. |
| **Date injection** | `date_from` / `date_to` parameters validated as ISO 8601 dates. Reject non-date values with 400 Bad Request. |
| **Bounding box injection** | `bbox` parameter validated as 4 comma-separated float values within valid coordinate ranges (-180 to 180, -90 to 90). |
| **Rate limiting** | Temporal aggregation endpoint should respect existing API rate limits. Aggressive map panning is debounced client-side. |

---

## 20. Failure Scenarios and Recovery

| Scenario | Impact | Mitigation | Recovery |
|---|---|---|---|
| **Aggregation API timeout (> 5 s)** | Timeline shows empty/loading | Client-side timeout of 5 s; show partial results if any. | Retry with exponential backoff once. |
| **MapStore API unavailable** | No map bounds for timeline filter | Timeline loads without spatial filter (shows all resources). | Auto-retry MapStore connection every 2 s. |
| **Date parse failure for resource** | Single resource missing from timeline | Skip resource with console warning. Log metric for monitoring. | Data manager fixes date format via F-004. |
| **Animation frame render > 500 ms** | Choppy animation | Skip frames to maintain target fps. Auto-reduce step size. | User can slow speed slider. |
| **Memory exceeded for 10K markers** | Browser tab crash | Clustering + virtual scrolling limits DOM nodes to < 500 visible. | Fallback: Degrade to yearly aggregation only. |
| **Metadata service returns 500** | Timeline cannot determine dates | Timeline shows "Metadata unavailable" message. | Auto-retry on next interaction. |
| **PostGIS query for bbox is slow** | Slow timeline response after map pan | Add GiST index on resource geometry if not present. Bbox query joins metadata + resource tables, optimize with subquery. | Already mitigated by debounce + caching. |

---

## 21. Observability

### 21.1 Metrics

| Metric | Source | Purpose |
|---|---|---|
| `temporal_aggregation.duration_ms` | API middleware | Monitor aggregation query performance |
| `temporal_aggregation.cache_hit_ratio` | Redis cache | Track cache effectiveness |
| `timeline.render_time_ms` | Frontend performance API | Track client-side render time (AC-08) |
| `timeline.marker_count` | Frontend | Track how many markers are rendered |
| `timeline.animation_fps` | Frontend `requestAnimationFrame` callback | Monitor animation smoothness |
| `timeline.api_error_count` | Frontend error boundary | Track API failures |

### 21.2 Logging

- All temporal API requests logged at `INFO` level with duration and parameters
- Date parse failures logged at `WARN` level with resource ID
- Cache misses logged at `DEBUG` level
- Animation performance drops (< 10 fps) logged as `WARN` in browser console

### 21.3 Error Boundaries

- React error boundary around `TimelineView` — if timeline crashes, the error boundary displays "Timeline unavailable" without breaking the rest of the page
- Separate error boundary around `CalendarView`
- Separate error boundary around `AnimationControls`

---

## 22. Migration and Backward Compatibility

### 22.1 API Backward Compatibility

- Existing `GET /api/search/` endpoint continues to work unchanged. New `date_*` query parameters are optional.
- New `temporal_facets` and `temporal_summary` fields added to search response. Existing clients ignore unknown fields.
- New endpoint `/api/search/temporal-aggregation/` is additive; no existing endpoint is modified.

### 22.2 Frontend Backward Compatibility

- Timeline is visually hidden by default (toggled via toolbar button)
- Existing search and map flows are completely unaffected when timeline is hidden
- Adding timeline components does not change existing page layouts

### 22.3 Date Data Migration

- Existing resources without temporal metadata will use `Resource.created_at` as fallback
- A management command `migrate_temporal_metadata` can be provided to:
  1. Scan all resources
  2. For resources with `temporal.acquisition_date` in files (extracted during upload by F-003), populate the metadata key
  3. Report resources that lack any temporal data

### 22.4 Feature Flagging

Add a `FEATURE_TIMELINE_ENABLED` Django setting (default: `True`) that conditionally:
- Registers the temporal aggregation API routes
- Controls visibility of timeline UI elements

This allows operators to disable the feature entirely without code changes.

---

## 23. Engineering Scenarios

### 23.1 Normal Operation

**Input**: User opens search page with 500 resources, each having `temporal.acquisition_date` populated.
**Flow**: API aggregation returns 12 monthly buckets in < 50 ms. Timeline renders 12 clusters. Calendar shows 200+ day cells.
**Expected behavior**: Timeline renders in < 500 ms. FPS > 30 during animation. Map sync completes in < 200 ms.

### 23.2 Expected Scale (1,000 – 10,000 resources)

**Input**: 5,000 resources with dates spanning 5 years.
**Flow**: API aggregation returns 60 monthly buckets. At year zoom: 5 clusters. At month zoom: 60 clusters. At day zoom: ~1,800 individual dates (but only visible range ~30 days via virtual scrolling).
**Expected behavior**: Aggregation query < 200 ms. Timeline render < 1 s (AC-08). Animation at 15+ fps for day-step playback.

### 23.3 Extreme but Plausible Scale (50,000 resources)

**Input**: 50,000 resources, all dated, spanning 10 years.
**Flow**: API aggregation at year zoom: 10 clusters. Month zoom: 120 clusters. Day zoom: ~3,600 days with resources.
**Expected behavior**: Aggregation query < 1 s (with index). Timeline render < 1.5 s (clustered). Day-zoom virtual scroll essential. Animation at 8+ fps. Consider increasing cache TTL.

### 23.4 Concurrency — Rapid Map Panning

**Input**: User rapidly pans map across large area (5+ extent changes in 2 seconds).
**Flow**: Each pan triggers debounced API call. Only the last call after 300 ms debounce executes. Cache hit likely if same area revisited.
**Expected behavior**: No more than 1 API call per 300 ms. Cache hit ratio > 80% for adjacent pans. No API overload.

### 23.5 Dependency Failure — MapStore Unavailable

**Input**: MapStore fails to load (CDN failure, JavaScript error).
**Flow**: `useMapSync` detects MapStore API is unavailable. Timeline loads in standalone mode (no spatial filter).
**Expected behavior**: Timeline renders all resources. Map area shows "Map unavailable" placeholder. Timeline still fully functional for browsing.

### 23.6 Permission Failure — Unauthorized Temporal Request

**Input**: Unauthenticated user accesses temporal aggregation endpoint.
**Flow**: DRF permission classes reject with 401 Unauthorized.
**Expected behavior**: Timeline shows login prompt. Calendar does not render. Map shows public resources only.

### 23.7 Invalid Input — Malformed Date Filter

**Input**: User (or attacker) sends `date_from=not-a-date` to temporal aggregation endpoint.
**Flow**: DRF serializer validates ISO 8601 format. Validation fails → 400 Bad Request with error message.
**Expected behavior**: Timeline shows error state: "Invalid date filter". Does not crash. Previous valid state retained.

### 23.8 Malicious Usage — Aggregation Probing

**Input**: Attacker cycles through date_from/date_to values to deduce temporal distribution of private resources.
**Flow**: Permission filters still apply. Aggregation counts only include resources the attacker can view. No information leakage beyond what search already exposes.
**Expected behavior**: Attacker sees same data they would see through the search API. No additional information revealed.

### 23.9 Partial Failure — Metadata Service Degraded

**Input**: Metadata database replica is under load, queries take 5+ seconds.
**Flow**: API timeout (set at 3 s) triggers. Request returns 503 or partial results.
**Expected behavior**: Timeline shows "Temporal data temporarily unavailable" message. Existing map and search remain functional. Auto-retry in 30 seconds.

### 23.10 Recovery — Redis Cache Flush

**Input**: Redis cache is flushed (deployment, maintenance).
**Flow**: Temporal aggregation cache keys are all empty. First request after flush hits database directly.
**Expected behavior**: Slightly slower response (< 500 ms vs < 50 ms cached). Subsequent requests repopulate cache. No user-visible difference beyond brief load time.

---

## 24. Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **vis-timeline library performance with 10K+ markers** | Medium | High — janky UI | Clustering at API level limits markers to < 100 in most views; virtual scrolling at day zoom |
| **MapStore CQL filter API insufficient for animation** | Medium | High — animation requires map layer reload per frame | Fallback to URL-based layer reload; animation step size matches render budget |
| **Temporal metadata inconsistency across resources** | High | Medium — some resources missing from timeline | Fallback chain (acquisition → creation → created_at); clear user notice for undated resources |
| **Browser tab CPU throttling during animation** | Low | Medium — animation slows when tab backgrounded | Pause animation when page visibility changes (Page Visibility API) |
| **Time zone confusion leads to date shifting** | Medium | Medium — resources shown on wrong day | All dates stored in UTC; display in user's timezone; clear timezone indicator in UI |
| **PostgreSQL date_trunc performance on key-value metadata** | Medium | Medium — slow aggregation queries | Composite index on metadata key-value; consider date type column for temporal metadata in future |

---

## 25. Required ADRs

### ADR-REQ-F022-001: Temporal Metadata Key Conventions

**Reason required**: The flexible metadata model (ADR-006) allows arbitrary keys. Without a convention, resource dates will be inconsistent across uploads, making the timeline unreliable.

**Decision impact**: All resource uploads and metadata editing must use the documented key scheme.

**Alternatives**:
1. Add `acquisition_date` and `creation_date` as explicit columns on the Resource model — rejected because it conflicts with ADR-006 (flexible metadata) and would require a model migration
2. Use JSONField on Resource for temporal metadata — rejected because it's harder to index for aggregation queries

**Recommended direction**: Adopt the key convention defined in §13.2. Enforce at the application level (metadata validation hooks).

**Approval status**: **Pending** — requires human review.

---

### ADR-REQ-F022-002: Timeline Rendering Technology

**Reason required**: The choice of timeline library determines client bundle size, maintainability, and performance characteristics.

**Decision impact**: Bundle size increases by ~150 KB (gzipped) if vis-timeline is used. Custom implementation avoids the dependency but costs 2-3 weeks of development.

**Alternatives**:
1. vis-timeline (community edition, MIT) — selected for maturity and built-in features
2. Custom d3 implementation — rejected for high development cost
3. Custom canvas implementation — rejected for accessibility and maintainability concerns

**Recommended direction**: vis-timeline community edition with code splitting.

**Approval status**: **Pending** — requires human review.

---

### ADR-REQ-F022-03: Temporal Aggregation at API Level

**Reason required**: Clustering/aggregation strategy determines server load, API contract, and timeline scalability.

**Decision impact**: All temporal data for timeline goes through a single aggregation endpoint. Client-side clustering is a fallback for zoom transitions.

**Alternatives**:
1. Client-side clustering only — requires fetching all dates, memory-intensive at 10K+
2. Pre-computed materialized views — optimal performance but adds schema complexity
3. API-level SQL aggregation with caching — selected for balance of performance and simplicity

**Recommended direction**: Implement aggregation endpoint with `date_trunc` in PostgreSQL and Redis caching.

**Approval status**: **Pending** — requires human review.

---

## 26. Engineering Assumptions

| ID | Assumption | Rationale | Testability | Fallback |
|---|---|---|---|---|
| EA-01 | MapStore exposes map extent via JavaScript API | F-009 documentation indicates MapStore has a public API | Can be verified by inspecting MapStore integration code | Read extent from URL parameters |
| EA-02 | MapStore supports CQL (Contextual Query Language) filters on layers | Standard GeoServer + MapStore feature | Verify with MapStore admin documentation | Use URL-based layer reload per frame |
| EA-03 | Average temporal metadata coverage is > 80% for uploaded resources | F-003 metadata extraction populates acquisition_date for geospatial files | Can be measured from production data | Fallback to created_at; bulk migration tool |
| EA-04 | Users primarily interact with timeline at month/year zoom levels | Day-level browsing is edge case for most users | Can be validated via usage analytics | Optimize for month/year; day/week is progressive enhancement |
| EA-05 | Maximum animation range is 10 years (3,650 day-frames max) | Practical limit for geospatial time series | Configurable constant (can be adjusted) | Animation range capped at backend level, warn user if exceeded |
| EA-06 | vis-timeline community edition remains MIT-licensed | vis.js was relicensed to MIT in community fork | Verify license in package.json | Switch to custom lightweight implementation as fallback |
| EA-07 | Browser supports `requestAnimationFrame` and `Page Visibility API` | Target is modern browsers (Chrome, Firefox, Safari, Edge) | Feature-detect in component | Fall back to `setTimeout`-based animation loop |

---

## 27. Human Technical Decisions

These decisions are reserved for human engineering leadership:

| ID | Decision | Options | Recommended | Rationale |
|---|---|---|---|---|
| HTD-01 | **Default timeline date field** | (a) `acquisition_date`, (b) `creation_date`, (c) `created_at` | `acquisition_date` with configurable fallback chain | Aligns with user expectation — acquisition date is the semantically meaningful date |
| HTD-02 | **Resource types included in animation** | (a) All resource types with dates, (b) Raster/imagery only | All resource types with dates | Simpler model; animation filters map by time, not by type |
| HTD-03 | **Calendar density display** | (a) Resource count per day, (b) Binary indicator | Resource count with color intensity scale | More informative; matches user story about coverage gaps |
| HTD-04 | **Maximum animation date range** | (a) No limit, (b) 1 year, (c) 5 years, (d) 10 years | 10 years (configurable) | Practical limit; prevents accidental memory overload |
| HTD-05 | **Feature flag name and default** | Name + default value | `FEATURE_TIMELINE_ENABLED = True` | Off-by-default risks low adoption; on-by-default with quick rollback |

---

## 28. Open Technical Questions

| Q# | Question | Impact | Suggested Resolution Path |
|---|---|---|---|
| OQ-01 | Should MapStore synchronization use URL-based layer filtering (simpler) or the CQL filter API (more flexible)? | Animation performance, sync latency | Prototype both approaches in a trace spike during Milestone 1 |
| OQ-02 | How should the timeline handle leap seconds, calendar reforms, or dates before 1970? | Date edge cases | Use standard JavaScript `Date` (epoch-based); pre-1970 dates are valid ISO 8601 strings; no special handling needed for initial implementation |
| OQ-03 | Should the timeline panel be docked (fixed below search bar) or floating (collapsible drawer)? | UX, implementation effort | Docked panel below search bar, collapsible with toggle button; matches existing layout patterns |
| OQ-04 | Should animation export (GIF/video) be scaffolded in v1 even though it's out of scope? | Future effort | No — defer per feature spec §5. Design animation engine so that frame capture can be added later via a `FrameCapturePlugin` interface |

---

## 29. Readiness Review

| Criterion | Status |
|---|---|
| Source Feature Specification validated | ✓ (Draft — "Ready for Technical Planning" marker pending) |
| Requirements traced to design | ✓ (See §8) |
| Architecture alignment verified | ✓ (See §4) |
| Reuse analysis completed | ✓ (See §9) |
| Components defined | ✓ (See §11) |
| Interfaces defined | ✓ (See §14) |
| Data model changes defined | ✓ (See §13 — no new tables, key conventions only) |
| API design complete | ✓ (See §14) |
| Storage strategy defined | ✓ (See §16) |
| Performance reviewed | ✓ (See §17) |
| Scalability reviewed | ✓ (See §18) |
| Security reviewed | ✓ (See §19) |
| Failure scenarios evaluated | ✓ (See §20, §23) |
| Observability defined | ✓ (See §21) |
| Migration considered | ✓ (See §22) |
| Technical risks documented | ✓ (See §24) |
| Blocking Human Technical Decisions resolved | **No** — 5 Human Technical Decisions pending approval (See §27) |
| Required ADR approvals completed | **No** — 3 ADRs pending approval (See §25) |

**Ready for Task Planning**: **NO**

**Blocks**:
1. Feature Specification requires "Ready for Technical Planning: YES" marker (status is currently "Draft")
2. 3 ADRs require human approval (ADR-REQ-F022-001, ADR-REQ-F022-002, ADR-REQ-F022-003)
3. 5 Human Technical Decisions require resolution (HTD-01 through HTD-05)

---

## Appendix A: Implementation Milestone Breakdown

The following is a suggested implementation order. This is **informative** for task planning (AGENT-104) and not prescriptive.

| Phase | Components | Effort | Dependencies |
|---|---|---|---|
| **M1 — Foundation** | Temporal key conventions, DB index, temporal metadata validation | Small | F-004 (Metadata), F-003 |
| **M2 — API** | Temporal aggregation endpoint, search extension, permission integration | Medium | F-005 (Search), M1 |
| **M3 — Timeline View** | TimelinePanel, TimelineView, TimelineToolbar, clustering, tooltips | Large | M2, vis-timeline library |
| **M4 — Calendar View** | CalendarView, CalendarGrid, CalendarDay, density heatmap | Medium | M2 |
| **M5 — Map Sync** | useMapSync hook, debounced extent sync, timeline-selection filter for map | Medium | M3, F-009 (Map) |
| **M6 — Animation** | AnimationControls, useAnimationEngine, speed/direction controls | Medium | M5 |
| **M7 — Search Integration** | TemporalSearchFacet, search result timeline summary, facet wiring | Small | M2, M3, F-005 |
| **M8 — Polish** | Performance tuning for 10K, error states, loading skeletons, accessibility, bulk date management tool | Medium | M3-M7 |

### Effort Estimates

| Phase | Effort | Person-Days (approx.) |
|---|---|---|
| M1 — Foundation | Small | 2–3 |
| M2 — API | Medium | 5–7 |
| M3 — Timeline View | Large | 10–15 |
| M4 — Calendar View | Medium | 5–7 |
| M5 — Map Sync | Medium | 5–8 |
| M6 — Animation | Medium | 5–7 |
| M7 — Search Integration | Small | 3–5 |
| M8 — Polish | Medium | 5–8 |
| **Total** | | **40–60 person-days** |
