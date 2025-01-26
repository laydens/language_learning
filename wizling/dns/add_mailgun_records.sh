#!/bin/bash

# Configuration
ZONE_NAME="wizling-dns"
DOMAIN="wizling.com"

echo "Adding Mailgun DNS records..."

# Update SPF record (note: this replaces the existing SPF record)
gcloud dns record-sets update "$DOMAIN." \
    --rrdatas="\"v=spf1 include:mailgun.org ~all\"" \
    --type=TXT --ttl=300 --zone=$ZONE_NAME

# Add DKIM records
gcloud dns record-sets create "pdk1._domainkey.$DOMAIN." \
    --rrdatas="pdk1._domainkey.217167.dkim2.us.mgsend.org." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

gcloud dns record-sets create "pdk2._domainkey.$DOMAIN." \
    --rrdatas="pdk2._domainkey.217167.dkim2.us.mgsend.org." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

# Add MX records
gcloud dns record-sets create "$DOMAIN." \
    --rrdatas="10 mxa.mailgun.org.,10 mxb.mailgun.org." \
    --type=MX --ttl=3600 --zone=$ZONE_NAME

# Add email subdomain
gcloud dns record-sets create "email.$DOMAIN." \
    --rrdatas="mailgun.org." \
    --type=CNAME --ttl=3600 --zone=$ZONE_NAME

echo "✅ DNS records added successfully!"

# Verify records
echo "Verifying records..."
gcloud dns record-sets list --zone=$ZONE_NAME --filter="type=MX OR type=CNAME OR type=TXT" 