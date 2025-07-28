# Content Reactor Integration Guide for PATHsassin

## 🎬 Overview

The Content Reactor is a powerful system that transforms any content (audio, video, text) into viral social media gold using PATHsassin's learning intelligence. It analyzes content through the lens of the Master Skills Index and generates platform-specific strategies.

## 🚀 Quick Integration

### Step 1: Add to Your Existing System

Copy the `ContentReactor` class from `pathsassin_content_reactor_integration.py` into your `CLAUDE_CLEAN_12.py` file, right after the `PATHsassinMemory` class.

### Step 2: Initialize the Content Reactor

Add this line after your existing agent initialization:

```python
# After: agent = AgentAPI()
content_reactor = ContentReactor(agent.memory)
```

### Step 3: Add the API Endpoints

Copy all the Flask endpoints from the integration file into your existing Flask app routes.

### Step 4: Install Dependencies (Optional)

```bash
pip install openai-whisper  # For audio transcription
```

## 🎯 Key Features

### 1. **Content Transcription**
- Transcribes audio/video content using Whisper AI
- Falls back gracefully if Whisper isn't available
- Supports multiple content types

### 2. **PATHsassin Intelligence Analysis**
- Analyzes content through the Master Skills Index lens
- Identifies viral moments based on skill relevance
- Maps content to specific PATHsassin skills (1-13)

### 3. **Multi-Platform Strategy Generation**
- **TikTok**: Bite-sized wisdom clips with viral hooks
- **LinkedIn**: Professional insights for skill mastery
- **Instagram**: Visual journey of learning progression
- **Twitter**: Quick insight threads for engagement

### 4. **Viral Moment Detection**
- Identifies high-potential content segments
- Scores viral potential (0-1.0)
- Categorizes by emotion (wisdom, leadership, technical, controversial)

## 📊 API Endpoints

### `/api/transcribe` (POST)
Transcribe audio/video content:
```json
{
  "content_url": "https://example.com/audio.mp3",
  "content_type": "audio",
  "metadata": {"title": "My Podcast Episode"}
}
```

### `/api/analyze` (POST)
Analyze transcript through PATHsassin lens:
```json
{
  "transcript": "Your content transcript here...",
  "metadata": {"source": "podcast", "duration": "45:00"}
}
```

### `/api/strategy/generate` (POST)
Generate platform-specific strategies:
```json
{
  "content_analysis": {...},
  "platforms": ["tiktok", "linkedin", "instagram", "twitter"]
}
```

### `/api/tiktok/extract-clips` (POST)
Extract TikTok-optimized clips:
```json
{
  "content_analysis": {...},
  "viral_moments": [...]
}
```

### `/api/content-reactor/status` (GET)
Check system status and PATHsassin integration.

## 🧠 PATHsassin Skill Mapping

The Content Reactor maps content to your 13 Master Skills:

| Skill ID | Skill Name | Domain | Keywords |
|----------|------------|--------|----------|
| 1 | Stoicism & Resilience | Outer | resilience, control, acceptance, strength |
| 2 | Leadership & Team Building | Outer | leadership, team, vision, strategy |
| 5 | N8N Architecture & Automation | Middle | automation, system, process, workflow |
| 7 | Graphic Design | Middle | design, web, graphic, ui, ux |
| 8 | Mentorship & Coaching | Middle | mentorship, coaching, teaching, guidance |
| 10 | International Business | Inner | international, global, world, culture |
| 13 | Theosophy & Comparative Religion | Inner | synthesis, pattern, connection, integration |

## 🎨 Content Strategy Examples

### TikTok Strategy
```json
{
  "platform": "tiktok",
  "content_suggestions": [
    {
      "clip_start": "00:15:00",
      "hook": "🧠 PATHsassin wisdom: The key to resilience is...",
      "visual_concept": "Text overlay with wisdom theme",
      "hashtags": ["#PATHsassin", "#mastery", "#learning", "#wisdom"]
    }
  ],
  "viral_score": 0.85,
  "learning_focus": "Bite-sized wisdom for skill mastery"
}
```

### LinkedIn Strategy
```json
{
  "platform": "linkedin",
  "content_suggestions": [
    {
      "type": "professional_insight",
      "concept": "Mastery insight: Leadership requires...",
      "cta": "What's your experience with this principle?",
      "hashtags": ["#Leadership", "#ProfessionalGrowth", "#Mastery"]
    }
  ]
}
```

## 🔧 Testing the Integration

### 1. Test Status Endpoint
```bash
curl http://localhost:5002/api/content-reactor/status
```

### 2. Test Content Analysis
```bash
curl -X POST http://localhost:5002/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Leadership is about building resilience through systematic automation and design thinking.",
    "metadata": {"source": "test"}
  }'
```

### 3. Test Strategy Generation
```bash
curl -X POST http://localhost:5002/api/strategy/generate \
  -H "Content-Type: application/json" \
  -d '{
    "content_analysis": {
      "key_moments": [...],
      "skill_connections": {"2": 0.8, "5": 0.6},
      "overall_viral_score": 0.75
    },
    "platforms": ["tiktok", "linkedin"]
  }'
```

## 🎯 Use Cases

### 1. **Podcast to Social Media**
- Transcribe podcast episodes
- Extract viral moments
- Generate platform-specific content

### 2. **Video Content Repurposing**
- Analyze YouTube videos
- Create TikTok clips
- Generate LinkedIn insights

### 3. **Educational Content**
- Process lecture recordings
- Identify key learning moments
- Create bite-sized educational content

### 4. **Business Presentations**
- Transcribe sales calls
- Extract value propositions
- Generate social proof content

## 🚨 Troubleshooting

### Whisper Not Available
- System falls back to mock transcription
- Install with: `pip install openai-whisper`
- Check system requirements for Whisper

### Memory Integration Issues
- Ensure `agent.memory` is properly initialized
- Check PATHsassinMemory class compatibility
- Verify memory save/load functions

### API Endpoint Errors
- Check Flask app initialization
- Verify CORS settings
- Ensure proper JSON formatting

## 🎉 Success Metrics

The Content Reactor tracks:
- **Viral Score**: 0-1.0 based on content potential
- **Skill Connections**: Relevance to Master Skills Index
- **Learning Value**: Educational content assessment
- **Platform Optimization**: Platform-specific recommendations

## 🔮 Future Enhancements

- **Real-time Transcription**: Live content processing
- **Video Analysis**: Visual content understanding
- **A/B Testing**: Strategy performance tracking
- **Automated Publishing**: Direct platform integration

---

**Ready to turn your content into viral social media gold with PATHsassin intelligence! 🚀** 