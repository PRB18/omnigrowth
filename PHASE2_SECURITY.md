# Phase 2 — Security hardening checklist

**Founder confirm (2026-07-19):** Dashboard security locks applied.  
**Auth / Advisor update (2026-07-19):** Anon key rotated; password min length 8; OTP expiry 1 hour; MFA enabled; Security Advisor red/yellow cleared; rate limits left at Supabase defaults.  
**Automated re-check:** `node client/scripts/verify-security.mjs` — all PASS (prices readable; writes blocked; dealers insert blocked; profiles not world-readable).

## Apply the migration (required — cannot be done from the anon key)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your OmniGrowth project → **SQL Editor**.
2. Paste and run the full contents of:
   `supabase/migrations/20260719_phase2_security_hardening.sql`
3. Confirm success (no errors). The script:
   - Deletes Phase 1 `__probe*` price rows and the probe Auth user
   - Enables RLS on `msp_prices`, `dealers`, `profiles`
   - Drops `"Allow anon inserts/updates for testing"`
   - Sets **public SELECT** on prices; **active dealers SELECT**; **own-row only** on profiles
   - Leaves **no** anon/authenticated write path on `msp_prices` (service_role only)

## Wire the price sync script (service role)

1. Create a **repo-root** `.env` (already gitignored) with:
   ```
   SUPABASE_URL=https://<project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role from Project Settings → API>
   ```
2. Do **not** put that key in `client/.env` or any `VITE_*` variable.
3. Run: `node client/scripts/sync-prices.mjs`

## Verify from this machine

```bash
node client/scripts/verify-security.mjs
```

Expect: SELECT on prices OK; INSERT/UPDATE on prices blocked; profiles not world-readable; dealers insert blocked.

## Dashboard — Security Advisor (manual)

Project → **Advisors** → **Security Advisor**. Resolve any remaining warnings (especially RLS / leaked password protection / function search_path).

**Status (2026-07-19):** Red/yellow warnings cleared by founder.

## Dashboard — Auth hardening (manual)

| Setting | Target | Status (2026-07-19) |
|---------|--------|---------------------|
| Confirm email | **Required** — after signup, user must click the email link before they get a session | ☐ Confirm in Auth settings (see note below) |
| OTP / magic link expiry | ≤ 1 hour | **Done** — set to 1 hour |
| MFA | Available for accounts (TOTP) | **Done** — enabled |
| Password minimum length | Stronger than default preferred | **Done** — min length **8** |
| Rate limits | Keep Supabase defaults at minimum; tighten if you see abuse | **Done** — left at Supabase defaults |
| Anon key rotation | Rotate after write policies closed | **Done** — anon key rotated |

### What “Confirm email” means

**Authentication → Providers / Email** (wording varies): “Confirm email” / “Enable email confirmations”.

- **On:** New users sign up → Supabase emails a link → they must click it before login works. Signup often returns `session: null` until confirmed. Stops random people from registering with fake emails.
- **Off:** Anyone can sign up with any email and use the app immediately.

For OmniGrowth, keep this **ON** unless you deliberately want open signup with no verification. After rotating the anon key, also update `VITE_SUPABASE_ANON_KEY` in `client/.env` and any Netlify env vars, then redeploy.

## Storage & Edge Functions

- No storage buckets or Edge Functions exist in this repo yet.
- When you add them: buckets private by default; Edge Functions verify JWT (or use secret-key auth for cron-only functions).

## Client bundle scan

After `cd client && npm run build`, confirm `service_role` / secret key strings are **absent** from `client/dist/`.

## npm audit

```bash
cd client && npm audit
```

Resolve high/critical before release. Re-run this checklist before every release.

## After Phase 2 is green — key rotation

- **Anon key:** Rotated (2026-07-19). Ensure local `client/.env` and Netlify `VITE_SUPABASE_ANON_KEY` match the new key.
- **service_role:** Rotate only if it was ever committed, pasted into chat, or placed in a `VITE_*` env var.
