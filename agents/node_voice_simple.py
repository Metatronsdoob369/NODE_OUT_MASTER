#!/usr/bin/env python3
"""
NODE Simple Voice System - Works with current ElevenLabs package level
"""

import os
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
import pygame
from io import BytesIO

# Load environment variables
load_dotenv()

class NodeSimpleVoice:
    def __init__(self):
        # Set API key from environment
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        if not self.api_key:
            raise ValueError("❌ ElevenLabs API key not found! Add it to .env file")
        
        # Initialize ElevenLabs client
        self.client = ElevenLabs(api_key=self.api_key)
        
        # Use real ElevenLabs voice IDs from your account
        self.voices = {
            "Rachel": "EXAVITQu4vr4xnSDxMaL",  # Sarah voice
            "Drew": "JBFqnCBsd6RMkjVDRZzb",    # George voice
            "Paul": "nPczCjzI2devNBz1zQrb",    # Brian voice
            "Antoni": "iP95p4xoKVk53GoZ742B"   # Chris voice
        }
        
        print(f"✅ Connected to ElevenLabs with API key")
        print(f"📊 Available voices: {len(self.voices)}")
        print("🎤 Using fallback voices for your package level")
    
    def preston_speaks(self, message, voice_name="Drew", save_file=None):
        """Preston's voice for NODE"""
        
        voice_id = self.voices.get(voice_name, self.voices["Drew"])
        
        try:
            print(f"🎤 Preston speaking with {voice_name} voice...")
            
            # Generate audio using text-to-speech
            audio = self.client.text_to_speech.convert(
                text=message,
                voice_id=voice_id,
                model_id="eleven_monolingual_v1"
            )
            
            # Save to file if requested
            if save_file:
                with open(save_file, 'wb') as f:
                    for chunk in audio:
                        f.write(chunk)
                print(f"💾 Saved to {save_file}")
            
            # Play audio immediately
            pygame.mixer.init()
            audio_bytes = b''.join(audio)
            audio_io = BytesIO(audio_bytes)
            
            pygame.mixer.music.load(audio_io)
            pygame.mixer.music.play()
            
            # Wait for playback to complete
            while pygame.mixer.music.get_busy():
                pygame.time.wait(100)
            
            print("✅ Voice playback complete!")
            return True
            
        except Exception as e:
            print(f"❌ Voice error: {e}")
            # Fallback to Mac speech
            os.system(f'say "{message}"')
            return False
    
    def create_agent_voicemail(self, agent_name, brokerage="", voice_name="Drew"):
        """Create voicemail for Birmingham real estate agent"""
        
        # Import and use the generated voice scripts
        from voice_scripts_generated import get_script
        
        # Use the automated call script for the selected voice
        message = get_script(voice_name, 'automated_call_scripts')
        
        print(f"📞 Creating voicemail for {agent_name} at {brokerage}...")
        
        # Save voicemail file
        filename = f"NODE_voicemail_{agent_name.replace(' ', '_')}.mp3"
        
        success = self.preston_speaks(
            message, 
            voice_name=voice_name,
            save_file=filename
        )
        
        if success:
            print(f"🎉 Voicemail complete!")
            print(f"📁 File saved: {filename}")
        
        return {
            'success': success,
            'message': message,
            'file': filename if success else None,
            'agent': agent_name,
            'voice_used': voice_name
        }
    
    def test_voices(self, test_message="Hello, this is Preston from NODE in Birmingham"):
        """Test available voices"""
        print("🎵 Testing available voices...")
        
        for voice_name in self.voices.keys():
            print(f"\n🎤 Testing {voice_name}...")
            self.preston_speaks(f"{test_message}. This is voice {voice_name}.", voice_name)
            
            choice = input(f"Like {voice_name}? (y/n/q to quit): ").lower()
            if choice == 'q':
                break
            elif choice == 'y':
                print(f"✅ {voice_name} marked as preferred!")
        
        print("🎯 Voice testing complete!")

# Test the system
if __name__ == "__main__":
    try:
        print("🏢 Initializing NODE Simple Voice System...")
        voice_system = NodeSimpleVoice()
        
        # Test voice system with clever demo
        print("\n🎤 Testing voice system...")
        from voice_scripts_generated import get_script
        test_message = get_script('Drew', 'voice_test_demos')
        voice_system.preston_speaks(test_message)
        
        # Create sample agent voicemail
        print("\n📞 Creating sample agent voicemail...")
        result = voice_system.create_agent_voicemail(
            "Sarah Johnson", 
            "Keller Williams",
            "Drew"  # Professional male voice
        )
        
        print(f"\n🎉 NODE Voice System Results:")
        print(f"✅ Success: {result['success']}")
        print(f"📁 File: {result['file']}")
        print(f"🎤 Voice: {result['voice_used']}")
        
        print("\n🚀 NODE is ready for agent outreach!")
        
    except Exception as e:
        print(f"❌ Setup error: {e}")
        print("Make sure to add your ElevenLabs API key to .env file") 