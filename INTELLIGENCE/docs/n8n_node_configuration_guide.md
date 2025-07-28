# N8N Node Configuration Guide - Step by Step

## After Importing the Workflow

When you import the JSON workflow, you'll see nodes connected together but with **red warning triangles** ⚠️. This means they need configuration. Let's fix each one:

---

## Node 1: Content Upload Webhook

**Click on the "Content Upload Webhook" node**

### What you'll see:
- A panel opens on the right side
- Fields for webhook configuration

### Fill in these fields:
```
HTTP Method: POST
Path: content-upload
Response Mode: Response Node
Authentication: None
```

### Click "Save" and then "Execute Node"
- N8N will generate a webhook URL like: `https://your-n8n-url/webhook/content-upload`
- **Copy this URL** - you'll use it to trigger the workflow

---

## Node 2: Transcribe Content

**Click on the "Transcribe Content" node**

### What you'll see:
- HTTP Request node configuration panel

### Fill in these fields:
```
Request Method: POST
URL: http://localhost:8000/api/transcribe

Headers:
- Name: Content-Type
- Value: application/json

Body:
Content Type: JSON
JSON: 
{
  "content_url": "{{ $json.content_url }}",
  "content_type": "{{ $json.content_type }}",
  "metadata": "{{ $json.metadata }}"
}
```

### How to add the JSON body:
1. Select "JSON" from the Content Type dropdown
2. In the JSON field, paste the JSON above
3. The `{{ $json.content_url }}` parts are N8N expressions that pull data from the previous node

---

## Node 3: AI Content Analysis

**Click on the "AI Content Analysis" node**

### Configuration:
```
Request Method: POST
URL: http://localhost:8000/api/analyze

Headers:
- Name: Content-Type
- Value: application/json

Body:
Content Type: JSON
JSON:
{
  "transcript": "{{ $json.transcript }}",
  "metadata": "{{ $json.metadata }}",
  "analysis_type": "full_semantic_analysis"
}
```

---

## Node 4: Upload to NotebookLM

**Click on the "Upload to NotebookLM" node**

### Configuration:
```
Request Method: POST
URL: http://localhost:8000/api/notebooklm/upload

Headers:
- Name: Content-Type
- Value: application/json
- Name: Authorization
- Value: Bearer {{ $env.NOTEBOOKLM_API_KEY }}

Body:
Content Type: JSON
JSON:
{
  "notebook_id": "{{ $env.NOTEBOOKLM_NOTEBOOK_ID }}",
  "content": "{{ $json.transcript }}",
  "analysis": "{{ $json.analysis }}",
  "segments": "{{ $json.key_moments }}"
}
```

### Note: 
The `{{ $env.NOTEBOOKLM_API_KEY }}` pulls from environment variables. We'll set those up next.

---

## Node 5: Generate Content Strategy

**Click on the "Generate Content Strategy" node**

### Configuration:
```
Request Method: POST
URL: http://localhost:8000/api/strategy/generate

Headers:
- Name: Content-Type
- Value: application/json

Body:
Content Type: JSON
JSON:
{
  "content_analysis": "{{ $json.analysis }}",
  "notebook_context": "{{ $json.notebook_response }}",
  "platforms": ["tiktok", "instagram", "linkedin", "twitter", "youtube"]
}
```

---

## Node 6: Split by Platform

**Click on the "Split by Platform" node**

### Configuration:
```
Batch Size: 1
Options: (leave default)
```

This node takes the list of platforms and processes them one by one.

---

## Node 7: Platform Router (Switch Node)

**Click on the "Platform Router" node**

### Configuration:
You'll see a conditions interface. Add these conditions:

**Condition 1:**
```
Left Value: {{ $json.platform }}
Operation: equals
Right Value: tiktok
```

**Condition 2:**
```
Left Value: {{ $json.platform }}
Operation: equals
Right Value: instagram
```

**Condition 3:**
```
Left Value: {{ $json.platform }}
Operation: equals
Right Value: linkedin
```

**Condition 4:**
```
Left Value: {{ $json.platform }}
Operation: equals
Right Value: twitter
```

---

## Node 8: Create TikTok Content

**Click on the "Create TikTok Content" node**

### Configuration:
```
Request Method: POST
URL: http://localhost:8000/api/content/create/tiktok

Headers:
- Name: Content-Type
- Value: application/json

Body:
Content Type: JSON
JSON:
{
  "content_suggestions": "{{ $json.suggestions }}",
  "brand_guidelines": "{{ $env.BRAND_GUIDELINES }}",
  "viral_potential": "{{ $json.viral_score }}"
}
```

---

## Setting Up Environment Variables

### Where to find Environment Variables in N8N:

1. **Click the Settings icon** (gear) in the top right
2. **Click "Environment Variables"**
3. **Click "Add Variable"**

### Add these variables:

```
Variable Name: AI_AGENT_BASE_URL
Value: http://localhost:8000

Variable Name: NOTEBOOKLM_API_KEY
Value: your_actual_api_key_here

Variable Name: NOTEBOOKLM_NOTEBOOK_ID
Value: your_notebook_id_here

Variable Name: BRAND_GUIDELINES
Value: {"tone": "casual", "voice": "energetic", "colors": ["#FF6B6B", "#4ECDC4"]}

Variable Name: TIKTOK_AUTO_POST
Value: false
```

---

## Testing Individual Nodes

### How to test each node:

1. **Click on any node**
2. **Click "Execute Node"** (play button)
3. **Add test data** in the input panel
4. **Click "Execute Node"** again
5. **Check the output** in the right panel

### Example test data for the first node:
```json
{
  "content_url": "https://example.com/test.mp3",
  "content_type": "audio",
  "metadata": {
    "title": "Test Podcast",
    "episode": 1,
    "description": "A test episode"
  }
}
```

---

## Common Issues and Fixes

### Red Warning Triangles:
- **Cause**: Missing required fields
- **Fix**: Click the node and fill in all required fields

### "Connection refused" errors:
- **Cause**: AI Agent not running
- **Fix**: Make sure `python ai_agent_server.py` is running

### "Environment variable not found":
- **Cause**: Variables not set in N8N
- **Fix**: Go to Settings → Environment Variables and add them

### JSON parsing errors:
- **Cause**: Malformed JSON in request body
- **Fix**: Check that your JSON is valid (no trailing commas, proper quotes)

---

## Quick Configuration Checklist

Before running the workflow, make sure:

- [ ] All nodes have no red warning triangles
- [ ] AI Agent is running on localhost:8000
- [ ] Environment variables are set in N8N
- [ ] Webhook URL is generated and copied
- [ ] Each HTTP Request node has proper URL and headers
- [ ] JSON bodies use correct N8N expressions like `{{ $json.field_name }}`

---

## Next Steps

Once all nodes are configured:

1. **Test the webhook** with a simple HTTP request
2. **Check each node's output** to see data flowing through
3. **Debug any issues** using N8N's built-in execution viewer
4. **Customize the content** by modifying the AI Agent responses

The workflow will process your content through each step and generate platform-specific social media content automatically!