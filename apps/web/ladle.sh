#!/bin/bash

# Kill any existing Ladle processes
pkill -9 -f "ladle.*serve" 2>/dev/null

# Wait a moment for ports to free up
sleep 1

# Start Ladle on a fixed port
echo "Starting Ladle on port 61000..."
pnpm ladle serve --port 61000
