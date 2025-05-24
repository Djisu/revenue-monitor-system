#!/bin/sh

# Ensure the script runs in the correct directory
cd "$(dirname "$0")"

# Check if the .env file exists
if [ -f "src/routes/.env.$NODE_ENV" ]; then
  # Copy the .env file
  cross-env NODE_ENV=development shx cp src/routes/.env.$NODE_ENV dist/routes/.env
else
  echo "No .env file found in src/routes"
fi

# Run TypeScript transpiler
tsc