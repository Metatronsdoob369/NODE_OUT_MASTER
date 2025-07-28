import os
from dotenv import load_dotenv
from elevenlabs import ElevenLabs, Voice
import pygame
from io import BytesIO

# Load environment variables
load_dotenv()

class NodeCreatorVoice:
    def __init__(self):
        # Set API key from environment
        self.api_key = os.getenv('ELEVENLABS_API_KEY')
        if not self.api_key:
            raise ValueError("❌ ElevenLabs API key not found! Add it to .env file")
        
        # Initialize ElevenLabs client
        self.client = ElevenLabs(api_key=self.api_key)
        
        # Get available voices from Creator package
        self.voices = self.get_creator_voices()
        print(f"✅ Connected to ElevenLabs Creator package")
        print(f"📊 Available voices: {len(self.voices)}")
    
    def get_creator_voices(self):
        """Get all available voices from Creator package"""
        try:
            voice_list = self.client.voices.get_all()
            voice_dict = {}
            
            print("🎤 Available Creator Package Voices:")
            for voice in voice_list.voices:
                voice_dict[voice.name] = voice.voice_id
                print(f"  • {voice.name} ({voice.voice_id})")
            
            return voice_dict
            
        except Exception as e:
            print(f"Error getting voices: {e}")
            print("Using fallback voices for your package level...")
            # Fallback to known good voices that work with most packages
            return {
                "Rachel": "21m00Tcm4TlvDq8ikWAM",
                "Drew": "29vD33N1CtxCmqQRPOHJ", 
                "Paul": "5Q0t7uMcjvnagumLfvZi",
                "Bella": "EXAVITQu4vr4xnSDxMaL",
                "Antoni": "ErXwobaYiN019PkySvjV"
            }
    
    def preston_speaks_creator(self, message, voice_name="Drew", save_file=None):
        """Preston's premium Creator voice for NODE"""
        
        voice_id = self.voices.get(voice_name, list(self.voices.values())[0])
        
        try:
            print(f"🎤 Preston speaking with {voice_name} voice...")
            
            # Generate audio using Creator package
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
            
            print("✅ Creator voice playback complete!")
            return True
            
        except Exception as e:
            print(f"❌ Creator voice error: {e}")
            # Fallback to Mac speech
            os.system(f'say "{message}"')
            return False
    
    def create_premium_agent_voicemail(self, agent_name, brokerage="", voice_name="Drew"):
        """Create premium voicemail for Birmingham real estate agent"""
        
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
        
        print(f"📞 Creating premium voicemail for {agent_name} at {brokerage}...")
        
        # Save voicemail file
        filename = f"NODE_voicemail_{agent_name.replace(' ', '_')}.mp3"
        
        success = self.preston_speaks_creator(
            message, 
            voice_name=voice_name,
            save_file=filename
        )
        
        if success:
            print(f"🎉 Premium Creator voicemail complete!")
            print(f"📁 File saved: {filename}")
        
        return {
            'success': success,
            'message': message,
            'file': filename if success else None,
            'agent': agent_name,
            'voice_used': voice_name
        }
    
    def test_all_voices(self, test_message="Hello, this is Preston from NODE in Birmingham"):
        """Test all available Creator voices"""
        print("🎵 Testing all Creator package voices...")
        
        for voice_name in list(self.voices.keys())[:5]:  # Test first 5 voices
            print(f"\n🎤 Testing {voice_name}...")
            self.preston_speaks_creator(f"{test_message}. This is voice {voice_name}.", voice_name)
            
            choice = input(f"Like {voice_name}? (y/n/q to quit): ").lower()
            if choice == 'q':
                break
            elif choice == 'y':
                print(f"✅ {voice_name} marked as preferred!")
        
        print("🎯 Voice testing complete!")

# Test the Creator system
if __name__ == "__main__":
    try:
        print("🏢 Initializing NODE Creator Voice System...")
        voice_system = NodeCreatorVoice()
        
        # Test Preston's voice
        print("\n🎤 Testing Preston's premium voice...")
        voice_system.preston_speaks_creator(
            "Hello, this is Preston from NODE in Birmingham, Alabama. Our premium Creator voice system is now operational and ready for professional real estate agent outreach."
        )
        
        # Create sample agent voicemail
        print("\n📞 Creating sample agent voicemail...")
        result = voice_system.create_premium_agent_voicemail(
            "Sarah Johnson", 
            "Keller Williams",
            "Drew"  # Professional male voice
        )
        
        print(f"\n🎉 NODE Creator Voice System Results:")
        print(f"✅ Success: {result['success']}")
        print(f"📁 File: {result['file']}")
        print(f"🎤 Voice: {result['voice_used']}")
        
        print("\n🚀 NODE is ready for premium agent outreach!")
        
    except Exception as e:
        print(f"❌ Setup error: {e}")
        print("Make sure to add your ElevenLabs API key to .env file") 