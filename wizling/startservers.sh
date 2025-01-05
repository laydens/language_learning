#!/bin/sh

# start_nginx_gunicorn.sh
# Start Nginx and Gunicorn with logging

# Define log file
LOG_FILE="/var/log/start_nginx_gunicorn.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

# Check log file size and truncate if it exceeds 10MB
if [ -f "$LOG_FILE" ] && [ $(stat -c%s "$LOG_FILE") -gt 10485760 ]; then
    echo "Log file is too large, truncating..." >> "$LOG_FILE"
    > "$LOG_FILE"  # Truncate the log file
fi

# Start Nginx
log "Starting Nginx..."
if service nginx start; then
    log "Nginx started successfully."
else
    log "Failed to start Nginx."
    exit 1
fi

# Start Gunicorn
log "Starting Gunicorn..."
if exec gunicorn --bind 0.0.0.0:8080 --log-level debug wizling.wsgi:application; then
    log "Gunicorn started successfully."
else
    log "Failed to start Gunicorn."
    exit 1
fi

# After starting Nginx, verify the static files directory
log "Verifying static files directory..."
if [ -d "/app/staticfiles" ]; then
    log "Static files directory exists. Contents:"
    ls -la /app/staticfiles >> $LOG_FILE
else
    log "Static files directory not found!"
    exit 1
fi
