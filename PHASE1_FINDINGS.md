# Phase 1 — Production Readiness Findings Report

**Date:** 2026-07-19 (re-verified)  
**Scope:** Inventory only — this phase documents what exists and what breaks. No new product fixes in this pass.  
**Verified by:** `npm run lint`, `npm run build`, Vite preview at `http://127.0.0.1:4173`, Playwright headless click-through, live anon-key probes via `node client/scripts/verify-security.mjs`.

---

## Corrected product description

**Replace the inferred one-liner with:**

> OmniGrowth is a **B2B agricultural intelligence and connectivity platform for India**. The Vite + React + TypeScript SaaS client (`/client`, served under `/app`) centers on an interactive India map (states → districts) with crop/soil/MSP intelligence, APMC-oriented price views, and dealer discovery. Backend is **Supabase** (Auth + Postgres). A separate static landing prototype lives at `/3pm_krishna/index.html` and must not be modified unless asked.

It is **not** only a “price and dealer tracker,” though those are core surfaces. Core value (from `AGENTS.md`): *Right produce → Right market → Right time.*

---

## Step zero (completed this session)

| Item | Status |
|------|--------|
| `CLAUDE.md` → `@AGENTS.md` (+ graphify section) | Already present; confirmed |
| `graphify update .` | Done — **261 nodes / 263 edges / 29 communities** |
| Post-commit / post-checkout hooks | Already installed; reconfirmed (`graphify hook status`) |
| `graphify watch .` | Running in background (`python -m graphify.watch . --debounce 3`) |

---

## 1. Feature inventory (run, don’t guess)

Routes from `client/src/main.tsx`. Exercised against production build preview + live Supabase.

| Route | Intended job | End-to-end result |
|-------|----------------|-------------------|
| `/` (`App.tsx`) | In-app marketing landing → CTAs into `/app` | **Works.** Hero + nav (“MSP Prices”, “Find Dealers”, “Sign In”, “Get Started”) render. Separate public prototype also at `/3pm_krishna/index.html`. |
| `/app` (`Dashboard` + `DashboardUI` + `useMapLogic`) | Interactive India map → state → district panels, search, MSP/APMC cards, partner modals | **Works.** Map panels overlay **live Agmarknet** via fuzzy crop match + district/state queries; **MSP DB** fills Govt MSP when no mandi (see `DATA_SYNC.md` + `priceResolve.ts`). 37 Leaflet state shapes; districts on demand. |
| `/app/prices` | List mandi + MSP rows from Supabase `msp_prices` | **Works.** ~3.3k rows (mandi + 19 MSP baseline). Mandi preferred; MSP filter for non-realtime. |
| `/app/dealers` | List active dealers from Supabase `dealers` with crop/state filters | **UI works; data empty.** Copy: “No dealers found yet…” (`dealers` SELECT allowed for active rows; table has none). |
| `/app/login` | Email/password sign-in via Supabase Auth | **Works as a form.** Bad credentials → `Invalid login credentials`. **No route guard** — app is fully usable without signing in. |
| `/app/register` | Sign-up with name/role metadata | **Form present** (email input rendered). Not re-creating users this pass (prior session already confirmed signup + email-confirm gate). |
| `*` (`NotFound`) | 404 | **Works.** “Page not found / That route doesn't exist.” |

**Auth posture note:** `useAuth` exists and is used by Login/Register only. No `ProtectedRoute`. Map/prices/dealers are public doors by current code.

---

## 2. Duplication / dead code

### `Dashboard.tsx` vs `DashboardUI.tsx`

**Intentional thin container / presentational split** (not accidental duplicates):

- `Dashboard.tsx` — mounts `useMapLogic()` then renders `<DashboardUI />`
- `DashboardUI.tsx` — JSX shell (map chrome, modals, welcome panel)

Worth a later cleanup (Phase 3): the split is shallow; map logic still mutates the DOM via `innerHTML` / `window.*` instead of React state. `useMapLogic.ts` remains `@ts-nocheck`-style / heavy `any` usage.

### Geodata overlap (Gujarat / DNH & DD)

| File | Used by `STATE_FILE` in `useMapLogic.ts`? |
|------|-------------------------------------------|
| `gujarat.geojson` | **Yes** (`"Gujarat":"gujarat"`) |
| `dadra___nagar_haveli___daman___diu.geojson` | **Yes** |
| `gujarat_and_dnh___dd_islands.geojson` | **No — dead; flag for removal** |

Counts: 36 `STATE_FILE` entries, 37 `.geojson` files → exactly one unused file (above). File is still HTTP-served from `public/` (200) but never imported by the map loader.

---

## 3. Security posture (inventory — Phase 2 checklist still applies)

### Live anon-key probes (`verify-security.mjs`) — current project state

| Check | Result |
|-------|--------|
| `msp_prices` SELECT | **Allowed** (public MSP read — intentional if product wants open prices) |
| `msp_prices` INSERT | **Blocked** by RLS |
| `msp_prices` UPDATE | **Blocked** (0 rows) |
| `dealers` INSERT | **Blocked** by RLS |
| `dealers` SELECT (active) | **Allowed** |
| `profiles` SELECT as anon | **0 rows** (not world-readable) |
| `service_role` in `client/dist/` | **Absent** (confirmed post-build) |
| Storage buckets / Edge Functions in repo | **None** to audit |
| `sync-prices.mjs` | Requires **`SUPABASE_SERVICE_ROLE_KEY` in repo-root `.env`** (refuses anon / `VITE_*` service key) |

**Note on prior work:** A Phase 2 migration file and checklist already exist in the working tree (`supabase/migrations/20260719_phase2_security_hardening.sql`, `PHASE2_SECURITY.md`). Live probes above match a hardened project. Phase 2 should still be treated as a **formal checklist pass** (Security Advisor, Auth settings, audit log of every table/policy) rather than “already done / skip.”

### Remaining security / hygiene risks for Phase 2

- Base `CREATE TABLE` schema is still thin in git (mostly ALTERs + hardening migration) — full reproducibility from empty project not proven.
- Dashboard map HTML built with string concatenation + `onclick="..."` (XSS risk if fields ever become user-controlled).
- No MFA / OTP expiry / rate-limit config visible in repo (dashboard-only).
- Auth gating is a **product decision**, not a bug by itself.

---

## 4. Performance

| Metric | Observation |
|--------|-------------|
| Production JS bundle | **549.21 KB** minified / **155.62 KB gzip** — Vite warns >500 KB |
| CSS | **24.14 KB** (~4.99 KB gzip) |
| Biggest likely contributors | Inlined `data.ts` (states/districts/crop prices) + React/Router/Supabase. Leaflet loaded from **CDN** in `index.html` (not in the JS chunk; separate network + CSP risk) |
| GeoJSON strategy | **Good:** India outline from remote source once; districts **on demand** from `/geodata/<state>.geojson` (verified `gujarat.geojson` → 200) |
| Re-renders | Map logic is **imperative Leaflet + DOM**, not React-driven — avoids React re-render thrash, but fights Strict Mode / lifecycle |
| Hardcoded CDN / remote shapefile | Offline / App Store reliability risk |

---

## 5. Test and CI gaps

| Area | Status |
|------|--------|
| Unit / integration / e2e tests in repo | **None** (Playwright used ad-hoc for this audit only) |
| `.github/workflows` (or other CI) | **None** |
| `npm audit` (client) | **0 vulnerabilities** (this run) |
| Lint | `oxlint` — **warnings only** (irregular whitespace in `data.ts`; unused catch params in `useMapLogic.ts`) — exit 0 |
| Typecheck | `tsc -b` passes as part of `npm run build` |
| `strict` in `tsconfig*.json` | **Not enabled** — contradicts `AGENTS.md` “TypeScript strict mode” |
| Capacitor / native shells | **Not present** (Phase 4 not started) |

---

## 6. Env / config sanity

| Check | Result |
|-------|--------|
| Root `.gitignore` includes `.env` | Yes |
| `client/.gitignore` lists `.env` | **Yes** (`git check-ignore` → `client/.gitignore:14:.env`) |
| `.env` tracked? | No |
| Root `.env.example` | Documents `VITE_SUPABASE_*` + commented service-role for sync — **placeholders only, no real secrets** |
| `client/.env.example` | Matching Vite placeholders |
| Client env location | Correct: Vite reads **`client/.env`** (`VITE_*` only) |
| Repo-root `.env` for sync | Expected for `SUPABASE_SERVICE_ROLE_KEY` (gitignored); not required for the browser app |

---

## Cross-cutting risks to carry forward

1. **Dealer directory empty** — product vs seed/sync gap; founders must say which.
2. **No auth gating** — is the map public by design for investors/demo?
3. **Dead GeoJSON** — `gujarat_and_dnh___dd_islands.geojson` flagged for removal.
4. **Bundle size + CDN Leaflet** — App Store / offline reliability for Phase 4.
5. **TypeScript not strict** — AGENTS.md debt.
6. **No CI / no automated tests** — regressions only caught by manual runs.

---

## Addendum — price overlay fix (2026-07-19)

**Problem:** Map used exact `district` + exact `crop` match only; state panels queried `district = stateName` (always empty); MSP never read from Supabase (hardcoded `CROP_PRICES` only).

**Fix:** `client/src/lib/priceResolve.ts` + updated `fetchLivePricesForPanel` in `useMapLogic.ts`.

**Verified against live DB:** Indore — Paddy/Soybean/Arhar fuzzy-match to LIVE; Cotton (no mandi) → MSP DB ₹7,521; Madhya Pradesh state panel aggregates mandi across districts.

---

## What was tested (explicit)

1. `cd client && npm run lint` — pass with warnings  
2. `cd client && npm run build` — pass (`tsc -b` + Vite); bundle sizes as above  
3. `npm run preview -- --host 127.0.0.1 --port 4173` — SPA + local geodata HTTP 200  
4. Playwright chromium against preview: landing, map (37 shapes), state panel (Goa), back, about modal, prices (~114 cards), dealers empty state, login error UI, register form, 404  
5. `node client/scripts/verify-security.mjs` — all PASS (SELECT prices OK; writes blocked; dealers insert blocked)  
6. `npm audit` — 0 vulns  
7. Post-build scan of `dist/` for `service_role` — none  
8. `graphify update .` + watch started  

---

## Stop line

**Phase 1 complete (re-verified).** Stopping here per master prompt — no Phase 3 UI rewrite and no Capacitor work until you review this report.

**Already present from an earlier session (not re-executed as “done” without your sign-off):** Phase 2 SQL migration + `PHASE2_SECURITY.md` + `verify-security.mjs`. Live DB already matches hardened write policies.

**Please review this report.** Suggested next order after your go-ahead:

1. **Phase 2 formal close-out** — run Supabase Security Advisor in the dashboard; confirm Auth email-confirm / OTP ≤1h / MFA / rate limits; ensure migration is applied on every environment; document table inventory in git.  
2. **Small cleanup** — delete unused GeoJSON; enable `strict`; optional CI smoke (build + verify-security).  
3. **Phase 3 UI** — map as centerpiece, design system pass, mobile responsiveness.  
4. **Phase 4** — Capacitor iOS/Android only after 1–3 are clean.

**Founder decisions needed before guessing:**

- Should `/app` (map) stay public without login?  
- Are MSP/APMC rows meant to be world-readable forever?  
- Is dealer directory empty by design (no seed yet) or a sync failure?
