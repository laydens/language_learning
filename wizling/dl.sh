# Start the Django application locally
#!/bin/bash
# dl.sh

echo "Starting Django application on port 8000..."
python manage.py runserver 0.0.0.0:8000


gcloud run services update djangocms \
    --region us-central1 \
