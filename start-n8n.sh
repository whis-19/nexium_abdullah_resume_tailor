#!/bin/bash

# n8n Resume AI Integration Startup Script

echo "🚀 Starting n8n Resume AI Integration..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local file not found. Creating from example..."
    if [ -f env.example ]; then
        cp env.example .env.local
        echo "📝 Please edit .env.local with your actual credentials"
    else
        echo "❌ env.example file not found. Please create .env.local manually."
        exit 1
    fi
fi

# Start n8n services
echo "🐳 Starting n8n services..."
docker-compose -f docker-compose.n8n.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.n8n.yml ps

# Show access information
echo ""
echo "✅ n8n Resume AI Integration is ready!"
echo ""
echo "📱 Resume App: http://localhost:3000"
echo "🤖 n8n Dashboard: http://localhost:5678"
echo "   Username: admin"
echo "   Password: resume_ai_2024"
echo ""
echo "📊 Queue Monitor: Available in the dashboard"
echo "📝 API Endpoints:"
echo "   - Webhook: http://localhost:3000/api/n8n/webhook"
echo "   - Queue Stats: http://localhost:3000/api/n8n/queue/stats"
echo ""
echo "🛑 To stop services: npm run n8n:stop"
echo "📋 To view logs: npm run n8n:logs"
echo "" 