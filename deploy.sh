#!/bin/bash

# MechaCrew Production Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🚀 MechaCrew Production Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

echo "🔍 Checking project status..."
vercel whoami

# Build the project locally first
echo "🏗️  Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up environment variables in Vercel dashboard:"
    echo "   - OPENAI_API_KEY"
    echo "   - NEON_DATABASE_URL"
    echo "   - CLERK_PUBLISHABLE_KEY (optional)"
    echo "   - CLERK_SECRET_KEY (optional)"
    echo ""
    echo "2. Run database schema in Neon:"
    echo "   - Copy contents of database/schema.sql"
    echo "   - Execute in Neon SQL editor"
    echo ""
    echo "3. Test your deployment!"
    echo ""
    echo "🔗 Your app should be live at the URL shown above."
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
