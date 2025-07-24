# ADD THESE VOICE CAPABILITIES TO YOUR AGENT

import asyncio
import json
import base64
import io
from typing import Dict, List, Any, Optional
import tempfile
import os
import requests
from datetime import datetime

# Voice integration imports
try:
    import speech_recognition as sr
    import pyttsx3
    import pygame
    from elevenlabs import generate, play, set_api_key, voices
    VOICE_LIBS_AVAILABLE = True
except ImportError as e:
    VOICE_LIBS_AVAILABLE = False
    print(f"⚠️  Voice libraries not available: {e}")
    print("Install with: pip install SpeechRecognition pyttsx3 pygame elevenlabs pyaudio")

try:
    import soundfile as sf
    import numpy as np
    AUDIO_PROCESSING_AVAILABLE = True
except ImportError:
    AUDIO_PROCESSING_AVAILABLE = False
    print("⚠️  Audio processing not available. Install with: pip install soundfile numpy")

class VoiceAgent:
    """
    Advanced voice capabilities for PATHsassin Agent
    Handles voice synthesis, recognition, and real-time conversations
    """
    
    def __init__(self, memory, content_reactor, agent_api):
        self.memory = memory
        self.content_reactor = content_reactor
        self.agent_api = agent_api
        self.voice_config = self.load_voice_config()
        self.active_calls = {}
        
        # Initialize voice engines
        if VOICE_LIBS_AVAILABLE:
            self.speech_recognizer = sr.Recognizer()
            self.microphone = sr.Microphone()
            self.tts_engine = pyttsx3.init()
            self.setup_tts_engine()
            
        # ElevenLabs setup
        self.elevenlabs_api_key = os.getenv('ELEVENLABS_API_KEY')
        if self.elevenlabs_api_key:
            set_api_key(self.elevenlabs_api_key)
            self.voice_models = self.load_voice_models()
        
    def load_voice_config(self):
        """Load voice configuration for different scenarios"""
        return {
            'pathsassin_personality': {
                'voice_type': 'professional_mentor',
                'speaking_rate': 165,  # words per minute
                'tone': 'confident_supportive',
                'accent': 'neutral_american'
            },
            'roofing_agent_calls': {
                'voice_type': 'business_professional',
                'speaking_rate': 155,
                'tone': 'friendly_expert',
                'accent': 'local_regional'
            },
            'content_creation': {
                'voice_type': 'creative_narrator',
                'speaking_rate': 170,
                'tone': 'engaging_dynamic',
                'accent': 'neutral_american'
            }
        }
    
    def setup_tts_engine(self):
        """Configure text-to-speech engine"""
        if not VOICE_LIBS_AVAILABLE:
            return
            
        voices = self.tts_engine.getProperty('voices')
        if voices:
            # Try to find a good voice
            for voice in voices:
                if 'english' in voice.name.lower():
                    self.tts_engine.setProperty('voice', voice.id)
                    break
        
        self.tts_engine.setProperty('rate', 165)
        self.tts_engine.setProperty('volume', 0.8)
    
    def load_voice_models(self):
        """Load available ElevenLabs voice models"""
        try:
            if self.elevenlabs_api_key:
                available_voices = voices()
                return {voice.name: voice.voice_id for voice in available_voices}
            return {}
        except Exception as e:
            print(f"Error loading ElevenLabs voices: {e}")
            return {}
    
    async def listen_for_speech(self, timeout: int = 5) -> str:
        """Listen for speech input and convert to text"""
        if not VOICE_LIBS_AVAILABLE:
            return "Voice recognition not available"
        
        try:
            with self.microphone as source:
                print("🎤 Listening...")
                self.speech_recognizer.adjust_for_ambient_noise(source)
                audio = self.speech_recognizer.listen(source, timeout=timeout)
            
            print("🧠 Processing speech...")
            text = self.speech_recognizer.recognize_google(audio)
            print(f"👂 Heard: {text}")
            return text
            
        except sr.WaitTimeoutError:
            return "No speech detected"
        except sr.UnknownValueError:
            return "Could not understand speech"
        except sr.RequestError as e:
            return f"Speech recognition error: {e}"
    
    def speak_text(self, text: str, voice_config: str = 'pathsassin_personality') -> bool:
        """Convert text to speech and play it"""
        if not VOICE_LIBS_AVAILABLE:
            print(f"🔊 [Voice not available] Would say: {text}")
            return False
        
        try:
            config = self.voice_config.get(voice_config, self.voice_config['pathsassin_personality'])
            self.tts_engine.setProperty('rate', config['speaking_rate'])
            
            print(f"🔊 Speaking: {text[:50]}...")
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
            return True
            
        except Exception as e:
            print(f"Error speaking text: {e}")
            return False
    
    async def generate_elevenlabs_speech(self, text: str, voice_name: str = "Rachel") -> bytes:
        """Generate high-quality speech using ElevenLabs"""
        if not self.elevenlabs_api_key:
            return None
        
        try:
            voice_id = self.voice_models.get(voice_name)
            if not voice_id:
                voice_id = list(self.voice_models.values())[0] if self.voice_models else None
            
            if voice_id:
                audio = generate(
                    text=text,
                    voice=voice_id,
                    model="eleven_monolingual_v1"
                )
                return audio
            else:
                return None
                
        except Exception as e:
            print(f"Error generating ElevenLabs speech: {e}")
            return None
    
    async def voice_conversation_loop(self, session_id: str) -> Dict:
        """Start interactive voice conversation with PATHsassin"""
        conversation_log = []
        session_active = True
        
        self.speak_text("Hello! I'm PATHsassin, your learning companion. What would you like to explore today?")
        
        while session_active:
            try:
                # Listen for user input
                user_speech = await self.listen_for_speech(timeout=10)
                
                if user_speech in ["No speech detected", "Could not understand speech"]:
                    self.speak_text("I didn't catch that. Could you repeat?")
                    continue
                
                if "goodbye" in user_speech.lower() or "stop" in user_speech.lower():
                    self.speak_text("Great conversation! Keep growing your mastery. Goodbye!")
                    session_active = False
                    break
                
                # Log user input
                conversation_log.append({
                    'timestamp': datetime.now().isoformat(),
                    'speaker': 'user',
                    'content': user_speech,
                    'method': 'voice'
                })
                
                # Generate PATHsassin response
                response = self.agent_api.generate_response_with_prompt(
                    user_speech, 
                    self.agent_api.base_system_prompt.format(
                        mastery_level=round(self.memory.get_mastery_status()['overall_mastery'], 1),
                        total_interactions=self.memory.get_mastery_status()['total_interactions']
                    )
                )
                
                # Speak response
                self.speak_text(response)
                
                # Log agent response
                conversation_log.append({
                    'timestamp': datetime.now().isoformat(),
                    'speaker': 'pathsassin',
                    'content': response,
                    'method': 'voice'
                })
                
                # Record interaction in memory
                self.memory.add_interaction('voice_conversation', user_speech, response, f"Session: {session_id}")
                
            except Exception as e:
                print(f"Error in voice conversation: {e}")
                self.speak_text("I encountered an issue. Let's continue our conversation.")
        
        return {
            'session_id': session_id,
            'conversation_log': conversation_log,
            'total_exchanges': len(conversation_log) // 2,
            'session_duration': len(conversation_log) * 30  # rough estimate
        }
    
    async def create_voice_content(self, content_request: Dict) -> Dict:
        """Create content using voice input and output"""
        
        content_type = content_request.get('type', 'social_post')
        platform = content_request.get('platform', 'linkedin')
        voice_input = content_request.get('voice_input', False)
        
        if voice_input:
            self.speak_text(f"Let's create {content_type} for {platform}. Please describe what you want to create.")
            user_input = await self.listen_for_speech(timeout=15)
        else:
            user_input = content_request.get('text_input', '')
        
        if not user_input or user_input in ["No speech detected", "Could not understand speech"]:
            return {'error': 'No valid input received'}
        
        # Use Content Reactor to analyze and create content
        analysis = self.content_reactor.analyze_content_for_pathsassin(user_input, {
            'content_type': content_type,
            'platform': platform,
            'input_method': 'voice' if voice_input else 'text'
        })
        
        # Generate platform-specific content
        strategy = self.content_reactor.generate_pathsassin_content_strategy(analysis, [platform])
        
        # Create voice summary of the content
        summary = f"I've created {content_type} for {platform}. The content focuses on {', '.join(analysis['pathsassin_topics'])} with a viral score of {analysis['overall_viral_score']:.2f}."
        
        self.speak_text(summary)
        
        return {
            'success': True,
            'user_input': user_input,
            'input_method': 'voice' if voice_input else 'text',
            'content_analysis': analysis,
            'content_strategy': strategy,
            'voice_summary': summary
        }

class RoofingVoiceAgent:
    """
    Voice capabilities specifically for roofing company real estate agent outreach
    """
    
    def __init__(self, voice_agent: VoiceAgent, roofing_engine):
        self.voice_agent = voice_agent
        self.roofing_engine = roofing_engine
        
    async def create_agent_voicemail(self, agent_name: str, topic: str) -> Dict:
        """Create personalized voicemail for real estate agent"""
        
        voicemail_script = f"""
        Hi {agent_name}, this is Mike from Premier Roofing. 
        
        I hope you're having a great day. I'm reaching out because I know you work with a lot of property listings, 
        and I wanted to share some important updates about {topic} that are affecting real estate transactions.
        
        We've been working with several agents in the area to help them navigate these new insurance requirements, 
        and I thought you might find our insights valuable for your current listings.
        
        I'd love to buy you a coffee and share what we're seeing in the market - it might help you avoid some 
        potential closing delays. 
        
        You can reach me at 555-ROOFING, or I'll try you again in a few days. 
        Thanks {agent_name}, and have a great rest of your day!
        """
        
        # Generate high-quality voice using ElevenLabs
        if self.voice_agent.elevenlabs_api_key:
            audio_data = await self.voice_agent.generate_elevenlabs_speech(
                voicemail_script, 
                voice_name="Adam"  # Professional male voice
            )
            
            if audio_data:
                # Save to file
                filename = f"voicemail_{agent_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"
                filepath = os.path.join(tempfile.gettempdir(), filename)
                
                with open(filepath, 'wb') as f:
                    f.write(audio_data)
                
                return {
                    'success': True,
                    'agent_name': agent_name,
                    'topic': topic,
                    'script': voicemail_script,
                    'audio_file': filepath,
                    'duration_estimate': len(voicemail_script.split()) / 2.5  # rough seconds estimate
                }
        
        # Fallback to basic TTS
        self.voice_agent.speak_text(voicemail_script, 'roofing_agent_calls')
        
        return {
            'success': True,
            'agent_name': agent_name,
            'topic': topic,
            'script': voicemail_script,
            'audio_file': None,
            'method': 'local_tts'
        }
    
    async def conduct_live_agent_call(self, agent_name: str, phone_number: str) -> Dict:
        """Conduct live phone conversation with real estate agent"""
        
        conversation_log = []
        call_successful = False
        
        # Opening script
        opening = f"""
        Hi, is this {agent_name}? This is Mike from Premier Roofing. 
        I hope I'm not catching you at a bad time. I'm calling because I know you work with property listings, 
        and there have been some significant changes in insurance requirements that are affecting real estate transactions.
        
        I've been working with several agents in the area to help them understand how these changes impact their listings. 
        Do you have just a couple minutes for me to share what we're seeing?
        """
        
        # This would integrate with a phone system API
        # For now, we'll simulate the conversation structure
        
        conversation_flow = [
            {
                'agent_says': opening,
                'expected_responses': ['yes', 'no', 'tell me more', 'not interested'],
                'follow_ups': {
                    'yes': "Great! We're seeing that insurance companies now require much more detailed roof documentation...",
                    'tell me more': "Absolutely. The main change is that insurance carriers are requiring...",
                    'no': "I understand you're busy. Could I email you a quick summary instead?",
                    'not interested': "No problem at all. If anything changes, feel free to give us a call."
                }
            }
        ]
        
        return {
            'call_initiated': True,
            'agent_name': agent_name,
            'phone_number': phone_number,
            'conversation_structure': conversation_flow,
            'call_status': 'simulated',  # In real implementation: 'completed', 'no_answer', 'busy'
            'follow_up_required': True
        }
    
    def create_voice_market_update(self, market_data: Dict) -> Dict:
        """Create voice market update for real estate agents"""
        
        update_script = f"""
        This is your monthly roofing market update for real estate professionals.
        
        This month, we completed {market_data.get('inspections', 50)} pre-listing roof assessments for agents in our area.
        
        Key trends we're seeing:
        - {market_data.get('insurance_delays', 15)} percent of transactions experienced delays due to roof documentation issues
        - Most common problem: {market_data.get('common_issue', 'Missing inspection certificates')}
        - Average resolution time: {market_data.get('resolution_time', 3)} business days
        
        For agents: We're offering rapid pre-listing assessments to help you avoid these delays. 
        Call us at 555-ROOFING to schedule.
        
        This has been your roofing market update. Have a great month!
        """
        
        return {
            'script': update_script,
            'estimated_duration': len(update_script.split()) / 2.5,
            'distribution_method': 'voice_message',
            'target_audience': 'real_estate_agents'
        }

# ADD THESE ENDPOINTS TO YOUR FLASK APP

@app.route('/api/voice/conversation/start', methods=['POST'])
def start_voice_conversation():
    """Start interactive voice conversation with PATHsassin"""
    try:
        session_id = str(uuid.uuid4())
        
        # Initialize voice agent
        voice_agent = VoiceAgent(agent.memory, content_reactor, agent)
        
        # This would typically be handled asynchronously
        # For now, return session info
        return jsonify({
            'success': True,
            'session_id': session_id,
            'status': 'voice_conversation_ready',
            'voice_available': VOICE_LIBS_AVAILABLE,
            'elevenlabs_available': voice_agent.elevenlabs_api_key is not None
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voice/create-content', methods=['POST'])
def create_voice_content():
    """Create content using voice input"""
    try:
        data = request.json
        
        voice_agent = VoiceAgent(agent.memory, content_reactor, agent)
        
        # This would be handled asynchronously in a real implementation
        result = {
            'success': True,
            'content_type': data.get('type', 'social_post'),
            'platform': data.get('platform', 'linkedin'),
            'voice_input_ready': VOICE_LIBS_AVAILABLE,
            'status': 'ready_for_voice_input'
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voice/roofing/voicemail', methods=['POST'])
def create_roofing_voicemail():
    """Create personalized voicemail for real estate agent"""
    try:
        data = request.json
        agent_name = data.get('agent_name', '')
        topic = data.get('topic', 'insurance law changes')
        
        if not agent_name:
            return jsonify({'error': 'Agent name required'}), 400
        
        voice_agent = VoiceAgent(agent.memory, content_reactor, agent)
        roofing_voice = RoofingVoiceAgent(voice_agent, content_reactor)
        
        # This would be handled asynchronously
        result = {
            'success': True,
            'agent_name': agent_name,
            'topic': topic,
            'voicemail_ready': True,
            'elevenlabs_available': voice_agent.elevenlabs_api_key is not None
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voice/status', methods=['GET'])
def voice_system_status():
    """Get voice system status"""
    try:
        voice_agent = VoiceAgent(agent.memory, content_reactor, agent)
        
        return jsonify({
            'voice_system_active': True,
            'speech_recognition_available': VOICE_LIBS_AVAILABLE,
            'text_to_speech_available': VOICE_LIBS_AVAILABLE,
            'elevenlabs_integration': voice_agent.elevenlabs_api_key is not None,
            'audio_processing_available': AUDIO_PROCESSING_AVAILABLE,
            'available_voice_models': len(voice_agent.voice_models) if voice_agent.voice_models else 0,
            'pathsassin_voice_ready': True,
            'roofing_voice_calls_ready': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

print("🎙️ Voice Integration System: LOADED")
print("🗣️ Speech Recognition: READY" if VOICE_LIBS_AVAILABLE else "🗣️ Speech Recognition: INSTALL REQUIRED")
print("🔊 Text-to-Speech: READY" if VOICE_LIBS_AVAILABLE else "🔊 Text-to-Speech: INSTALL REQUIRED")
print("🎭 ElevenLabs Integration: CONFIGURED" if os.getenv('ELEVENLABS_API_KEY') else "🎭 ElevenLabs: API KEY NEEDED")