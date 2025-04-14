.PHONY: dev prod build-dev build-prod down clean setup-mongodb install-deps

# Development environment
dev: build-dev
	docker compose up

# Production environment
prod: build-prod
	docker compose -f docker-compose.prod.yml up

# Build development images
build-dev:
	docker compose build

# Build production images
build-prod:
	docker compose -f docker-compose.prod.yml build

# Stop containers
down:
	docker compose down
	docker compose -f docker-compose.prod.yml down

# Clean (remove containers, volumes, and images)
clean: down
	docker system prune -af --volumes

# Install dependencies locally (optional)
install-deps: install-frontend install-backend

install-frontend:
	cd frontend && npm install

install-backend:
	cd backend && npm install

# Setup MongoDB (docker or local)
setup-mongodb:
	cd backend && npm run setup-mongodb

# Show available commands
help:
	@echo "Available commands:"
	@echo "  make dev              - Start development environment with Docker"
	@echo "  make prod             - Start production environment with Docker"
	@echo "  make build-dev        - Build development Docker images"
	@echo "  make build-prod       - Build production Docker images"
	@echo "  make down             - Stop all containers"
	@echo "  make clean            - Remove all Docker resources"
	@echo "  make setup-mongodb    - Setup MongoDB (assistant for configuring MongoDB)"
	@echo "  make install-deps     - Install all dependencies locally (frontend & backend)"
	@echo "  make install-frontend - Install frontend dependencies locally"
	@echo "  make install-backend  - Install backend dependencies locally" 