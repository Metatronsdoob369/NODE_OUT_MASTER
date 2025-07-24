# AgentGPT Scraping Integration Guide

## 🤖 Overview

AgentGPT Scraping Integration combines web scraping intelligence with PATHsassin's Content Reactor to automatically gather, analyze, and transform web content into viral social media gold. This system can scrape any website, analyze the content through PATHsassin's learning lens, and generate platform-specific strategies.

## 🚀 Quick Integration

### Step 1: Install Dependencies

```bash
pip install aiohttp beautifulsoup4 requests
```

### Step 2: Add to Your System

Copy the `AgentGPTScraper` class from `agentgpt_scraping_integration.py` into your main system file.

### Step 3: Initialize Integration

Add this to your Flask app initialization:

```python
from agentgpt_scraping_integration import add_agentgpt_endpoints

# After initializing agent and content_reactor
scraper = add_agentgpt_endpoints(app, agent, content_reactor)
```

## 🎯 Key Features

### 1. **Intelligent Web Scraping**
- Automatically detects content types (blog posts, news, social media)
- Extracts titles, paragraphs, quotes, and lists
- Handles different website structures intelligently

### 2. **PATHsassin Analysis Integration**
- Analyzes scraped content through Master Skills Index
- Identifies viral moments and skill connections
- Calculates viral potential scores

### 3. **Multi-Platform Content Generation**
- Converts scraped content into TikTok clips
- Generates LinkedIn professional insights
- Creates Instagram visual content
- Produces Twitter threads

### 4. **Concurrent Scraping**
- Scrape multiple URLs simultaneously
- Batch processing for efficiency
- Error handling and retry logic

## 📊 API Endpoints

### `/api/agentgpt/scrape` (POST)
Scrape a single URL:

```json
{
  "url": "https://medium.com/article-about-leadership",
  "content_type": "auto"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://medium.com/article-about-leadership",
  "content_type": "blog_posts",
  "extracted_content": {
    "title": "The Future of Leadership",
    "paragraphs": ["Leadership is about...", "The key insight..."],
    "quotes": ["\"The best leaders...\""],
    "lists": [["Point 1", "Point 2"]]
  },
  "pathsassin_analysis": {
    "overall_viral_score": 0.85,
    "key_moments": [...],
    "skill_connections": {"2": 0.8, "1": 0.6},
    "pathsassin_topics": ["leadership", "stoicism"]
  }
}
```

### `/api/agentgpt/scrape-multiple` (POST)
Scrape multiple URLs concurrently:

```json
{
  "urls": [
    "https://linkedin.com/posts/leadership-insights",
    "https://twitter.com/thread-about-automation",
    "https://medium.com/design-thinking-article"
  ],
  "content_types": ["social_media", "social_media", "blog_posts"]
}
```

### `/api/agentgpt/find-viral` (POST)
Find viral content based on search:

```json
{
  "query": "leadership automation trends",
  "max_results": 10
}
```

### `/api/agentgpt/generate-content` (POST)
Generate social media content from scraped results:

```json
{
  "scraped_results": [...],
  "platform": "tiktok"
}
```

## 🎨 Content Type Detection

The system automatically detects content types:

| Content Type | Detected From | Selectors |
|--------------|---------------|-----------|
| **Social Media** | LinkedIn, Twitter, X | `.post-content`, `.tweet-text` |
| **Blog Posts** | Medium, Substack, WordPress | `article`, `.post-content` |
| **News Articles** | CNN, BBC, TechCrunch | `.article-content`, `.story-body` |
| **Podcast Transcripts** | Spotify, Apple, Anchor | `.transcript`, `.episode-content` |

## 🧠 PATHsassin Skill Mapping

Scraped content is automatically mapped to your 13 Master Skills:

| Skill | Keywords | Viral Potential |
|-------|----------|-----------------|
| **Stoicism** | resilience, control, acceptance, strength | High |
| **Leadership** | leadership, team, vision, strategy | Very High |
| **Automation** | automation, system, process, workflow | High |
| **Design** | design, web, graphic, ui, ux | Medium |
| **Mentorship** | mentorship, coaching, teaching | High |
| **Global** | international, global, world, culture | Medium |
| **Synthesis** | synthesis, pattern, connection | Very High |

## 🎯 Use Cases

### 1. **Competitor Content Analysis**
```python
# Scrape competitor's LinkedIn posts
urls = [
    "https://linkedin.com/company/competitor/posts",
    "https://medium.com/competitor-blog"
]

results = await scraper.scrape_multiple_urls(urls)
analysis = scraper.analyze_scraped_content(results)
```

### 2. **Trending Topic Research**
```python
# Find viral content about automation
viral_content = await scraper.find_viral_content("automation trends 2024")
tiktok_strategy = scraper.generate_content_from_scraped(viral_content, "tiktok")
```

### 3. **Industry News Monitoring**
```python
# Monitor industry news sites
news_urls = [
    "https://techcrunch.com/tag/automation",
    "https://hbr.org/topic/leadership"
]

news_results = await scraper.scrape_multiple_urls(news_urls, ["news_articles"])
linkedin_content = scraper.generate_content_from_scraped(news_results, "linkedin")
```

### 4. **Podcast Content Repurposing**
```python
# Scrape podcast transcripts
podcast_urls = [
    "https://anchor.fm/show/leadership-podcast",
    "https://spotify.com/podcast/automation-insights"
]

transcripts = await scraper.scrape_multiple_urls(podcast_urls, ["podcast_transcripts"])
tiktok_clips = scraper.generate_content_from_scraped(transcripts, "tiktok")
```

## 🔧 Advanced Configuration

### Custom Content Types
```python
# Add custom content type
scraper.scraping_config['content_types']['custom_blog'] = {
    'selectors': ['.custom-content', '.blog-post'],
    'extract_title': True,
    'extract_meta': True
}
```

### Custom PATHsassin Filters
```python
# Add custom skill keywords
scraper.scraping_config['pathsassin_filters']['custom_skill'] = [
    'custom_keyword', 'another_keyword'
]
```

### Rate Limiting
```python
# Add delays between requests
import asyncio

async def scrape_with_delay(urls):
    results = []
    for url in urls:
        result = await scraper.scrape_url(url)
        results.append(result)
        await asyncio.sleep(2)  # 2 second delay
    return results
```

## 🎨 Content Generation Examples

### TikTok Clip Generation
```json
{
  "platform": "tiktok",
  "content_strategy": {
    "content_suggestions": [
      {
        "clip_start": "00:15:00",
        "hook": "🧠 Leadership insight: The future of automation...",
        "visual_concept": "Text overlay with leadership theme",
        "hashtags": ["#Leadership", "#Automation", "#FutureOfWork"]
      }
    ],
    "viral_score": 0.85
  }
}
```

### LinkedIn Professional Post
```json
{
  "platform": "linkedin",
  "content_strategy": {
    "content_suggestions": [
      {
        "type": "professional_insight",
        "concept": "How automation is reshaping leadership...",
        "cta": "What's your experience with automation in leadership?",
        "hashtags": ["#Leadership", "#Automation", "#ProfessionalGrowth"]
      }
    ]
  }
}
```

## 🚨 Best Practices

### 1. **Respect Robots.txt**
- Always check robots.txt before scraping
- Implement reasonable delays between requests
- Use proper User-Agent headers

### 2. **Error Handling**
```python
try:
    result = await scraper.scrape_url(url)
    if 'error' in result:
        print(f"Scraping failed: {result['error']}")
        # Handle gracefully
except Exception as e:
    print(f"Unexpected error: {e}")
```

### 3. **Content Quality Filtering**
```python
# Filter by viral score
high_viral_content = [
    result for result in scraped_results
    if result.get('pathsassin_analysis', {}).get('overall_viral_score', 0) > 0.7
]
```

### 4. **Memory Management**
```python
# Close session when done
await scraper.close_session()
```

## 🔮 Future Enhancements

### 1. **Search API Integration**
- Google Custom Search API
- Bing Web Search API
- DuckDuckGo Instant Answer API

### 2. **Real-time Monitoring**
- Webhook notifications for new content
- RSS feed integration
- Social media API integration

### 3. **Advanced Analytics**
- Content performance tracking
- Viral prediction models
- A/B testing for generated content

### 4. **Automated Publishing**
- Direct posting to social platforms
- Scheduled content publishing
- Cross-platform content optimization

## 🎉 Success Metrics

Track these metrics to measure success:

- **Scraping Success Rate**: Percentage of successful scrapes
- **Viral Score Average**: Average viral potential of scraped content
- **Content Generation Rate**: Number of posts generated per day
- **Engagement Rate**: Social media engagement on generated content
- **Skill Coverage**: Distribution across PATHsassin skills

## 🚀 Getting Started

1. **Install dependencies**
2. **Add AgentGPTScraper to your system**
3. **Test with a simple URL**
4. **Generate your first viral content**
5. **Scale up with multiple sources**

---

**Ready to turn the entire web into your viral content goldmine with PATHsassin intelligence! 🚀** 