-- Update msp_prices table to track daily APMC market prices

ALTER TABLE public.msp_prices 
ADD COLUMN IF NOT EXISTS arrival_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS min_price numeric,
ADD COLUMN IF NOT EXISTS max_price numeric,
ADD COLUMN IF NOT EXISTS modal_price numeric,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS market text;

-- We don't want duplicates for the same crop in the same market on the same day
-- Using a unique constraint helps us do UPSERTs when our Edge Function runs
ALTER TABLE public.msp_prices
DROP CONSTRAINT IF EXISTS unique_daily_price;

ALTER TABLE public.msp_prices
ADD CONSTRAINT unique_daily_price UNIQUE NULLS NOT DISTINCT (crop, state, district, market, arrival_date);

-- DEPRECATED (2026-07-19): these testing policies are revoked in
-- 20260719_phase2_security_hardening.sql. Do not re-add anon write policies.
-- Price writes must use SUPABASE_SERVICE_ROLE_KEY via client/scripts/sync-prices.mjs.
-- CREATE POLICY "Allow anon inserts for testing" ON public.msp_prices FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow anon updates for testing" ON public.msp_prices FOR UPDATE USING (true);
