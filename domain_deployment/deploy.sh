#!/bin/bash
# Quick deployment script for stormrepairpro.com

echo "🚀 Deploying to stormrepairpro.com..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    git remote add origin https://github.com/YOUR_USERNAME/stormrepairpro-com-storm-portal.git
fi

# Deploy
git add .
git commit -m "Update storm portal - $(date)"
git push origin main

echo "✅ Deployed to GitHub Pages"
echo "🌐 Visit: https://stormrepairpro.com"
echo "⏱️  Allow 5-10 minutes for DNS propagation"
