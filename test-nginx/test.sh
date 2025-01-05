#!/bin/bash

# Build and run the test container
docker build -t nginx-test .
docker run -d --name nginx-test -p 8081:80 nginx-test

echo "Waiting for Nginx to start..."
sleep 2

# Test static file serving
echo "\nTesting static file access..."
curl -v http://localhost:8081/static/test.css

# Test directory listing
echo "\nTesting directory listing..."
curl -v http://localhost:8081/static/

# Check Nginx logs
echo "\nChecking Nginx logs..."
docker exec nginx-test tail -f /var/log/nginx/access.log &
docker exec nginx-test tail -f /var/log/nginx/error.log &

# Print container logs
echo "\nContainer logs:"
docker logs nginx-test

# Provide instructions for manual testing
echo "\nContainer is running on http://localhost:8081"
echo "You can manually test the following URLs:"
echo "- http://localhost:8081/static/test.css"
echo "- http://localhost:8081/static/"
echo "- http://localhost:8081/health"
echo "\nTo check logs in real-time:"
echo "docker exec nginx-test tail -f /var/log/nginx/access.log"
echo "docker exec nginx-test tail -f /var/log/nginx/error.log"
echo "\nTo stop the container:"
echo "docker stop nginx-test && docker rm nginx-test" 