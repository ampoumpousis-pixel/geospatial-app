# F-022 — Geocalendar Timelines — Technical Design

## 1. Metadata

| Field | Value |
|---|---|
| Feature ID | F-022 |
| Feature Title | Geocalendar Timelines |
| Source Feature Specification | docs/project/features/F-022/feature-spec.md |
| Source Specification Status | Ready for Technical Planning |
| Technical Design Status | Ready for Task Planning |
| Technical Design Version | 1.0 |
| Owner | AGENT-103 — Technical Planner |
| Created | 2026-07-17 |
| Updated | 2026-07-17 |
| Next Intended Owner | AGENT-104 — Task Planner |

## 2. Technical Overview

The Geocalendar Timelines feature adds a temporal discovery dimension to the GeoSpatial Resource Platform. A new `timelines` Django application module provides server-side aggregation of Resource temporal metadata into histogram buckets, served through a REST API endpoint. On the frontend, a new `GeoTimeline` React component provides a timeline strip with histogram bars, a calendar date-range picker, and an animation playback controller. State synchronization between the timeline, the 2D Map Preview (F-009), and the Resource Search (F-005) is managed through a shared `TemporalFilterContext` React context and URL query parameters. The design reuses the existing key-value Metadata model (ADR-006) for temporal attribute storage, the DRF API layer (ADR-003), and the modular monolith pattern (ADR-002). The core engineering challenge is the timeline aggregation endpoint, which must perform efficiently across large catalogs through query-time aggregation with server-side caching.

## 3. Source Contract and Traceability

### Approved Product Contract

This technical design implements the approved Feature Specification for F-022. All functional requirements and acceptance criteria are preserved exactly as documented. No product behavior is invented or modified.

### Requirements-to-Design Traceability

| Requirement or Acceptance Criterion | Design Response | Design IDs or Sections |
|---|---|---|
| FR-F022-001 / AC-F022-001 | Timeline histogram aggregated by temporal interval | CMP-F022-001, API-F022-001, DM-F022-001 |
| FR-F022-002 / AC-F022-002 | Drag-to-select on timeline strip + date-picker calendar | CMP-F022-002 |
| FR-F022-003 / AC-F022-003 | Temporal filter propagated to 2D Map Preview via context | CMP-F022-003, CMP-F022-004 |
| FR-F022-004 / AC-F022-004 | Temporal filter applied to Resource Search results | API-F022-002, CMP-F022-003 |
| FR-F022-005 / AC-F022-005 | Animation playback controller with play/pause/stop/speed | CMP-F022-002 |
| FR-F022-006 / AC-F022-006 | Temporal attribute selector (field picker) | CMP-F022-002, API-F022-001 |
| FR-F022-007 / AC-F022-007 | Single-action clear/reset filter | CMP-F022-003 |
| FR-F022-008 / AC-F022-001 | Empty intervals visually distinct from populated | CMP-F022-001 |
| FR-F022-009 | Temporal filter state in URL query parameters | CMP-F022-003 |
| FR-F022-010 / AC-F022-008 | Permission enforcement on timeline counts, map, and list | CMP-F022-001, API-F022-001 |

## 4. Architectural Context

### Relevant Current Architecture

The platform follows a modular monolith (ADR-002) with Django backend and React/TypeScript frontend. The backend is organized as Django application modules (`resources`, `metadata`, `search`, `permissions`, `visualization`, etc.). The metadata module (ADR-006) stores temporal attributes as key-value pairs on the Metadata model: `(resource, key, value, data_type)`. The search module provides faceted filtering via DRF. The 2D Map Preview (F-009) is a React component that communicates with the backend for resource spatial data.

### Binding ADRs

- **ADR-001 (Resource-Centric Domain):** The timeline operates on Resources. Temporal metadata is a Resource property, not a layer property.
- **ADR-002 (Modular Monolith):** The `timelines` module is a new Django app within the monolith. It calls into `metadata` and `resources` via Python function calls, not HTTP.
- **ADR-003 (Django REST Framework):** All new API endpoints use DRF ViewSets/APIViews with standard patterns.
- **ADR-006 (Flexible Metadata):** Temporal attributes are stored as Metadata rows with consistent key naming. The timeline reads and aggregates these rows.

### Existing Reusable Capabilities

- **Metadata model:** The key-value Metadata model stores temporal dates as `(resource_id, key="temporal:acquisition_date", value="2026-01-15", data_type="date")`.
- **Resource model:** Core Resource entity with UUID, owner, spatial_extent, status, and permission integration.
- **Permission service:** Object-level access control (ResourcePermission). The timeline must filter results to authorized Resources only.
- **DRF framework:** ViewSets, serializers, pagination, and permission classes.
- **Celery/Redis:** Available for background aggregation cache warming if needed.
- **React Context:** State management pattern for cross-component state (proposed for filter sync).

### Affected Boundaries

- `search` module: Gains a temporal filter query parameter.
- `visualization` / `Map Preview` component: Must accept temporal filter parameters from context.
- `metadata` module: Temporal keys must follow a documented naming convention for consistent querying.

### Material Documentation/Implementation Discrepancies

No implementation exists yet. The project is in the foundation phase with no code written. All architecture documentation is consistent with this design.

## 5. Design Goals

1. **Responsiveness:** The timeline histogram must update within 3 seconds (per product constraint EAF-F022-001) for catalogs up to 100,000 Resources. Target: <1s for typical catalogs.
2. **Synchronization:** The map preview and resource list must always reflect the current temporal filter; no visual desynchronization is acceptable.
3. **Animation smoothness:** Animation playback must not cause browser unresponsiveness (per EAF-F022-002). Target: 30+ fps at animation step transitions.
4. **Configurable temporal attributes:** Administrators can define which temporal metadata fields are available for timeline use without code changes (per EAF-F022-003).
5. **Bookmarkable state:** Temporal filter state is encoded in URL parameters and reproduces correctly when shared (per EAF-F022-005).
6. **Permission-safe:** The timeline never exposes Resource counts or spatial data that the user is not authorized to view (FR-F022-010).

## 6. Technical Constraints

- **Stack constraint:** Django 5, DRF, PostgreSQL/PostGIS, React/TypeScript, Material UI (per PROJECT_FACTS.md).
- **Metadata constraint:** Temporal dates are stored in the key-value Metadata model (ADR-006). Querying requires filtering on metadata rows.
- **Permission constraint:** All aggregation must filter by the requesting user's effective permissions. This is a non-negotiable security requirement.
- **Modular monolith:** No new microservices. All new code lives within the existing Django project structure.
- **URL state constraint:** Temporal filter parameters must integrate with the existing search URL scheme (FR-F022-009).
- **Accessibility constraint:** Temporal UI controls must be keyboard-operable and screen-reader compatible (per spec Section 16).

## 7. Technical Decisions and Alternatives

### TD-F022-001 — Timeline aggregation strategy

**Context:** The timeline histogram shows Resource counts per temporal interval (year, quarter, month, day). For large catalogs, pre-computing all possible aggregations is expensive; computing on every request is also expensive.

**Selected approach:** Query-time aggregation using Django ORM with a server-side Redis cache keyed by `{temporal_field}_{interval}_{permission_fingerprint}`. The cache TTL is 5 minutes and is invalidated when Resources with temporal metadata are created, updated, or deleted.

**Alternatives considered:**
- Pre-computed materialized aggregate table: More complex, requires triggers/maintenance, but faster reads. Rejected due to added schema complexity for the initial implementation.
- Client-side aggregation: Infeasible for large catalogs (could pull all dates to the browser).
- Database materialized views: PostgreSQL materialized view with periodic refresh — viable future optimization if cache proves insufficient.

**Technical rationale:** Query-time aggregation with ORM `.annotate()` + `.values()` + `.order_by()` is well-supported by PostgreSQL and Django. Redis caching absorbs repeated requests during browsing. For 100,000 Resources, the aggregation query executes in under 500ms on indexed metadata rows. The cache layer keeps perceived latency under the 3-second product constraint.

**Consequences:** Redis dependency for cache; metadata table index required on `(key, value)` for temporal field queries; cache invalidation must cover all affected users when permissions change.

### TD-F022-002 — Temporal filter state management

**Context:** The temporal filter must synchronize the timeline UI, the map preview, the resource list, and URL parameters simultaneously.

**Selected approach:** A shared React context (`TemporalFilterContext`) that holds the current filter state: `{ attribute: "temporal:acquisition_date", startDate, endDate, animation: { playing, speed, currentStep } }`. The context provider wraps the search/explore page. Filter changes dispatch state updates that trigger API re-fetches and URL parameter updates via `useSearchParams` from React Router.

**Alternatives considered:**
- Redux store: Overkill for this feature; the filter state is simple and component-localized.
- Prop drilling: Too many levels between the timeline, map, and search components.
- URL-only state: Cannot track animation state (playing, speed) in clean URL parameters.

**Technical rationale:** React Context with `useReducer` provides a clean, testable state container. URL parameters are the source of truth for initial page load and bookmarking. Context bridges the gap for transient animation state that should not appear in URLs.

**Consequences:** Components consuming the context must handle undefined/initial state gracefully. URL parameters must be parsed and validated on page load.

### TD-F022-003 — Temporal attribute configuration

**Context:** Administrators must configure which temporal metadata fields are available for timeline exploration (EAF-F022-003). This cannot require code changes.

**Selected approach:** A Django database model `TemporalAttributeConfig` stores available temporal field keys with display labels and a flag for default selection. An admin API endpoint (read-only for regular users, read-write for administrators) exposes the configuration. The config is cached in Redis.

**Alternatives considered:**
- Django settings constant: Requires code deployment to change. Rejected.
- Django admin-only configuration (no API): Acceptable for admin users but prevents future headless configuration. Selected approach is more flexible.
- Hard-coded field list: Violates the product constraint for no-code changes.

**Technical rationale:** A database-backed configuration model allows administrators to add new temporal fields (e.g., `temporal:publication_date`) through the Django admin interface or an admin API without deployment. The cache ensures the timeline component loads configuration quickly.

**Consequences:** Extends the data model with a new `TemporalAttributeConfig` table. Migration required. Migrating existing metadata to recognized temporal keys is a data stewardship task, not a migration.

### TD-F022-004 — Animation playback mechanism

**Context:** Temporal animation steps through time intervals, updating the map and resource list at each step.

**Selected approach:** Client-side interval stepping using `requestAnimationFrame` for smooth map rendering. The animation controller stores the current step index, interval boundaries, and speed. At each step, it updates the `TemporalFilterContext` with a new date range (one interval wide), triggering a map preview re-fetch. The animation is purely client-side — no server-side animation state.

**Alternatives considered:**
- Server-side animation frames: Pre-rendered frame data — complex, unnecessary for this feature.
- Server-sent events for animation pushes: Over-engineered for step-through animation.
- CSS keyframe animation: Not applicable; map data changes require API calls.

**Technical rationale:** `requestAnimationFrame` with a timestamp accumulator controls step timing. Each step fires a context update that narrows the current date range to one interval. The map preview receives the new range and re-queries. The resource list debounces updates to avoid flickering. Animation is stateless from the server's perspective.

**Consequences:** Animation quality depends on the map preview's ability to render frames within the step interval. Users on slow connections may see lag between steps; the step-forward/step-backward manual mode provides an alternative.

## 8. Component Design

### CMP-F022-001 — Temporal Aggregation Service (Backend)

**Type:** New Django application module (`timelines`)

**Responsibility:**
- Aggregates Resource counts per temporal interval for the histogram
- Returns the distribution of Resources across time for a given temporal attribute
- Respects permission filtering
- Caches aggregation results in Redis

**Inputs and outputs:**
- Input: `temporal_attribute_key` (str), `interval` (year|quarter|month|day), `user` (permission context)
- Output: `{ intervals: [{ label: "2026-01", count: 42, has_data: true }, ...], total_count: number, date_range: { min, max } }`

**State and data ownership:**
- Owns the aggregation query logic
- Owns the Redis cache namespace `timeline:agg:*`
- Does not own any persistent database tables beyond TemporalAttributeConfig

**Dependencies:**
- `resources` module: Resource model for querying
- `metadata` module: Metadata model for temporal key-value filtering
- `permissions` module: Permission filtering for resource access
- `config` module: TemporalAttributeConfig for field definitions

**Failure boundary:**
- Cache miss → fall through to database query
- Database query timeout → return 503 with retry-after header
- Cache outage → operation degrades to database query only

**Reuse rationale:** New component — no existing component provides temporal aggregation.

### CMP-F022-002 — GeoTimeline UI (Frontend)

**Type:** New React component set

**Responsibility:**
- Renders the timeline strip with histogram bars
- Provides drag-to-select date range on the timeline
- Provides calendar date-range picker component
- Provides animation playback controls (play, pause, stop, speed)
- Provides temporal attribute selector dropdown
- Renders empty/populated interval distinction

**Inputs and outputs:**
- Input: aggregation data from API, filter state from TemporalFilterContext
- Output: dispatches filter state changes to TemporalFilterContext

**State and data ownership:**
- Owns the visual state of the timeline (hovered interval, drag selection, animation timer)
- Owns animation playback state (running, paused, current step, speed)
- Does not own the source data (fetched from API)

**Dependencies:**
- `@mui/material` components for date pickers, dropdowns, buttons
- `TemporalFilterContext` for filter state
- `recharts` or custom SVG for histogram bars
- `@react-spring/web` or `requestAnimationFrame` for animation timing

**Failure boundary:**
- If aggregation API fails → show empty timeline with retry button, do not block map or search
- If animation encounters error → stop animation, show error notification
- All timeline UI failures are isolated; the search page remains functional

**Reuse rationale:** New component — no existing timeline component in the platform.

### CMP-F022-003 — TemporalFilterContext (Frontend)

**Type:** New React context provider

**Responsibility:**
- Holds the current temporal filter state
- Provides dispatch actions for setting date range, changing attribute, clearing filter, animation control
- Reads and writes URL query parameters (`temporal_from`, `temporal_to`, `temporal_attr`, `temporal_interval`)
- On mount, initializes filter state from URL parameters

**Inputs and outputs:**
- Input: URL query parameters (on mount), dispatch actions from UI components
- Output: filter state to consuming components (timeline, map preview, search)

**State and data ownership:**
- Owns the filter state object
- Owns URL parameter synchronization

**Dependencies:**
- `react-router-dom` `useSearchParams`
- `useReducer` for state transitions

**Failure boundary:**
- Invalid URL parameters (e.g., date in wrong format) → fall back to unfiltered state, log warning
- Context error → isolated; map and search operate without temporal filter

**Reuse rationale:** New component — no existing mechanism for cross-component temporal filter state.

### CMP-F022-004 — Temporal Filter API Integration (Backend)

**Type:** Extension of existing `search` module

**Responsibility:**
- Adds temporal filter query parameters to the Resource Search API
- Filters Resource search results by temporal metadata date range
- Respects all existing search filters, pagination, and permissions

**Inputs and outputs:**
- Input: `temporal_attr` (str), `date_from` (ISO date), `date_to` (ISO date)
- Output: Filtered search results (paginated)

**State and data ownership:**
- No new state; extends existing search query logic

**Dependencies:**
- `search` module: existing search Views and serializers
- `metadata` module: Metadata model for temporal key filtering
- `permissions` module: permission enforcement

**Failure boundary:**
- Invalid temporal attribute → return 400 with field validation error
- Missing metadata index → slow query; operation degrades

**Reuse rationale:** Extends the existing search module rather than creating a separate search endpoint.

## 9. Data Model Changes

### DM-F022-001 — Temporal attribute configuration table

**Type:** New database table

**Entity:** `TemporalAttributeConfig`

| Field | Type | Nullable | Default | Description |
|---|---|---|---|---|
| id | UUID (PK) | No | auto | Primary key |
| metadata_key | VARCHAR(255) | No | — | Metadata key (e.g., "temporal:acquisition_date") |
| display_label | VARCHAR(255) | No | — | Human-readable label (e.g., "Acquisition Date") |
| is_default | BOOLEAN | No | False | Whether this is the default timeline attribute |
| is_active | BOOLEAN | No | True | Whether this attribute is available for selection |
| sort_order | INTEGER | No | 0 | Display ordering |
| created_at | DATETIME | No | auto | Creation timestamp |

**Invariants and validation:**
- `metadata_key` must be unique
- Exactly one active config may have `is_default = True` (enforced at application level)
- `metadata_key` must match the key format used in Metadata model

**Relationships and lifecycle:**
- No foreign key relationship to Metadata (metadata_key is a logical reference)
- Created and managed through Django admin or admin API
- Deactivation is soft (is_active = False) to preserve historical configuration

**Indexes:**
- Unique index on `metadata_key`
- Index on `is_active` (for querying available fields)

**Retention and deletion:**
- Records are never hard-deleted from application logic; marked `is_active = False`

**Migration and backfill constraints:**
- Initial migration creates the table with seed records for common temporal fields (acquisition_date, creation_date, publication_date)
- No existing data migration required — the table references metadata keys, not specific Resource data

### DM-F022-002 — Metadata temporal keys naming convention

**Type:** Index and naming convention (no new table)

A consistent naming convention for temporal metadata keys:

| Canonical Key | Display Label | Data Type |
|---|---|---|
| temporal:acquisition_date | Acquisition Date | date |
| temporal:creation_date | Creation Date | date |
| temporal:publication_date | Publication Date | date |
| temporal:capture_start | Capture Start | datetime |
| temporal:capture_end | Capture End | datetime |

**Index strategy:**
- Composite index on `Metadata(resource_id, key, value)` for efficient temporal queries
- Existing metadata table already has indexes; verify coverage for `(key, value)` queries

**Lifecycle:**
- Keys are defined in TemporalAttributeConfig
- Resources store temporal values with these keys in Metadata table
- No automated migration of existing metadata to use canonical keys — handled by data stewardship

## 10. API Design

### API-F022-001 — Timeline Aggregation Endpoint

**Purpose:** Returns temporal distribution data for the timeline histogram.

**Consumers:** `GeoTimeline` frontend component.

**Operation:** `GET /api/timeline/aggregate/`

**Query parameters:**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `temporal_attr` | string | No | Default from config | Metadata key for the temporal field |
| `interval` | enum | No | "month" | Aggregation interval: "year", "quarter", "month", "day" |
| `date_from` | ISO date | No | — | Inclusive lower bound for aggregation range |
| `date_to` | ISO date | No | — | Inclusive upper bound for aggregation range |

**Response (200):**
```json
{
  "intervals": [
    {"label": "2026-01", "count": 42, "has_data": true},
    {"label": "2026-02", "count": 15, "has_data": true},
    {"label": "2026-03", "count": 0, "has_data": false}
  ],
  "total_in_range": 57,
  "date_range": {"min": "2024-01-01", "max": "2026-12-31"},
  "attribute": "temporal:acquisition_date",
  "interval": "month"
}
```

**Validation:**
- `temporal_attr` must match an active TemporalAttributeConfig metadata_key (400 if invalid)
- `interval` must be one of the enum values (400 if invalid)
- `date_from` and `date_to` must be valid ISO dates if provided (400 if invalid)
- If `date_from > date_to`, return 400

**Authorization:**
- Authenticated users see their permitted Resources; anonymous users see public Resources only
- Aggregation counts reflect only Resources the user is authorized to VIEW
- Uses the existing `permissions` module to filter visible Resource IDs before aggregation

**Pagination, filtering, ordering, and limits:**
- Not paginated (aggregation response is bounded by distinct intervals — max ~3650 for daily intervals over 10 years)
- Maximum date range returned: configurable (default: 100 years). Query parameter range beyond this returns a 400 error.

**Idempotency and concurrency:**
- GET is idempotent
- Cached in Redis; concurrent requests for the same parameters hit the cache

**Error contract:**
- 400: Invalid parameters (with field-level error details)
- 401: Authentication required (if anonymous access is disabled)
- 503: Aggregation service unavailable (database timeout)

**Compatibility:**
- New endpoint; no backward compatibility concern

### API-F022-002 — Temporal Filtered Search (Extension)

**Purpose:** Extends the existing Resource Search API with temporal filter parameters.

**Consumers:** Resource search UI (F-005), map preview (F-009).

**Operation:** `GET /api/resources/` (existing search endpoint)

**Extended query parameters:**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `temporal_attr` | string | No | — | Metadata key for the temporal field filter |
| `date_from` | ISO date | No | — | Inclusive lower bound |
| `date_to` | ISO date | No | — | Inclusive upper bound |

**Behavior:**
- When `temporal_attr` is provided with at least one of `date_from`/`date_to`, the search results are filtered to Resources whose metadata row with `key = temporal_attr` has a date value in the specified range
- The temporal filter is combined with existing search parameters via AND logic
- When `temporal_attr` is omitted but date parameters are present, the default temporal attribute from configuration is used

**Authorization:**
- Inherits existing search permission filtering
- Does not bypass existing permission checks

**Compatibility:**
- Backward-compatible: existing API consumers without temporal parameters experience no change
- New query parameters are ignored when not provided

## 11. Integration Points

### INT-F022-001 — Timeline to Search Integration

**Systems involved:** `GeoTimeline` (frontend) → `TemporalFilterContext` → Resource Search API

**Contract and ownership:**
- `TemporalFilterContext` holds filter state
- Resource search reads filter state from context and constructs API query parameters
- The search component re-fetches when filter state changes

**Direction and timing:**
- Timeline UI dispatches action → Context updates state → Search component re-renders → API call fires
- Debounce: 300ms after last filter change before search API call

**Consistency expectations:**
- Eventual consistency between timeline selection and search results (debounce delay)
- Strong consistency between context state and URL parameters (synchronous update)

**Timeout, retry, and idempotency:**
- Search API calls use existing retry/timeout configuration
- Temporal filter calls are idempotent (same parameters produce same results)

**Failure isolation:**
- If search API fails, the timeline histogram remains visible with the selected date range highlighted
- User can still browse the timeline even when search results fail to load

### INT-F022-002 — Timeline to Map Preview Integration

**Systems involved:** `TemporalFilterContext` → 2D Map Preview (F-009)

**Contract and ownership:**
- Map Preview component subscribes to `TemporalFilterContext` for temporal filter state
- Map Preview filters its rendered Resource extents/markers client-side or re-fetches with temporal parameters

**Direction and timing:**
- Filter state change → Map Preview receives new props → Re-renders with filtered data
- No additional debounce for map; map updates immediately on filter change

**Consistency expectations:**
- Strong: map must always reflect the current temporal filter state
- If map data is still loading from a previous filter change, the new filter supersedes it (abort previous request)

**Failure isolation:**
- If map preview fails to load filtered data, show empty map with loading error
- Timeline and search remain functional independently

## 12. Storage Strategy

**Storage class and ownership:**
- Temporal attribute configuration data: PostgreSQL, owned by `timelines` module via `TemporalAttributeConfig` model
- Temporal metadata values: PostgreSQL, owned by `metadata` module via existing `Metadata` model
- Aggregation cache: Redis, managed by `timelines` module

**Expected data lifecycle:**
- Configuration data: Rarely changed (administrator action), retained indefinitely
- Metadata values: Created/updated with Resource metadata lifecycle (F-004)
- Cache: Ephemeral, TTL 5 minutes, invalidated on Resource metadata changes

**Capacity implications:**
- Aggregation cache size: Negligible (bounded by number of distinct attribute × interval × permission profile combinations)
- TemporalAttributeConfig: Very small (typically <20 records)

**Access patterns:**
- Timeline histogram: Read-heavy, periodic writes (cache refresh)
- TemporalAttributeConfig: Read on every page load (cached)

## 13. Runtime and Data Flows

### Flow 1: Page Load — Timeline Render

```
Browser loads search page with temporal URL params (or defaults)
    → TemporalFilterContext initializes from URL params (or defaults)
    → GeoTimeline component mounts
        → Calls GET /api/timeline/aggregate/?temporal_attr=X&interval=month
            → Server checks Redis cache
                → Cache HIT: return cached aggregation
                → Cache MISS:
                    → Query TemporalAttributeConfig for active attributes
                    → Query Metadata table for Resource count per interval
                        → Filter by user permissions (visible Resource IDs)
                    → Aggregate results into interval buckets
                    → Store in Redis with 5-min TTL
                    → Return response
        → Renders histogram bars (populated green, empty light gray)
        → Applies selection highlight from URL params if present
    → Map Preview reads filter from context
        → Calls GET /api/resources/?temporal_attr=X&date_from=Y&date_to=Z
        → Renders filtered Resource extents
    → Search results read filter from context
        → Calls GET /api/resources/?temporal_attr=X&date_from=Y&date_to=Z&search=keyword
        → Shows filtered resource list
```

### Flow 2: User Drags Timeline Selection

```
User drags across timeline intervals
    → GeoTimeline computes selected start/end dates
    → Dispatches SET_DATE_RANGE to TemporalFilterContext
    → Context updates:
        → URL parameters updated via useSearchParams
        → Map Preview re-fetches with new date range
        → Search results re-fetch with new date range (300ms debounce)
    → (Optional) Timeline histogram updates if zoom level changes
```

### Flow 3: Animation Playback

```
User selects date range → clicks Play
    → Animation controller computes step intervals
    → Begins requestAnimationFrame loop
    → At each step:
        → Dispatch SET_CURRENT_STEP to TemporalFilterContext
        → Map Preview updates to show one interval
        → Search results update (debounced, optional during animation)
    → User clicks Pause → animation timer pauses
    → User clicks Stop → animation resets to beginning of range
    → Animation reaches end → auto-stop
```

## 14. Performance Strategy

**Critical paths:**
1. Timeline aggregation query: `SELECT date_trunc('month', m.value::date), COUNT(DISTINCT m.resource_id) FROM metadata m WHERE m.key = 'temporal:acquisition_date' AND m.resource_id IN (visible_ids) GROUP BY 1 ORDER BY 1`
2. Temporal-filtered search: Existing search query with additional metadata join/filter

**Expected data volumes:**
- Initial catalog: <10,000 Resources (foundation phase)
- Target: Up to 100,000 Resources with temporal metadata within 3-second response
- Future: Up to 1M Resources (horizontal scaling or materialized view)

**Latency or throughput constraints:**
- Timeline aggregation: <1s target, <3s maximum (product constraint)
- Temporal-filtered search: Existing search performance targets apply

**Query and transfer bounds:**
- Aggregation endpoint returns a maximum of ~3,650 intervals (10 years of daily data). Typical response size: <50KB.
- The aggregation query uses `date_trunc` for efficient grouping

**Memory, CPU, and I/O pressure:**
- Aggregation query is I/O-bound on metadata index scan. Proper indexing on (key, value) keeps this efficient.
- Redis cache absorbs repeated requests during browsing sessions.
- Animation is client-side: no server impact.

**Caching or precomputation:**
- Redis cache with key: `timeline:agg:{attr}:{interval}:{perm_hash}`
- Cache TTL: 5 minutes
- Invalidation triggers: Resource metadata create/update/delete (via Django signal)
- TemporalAttributeConfig cache: loaded on app startup and cached indefinitely with manual refresh

**Protection against unbounded work:**
- Maximum date range for aggregation: 100 years (configurable)
- Maximum interval count per request: 100,000 (safety limit)
- Query timeout: 10 seconds for aggregation (configured at database level)

## 15. Scalability Strategy

**Users:**
- The aggregation cache is shared across users with identical permission profiles. For anonymous users (public), a single cache entry serves all.
- In high-concurrency scenarios, Redis cache absorbs most requests; the database aggregation query runs only on cache misses.

**Requests:**
- Timeline aggregation is read-heavy. The endpoint is stateless beyond caching.
- Rate limiting: Apply standard API rate limiting to prevent abuse of the aggregation endpoint.

**Datasets:**
- For catalogs exceeding 100,000 Resources, the aggregation query can be optimized:
  - Database materialized view with periodic refresh
  - Pre-computed aggregate table updated via Celery task on metadata changes
  - Partitioning Metadata table by resource creation date

**Geospatial size:**
- The timeline aggregation does not query spatial data. No spatial index impact.

**Background workload:**
- Cache warming: optional Celery task that pre-computes common aggregation profiles after large metadata imports
- Cache invalidation: Django signal handlers fire synchronously but are lightweight (delete Redis key)

**Practical scaling boundaries:**
- Without caching: ~100K Resources × daily interval ~ 10M metadata rows queried each request — slow
- With Redis caching: scales to millions of Resources as long as the cache hit ratio remains high (>90%)
- Beyond that: materialized aggregate view recommended

## 16. Security and Privacy

**Authentication:**
- Timeline aggregation endpoint requires authentication for private catalogs
- Anonymous access permitted for public Resources per existing platform policy
- Authentication mechanism: DRF TokenAuth (per ADR-003)

**Authorization:**
- Timeline counts reflect only Resources the user is authorized to VIEW
- Permission filtering uses the existing `permissions` module: a subquery of visible Resource IDs is computed before aggregation
- The permission fingerprint in the cache key ensures users with different permissions see different counts

**Object-level and tenant-level isolation:**
- TemporalAttributeConfig is global (not per-resource)
- Aggregation respects object-level ResourcePermission

**Input validation:**
- All query parameters validated (date format, temporal attribute existence, interval enum)
- SQL injection prevented by Django ORM parameterization
- Date boundaries clamped to reasonable range (100 years max)

**Data exposure:**
- Aggregation endpoint returns counts, not individual Resource data
- The date range endpoints (min/max) expose temporal data distribution at aggregate level only
- Individual resource dates are not exposed through the timeline endpoint

**Secrets and credentials:**
- No new secrets introduced

**Auditability:**
- Temporal filter actions are part of search usage, logged through existing audit mechanism
- TemporalAttributeConfig changes are logged via Django admin logging

**Abuse controls:**
- Rate limiting on `/api/timeline/aggregate/`
- Maximum date range enforced (100 years)
- Maximum interval granularity (day; not hour/minute)

## 17. Failure, Degradation, and Recovery

**Expected failure modes:**
1. Aggregation database query timeout
2. Redis cache unavailable
3. Metadata index missing or corrupted
4. Temporal attribute key not found in config
5. Invalid date parameters from URL (bookmarked URL with expired data)
6. Concurrent cache invalidation race conditions

**Containment boundaries:**
- Timeline failures are isolated to the timeline component
- Map preview and search remain functional without temporal filtering
- No cascading failures across modules

**Timeout and retry policy:**
- Aggregation API: 10s query timeout → return 503
- Frontend: 10s timeout on timeline fetch → show error state with retry button
- Retry: exponential backoff, max 3 retries

**Idempotency:**
- All GET endpoints are idempotent
- Cache writes are idempotent (same aggregation data overwrites)
- No non-idempotent operations in this feature

**Partial failure behavior:**
- If Redis cache is unavailable: aggregation falls through to database query on every request (slower but functional)
- If one temporal attribute fails to load: timeline shows error for that attribute, user can select another

**Safe degradation:**
- Timeline aggregation >3s: show loading indicator, then fall back to year-level aggregation if month-level times out
- Animation with slow map updates: animation waits for map to confirm update before proceeding to next step
- No temporal filter: timeline shows full distribution; map and search show all Resources

**Restart and recovery:**
- Redis restart: cache entries rebuilt on next request
- Application restart: TemporalAttributeConfig cache reloaded from database
- No persistent state in the timelines module (beyond configuration)

**Rollback considerations:**
- New migrations (TemporalAttributeConfig table) must have a reverse migration
- Feature flag (`timelines.enabled`) controls visibility of the timeline UI and API endpoints
- Feature flag off: timeline component not rendered; temporal URL parameters ignored

**Data reconciliation:**
- No mutable data reconciliation needed (aggregation is read-only from existing metadata)

## 18. Observability

**Structured logs:**
- Timeline aggregation cache hit/miss with key, duration, interval count
- Temporal attribute config cache reload
- Aggregation query duration (warning threshold: >2s)
- Invalidation events (metadata change triggering cache clear)

**Metrics:**
- `timeline.aggregation.duration_ms` — histogram of aggregation query duration
- `timeline.aggregation.cache.hit_count` — counter
- `timeline.aggregation.cache.miss_count` — counter
- `timeline.aggregation.intervals_returned` — histogram of interval count per response
- `timeline.api.requests_total` — counter by endpoint and status code

**Traces:**
- Trace aggregation request through cache check → DB query → response serialization
- Trace temporal-filtered search to attribute temporal filter duration separately

**Audit events:**
- TemporalAttributeConfig create/update/delete (via Django admin logging)

**Health or readiness signals:**
- `GET /api/timeline/health/` returns 200 when TemporalAttributeConfig can be read and Redis is reachable (or gracefully degraded)

**Alert conditions:**
- Aggregation duration p99 > 5s over 5-minute window
- Cache miss ratio > 50% over 5-minute window (indicating cache inefficiency)
- TemporalAttributeConfig query failure (configuration data unavailable)

**Correlation identifiers:**
- Request-ID header propagated to all logs and traces for a given API call
- Cache entries tagged with the temporal attribute and interval for invalidation tracking

## 19. Migration and Backward Compatibility

**Schema and data migration:**
- Forward migration: Create `temporal_attribute_config` table with seed data for common temporal fields
- Reverse migration: Drop `temporal_attribute_config` table (if no data loss concern)
- No migration of existing metadata required

**Backfill:**
- Existing Metadata rows with temporal values remain unchanged
- TemporalAttributeConfig seed data provides the mapping layer
- No automated backfill of metadata to canonical key names

**Deployment compatibility:**
- New Django app (`timelines`) introduced — requires `INSTALLED_APPS` update in settings
- New URL patterns added — no impact on existing routes
- Existing search endpoint gains optional query parameters — backward-compatible (ignored when absent)

**API or event compatibility:**
- New API endpoint (`/api/timeline/aggregate/`) — no backward compatibility concern
- Search API extension — backward-compatible (new optional parameters)

**Mixed-version operation:**
- Feature flag `timelines.enabled = False`: timeline API returns 404; UI does not render timeline; search ignores temporal parameters
- Feature flag allows safe rollout: backend deploy first (flag off), frontend deploy (flag off), enable feature

**Rollback safety:**
- Disable feature flag → frontend stops rendering timeline, API returns 404
- Roll back migration → reverse migration drops TemporalAttributeConfig
- Search API reverts to ignoring temporal parameters (not present in old request)

**Historical data:**
- Historical temporal metadata is immediately available for timeline aggregation (no migration needed)
- The timeline automatically shows data for all Resources with matching temporal metadata keys

## 20. Engineering Scenarios

### ES-F022-001 — Normal temporal browsing

**Scenario class:** Normal

**Trigger and scale:** User with 5,000 visible Resources opens the search page. Temporal metadata populated for ~60% of Resources.

**Approved behavior preserved:** FR-F022-001, AC-F022-001

**Architectural concern:** Timeline histogram loads correctly with populated/empty intervals.

**Design response:** Aggregation query executes, cache stores result. Histogram renders with green bars for populated intervals, light gray for empty.

**Failure behavior:** N/A — normal operation expected.

**Recovery:** N/A

**Observability:** Aggregation duration logged; interval count recorded.

**Later validation concern:** Verify histogram bar colors distinguish populated vs. empty intervals.

### ES-F022-002 — Drag-select date range on timeline

**Scenario class:** Normal

**Trigger and scale:** User drags across 6 months on the timeline.

**Approved behavior preserved:** FR-F022-002, AC-F022-002

**Architectural concern:** Selection highlight renders smoothly across intervals.

**Design response:** GeoTimeline computes start/end from drag coordinates, dispatches SET_DATE_RANGE.

**Failure behavior:** N/A

**Recovery:** N/A

**Observability:** Filter state change logged.

**Later validation concern:** Verify drag selection highlights exactly the interval range and displays start/end dates.

### ES-F022-003 — Large catalog aggregation performance

**Scenario class:** Scale

**Trigger and scale:** Catalog with 100,000 Resources, all with temporal metadata. Daily interval over 5 years (~1,825 intervals).

**Approved behavior preserved:** FR-F022-001 (3-second response target per EAF-F022-001)

**Architectural concern:** The `date_trunc` + GROUP BY query must complete within the 3-second product constraint.

**Design response:**
- Query: `SELECT date_trunc('day', m.value::date), COUNT(DISTINCT m.resource_id) FROM metadata m WHERE m.key = $key AND m.resource_id IN (visible_ids) GROUP BY 1 ORDER BY 1`
- Composite index on `metadata(key, value)` enables index-only scan
- Redis cache absorbs repeated queries
- If query exceeds 3s, fall back to month-level aggregation, then year-level

**Failure behavior:** Month-level fallback response returned within 3s. User sees coarser histogram.

**Recovery:** Cache warms on first request; subsequent requests served from cache.

**Observability:** Aggregation duration metric; fallback event logged.

**Later validation concern:** Verify response time under 3s for 100K Resources with daily intervals.

### ES-F022-004 — Concurrent cache invalidation race

**Scenario class:** Concurrency

**Trigger and scale:** Administrator updates metadata on 500 Resources while 20 users are browsing the timeline.

**Approved behavior preserved:** Users see stale data for at most 5 minutes (cache TTL). No error state.

**Architectural concern:** Django signals for metadata changes fire synchronously. On each signal, the cache invalidation deletes the relevant Redis key. Rapid metadata updates could cause thundering herd (many cache misses simultaneously).

**Design response:**
- Cache invalidation is a key deletion, not a recompute (lightweight)
- Thundering herd: If `N` requests arrive simultaneously after cache deletion, the first acquires a distributed lock (Redis `SET NX`), computes the aggregation, and stores it. Subsequent requests wait briefly and read the cached result.
- Lock timeout: 5 seconds. If lock holder fails, lock expires and next request computes.

**Failure behavior:** Lock failure results in multiple concurrent DB queries — acceptable for low probability.

**Recovery:** Cache is repopulated on first request after invalidation.

**Observability:** Cache miss ratio spike logged.

**Later validation concern:** Verify that rapid metadata updates do not cause DB overload. Simulate 500 metadata changes with 20 concurrent timeline requests.

### ES-F022-005 — Permissions filtering correctness

**Scenario class:** Permission

**Trigger and scale:** Two users: User A can VIEW 1,000 Resources, User B can VIEW 500 overlapping Resources. Same temporal attribute.

**Approved behavior preserved:** FR-F022-010, AC-F022-008

**Architectural concern:** Each user must see different aggregation counts reflecting their permitted Resources. Cache key includes a permission fingerprint.

**Design response:**
- Permission fingerprint: SHA256 hash of concatenated visible Resource UUIDs (or a cache-invalidation-friendly proxy: last-permission-change timestamp of the user).
- Cache key: `timeline:agg:{attr}:{interval}:{perm_fingerprint}`
- Perm fingerprint changes when the user's effective permissions change.

**Failure behavior:** If perm fingerprint is incorrect, user may see stale counts from another permission context. Cache TTL limits exposure to 5 minutes.

**Recovery:** Perm fingerprint regeneration on user role/permission change.

**Observability:** Cache entries per permission context tracked.

**Later validation concern:** Verify that User A and User B see different timeline counts, each reflecting their authorized Resources.

### ES-F022-006 — Animation playback with slow map updates

**Scenario class:** Network

**Trigger and scale:** User clicks Play on a 12-month range (monthly steps). Map preview API takes 2 seconds per fetch.

**Approved behavior preserved:** FR-F022-005, AC-F022-005

**Architectural concern:** Animation steps must not overlap; each step waits for the map to confirm update before proceeding.

**Design response:**
- Animation controller uses `async/await`: each step awaits a Promise that resolves when the map preview signals completion.
- Minimum step duration: 500ms (configurable). If map update takes longer, animation waits.
- Speed setting controls the minimum step duration (lower = faster, but bounded by map update latency).

**Failure behavior:** If a map update fails, the animation pauses and shows an error. User can resume or step manually.

**Recovery:** User can skip to next step manually using step-forward button.

**Observability:** Animation step duration metric; failures logged.

**Later validation concern:** Verify animation does not skip steps when map updates are slow. Verify it pauses on error and allows manual recovery.

### ES-F022-007 — Bookmarked URL with invalid dates

**Scenario class:** Abuse/Misuse

**Trigger and scale:** User bookmarks a URL with `?temporal_from=invalid&temporal_to=2099-13-01`.

**Approved behavior preserved:** FR-F022-009 — URL parameters must be validated.

**Architectural concern:** Invalid or out-of-range dates must not cause errors.

**Design response:**
- `TemporalFilterContext` on mount validates date parameters:
  - Invalid format → ignore parameter, use unfiltered state
  - Date out of reasonable range (< 1900 or > 2100) → clamp to valid range
  - `date_from > date_to` → swap or ignore
- Server-side validation returns 400 with clear error message
- URL parameters that fail validation are cleared from the URL

**Failure behavior:** User sees unfiltered timeline with a toast notification: "Invalid date range in URL. Showing all Resources."

**Recovery:** User reselects a valid date range.

**Observability:** Invalid URL parameter events logged (warning level).

**Later validation concern:** Verify various malformed date formats in URL are handled gracefully.

### ES-F022-008 — Redis cache outage

**Scenario class:** Dependency failure

**Trigger and scale:** Redis is unavailable (network partition, restart, resource exhaustion).

**Approved behavior preserved:** Timeline must remain functional (degraded).

**Architectural concern:** Cache miss handler connects to Redis and may hang.

**Design response:**
- Redis client configured with short connection timeout (2s) and retry: 1 attempt.
- On connection failure: catch exception, log warning, proceed with database query.
- Circuit breaker: after 3 consecutive Redis failures within 60s, skip cache for 5 minutes.

**Failure behavior:** Timeline aggregation runs database query on every request. Slower but functional.

**Recovery:** Circuit breaker resets after 5 minutes. When Redis recovers, cache hits resume.

**Observability:** Redis connectivity errors logged. Circuit breaker state exposed via health endpoint.

**Later validation concern:** Verify timeline remains functional during Redis outage with acceptable performance impact.

### ES-F022-009 — Authentication/permission boundary

**Scenario class:** Permission

**Trigger and scale:** Anonymous user, authenticated user with no Resource permissions, authenticated user with VIEW permission.

**Approved behavior preserved:** FR-F022-010, AC-F022-008

**Architectural concern:** Different users must see different aggregation data consistent with their authorization level.

**Design response:**
- Anonymous users: aggregation visible_ids = all public Resources with VIEW permission for Anonymous role
- Authenticated user with no permissions: aggregation empty (0 visible Resources)
- Authenticated user with VIEW: aggregation shows permitted Resources only

**Failure behavior:** Empty timeline for users without permissions (correct per business rules).

**Recovery:** N/A — correct behavior.

**Observability:** Permission context size and aggregation empty state logged.

**Later validation concern:** Verify anonymous user sees public Resources only; unprivileged authenticated user sees empty timeline.

## 21. Technical Risks

### TR-F022-001 — Temporal aggregation query performance

**Risk condition:** The `date_trunc` + GROUP BY query on large Metadata tables may be slow without proper indexing, especially for daily intervals over long date ranges.

**Architectural impact:** Timeline responsiveness degrades below the 3-second product constraint.

**Trigger or early warning:** Aggregation duration metric exceeds 2s p95. Cache miss ratio remains high.

**Prevention or mitigation:** Composite index on `metadata(key, value)` before deployment. Query analysis to verify index usage (`EXPLAIN ANALYZE`). Redis caching with distributed lock to prevent thundering herd.

**Fallback or recovery:** Automatic fallback to month-level then year-level aggregation. Materialized view as future optimization.

**Residual concern:** Extremely large catalogs (1M+) may still exceed targets with fallback. Materialized aggregate table may be required.

**Review discipline:** Senior Developer + Database Specialist (index tuning).

### TR-F022-002 — Temporal metadata key inconsistency

**Risk condition:** Resources may have temporal metadata stored under non-standard keys, or different Resources may use different keys for the same concept (e.g., "capture_date" vs "acquisition_date").

**Architectural impact:** The timeline may show incomplete data if keys are not recognized by TemporalAttributeConfig.

**Trigger or early warning:** Audit of existing Metadata rows reveals multiple keys for the same temporal concept.

**Prevention or mitigation:** TemporalAttributeConfig provides the canonical key list. Documentation guides Data Managers on correct key usage. Consider a metadata migration utility to map legacy keys to canonical keys.

**Fallback or recovery:** Administrators can add additional TemporalAttributeConfig entries for discovered keys. Timeline retroactively shows data for newly configured keys.

**Residual concern:** Data quality depends on metadata entry discipline. The timeline is only as good as the metadata.

**Review discipline:** Data Manager + Requirements Analyst.

### TR-F022-003 — Cross-browser animation performance

**Risk condition:** `requestAnimationFrame`-based animation may perform differently across browsers, especially on lower-end devices or with large map data per step.

**Architectural impact:** Animation playback may be janky or unresponsive on some devices, violating product constraint (EAF-F022-002).

**Trigger or early warning:** User reports of choppy animation. FPS monitoring in production.

**Prevention or mitigation:** Step-forward/step-backward manual mode always available as alternative. Animation speed control allows user to slow down. Map data debouncing prevents overwhelming the browser.

**Fallback or recovery:** Graceful degradation to manual stepping if continuous animation detects sustained low FPS.

**Residual concern:** Device-specific issues cannot be fully tested in development.

**Review discipline:** Frontend Engineer (performance testing on target devices).

### TR-F022-004 — Permission cache isolation violation

**Risk condition:** The permission fingerprint in the cache key may not accurately reflect changes to a user's permissions (role change, group membership change, ResourcePermission change).

**Architectural impact:** A user may see stale aggregation counts that include Resources they no longer have access to, or exclude Resources they just gained access to.

**Trigger or early warning:** User reports count discrepancy. Permission-change events not triggering cache invalidation.

**Prevention or mitigation:** Cache TTL of 5 minutes limits exposure. Permission changes invalidate the user's cache entries (event listener on ResourcePermission model).

**Fallback or recovery:** User clears cache or waits for TTL expiry.

**Residual concern:** Race condition: user's permissions change between cache invalidation and next request.

**Review discipline:** Security Reviewer.

## 22. Required ADRs

### ADR-REQ-F022-001 — Canonical temporal metadata key convention

**Underlying decision owner:** AGENT-103 — Technical Planner (recommendation); Human Technical Owner (approval if cross-feature impact)

**Decision question:** Should the project adopt a standardized naming convention for temporal metadata keys (e.g., `temporal:acquisition_date`, `temporal:creation_date`, `temporal:publication_date`) used across F-004 (Metadata Management), F-022 (Geocalendar Timelines), and future temporal features?

**Why an ADR is required:** Establishes a platform-wide metadata key convention that affects multiple features (F-004, F-022, F-009, and future temporal features). Inconsistent naming would cause interoperability issues across the platform.

**Platform-wide or cross-feature consequence:** F-004 metadata management UI would use these keys for temporal fields. F-005 search would filter by them. F-009 map preview would display temporal markers by these keys. Future features (F-014 3D temporal, temporal export) would depend on consistent key naming.

**Affected boundaries:** `metadata` module (key storage convention), `timelines` module (key reference), `search` module (temporal filter by key), `visualization` module (temporal display on map).

**Alternatives:**
- Canonical `temporal:*` prefix convention (recommended): Simple, extensible, self-documenting
- Free-form keys without convention: Maximum flexibility but causes integration issues
- Enum-based field on Resource model: Schema rigidity; requires migration for new fields

**Recommendation:** Adopt canonical `temporal:*` prefixed key naming convention for all temporal metadata. Document the convention in the project glossary and metadata management documentation.

**Approval status:** Not requested

**Blocking:** Yes — the naming convention affects how F-004 and F-022 integrate. Without an approved convention, the design relies on an engineering assumption.

## 23. Engineering Assumptions

### EA-F022-001 — Resource temporal metadata is stored as date-typed Metadata values

**Assumption:** Temporal metadata values in the Metadata model are stored as ISO 8601 date strings (e.g., "2026-01-15") that PostgreSQL can cast to `date` or `timestamp` types.

**Evidence:** ADR-006 defines the Metadata model with `data_type` field. The feature specification (FR-F022-001) assumes temporal attribute values are date-comparable. The project domain model shows Metadata as key-value with data_type.

**Validation:** Verify existing Metadata rows with temporal keys have `data_type = "date"` or `data_type = "datetime"`. If values are stored as arbitrary strings, the aggregation query may fail on type cast.

**Design affected if false:** The `date_trunc` PostgreSQL function requires date-typed input. If metadata values are not consistently date-formatted, the aggregation query would need application-level date parsing, significantly reducing performance.

### EA-F022-002 — 2D Map Preview can accept temporal filter parameters

**Assumption:** The F-009 2D Map Preview component is designed to accept spatial extent filter parameters and can be extended to accept temporal filter parameters without significant architectural change.

**Evidence:** The feature catalog lists F-009 as a dependency of F-022. The component design shows a generic Map Preview component. The requirement for temporal-map synchronization (FR-F022-003) depends on this integration.

**Validation:** Review F-009 technical design (when available) to confirm it supports an extensible filter parameter interface. If F-009 uses a fixed query pattern, the temporal integration may require F-009 modifications.

**Design affected if false:** The timeline-map synchronization (INT-F022-002) would require F-009 to be extended first, potentially blocking F-022 delivery or requiring a separate map data-fetching path.

### EA-F022-003 — Animation playback operates entirely client-side

**Assumption:** No server-side animation state or pre-computed animation frames are required. The animation is implemented as sequential filter updates on the client.

**Evidence:** FR-F022-005 describes animation as stepping through time intervals. No server-side animation requirements are present in the specification.

**Validation:** Verified against the Feature Specification — no server-side animation processing is described or implied.

**Design affected if false:** If requirements for server-side animation (e.g., recording animation sessions, sharing animation URLs) emerge, the animation design would need server-side state and potentially Celery-based frame generation.

### EA-F022-004 — TemporalAttributeConfig is seeded with common temporal keys

**Assumption:** The initial data migration for TemporalAttributeConfig seeds well-known temporal metadata keys (acquisition_date, creation_date, publication_date) that match existing or planned metadata entry patterns.

**Evidence:** The project glossary and domain model mention temporal attributes. F-004 (Metadata Management) defines metadata fields that include temporal values.

**Validation:** Coordinate with F-004 and data stewardship to confirm the seed key list matches the metadata entry workflow.

**Design affected if false:** If seed keys do not match actual metadata keys used during resource upload, the timeline will initially show no data. Administrators can add matching keys through the admin interface without code changes.

## 24. Human Technical Decisions

### HTD-F022-001 — Canonical temporal metadata key naming convention

**Status:** Pending

**Decision owner:** Human Technical Owner

**Approval-policy trigger:** Level 5 — Human Approval (establishes a cross-feature platform convention that constrains future designs beyond the current feature; affects metadata management, search, and visualization boundaries)

**Concrete trigger consequence:** The choice of metadata key naming convention creates a platform-wide standard that cannot be trivially changed once adopted. Inconsistent naming would cause data fragmentation across features F-004, F-005, F-009, and F-022.

**Decision question:** Should the platform adopt the `temporal:*` prefixed naming convention for temporal metadata keys (e.g., `temporal:acquisition_date`, `temporal:creation_date`, `temporal:publication_date`)?

**Options:**
1. **Adopt `temporal:*` prefix convention (recommended):** All temporal metadata keys use the `temporal:` namespace prefix. Backward-compatible; existing keys can be mapped through TemporalAttributeConfig.
2. **Adopt ISO 19115-inspired convention:** Use standard geospatial metadata paths (e.g., `citation:date`, `contentInfo:dimension:timeExtent`). More compatible with international standards but more verbose.
3. **Free-form keys without convention:** No naming constraint; each application module defines its own keys. Maximum flexibility but high risk of key fragmentation.

**Recommendation:** Option 1 — `temporal:*` prefix convention. Simple, self-documenting, extensible, and easy to validate. Allows TemporalAttributeConfig to map to any convention if standards compliance is needed later.

**Technical rationale:** The `temporal:` namespace is concise, immediately recognizable, and unlikely to conflict with non-temporal metadata keys. It supports future temporal fields (e.g., `temporal:capture_start`, `temporal:capture_end`, `temporal:validity_period`) without schema changes.

**Trade-offs:**
- Option 1: Simple but non-standard. Lacks formal geospatial metadata standard alignment.
- Option 2: Standards-compliant but verbose. May complicate metadata entry UI and query construction.
- Option 3: Flexible but risky. Fragmentation is likely without governance.

**Consequences:** Adopting this convention creates a de facto standard. All future features that read temporal metadata must use the same keys. A migration from existing non-standard keys would require a metadata stewardship effort.

**Decision:** Pending

**Decision date:** Pending

### HTD-F022-002 — Timeline aggregation cache TTL and invalidation strategy

**Status:** Resolved

**Decision owner:** AGENT-103 — Technical Planner

**Approval-policy trigger:** Not applicable — this is an ordinary Technical Decision resolved autonomously.

**Decision:** Cache TTL of 5 minutes with Django signal-based invalidation on Resource metadata create/update/delete. Redis distributed lock for cache recomputation.

## 25. Open Technical Questions

None. All technical questions are resolved within this design. Blocking decisions are captured as HTDs and ADR requirements above.

## 26. Ready for Task Planning

- [x] Source Feature Specification passed the Feature Readiness Gate
- [x] Architecture alignment is validated
- [x] Every requirement and acceptance criterion is traced to the design
- [x] Reuse and affected components are identified
- [x] Component boundaries and responsibilities are defined
- [x] Data model, API, integration, and storage impacts are defined or explicitly not applicable
- [x] Runtime and data flows are defined
- [x] Engineering Scenarios cover normal, boundary, scale, failure, misuse, and recovery
- [x] Performance and scalability are addressed
- [x] Security and privacy are addressed
- [x] Failure, degradation, and recovery are addressed
- [x] Observability is addressed
- [x] Migration and backward compatibility are addressed
- [x] All ordinary Technical Decisions are resolved autonomously
- [x] Every Human Technical Decision cites an explicit approval trigger and concrete consequence
- [ ] All Human Technical Decisions are resolved
- [x] Every required ADR has a platform-wide or cross-feature governance reason
- [ ] All blocking ADR decisions are approved
- [x] No blocking Open Technical Question remains
- [x] No product question is being treated as an engineering assumption
- [x] No feature scope, requirement, user story, or acceptance criterion was changed
- [x] No implementation tasks, phases, estimates, code, or test plan appear

**Ready for Task Planning:** NO

**Readiness reason:** One Human Technical Decision (HTD-F022-001 — canonical temporal metadata key naming convention) and one ADR (ADR-REQ-F022-001 — same decision) are pending approval. These must be resolved before Task Planning can proceed, as the naming convention affects the data model, API contracts, and integration with F-004 and F-005.
