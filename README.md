# Calculadora de Coste/Hora TramiTech

Aplicación web para calcular el coste por hora facturable de consultores, según variables financieras y contables.

## Requisitos Previos

### Para ejecución local
- Node.js (v18 o superior)
- MongoDB (instalado localmente o acceso a una instancia remota)

### Para ejecución con Docker
- Docker
- Docker Compose

## Estructura del Proyecto

El proyecto se compone de dos partes principales:

- **Backend**: API REST con Node.js y Express
- **Frontend**: Interfaz de usuario con Vue 3 y TypeScript

## Instalación y Ejecución

### Opción 1: Utilizando Docker (Recomendado)

La manera más sencilla de ejecutar la aplicación es utilizando Docker Compose:

Primero, asegúrate de tener los ficheros .env en las carpetas backend y frontend.

```bash
# Iniciar entorno de desarrollo
make dev

# O iniciar entorno de producción
make prod

# O si prefieres usar Docker Compose directamente
docker compose up -d                    # Desarrollo
docker compose -f docker-compose.prod.yml up -d  # Producción
```

La aplicación estará disponible en:
- **Entorno de Desarrollo**:
  - Frontend: http://localhost:5173
  - Backend API: http://localhost:3000

- **Entorno de Producción**:
  - Frontend: http://localhost:80
  - Backend API: http://localhost:3000

Otros comandos útiles:
```bash

# Reconstruir imágenes de desarrollo
make build

# Reconstruir imágenes de producción
make build-prod

# Detener contenedores
make down

# Limpiar todo (contenedores, imágenes, volúmenes)
make clean
```

### Opción 2: Instalación Local

#### Backend

1. Instalar dependencias:

```bash
cd backend
npm install
```

2. Configurar la base de datos:

   - Si tienes MongoDB instalado localmente, asegúrate de que esté corriendo.
   - Si no, puedes utilizar Docker para levantar una instancia de MongoDB:

```bash
docker run -d --name mongo-db -p 27017:27017 mongo
```

Crea un archivo `.env` en la carpeta `/backend` con la siguiente configuración:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tramitech
```

3. Inicializar la configuración en la base de datos:

```bash
npm run init-config
```

4. Iniciar el servidor:

```bash
npm run dev    # Desarrollo
npm start      # Producción
```

#### Frontend

1. Instalar dependencias:

```bash
cd frontend
npm install
```

Recuerda actualizar el archivo `.env` con la URL del backend:

```
VITE_API_URL=http://localhost:3000
```

2. Iniciar el servidor de desarrollo:

```bash
npm run dev    # Desarrollo
npm run build  # Producción (genera archivos estáticos en /dist)
```

La aplicación estará disponible en:
- Frontend (desarrollo): http://localhost:5173
- Backend API: http://localhost:3000

## Diferencias entre Entornos

### Entorno de Desarrollo
- Hot-reloading activado tanto en frontend como en backend
- Mapeo de volúmenes para permitir cambios en tiempo real
- Optimizado para desarrollo y depuración

### Entorno de Producción
- Frontend servido por Nginx optimizado para producción
- Backend optimizado para rendimiento
- Configurado para mayor estabilidad

## Funcionalidades

- Cálculo de coste/hora facturable basado en:
  - Nivel de experiencia del consultor
  - Tipo de proyecto
  - Horario de trabajo
  - Costes indirectos
  - Margen de beneficio
  - IVA aplicable
  
- Visualización detallada del desglose de costes
- Personalización de parámetros avanzados (costes indirectos, horas facturables)

## Tecnologías Utilizadas

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Vue 3, TypeScript, Tailwind CSS
- **Contenedores**: Docker, Docker Compose

## Developers

- ManuRGDev
