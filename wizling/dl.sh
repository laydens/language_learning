#!/bin/bash

# dep_local.sh
# Start the Django application locally

echo "Starting Django application on port 8000..."
python manage.py runserver 0.0.0.0:8000
