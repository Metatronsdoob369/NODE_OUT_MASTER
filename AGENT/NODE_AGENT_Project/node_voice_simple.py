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
        
        # Use known working voices for your package level
        self.voices = {
            "Rachel": "21m00Tcm4TlvDq8ikWAM",
            "Drew": "29vD33N1CtxCmqQRPOHJ", 
            "Paul": "5Q0t7uMcjvnagumLfvZi",
            "Bella": "EXAVITQu4vr4xnSDxMaL",
            "Antoni": "ErXwobaYiN019PkySvjV"
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
        
        message = f"""
        Hi {agent_name}, this is Preston from NODE here in Birmingham, Alabama. 
        
        I hope you're having a great day! I'm reaching out because there have been 
        some significant insurance law changes affecting roof claims that directly 
        impact your listings in the Birmingham area.
        
        {f"I've been working with several agents at {brokerage} and around Birmingham" if brokerage else "I've been working with agents around Birmingham"}
        to help them understand how these changes affect their transactions. 
        
        I'd love to buy you a coffee and share what we're seeing in the market - 
        it might help you avoid some potential closing delays.
        
        You can reach me directly at 205-307-9153, or visit us online.
        
        Thanks {agent_name}, and have a great rest of your day!
        """
        
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
        
        # Test Preston's voice
        print("\n🎤 Testing Preston's voice...")
        voice_system.preston_speaks(
            "Hello, this is Preston from NODE in Birmingham, Alabama. Our voice system is now operational and ready for professional real estate agent outreach."
        )
        
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