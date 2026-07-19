# Phase 2 — Security hardening checklist

**Founder confirm (2026-07-19):** Dashboard security locks applied.  
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

## Dashboard — Auth hardening (manual)

| Setting | Target |
|---------|--------|
| Confirm email | **Required** (signup already returned `session=false` in Phase 1 — confirm this stays on) |
| OTP / magic link expiry | ≤ 1 hour |
| MFA | Available for accounts (enable TOTP in Auth settings when ready for users) |
| Rate limits | Keep Supabase defaults at minimum; tighten if you see abuse |

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

See the final note from the agent: rotate the **anon/publishable** key once write policies are confirmed closed (it was exposed while writes were open). Rotate **service_role** only if it was ever committed, pasted into chat, or placed in a `VITE_*` env var.
