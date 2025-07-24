from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os, json

from Work_FLOW import PATHsassinMemory
from WF_1 import N8NWorkflowGenerator
from voice_scripts_generated import VOICE_SCRIPTS

app = FastAPI()
memory = PATHsassinMemory()
workflow_gen = N8NWorkflowGenerator(agent_multiplication_engine=None)  # plug in your engine later

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend from /frontend/dist
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

class ChatInput(BaseModel):
    prompt: str
    voice: str = "Drew"  # optional: which voice to use
    demo: bool = False    # toggle for autoplay in demo mode

@app.post("/chat")
async def chat(input: ChatInput):
    message = input.prompt.strip()
    voice = input.voice
    is_demo = input.demo

    # Simulate AI response
    if "schedule" in message.lower():
        response = "Scheduling workflow activated."
        wf = workflow_gen.load_workflow_templates().get("schedule", {})
    elif "quote" in message.lower():
        response = "Here’s a quick quote for your job."
        wf = workflow_gen.load_workflow_templates().get("quote", {})
    else:
        response = f"Echo: {message}"
        wf = None

    # Log to memory
    memory.record_interaction(message, response)

    # Voice autoplay
    voice_response = ""
    if is_demo and voice in VOICE_SCRIPTS.get("automated_call_scripts", {}):
        voice_response = VOICE_SCRIPTS["automated_call_scripts"][voice]

    return {
        "response": response,
        "voice_autoplay": voice_response,
        "workflow_hint": wf or {}
    }
