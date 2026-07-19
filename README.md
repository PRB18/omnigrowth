# OmniGrowth

B2B agricultural intelligence & connectivity for India. Vite + React + TypeScript client (`/client`) with Supabase backend. Interactive India map → MSP / APMC context → dealer discovery.

## Deploy on Netlify (share with a friend)

1. Push this repo to GitHub.
2. [Netlify](https://app.netlify.com) → **Add new site** → Import from Git → pick the repo.
3. Netlify should read `netlify.toml` (build from `client/`, publish `dist`).
4. Site settings → **Environment variables** → add:
   - `VITE_SUPABASE_URL` = your Supabase project URL  
   - `VITE_SUPABASE_ANON_KEY` = your Supabase **anon** key  
   (**Never** add the service_role / master key.)
5. Deploy. Share the `*.netlify.app` URL.

After changing env vars, trigger a **Clear cache and deploy** so Vite bakes them into the build.

## Run locally

```bash
cd client
cp .env.example .env   # set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev            # http://localhost:5173
```

Production build check:

```bash
cd client
npm run lint
npm run build
npm run preview
```

Price sync (Agmarknet — see `DATA_SYNC.md`):

```bash
# repo-root .env: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + DATA_GOV_API_KEY
node client/scripts/sync-prices.mjs --dry-run
node client/scripts/sync-prices.mjs
node client/scripts/verify-security.mjs
```

Display rule: map + Prices prefer **synced mandi** rows; when a crop has no live mandi for that region, **Govt MSP** comes from non-realtime baseline rows in `msp_prices` (`priceResolve.ts`). Kharif/Rabi filters on Prices infer season from the crop for mandi rows (sync used to tag all mandi as Kharif).

## Graphify knowledge graph

After code changes, refresh the AST graph (no API cost):

```bash
graphify update .
# optional continuous refresh:
graphify watch . --debounce 3
```

Query before deep source browsing:

```bash
graphify query "How does the map load district geojson?"
graphify path "Dashboard" "supabase"
graphify explain "useMapLogic"
```

Hooks: see `.agents/skills/graphify/references/hooks.md`. Update command details: `references/update.md`.

## Phase docs

| Doc | Contents |
|-----|----------|
| **`MASTER_PLAN.md`** | **Start here** — overall plan, done vs TODO, Phase 2 Supabase checklist |
| `PHASE1_FINDINGS.md` | Feature inventory, dead code, perf, CI gaps |
| `PHASE2_SECURITY.md` | RLS / service_role / auth checklist |
| `PHASE3_UI.md` | Design system + map-centered UI pass |
| `PHASE4_MOBILE.md` | Capacitor iOS/Android packaging |
| `DATA_SYNC.md` | Agmarknet sync + live→MSP fallback |

## Mobile (Capacitor)

```bash
cd client
npm run assets      # regenerate icons/splash from client/assets/
npm run cap:sync    # build web + sync native projects
npm run cap:android # open Android Studio
npm run cap:ios     # open Xcode (macOS only)
```

See `PHASE4_MOBILE.md` for JDK/SDK requirements and simulator verification status.
