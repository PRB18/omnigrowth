import mongoose from 'mongoose'

const dealerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [200, 'Business name too long']
  },
  gstin: {
    type: String,
    trim: true,
    uppercase: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format']
  },
  crops: [{ type: String, trim: true }],           // e.g. ['Wheat', 'Soybean']
  states: [{ type: String, trim: true }],           // operational states
  districts: [{ type: String, trim: true }],         // operational districts
  dealerType: {
    type: String,
    enum: ['aggregator', 'exporter', 'processor', 'retailer', 'fpo'],
    required: true
  },
  minQuantityTonnes: { type: Number, min: 0 },
  maxQuantityTonnes: { type: Number, min: 0 },
  description: { type: String, maxlength: 1000 },
  contactEmail: { type: String, trim: true },
  contactPhone: { type: String, trim: true },
  website: { type: String, trim: true },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, min: 1, max: 5, default: null },
  totalDeals: { type: Number, default: 0 }
}, { timestamps: true })

dealerSchema.index({ crops: 1, states: 1 })
dealerSchema.index({ isActive: 1, isVerified: 1 })

export default mongoose.model('Dealer', dealerSchema)
