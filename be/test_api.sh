#!/bin/bash

# Simple script to test the Prayer Request API
API_BASE="http://localhost:8080"

echo "🚀 Testing Prayer Request API"
echo "=============================="

# Test health endpoint
echo "1. Testing health endpoint..."
response=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE/health")
if [ "$response" = "200" ]; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed (HTTP $response)"
    exit 1
fi

# Test get prayers (empty initially)
echo "2. Testing GET /api/v1/prayers..."
curl -s "$API_BASE/api/v1/prayers" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ GET prayers endpoint working"
else
    echo "   ❌ GET prayers endpoint failed"
fi

# Test create prayer
echo "3. Testing POST /api/v1/prayers..."
prayer_data='{
    "title": "Test Prayer Request",
    "description": "Please pray for my family and health",
    "user_name": "Test User",
    "is_anonymous": false,
    "priority": "medium",
    "category": "health",
    "tags": ["health", "family"]
}'

response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "$prayer_data" \
    -o /dev/null \
    "$API_BASE/api/v1/prayers")

if [ "$response" = "201" ]; then
    echo "   ✅ POST prayers endpoint working"
else
    echo "   ❌ POST prayers endpoint failed (HTTP $response)"
fi

# Test get users
echo "4. Testing GET /api/v1/users..."
curl -s "$API_BASE/api/v1/users" | jq '.' > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✅ GET users endpoint working"
else
    echo "   ❌ GET users endpoint failed"
fi

echo ""
echo "🎉 API testing completed!"
echo ""
echo "💡 Tips:"
echo "   - Start MongoDB: make docker-up"
echo "   - Start API: make dev"
echo "   - View MongoDB: http://localhost:8081" 