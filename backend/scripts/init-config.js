const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Config = require('../models/Config')

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_DOCKER_URI || process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/tramitech'

/**
 * Script para inicializar la configuración por defecto en la base de datos
 * 
 * Este script verifica si existe una configuración por defecto y la crea si no existe.
 * Si ya existe, no hace nada.
 */
async function setupDatabase() {
  try {
    console.log(`Intentando conectar a MongoDB en: ${MONGODB_URI}`)
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const defaultConfig = await Config.findOne({ isDefault: true })

    if (!defaultConfig) {
      console.log('Creating default configuration...')
      
      const config = new Config({
        experienceLevels: [
          { name: 'Junior', baseRate: 30 },
          { name: 'Mid', baseRate: 50 },
          { name: 'Senior', baseRate: 70 }
        ],
        projectTypes: [
          { name: 'Normal', multiplier: 1, profitMargin: 0.10 },
          { name: 'Urgente', multiplier: 1.5, profitMargin: 0.15 },
          { name: 'Estratégico', multiplier: 2, profitMargin: 0.20 }
        ],
        scheduleTypes: [
          { name: 'Laboral (8h-20h)', multiplier: 1 },
          { name: 'Nocturno/Festivo', multiplier: 1.25 }
        ],
        indirectCostPerMonth: 1000,
        billableHoursPerMonth: 140,
        taxRate: 0.21,
        isDefault: true
      })

      await config.save()
      console.log('Default configuration created successfully!')
    } else {
      console.log('Default configuration already exists')
    }

  } catch (error) {
    console.error('Error setting up the database:', error)
  } finally {
    mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

setupDatabase() 