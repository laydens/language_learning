FROM --platform=linux/amd64 python:3.10-slim

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config

WORKDIR /app

# Install gunicorn and python-dotenv first
RUN pip install gunicorn python-dotenv

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY manage.py .
COPY wizling ./wizling
COPY media ./media

# Create static files directory
RUN mkdir -p staticfiles

# Set environment variable for static files collection
ENV PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=wizling.settings \
    STATIC_ROOT=/app/staticfiles

# Collect static files
RUN python manage.py collectstatic --noinput --clear

# Make sure static files are accessible
RUN chmod -R 755 /app/staticfiles

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "wizling.wsgi:application"]