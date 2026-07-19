-- Phase 2 security hardening (2026-07-19)
-- Apply in Supabase Dashboard → SQL Editor (or via supabase db push).
-- Idempotent: safe to re-run.

-- ─── 0. Clean Phase 1 probe data ───────────────────────────────────────────
DELETE FROM public.msp_prices WHERE crop LIKE '__probe%' OR crop LIKE '__sec_verify%';

-- profiles.id → auth.users.id (no ON DELETE CASCADE). Delete child rows first.
DELETE FROM public.profiles
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email LIKE 'phase1.probe.%@gmail.com'
     OR raw_user_meta_data->>'name' = 'Phase1 Probe'
     OR (raw_user_meta_data->>'name' = 'Probe' AND email LIKE '%@gmail.com')
)
OR id = 'e8c67399-3fc5-404e-999e-302a1f434a16';

DELETE FROM auth.users
WHERE email LIKE 'phase1.probe.%@gmail.com'
   OR id = 'e8c67399-3fc5-404e-999e-302a1f434a16'
   OR (
     raw_user_meta_data->>'name' = 'Probe'
     AND email LIKE 'phase1.probe.%'
   );

-- ─── 1. Ensure RLS is ON (off by default for raw SQL tables) ───────────────
ALTER TABLE public.msp_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ─── 2. Drop dangerous / overly broad policies ─────────────────────────────
DROP POLICY IF EXISTS "Allow anon inserts for testing" ON public.msp_prices;
DROP POLICY IF EXISTS "Allow anon updates for testing" ON public.msp_prices;

-- Drop common loose defaults if they exist (names may vary; IF EXISTS is safe)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.msp_prices;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.dealers;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Public read" ON public.msp_prices;
DROP POLICY IF EXISTS "Public read" ON public.dealers;
DROP POLICY IF EXISTS "Public read" ON public.profiles;

-- Drop policies we are about to recreate (idempotent re-run)
DROP POLICY IF EXISTS "msp_prices_public_select" ON public.msp_prices;
DROP POLICY IF EXISTS "dealers_public_select_active" ON public.dealers;
DROP POLICY IF EXISTS "dealers_owner_insert" ON public.dealers;
DROP POLICY IF EXISTS "dealers_owner_update" ON public.dealers;
DROP POLICY IF EXISTS "dealers_owner_delete" ON public.dealers;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

-- ─── 3. msp_prices — public READ only; writes via service_role only ───────
-- service_role bypasses RLS; sync-prices.mjs / cron must use SERVICE_ROLE_KEY.
CREATE POLICY "msp_prices_public_select"
  ON public.msp_prices
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- No INSERT / UPDATE / DELETE policies for anon or authenticated.
-- Authenticated users cannot write prices either (admin/scraper only).

-- ─── 4. dealers — public READ of active rows; owners manage own rows ─────
CREATE POLICY "dealers_public_select_active"
  ON public.dealers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "dealers_owner_insert"
  ON public.dealers
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "dealers_owner_update"
  ON public.dealers
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "dealers_owner_delete"
  ON public.dealers
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ─── 5. profiles — own row only (PII: name/phone must not be world-readable)
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- If a signup trigger inserts into profiles as SECURITY DEFINER, it keeps working.
-- Authenticated insert policy covers client-side profile creation if used.

-- ─── 6. Sanity: revoke any accidental broad grants are still gated by RLS ─
-- (Supabase default grants SELECT/INSERT/etc. to anon/authenticated; RLS enforces.)
