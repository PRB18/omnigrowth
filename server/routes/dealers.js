import express from 'express'
import { z } from 'zod'
import Dealer from '../models/Dealer.js'

const router = express.Router()

const dealerQuerySchema = z.object({
  crop: z.string().optional(),
  state: z.string().optional(),
  type: z.enum(['aggregator', 'exporter', 'processor', 'retailer', 'fpo']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12)
})

// GET /api/dealers — search & filter
router.get('/', async (req, res) => {
  try {
    const query = dealerQuerySchema.parse(req.query)
    const filter = { isActive: true }

    if (query.crop) filter.crops = { $in: [new RegExp(query.crop, 'i')] }
    if (query.state) filter.states = { $in: [new RegExp(query.state, 'i')] }
    if (query.type) filter.dealerType = query.type

    const skip = (query.page - 1) * query.limit
    const [dealers, total] = await Promise.all([
      Dealer.find(filter)
        .skip(skip)
        .limit(query.limit)
        .populate('user', 'name email phone')
        .sort({ isVerified: -1, rating: -1 }),
      Dealer.countDocuments(filter)
    ])

    res.json({
      success: true,
      data: {
        dealers,
        pagination: {
          total,
          page: query.page,
          pages: Math.ceil(total / query.limit)
        }
      }
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message })
    }
    res.status(500).json({ success: false, error: 'Failed to fetch dealers' })
  }
})

// GET /api/dealers/:id
router.get('/:id', async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id).populate('user', 'name email phone state district')
    if (!dealer) return res.status(404).json({ success: false, error: 'Dealer not found' })
    res.json({ success: true, data: dealer })
  } catch {
    res.status(500).json({ success: false, error: 'Failed to fetch dealer' })
  }
})

export default router
