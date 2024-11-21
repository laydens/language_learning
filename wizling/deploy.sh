#!/bin/bash

# Configuration Variables
PROJECT_ID="wizling"
SERVICE_NAME="djangocms"
REGION="us-central1"
CLOUD_SQL_INSTANCE="wizling-mysql"
DB_NAME="language_learning_cms"
DB_USER="cms_service"
DB_PASSWORD_SECRET="cms-service-password"
SERVICE_ACCOUNT="cloudrun-serviceaccount@wizling.iam.gserviceaccount.com"

# Derived variables
IMAGE_PATH="$REGION-docker.pkg.dev/$PROJECT_ID/$SERVICE_NAME/$SERVICE_NAME"
CLOUD_SQL_CONNECTION_NAME="$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE"

echo "🚀 Starting deployment..."

# Build and push the Docker image
echo "📦 Building and pushing Docker image..."
gcloud builds submit . --tag $IMAGE_PATH

# Deploy to Cloud Run
echo "🌩️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
 --image $IMAGE_PATH \
 --platform managed \
 --region $REGION \
 --allow-unauthenticated \
 --service-account $SERVICE_ACCOUNT \
 --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME \
 --set-env-vars "CMS_DB=$DB_NAME,DB_USER=$DB_USER,DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
 --set-secrets "DB_PASSWORD=$DB_PASSWORD_SECRET:latest"

echo "✅ Deployment complete!"