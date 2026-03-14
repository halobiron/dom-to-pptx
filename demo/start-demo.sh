#!/bin/bash

echo "Starting DOM to PPTX Demo Server..."
echo ""
echo "Demo will be available at: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Python is installed
if command -v python3 &> /dev/null; then
    echo "Using Python 3 server..."
    sleep 2
    if command -v open &> /dev/null; then
        open http://localhost:8000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000
    fi
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python server..."
    sleep 2
    if command -v open &> /dev/null; then
        open http://localhost:8000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000
    fi
    python -m http.server 8000
else
    echo "Python not found. Please install Python or use a different server."
    echo "You can also open index.html directly in your browser."
fi
