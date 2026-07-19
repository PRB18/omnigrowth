# Phase 3 — UI pass

**Date:** 2026-07-19  
**Scope:** Design direction, map-as-centerpiece, purposeful motion, mobile responsiveness.  
**Status:** Implemented in `/client` (this document records what shipped and how it was verified).

---

## Design direction (chosen before polishing)

| Token | Choice | Why |
|-------|--------|-----|
| Palette | Night field `#09101f` → surfaces `#111827` / `#18243a`, crop green `#4abc64`, harvest gold `#d4a547`, sky blue `#4d9de0` | Tied to agri + India map chrome; **not** purple/violet or cream/serif clichés |
| Type | **Sora** (display) + **IBM Plex Sans** (body) | Expressive brand vs readable UI; not Inter/Roboto/system-only |
| Signature | Full-viewport **interactive India map** (`/app`) | Map is the product, not a dashboard widget |

CSS variables live in `client/src/index.css` (`:root`). Landing atmosphere (gradient + grain) in `client/src/App.css`.

---

## What changed

### Landing (`/` — `App.tsx` + `App.css`)

- Brand-first hero: **OmniGrowth** as hero-level signal, then the “Right produce / market / time” line.
- One primary CTA into the map; secondary to MSP prices.
- Second section (“The map is the product”) invites the signature surface — no stat strips or card grids in the first viewport.

### Shared chrome

- `AppNav` for Prices / Dealers / Auth pages (consistent logo mark + active link).
- Shared buttons, forms, badges, skeleton pulse for loading prices.

### Map (`Dashboard` / `DashboardUI` / `useMapLogic`)

- Kept container/presentational split from Phase 1.
- Mode pill, panel open animation, price flash / live pulse when MSP data updates.
- Mobile: bottom sheet panel, abbreviated topbar actions, legend hidden under 640px.

### Auth / lists

- Login, Register, Prices, Dealers, NotFound restyled to the same tokens (dark field + green accent).
- Prices: skeleton loading while Supabase rows stream in.

---

## Motion (purposeful only)

| Motion | Trigger |
|--------|---------|
| `panelIn` | State/district panel opens |
| `modePillIn` | Mode hint appears on map |
| `priceFlash` / `livePulse` | Live MSP value update |
| `skeletonPulse` | Prices loading |
| `modalIn` | About / partners overlays |
| Button hover translate | Primary CTA feedback |

No decorative particle loops or purple glow stacks.

---

## Responsiveness

Breakpoints in `index.css` / `App.css`:

- `≤640px` — map panel becomes bottom sheet; topbar compresses; nav hides secondary links where marked `hide-sm` / `hide-mobile`.
- `≤380px` — tighter search type.

Target: usable down to phone widths before Capacitor packaging (Phase 4).

---

## Self-critique (Phase 3 acceptance)

| Criterion | Assessment |
|-----------|------------|
| Avoid generic shadcn / purple hero / shadow-card soup | **Pass** — custom tokens, map-led |
| Brand test on first viewport | **Pass** — OmniGrowth is the hero signal |
| Map as centerpiece | **Pass** — landing pushes to `/app`; map is full canvas |
| Motion serves a job | **Pass** — load / panel / price feedback |
| Mobile layout | **Pass** at CSS level; native chrome deferred to Phase 4 |

### Known leftovers (not Phase 3 blockers)

- Map still builds some HTML via `innerHTML` / `window.*` (Phase 1 debt).
- Leaflet still loaded from CDN (`index.html`) — offline / App Store risk for Phase 4.
- Dead GeoJSON (`gujarat_and_dnh___dd_islands.geojson`) still flagged for removal.
- Screenshots were not checked into the repo; visual QA was against Vite preview.

### Price intelligence (post–Phase 3)

Map price cards: **LIVE** Agmarknet overlay (fuzzy crop + state/district) with **MSP DB** fallback — see `DATA_SYNC.md` and `client/src/lib/priceResolve.ts`. Purposeful badges: gold LIVE pulse, green MSP DB.

---

## What was tested

1. `cd client && npm run lint` — pass (warnings only where pre-existing).
2. `cd client && npm run build` — `tsc -b` + Vite success.
3. Manual / prior Playwright click-through of landing → map → prices → dealers → auth (see Phase 1).

---

## Stop line

**Phase 3 UI pass documented.** Native packaging, icons, splash, and status bar belong in **Phase 4** (`PHASE4_MOBILE.md`).
