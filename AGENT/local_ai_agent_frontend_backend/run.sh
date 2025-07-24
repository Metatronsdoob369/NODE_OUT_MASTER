#!/bin/bash

echo "🔧 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "🚀 Starting backend on port 5002..."
cd backend
uvicorn agent_supernode:app --reload --port 5002
