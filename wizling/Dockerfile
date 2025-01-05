# Stage 1: Build the React app
FROM node:14-alpine AS build

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json to leverage caching
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN echo "Installing frontend dependencies..." && \
    npm install && \
    echo "Frontend dependencies installed."

# Copy the rest of the frontend files
COPY frontend/ ./

# Build the React app
RUN echo "Building the React app..." && \
    npm run build && \
    echo "React app built successfully."

# Verify the build output
RUN echo "Verifying build output..." && \
    ls -la /app/build && \
    echo "Build output verified."

# Stage 2: Build the Django app
FROM python:3.10-slim AS backend

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN echo "Installing system dependencies..." && \
    apt-get update && \
    apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    nginx && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    echo "System dependencies installed."

# Copy only requirements.txt to leverage caching
COPY requirements.txt ./

# Install Python dependencies
RUN echo "Installing Python dependencies..." && \
    pip install --no-cache-dir -r requirements.txt && \
    echo "Python dependencies installed."

# Copy only the necessary built React app files from the build stage
COPY --from=build /app/build/static /app/staticfiles/static
COPY --from=build /app/build/asset-manifest.json /app/staticfiles/
COPY --from=build /app/build/favicon.ico /app/staticfiles/
COPY --from=build /app/build/index.html /app/staticfiles/
COPY --from=build /app/build/manifest.json /app/staticfiles/
COPY --from=build /app/build/robots.txt /app/staticfiles/

# Copy the Django application code
COPY wizling /app/wizling
COPY api /app/api
COPY manage.py /app/

# Create necessary directories
RUN echo "Creating necessary directories..." && \
    mkdir -p /app/staticfiles /app/logs && \
    touch /app/logs/django.log && \
    chmod 666 /app/logs/django.log && \
    echo "Directories created."

# Collect static files
RUN echo "Collecting static files..." && \
    python manage.py collectstatic --noinput && \
    echo "Static files collected."

# Verify the contents of the staticfiles directory
RUN echo "Verifying static files..." && \
    ls -la /app/staticfiles && \
    echo "Static files verified."

# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the ports for both Gunicorn and Nginx
EXPOSE 8080 80

# Copy the start script into the container
COPY startservers.sh /startservers.sh

# Make the script executable
RUN chmod +x /startservers.sh

# Use the script as the command to run when the container starts
CMD ["/startservers.sh"]