#!/bin/bash

# dep_container.sh
# Build and run the Docker container locally

# Define the path to the .env files
ENV_DIR="frontend"
ENV_FILE=".env"
ENV_BAK_FILE=".env.bak"
ENV_CONTAINER_FILE=".env.container"

# Rename .env to .env.bak
if [ -f "$ENV_DIR/$ENV_FILE" ]; then
    mv "$ENV_DIR/$ENV_FILE" "$ENV_DIR/$ENV_BAK_FILE"
    echo "$ENV_FILE renamed to $ENV_BAK_FILE"
else
    echo "$ENV_FILE file not found!"
    exit 1
fi

# Rename .env.container to .env
if [ -f "$ENV_DIR/$ENV_CONTAINER_FILE" ]; then
    mv "$ENV_DIR/$ENV_CONTAINER_FILE" "$ENV_DIR/$ENV_FILE"
    echo "$ENV_CONTAINER_FILE renamed to $ENV_FILE"
else
    echo "$ENV_CONTAINER_FILE file not found!"
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build --no-cache -t wizling-web:latest . > build_log.txt 2>&1

# Check if the build was successful
if [ $? -eq 0 ]; then
    echo "Docker image built successfully."
else
    echo "Docker build failed. Check build_log.txt for details."
    # Restore the original .env file
    mv "$ENV_DIR/$ENV_BAK_FILE" "$ENV_DIR/$ENV_FILE"
    exit 1
fi

# Restore the original .env file
mv "$ENV_DIR/$ENV_BAK_FILE" "$ENV_DIR/$ENV_FILE"
echo "$ENV_BAK_FILE restored to $ENV_FILE"
