#!/bin/bash

# Define the port
PORT=5173

echo "Checking if port $PORT is in use..."

# Check if the port is in use by finding the process using it
PID=$(lsof -t -i:$PORT)

if [ -z "$PID" ]; then
    echo "Port $PORT is not in use. Proceeding..."
else
    echo "Port $PORT is in use. Killing process with PID $PID..."
    kill -9 $PID
    if [ $? -eq 0 ]; then
        echo "Process killed successfully."
    else
        echo "Failed to kill process with PID $PID."
        exit 1
    fi
fi

# Start Vite with the specified port
echo "Starting Vite with port $PORT..."
yarn dev --port $PORT --strictPort
