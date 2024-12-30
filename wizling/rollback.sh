#!/bin/bash

# Configuration Variables
PROJECT_ID="wizling"  # Your Google Cloud project ID
SERVICE_NAME="djangocms"  # Your Cloud Run service name
REGION="us-central1"  # Your Google Cloud region

# Function to list revisions with their last updated times in a readable format
list_revisions() {
    echo "Fetching revisions for service: $SERVICE_NAME in region: $REGION..."
    gcloud run revisions list --service "$SERVICE_NAME" --region "$REGION" \
        --format="json" | python3 -c '
import sys, json
from datetime import datetime

try:
    import pytz
    USE_PYTZ = True
except ImportError:
    USE_PYTZ = False

def time_ago(dt):
    try:
        if USE_PYTZ:
            now = datetime.now(pytz.UTC)
        else:
            now = datetime.utcnow()
            dt = dt.replace(tzinfo=None)  # Strip timezone for comparison if using basic datetime
            
        diff = now - dt
        days = diff.days
        hours = diff.seconds // 3600
        minutes = (diff.seconds % 3600) // 60
        
        if days > 0:
            return f"{days}d ago"
        elif hours > 0:
            return f"{hours}h ago"
        else:
            return f"{minutes}m ago"
    except Exception as e:
        return "unknown"  # Fallback if time calculation fails

def parse_timestamp(timestamp_str):
    try:
        dt = datetime.strptime(timestamp_str, "%Y-%m-%dT%H:%M:%S.%fZ")
        if USE_PYTZ:
            return dt.replace(tzinfo=pytz.UTC)
        return dt
    except Exception as e:
        return datetime.utcnow()  # Fallback if parsing fails

data = json.load(sys.stdin)
print("┌─────────────────────┬─────────────────────────────┬───────────┐")
print("│       REVISION      │      CREATION_TIMESTAMP     │ TIME AGO  │")
print("├─────────────────────┼─────────────────────────────┼───────────┤")

try:
    sorted_data = sorted(data, key=lambda x: x["metadata"]["creationTimestamp"], reverse=True)
    for revision in sorted_data:
        name = revision["metadata"]["name"]
        timestamp = revision["metadata"]["creationTimestamp"]
        dt = parse_timestamp(timestamp)
        ago = time_ago(dt)
        print(f"│ {name:<17} │ {timestamp:<25} │ {ago:<9} │")
except Exception as e:
    print("│ Error processing data. Falling back to basic output...      │")
    for revision in data:
        try:
            name = revision["metadata"]["name"]
            timestamp = revision["metadata"]["creationTimestamp"]
            print(f"│ {name:<17} │ {timestamp:<25} │         │")
        except:
            continue

print("└─────────────────────┴─────────────────────────────┴───────────┘")
'
}

# Function to roll back to the previous revision (unchanged)
rollback_revision() {
    local revision_name=$1
    echo "Attempting to roll back to revision: $revision_name..."
    
    # Deploy the previous revision
    if gcloud run deploy "$SERVICE_NAME" --revision "$revision_name" --region "$REGION" --platform managed --quiet; then
        echo "✅ Rollback to revision '$revision_name' completed successfully."
    else
        echo "❌ Rollback to revision '$revision_name' failed. Please check the logs for more details."
        exit 1
    fi
}

# Main script execution (unchanged)
list_revisions

# Prompt user for rollback
read -p "Do you want to roll back to the previous version? (y/n): " choice

if [[ "$choice" == "y" ]]; then
    # Get the previous revision name
    previous_revision=$(gcloud run revisions list --service "$SERVICE_NAME" --region "$REGION" --format="value(name)" --limit=2 --sort-by="~createTime" | sed -n '2p')

    if [ -z "$previous_revision" ]; then
        echo "❌ No previous revision found. Exiting."
        exit 1
    fi

    echo "Previous revision identified: $previous_revision"
    rollback_revision "$previous_revision"
else
    echo "No rollback performed. Exiting."
fi