#!/usr/bin/env python3
"""
ElevenLabs API Setup Script for NODE AI Platform
"""

import os
import sys
from pathlib import Path

def setup_elevenlabs():
    """Setup ElevenLabs API key and test integration"""
    
    print("🎤 ElevenLabs API Setup for NODE AI Platform")
    print("=" * 50)
    
    # Check if API key is already set
    api_key = os.getenv('ELEVENLABS_API_KEY')
    
    if api_key:
        print(f"✅ ElevenLabs API key found: {api_key[:10]}...")
    else:
        print("❌ ElevenLabs API key not found")
        print("\n📋 To get your API key:")
        print("1. Go to https://elevenlabs.io/")
        print("2. Sign up or log in")
        print("3. Go to Profile Settings")
        print("4. Copy your API key")
        print("\n🔧 Set your API key:")
        print("Option 1: Export in terminal:")
        print("   export ELEVENLABS_API_KEY='your-api-key-here'")
        print("\nOption 2: Add to ~/.zshrc:")
        print("   echo \"export ELEVENLABS_API_KEY='your-api-key-here'\" >> ~/.zshrc")
        print("   source ~/.zshrc")
        print("\nOption 3: Create .env file:")
        print("   echo 'ELEVENLABS_API_KEY=your-api-key-here' > .env")
        
        return False
    
    # Test ElevenLabs integration
    print("\n🧪 Testing ElevenLabs integration...")
    
    try:
        from elevenlabs import ElevenLabs
        
        client = ElevenLabs(api_key=api_key)
        
        # Test getting voices
        print("📞 Fetching available voices...")
        voice_list = client.voices.get_all()
        
        print(f"✅ Success! Found {len(voice_list.voices)} voices:")
        
        # Show available voices
        for i, voice in enumerate(voice_list.voices[:5]):  # Show first 5
            print(f"   {i+1}. {voice.name} (ID: {voice.voice_id})")
        
        if len(voice_list.voices) > 5:
            print(f"   ... and {len(voice_list.voices) - 5} more voices")
        
        # Test voice generation
        print("\n🎵 Testing voice generation...")
        test_message = "Hello, this is a test of the ElevenLabs integration for NODE AI Platform."
        
        # Use first available voice
        first_voice = voice_list.voices[0]
        
        audio = client.text_to_speech.convert(
            text=test_message,
            voice_id=first_voice.voice_id,
            model_id="eleven_monolingual_v1"
        )
        
        # Save test file
        test_filename = "elevenlabs_test.mp3"
        with open(test_filename, 'wb') as f:
            for chunk in audio:
                f.write(chunk)
        
        print(f"✅ Voice generation successful! Test file saved as: {test_filename}")
        print(f"🎤 Used voice: {first_voice.name}")
        
        return True
        
    except Exception as e:
        print(f"❌ ElevenLabs test failed: {str(e)}")
        print("\n🔧 Common issues:")
        print("1. Invalid API key - Check your key at https://elevenlabs.io/")
        print("2. Insufficient credits - Add credits to your account")
        print("3. Network issues - Check your internet connection")
        
        return False

def create_env_file():
    """Create .env file for API key"""
    env_content = """# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your-api-key-here

# Other API Keys (optional)
OPENAI_API_KEY=your-openai-key-here
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("📄 Created .env file")
    print("📝 Edit .env file and add your actual API keys")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--create-env":
        create_env_file()
    else:
        setup_elevenlabs() 