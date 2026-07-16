# GeoSpatial Resource Platform — Workflows

Version: 1.0

Status: Draft

Purpose:
Document the key system workflows from actor action through system response.

---

# Workflow 01 — Resource Ingestion

## Overview

A Data Manager uploads a file, the system processes it, and a Resource is created.

## Steps

```mermaid
flowchart LR
    A[Data Manager] -->|Uploads file| B[Upload API]
    B --> C{File valid?}
    C -->|No| D[Return validation error]
    C -->|Yes| E{Size > 100MB?}
    E -->|No| F[Store file]
    E -->|Yes| G[Queue async job]
    G --> H[Notify user]
    G --> I[Async: Store file]
    I --> J[Extract metadata]
    F --> J
    J --> K[Create Resource record]
    K --> L[Generate thumbnail]
    L --> M[Return success + resource link]
```

## Exception Paths

- Invalid format: return error with supported formats list
- Storage failure: return error with retry option
- Metadata extraction partial: proceed with available metadata, flag missing fields

---

# Workflow 02 — Resource Publishing

## Overview

A GIS Professional publishes a resource as an OGC service via GeoServer.

## Steps

```mermaid
flowchart LR
    A[GIS Professional] -->|Selects resource| B[Publishing Panel]
    B -->|Chooses WMS/WFS/WMTS| C{Resource compatible?}
    C -->|No| D[Show compatible options]
    C -->|Yes| E[Configure service params]
    E --> F[Click Publish]
    F --> G[Queue publishing job]
    G --> H{GeoServer available?}
    H -->|No| I[Show connection error]
    H -->|Yes| J[Create store in GeoServer]
    J --> K[Create layer in GeoServer]
    K --> L[Verify published layer]
    L -->|Success| M[Update resource status]
    L -->|Failure| N[Mark failed + show error]
    M --> O[Show WMS/WFS URL]
```

## Exception Paths

- GeoServer unreachable: queue job for retry, show connection status
- Publishing partial: report which services succeeded and failed
- Resource modified during publishing: warn user

---

# Workflow 03 — Resource Search

## Overview

A user searches the catalog using keywords and filters.

## Steps

```mermaid
flowchart LR
    A[User] -->|Enters keyword| B[Search API]
    B --> C{Has spatial filter?}
    C -->|Yes| D[Apply spatial query]
    C -->|No| E[Text search only]
    D --> F{Has type filters?}
    E --> F
    F -->|Yes| G[Apply type/date filters]
    F -->|No| H[Execute search]
    G --> H
    H --> I[Return paginated results]
    I --> J[Display results with previews]
    J --> K{User clicks result?}
    K -->|Yes| L[Open resource detail]
    K -->|No| M[User refines search]
    M --> B
```

## Exception Paths

- Search service unavailable: show cached results or friendly error
- No results: show suggestions and alternative searches
- Query timeout: simplify query, alert user

---

# Workflow 04 — Access Control

## Overview

A Data Manager sets permissions on a resource.

## Steps

```mermaid
flowchart LR
    A[Data Manager] -->|Opens resource| B[Resource page]
    B -->|Selects Permissions tab| C[Permission editor]
    C -->|Adds user/group| D[Select permission level]
    D -->|View/Download/Edit/Manage| E[Save permission]
    E -->|Audit log entry| F[Permission applied]
    C -->|Removes user/group| G[Confirm removal]
    G --> E
    C -->|Toggles public access| H[Confirm public]
    H --> E
```

## Exception Paths

- User does not exist: show error, allow correction
- Cannot remove last manager: warn, require confirmation

---

# Workflow 05 — User Authentication

## Overview

A user logs into the platform.

## Steps

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant API as Auth API
    participant DB as Database

    U->>UI: Enter credentials
    UI->>API: POST /auth/login
    API->>DB: Verify credentials
    DB-->>API: Valid
    API-->>UI: Return token + user info
    UI-->>U: Redirect to dashboard
```

## Exception Paths

- Invalid credentials: return error, allow retry
- Account deactivated: show deactivation message
- Rate limit exceeded: show rate limit warning
