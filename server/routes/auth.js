import express from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User.js'

const router = express.Router()

// ─── Zod Schemas ──────────────────────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(72),
  role: z.enum(['farmer', 'dealer', 'buyer']).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional(),
  state: z.string().optional(),
  district: z.string().optional()
})

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1)
})

// ─── Token helper ─────────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

// ─── POST /api/auth/register ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)

    const existing = await User.findOne({ email: data.email })
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already registered' })
    }

    const user = await User.create(data)
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message })
    }
    res.status(500).json({ success: false, error: 'Registration failed' })
  }
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await User.findOne({ email: data.email }).select('+password')
    if (!user || !(await user.comparePassword(data.password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }

    const token = signToken(user._id)

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      }
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: err.errors[0].message })
    }
    res.status(500).json({ success: false, error: 'Login failed' })
  }
})

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ success: false, error: 'User not found' })
    res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, state: user.state, district: user.district } })
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
})

export default router
