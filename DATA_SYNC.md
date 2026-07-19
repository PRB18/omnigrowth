# Real mandi price sync (Agmarknet via data.gov.in)

## What you already did
- Got a **data.gov.in API key**
- Found the catalog: *Current daily price of various commodities from various markets (Mandi)*

## What to put in repo-root `.env` (create the file if missing)

```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_from_supabase
DATA_GOV_API_KEY=your_key_from_data_gov_in_my_account
```

Copy `VITE_SUPABASE_URL` from `client/.env` into `SUPABASE_URL` if you want — same project URL.

**Never** put `DATA_GOV_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in `client/.env` or Netlify `VITE_*` vars.

## Run it

```bash
# 1) Prove the key + API work (no database write)
node client/scripts/sync-prices.mjs --dry-run

# 2) Write real mandi rows into Supabase
node client/scripts/sync-prices.mjs
```

Then refresh **Prices** / the map in the app.

## How the app displays prices (live → MSP DB fallback)

Two layers live in the same `msp_prices` table:

| Layer | How to recognize | Role |
|-------|------------------|------|
| **Mandi / Agmarknet** | `market` set, `arrival_date` set | Near-daily APMC rates from govt API sync |
| **MSP baseline** | `district` / `market` null | Non-realtime government MSP (CACP) |

### Map panel (`useMapLogic` → `priceResolve.ts`)

1. Cards first paint from static `CROP_PRICES` (layout only).
2. Async fetch: mandi rows for the **district** (or **state** aggregate when the state panel is open).
3. **Fuzzy crop match** (e.g. panel `Paddy` ↔ DB `Paddy (Common)`, `Soybean` ↔ `Soyabean`, `Arhar` ↔ `Arhar (Tur)`).
4. If mandi hits exist → show **LIVE** badge + aggregated min/max/modal for the newest arrival date.
5. If no mandi for that crop → keep static mandi range, but set **Govt MSP** from the MSP baseline rows and show **MSP DB** badge.
6. MSP value also updates from DB whenever a baseline (or mandi-row `msp`) match exists.

### Prices page (`/app/prices`)

- Lists both layers; prefers mandi modal/range when present, else Govt MSP.
- Search uses the same fuzzy crop matcher.

Shared helpers: `client/src/lib/priceResolve.ts`.

## What “reliable v1” means here
- Source: Agmarknet daily mandi feed (govt), not random numbers
- Scope: priority states + crops listed in `sync-prices.mjs` (expand later)
- Freshness: as often as you run this script (daily cron later)
- Not: second-by-second ticks for every mandi in India
- Fallback: MSP baseline rows in Supabase when a crop has no synced mandi for that region
