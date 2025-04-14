.PHONY: up down build logs clean dev prod help

# Variables
DC=docker compose

# Comandos
help:
	@echo "Comandos disponibles:"
	@echo "  make dev     - Iniciar entorno de desarrollo"
	@echo "  make prod    - Iniciar entorno de producción"
	@echo "  make up      - Iniciar los contenedores (desarrollo)"
	@echo "  make down    - Detener y eliminar contenedores"
	@echo "  make build   - Reconstruir las imágenes (desarrollo)"
	@echo "  make build-prod - Reconstruir las imágenes (producción)"
	@echo "  make logs    - Ver logs de los contenedores"
	@echo "  make clean   - Eliminar contenedores, imágenes y volúmenes"

# Entornos completos
dev: build
	$(DC) up

prod: build-prod
	$(DC) -f docker-compose.prod.yml up -d

# Comandos individuales
up:
	$(DC) up -d

down:
	$(DC) down
	$(DC) -f docker-compose.prod.yml down

build:
	$(DC) build

build-prod:
	$(DC) -f docker-compose.prod.yml build

logs:
	$(DC) logs -f

clean:
	$(DC) down -v --rmi all
	$(DC) -f docker-compose.prod.yml down -v --rmi all

# Valor por defecto
.DEFAULT_GOAL := help