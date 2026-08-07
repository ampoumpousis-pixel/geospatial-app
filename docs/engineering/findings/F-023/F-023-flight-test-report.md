# F-023 Flight Test Report — Existing-Surface Extension (Widget-Only Integration)

## 1. Metadata

| Field | Value |
|---|---|
| Flight Test | F-023 — Recent Activity Panel |
| Date | 2026-08-06 |
| Purpose | Validate the Frontend Integration Planner's "new surface vs. inside existing surface" decision — the exact boundary this planner exists to own |
| Invariants Under Test | FI-I-001 (Reuse Evidence, proposed); no-unnecessary-page rule (permanent regression) |
| Report Status | Final |

## 2. Test Design

- Vehicle: **F-023 — Recent Activity Panel** (extends the existing home page; Test priority; planning-only).
- Operator scope declared in `docs/project/features/F-023/authority-map.md`: the activity capability MUST live inside the existing home page; NO new page/route/module.
- **Core assertion (empty list is the assertion):** the artifact must explicitly show `New Pages: []`, `Modified Pages: HomePage`, `New Components: RecentActivityPanel`.
- **Forbidden outputs:** `RecentActivityPage`, `ActivityRoute`, standalone activity feature module.
- The home page (route `/` in `App.tsx`) is the ONLY genuinely existing surface — the FIP must name it as evidence and not fabricate any other existing surface.

## 3. Pipeline Run

| Stage | Result |
|---|---|
| AGENT-102 | ✅ spec v1.0, surface=Yes, Ready for Technical Planning |
| AGENT-103 | ✅ TD v1.0, 1 API (`GET /api/recent-activity/`, AllowAny), 7 decisions |
| FIP | ✅ v1.0 |
| AGENT-104 | ✅ review v1.0 READY FOR APPROVAL, 0 blocking — widget-only integration confirmed CORRECT (not a finding) |
| Gate | ✅ APPROVED, no scope differences, FIP 1.0 locked |
| AGENT-105 | ✅ 9 tasks; frontend tasks reference "FIP Section 2: Page Inventory (New Pages: [])" and "Section 3: Route Map (no new/modified routes)" |

## 4. Assertion Verdicts

| Assertion | Result |
|---|---|
| `New Pages: []` explicitly asserted | ✅ §2 line 26 |
| `Modified Pages: HomePage` | ✅ P-F023-001 (Existing modified) |
| `New Components: RecentActivityPanel` | ✅ C-F023-001 |
| Route Map — no new routes | ✅ §3 "None" |
| Route Map — no modified routes | ✅ §3 "None" (panel is page-content change, not a route change) |
| Navigation Changes — none | ✅ §4 "None" |
| Forbidden: `RecentActivityPage` / `ActivityRoute` / standalone module | ✅ all absent |
| Reuse evidence cites real candidates | ✅ apiClient + React Query provider reused; SystemInfo/authService/MUI primitives evaluated with reasons |
| No auth gate invented | ✅ panel preserves AllowAny / server-side-visibility contract; FD-F023-004 documents why no gate |

## 5. Design-Decision Evidence (the decision boundary)

FD-F023-001 documents the choice explicitly:

> "A single RecentActivityPanel widget is mounted within the existing home page layout. No new page, no new route, no modified route, and no navigation change. Alternatives considered: (a) a dedicated `/activity` route and page — rejected: explicitly prohibited by BR-F023-001, AC-F023-002; (b) a standalone activity module — rejected: the exact drift RISK-F023-003 warns against."

This is the exact failure mode the test targets (requirement "show recent activity" → LLM creates "Activity Management page"). The planner did NOT take the bait.

## 6. Findings

| ID | Category | Severity | Finding |
|---|---|---|---|
| (none new) | — | — | No new findings attributable to F-023. The surface-decision behaviour is a positive control. F-022 findings (permission gaps, section references) apply pipeline-wide. |

## 7. Conclusion

**PASS.** The FIP correctly decided that Recent Activity belongs inside the existing home page and produced zero new surfaces. This behaviour is promoted to a **permanent regression test** (Test 2 of phase-4-validation.md): any future FIP run that creates a new page/route for a widget-in-existing-page feature must fail this test.

## 8. Next Steps

- None beyond the shared Phase 4 fixes. F-023 artifacts to be cleaned up with the rest of the test vehicles.
