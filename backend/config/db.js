const mongoose = require('mongoose')

/**
 * Función para conectar a MongoDB
 * Soporta múltiples entornos:
 * - MongoDB en Docker
 * - MongoDB instalado localmente
 * - MongoDB Atlas o cualquier otra instancia remota
 */
const connectDB = async () => {
  try {
    // Orden de prioridad para la URI de conexión:
    // 1. URI definida en variables de entorno (.env)
    // 2. URI para conexión con MongoDB en Docker
    // 3. URI para conexión con MongoDB local
    const mongoUri = process.env.MONGODB_URI || 
                     process.env.MONGODB_DOCKER_URI || 
                     process.env.MONGODB_LOCAL_URI || 
                     'mongodb://localhost:27017/app'
    
    console.log(`Intentando conectar a MongoDB en: ${mongoUri.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`)
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    })
    
    console.log(`MongoDB conectado: ${conn.connection.host}`)
    
    return conn
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`)
    
    // Sugerencia de solución según el tipo de error
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n=============== SOLUCIÓN SUGERIDA ===============')
      console.log('No se pudo conectar a MongoDB. Soluciones posibles:')
      console.log('1. Si usas Docker: asegúrate de que el contenedor MongoDB esté funcionando con "docker compose up"')
      console.log('2. Si usas MongoDB local: asegúrate de que MongoDB esté instalado y ejecutándose')
      console.log('3. Configura la variable MONGODB_URI en el archivo .env con la URI correcta')
      console.log('================================================\n')
    }
    
    if (process.env.NODE_ENV === 'development') { // Bypass para desarrollo, aunque no es recomendable
      console.warn('Continuando en modo desarrollo sin MongoDB. Las operaciones de base de datos fallarán.')
      return null
    } else { // En producción cerramos la aplicación
      process.exit(1)
    }
  }
}

module.exports = connectDB 