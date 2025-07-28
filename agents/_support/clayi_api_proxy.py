import os
import json
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# === Memory Vault Storage ===
VAULT_PATH = "api_vault.json"

if not os.path.exists(VAULT_PATH):
    with open(VAULT_PATH, 'w') as f:
        json.dump({}, f)

# === Input Schema ===
class APICredential(BaseModel):
    service: str
    role: str
    description: str
    api_key: str
    client_id: str = None
    client_secret: str = None
    webhook_url: str = None
    scopes: list[str] = []
    example_call: str = None

# === Routes ===

@app.post("/api/provision")
def provision_credential(cred: APICredential):
    try:
        with open(VAULT_PATH, 'r+') as f:
            data = json.load(f)
            if cred.service in data:
                raise HTTPException(status_code=409, detail="Service already provisioned")
            data[cred.service] = cred.model_dump()
            f.seek(0)
            json.dump(data, f, indent=2)
            f.truncate()
        return {"status": "success", "service": cred.service}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vault")
def list_provisioned():
    with open(VAULT_PATH, 'r') as f:
        return json.load(f)

@app.get("/api/vault/{service_name}")
def get_service(service_name: str):
    with open(VAULT_PATH, 'r') as f:
        vault = json.load(f)
        if service_name not in vault:
            raise HTTPException(status_code=404, detail="Service not found")
        return vault[service_name]

@app.delete("/api/vault/{service_name}")
def remove_service(service_name: str):
    with open(VAULT_PATH, 'r+') as f:
        data = json.load(f)
        if service_name in data:
            del data[service_name]
            f.seek(0)
            json.dump(data, f, indent=2)
            f.truncate()
            return {"status": "deleted", "service": service_name}
        raise HTTPException(status_code=404, detail="Service not found")

# === Core Connector Templates ===
CONNECTOR_TEMPLATES = {
    "pinecone": {
        "role": "Agent Memory Recall",
        "description": "Vector database for agent memory and context persistence",
        "required_fields": ["api_key", "environment"],
        "scopes": ["index:read", "index:write", "index:delete"],
        "example_call": "curl -H 'Api-Key: YOUR_API_KEY' https://YOUR_ENV-PROJECT_ID.svc.pinecone.io/vectors/upsert"
    },
    "redis": {
        "role": "Agent Memory Cache",
        "description": "High-speed cache for real-time agent memory",
        "required_fields": ["host", "port", "password"],
        "scopes": ["read", "write", "admin"],
        "example_call": "redis-cli -h HOST -p PORT -a PASSWORD"
    },
    "google_trends": {
        "role": "Market Reaction Agent",
        "description": "Real-time market sentiment and trend analysis",
        "required_fields": ["api_key"],
        "scopes": ["trends.read"],
        "example_call": "https://serpapi.com/search.json?engine=google_trends&q=QUERY&api_key=YOUR_API_KEY"
    },
    "calendly": {
        "role": "Calendar AI Routing",
        "description": "Automated scheduling and calendar management",
        "required_fields": ["api_key", "webhook_url"],
        "scopes": ["events:read", "events:write", "webhooks:read"],
        "example_call": "curl -H 'Authorization: Bearer YOUR_TOKEN' https://api.calendly.com/users/me"
    },
    "mailgun": {
        "role": "Email Drop After Quote",
        "description": "Automated email delivery system",
        "required_fields": ["api_key", "domain"],
        "scopes": ["messages:send", "templates:read"],
        "example_call": "curl -s --user 'api:YOUR_API_KEY' https://api.mailgun.net/v3/YOUR_DOMAIN/messages"
    },
    "sendgrid": {
        "role": "Email Drop After Quote",
        "description": "Alternative email delivery system",
        "required_fields": ["api_key"],
        "scopes": ["mail.send"],
        "example_call": "curl -X POST https://api.sendgrid.com/v3/mail/send -H 'Authorization: Bearer YOUR_API_KEY'"
    },
    "did_api": {
        "role": "Avatar Video Delivery",
        "description": "AI-powered avatar video generation",
        "required_fields": ["api_key"],
        "scopes": ["videos:create", "presenters:read"],
        "example_call": "curl -X POST https://api.d-id.com/talks -H 'Authorization: Basic YOUR_API_KEY'"
    },
    "youtube_v3": {
        "role": "YouTube Automation",
        "description": "YouTube content management and analytics",
        "required_fields": ["api_key", "client_id", "client_secret"],
        "scopes": ["youtube.readonly", "youtube.upload", "youtube.force-ssl"],
        "example_call": "curl 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=YOUR_API_KEY'"
    }
}

@app.get("/api/templates")
def get_connector_templates():
    return CONNECTOR_TEMPLATES

@app.get("/api/templates/{connector}")
def get_connector_template(connector: str):
    if connector not in CONNECTOR_TEMPLATES:
        raise HTTPException(status_code=404, detail="Connector template not found")
    return CONNECTOR_TEMPLATES[connector]

@app.post("/api/provision/batch")
def provision_batch_connectors(connectors: Dict[str, APICredential]):
    results = []
    for service_name, cred in connectors.items():
        try:
            with open(VAULT_PATH, 'r+') as f:
                data = json.load(f)
                data[service_name] = cred.model_dump()
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate()
            results.append({"service": service_name, "status": "success"})
        except Exception as e:
            results.append({"service": service_name, "status": "error", "detail": str(e)})
    return {"batch_results": results}

# Optional: expose to Clay-I for internal LLM prompting
def query_clayi_for_description(agent_prompt: str) -> str:
    return f"[Simulated Clay-I Response] {agent_prompt}"

# === Run via Uvicorn ===
# uvicorn clayi_api_proxy:app --reload --port 8001
