import express from 'express'

const router = express.Router()

// GET /api/crops/states — list of all states
router.get('/states', (_req, res) => {
  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]
  res.json({ success: true, data: states })
})

// GET /api/crops — all crops list
router.get('/', (_req, res) => {
  const crops = [
    'Paddy', 'Wheat', 'Maize', 'Jowar', 'Bajra', 'Ragi', 'Barley',
    'Cotton', 'Jute', 'Sugarcane', 'Tobacco',
    'Groundnut', 'Soybean', 'Mustard', 'Sunflower', 'Castor', 'Sesame',
    'Arhar', 'Gram', 'Moong', 'Urad', 'Lentil',
    'Potato', 'Onion', 'Tomato', 'Brinjal', 'Cabbage', 'Cauliflower',
    'Apple', 'Mango', 'Banana', 'Grapes', 'Orange', 'Pomegranate',
    'Tea', 'Coffee', 'Rubber', 'Cardamom', 'Pepper', 'Turmeric', 'Ginger',
    'Coconut', 'Cashew', 'Areca Nut'
  ]
  res.json({ success: true, data: crops })
})

export default router
