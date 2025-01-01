#!/bin/bash

# Essential Configuration Variables
PROJECT_ID="wizling"
SERVICE_NAME="djangocms"
REGION="us-central1"
CLOUD_SQL_INSTANCE="wizling-mysql"
CLOUD_SQL_CONNECTION_NAME="$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment..."

# Tag the existing wizling image for GCR
echo "🏷️  Tagging existing image..."
docker tag wizling:latest $IMAGE_NAME

# Push the container to Google Container Registry
echo "📤 Pushing to Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run with only cloud-specific configuration
echo "🌩️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --region $REGION \
  --image $IMAGE_NAME \
  --platform managed \
  --update-env-vars "ALLOWED_HOSTS=$CLOUD_RUN_DOMAIN wizling.com" \
  --update-env-vars "CMS_DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
  --update-env-vars "LANGUAGE_LEARNING_DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
  --set-secrets "CMS_DB_PASSWORD=cms-service-password:latest" \
  --set-secrets "LANGUAGE_LEARNING_DB_PASSWORD=lang-db-password:latest" \
  --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME

echo "http://wizling.com"
echo "✅ Deployment complete!"
