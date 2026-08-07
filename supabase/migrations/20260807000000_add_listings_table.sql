-- Create the Phase 1 Listings Table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  crop_id TEXT NOT NULL,
  state_name TEXT NOT NULL,
  district_name TEXT NOT NULL,
  price_per_unit NUMERIC NOT NULL,
  quantity_available NUMERIC NOT NULL,
  unit TEXT DEFAULT 'kg',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Turn on the security bouncer
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- RULE 1: Anyone (even logged out buyers) can view listings
CREATE POLICY "Public can view active listings"
  ON listings FOR SELECT
  USING (is_active = true);

-- RULE 2: Vendors can only create a listing if it's tied to their own auth ID
CREATE POLICY "Vendors can insert their own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- RULE 3: Vendors can only update/delete their own listings
CREATE POLICY "Vendors can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Vendors can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = seller_id);