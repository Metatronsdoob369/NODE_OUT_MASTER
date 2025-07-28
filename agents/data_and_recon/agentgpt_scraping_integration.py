#!/usr/bin/env python3
"""
AgentGPT Scraping Integration for PATHsassin Content Reactor
Enables web scraping and content gathering for viral social media content
"""

import requests
import json
import asyncio
import aiohttp
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
import re
from urllib.parse import urlparse, urljoin
import time
from bs4 import BeautifulSoup
import os

class AgentGPTScraper:
    """AgentGPT-powered web scraper for content gathering"""
    
    def __init__(self, content_reactor, memory):
        self.content_reactor = content_reactor
        self.memory = memory
        self.session = None
        self.scraping_config = self.load_scraping_config()
        
    def load_scraping_config(self):
        """Load scraping configuration for different content types"""
        return {
            'social_media_targets': {
                'linkedin': {
                    'selectors': ['.post-content', '.feed-shared-text', '.share-text'],
                    'keywords': ['leadership', 'business', 'strategy', 'growth', 'innovation'],
                    'viral_potential': 0.8
                },
                'twitter': {
                    'selectors': ['.tweet-text', '.js-tweet-text'],
                    'keywords': ['insight', 'thread', 'viral', 'trending', 'breaking'],
                    'viral_potential': 0.9
                },
                'medium': {
                    'selectors': ['.post-content', '.section-content', 'article'],
                    'keywords': ['analysis', 'research', 'insights', 'trends', 'future'],
                    'viral_potential': 0.7
                }
            },
            'content_types': {
                'blog_posts': {
                    'selectors': ['article', '.post-content', '.entry-content', 'main'],
                    'extract_title': True,
                    'extract_meta': True
                },
                'news_articles': {
                    'selectors': ['.article-content', '.story-body', '.content'],
                    'extract_title': True,
                    'extract_meta': True
                },
                'podcast_transcripts': {
                    'selectors': ['.transcript', '.episode-content', '.show-notes'],
                    'extract_title': True,
                    'extract_meta': False
                }
            },
            'pathsassin_filters': {
                'stoicism': ['resilience', 'control', 'acceptance', 'strength', 'wisdom'],
                'leadership': ['leadership', 'team', 'vision', 'strategy', 'management'],
                'automation': ['automation', 'system', 'process', 'workflow', 'n8n'],
                'design': ['design', 'web', 'graphic', 'ui', 'ux', 'creative'],
                'mentorship': ['mentorship', 'coaching', 'teaching', 'guidance'],
                'global': ['international', 'global', 'world', 'culture', 'diversity'],
                'synthesis': ['synthesis', 'pattern', 'connection', 'integration']
            }
        }
    
    async def initialize_session(self):
        """Initialize aiohttp session for scraping"""
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(timeout=timeout)
    
    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            self.session = None
    
    async def scrape_url(self, url: str, content_type: str = 'auto') -> Dict[str, Any]:
        """Scrape content from URL using AgentGPT-style intelligence"""
        await self.initialize_session()
        
        try:
            # Add headers to mimic real browser
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
            
            async with self.session.get(url, headers=headers) as response:
                if response.status != 200:
                    return {
                        'error': f'Failed to fetch URL: {response.status}',
                        'url': url
                    }
                
                html_content = await response.text()
                
                # Parse with BeautifulSoup
                soup = BeautifulSoup(html_content, 'html.parser')
                
                # Extract content based on type
                if content_type == 'auto':
                    content_type = self.detect_content_type(soup, url)
                
                extracted_content = self.extract_content(soup, content_type, url)
                
                # Analyze with PATHsassin intelligence
                analysis = await self.analyze_scraped_content(extracted_content, url)
                
                # Record scraping activity
                self.memory.add_interaction(
                    'web_scraping',
                    f"Scraped content from {url}",
                    f"Found {len(extracted_content.get('paragraphs', []))} paragraphs",
                    f"Content type: {content_type}, Viral score: {analysis.get('overall_viral_score', 0):.2f}"
                )
                
                return {
                    'success': True,
                    'url': url,
                    'content_type': content_type,
                    'extracted_content': extracted_content,
                    'pathsassin_analysis': analysis,
                    'scraped_at': datetime.now().isoformat()
                }
                
        except Exception as e:
            return {
                'error': f'Scraping failed: {str(e)}',
                'url': url
            }
    
    def detect_content_type(self, soup: BeautifulSoup, url: str) -> str:
        """Detect content type based on URL and page structure"""
        domain = urlparse(url).netloc.lower()
        
        if any(social in domain for social in ['linkedin.com', 'twitter.com', 'x.com']):
            return 'social_media'
        elif any(blog in domain for blog in ['medium.com', 'substack.com', 'wordpress.com']):
            return 'blog_posts'
        elif any(news in domain for news in ['cnn.com', 'bbc.com', 'reuters.com', 'techcrunch.com']):
            return 'news_articles'
        elif any(podcast in domain for podcast in ['spotify.com', 'apple.com', 'anchor.fm']):
            return 'podcast_transcripts'
        else:
            # Try to detect based on page structure
            if soup.find('article') or soup.find(class_=re.compile(r'post|article|entry')):
                return 'blog_posts'
            elif soup.find(class_=re.compile(r'news|story|article')):
                return 'news_articles'
            else:
                return 'general_content'
    
    def extract_content(self, soup: BeautifulSoup, content_type: str, url: str) -> Dict[str, Any]:
        """Extract content based on content type"""
        config = self.scraping_config['content_types'].get(content_type, {})
        
        extracted = {
            'url': url,
            'title': '',
            'meta_description': '',
            'paragraphs': [],
            'quotes': [],
            'lists': [],
            'content_type': content_type
        }
        
        # Extract title
        title_selectors = ['h1', '.title', '.post-title', '.article-title', 'title']
        for selector in title_selectors:
            title_elem = soup.select_one(selector)
            if title_elem:
                extracted['title'] = title_elem.get_text(strip=True)
                break
        
        # Extract meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            extracted['meta_description'] = meta_desc.get('content', '')
        
        # Extract main content
        selectors = config.get('selectors', ['article', 'main', '.content', '.post-content'])
        
        for selector in selectors:
            content_elem = soup.select_one(selector)
            if content_elem:
                # Extract paragraphs
                paragraphs = content_elem.find_all(['p', 'div'], recursive=True)
                for p in paragraphs:
                    text = p.get_text(strip=True)
                    if len(text) > 50:  # Only meaningful paragraphs
                        extracted['paragraphs'].append(text)
                
                # Extract quotes
                quotes = content_elem.find_all(['blockquote', '.quote'])
                for quote in quotes:
                    text = quote.get_text(strip=True)
                    if len(text) > 20:
                        extracted['quotes'].append(text)
                
                # Extract lists
                lists = content_elem.find_all(['ul', 'ol'])
                for list_elem in lists:
                    items = [li.get_text(strip=True) for li in list_elem.find_all('li')]
                    if items:
                        extracted['lists'].append(items)
                
                break
        
        return extracted
    
    async def analyze_scraped_content(self, content: Dict[str, Any], url: str) -> Dict[str, Any]:
        """Analyze scraped content through PATHsassin lens"""
        # Combine all text content
        all_text = ' '.join([
            content.get('title', ''),
            content.get('meta_description', ''),
            *content.get('paragraphs', []),
            *content.get('quotes', [])
        ])
        
        # Analyze with Content Reactor
        analysis = self.content_reactor.analyze_content_for_pathsassin(
            all_text, 
            {
                'source_url': url,
                'content_type': content.get('content_type', 'unknown'),
                'scraped_at': datetime.now().isoformat()
            }
        )
        
        # Add scraping-specific insights
        analysis['scraping_insights'] = {
            'content_length': len(all_text),
            'paragraphs_count': len(content.get('paragraphs', [])),
            'quotes_count': len(content.get('quotes', [])),
            'lists_count': len(content.get('lists', [])),
            'has_title': bool(content.get('title')),
            'has_meta': bool(content.get('meta_description'))
        }
        
        return analysis
    
    async def scrape_multiple_urls(self, urls: List[str], content_types: List[str] = None) -> List[Dict[str, Any]]:
        """Scrape multiple URLs concurrently"""
        if content_types is None:
            content_types = ['auto'] * len(urls)
        
        tasks = []
        for url, content_type in zip(urls, content_types):
            task = self.scrape_url(url, content_type)
            tasks.append(task)
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out exceptions
        valid_results = []
        for result in results:
            if isinstance(result, dict) and 'success' in result:
                valid_results.append(result)
        
        return valid_results
    
    async def find_viral_content(self, search_query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """Find viral content based on search query"""
        # This would integrate with search APIs (Google, Bing, etc.)
        # For now, return mock results
        mock_urls = [
            f"https://example.com/viral-content-{i}" for i in range(max_results)
        ]
        
        results = await self.scrape_multiple_urls(mock_urls)
        
        # Filter by viral potential
        viral_results = [
            result for result in results 
            if result.get('pathsassin_analysis', {}).get('overall_viral_score', 0) > 0.6
        ]
        
        return sorted(viral_results, 
                     key=lambda x: x.get('pathsassin_analysis', {}).get('overall_viral_score', 0), 
                     reverse=True)
    
    def generate_content_from_scraped(self, scraped_results: List[Dict[str, Any]], platform: str) -> Dict[str, Any]:
        """Generate social media content from scraped results"""
        all_content = []
        
        for result in scraped_results:
            content = result.get('extracted_content', {})
            analysis = result.get('pathsassin_analysis', {})
            
            # Combine content
            combined_text = ' '.join([
                content.get('title', ''),
                *content.get('paragraphs', [])[:3],  # First 3 paragraphs
                *content.get('quotes', [])
            ])
            
            all_content.append({
                'source_url': result.get('url'),
                'content': combined_text,
                'viral_score': analysis.get('overall_viral_score', 0),
                'skill_connections': analysis.get('skill_connections', {}),
                'key_moments': analysis.get('key_moments', [])
            })
        
        # Generate platform-specific strategy
        strategy = self.content_reactor.generate_pathsassin_content_strategy(
            {'key_moments': all_content[0].get('key_moments', []) if all_content else []},
            [platform]
        )
        
        return {
            'success': True,
            'platform': platform,
            'scraped_sources': len(scraped_results),
            'content_strategy': strategy.get(platform, {}),
            'top_sources': [
                {
                    'url': content['source_url'],
                    'viral_score': content['viral_score'],
                    'skill_connections': content['skill_connections']
                }
                for content in all_content[:3]
            ]
        }

# Flask endpoints for AgentGPT scraping integration
def add_agentgpt_endpoints(app, agent, content_reactor):
    """Add AgentGPT scraping endpoints to Flask app"""
    
    scraper = AgentGPTScraper(content_reactor, agent.memory)
    
    @app.route('/api/agentgpt/scrape', methods=['POST'])
    async def scrape_content():
        """Scrape content from URL using AgentGPT intelligence"""
        try:
            data = request.json
            url = data.get('url', '')
            content_type = data.get('content_type', 'auto')
            
            if not url:
                return jsonify({'error': 'No URL provided'}), 400
            
            result = await scraper.scrape_url(url, content_type)
            
            if 'error' in result:
                return jsonify(result), 400
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/agentgpt/scrape-multiple', methods=['POST'])
    async def scrape_multiple():
        """Scrape multiple URLs concurrently"""
        try:
            data = request.json
            urls = data.get('urls', [])
            content_types = data.get('content_types', None)
            
            if not urls:
                return jsonify({'error': 'No URLs provided'}), 400
            
            results = await scraper.scrape_multiple_urls(urls, content_types)
            
            return jsonify({
                'success': True,
                'results': results,
                'total_scraped': len(results)
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/agentgpt/find-viral', methods=['POST'])
    async def find_viral_content():
        """Find viral content based on search query"""
        try:
            data = request.json
            search_query = data.get('query', '')
            max_results = data.get('max_results', 10)
            
            if not search_query:
                return jsonify({'error': 'No search query provided'}), 400
            
            results = await scraper.find_viral_content(search_query, max_results)
            
            return jsonify({
                'success': True,
                'query': search_query,
                'results': results,
                'viral_content_found': len(results)
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/agentgpt/generate-content', methods=['POST'])
    async def generate_from_scraped():
        """Generate social media content from scraped results"""
        try:
            data = request.json
            scraped_results = data.get('scraped_results', [])
            platform = data.get('platform', 'linkedin')
            
            if not scraped_results:
                return jsonify({'error': 'No scraped results provided'}), 400
            
            content = scraper.generate_content_from_scraped(scraped_results, platform)
            
            return jsonify(content)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/agentgpt/status', methods=['GET'])
    def agentgpt_status():
        """Get AgentGPT scraping system status"""
        try:
            return jsonify({
                'agentgpt_scraping_active': True,
                'content_reactor_integration': True,
                'pathsassin_memory_integration': True,
                'supported_content_types': list(scraper.scraping_config['content_types'].keys()),
                'social_media_targets': list(scraper.scraping_config['social_media_targets'].keys()),
                'pathsassin_filters': list(scraper.scraping_config['pathsassin_filters'].keys())
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    return scraper

# Integration instructions
print("🤖 AgentGPT Scraping Integration: READY")
print("🌐 Web Scraping: ENABLED")
print("🧠 PATHsassin Analysis: INTEGRATED")
print("📊 Content Generation: OPERATIONAL")
print("")
print("📋 INTEGRATION STEPS:")
print("1. Add AgentGPTScraper class to your system")
print("2. Call add_agentgpt_endpoints(app, agent, content_reactor)")
print("3. Install dependencies: pip install aiohttp beautifulsoup4")
print("4. Test scraping with /api/agentgpt/scrape")
print("")
print("✅ Ready to scrape the web for viral content with PATHsassin intelligence!") 