import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';

// Node 20+ env loader
try {
  process.loadEnvFile('client/.env');
} catch (e) {
  try {
    process.loadEnvFile('.env');
  } catch (e2) {}
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in client/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We simulate scraping live APMC prices by taking base MSP rates and applying daily market fluctuations.
async function syncLivePrices() {
  console.log("Fetching base crops from Supabase...");
  const { data: baseCrops, error } = await supabase.from('msp_prices').select('crop, msp').is('district', null);
  
  if (error) {
    console.error("Error fetching base crops:", error);
    return;
  }

  console.log(`Found ${baseCrops.length} tracked crops. Generating live market prices for key districts...`);
  
  const today = new Date().toISOString().split('T')[0];
  const livePrices = [];

  const districts = [
    { state: 'Andhra Pradesh', district: 'Guntur', market: 'Guntur APMC' },
    { state: 'Maharashtra', district: 'Nashik', market: 'Lasalgaon' },
    { state: 'Madhya Pradesh', district: 'Indore', market: 'Indore Mandi' },
    { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana APMC' },
    { state: 'Karnataka', district: 'Bengaluru Urban', market: 'Yeshwanthpur' },
    { state: 'Gujarat', district: 'Rajkot', market: 'Rajkot APMC' },
    { state: 'Telangana', district: 'Nizamabad', market: 'Nizamabad Mandi' },
    // Add Visakhapatnam to test
    { state: 'Andhra Pradesh', district: 'Visakhapatnam', market: 'Visakhapatnam APMC' },
    { state: 'Andhra Pradesh', district: 'Srikakulam', market: 'Amadalavalasa' },
  ];

  for (const crop of baseCrops) {
    // Generate data for 3 random districts for this crop today
    const selectedDistricts = districts.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    for (const d of selectedDistricts) {
      // Fluctuate price between -5% and +15% of MSP
      const fluctuation = (Math.random() * 0.20) - 0.05; 
      const modalPrice = Math.round(crop.msp * (1 + fluctuation));
      const minPrice = Math.round(modalPrice * 0.95);
      const maxPrice = Math.round(modalPrice * 1.05);

      livePrices.push({
        crop: crop.crop,
        msp: crop.msp,
        season: 'Kharif', // Simplified
        year: '2024-25',
        arrival_date: today,
        min_price: minPrice,
        max_price: maxPrice,
        modal_price: modalPrice,
        state: d.state,
        district: d.district,
        market: d.market
      });
    }
  }

  console.log(`Pushing ${livePrices.length} live price records to Supabase...`);
  
  // Upsert the data
  const { error: upsertError } = await supabase
    .from('msp_prices')
    .upsert(livePrices, { onConflict: 'crop, state, district, market, arrival_date' });

  if (upsertError) {
    console.error("Error upserting live prices:", upsertError);
  } else {
    console.log("Successfully synced live market prices!");
  }
}

syncLivePrices();
