#!/bin/bash

# GlobeTrotter Application Deployment Script

set -e

echo "🚀 Starting GlobeTrotter deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check for environment file
if [ ! -f .env ]; then
    print_warning "Environment file (.env) not found. Copying from example..."
    cp .env.production.example .env
    print_warning "Please update .env file with your production values before proceeding."
    print_warning "Press Enter to continue after updating .env, or Ctrl+C to exit..."
    read
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

print_status "Building Docker images..."

# Build and start services
if [ "$1" == "prod" ]; then
    print_status "Starting production deployment..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d
else
    print_status "Starting development deployment..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
fi

print_status "Waiting for services to start..."
sleep 10

# Check service health
print_status "Checking service health..."

# Check MongoDB
if docker-compose ps mongodb | grep -q "Up"; then
    print_status "✓ MongoDB is running"
else
    print_error "✗ MongoDB failed to start"
fi

# Check Server
if docker-compose ps server | grep -q "Up"; then
    print_status "✓ Server is running"
    # Test API health
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        print_status "✓ Server API is healthy"
    else
        print_warning "Server is running but API health check failed"
    fi
else
    print_error "✗ Server failed to start"
fi

# Check Client
if docker-compose ps client | grep -q "Up"; then
    print_status "✓ Client is running"
else
    print_error "✗ Client failed to start"
fi

print_status "Deployment complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   API Health: http://localhost:5000/health"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
echo ""
echo "🔄 To restart services:"
echo "   docker-compose restart"