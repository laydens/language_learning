#!/bin/bash

# Configuration Variables
PROJECT_ID="wizling"
SERVICE_NAME="djangocms"
REGION="us-central1"
CLOUD_SQL_INSTANCE="wizling-mysql"
CMS_DB="language_learning_cms"
CMS_DB_USER="cms_service"
CMS_DB_PASSWORD_SECRET="cms-service-password"
SERVICE_ACCOUNT="cloudrun-serviceaccount@wizling.iam.gserviceaccount.com"
LANGUAGE_LEARNING_DB='language_learning'
LANGUAGE_LEARNING_DB_USER='lang_user'
LANGUAGE_LEARNING_DB_PASSWORD='lang-db-password'

# Domain Configuration
CLOUD_RUN_DOMAIN="djangocms-649684198786.us-central1.run.app"

# Derived variables
IMAGE_PATH="$REGION-docker.pkg.dev/$PROJECT_ID/$SERVICE_NAME/$SERVICE_NAME"
CLOUD_SQL_CONNECTION_NAME="$PROJECT_ID:$REGION:$CLOUD_SQL_INSTANCE"

echo "🚀 Starting deployment..."

# Build and push the Docker image
echo "📦 Building and pushing Docker image..."
gcloud builds submit . --tag $IMAGE_PATH

# Deploy to Cloud Run with additional logging
echo "🌩️  Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --region $REGION \
  --image $IMAGE_PATH \
  --platform managed \
  --update-env-vars "ALLOWED_HOSTS=$CLOUD_RUN_DOMAIN wizling.com" \
  --update-env-vars "CMS_DB=$CMS_DB" \
  --update-env-vars "CMS_DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
  --update-env-vars "CMS_DB_USER=$CMS_DB_USER" \
  --update-env-vars "LANGUAGE_LEARNING_DB=$LANGUAGE_LEARNING_DB" \
  --update-env-vars "LANGUAGE_LEARNING_DB_HOST=/cloudsql/$CLOUD_SQL_CONNECTION_NAME" \
  --update-env-vars "LANGUAGE_LEARNING_DB_USER=$LANGUAGE_LEARNING_DB_USER" \
  --set-secrets "CMS_DB_PASSWORD=$CMS_DB_PASSWORD_SECRET:latest" \
  --set-secrets "LANGUAGE_LEARNING_DB_PASSWORD=$LANGUAGE_LEARNING_DB_PASSWORD_SECRET:latest" \
  --add-cloudsql-instances $CLOUD_SQL_CONNECTION_NAME

# Add deployment verification
echo "Verifying deployment..."
gcloud run services describe $SERVICE_NAME --platform managed --region $REGION

# Check logs if deployment fails
echo "To view logs, run:"
echo "gcloud logs read --project=$PROJECT_ID --filter='resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME' --limit=50"

# Set the latest revision to receive all traffic
echo "🔄 Setting the latest revision to receive all traffic..."
gcloud run services update-traffic $SERVICE_NAME \
 --to-latest \
 --platform managed \
 --region $REGION

echo "http://wizling.com"
echo "✅ Deployment complete!"