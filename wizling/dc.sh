#!/bin/bash

# dc.sh
# Build and run the Docker container locally using Docker Compose

# Define the path to the .env files
ENV_DIR="frontend"
ENV_FILE=".env"
ENV_BAK_FILE=".env.bak"
ENV_CONTAINER_FILE=".env.container"

# Check if the .env file exists before proceeding
if [ ! -f "$ENV_DIR/$ENV_FILE" ]; then
    echo "$ENV_FILE file not found!"
    exit 1
fi

# Rename .env to .env.bak
mv "$ENV_DIR/$ENV_FILE" "$ENV_DIR/$ENV_BAK_FILE"
echo "$ENV_FILE renamed to $ENV_BAK_FILE"

# Check if the .env.container file exists before renaming
if [ -f "$ENV_DIR/$ENV_CONTAINER_FILE" ]; then
    mv "$ENV_DIR/$ENV_CONTAINER_FILE" "$ENV_DIR/$ENV_FILE"
    echo "$ENV_CONTAINER_FILE renamed to $ENV_FILE"
else
    echo "$ENV_CONTAINER_FILE file not found! Restoring original .env file."
    mv "$ENV_DIR/$ENV_BAK_FILE" "$ENV_DIR/$ENV_FILE"  # Restore original .env
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
if docker build --no-cache -t wizling-web:latest . > build_log.txt 2>&1; then
    echo "Docker image built successfully."
else
    echo "Docker build failed. Check build_log.txt for details."
    mv "$ENV_DIR/$ENV_BAK_FILE" "$ENV_DIR/$ENV_FILE"  # Restore original .env
    exit 1
fi

# Restore the original .env file
mv "$ENV_DIR/$ENV_FILE" "$ENV_DIR/$ENV_CONTAINER_FILE"  # Rename .env back to .env.container
mv "$ENV_DIR/$ENV_BAK_FILE" "$ENV_DIR/$ENV_FILE"  # Rename .env.bak back to .env
echo "$ENV_BAK_FILE restored to $ENV_FILE and $ENV_FILE restored to $ENV_CONTAINER_FILE"

# Start the container using Docker Compose
echo "Starting the container using Docker Compose..."
docker-compose up