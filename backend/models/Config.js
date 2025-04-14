const mongoose = require('mongoose')

const configSchema = new mongoose.Schema({
  experienceLevels: [
    {
      name: { type: String, required: true },
      baseRate: { type: Number, required: true }
    }
  ],
  projectTypes: [
    {
      name: { type: String, required: true },
      multiplier: { type: Number, required: true },
      profitMargin: { type: Number, required: true }
    }
  ],
  scheduleTypes: [
    {
      name: { type: String, required: true },
      multiplier: { type: Number, required: true }
    }
  ],
  indirectCostPerMonth: { type: Number, default: 1000 },
  billableHoursPerMonth: { type: Number, default: 140 },
  taxRate: { type: Number, default: 0.21 },
  isDefault: { type: Boolean, default: false }
}, {
  timestamps: true
})

module.exports = mongoose.model('Config', configSchema) 