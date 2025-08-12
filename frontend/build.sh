#!/bin/bash

# Build script for Innovations Arena Frontend
# This script helps with Docker builds and troubleshooting

set -e

echo "🚀 Starting build process for Innovations Arena Frontend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "📦 npm version: $NPM_VERSION"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf node_modules
rm -rf out

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Build completed successfully!"

# Check build output
if [ -d ".next" ]; then
    echo "📁 Build output found in .next directory"
    echo "📊 Build size: $(du -sh .next | cut -f1)"
else
    echo "❌ Build output not found"
    exit 1
fi

echo "🎉 Build process completed successfully!"
echo "🚀 You can now run 'npm start' to start the production server"
echo "🐳 Or use 'docker build .' to build the Docker image"
