# ADD THIS TO YOUR AGENT - N8N WORKFLOW GENERATOR WITH PRE-LOADED INTELLIGENCE

import json
import uuid
from datetime import datetime
from typing import Dict, List, Any
import os

class PATHsassinMemory:
    def __init__(self, memory_file="agent_memory.json"):
        self.total_interactions = 0
        self.history = []
        self.memory_file = memory_file
        self.load_memory()

    def record_interaction(self, message, response, agent_type="default", context=None):
        interaction = {
            "timestamp": datetime.now().isoformat(),
            "agent_type": agent_type,
            "message": message,
            "response": response,
            "context": context
        }
        self.history.append(interaction)
        self.total_interactions += 1
        self.save_memory()

    def get_history(self):
        return self.history

    def get_summary(self):
        return {
            "total_interactions": self.total_interactions,
            "last_interaction": self.history[-1] if self.history else None
        }

    def save_memory(self):
        try:
            with open(self.memory_file, "w") as f:
                json.dump({
                    "total_interactions": self.total_interactions,
                    "history": self.history
                }, f, indent=2)
        except Exception as e:
            print(f"[Memory Save Error] {e}")

    def load_memory(self):
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, "r") as f:
                    data = json.load(f)
                    self.total_interactions = data.get("total_interactions", 0)
                    self.history = data.get("history", [])
            except Exception as e:
                print(f"[Memory Load Error] {e}")
        else:
            # First run – initialize empty memory
            self.total_interactions = 0
            self.history = []

class N8NWorkflowGenerator:
    """
    Generates pre-loaded N8N workflows with embedded agent intelligence
    Users can download and import complete agent systems
    """
    
    def __init__(self, agent_multiplication_engine):
        self.agent_engine = agent_multiplication_engine
        self.workflow_templates = self.load_workflow_templates()
        self.memory = PATHsassinMemory()
        
    def load_workflow_templates(self):
        """Load base N8N workflow templates"""
        return {
            'relationship_agent': self.get_relationship_agent_template(),
            'content_creator': self.get_content_creator_template(),
            'sales_agent': self.get_sales_agent_template(),
            'roofing_specialist': self.get_roofing_specialist_template()
        }
    
    def generate_preloaded_workflow(self, agent_blueprint_id: str, workflow_type: str = 'complete_system') -> Dict:
        """Generate N8N workflow with pre-loaded agent intelligence"""
        
        # Get the agent blueprint
        blueprint = self.agent_engine.template_library['templates'].get(agent_blueprint_id)
        if not blueprint:
            return {'error': 'Blueprint not found'}
        
        # Generate workflow based on agent type
        if workflow_type == 'relationship_agent':
            workflow = self.create_relationship_agent_workflow(blueprint)
        elif workflow_type == 'content_creator':
            workflow = self.create_content_creator_workflow(blueprint)
        elif workflow_type == 'sales_agent':
            workflow = self.create_sales_agent_workflow(blueprint)
        elif workflow_type == 'complete_system':
            workflow = self.create_complete_agent_system(blueprint)
        else:
            workflow = self.create_generic_agent_workflow(blueprint)
        
        result = {
            'success': True,
            'workflow_name': f"{blueprint['book_title']} Agent System",
            'workflow_type': workflow_type,
            'agent_blueprint': blueprint,
            'n8n_workflow': workflow,
            'download_ready': True
        }
        # Record the interaction in memory
        self.memory.record_interaction(
            message=f"Generate workflow for blueprint_id: {agent_blueprint_id}",
            response="Workflow generated successfully" if result['success'] else "Workflow generation failed",
            agent_type="workflow_generation",
            context={
                "blueprint": blueprint,
                "workflow_type": workflow_type,
                "workflow": workflow
            }
        )
        return result
    
    def create_complete_agent_system(self, blueprint: Dict) -> Dict:
        """Create complete N8N workflow with all agent capabilities"""
        
        workflow_id = str(uuid.uuid4())
        
        workflow = {
            "name": f"{blueprint['book_title']} - Complete Agent System",
            "active": False,
            "nodes": [
                # Agent Intelligence Node (Pre-loaded Data)
                {
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "agent_name",
                                    "value": f"{blueprint['book_title']} Agent"
                                },
                                {
                                    "name": "agent_personality",
                                    "value": json.dumps(blueprint.get('tone_profile', {}))
                                },
                                {
                                    "name": "system_prompt",
                                    "value": blueprint.get('embedded_prompt', '')
                                },
                                {
                                    "name": "book_wisdom",
                                    "value": blueprint['raw_reconstruction'][:1000] + "..."
                                }
                            ],
                            "object": [
                                {
                                    "name": "core_functions",
                                    "value": blueprint.get('themes', [])
                                },
                                {
                                    "name": "business_applications",
                                    "value": blueprint.get('meta_instructions', {})
                                }
                            ]
                        }
                    },
                    "id": "agent-intelligence-data",
                    "name": "📚 Agent Intelligence (Pre-loaded)",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 1,
                    "position": [240, 300]
                },
                
                # Webhook Trigger
                {
                    "parameters": {
                        "httpMethod": "POST",
                        "path": f"{blueprint['book_title'].lower().replace(' ', '-')}-agent",
                        "responseMode": "responseNode"
                    },
                    "id": "webhook-trigger",
                    "name": "🎯 Agent Trigger",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [460, 300],
                    "webhookId": str(uuid.uuid4())
                },
                
                # Agent Processing Logic
                {
                    "parameters": {
                        "functionCode": f"""
// {blueprint['book_title']} Agent Logic (Pre-loaded)
const agentData = $input.first();
const userRequest = $input.last();

// Extract agent intelligence
const agentPersonality = JSON.parse(agentData.json.agent_personality || '{{}}');
const systemPrompt = agentData.json.system_prompt;
const bookWisdom = agentData.json.book_wisdom;

// Process user request using agent intelligence
const processedRequest = {{
    agent_name: agentData.json.agent_name,
    user_input: userRequest.json.message || userRequest.json.input,
    agent_response_template: systemPrompt,
    book_context: bookWisdom,
    processing_mode: '{blueprint['book_title'].lower().replace(' ', '_')}_mode'
}};

return {{ json: processedRequest }};
"""
                    },
                    "id": "agent-logic",
                    "name": "🧠 Agent Processing",
                    "type": "n8n-nodes-base.function",
                    "typeVersion": 1,
                    "position": [680, 300]
                },
                
                # AI Response Generation
                {
                    "parameters": {
                        "url": "={{ $env.AI_AGENT_BASE_URL }}/api/chat",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "Content-Type",
                                    "value": "application/json"
                                }
                            ]
                        },
                        "sendBody": True,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "message",
                                    "value": "={{ $json.user_input }}"
                                },
                                {
                                    "name": "agent",
                                    "value": f"{blueprint['book_title'].lower().replace(' ', '_')}"
                                },
                                {
                                    "name": "context",
                                    "value": "={{ $json.book_context }}"
                                }
                            ]
                        }
                    },
                    "id": "ai-response",
                    "name": "🤖 AI Response",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 4.1,
                    "position": [900, 300]
                },
                
                # Response Formatting
                {
                    "parameters": {
                        "functionCode": f"""
// Format response with {blueprint['book_title']} personality
const aiResponse = $input.first().json;
const agentData = $input.all()[0].json;

const formattedResponse = {{
    agent_name: agentData.agent_name,
    response: aiResponse.response,
    book_source: "{blueprint['book_title']} by {blueprint['author']}",
    agent_mode: "{blueprint['book_title'].lower().replace(' ', '_')}_mode",
    confidence: 0.9,
    learning_insights: aiResponse.learning_insights || [],
    timestamp: new Date().toISOString()
}};

return {{ json: formattedResponse }};
"""
                    },
                    "id": "response-formatter",
                    "name": "✨ Response Formatter",
                    "type": "n8n-nodes-base.function",
                    "typeVersion": 1,
                    "position": [1120, 300]
                },
                
                # Response Output
                {
                    "parameters": {
                        "respondWith": "allIncomingItems"
                    },
                    "id": "webhook-response",
                    "name": "📤 Response",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [1340, 300]
                }
            ],
            "connections": {
                "📚 Agent Intelligence (Pre-loaded)": {
                    "main": [
                        [
                            {
                                "node": "🧠 Agent Processing",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "🎯 Agent Trigger": {
                    "main": [
                        [
                            {
                                "node": "🧠 Agent Processing",
                                "type": "main",
                                "index": 1
                            }
                        ]
                    ]
                },
                "🧠 Agent Processing": {
                    "main": [
                        [
                            {
                                "node": "🤖 AI Response",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "🤖 AI Response": {
                    "main": [
                        [
                            {
                                "node": "✨ Response Formatter",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "✨ Response Formatter": {
                    "main": [
                        [
                            {
                                "node": "📤 Response",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            },
            "pinData": {},
            "settings": {
                "executionOrder": "v1"
            },
            "staticData": None,
            "tags": [
                {
                    "id": str(uuid.uuid4()),
                    "name": f"{blueprint['book_title']} Agent"
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Pre-loaded Intelligence"
                }
            ],
            "triggerCount": 0,
            "updatedAt": datetime.now().isoformat(),
            "versionId": "1"
        }
        
        return workflow
    
    def create_relationship_agent_workflow(self, blueprint: Dict) -> Dict:
        """Create relationship-building focused workflow"""
        
        workflow = {
            "name": f"{blueprint['book_title']} - Relationship Agent",
            "nodes": [
                {
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "relationship_strategies",
                                    "value": json.dumps(blueprint.get('themes', []))
                                },
                                {
                                    "name": "communication_style",
                                    "value": json.dumps(blueprint.get('tone_profile', {}))
                                }
                            ]
                        }
                    },
                    "name": "🤝 Relationship Intelligence",
                    "type": "n8n-nodes-base.set"
                }
            ]
        }
        
        return workflow
    
    def create_content_creator_workflow(self, blueprint: Dict) -> Dict:
        """Create content creation focused workflow"""
        
        workflow = {
            "name": f"{blueprint['book_title']} - Content Creator",
            "nodes": [
                {
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "writing_style",
                                    "value": json.dumps(blueprint.get('tone_profile', {}))
                                },
                                {
                                    "name": "content_frameworks",
                                    "value": json.dumps(blueprint.get('themes', []))
                                }
                            ]
                        }
                    },
                    "name": "✍️ Content Intelligence",
                    "type": "n8n-nodes-base.set"
                }
            ]
        }
        
        return workflow
    
    def create_sales_agent_workflow(self, blueprint: Dict) -> Dict:
        """Create sales-focused workflow"""
        
        workflow = {
            "name": f"{blueprint['book_title']} - Sales Agent",
            "nodes": [
                {
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "sales_methodology",
                                    "value": json.dumps(blueprint.get('themes', []))
                                },
                                {
                                    "name": "persuasion_techniques",
                                    "value": blueprint.get('embedded_prompt', '')
                                }
                            ]
                        }
                    },
                    "name": "💰 Sales Intelligence",
                    "type": "n8n-nodes-base.set"
                }
            ]
        }
        
        return workflow
    
    def create_roofing_specialist_workflow(self, blueprint: Dict) -> Dict:
        """Create roofing industry specialist workflow"""
        
        workflow = {
            "name": f"{blueprint['book_title']} - Roofing Specialist",
            "nodes": [
                {
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "roofing_expertise",
                                    "value": "Insurance law changes, real estate partnerships"
                                },
                                {
                                    "name": "agent_strategies",
                                    "value": json.dumps(blueprint.get('themes', []))
                                }
                            ]
                        }
                    },
                    "name": "🏠 Roofing Intelligence",
                    "type": "n8n-nodes-base.set"
                }
            ]
        }
        
        return workflow
    
    def create_generic_agent_workflow(self, blueprint: Dict) -> Dict:
        """Create generic agent workflow template"""
        
        workflow = {
            "name": f"{blueprint['book_title']} - Generic Agent",
            "nodes": [
                {
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "agent_intelligence",
                                    "value": blueprint['raw_reconstruction'][:500]
                                }
                            ]
                        }
                    },
                    "name": "🧠 Generic Intelligence",
                    "type": "n8n-nodes-base.set"
                }
            ]
        }
        
        return workflow
    
    def get_relationship_agent_template(self):
        """Base template for relationship agents"""
        return {
            'focus': 'relationship_building',
            'capabilities': ['networking', 'communication', 'influence'],
            'business_applications': ['sales', 'partnerships', 'customer_relations']
        }
    
    def get_content_creator_template(self):
        """Base template for content creation agents"""
        return {
            'focus': 'content_creation',
            'capabilities': ['writing', 'storytelling', 'messaging'],
            'business_applications': ['marketing', 'social_media', 'documentation']
        }
    
    def get_sales_agent_template(self):
        """Base template for sales agents"""
        return {
            'focus': 'sales_process',
            'capabilities': ['persuasion', 'objection_handling', 'closing'],
            'business_applications': ['sales_automation', 'lead_qualification', 'customer_acquisition']
        }
    
    def get_roofing_specialist_template(self):
        """Base template for roofing industry agents"""
        return {
            'focus': 'roofing_expertise',
            'capabilities': ['industry_knowledge', 'agent_relationships', 'technical_expertise'],
            'business_applications': ['real_estate_partnerships', 'customer_education', 'sales_support']
        }