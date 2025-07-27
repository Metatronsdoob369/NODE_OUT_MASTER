from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import json
import os
import base64
from dotenv import load_dotenv
from typing import List, Dict, Any
from PIL import Image
import io

# Load environment variables
load_dotenv(dotenv_path='../../../config.env')

app = FastAPI(title="Clay-I AI System Architect", version="2.0.0")

# Initialize OpenAI
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    prompt: str

class JobDefinition(BaseModel):
    job_title: str
    system_purpose: str
    context: str
    target_outcome: str
    key_components: List[str]
    constraints: List[str]
    assistant_thinking: str

class EngineeringResponse(BaseModel):
    architecture: Dict[str, Any]
    workflows: List[Dict[str, Any]]
    implementation_plan: List[str]

class VisionAnalysis(BaseModel):
    description: str
    elements_identified: List[str]
    suggestions: List[str]
    technical_analysis: str

@app.post("/chat")
def chat(msg: Message):
    return {"response": f"Echo: {msg.prompt}"}

@app.post("/engineer")
async def engineer_system(job_def: JobDefinition) -> EngineeringResponse:
    """AI System Architect - Generate system architecture and n8n workflows"""
    try:
        # Construct the engineering prompt
        engineering_prompt = f"""
You are an expert AI System Architect. Design a complete system architecture with the following requirements:

JOB TITLE: {job_def.job_title}
SYSTEM PURPOSE: {job_def.system_purpose}

CONTEXT:
{job_def.context}

TARGET OUTCOME:
{job_def.target_outcome}

KEY COMPONENTS TO DESIGN:
{chr(10).join([f'{i+1}. {comp}' for i, comp in enumerate(job_def.key_components)])}

CONSTRAINTS:
{chr(10).join([f'- {constraint}' for constraint in job_def.constraints])}

ASSISTANT THINKING APPROACH:
{job_def.assistant_thinking}

Please provide:
1. Detailed system architecture
2. Data models and schemas
3. Integration specifications
4. n8n workflow JSON specifications for automation
5. Implementation roadmap

Format the response as a structured engineering document with clear sections.
"""

        # Call OpenAI GPT-4
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert AI System Architect specializing in automation workflows and system integration. Provide detailed, implementable architectures."},
                {"role": "user", "content": engineering_prompt}
            ],
            max_tokens=4000,
            temperature=0.3
        )
        
        architecture_text = response.choices[0].message.content
        
        # Parse and structure the response
        architecture = {
            "system_design": architecture_text,
            "timestamp": str(pd.Timestamp.now()),
            "job_title": job_def.job_title
        }
        
        # Generate basic n8n workflow structure
        workflows = [
            {
                "name": f"{job_def.job_title}_workflow",
                "nodes": [
                    {
                        "id": "trigger",
                        "type": "webhook",
                        "name": "System Trigger"
                    },
                    {
                        "id": "process",
                        "type": "function", 
                        "name": "Processing Logic"
                    },
                    {
                        "id": "output",
                        "type": "webhook_response",
                        "name": "System Response"
                    }
                ],
                "connections": {
                    "trigger": ["process"],
                    "process": ["output"]
                }
            }
        ]
        
        implementation_plan = [
            "1. Review architectural specifications",
            "2. Set up data models and database schemas", 
            "3. Implement core system components",
            "4. Deploy n8n workflows for automation",
            "5. Test integration points",
            "6. Deploy to production environment"
        ]
        
        return EngineeringResponse(
            architecture=architecture,
            workflows=workflows,
            implementation_plan=implementation_plan
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Engineering error: {str(e)}")

@app.post("/synthe-side-hustle")
async def synthe_analysis(target: Dict[str, str]):
    """SYNTHE-SIDE_HUSTLE - Analyze and 10X online money-makers"""
    try:
        analysis_prompt = f"""
SYNTHE-SIDE_HUSTLE ANALYSIS:

Target: {target.get('name', 'Unknown')}
Business Model: {target.get('model', 'Not specified')}
Revenue: {target.get('revenue', 'Unknown')}

Analyze this online money-maker and provide:
1. Their core value proposition and market approach
2. Fatal blind spots and vulnerabilities
3. How to 10X their approach using local authority + tier 2/3 markets
4. Specific deployment strategy for Birmingham/Mobile
5. Revenue projection for our 10X version

Focus on easy, fun, and POTENT opportunities for domination.
"""

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a strategic business analyst specializing in competitive advantage and market domination through local authority."},
                {"role": "user", "content": analysis_prompt}
            ],
            max_tokens=2000,
            temperature=0.7
        )
        
        return {"analysis": response.choices[0].message.content}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.post("/vision-analysis")
async def vision_analysis(file: UploadFile = File(...), question: str = ""):
    """Clay-I Vision Analysis - Analyze screenshots and images"""
    try:
        # Read the uploaded image
        image_data = await file.read()
        
        # Convert to base64 for OpenAI Vision API
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        # Create vision analysis prompt
        base_prompt = """
You are Clay-I, an expert AI system architect specializing in UE5 storm visualization systems.

CONTEXT: You are helping navigate Unreal Engine 5 for the Storm_Command_Bham project - a Birmingham storm response visualization system integrating Google Earth for contractor dispatch.

CURRENT MISSION: Guide UE5 interface navigation to:
- Add/configure Web Browser Widget for Google Earth integration
- Switch from Google Maps to Google Earth URL (https://earth.google.com/)
- Navigate to Birmingham, AL coordinates (33.5186° N, 86.8104° W)
- Integrate storm visualization with real-time contractor dispatch

Analyze this UE5 screenshot and provide:

1. UE5 INTERFACE ANALYSIS: Current viewport, panels, and workflow state
2. NAVIGATION GUIDANCE: Specific clicks, menus, and steps for storm visualization setup
3. WEB BROWSER WIDGET STATUS: Is it visible? How to add/configure it?
4. GOOGLE EARTH INTEGRATION: Steps to implement Birmingham storm mapping
5. NEXT ACTIONS: Immediate steps to advance the storm visualization system

Focus on UE5-specific guidance for storm visualization implementation.
"""
        
        if question:
            vision_prompt = f"{base_prompt}\n\nSPECIFIC QUESTION: {question}\nPlease address this question specifically in your analysis."
        else:
            vision_prompt = base_prompt

        # Call OpenAI Vision API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": vision_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=1500
        )
        
        analysis_text = response.choices[0].message.content
        
        # Parse the response (simplified version)
        lines = analysis_text.split('\n')
        description = analysis_text[:200] + "..."
        
        return VisionAnalysis(
            description=analysis_text,
            elements_identified=["Analyzing interface elements..."],
            suggestions=["Navigation suggestions based on visual analysis..."],
            technical_analysis="Technical analysis of the interface and system..."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vision analysis error: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "CLAY-I AI SYSTEM ARCHITECT + VISION ONLINE",
        "version": "3.0.0",
        "capabilities": [
            "System Architecture Generation",
            "n8n Workflow Creation", 
            "SYNTHE-SIDE_HUSTLE Analysis",
            "Engineering Blueprint Generation",
            "Vision Analysis & Screenshot Processing"
        ]
    }