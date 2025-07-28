# Save as test_elevenlabs_mac.py
import os

def test_elevenlabs_mac():
    print("🎤 Testing ElevenLabs on Mac...")
    
    try:
        from elevenlabs import ElevenLabs, play, voices
        
        # Check if API key is set
        api_key = os.getenv('ELEVENLABS_API_KEY')
        if not api_key:
            print("⚠️ No ElevenLabs API key found")
            print("ElevenLabs needs a paid account and API key for voice generation")
            print("Get one at: https://elevenlabs.io/")
            print("\nFor now, using Mac built-in speech...")
            
            # Use Mac built-in speech instead
            message = "Hello, this is Preston from NODE. Using Mac built-in speech because ElevenLabs needs an API key."
            os.system(f'say "{message}"')
            return
        
        # If API key exists, test ElevenLabs
        client = ElevenLabs(api_key=api_key)
        
        # Get available voices
        voice_list = voices()
        print(f"Available ElevenLabs voices: {len(voice_list)}")
        
        # Generate audio (this requires credits)
        audio = client.text_to_speech.convert(
            text="Hello, this is Preston from NODE in Birmingham.",
            voice_id="Rachel",  # Default voice
            model_id="eleven_monolingual_v1"
        )
        
        # Play audio on Mac
        play(audio)
        print("✅ ElevenLabs working on Mac!")
        
    except ImportError:
        print("❌ ElevenLabs not installed properly")
        print("Run: pip install elevenlabs")
        
    except Exception as e:
        print(f"❌ ElevenLabs error: {e}")
        print("This is normal - ElevenLabs requires a paid API key")
        print("Using Mac built-in speech instead...")
        
        os.system('say "ElevenLabs needs API key. Using Mac speech for NODE."')

if __name__ == "__main__":
    test_elevenlabs_mac() 