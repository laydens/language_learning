#!/bin/bash

# Configuration Variables
PROJECT_ID="wizling"
SERVICE_NAME="djangocms"
REGION="us-central1"
CLOUD_SQL_INSTANCE="wizling-mysql"
CLOUD_SQL_CONNECTION_NAME="$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE"
IMAGE_PATH="us-central1-docker.pkg.dev/$PROJECT_ID/$SERVICE_NAME/$SERVICE_NAME"

echo "🚀 Starting deployment..."
# Rename .env.production.off to .env.production for deployment
if [ -f wizling/frontend/.env.production.off ]; then
    mv wizling/frontend/.env.production.off wizling/frontend/.env.production
    echo "Renamed .env.production.off to .env.production"
else
    echo ".env.production.off not found!"
    exit 1
fi

# Build and push the Docker image
echo "📦 Building and pushing Docker image..."
gcloud builds submit . --tag $IMAGE_PATH

# Deploy to Cloud Run
echo "🌩️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --region $REGION \
  --image $IMAGE_PATH \
  --platform managed \
  --service-account cloudrun-serviceaccount@wizling.iam.gserviceaccount.com \
  --update-env-vars "ALLOWED_HOSTS=djangocms-649684198786.us-central1.run.app wizling.com" \
  --update-env-vars "CMS_DB=language_learning_cms" \
  --update-env-vars "CMS_DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
  --update-env-vars "CMS_DB_USER=cms_service" \
  --update-env-vars "LANGUAGE_LEARNING_DB=language_learning" \
  --update-env-vars "LANGUAGE_LEARNING_DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
  --update-env-vars "LANGUAGE_LEARNING_DB_USER=lang_user" \
  --set-secrets "CMS_DB_PASSWORD=cms-service-password:latest" \
  --set-secrets "LANGUAGE_LEARNING_DB_PASSWORD=lang-db-password:latest" \
  --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME

# Rename .env.production back to .env.production.off after deployment
mv wizling/frontend/.env.production wizling/frontend/.env.production.off
echo "Renamed .env.production back to .env.production.off"

echo "✅ Deployment complete!"