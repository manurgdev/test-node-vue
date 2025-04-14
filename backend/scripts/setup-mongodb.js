#!/usr/bin/env node

/**
 * Script para ayudar a configurar MongoDB localmente
 * 
 * Este script verifica la disponibilidad de MongoDB e intenta configurar
 * una base de datos con la estructura necesaria para el proyecto.
 */

const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { spawn } = require('child_process')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Colores para la consola (ayuda visual)
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

console.log(`${colors.cyan}=== Asistente de configuración de MongoDB ===`)
console.log(`${colors.cyan}Este script te ayudará a configurar MongoDB para el proyecto.${colors.reset}`)

const options = [
  { name: 'MongoDB local', value: 'local' },
  { name: 'MongoDB en Docker (recomendado)', value: 'docker' },
  { name: 'MongoDB Atlas', value: 'atlas' }
]

async function selectOption() {
  console.log('\nSelecciona la opción que prefieres usar:')
  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option.name}`)
  })

  return new Promise(resolve => {
    rl.question(`\nIngresa el número de tu elección (1-${options.length}): `, answer => {
      const option = parseInt(answer)
      if (isNaN(option) || option < 1 || option > options.length) {
        console.log(`${colors.red}Opción inválida. Por favor, selecciona un número entre 1 y ${options.length}.${colors.reset}`)
        return selectOption().then(resolve)
      }
      resolve(options[option - 1])
    })
  })
}

async function configureLocalMongoDB() {
  console.log(`${colors.cyan}\n=== Configuración de MongoDB local ===`)
  console.log('Verificando si MongoDB está instalado...${colors.reset}')

  try {
    const client = new MongoClient('mongodb://localhost:27017/', { 
      serverSelectionTimeoutMS: 3000 
    })
    await client.connect()
    
    console.log(`${colors.green}¡MongoDB local detectado y funcionando!${colors.reset}`)
    
    const db = client.db('app')
    
    await db.createCollection('items')
    
    console.log(`${colors.green}Base de datos 'app' y colección 'items' creadas correctamente.${colors.reset}`)

    // Actualizar archivo .env con las credenciales oportunas
    const envPath = path.join(__dirname, '../../.env')
    try {
      let envContent = fs.readFileSync(envPath, 'utf8')
      
      // Descomentar MONGODB_LOCAL_URI y comentar las demás
      envContent = envContent.replace(/# MONGODB_LOCAL_URI/g, 'MONGODB_LOCAL_URI')
      envContent = envContent.replace(/^MONGODB_DOCKER_URI/gm, '# MONGODB_DOCKER_URI')
      
      fs.writeFileSync(envPath, envContent)
      console.log(`${colors.green}Archivo .env actualizado con la configuración local.${colors.reset}`)
    } catch (err) {
      console.error(`${colors.red}Error al actualizar el archivo .env: ${err.message}${colors.reset}`)
    }
    
    await client.close()
    return true
  } catch (err) {
    console.error(`${colors.red}\nNo se pudo conectar a MongoDB local: ${err.message}${colors.reset}`)
    
    console.log(`${colors.yellow}\nPosibles soluciones:${colors.reset}`)
    console.log('1. Asegúrate de que MongoDB está instalado en tu sistema')
    console.log('2. Verifica que el servicio de MongoDB está en ejecución')
    console.log('3. Si MongoDB requiere autenticación, deberás editar el archivo .env manualmente')
    
    return false
  }
}

async function configureDockerMongoDB() {
  console.log(`${colors.cyan}\n=== Configuración de MongoDB en Docker ===${colors.reset}`)
  
  console.log('Para usar MongoDB en Docker, simplemente ejecuta:')
  console.log(`${colors.yellow}docker compose up${colors.reset}`)
  
  console.log('\nEsto iniciará un contenedor de MongoDB configurado para el proyecto.')
  console.log('No se requieren más pasos de configuración.')
  
  // Actualizar archivo .env
  const envPath = path.join(__dirname, '../../.env')
  try {
    let envContent = fs.readFileSync(envPath, 'utf8')
    
    // Descomentar MONGODB_DOCKER_URI y comentar las demás
    envContent = envContent.replace(/# MONGODB_DOCKER_URI/g, 'MONGODB_DOCKER_URI')
    envContent = envContent.replace(/^MONGODB_LOCAL_URI/gm, '# MONGODB_LOCAL_URI')
    
    fs.writeFileSync(envPath, envContent)
    console.log(`${colors.green}Archivo .env actualizado para usar MongoDB en Docker.${colors.reset}`)
  } catch (err) {
    console.error(`${colors.red}Error al actualizar el archivo .env: ${err.message}${colors.reset}`)
  }
  
  return true
}

async function configureAtlasMongoDB() {
  console.log(`${colors.cyan}\n=== Configuración de MongoDB Atlas ===`)
  console.log('Sigue estos pasos para configurar MongoDB Atlas:${colors.reset}')
  
  console.log('\n1. Crea una cuenta en MongoDB Atlas (https://www.mongodb.com/cloud/atlas)')
  console.log('2. Crea un nuevo cluster (el plan gratuito es suficiente)')
  console.log('3. En "Security" -> "Database Access", crea un usuario con permisos de lectura/escritura')
  console.log('4. En "Security" -> "Network Access", añade tu dirección IP actual o utiliza "Allow Access From Anywhere"')
  console.log('5. En el cluster, haz clic en "Connect" -> "Connect your application"')
  console.log('6. Copia la URL de conexión (algo como mongodb+srv://...)')
  
  return new Promise(resolve => {
    rl.question(`\n${colors.yellow}¿Has completado estos pasos? (s/n):${colors.reset} `, answer => {
      if (answer.toLowerCase() !== 's') {
        console.log('Puedes configurar MongoDB Atlas más tarde editando el archivo .env')
        resolve(false)
        return
      }
      
      rl.question(`\n${colors.yellow}Ingresa la URL de conexión de MongoDB Atlas:${colors.reset} `, uri => {
        if (!uri || !uri.startsWith('mongodb+srv://')) {
          console.log(`${colors.red}URL de conexión inválida. Debe comenzar con "mongodb+srv://".${colors.reset}`)
          resolve(false)
          return
        }
        
        // Actualizar archivo .env
        const envPath = path.join(__dirname, '../../.env')
        try {
          let envContent = fs.readFileSync(envPath, 'utf8')
          
          // Reemplazar MONGODB_URI y comentar las demás
          envContent = envContent.replace(/# MONGODB_URI=.*/g, `MONGODB_URI=${uri}`)
          envContent = envContent.replace(/^MONGODB_LOCAL_URI/gm, '# MONGODB_LOCAL_URI')
          envContent = envContent.replace(/^MONGODB_DOCKER_URI/gm, '# MONGODB_DOCKER_URI')
          
          fs.writeFileSync(envPath, envContent)
          console.log(`${colors.green}Archivo .env actualizado con la configuración de MongoDB Atlas.${colors.reset}`)
          console.log(`${colors.cyan}Verificando conexión a MongoDB Atlas...${colors.reset}`)
          
          const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
          client.connect()
            .then(async () => {
              console.log(`${colors.green}¡Conexión a MongoDB Atlas exitosa!${colors.reset}`)
              await client.close()
              resolve(true)
            })
            .catch(err => {
              console.error(`${colors.red}Error al conectar a MongoDB Atlas: ${err.message}${colors.reset}`)
              console.log(`${colors.yellow}Verifica que la URL de conexión sea correcta y que hayas configurado correctamente el acceso de red.${colors.reset}`)
              resolve(false)
            })
        } catch (err) {
          console.error(`${colors.red}Error al actualizar el archivo .env: ${err.message}${colors.reset}`)
          resolve(false)
        }
      })
    })
  })
}

async function main() {
  try {
    const selectedOption = await selectOption()
    console.log(`\nHas seleccionado: ${colors.cyan}${selectedOption.name}${colors.reset}`)
    
    let success = false
    
    switch (selectedOption.value) {
      case 'local':
        success = await configureLocalMongoDB()
        break
      case 'docker':
        success = await configureDockerMongoDB()
        break
      case 'atlas':
        success = await configureAtlasMongoDB()
        break
    }
    
    if (success) {
      console.log(`\n${colors.green}¡Configuración completada con éxito!${colors.reset}`)
      console.log(`\nPuedes iniciar el backend con:`)
      console.log(`${colors.yellow}cd backend && npm run dev${colors.reset}`)
    } else {
      console.log(`\n${colors.yellow}La configuración no se ha completado. Puedes intentarlo de nuevo o editar manualmente el archivo .env.${colors.reset}`)
    }
  } catch (err) {
    console.error(`${colors.red}Error: ${err.message}${colors.reset}`)
  } finally {
    rl.close()
  }
}

main() 