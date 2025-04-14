const express = require('express')
const router = express.Router()
const Config = require('../models/Config')

// Obtener configuración por defecto para los cálculos
router.get('/', async (req, res) => {
  try {
    const config = await Config.findOne({ isDefault: true })
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' })
    }
    res.json(config)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router 