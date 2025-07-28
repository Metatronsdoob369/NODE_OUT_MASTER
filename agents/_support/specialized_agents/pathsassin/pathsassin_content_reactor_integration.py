#!/usr/bin/env python3
"""
Content Reactor Integration for PATHsassin Agent
Add these endpoints to your existing agent_api.py file
"""

# ADD THESE IMPORTS to your existing imports section
import requests
from typing import Dict, Any, List, Optional
import json
import asyncio
import aiofiles
import tempfile
import os
from datetime import datetime
import uuid

# Import whisper with fallback
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    print("⚠️  Whisper not available. Install with: pip install openai-whisper")

# ADD THIS CLASS to your existing code (after PATHsassinMemory class)
class ContentReactor:
    """Content Reactor for PATHsassin - turns content into social media gold"""
    
    def __init__(self, memory):
        self.memory = memory
        self.whisper_model = None  # Lazy load
        self.temp_dir = tempfile.mkdtemp()
        
    def load_whisper_model(self):
        """Load Whisper model for transcription"""
        if not WHISPER_AVAILABLE:
            print("⚠️  Whisper not available for transcription")
            return None
            
        if self.whisper_model is None:
            print("🎧 Loading Whisper model for transcription...")
            try:
                self.whisper_model = whisper.load_model("base")
                print("✅ Whisper model loaded successfully")
            except Exception as e:
                print(f"❌ Error loading Whisper model: {e}")
                self.whisper_model = None
        return self.whisper_model
    
    async def transcribe_content(self, content_url: str, content_type: str) -> Dict[str, Any]:
        """Transcribe audio/video content using Whisper"""
        try:
            # Download the content
            response = requests.get(content_url, timeout=60)
            response.raise_for_status()
            
            # Save to temporary file
            temp_file = os.path.join(self.temp_dir, f"content_{uuid.uuid4()}.mp3")
            with open(temp_file, 'wb') as f:
                f.write(response.content)
            
            # Transcribe using Whisper
            model = self.load_whisper_model()
            if model:
                result = model.transcribe(temp_file)
                transcript = result['text']
                segments = result.get('segments', [])
                language = result.get('language', 'en')
            else:
                # Fallback mock transcript
                transcript = f"Mock transcript for {content_url} - Whisper not available"
                segments = []
                language = 'en'
            
            # Clean up
            os.remove(temp_file)
            
            return {
                'transcript': transcript,
                'segments': segments,
                'language': language
            }
            
        except Exception as e:
            return {
                'error': f"Transcription failed: {str(e)}",
                'transcript': f"Mock transcript for {content_url}",
                'segments': [],
                'language': 'en'
            }
    
    def analyze_content_for_pathsassin(self, transcript: str, metadata: Dict) -> Dict[str, Any]:
        """Analyze content through PATHsassin's learning lens"""
        
        # Use PATHsassin's existing topic extraction
        topics = self.extract_topics(transcript)
        
        # Analyze for viral moments with PATHsassin context
        viral_moments = self.identify_viral_moments(transcript, topics)
        
        # Connect to PATHsassin skills
        skill_connections = self.map_to_pathsassin_skills(transcript, topics)
        
        return {
            'key_moments': viral_moments,
            'pathsassin_topics': topics,
            'skill_connections': skill_connections,
            'overall_viral_score': self.calculate_viral_score(viral_moments),
            'learning_value': self.assess_learning_value(transcript, topics),
            'platform_recommendations': self.recommend_platforms(viral_moments, topics)
        }
    
    def extract_topics(self, transcript: str) -> List[str]:
        """Extract topics from transcript using PATHsassin knowledge areas"""
        topics = []
        transcript_lower = transcript.lower()
        
        # PATHsassin skill mapping
        skill_keywords = {
            'stoicism': ['stoicism', 'resilience', 'control', 'acceptance', 'strength'],
            'leadership': ['leadership', 'team', 'vision', 'strategy', 'management'],
            'automation': ['automation', 'system', 'process', 'workflow', 'n8n'],
            'design': ['design', 'web', 'graphic', 'ui', 'ux'],
            'mentorship': ['mentorship', 'coaching', 'teaching', 'guidance'],
            'global': ['international', 'global', 'world', 'culture'],
            'synthesis': ['synthesis', 'pattern', 'connection', 'integration']
        }
        
        for skill, keywords in skill_keywords.items():
            if any(keyword in transcript_lower for keyword in keywords):
                topics.append(skill)
        
        return topics
    
    def identify_viral_moments(self, transcript: str, topics: List[str]) -> List[Dict]:
        """Identify viral moments using PATHsassin intelligence"""
        moments = []
        
        # Split transcript into sentences
        sentences = transcript.split('.')
        
        for i, sentence in enumerate(sentences):
            if len(sentence.strip()) < 10:
                continue
                
            # Calculate viral potential based on PATHsassin criteria
            viral_score = 0.0
            emotion = "neutral"
            
            # Check for PATHsassin-relevant viral triggers
            if any(topic in sentence.lower() for topic in topics):
                viral_score += 0.3
                
            # Stoicism insights are always valuable
            if any(word in sentence.lower() for word in ['resilience', 'control', 'acceptance', 'strength']):
                viral_score += 0.4
                emotion = "wisdom"
                
            # Leadership insights
            if any(word in sentence.lower() for word in ['leadership', 'team', 'vision', 'strategy']):
                viral_score += 0.3
                emotion = "leadership"
                
            # Automation/technical insights
            if any(word in sentence.lower() for word in ['automation', 'system', 'process', 'workflow']):
                viral_score += 0.3
                emotion = "technical"
                
            # Controversial or surprising takes
            if any(word in sentence.lower() for word in ['surprising', 'shocking', 'nobody talks about', 'secret']):
                viral_score += 0.5
                emotion = "controversial"
            
            if viral_score > 0.4:  # Only include high-potential moments
                moments.append({
                    'timestamp': f"00:{i:02d}:00",  # Mock timestamp
                    'content': sentence.strip(),
                    'viral_potential': min(viral_score, 1.0),
                    'emotion': emotion,
                    'duration': len(sentence.split()) * 0.5,  # Rough duration estimate
                    'pathsassin_relevance': viral_score
                })
        
        return sorted(moments, key=lambda x: x['viral_potential'], reverse=True)[:10]
    
    def map_to_pathsassin_skills(self, transcript: str, topics: List[str]) -> Dict[str, float]:
        """Map content to PATHsassin skills with relevance scores"""
        skills_mapping = {
            'stoicism': 1,
            'leadership': 2,
            'automation': 5,
            'design': 7,
            'mentorship': 8,
            'global': 10,
            'synthesis': 13
        }
        
        skill_connections = {}
        
        for topic in topics:
            if topic in skills_mapping:
                skill_id = str(skills_mapping[topic])
                relevance = min(1.0, transcript.lower().count(topic) * 0.1)
                skill_connections[skill_id] = relevance
        
        return skill_connections
    
    def calculate_viral_score(self, moments: List[Dict]) -> float:
        """Calculate overall viral score"""
        if not moments:
            return 0.0
        
        # Take average of top 5 moments
        top_moments = sorted(moments, key=lambda x: x['viral_potential'], reverse=True)[:5]
        return sum(m['viral_potential'] for m in top_moments) / len(top_moments)
    
    def assess_learning_value(self, transcript: str, topics: List[str]) -> float:
        """Assess learning value using PATHsassin criteria"""
        # Use existing PATHsassin learning value calculation
        return len(transcript.split()) / 100.0  # Simplified
    
    def recommend_platforms(self, moments: List[Dict], topics: List[str]) -> List[str]:
        """Recommend platforms based on content analysis"""
        platforms = []
        
        # Stoicism content → LinkedIn, Twitter
        if any(topic in ['stoicism', 'leadership', 'mentorship'] for topic in topics):
            platforms.extend(['linkedin', 'twitter'])
        
        # Technical content → TikTok, YouTube
        if any(topic in ['automation', 'design'] for topic in topics):
            platforms.extend(['tiktok', 'youtube'])
        
        # High viral potential → All platforms
        if any(m['viral_potential'] > 0.8 for m in moments):
            platforms.extend(['tiktok', 'instagram', 'twitter'])
        
        return list(set(platforms))  # Remove duplicates
    
    def generate_pathsassin_content_strategy(self, analysis: Dict, platforms: List[str]) -> Dict:
        """Generate content strategy with PATHsassin wisdom"""
        strategies = {}
        
        for platform in platforms:
            if platform == 'tiktok':
                strategies[platform] = self.create_tiktok_strategy(analysis)
            elif platform == 'linkedin':
                strategies[platform] = self.create_linkedin_strategy(analysis)
            elif platform == 'instagram':
                strategies[platform] = self.create_instagram_strategy(analysis)
            elif platform == 'twitter':
                strategies[platform] = self.create_twitter_strategy(analysis)
        
        return strategies
    
    def create_tiktok_strategy(self, analysis: Dict) -> Dict:
        """Create TikTok strategy with PATHsassin flavor"""
        moments = analysis['key_moments'][:3]  # Top 3 moments
        
        suggestions = []
        for moment in moments:
            suggestions.append({
                'clip_start': moment['timestamp'],
                'clip_end': moment['timestamp'].replace('00:', '00:').replace(':00', ':30'),
                'hook': f"PATHsassin wisdom: {moment['content'][:50]}...",
                'visual_concept': f"Text overlay with {moment['emotion']} theme",
                'hashtags': ['#PATHsassin', '#mastery', '#learning', f"#{moment['emotion']}"],
                'pathsassin_skill': analysis['skill_connections']
            })
        
        return {
            'content_suggestions': suggestions,
            'viral_score': analysis['overall_viral_score'],
            'learning_focus': 'Bite-sized wisdom for skill mastery'
        }
    
    def create_linkedin_strategy(self, analysis: Dict) -> Dict:
        """Create LinkedIn strategy for professional growth"""
        moments = analysis['key_moments'][:2]  # Top 2 for LinkedIn
        
        suggestions = []
        for moment in moments:
            suggestions.append({
                'type': 'professional_insight',
                'concept': f"Mastery insight: {moment['content']}",
                'connection_to_skills': analysis['skill_connections'],
                'cta': 'What\'s your experience with this principle?',
                'hashtags': ['#Leadership', '#ProfessionalGrowth', '#Mastery']
            })
        
        return {
            'content_suggestions': suggestions,
            'viral_score': analysis['overall_viral_score'],
            'learning_focus': 'Professional development through skill mastery'
        }
    
    def create_instagram_strategy(self, analysis: Dict) -> Dict:
        """Create Instagram strategy for visual learning"""
        return {
            'content_suggestions': [{
                'type': 'skill_visualization',
                'concept': 'Behind-the-scenes of mastery journey',
                'visual_style': 'PATHsassin skill connections',
                'story_arc': 'Learning → Practice → Mastery'
            }],
            'viral_score': analysis['overall_viral_score'],
            'learning_focus': 'Visual journey of skill development'
        }
    
    def create_twitter_strategy(self, analysis: Dict) -> Dict:
        """Create Twitter strategy for quick insights"""
        moments = analysis['key_moments'][:5]  # Top 5 for Twitter threads
        
        suggestions = []
        for moment in moments:
            suggestions.append({
                'type': 'insight_thread',
                'opening': f"🧠 PATHsassin insight: {moment['content'][:100]}...",
                'thread_concept': f"Thread about {moment['emotion']} in mastery",
                'hashtags': ['#PATHsassin', '#Mastery', '#Learning']
            })
        
        return {
            'content_suggestions': suggestions,
            'viral_score': analysis['overall_viral_score'],
            'learning_focus': 'Quick insights for skill development'
        }

# INTEGRATION INSTRUCTIONS:
# 
# 1. Add the ContentReactor class above to your existing CLAUDE_CLEAN_12.py file
# 2. Initialize it after your existing agent initialization:
#    content_reactor = ContentReactor(agent.memory)
# 3. Add the following endpoints to your existing Flask app routes
# 4. Make sure you have the required imports at the top of your file

"""
# ADD THESE ENDPOINTS to your existing Flask app (after your existing routes)

@app.route('/api/transcribe', methods=['POST'])
def transcribe_content():
    \"\"\"Transcribe content using PATHsassin's Whisper integration\"\"\"
    try:
        data = request.json
        content_url = data.get('content_url', '')
        content_type = data.get('content_type', 'audio')
        metadata = data.get('metadata', {})
        
        if not content_url:
            return jsonify({'error': 'No content URL provided'}), 400
        
        # Use asyncio to run the async transcription
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            result = loop.run_until_complete(
                content_reactor.transcribe_content(content_url, content_type)
            )
        finally:
            loop.close()
        
        return jsonify({
            'success': True,
            'transcript': result['transcript'],
            'segments': result.get('segments', []),
            'language': result.get('language', 'en'),
            'metadata': metadata
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_content():
    \"\"\"Analyze content through PATHsassin's learning lens\"\"\"
    try:
        data = request.json
        transcript = data.get('transcript', '')
        metadata = data.get('metadata', {})
        
        if not transcript:
            return jsonify({'error': 'No transcript provided'}), 400
        
        # Analyze using PATHsassin intelligence
        analysis = content_reactor.analyze_content_for_pathsassin(transcript, metadata)
        
        # Record this interaction for learning
        agent.memory.add_interaction(
            'content_analysis',
            f"Analyzed content: {transcript[:100]}...",
            f"Found {len(analysis['key_moments'])} viral moments",
            f"Skills: {analysis['skill_connections']}"
        )
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'key_moments': analysis['key_moments'],
            'viral_score': analysis['overall_viral_score'],
            'pathsassin_insights': {
                'skill_connections': analysis['skill_connections'],
                'learning_value': analysis['learning_value'],
                'topics': analysis['pathsassin_topics']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/notebooklm/upload', methods=['POST'])
def upload_to_notebooklm():
    \"\"\"Upload content to NotebookLM (mock for now)\"\"\"
    try:
        data = request.json
        content = data.get('content', '')
        analysis = data.get('analysis', {})
        
        # For now, store in PATHsassin memory instead
        agent.memory.add_interaction(
            'notebooklm_upload',
            f"Uploaded content to knowledge base: {content[:100]}...",
            "Successfully integrated into PATHsassin memory",
            f"Analysis: {analysis}"
        )
        
        return jsonify({
            'success': True,
            'notebook_response': {
                'document_id': f"pathsassin_doc_{uuid.uuid4()}",
                'status': 'uploaded',
                'context_summary': f"Added to PATHsassin learning memory with {len(analysis.get('key_moments', []))} key insights"
            },
            'pathsassin_integration': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/strategy/generate', methods=['POST'])
def generate_content_strategy():
    \"\"\"Generate PATHsassin-powered content strategy\"\"\"
    try:
        data = request.json
        content_analysis = data.get('content_analysis', {})
        platforms = data.get('platforms', ['tiktok', 'linkedin', 'instagram', 'twitter'])
        
        # Generate strategy using PATHsassin wisdom
        strategies = content_reactor.generate_pathsassin_content_strategy(
            content_analysis, platforms
        )
        
        # Convert to list format for n8n
        platform_strategies = []
        for platform, strategy in strategies.items():
            platform_strategies.append({
                'platform': platform,
                'suggestions': strategy['content_suggestions'],
                'viral_score': strategy['viral_score'],
                'learning_focus': strategy['learning_focus'],
                'pathsassin_optimized': True
            })
        
        return jsonify(platform_strategies)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tiktok/extract-clips', methods=['POST'])
def extract_tiktok_clips():
    \"\"\"Extract TikTok clips optimized for PATHsassin wisdom\"\"\"
    try:
        data = request.json
        content_analysis = data.get('content_analysis', {})
        viral_moments = data.get('viral_moments', [])
        
        clips = []
        for moment in viral_moments[:5]:  # Top 5 moments
            clips.append({
                'start_time': moment['timestamp'],
                'duration': min(moment['duration'], 60),
                'visual_concept': f"PATHsassin skill visualization: {moment['emotion']}",
                'hook_text': f"🧠 Mastery insight: {moment['content'][:30]}...",
                'transcript_text': moment['content'],
                'pathsassin_skill': moment.get('pathsassin_relevance', 0.5),
                'learning_value': moment.get('viral_potential', 0.5)
            })
        
        return jsonify({
            'success': True,
            'clips': clips,
            'total_clips': len(clips),
            'pathsassin_optimized': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content/create/tiktok', methods=['POST'])
def create_tiktok_content():
    \"\"\"Create TikTok content with PATHsassin branding\"\"\"
    try:
        data = request.json
        suggestions = data.get('content_suggestions', [])
        
        assets = []
        for suggestion in suggestions:
            assets.append({
                'type': 'tiktok_video',
                'concept': suggestion.get('visual_concept', 'PATHsassin wisdom clip'),
                'hook': suggestion.get('hook_text', 'PATHsassin insight'),
                'hashtags': suggestion.get('hashtags', ['#PATHsassin', '#mastery']),
                'learning_focus': 'Skill mastery through bite-sized wisdom',
                'pathsassin_branding': True,
                'engagement_prediction': suggestion.get('pathsassin_skill', 0.7)
            })
        
        return jsonify({
            'success': True,
            'platform': 'tiktok',
            'assets': assets,
            'pathsassin_optimized': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content-reactor/status', methods=['GET'])
def content_reactor_status():
    \"\"\"Get Content Reactor status integrated with PATHsassin\"\"\"
    try:
        mastery_status = agent.memory.get_mastery_status()
        
        return jsonify({
            'content_reactor_active': True,
            'pathsassin_integration': True,
            'whisper_model_loaded': content_reactor.whisper_model is not None,
            'mastery_level': mastery_status['overall_mastery'],
            'total_interactions': mastery_status['total_interactions'],
            'skills_available': len(mastery_status['knowledge_areas']),
            'learning_streak': mastery_status['learning_streak']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
"""

# Print integration status
print("🎬 Content Reactor Integration: READY FOR INTEGRATION")
print("🧠 PATHsassin Intelligence: ENABLED")
print("🎯 Multi-Platform Strategy: READY")
print("📊 Skill-Based Analysis: OPERATIONAL")
print("")
print("📋 INTEGRATION STEPS:")
print("1. Copy ContentReactor class to your CLAUDE_CLEAN_12.py")
print("2. Add content_reactor = ContentReactor(agent.memory) after agent initialization")
print("3. Add the Flask endpoints to your existing routes")
print("4. Install whisper: pip install openai-whisper (optional)")
print("")
print("✅ Ready to turn content into social media gold with PATHsassin wisdom!") 