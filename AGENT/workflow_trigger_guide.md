# Workflow Trigger System Guide

## 🎯 Overview

The Clay-I N8N Workflow Trigger System provides **5 different ways** to start your intelligent content automation workflows. Each trigger type serves different use cases and automation levels.

## 🚀 Quick Setup

### Step 1: Add Trigger System

```python
from workflow_trigger_system import WorkflowTriggerSystem

# Initialize trigger system
trigger_system = WorkflowTriggerSystem(workflow_builder, agent_api, memory)

# Setup all triggers
trigger_system.setup_all_triggers(app)
```

### Step 2: Choose Your Trigger Method

Pick the trigger method that best fits your needs:

## 📊 Trigger Types Overview

| Trigger Type | Best For | Automation Level | Frequency |
|--------------|----------|------------------|-----------|
| **Webhook** | External integrations | High | On-demand |
| **Scheduled** | Regular content creation | Very High | Daily/Hourly/Weekly |
| **Manual** | One-time requests | Low | On-demand |
| **Intelligent** | AI-driven decisions | Very High | Adaptive |
| **Event-Based** | Reactive automation | High | Event-driven |

---

## 1. 🔗 Webhook Triggers

**Best for**: External integrations, third-party tools, automated systems

### `/api/trigger/webhook/content-request` (POST)
Trigger content creation from external systems:

```bash
curl -X POST http://localhost:5002/api/trigger/webhook/content-request \
  -H "Content-Type: application/json" \
  -d '{
    "trigger_type": "external_request",
    "content_request": {
      "platforms": ["tiktok", "linkedin"],
      "content_types": ["blog_posts", "social_media"],
      "skill_focus": ["leadership", "automation"],
      "urgency": "high"
    }
  }'
```

### `/api/trigger/webhook/url-scrape` (POST)
Trigger URL scraping workflow:

```bash
curl -X POST http://localhost:5002/api/trigger/webhook/url-scrape \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://medium.com/leadership-article",
      "https://linkedin.com/posts/automation-insights"
    ],
    "platforms": ["tiktok", "linkedin"],
    "priority": "high"
  }'
```

### `/api/trigger/webhook/competitor-monitor` (POST)
Trigger competitor monitoring:

```bash
curl -X POST http://localhost:5002/api/trigger/webhook/competitor-monitor \
  -H "Content-Type: application/json" \
  -d '{
    "competitors": [
      "competitor1.com",
      "competitor2.com"
    ],
    "monitoring_depth": "comprehensive",
    "alert_threshold": 0.8
  }'
```

---

## 2. ⏰ Scheduled Triggers

**Best for**: Regular content creation, automated publishing, consistent output

### `/api/trigger/schedule/setup` (POST)
Setup scheduled workflow triggers:

```bash
# Daily content creation at 9 AM
curl -X POST http://localhost:5002/api/trigger/schedule/setup \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_type": "daily",
    "workflow_type": "viral_content_factory",
    "configuration": {
      "platforms": ["tiktok", "linkedin"],
      "content_types": ["blog_posts", "social_media"],
      "skill_focus": ["leadership", "automation"],
      "automation_level": "high"
    }
  }'

# Hourly content monitoring
curl -X POST http://localhost:5002/api/trigger/schedule/setup \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_type": "hourly",
    "workflow_type": "content_scraping_pipeline",
    "configuration": {
      "target_urls": ["https://techcrunch.com", "https://hbr.org"],
      "platforms": ["tiktok", "linkedin"],
      "content_types": ["news_articles"]
    }
  }'

# Weekly competitive analysis
curl -X POST http://localhost:5002/api/trigger/schedule/setup \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_type": "weekly",
    "workflow_type": "competitive_intelligence",
    "configuration": {
      "competitors": ["competitor1.com", "competitor2.com"],
      "insight_generation": true,
      "report_generation": true
    }
  }'

# Custom time scheduling
curl -X POST http://localhost:5002/api/trigger/schedule/setup \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_type": "custom",
    "custom_time": "14:30",
    "workflow_type": "mastery_content_engine",
    "configuration": {
      "skill_focus": ["stoicism", "leadership"],
      "content_balance": "skill_distributed"
    }
  }'
```

### `/api/trigger/schedule/list` (GET)
List all scheduled triggers:

```bash
curl -X GET http://localhost:5002/api/trigger/schedule/list
```

### `/api/trigger/schedule/stop/<job_id>` (POST)
Stop a scheduled trigger:

```bash
curl -X POST http://localhost:5002/api/trigger/schedule/stop/scheduled_viral_content_factory_20241201_090000
```

---

## 3. 🤖 Manual Triggers

**Best for**: One-time requests, testing, immediate content needs

### `/api/trigger/manual/start` (POST)
Manual workflow trigger with full configuration:

```bash
curl -X POST http://localhost:5002/api/trigger/manual/start \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_type": "viral_content_factory",
    "configuration": {
      "platforms": ["tiktok", "linkedin", "instagram"],
      "content_types": ["blog_posts", "social_media"],
      "skill_focus": ["leadership", "automation", "stoicism"],
      "automation_level": "high",
      "quality_threshold": 0.9,
      "urgency": "immediate"
    }
  }'
```

### `/api/trigger/manual/quick-start` (POST)
Quick start with minimal configuration:

```bash
# Quick TikTok content for leadership
curl -X POST http://localhost:5002/api/trigger/manual/quick-start \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "tiktok",
    "skill": "leadership"
  }'

# Quick LinkedIn content for automation
curl -X POST http://localhost:5002/api/trigger/manual/quick-start \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "linkedin",
    "skill": "automation"
  }'
```

---

## 4. 🧠 Intelligent Triggers

**Best for**: AI-driven decisions, adaptive automation, smart content creation

### `/api/trigger/intelligent/auto-detect` (POST)
Clay-I analyzes content and triggers optimal workflow:

```bash
curl -X POST http://localhost:5002/api/trigger/intelligent/auto-detect \
  -H "Content-Type: application/json" \
  -d '{
    "content_url": "https://medium.com/leadership-automation-article",
    "analysis_request": {
      "viral_potential": true,
      "skill_mapping": true,
      "platform_optimization": true,
      "content_quality": true
    }
  }'
```

### `/api/trigger/intelligent/performance-based` (POST)
Trigger based on performance metrics:

```bash
curl -X POST http://localhost:5002/api/trigger/intelligent/performance-based \
  -H "Content-Type: application/json" \
  -d '{
    "performance_metrics": {
      "engagement_rate": 0.45,
      "viral_score": 0.32,
      "content_quality": 0.78
    },
    "threshold": 0.7,
    "trigger_action": "improve_content"
  }'
```

---

## 5. 📊 Event-Based Triggers

**Best for**: Reactive automation, content gaps, trending topics

### `/api/trigger/event/content-dry` (POST)
Trigger when content pipeline is running low:

```bash
curl -X POST http://localhost:5002/api/trigger/event/content-dry \
  -H "Content-Type: application/json" \
  -d '{
    "current_content_count": 2,
    "minimum_threshold": 5,
    "platforms_needed": ["tiktok", "linkedin"],
    "urgency": "high"
  }'
```

### `/api/trigger/event/trending-topic` (POST)
Trigger when relevant trending topics are detected:

```bash
curl -X POST http://localhost:5002/api/trigger/event/trending-topic \
  -H "Content-Type: application/json" \
  -d '{
    "trending_topics": [
      "AI automation leadership",
      "Digital transformation 2024",
      "Remote work productivity"
    ],
    "relevance_threshold": 0.6,
    "platforms": ["tiktok", "twitter", "linkedin"],
    "urgency": "high"
  }'
```

---

## 🎯 Trigger Response Examples

### Successful Trigger Response:
```json
{
  "success": true,
  "trigger_id": "trigger_20241201_143022_123456",
  "workflow_id": "clay-i-workflow-abc123",
  "workflow_status": "started",
  "estimated_completion": "5-10 minutes",
  "message": "Workflow triggered successfully"
}
```

### Scheduled Trigger Response:
```json
{
  "success": true,
  "job_id": "scheduled_viral_content_factory_20241201_090000",
  "schedule_type": "daily",
  "next_run": "Tomorrow at 09:00",
  "status": "scheduled"
}
```

### Intelligent Trigger Response:
```json
{
  "success": true,
  "trigger_id": "trigger_20241201_143022_789012",
  "clay_i_recommendation": {
    "workflow_type": "viral_content_factory",
    "platforms": ["tiktok", "linkedin"],
    "skill_focus": ["leadership", "automation"]
  },
  "status": "intelligent_trigger_started",
  "message": "Clay-I analyzed content and triggered optimal workflow"
}
```

---

## 🔧 Advanced Configuration

### Environment Variables
```bash
# Set these in your environment
export CLAY_I_API_URL=http://localhost:5002
export PATHSASSIN_API_URL=http://localhost:5002
export CONTENT_REACTOR_URL=http://localhost:5002
export N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

### Custom Trigger Integration
```python
# Custom trigger function
async def custom_trigger_function():
    trigger_system = WorkflowTriggerSystem(workflow_builder, agent_api, memory)
    
    # Trigger based on custom logic
    if custom_condition_met:
        await trigger_system.execute_workflow_trigger({
            "workflow_type": "viral_content_factory",
            "configuration": {
                "platforms": ["tiktok", "linkedin"],
                "skill_focus": ["leadership"],
                "trigger_source": "custom",
                "trigger_type": "custom_logic"
            }
        }, {})
```

---

## 🚨 Best Practices

### 1. **Choose the Right Trigger Type**
- **Webhook**: For external integrations and APIs
- **Scheduled**: For regular, predictable content creation
- **Manual**: For one-time requests and testing
- **Intelligent**: For AI-driven, adaptive automation
- **Event-Based**: For reactive, conditional automation

### 2. **Monitor Trigger Performance**
```python
# Check active triggers
active_triggers = trigger_system.active_triggers
scheduled_jobs = trigger_system.scheduled_jobs

# Monitor trigger success rates
success_rate = len([t for t in active_triggers if t['status'] == 'completed']) / len(active_triggers)
```

### 3. **Error Handling**
```python
try:
    result = await trigger_system.execute_workflow_trigger(config, data)
    print(f"Trigger successful: {result['trigger_id']}")
except Exception as e:
    print(f"Trigger failed: {e}")
    # Handle error appropriately
```

### 4. **Trigger Optimization**
- Use appropriate scheduling intervals
- Set reasonable thresholds for intelligent triggers
- Monitor and adjust trigger parameters based on performance
- Implement retry logic for failed triggers

---

## 🎉 Success Metrics

Track these metrics to measure trigger system success:

- **Trigger Success Rate**: Percentage of successful triggers
- **Workflow Completion Rate**: Percentage of completed workflows
- **Content Quality Score**: Average quality of generated content
- **Automation Efficiency**: Time saved through automation
- **Intelligence Accuracy**: Accuracy of intelligent trigger decisions

---

## 🚀 Getting Started

1. **Setup trigger system** in your main application
2. **Choose trigger type** based on your use case
3. **Configure triggers** with appropriate parameters
4. **Test triggers** with sample requests
5. **Monitor performance** and optimize as needed
6. **Scale up** to multiple trigger types for comprehensive automation

---

**Ready to trigger intelligent Clay-I workflows automatically! 🚀** 