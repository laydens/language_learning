# Stage 1: Build the React app
FROM node:14-alpine AS build

WORKDIR /app
COPY . .
RUN echo "Stage: build - Current directory: $(pwd)"
RUN echo "Stage: build - Files in current directory:"
RUN ls -la

WORKDIR /app/frontend
RUN echo "Stage: build - Installing frontend dependencies"
RUN npm install
RUN echo "Stage: build - Frontend dependencies installed"
RUN echo "Stage: build - Building frontend"
RUN npm run build
RUN echo "Stage: build - Frontend built"
RUN echo "Stage: build - Files in build directory:"
RUN ls -la /app/frontend/build
RUN find /app/frontend/build -name "asset-manifest.json"

# Stage 2: Build the Django app
FROM python:3.10-slim AS backend

WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN echo "Stage: backend - Installing Python dependencies"
RUN pip install --no-cache-dir -r requirements.txt gunicorn
RUN echo "Stage: backend - Python dependencies installed"

COPY manage.py .
COPY wizling ./wizling
COPY api ./api

RUN mkdir -p /app/staticfiles /app/logs
RUN touch /app/logs/django.log
RUN chmod 666 /app/logs/django.log

RUN echo "Stage: backend - Before COPY - Current directory: $(pwd)"
RUN echo "Stage: backend - Before COPY - Files in current directory:"
RUN ls -la
RUN find /app -name "asset-manifest.json"

COPY --from=build /app/frontend/build/static /app/staticfiles/
COPY --from=build /app/frontend/build/asset-manifest.json /app/staticfiles/
COPY --from=build /app/frontend/build/favicon.ico /app/staticfiles/
COPY --from=build /app/frontend/build/index.html /app/staticfiles/
COPY --from=build /app/frontend/build/manifest.json /app/staticfiles/
COPY --from=build /app/frontend/build/robots.txt /app/staticfiles/  

RUN echo "Stage: backend - After COPY - Current directory: $(pwd)"
RUN echo "Stage: backend - After COPY - Files in /app/staticfiles:"
RUN ls -la /app/staticfiles/
RUN find /app/staticfiles/ -name "asset-manifest.json"

RUN echo "Stage: backend - Creating timestamp file"
RUN echo "Container built at: $(date)" > /app/staticfiles/timestamp.txt
RUN echo "Stage: backend - Timestamp file created"

RUN echo "Stage: backend - After timestamp creation - Files in /app/staticfiles:"
RUN ls -la /app/staticfiles/
RUN cat /app/staticfiles/timestamp.txt

RUN echo "Stage: backend - Running collectstatic"
RUN python manage.py collectstatic --noinput
RUN echo "Stage: backend - collectstatic completed"

RUN echo "Stage: backend - After collectstatic - Files in /app/staticfiles:"
RUN ls -la /app/staticfiles/

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--log-level", "debug", "wizling.wsgi:application"]