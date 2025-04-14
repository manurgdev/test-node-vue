const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Permitir CORS en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204)
    }
    next()
  })
}

connectDB().then(connection => {
  const dbConnected = connection !== null
  
  app.get('/', (req, res) => {
    res.json({
      message: 'Backend API funcionando!',
      databaseConnected: dbConnected,
      environment: process.env.NODE_ENV
    })
  })
  
  app.get('/db-status', (req, res) => {
    const dbState = [
      'disconnected',
      'connected',
      'connecting',
      'disconnecting',
      'invalid'
    ]
    const state = dbConnected ? 
      dbState[require('mongoose').connection.readyState] : 
      'not initialized'
    
    res.json({
      dbStatus: state,
      connected: dbConnected && require('mongoose').connection.readyState === 1,
      endpoint: process.env.NODE_ENV === 'development' 
        ? process.env.MONGODB_URI || process.env.MONGODB_DOCKER_URI || process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017/app'
        : 'Not available in production' // Evitar exponer credenciales en producción
    })
  })

  const itemRoutes = require('./routes/items')

  app.use('/items', itemRoutes)

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' })
  })

  app.listen(port, () => {
    console.log(`API working at http://localhost:${port}`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
    console.log(`Database: ${dbConnected ? 'Connected' : 'Not connected'}`)
  })
})