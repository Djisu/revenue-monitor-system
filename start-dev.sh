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

# Start backend and frontend in parallel
echo "Starting backend on port 3000 and frontend on port 5173..."
(cd backend && yarn dev) & 
(cd frontend && ./start-frontend.sh)