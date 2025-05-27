#!/bin/bash

# Kill any processes using ports 3000 and 5173
echo "Checking if port 3000 is in use..."
PID_3000=$(lsof -t -i:3000)
if [ -n "$PID_3000" ]; then
    echo "Port 3000 is in use. Killing process with PID $PID_3000..."
    kill -9 $PID_3000
fi

echo "Checking if port 5173 is in use..."
PID_5173=$(lsof -t -i:5173)
if [ -n "$PID_5173" ]; then
    echo "Port 5173 is in use. Killing process with PID $PID_5173..."
    kill -9 $PID_5173
fi

# Start backend and frontend with explicit port settings
echo "Starting backend on port 3000..."
(cd backend && BACKEND_PORT=3000 PORT=3000 yarn dev) &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

echo "Starting frontend on port 5173..."
(cd frontend && PORT=5173 VITE_DEV_PORT=5173 yarn dev --port=5173 --strictPort) &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID