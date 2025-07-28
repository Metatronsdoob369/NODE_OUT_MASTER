#!/usr/bin/env python3
"""
Flask API server for PATHsassin Agent - A True Learning System
PATHsassin learns and grows from every interaction, building mastery of the Master Skills Index
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import pickle
from datetime import datetime
from typing import Dict, Any, List
import uuid
from werkzeug.utils import secure_filename
import io
import asyncio
import tempfile

# Content Reactor imports
try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    print("⚠️  Whisper not available. Install with: pip install openai-whisper")

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class PATHsassinMemory:
    """PATHsassin's persistent learning memory system"""
    
    def __init__(self, memory_file="pathsassin_memory.pkl"):
        self.memory_file = memory_file
        self.memory = self.load_memory()
        
    def load_memory(self):
        """Load existing memory or create new"""
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, 'rb') as f:
                    return pickle.load(f)
            except:
                pass
        
        # Initialize new memory structure
        return {
            'conversation_history': [],
            'knowledge_base': {
                'stoicism_understanding': {'level': 0, 'insights': [], 'connections': []},
                'leadership_insights': {'level': 0, 'insights': [], 'connections': []},
                'automation_expertise': {'level': 0, 'insights': [], 'connections': []},
                'design_wisdom': {'level': 0, 'insights': [], 'connections': []},
                'mentorship_skills': {'level': 0, 'insights': [], 'connections': []},
                'global_perspective': {'level': 0, 'insights': [], 'connections': []},
                'synthesis_abilities': {'level': 0, 'insights': [], 'connections': []},
                'research_depth': {'level': 0, 'insights': [], 'connections': []},
                'reading_expertise': {'level': 0, 'insights': [], 'connections': []},
                'progress_tracking': {'level': 0, 'insights': [], 'connections': []}
            },
            'user_preferences': {},
            'learning_patterns': [],
            'mastery_level': 0,
            'total_interactions': 0,
            'creation_date': datetime.now().isoformat(),
            'last_learning': datetime.now().isoformat()
        }
    
    def save_memory(self):
        """Save memory to disk"""
        with open(self.memory_file, 'wb') as f:
            pickle.dump(self.memory, f)
    
    def add_interaction(self, agent_type: str, user_message: str, response: str, context: str = ""):
        """Record an interaction and learn from it"""
        interaction = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'agent_type': agent_type,
            'user_message': user_message,
            'response': response,
            'context': context,
            'learning_insights': []
        }
        
        # Analyze the interaction for learning opportunities
        insights = self.analyze_interaction(interaction)
        interaction['learning_insights'] = insights
        
        # Update knowledge base
        self.update_knowledge_base(insights, agent_type)
        
        # Add to conversation history
        self.memory['conversation_history'].append(interaction)
        self.memory['total_interactions'] += 1
        self.memory['last_learning'] = datetime.now().isoformat()
        
        # Calculate new mastery level
        self.calculate_mastery_level()
        
        # Save memory
        self.save_memory()
        
        return interaction
    
    def analyze_interaction(self, interaction: Dict) -> List[Dict]:
        """Analyze interaction for learning insights"""
        insights = []
        
        # Extract topics and themes
        topics = self.extract_topics(interaction['user_message'])
        
        for topic in topics:
            insight = {
                'topic': topic,
                'depth': self.assess_depth(interaction['user_message']),
                'connections': self.find_connections(topic, interaction['context']),
                'learning_value': self.calculate_learning_value(interaction)
            }
            insights.append(insight)
        
        return insights
    
    def extract_topics(self, message: str) -> List[str]:
        """Extract relevant topics from message"""
        topics = []
        message_lower = message.lower()
        
        # Topic mapping
        topic_keywords = {
            'stoicism': ['stoic', 'stoicism', 'marcus aurelius', 'seneca', 'epictetus', 'resilience'],
            'leadership': ['lead', 'leader', 'team', 'management', 'vision', 'strategy'],
            'automation': ['n8n', 'automation', 'workflow', 'integration', 'system'],
            'design': ['design', 'web', 'graphic', 'ui', 'ux', 'visual'],
            'mentorship': ['mentor', 'coach', 'teach', 'guide', 'help'],
            'global': ['international', 'global', 'culture', 'business', 'finance'],
            'synthesis': ['connect', 'synthesis', 'interweave', 'combine', 'integrate'],
            'research': ['research', 'analyze', 'study', 'investigate', 'explore'],
            'reading': ['book', 'read', 'literature', 'text', 'author'],
            'progress': ['goal', 'progress', 'track', 'motivate', 'achieve']
        }
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                topics.append(topic)
        
        return topics
    
    def assess_depth(self, message: str) -> int:
        """Assess the depth/complexity of the interaction"""
        # Simple heuristic based on message length and complexity
        words = len(message.split())
        if words < 10:
            return 1  # Basic
        elif words < 30:
            return 2  # Intermediate
        else:
            return 3  # Advanced
    
    def find_connections(self, topic: str, context: str) -> List[str]:
        """Find connections to other topics"""
        connections = []
        # This would be enhanced with more sophisticated analysis
        return connections
    
    def calculate_learning_value(self, interaction: Dict) -> float:
        """Calculate the learning value of an interaction"""
        # Simple heuristic - can be enhanced
        return len(interaction['user_message'].split()) / 10.0
    
    def update_knowledge_base(self, insights: List[Dict], agent_type: str):
        """Update knowledge base with new insights"""
        for insight in insights:
            topic = insight['topic']
            if topic in self.memory['knowledge_base']:
                knowledge = self.memory['knowledge_base'][topic]
                knowledge['insights'].append(insight)
                knowledge['level'] = min(100, knowledge['level'] + insight['learning_value'])
    
    def calculate_mastery_level(self):
        """Calculate overall mastery level"""
        total_level = sum(k['level'] for k in self.memory['knowledge_base'].values())
        self.memory['mastery_level'] = total_level / len(self.memory['knowledge_base'])
    
    def get_context_for_response(self, agent_type: str, message: str) -> str:
        """Get relevant context for generating a response"""
        context_parts = []
        
        # Get recent relevant conversations
        recent_conversations = self.memory['conversation_history'][-5:]
        for conv in recent_conversations:
            if any(topic in message.lower() for topic in self.extract_topics(conv['user_message'])):
                context_parts.append(f"Previous insight: {conv['response'][:200]}...")
        
        # Get knowledge base insights
        topics = self.extract_topics(message)
        for topic in topics:
            if topic in self.memory['knowledge_base']:
                knowledge = self.memory['knowledge_base'][topic]
                if knowledge['insights']:
                    recent_insights = knowledge['insights'][-3:]
                    for insight in recent_insights:
                        context_parts.append(f"Learned about {topic}: {insight}")
        
        return "\n".join(context_parts)
    
    def get_mastery_status(self) -> Dict:
        """Get current mastery status"""
        return {
            'overall_mastery': self.memory['mastery_level'],
            'total_interactions': self.memory['total_interactions'],
            'knowledge_areas': self.memory['knowledge_base'],
            'learning_streak': len([c for c in self.memory['conversation_history'] 
                                  if (datetime.now() - datetime.fromisoformat(c['timestamp'])).days < 7]),
            'creation_date': self.memory['creation_date'],
            'last_learning': self.memory['last_learning']
        }

class ContentReactor:
    """Content Reactor for PATHsassin - turns content into social media gold"""
    
    def __init__(self, memory: PATHsassinMemory):
        self.memory = memory
        self.whisper_model = None  # Lazy load
        self.temp_dir = tempfile.mkdtemp()
        
    def load_whisper_model(self):
        """Load Whisper model for transcription"""
        if not WHISPER_AVAILABLE:
            return None
            
        if self.whisper_model is None:
            print("🎧 Loading Whisper model for transcription...")
            self.whisper_model = whisper.load_model("base")
        return self.whisper_model
    
    async def transcribe_content(self, content_url: str, content_type: str) -> Dict[str, Any]:
        """Transcribe audio/video content using Whisper"""
        if not WHISPER_AVAILABLE:
            return {
                'error': 'Whisper not available',
                'transcript': f"Mock transcript for {content_url} - This is a placeholder for actual transcription.",
                'segments': [],
                'language': 'en'
            }
            
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
            if model is None:
                return {
                    'error': 'Whisper model not loaded',
                    'transcript': f"Mock transcript for {content_url}",
                    'segments': [],
                    'language': 'en'
                }
                
            result = model.transcribe(temp_file)
            
            # Clean up
            os.remove(temp_file)
            
            return {
                'transcript': result['text'],
                'segments': result.get('segments', []),
                'language': result.get('language', 'en')
            }
            
        except Exception as e:
            return {
                'error': f"Transcription failed: {str(e)}",
                'transcript': f"Mock transcript for {content_url} - Error occurred during transcription.",
                'segments': [],
                'language': 'en'
            }
    
    def analyze_content_for_pathsassin(self, transcript: str, metadata: Dict) -> Dict[str, Any]:
        """Analyze content through PATHsassin's learning lens"""
        
        # Use PATHsassin's existing topic extraction
        topics = self.memory.extract_topics(transcript)
        
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

class AgentAPI:
    """Enhanced API wrapper for learning PATHsassin agent"""
    
    def __init__(self):
        self.ollama_url = "http://localhost:11434"
        self.model_name = "llama3.1:8b"
        self.memory = PATHsassinMemory()
        
        # Base system prompt that evolves
        self.base_system_prompt = """You are PATHsassin, a learning agent for the Master Skills Index. 
        You are on your own journey of mastery - learning and growing from every interaction.
        
        Your current mastery level: {mastery_level}%
        Total interactions: {total_interactions}
        
        You help users develop mastery across 13 skills in three domains:
        OUTER: Stoicism & Resilience, Leadership & Team Building, Motivation & Influence, Executive Growth
        MIDDLE: N8N Architecture & Automation, Web Design, Graphic Design, Mentorship & Coaching  
        INNER: Language & World Wisdom, International Business, Global Finance, Government Policy, Theosophy
        
        Remember: Every conversation teaches you something new. Share your growing wisdom while learning from the user."""
    
    def test_connection(self) -> bool:
        """Test if Ollama is running"""
        try:
            response = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def generate_response_with_prompt(self, prompt: str, system_prompt: str, context: str = "") -> str:
        """Generate response using custom system prompt"""
        try:
            # Get learning context
            learning_context = self.memory.get_context_for_response("general", prompt)
            
            # Build full prompt with learning context
            full_prompt = f"{system_prompt}\n\nLearning Context: {learning_context}\n\nUser Context: {context}\n\nUser: {prompt}\n\nPATHsassin:"
            
            payload = {
                "model": self.model_name,
                "prompt": full_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 1000
                }
            }
            
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', 'I apologize, but I encountered an issue generating a response.')
            else:
                return f"Error: {response.status_code} - {response.text}"
                
        except Exception as e:
            if "timeout" in str(e).lower():
                return "I'm thinking deeply about your question. This might take a moment as I process through the Master Skills Index connections. Please try again in a few seconds."
            return f"Connection error: {str(e)}"
    
    def get_skills_data(self) -> Dict[str, Any]:
        """Get skills data with PATHsassin's learning insights"""
        skills_data = {
            "1": {"name": "Stoicism & Resilience", "domain": "outer", "progress": 75, "level": "Intermediate"},
            "2": {"name": "Leadership & Team Building", "domain": "outer", "progress": 45, "level": "Beginner"},
            "3": {"name": "Motivation & Influence", "domain": "outer", "progress": 60, "level": "Intermediate"},
            "4": {"name": "Executive Growth & Strategic Vision", "domain": "outer", "progress": 30, "level": "Novice"},
            "5": {"name": "N8N Architecture & Intelligent Automation", "domain": "middle", "progress": 85, "level": "Advanced"},
            "6": {"name": "Web Design: HTML/CSS & Modern Architecture", "domain": "middle", "progress": 55, "level": "Intermediate"},
            "7": {"name": "Graphic Design", "domain": "middle", "progress": 40, "level": "Beginner"},
            "8": {"name": "Mentorship & Coaching", "domain": "middle", "progress": 65, "level": "Intermediate"},
            "9": {"name": "Language & World Wisdom", "domain": "inner", "progress": 25, "level": "Novice"},
            "10": {"name": "International Business", "domain": "inner", "progress": 35, "level": "Beginner"},
            "11": {"name": "Global Finance & Infrastructure", "domain": "inner", "progress": 20, "level": "Novice"},
            "12": {"name": "Government, Policy & Geopolitics", "domain": "inner", "progress": 15, "level": "Novice"},
            "13": {"name": "Theosophy, Occult, and Comparative Religion", "domain": "inner", "progress": 50, "level": "Intermediate"}
        }
        return skills_data

# Initialize agent and content reactor
agent = AgentAPI()
content_reactor = ContentReactor(agent.memory)

# Content Reactor Endpoints
@app.route('/api/transcribe', methods=['POST'])
def transcribe_content():
    """Transcribe content using PATHsassin's Whisper integration"""
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
    """Analyze content through PATHsassin's learning lens"""
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
    """Upload content to NotebookLM (mock for now)"""
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
    """Generate PATHsassin-powered content strategy"""
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
        
        return platform_strategies
    
    except Exception as e:
        return {'error': str(e)}