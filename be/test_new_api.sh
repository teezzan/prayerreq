#!/bin/bash

# Test script for new Prayer Request API endpoints
API_BASE="http://localhost:8080"

echo "🚀 Testing New Prayer Request API Endpoints"
echo "============================================"

# Test health endpoint first
echo "0. Testing health endpoint..."
response=$(curl -s -w "%{http_code}" -o /dev/null "$API_BASE/health")
if [ "$response" = "200" ]; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed (HTTP $response)"
    exit 1
fi

# Test basic prayers endpoint
echo "1. Testing GET /api/v1/prayers..."
curl -s "$API_BASE/api/v1/prayers" > /dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ Basic prayers endpoint working"
else
    echo "   ❌ Basic prayers endpoint failed"
fi

# Test stats endpoint
echo "2. Testing GET /api/v1/prayers/stats..."
response=$(curl -s -w "%{http_code}" "$API_BASE/api/v1/prayers/stats" -o /tmp/stats_response.json)
echo "   Response code: $response"
if [ -f /tmp/stats_response.json ]; then
    echo "   Response body:"
    cat /tmp/stats_response.json
    echo ""
fi

# Test recent prayers
echo "3. Testing GET /api/v1/prayers/recent..."
response=$(curl -s -w "%{http_code}" "$API_BASE/api/v1/prayers/recent?limit=5" -o /tmp/recent_response.json)
echo "   Response code: $response"
if [ -f /tmp/recent_response.json ]; then
    echo "   Response body:"
    cat /tmp/recent_response.json
    echo ""
fi

# Test search
echo "4. Testing GET /api/v1/prayers/search..."
response=$(curl -s -w "%{http_code}" "$API_BASE/api/v1/prayers/search?q=health" -o /tmp/search_response.json)
echo "   Response code: $response"
if [ -f /tmp/search_response.json ]; then
    echo "   Response body:"
    cat /tmp/search_response.json
    echo ""
fi

# Test category
echo "5. Testing GET /api/v1/prayers/category/health..."
response=$(curl -s -w "%{http_code}" "$API_BASE/api/v1/prayers/category/health" -o /tmp/category_response.json)
echo "   Response code: $response"
if [ -f /tmp/category_response.json ]; then
    echo "   Response body:"
    cat /tmp/category_response.json
    echo ""
fi

echo "🎉 New API endpoint testing completed!" 