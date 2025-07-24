# Clay-I N8N Workflow Builder Guide

## 🧠 Overview

Clay-I N8N Workflow Builder creates intelligent automated workflows that combine web scraping, PATHsassin analysis, and viral content generation. This system uses Clay-I's advanced AI to design workflows that automatically turn web content into viral social media gold.

## 🚀 Quick Integration

### Step 1: Add to Your System

Copy the `ClayIN8NWorkflowBuilder` class from `clay_i_n8n_workflow_builder.py` into your main system file.

### Step 2: Initialize Integration

Add this to your Flask app initialization:

```python
from clay_i_n8n_workflow_builder import add_clay_i_workflow_endpoints

# After initializing agent and memory
workflow_builder = add_clay_i_workflow_endpoints(app, agent, memory)
```

## 🎯 Available Workflow Templates

### 1. **Content Scraping Pipeline**
- **Purpose**: Automated web scraping with PATHsassin analysis
- **Intelligence Level**: High
- **Nodes**: webhook, url_processor, scraper, analyzer, content_generator, scheduler
- **Best For**: Monitoring websites and generating content automatically

### 2. **Viral Content Factory**
- **Purpose**: Multi-platform viral content generation
- **Intelligence Level**: Very High
- **Nodes**: content_analyzer, platform_optimizer, content_creator, quality_checker, publisher
- **Best For**: Creating viral content for multiple social platforms

### 3. **Competitive Intelligence**
- **Purpose**: Monitor competitors and generate insights
- **Intelligence Level**: High
- **Nodes**: competitor_monitor, content_analyzer, insight_generator, strategy_creator
- **Best For**: Competitive analysis and strategic content planning

### 4. **Mastery Content Engine**
- **Purpose**: PATHsassin skill-based content generation
- **Intelligence Level**: Very High
- **Nodes**: skill_analyzer, content_planner, creator, optimizer, distributor
- **Best For**: Creating content focused on specific Master Skills

## 📊 API Endpoints

### `/api/clay-i/workflow/build` (POST)
Build intelligent N8N workflow:

```json
{
  "workflow_type": "viral_content_factory",
  "configuration": {
    "platforms": ["tiktok", "linkedin", "instagram"],
    "content_types": ["blog_posts", "social_media"],
    "skill_focus": ["leadership", "automation"],
    "automation_level": "high",
    "scheduling": "daily",
    "quality_threshold": 0.8
  }
}
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "id": "clay-i-workflow-123",
    "name": "Viral Content Factory - Clay-I Enhanced",
    "nodes": [...],
    "connections": {...},
    "staticData": {
      "clay_i_intelligence": {
        "intelligence_level": "very_high",
        "learning_capabilities": "continuous"
      }
    }
  },
  "download_ready": true
}
```

### `/api/clay-i/workflow/templates` (GET)
Get available workflow templates and node library.

### `/api/clay-i/workflow/optimize` (POST)
Optimize existing workflow with Clay-I intelligence.

### `/api/clay-i/workflow/status` (GET)
Get Clay-I workflow builder status.

## 🧠 Intelligent Node Library

### Intelligence Nodes
- **Clay-I Analyzer**: Advanced content analysis using Clay-I
- **PATHsassin Skill Mapper**: Map content to Master Skills Index
- **Viral Potential Calculator**: Calculate viral potential using Clay-I
- **Platform Optimizer**: Optimize content for specific platforms

### Automation Nodes
- **Web Scraper**: Intelligent web scraping with retry logic
- **Content Generator**: Generate content using Clay-I
- **Quality Checker**: Quality assurance using Clay-I standards

### Integration Nodes
- **PATHsassin Memory**: Integrate with PATHsassin memory system
- **Content Reactor**: Content Reactor integration

## 🎯 Use Cases

### 1. **Automated Content Creation Pipeline**
```python
# Build viral content factory
workflow_config = {
    "workflow_type": "viral_content_factory",
    "configuration": {
        "platforms": ["tiktok", "linkedin"],
        "content_types": ["blog_posts", "social_media"],
        "automation_level": "high",
        "scheduling": "every_6_hours"
    }
}

workflow = await workflow_builder.build_intelligent_workflow(
    workflow_config["workflow_type"], 
    workflow_config["configuration"]
)
```

### 2. **Competitive Intelligence System**
```python
# Build competitive intelligence workflow
workflow_config = {
    "workflow_type": "competitive_intelligence",
    "configuration": {
        "competitors": ["competitor1.com", "competitor2.com"],
        "monitoring_frequency": "daily",
        "insight_generation": True,
        "alert_threshold": 0.7
    }
}
```

### 3. **Mastery Content Engine**
```python
# Build mastery-focused content engine
workflow_config = {
    "workflow_type": "mastery_content_engine",
    "configuration": {
        "skill_focus": ["leadership", "automation", "stoicism"],
        "content_balance": "skill_distributed",
        "learning_tracking": True,
        "mastery_progression": True
    }
}
```

## 🧠 Clay-I Intelligence Features

### 1. **Intelligent Content Analysis**
```javascript
// Clay-I analysis function in N8N
function analyzeContentQuality(content) {
    const qualityFactors = {
        readability: calculateReadability(content.text),
        engagement: calculateEngagementPotential(content.text),
        originality: calculateOriginality(content.text),
        relevance: calculateRelevance(content.text)
    };
    
    return {
        overall_score: (qualityFactors.readability + qualityFactors.engagement + 
                       qualityFactors.originality + qualityFactors.relevance) / 4,
        factors: qualityFactors
    };
}
```

### 2. **PATHsassin Skill Mapping**
```javascript
// Skill mapping function
function identifySkillRelevance(content) {
    const skills = ['stoicism', 'leadership', 'automation', 'design', 'mentorship'];
    const skillConnections = {};
    
    for (const skill of skills) {
        skillConnections[skill] = calculateSkillRelevance(content.text, skill);
    }
    
    return skillConnections;
}
```

### 3. **Viral Potential Calculation**
```javascript
// Viral potential calculation
function calculateViralPotential(content) {
    const viralFactors = {
        emotional_impact: analyzeEmotionalImpact(content.text),
        shareability: calculateShareability(content.text),
        timeliness: assessTimeliness(content.text),
        controversy: assessControversy(content.text)
    };
    
    return {
        viral_score: (viralFactors.emotional_impact + viralFactors.shareability + 
                     viralFactors.timeliness + viralFactors.controversy) / 4,
        factors: viralFactors
    };
}
```

## 🎨 Workflow Examples

### Viral Content Factory Workflow
```json
{
  "name": "Viral Content Factory - Clay-I Enhanced",
  "nodes": [
    {
      "id": "webhook_trigger",
      "name": "🎯 Content Request Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "viral-content-request"
      }
    },
    {
      "id": "clay_i_analyzer",
      "name": "🧠 Clay-I Content Analyzer",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "clay_i_analysis_function"
      }
    },
    {
      "id": "pathsassin_mapper",
      "name": "🎯 PATHsassin Skill Mapper",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "skill_mapping_function"
      }
    },
    {
      "id": "viral_optimizer",
      "name": "🚀 Viral Content Optimizer",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "viral_optimization_function"
      }
    },
    {
      "id": "content_generator",
      "name": "📝 Multi-Platform Generator",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{ $env.CLAY_I_API_URL }}/api/generate",
        "method": "POST"
      }
    }
  ],
  "connections": {
    "webhook_trigger": {
      "main": [["clay_i_analyzer"]]
    },
    "clay_i_analyzer": {
      "main": [["pathsassin_mapper"]]
    },
    "pathsassin_mapper": {
      "main": [["viral_optimizer"]]
    },
    "viral_optimizer": {
      "main": [["content_generator"]]
    }
  }
}
```

## 🔧 Advanced Configuration

### Custom Workflow Templates
```python
# Add custom workflow template
workflow_builder.workflow_templates['custom_pipeline'] = {
    'name': 'Custom Content Pipeline',
    'description': 'Custom automated content pipeline',
    'nodes': ['custom_trigger', 'custom_analyzer', 'custom_generator'],
    'intelligence_level': 'high',
    'automation_type': 'custom'
}
```

### Custom Node Library
```python
# Add custom intelligent node
workflow_builder.node_library['intelligence_nodes']['custom_analyzer'] = {
    'type': 'function',
    'description': 'Custom Clay-I analysis',
    'parameters': {
        'functionCode': 'custom_analysis_function',
        'mode': 'runOnceForAllItems'
    }
}
```

### Workflow Optimization
```python
# Optimize existing workflow
optimization_result = await workflow_builder.optimize_workflow_with_clay_i(
    existing_workflow,
    optimization_focus='performance'
)
```

## 🚨 Best Practices

### 1. **Intelligence Configuration**
- Set appropriate intelligence levels for your use case
- Configure skill focus based on your content goals
- Use quality thresholds to ensure high-quality output

### 2. **Error Handling**
```python
try:
    workflow = await workflow_builder.build_intelligent_workflow(
        workflow_type, configuration
    )
    if 'error' in workflow:
        print(f"Workflow creation failed: {workflow['error']}")
        # Handle gracefully
except Exception as e:
    print(f"Unexpected error: {e}")
```

### 3. **Performance Optimization**
- Use appropriate scheduling intervals
- Configure retry logic for external APIs
- Monitor workflow performance metrics

### 4. **Memory Integration**
- Ensure PATHsassin memory integration is active
- Track learning insights from workflow execution
- Monitor mastery progression

## 🔮 Advanced Features

### 1. **Adaptive Learning**
- Workflows learn from execution results
- Clay-I intelligence improves over time
- Performance optimization based on historical data

### 2. **Intelligent Scheduling**
- Dynamic scheduling based on content performance
- Optimal timing for different platforms
- Adaptive frequency based on engagement

### 3. **Quality Assurance**
- Automated quality checks using Clay-I standards
- Content validation before publishing
- Performance monitoring and alerts

### 4. **Cross-Platform Optimization**
- Platform-specific content optimization
- Cross-platform synergy strategies
- Unified content distribution

## 🎉 Success Metrics

Track these metrics to measure workflow success:

- **Workflow Execution Rate**: Percentage of successful executions
- **Content Quality Score**: Average quality score from Clay-I analysis
- **Viral Performance**: Viral score and engagement metrics
- **Skill Coverage**: Distribution across PATHsassin skills
- **Automation Efficiency**: Time saved through automation

## 🚀 Getting Started

1. **Add ClayIN8NWorkflowBuilder to your system**
2. **Choose a workflow template** that fits your needs
3. **Configure the workflow** with your specific requirements
4. **Deploy to N8N** and start the automation
5. **Monitor and optimize** based on performance

## 📋 Example Workflow Request

```bash
curl -X POST http://localhost:5002/api/clay-i/workflow/build \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_type": "viral_content_factory",
    "configuration": {
      "platforms": ["tiktok", "linkedin"],
      "content_types": ["blog_posts", "social_media"],
      "skill_focus": ["leadership", "automation"],
      "automation_level": "high",
      "scheduling": "daily",
      "quality_threshold": 0.8
    }
  }'
```

---

**Ready to build intelligent N8N workflows that automatically create viral content with Clay-I intelligence! 🚀** 