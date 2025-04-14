#!/bin/sh

echo "Waiting for MongoDB to start..."
sleep 5

echo "Setting MongoDB connection variables..."
# Para Docker, asegurarse de usar la variable correcta
if [ -n "$MONGODB_DOCKER_URI" ]; then
  export MONGODB_URI=$MONGODB_DOCKER_URI
fi

echo "Initializing configuration..."
node scripts/init-config.js

echo "Starting Node.js server..."
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode"
  npm start
else
  echo "Running in development mode"
  npm run dev
fi 