CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quantity_requested numeric NOT NULL CHECK (quantity_requested > 0),
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Turn on the security bouncer
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RULE 1: Buyers can only see inquiries they sent
CREATE POLICY "inquiries_buyer_select_own" ON public.inquiries
  FOR SELECT USING (auth.uid() = buyer_id);

-- RULE 2: Sellers can only see inquiries sent to them
CREATE POLICY "inquiries_seller_select_own" ON public.inquiries
  FOR SELECT USING (auth.uid() = seller_id);

-- RULE 3: Buyers can create a new inquiry (and only as themselves)
CREATE POLICY "inquiries_buyer_insert" ON public.inquiries
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RULE 4: Sellers can update the status (e.g., from 'pending' to 'accepted')
CREATE POLICY "inquiries_seller_update_status" ON public.inquiries
  FOR UPDATE USING (auth.uid() = seller_id);