#!/bin/bash

# Configuration Variables
SERVICE_NAME="djangocms"  # Your Cloud Run service name
REGION="us-central1"  # Your Google Cloud region

# Function to roll back to the previous revision
rollback_to_previous() {
    echo "Fetching revisions for service: $SERVICE_NAME in region: $REGION..."

    # Get the previous successful revision's name
    previous_revision=$(gcloud run revisions list \
        --service "$SERVICE_NAME" \
        --region "$REGION" \
        --sort-by=~metadata.creationTimestamp \
        --filter="status.conditions.type=Ready AND status.conditions.status=True" \
        --format="value(metadata.name)" \
        | sed -n '2p')

    if [ -z "$previous_revision" ]; then
        echo "❌ No previous successful revision found. Exiting."
        exit 1
    fi

    echo "Rolling back to previous successful revision: $previous_revision..."

    # Update traffic to point 100% to the previous revision
    if gcloud run services update-traffic "$SERVICE_NAME" \
        --region "$REGION" \
        --platform managed \
        --to-revisions="${previous_revision}=100" \
        --quiet; then
        echo "✅ Rollback completed successfully. Traffic redirected to $previous_revision"
    else
        echo "❌ Rollback failed. Please check the logs for more details."
        exit 1
    fi
}

# Main script execution
rollback_to_previous