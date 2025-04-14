const express = require('express')
const router = express.Router()
const Config = require('../models/Config')

router.post('/calculate', async (req, res) => {
  try {
    const { 
      experienceLevel, 
      projectType, 
      scheduleType,
      customIndirectCost,
      customBillableHours
    } = req.body

    // Validar campos requeridos para el cálculo
    if (!experienceLevel || !projectType || !scheduleType) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['experienceLevel', 'projectType', 'scheduleType'] 
      })
    }

    // Obtener configuración por defecto
    const config = await Config.findOne({ isDefault: true })
    if (!config) {
      return res.status(404).json({ message: 'Configuration not found' })
    }

    // Encontrar tasas y multiplicadores
    const experience = config.experienceLevels.find(e => e.name === experienceLevel)
    const project = config.projectTypes.find(p => p.name === projectType)
    const schedule = config.scheduleTypes.find(s => s.name === scheduleType)

    if (!experience || !project || !schedule) {
      return res.status(400).json({ message: 'Invalid input values' })
    }

    // Obtener valores de configuración
    const baseRate = experience.baseRate
    const projectMultiplier = project.multiplier
    const scheduleMultiplier = schedule.multiplier
    const profitMargin = project.profitMargin
    const taxRate = config.taxRate
    
    // Usar valores personalizados si se proporcionan
    const indirectCostPerMonth = customIndirectCost || config.indirectCostPerMonth
    const billableHoursPerMonth = customBillableHours || config.billableHoursPerMonth
    
    // Calcular coste indirecto por hora
    const indirectCostPerHour = indirectCostPerMonth / billableHoursPerMonth

    // Calcular coste ajustado
    const adjustedBase = baseRate * projectMultiplier * scheduleMultiplier
    const costBeforeMargin = adjustedBase + indirectCostPerHour
    const costWithMargin = costBeforeMargin * (1 + profitMargin)
    const finalCost = costWithMargin * (1 + taxRate)

    // Devolver cálculo detallado
    res.json({
      input: {
        experienceLevel,
        projectType,
        scheduleType,
        customIndirectCost: customIndirectCost || null,
        customBillableHours: customBillableHours || null
      },
      calculation: {
        baseRate,
        projectMultiplier,
        scheduleMultiplier,
        indirectCostPerMonth,
        billableHoursPerMonth,
        indirectCostPerHour: parseFloat(indirectCostPerHour.toFixed(2)),
        profitMargin,
        taxRate
      },
      results: {
        adjustedBase: parseFloat(adjustedBase.toFixed(2)),
        costBeforeMargin: parseFloat(costBeforeMargin.toFixed(2)),
        costWithMargin: parseFloat(costWithMargin.toFixed(2)),
        finalCost: parseFloat(finalCost.toFixed(2))
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

module.exports = router 