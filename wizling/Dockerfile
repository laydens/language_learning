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

# Don't copy .env or prod.env
COPY manage.py .
COPY wizling ./wizling
COPY media ./media

ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "--bind", "0.0.0.0:8080", "wizling.wsgi:application"]
