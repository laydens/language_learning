#!/bin/bash

# Configuration
ZONE_NAME="wizling-dns"  # Updated to match your existing zone name
DOMAIN="wizling.com"

# Add SendGrid DNS records
echo "Adding SendGrid DNS records..."

# CNAME records
gcloud dns record-sets create "url4839.$DOMAIN" \
    --rrdatas="sendgrid.net." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

gcloud dns record-sets create "25940090.$DOMAIN" \
    --rrdatas="sendgrid.net." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

gcloud dns record-sets create "em7733.$DOMAIN" \
    --rrdatas="u25940090.wl091.sendgrid.net." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

gcloud dns record-sets create "s1._domainkey.$DOMAIN" \
    --rrdatas="s1.domainkey.u25940090.wl091.sendgrid.net." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

gcloud dns record-sets create "s2._domainkey.$DOMAIN" \
    --rrdatas="s2.domainkey.u25940090.wl091.sendgrid.net." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

# TXT record
gcloud dns record-sets create "_dmarc.$DOMAIN" \
    --rrdatas="\"v=DMARC1; p=none;\"" \
    --type=TXT --ttl=3600 --zone=$ZONE_NAME

echo "✅ DNS records added successfully!"

# Optional: Verify records
echo "Verifying records..."
gcloud dns record-sets list --zone=$ZONE_NAME 