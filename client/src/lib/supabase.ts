import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to client/.env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Types ────────────────────────────────────────────────────────────────
export interface Profile {
  id: string
  name: string
  phone?: string
  role: 'farmer' | 'dealer' | 'buyer' | 'admin'
  state?: string
  district?: string
  created_at: string
}

export interface Dealer {
  id: string
  user_id: string
  business_name: string
  gstin?: string
  crops: string[]
  states: string[]
  dealer_type: 'aggregator' | 'exporter' | 'processor' | 'retailer' | 'fpo'
  description?: string
  contact_email?: string
  contact_phone?: string
  website?: string
  is_verified: boolean
  is_active: boolean
  rating?: number
  created_at: string
}

export interface MSPPrice {
  id: string
  crop: string
  msp: number
  unit: string
  season: 'Kharif' | 'Rabi' | 'Zaid'
  year: string
  arrival_date?: string | null
  min_price?: number | null
  max_price?: number | null
  modal_price?: number | null
  state?: string | null
  district?: string | null
  market?: string | null
}
