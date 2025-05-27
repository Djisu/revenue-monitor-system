#!/bin/bash

# Kill any process using port 5173
echo "Checking if port 5173 is in use..."
PID_5173=$(lsof -t -i:5173)
if [ -n "$PID_5173" ]; then
    echo "Port 5173 is in use. Killing process with PID $PID_5173..."
    kill -9 $PID_5173
fi

# Force environment variables and start Vite
export PORT=5173
export VITE_DEV_PORT=5173

# Start Vite with explicit port
echo "Starting Vite on port 5173..."
npx vite --port=5173 --strictPort
