# Node.js + Vue.js Dockerized Project

Este proyecto contiene una aplicación con backend Node.js (Express) y frontend Vue.js, configurada para ejecutarse con o sin Docker.

## Requisitos

### Opción 1: Con Docker (recomendado)
- Docker
- Docker Compose
- Make (opcional, para usar comandos simplificados)

### Opción 2: Sin Docker
- Node.js 20.x o superior
- npm
- MongoDB (local o remoto)

## Estructura del Proyecto

```
.
├── backend/             # API con Express.js + MongoDB
├── frontend/            # Aplicación Vue.js
├── docker-compose.yml   # Configuración para desarrollo
├── docker-compose.prod.yml # Configuración para producción
└── Makefile             # Comandos simplificados
```

## Tecnologías

- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: Vue 3 + TypeScript
- **Base de datos**: MongoDB
- **Contenedores**: Docker

## Opciones de Ejecución

### Opción 1: Usando Docker (recomendado)

#### Usando Make

```bash
# Iniciar entorno de desarrollo
make dev

# Iniciar entorno de producción
make prod

# Construir imágenes de desarrollo
make build-dev

# Construir imágenes de producción
make build-prod

# Detener todos los contenedores
make down

# Limpiar todos los recursos Docker (contenedores, volúmenes, imágenes)
make clean

# Ver comandos disponibles
make help
```

#### Usando Docker Compose directamente

```bash
# Desarrollo
docker compose up --build

# Producción
docker compose -f docker-compose.prod.yml up --build

# Detener contenedores
docker compose down
```

### Opción 2: Sin Docker (ejecución local)

#### Configurar MongoDB

Tienes varias opciones para configurar MongoDB:

1. **MongoDB local**: Instala MongoDB en tu máquina local
2. **MongoDB Atlas**: Crea una cuenta gratuita en MongoDB Atlas
3. **Otra instancia de MongoDB**: Usa cualquier otra instancia de MongoDB

Edita el archivo `.env` en la raíz del proyecto para configurar la conexión:

```
# Descomentar y editar la opción deseada
# MONGODB_LOCAL_URI=mongodb://localhost:27017/app
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/app?retryWrites=true&w=majority
```

#### Instalar y ejecutar el backend

```bash
# Instalar dependencias
cd backend
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

#### Instalar y ejecutar el frontend

```bash
# Instalar dependencias
cd frontend
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Acceso a las Aplicaciones

- **Frontend (Desarrollo)**: http://localhost:5173
- **Frontend (Producción)**: http://localhost:80
- **Backend API**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017 (solo accesible en desarrollo)

## Desarrollo con Docker

El entorno de desarrollo monta los directorios locales como volúmenes, lo que permite:

- Cambios en tiempo real (hot-reload)
- No necesita instalar dependencias localmente
- Entorno consistente entre desarrolladores

## API Endpoints

- `GET /` - Verificar estado del servidor y conexión a la base de datos
- `GET /db-status` - Verificar estado detallado de la conexión a MongoDB
- `GET /items` - Obtener todos los items
- `GET /items/:id` - Obtener un item por ID
- `POST /items` - Crear nuevo item
- `PUT /items/:id` - Actualizar un item
- `DELETE /items/:id` - Eliminar un item

## Base de Datos

### Configuración en Docker
- **Host**: mongodb
- **Puerto**: 27017
- **Base de datos**: app
- **Usuario**: admin
- **Contraseña**: password

### Configuración sin Docker
Configura las variables de entorno en el archivo `.env` según tu instancia de MongoDB.

## Verificar Conexión a la Base de Datos

Puedes verificar si la aplicación está correctamente conectada a MongoDB visitando:
```
http://localhost:3000/db-status
```

## Resolución de Problemas

Si tienes problemas con la conexión a MongoDB:

1. Verifica que la instancia de MongoDB esté ejecutándose
2. Revisa la configuración en el archivo `.env`
3. Consulta los logs del servidor para ver mensajes de error específicos

## Notas

- El frontend en producción se sirve a través de Nginx cuando se usa Docker
- En producción, las solicitudes a `/api/` desde el frontend se redirigen automáticamente al backend
- Los datos de MongoDB se persisten usando volúmenes de Docker (cuando se usa Docker) 