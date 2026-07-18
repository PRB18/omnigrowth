import express from 'express'

const router = express.Router()

// MSP data sourced from CACP (2024-25 season)
const MSP_DATA = {
  'Paddy (Common)': { msp: 2300, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Paddy (Grade A)': { msp: 2320, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Jowar (Hybrid)': { msp: 3371, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Bajra': { msp: 2625, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Maize': { msp: 2090, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Arhar (Tur)': { msp: 7550, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Moong': { msp: 8682, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Urad': { msp: 7400, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Groundnut': { msp: 6783, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Sunflower Seed': { msp: 7280, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Soybean': { msp: 4892, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Sesame': { msp: 9267, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Nigerseed': { msp: 8717, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Cotton (Medium)': { msp: 7121, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Cotton (Long)': { msp: 7521, unit: '₹/qtl', season: 'Kharif', year: '2024-25' },
  'Wheat': { msp: 2275, unit: '₹/qtl', season: 'Rabi', year: '2024-25' },
  'Barley': { msp: 1735, unit: '₹/qtl', season: 'Rabi', year: '2024-25' },
  'Gram': { msp: 5440, unit: '₹/qtl', season: 'Rabi', year: '2024-25' },
  'Lentil (Masur)': { msp: 6425, unit: '₹/qtl', season: 'Rabi', year: '2024-25' },
  'Rapeseed/Mustard': { msp: 5650, unit: '₹/qtl', season: 'Rabi', year: '2024-25' },
  'Safflower': { msp: 5800, unit: '₹/qtl', season: 'Rabi', year: '2024-25' },
  'Toria': { msp: 5650, unit: '₹/qtl', season: 'Rabi', year: '2024-25' }
}

// GET /api/prices/msp — all MSP prices
router.get('/msp', (_req, res) => {
  res.json({ success: true, data: MSP_DATA, source: 'CACP, Government of India', year: '2024-25' })
})

// GET /api/prices/msp/:crop — single crop MSP
router.get('/msp/:crop', (req, res) => {
  const cropName = decodeURIComponent(req.params.crop)
  const data = MSP_DATA[cropName]
  if (!data) {
    return res.status(404).json({ success: false, error: 'Crop not found in MSP list' })
  }
  res.json({ success: true, data: { crop: cropName, ...data } })
})

// GET /api/prices/msp/season/:season — kharif or rabi
router.get('/season/:season', (req, res) => {
  const season = req.params.season
  const filtered = Object.entries(MSP_DATA)
    .filter(([, v]) => v.season.toLowerCase() === season.toLowerCase())
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  res.json({ success: true, data: filtered })
})

export default router
