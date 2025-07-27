#!/usr/bin/env python3
"""
Pathsassin N8N Workflow Mission
Generate complete n8n workflow for Greensboro roofing company
"""

import json
import uuid
from datetime import datetime, timedelta

def generate_greensboro_roofing_workflow():
    """Generate complete n8n workflow for Greensboro roofing company"""
    
    workflow_id = str(uuid.uuid4())
    
    # Define the complete workflow
    workflow = {
        "id": workflow_id,
        "name": "Greensboro Roofing Social Media Automation Suite",
        "active": True,
        "nodes": [
            {
                "id": "webhook_trigger",
                "name": "🚀 Daily Content Trigger",
                "type": "n8n-nodes-base.cron",
                "typeVersion": 1,
                "position": [240, 300],
                "parameters": {
                    "rule": {
                        "interval": [{
                            "field": "cronExpression",
                            "expression": "0 6 * * *"  # Daily at 6 AM
                        }]
                    }
                }
            },
            {
                "id": "content_generator",
                "name": "📝 NotebookLM Content Generator", 
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.1,
                "position": [460, 300],
                "parameters": {
                    "url": "https://notebooklm.google.com/api/generate",
                    "method": "POST",
                    "sendBody": True,
                    "bodyParameters": {
                        "parameters": [
                            {"name": "industry", "value": "roofing"},
                            {"name": "location", "value": "Greensboro NC"},
                            {"name": "content_type", "value": "social_media"},
                            {"name": "batch_size", "value": "90"},  # 3 months
                            {"name": "tone", "value": "professional_local"}
                        ]
                    },
                    "options": {
                        "timeout": 30000
                    }
                }
            },
            {
                "id": "content_processor",
                "name": "🎯 Content Processor",
                "type": "n8n-nodes-base.function",
                "typeVersion": 1,
                "position": [680, 300],
                "parameters": {
                    "functionCode": """// Process NotebookLM content for daily posting
const contentBatch = $input.all();
const dailyContent = [];

for (const item of contentBatch) {
    const rawContent = item.json.generated_content;
    
    // Split content into daily posts
    const posts = rawContent.split('---').filter(post => post.trim());
    
    posts.forEach((post, index) => {
        const postDate = new Date();
        postDate.setDate(postDate.getDate() + index);
        
        dailyContent.push({
            post_id: 'greensboro_' + index,
            content: post.trim(),
            scheduled_date: postDate.toISOString(),
            platforms: ['facebook', 'instagram'],
            hashtags: ['#GreensboroRoofing', '#NCRoof', '#RoofRepair', '#LocalBusiness'],
            location: 'Greensboro, NC',
            call_to_action: 'Call for free estimate!'
        });
    });
}

return dailyContent;"""
                }
            },
            {
                "id": "facebook_publisher",
                "name": "📱 Facebook Publisher",
                "type": "n8n-nodes-base.facebook",
                "typeVersion": 1,
                "position": [900, 200],
                "parameters": {
                    "operation": "post",
                    "content": "={{ $json.content }}",
                    "additionalFields": {
                        "link": "https://greensbororoofing.com",
                        "published": True,
                        "scheduledPublishTime": "={{ $json.scheduled_date }}"
                    }
                }
            },
            {
                "id": "instagram_publisher", 
                "name": "📸 Instagram Publisher",
                "type": "n8n-nodes-base.instagram",
                "typeVersion": 1,
                "position": [900, 400],
                "parameters": {
                    "operation": "post",
                    "mediaType": "image",
                    "binaryData": False,
                    "caption": "={{ $json.content }} {{ $json.hashtags.join(' ') }}",
                    "additionalFields": {
                        "location": "={{ $json.location }}"
                    }
                }
            },
            {
                "id": "calendly_integration",
                "name": "📅 Calendly Lead Capture",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 4.1,
                "position": [1120, 300],
                "parameters": {
                    "url": "https://api.calendly.com/scheduled_events",
                    "method": "POST",
                    "sendBody": True,
                    "bodyParameters": {
                        "parameters": [
                            {"name": "event_type", "value": "roofing_consultation"},
                            {"name": "location", "value": "Greensboro NC"},
                            {"name": "duration", "value": "30"},
                            {"name": "description", "value": "Free roofing estimate and consultation"}
                        ]
                    },
                    "options": {
                        "timeout": 10000
                    }
                }
            },
            {
                "id": "lead_tracker",
                "name": "📊 Lead Analytics",
                "type": "n8n-nodes-base.googleSheets",
                "typeVersion": 4,
                "position": [1340, 300],
                "parameters": {
                    "operation": "append",
                    "documentId": "greensboro_roofing_leads",
                    "sheetName": "Daily Leads",
                    "columns": {
                        "mappingMode": "defineBelow",
                        "value": {
                            "date": "={{ $now.format('yyyy-MM-dd') }}",
                            "platform": "={{ $json.platform }}",
                            "content_type": "social_media",
                            "engagement": "={{ $json.engagement_metrics }}",
                            "leads_generated": "={{ $json.calendly_bookings }}",
                            "location": "Greensboro NC"
                        }
                    }
                }
            },
            {
                "id": "response_handler",
                "name": "✅ Success Response",
                "type": "n8n-nodes-base.noOp",
                "typeVersion": 1,
                "position": [1560, 300],
                "parameters": {}
            }
        ],
        "connections": {
            "webhook_trigger": {
                "main": [
                    [
                        {
                            "node": "content_generator",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "content_generator": {
                "main": [
                    [
                        {
                            "node": "content_processor",
                            "type": "main", 
                            "index": 0
                        }
                    ]
                ]
            },
            "content_processor": {
                "main": [
                    [
                        {
                            "node": "facebook_publisher",
                            "type": "main",
                            "index": 0
                        },
                        {
                            "node": "instagram_publisher", 
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "facebook_publisher": {
                "main": [
                    [
                        {
                            "node": "calendly_integration",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "instagram_publisher": {
                "main": [
                    [
                        {
                            "node": "calendly_integration", 
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "calendly_integration": {
                "main": [
                    [
                        {
                            "node": "lead_tracker",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            },
            "lead_tracker": {
                "main": [
                    [
                        {
                            "node": "response_handler",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "settings": {
            "executionOrder": "v1",
            "saveExecutionProgress": True,
            "saveManualExecutions": True,
            "saveDataSuccessExecution": "all",
            "saveDataErrorExecution": "all",
            "executionTimeout": 3600,
            "timezone": "America/New_York"
        },
        "staticData": {
            "workflow_metadata": {
                "created_by": "Pathsassin",
                "client": "Greensboro Roofing Company",
                "automation_type": "social_media_lead_generation",
                "content_source": "NotebookLM",
                "scheduling": "Calendly",
                "batch_size": "90_days",
                "platforms": ["Facebook", "Instagram"],
                "location": "Greensboro NC",
                "created_at": datetime.now().isoformat(),
                "features": [
                    "3-month content batching",
                    "Daily automated posting",
                    "Lead capture integration", 
                    "Analytics tracking",
                    "Local market optimization"
                ]
            },
            "pathsassin_intelligence": {
                "industry_focus": "roofing",
                "local_seo_optimization": True,
                "lead_generation_focus": True,
                "content_automation": "high",
                "social_media_strategy": "professional_local",
                "conversion_optimization": True
            }
        },
        "tags": ["pathsassin", "roofing", "greensboro", "social-media", "lead-generation"],
        "triggerCount": 1,
        "updatedAt": datetime.now().isoformat(),
        "versionId": workflow_id
    }
    
    return workflow

def save_workflow_to_file():
    """Save the generated workflow to file"""
    workflow = generate_greensboro_roofing_workflow()
    
    filename = f"greensboro_roofing_n8n_workflow_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    with open(filename, 'w') as f:
        json.dump(workflow, f, indent=2, default=str)
    
    print(f"🎯 PATHSASSIN MISSION COMPLETE")
    print(f"📁 Workflow saved: {filename}")
    print(f"🏢 Client: Greensboro Roofing Company")
    print(f"📱 Platforms: Facebook + Instagram")
    print(f"🤖 Content Source: NotebookLM (3-month batch)")
    print(f"📅 Scheduling: Calendly integration")
    print(f"📊 Analytics: Google Sheets tracking")
    print(f"⚡ Automation Level: Full")
    
    return filename, workflow

if __name__ == "__main__":
    filename, workflow = save_workflow_to_file()
    
    print("\n📋 WORKFLOW FEATURES:")
    for feature in workflow['staticData']['workflow_metadata']['features']:
        print(f"  ✅ {feature}")
    
    print(f"\n🔧 WORKFLOW NODES: {len(workflow['nodes'])}")
    print(f"🔗 CONNECTIONS: {len(workflow['connections'])}")
    print(f"🎯 READY FOR N8N IMPORT")