#!/usr/bin/env python3
"""
NODE ElevenLabs Setup Script
Sets up ElevenLabs integration for premium voice quality
"""

import os
import subprocess
import sys

def install_elevenlabs():
    """Install ElevenLabs Python SDK"""
    print("🎙️ Installing ElevenLabs Python SDK...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "elevenlabs"])
        print("✅ ElevenLabs SDK installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install ElevenLabs SDK: {e}")
        return False

def check_api_key():
    """Check if ElevenLabs API key is configured"""
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if api_key:
        print(f"✅ ElevenLabs API key found (starts with: {api_key[:8]}...)")
        return True
    else:
        print("⚠️ ElevenLabs API key not found")
        print("\nTo set your ElevenLabs API key:")
        print("1. Get your API key from https://elevenlabs.io/docs/api-reference/authentication")
        print("2. Run: export ELEVENLABS_API_KEY='your_api_key_here'")
        print("3. Or add it to your ~/.zshrc or ~/.bashrc file")
        return False

def test_elevenlabs_connection():
    """Test connection to ElevenLabs API"""
    try:
        from elevenlabs import ElevenLabs
        api_key = os.getenv("ELEVENLABS_API_KEY")
        if not api_key:
            return False
            
        client = ElevenLabs(api_key=api_key)
        # Try to get available voices
        voices = client.voices.get_all()
        print(f"✅ Connected to ElevenLabs successfully")
        print(f"📢 Available voices: {len(voices.voices)}")
        
        # Show first few voices
        for i, voice in enumerate(voices.voices[:3]):
            print(f"   {i+1}. {voice.name} ({voice.voice_id})")
        
        return True
    except Exception as e:
        print(f"❌ Failed to connect to ElevenLabs: {e}")
        return False

def main():
    print("🚀 NODE ElevenLabs Setup")
    print("=" * 50)
    
    # Step 1: Install ElevenLabs
    if not install_elevenlabs():
        return False
    
    # Step 2: Check API key
    if not check_api_key():
        print("\n🔧 Setup incomplete - missing API key")
        return False
    
    # Step 3: Test connection
    if not test_elevenlabs_connection():
        print("\n🔧 Setup incomplete - connection failed")
        return False
    
    print("\n🎉 NODE ElevenLabs setup complete!")
    print("\nNEXT STEPS:")
    print("1. Start your backend server: python clay_i_server.py")
    print("2. Open NODE_Complete.html in your browser")
    print("3. Click 'Demo Voice' to hear premium ElevenLabs quality")
    print("\n💡 Your NODE platform now has professional-grade voice synthesis!")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)