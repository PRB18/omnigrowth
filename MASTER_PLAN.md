# OmniGrowth — Master plan & status

**Last updated:** 2026-08-11  
**Repo:** https://github.com/PRB18/omnigrowth (`main`)  
**Purpose:** Single map of the production-readiness plan, what is done, what is left, and where the detailed docs live.

---

## Product (one line)

OmniGrowth is a B2B agricultural intelligence platform for India: interactive map → mandi/MSP prices → dealers. Stack: Vite + React + TypeScript (`/client`) + Supabase. Live mandi rates from Agmarknet (data.gov.in); MSP from non-realtime DB rows when mandi is missing.

---

## Plan we are following (phase order)

| Phase | Goal | Detail doc |
|-------|------|------------|
| **0** | Agent context + graphify | `CLAUDE.md` → `@AGENTS.md`; `graphify update` / hooks |
| **1** | Findings only (no drive-by fixes) | [`PHASE1_FINDINGS.md`](./PHASE1_FINDINGS.md) |
| **2** | Supabase security hardening | [`PHASE2_SECURITY.md`](./PHASE2_SECURITY.md) |
| **3** | UI / map-as-centerpiece | [`PHASE3_UI.md`](./PHASE3_UI.md) |
| **4** | Capacitor iOS/Android | [`PHASE4_MOBILE.md`](./PHASE4_MOBILE.md) |
| **Data** | Mandi sync + display fallback | [`DATA_SYNC.md`](./DATA_SYNC.md) |
| **Standards** | Agent / security rules | [`AGENTS.md`](./AGENTS.md) |
| **Local / deploy** | How to run & Netlify | [`README.md`](./README.md) |

Do not skip phase order for security: **inventory → harden → polish UI → native wrap**.

---

## Status at a glance

| Area | Status |
|------|--------|
| Phase 0 — CLAUDE / graphify / hooks | **Done** |
| Phase 1 — findings report | **Done** |
| Phase 2 — RLS + write locks + verify script | **Done** (live probes PASS) |
| Phase 2 — Auth / Security Advisor / key rotate | **Mostly done** — only “Confirm email” left to verify ON |
| Phase 3 — UI pass | **Done** |
| Phase 4 — Capacitor scaffold | **Done** |
| Phase 4 — iOS/Android simulator smoke | **Open** (needs Mac + Android Studio / JDK 21) |
| Live mandi + MSP DB fallback on map/Prices | **Done** (`priceResolve.ts`) |
| Rabi/Mandi filter (season mistag fix) | **Done** |
| GitHub `main` (no `.env` committed) | **Done** |
| Vendor Listings | **Done** (DB schema, RLS, Dashboard UI) |
| Buyer Inquiries | **Done** (DB schema, RLS) |
| Contact Seller Modal | **Done** (UI, wired to inquiries table, opens from listing card) |
| Public Netlify URL | **Open** (config in `netlify.toml`; site not linked in repo) |
| Automated tests / CI | **Open** (gap from Phase 1) |

---

## Phase 2 — what you changed in Supabase (from the checklist)

Source of truth for steps: [`PHASE2_SECURITY.md`](./PHASE2_SECURITY.md).  
SQL applied: [`supabase/migrations/20260719_phase2_security_hardening.sql`](./supabase/migrations/20260719_phase2_security_hardening.sql).

**Founder note:** Dashboard security locks applied; Auth/Advisor settings updated 2026-07-19.  
**Re-verified from this machine (anon key only):** `node client/scripts/verify-security.mjs` → all PASS.

### Confirmed done (migration + live probes)

| Setting / action | What it means |
|------------------|---------------|
| RLS **ON** for `msp_prices`, `dealers`, `profiles` | Tables not world-writable by default |
| Dropped anon insert/update “for testing” on prices | No public write on prices |
| `msp_prices` — public **SELECT** only | Anyone can read MSP/mandi; writes need **service_role** (sync script) |
| `dealers` — public **SELECT** of `is_active` rows; owners manage own rows | Directory readable; no anon insert |
| `profiles` — own-row select/update/insert | Not world-readable |
| Probe / `__probe*` cleanup | Test junk removed |
| Sync uses **repo-root** service role (not `VITE_*`) | See `DATA_SYNC.md` |
| Client bundle has no `service_role` | Post-build scan clean |
| Production npm deps audit | **0** vulnerabilities (`npm audit --omit=dev`) |

### Dashboard Auth / Advisor — founder updates (2026-07-19)

| # | Setting | Status |
|---|---------|--------|
| 1 | **Security Advisor** red/yellow | **Cleared** |
| 2 | **OTP / magic link expiry** | **1 hour** |
| 3 | **MFA (TOTP)** | **Enabled** |
| 4 | **Password min length** | **8** |
| 5 | **Rate limits** | **Supabase defaults** (OK for now) |
| 6 | **Anon key rotation** | **Done** — also update `client/.env` + Netlify `VITE_SUPABASE_ANON_KEY` if not already |
| 7 | **Confirm email** | ☐ Still verify ON in dashboard — see below |
| 8 | Storage / Edge Functions | N/A yet |

#### What “Confirm email” is (plain English)

In Supabase: **Authentication →** email settings → **Confirm email** / **Enable email confirmations**.

When **on**, a new user must click a link in their inbox before they can sign in. That stops fake/typo emails from becoming real accounts. Keep it **on** unless you explicitly want open signup with no verification.

**How to check:** Auth settings → look for “Confirm email”. If it’s already on, tick item 7 above and Phase 2 Auth is complete.

**How to re-check from your laptop (no secrets in git):**

```bash
cd client
node scripts/verify-security.mjs
npm run build
# then search dist for service_role — must be empty
npm audit --omit=dev
```

---

## Done until now (broader than Phase 2)

### App / data
- Routes working: landing, map, prices, dealers UI, login/register forms, 404 — see Phase 1
- Map: live Agmarknet overlay + MSP DB fallback — [`DATA_SYNC.md`](./DATA_SYNC.md), `client/src/lib/priceResolve.ts`
- Prices: plain-language copy; Kharif/Rabi filter uses crop-based season for mandi rows
- Dead GeoJSON removed from use / deleted combined Gujarat file
- Vendor Listings: Users can view vendor-uploaded listings on the dashboard map at the district/mandal level.
- Buyer Inquiries: Buyers can request quantities on listings, and sellers can manage these orders.
- Contact Seller Modal (`ContactSellerModal.tsx`): Pop-up form that lets a buyer pick quantity + add a message and send an inquiry to the seller.
- `DashboardUI.tsx` wired: "Contact" button on each seller card opens the modal with that listing's data; modal saves to `inquiries` table on submit.

### Code quality
- Plain-English comments added to `ContactSellerModal.tsx` and `DashboardUI.tsx` — every section explained.

### Security / ops
- Phase 2 migration + verify script
- `.env` gitignored (root + client); only `.env.example` placeholders on GitHub
- Netlify build config: [`netlify.toml`](./netlify.toml)
- Listings & Inquiries security: new table migrations (`20260807000000_add_listings_table.sql`, `20260811000000_add_inquiries_table.sql`) with Row Level Security (RLS) enforced.

### UI / mobile
- Phase 3 design system (map-first, dark agri palette) — [`PHASE3_UI.md`](./PHASE3_UI.md)
- Capacitor Android + iOS projects, icons, splash — [`PHASE4_MOBILE.md`](./PHASE4_MOBILE.md)

### Process
- Graphify hooks; phase docs in repo
- Feature work merged to **`main`** on GitHub

---

## Still to do (prioritized)

### P0 — Security close-out
1. Confirm **“Confirm email”** is ON in Supabase Auth (last Phase 2 Auth tick) — see Phase 2 section above.
2. After anon key rotate: local `client/.env` + Netlify env use the **new** anon key, then redeploy if hosted.
3. Re-run `verify-security.mjs` after any future policy change.

### P1 — Product decisions (founders)
From Phase 1 — still open:
- Keep `/app` public without login?
- Keep MSP/mandi world-readable forever?
- Empty dealers table: seed data vs intentional?

### P2 — Ship / native
- Deploy Netlify with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` only — [`README.md`](./README.md)
- Run Android emulator (JDK 21 + Android Studio) and iOS simulator (Mac) — [`PHASE4_MOBILE.md`](./PHASE4_MOBILE.md)
- Before store: vendor Leaflet (and optionally fonts) off CDN for offline reliability

### P3 — Engineering hygiene
- Enable TypeScript `strict` (AGENTS.md debt)
- Add CI smoke: `lint` + `build` + `verify-security.mjs`
- Optional: auth route guards if product requires login

---

## Quick links

| Doc | Use when |
|-----|----------|
| [`PHASE1_FINDINGS.md`](./PHASE1_FINDINGS.md) | Feature inventory, dead code, perf, CI gaps |
| [`PHASE2_SECURITY.md`](./PHASE2_SECURITY.md) | RLS / Auth / Advisor checklist |
| [`PHASE3_UI.md`](./PHASE3_UI.md) | Design tokens + UI acceptance |
| [`PHASE4_MOBILE.md`](./PHASE4_MOBILE.md) | Capacitor workflow + simulators |
| [`DATA_SYNC.md`](./DATA_SYNC.md) | Agmarknet sync + live→MSP fallback |
| [`README.md`](./README.md) | Local run, Netlify, graphify commands |
| [`AGENTS.md`](./AGENTS.md) | Non-negotiable agent/security rules |

---

## Definition of done (original master prompt)

- [x] Phase 1 report delivered before bulk fixes  
- [x] RLS + policies confirmed via live probes; `service_role` not in client bundle  
- [x] `npm run build` / lint pass; prod audit clean  
- [x] Security Advisor cleared; OTP 1h; MFA on; password min 8; anon key rotated; rate limits = defaults  
- [ ] Confirm email setting verified ON in Auth dashboard  
- [ ] App smoke on iOS simulator **and** Android emulator  
- [x] README covers local run + graphify refresh  
- [x] This master plan doc exists and points at the phase MDs  

Update this file when a P0/P1 item lands so status stays trustworthy.
