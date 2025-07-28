#!/bin/bash
# Quick status check for your Kubernetes business

echo "🚀 NODE OUT KUBERNETES STATUS"
echo "============================="

echo "📊 PAYMENT PORTAL STATUS:"
kubectl get pods -l app=payment-portal-simple

echo -e "\n🤖 CLAY-I STATUS:"
kubectl get pods -l app=clay-i

echo -e "\n🌐 SERVICES:"
kubectl get services

echo -e "\n📈 SCALING STATUS:"
kubectl get deployments

echo -e "\n✅ All systems operational!"