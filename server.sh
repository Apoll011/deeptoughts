#!/bin/bash

# server.sh - Simple HTTP server that receives and prints objects

PORT=${1:-8080}
HOST=${2:-localhost}

echo "Starting server on $HOST:$PORT"
echo "Press Ctrl+C to stop"

# Create named pipe for HTTP communication
RESPONSE_PIPE=$(mktemp -u)
mkfifo $RESPONSE_PIPE

# Function to handle HTTP requests
handle_request() {
    local method=""
    local path=""
    local content_length=0
    local body=""

    # Read HTTP headers
    while IFS= read -r line; do
        line=$(echo "$line" | tr -d '\r')

        if [[ $line =~ ^GET|^POST|^PUT|^DELETE ]]; then
            method=$(echo "$line" | cut -d' ' -f1)
            path=$(echo "$line" | cut -d' ' -f2)
        elif [[ $line =~ ^Content-Length: ]]; then
            content_length=$(echo "$line" | cut -d' ' -f2)
        elif [[ -z $line ]]; then
            # Empty line indicates end of headers
            break
        fi
    done

    # Read request body if Content-Length > 0
    if [[ $content_length -gt 0 ]]; then
        body=$(head -c $content_length)
    fi

    # Print received data
    echo "========================================="
    echo "Timestamp: $(date)"
    echo "Method: $method"
    echo "Path: $path"
    echo "Content-Length: $content_length"
    if [[ -n $body ]]; then
        echo "Received Object:"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
    echo "========================================="

    # Send HTTP response
    echo "HTTP/1.1 200 OK"
    echo "Content-Type: application/json"
    echo "Access-Control-Allow-Origin: *"
    echo "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"
    echo "Access-Control-Allow-Headers: Content-Type"
    echo ""
    echo '{"status": "received", "message": "Object received and printed"}'
}

# Handle OPTIONS requests for CORS
handle_options() {
    echo "HTTP/1.1 200 OK"
    echo "Access-Control-Allow-Origin: *"
    echo "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"
    echo "Access-Control-Allow-Headers: Content-Type"
    echo ""
}

# Cleanup function
cleanup() {
    echo -e "\nShutting down server..."
    rm -f $RESPONSE_PIPE
    exit 0
}

trap cleanup INT

# Start the server
while true; do
    nc -l $HOST $PORT < $RESPONSE_PIPE | while IFS= read -r line; do
        if [[ $line =~ ^OPTIONS ]]; then
            handle_options
        else
            echo "$line"
        fi
    done | handle_request > $RESPONSE_PIPE
done