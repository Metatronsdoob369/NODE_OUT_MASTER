# ⚡ NODE OUT KUBERNETES - QUICK DEPLOY SCRIPTS

## 🚀 **ONE-COMMAND DEPLOYMENT**

### **Complete Cluster Setup**
```bash
#!/bin/bash
# deploy-nodeout-cluster.sh

echo "🚀 Deploying NODE OUT Kubernetes Cluster..."

# 1. Create namespaces
kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: payments
---
apiVersion: v1
kind: Namespace
metadata:
  name: ai-agents
---
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
EOF

# 2. Deploy secrets
kubectl create secret generic node-out-secrets \
  --namespace=production \
  --from-literal=stripe-secret-key="$STRIPE_SECRET_KEY" \
  --from-literal=firebase-key="$FIREBASE_KEY" \
  --from-literal=openai-api-key="$OPENAI_API_KEY"

# 3. Deploy payment portal
kubectl apply -f payment-portal-deployment.yaml
kubectl apply -f payment-portal-service.yaml
kubectl apply -f payment-portal-hpa.yaml

# 4. Deploy AI agents
kubectl apply -f clay-i-deployment.yaml
kubectl apply -f pathsassin-deployment.yaml

# 5. Deploy storm response
kubectl apply -f storm-response-deployment.yaml

# 6. Configure ingress
kubectl apply -f node-out-ingress.yaml

echo "✅ NODE OUT Cluster Deployed Successfully!"
echo "🌐 Access at: https://node-storm.com"
```

### **Storm Event Emergency Scale**
```bash
#!/bin/bash
# emergency-scale.sh

echo "🌪️ ACTIVATING STORM RESPONSE MODE..."

# Scale payment portal for high traffic
kubectl scale deployment payment-portal --replicas=10 -n payments

# Scale storm response API
kubectl scale deployment storm-response-api --replicas=20 -n production

# Scale AI agents for increased demand
kubectl scale deployment clay-i-server --replicas=5 -n ai-agents
kubectl scale deployment pathsassin-engine --replicas=8 -n ai-agents

# Enable burst capacity
kubectl patch hpa storm-response-hpa -n production -p '{"spec":{"maxReplicas":50}}'

echo "⚡ STORM RESPONSE MODE ACTIVATED"
echo "📊 Monitor at: kubectl get pods --all-namespaces"
```

## 🎯 **DEVELOPMENT WORKFLOW**

### **Local Development with Minikube**
```bash
#!/bin/bash
# dev-setup.sh

# Start minikube with sufficient resources
minikube start --memory=8192 --cpus=4 --driver=docker

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server

# Deploy development version
kubectl apply -f dev-namespace.yaml
kubectl apply -f dev-configmap.yaml

# Port forward for local testing
kubectl port-forward service/payment-portal-dev 3000:80 -n dev &
kubectl port-forward service/clay-i-dev 8000:8000 -n dev &

echo "🛠️ Development environment ready!"
echo "💳 Payment Portal: http://localhost:3000"
echo "🤖 Clay-I API: http://localhost:8000"
```

### **Hot Reload for Development**
```bash
#!/bin/bash
# hot-reload.sh

# Build and push new image
docker build -t nodeout/payment-portal:dev-$(git rev-parse --short HEAD) .
docker push nodeout/payment-portal:dev-$(git rev-parse --short HEAD)

# Rolling update with new image
kubectl set image deployment/payment-portal-dev \
  payment-portal=nodeout/payment-portal:dev-$(git rev-parse --short HEAD) \
  -n dev

# Watch rollout status
kubectl rollout status deployment/payment-portal-dev -n dev

echo "🔄 Hot reload complete!"
```

## 🔧 **MAINTENANCE SCRIPTS**

### **Health Check Dashboard**
```bash
#!/bin/bash
# health-check.sh

echo "🏥 NODE OUT CLUSTER HEALTH CHECK"
echo "================================"

# Cluster overview
echo "📊 CLUSTER STATUS:"
kubectl cluster-info

echo -e "\n🏷️ NAMESPACE STATUS:"
kubectl get namespaces

echo -e "\n📦 POD STATUS:"
kubectl get pods --all-namespaces | grep -E "(payment|clay-i|pathsassin|storm)"

echo -e "\n⚖️ RESOURCE USAGE:"
kubectl top nodes
kubectl top pods --all-namespaces | head -10

echo -e "\n🚨 RECENT EVENTS:"
kubectl get events --all-namespaces --sort-by='.lastTimestamp' | tail -10

echo -e "\n🔄 HPA STATUS:"
kubectl get hpa --all-namespaces

echo -e "\n🌐 INGRESS STATUS:"
kubectl get ingress --all-namespaces

echo -e "\n✅ Health check complete!"
```

### **Automated Backup**
```bash
#!/bin/bash
# backup-cluster.sh

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backups/nodeout-k8s-$BACKUP_DATE"

mkdir -p $BACKUP_DIR

echo "💾 Backing up NODE OUT Kubernetes configuration..."

# Backup all deployments
kubectl get deployments --all-namespaces -o yaml > $BACKUP_DIR/deployments.yaml

# Backup all services
kubectl get services --all-namespaces -o yaml > $BACKUP_DIR/services.yaml

# Backup all configmaps
kubectl get configmaps --all-namespaces -o yaml > $BACKUP_DIR/configmaps.yaml

# Backup all ingress
kubectl get ingress --all-namespaces -o yaml > $BACKUP_DIR/ingress.yaml

# Backup persistent volumes
kubectl get pv -o yaml > $BACKUP_DIR/persistent-volumes.yaml

# Compress backup
tar -czf "nodeout-k8s-backup-$BACKUP_DATE.tar.gz" -C /backups "nodeout-k8s-$BACKUP_DATE"

echo "✅ Backup complete: nodeout-k8s-backup-$BACKUP_DATE.tar.gz"
```

## 🚀 **SCALING AUTOMATION**

### **Auto-Scale Based on Time**
```bash
#!/bin/bash
# time-based-scaling.sh

HOUR=$(date +%H)

if [ $HOUR -ge 8 ] && [ $HOUR -le 18 ]; then
    # Business hours - scale up
    echo "☀️ Business hours scaling..."
    kubectl scale deployment payment-portal --replicas=8 -n payments
    kubectl scale deployment storm-response-api --replicas=6 -n production
else
    # Off hours - scale down
    echo "🌙 Off-hours scaling..."
    kubectl scale deployment payment-portal --replicas=3 -n payments
    kubectl scale deployment storm-response-api --replicas=2 -n production
fi

echo "⚖️ Time-based scaling complete!"
```

### **Load Test Preparation**
```bash
#!/bin/bash
# prep-load-test.sh

echo "🧪 Preparing for load testing..."

# Pre-scale all services
kubectl scale deployment payment-portal --replicas=15 -n payments
kubectl scale deployment storm-response-api --replicas=10 -n production
kubectl scale deployment clay-i-server --replicas=8 -n ai-agents

# Increase HPA limits
kubectl patch hpa payment-portal-hpa -n payments -p '{"spec":{"maxReplicas":30}}'
kubectl patch hpa storm-response-hpa -n production -p '{"spec":{"maxReplicas":25}}'

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=payment-portal -n payments --timeout=300s
kubectl wait --for=condition=ready pod -l app=storm-response -n production --timeout=300s

echo "✅ Load test preparation complete!"
echo "🚀 Ready for maximum traffic!"
```

## 🔍 **MONITORING SHORTCUTS**

### **Quick Metrics**
```bash
#!/bin/bash
# quick-metrics.sh

echo "📊 NODE OUT QUICK METRICS"
echo "========================"

# Payment success rate
echo "💳 PAYMENT METRICS:"
kubectl exec -n monitoring deployment/prometheus -- \
  promtool query instant 'rate(payment_success_total[5m])/rate(payment_attempts_total[5m])'

# Response times
echo -e "\n⚡ RESPONSE TIMES:"
kubectl exec -n monitoring deployment/prometheus -- \
  promtool query instant 'histogram_quantile(0.95, http_request_duration_seconds_bucket)'

# Resource usage
echo -e "\n🖥️ RESOURCE USAGE:"
kubectl top pods --all-namespaces --sort-by=cpu | head -5

echo -e "\n💰 COST ESTIMATE:"
kubectl get nodes -o custom-columns=NAME:.metadata.name,INSTANCE:.metadata.labels.beta\.kubernetes\.io/instance-type
```

### **Real-Time Logs**
```bash
#!/bin/bash
# live-logs.sh

echo "📺 Starting live log monitoring..."

# Multi-tail key services
kubectl logs -f deployment/payment-portal -n payments &
kubectl logs -f deployment/clay-i-server -n ai-agents &
kubectl logs -f deployment/storm-response-api -n production &

# Wait for all background processes
wait

echo "📺 Live log monitoring stopped"
```

## ⚡ **EMERGENCY PROCEDURES**

### **Rollback Deployment**
```bash
#!/bin/bash
# emergency-rollback.sh

SERVICE=$1
NAMESPACE=$2

if [ -z "$SERVICE" ] || [ -z "$NAMESPACE" ]; then
    echo "Usage: ./emergency-rollback.sh <service> <namespace>"
    exit 1
fi

echo "🚨 EMERGENCY ROLLBACK: $SERVICE in $NAMESPACE"

# Rollback to previous version
kubectl rollout undo deployment/$SERVICE -n $NAMESPACE

# Check rollback status
kubectl rollout status deployment/$SERVICE -n $NAMESPACE

echo "✅ Rollback complete for $SERVICE"
```

### **Circuit Breaker Activation**
```bash
#!/bin/bash
# circuit-breaker.sh

echo "🔴 ACTIVATING CIRCUIT BREAKER MODE"

# Scale down problematic services
kubectl scale deployment payment-portal --replicas=1 -n payments

# Enable maintenance mode
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: maintenance-mode
  namespace: production
data:
  enabled: "true"
  message: "System temporarily under maintenance. Please try again in a few minutes."
EOF

echo "🔴 Circuit breaker activated - System in maintenance mode"
```

---

**⚡ NODE OUT Kubernetes Quick Deploy - Operational Excellence at Your Fingertips**

*One command to deploy, one command to scale, zero downtime to dominate*