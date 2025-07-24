#!/usr/bin/env python3
"""
Test ElevenLabs Creator Package Setup for NODE
This script tests the setup without requiring an API key
"""

import os
from dotenv import load_dotenv

def test_setup():
    """Test the ElevenLabs setup"""
    print("🎤 Testing ElevenLabs Creator Package Setup for NODE")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv()
    
    # Check if .env file exists
    if os.path.exists('.env'):
        print("✅ .env file found")
    else:
        print("❌ .env file not found")
        print("Create .env file with: ELEVENLABS_API_KEY=your_api_key")
        return False
    
    # Check if API key is set
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if api_key and api_key != 'paste_your_api_key_here':
        print("✅ API key found in .env file")
        print(f"📝 Key starts with: {api_key[:10]}...")
    else:
        print("❌ API key not properly set in .env file")
        print("Please add your actual ElevenLabs API key")
        return False
    
    # Test imports
    try:
        from elevenlabs import ElevenLabs, Voice
        print("✅ ElevenLabs library imported successfully")
    except ImportError as e:
        print(f"❌ ElevenLabs import failed: {e}")
        print("Run: pip install --upgrade elevenlabs")
        return False
    
    try:
        import pygame
        print("✅ pygame imported successfully")
    except ImportError as e:
        print(f"❌ pygame import failed: {e}")
        print("Run: pip install pygame")
        return False
    
    # Test client connection
    try:
        client = ElevenLabs(api_key=api_key)
        print("✅ ElevenLabs client created successfully")
        
        # Test getting voices
        voice_list = client.voices.get_all()
        print(f"✅ Connected to Creator package!")
        print(f"📊 Available voices: {len(voice_list.voices)}")
        
        # Show some voice options
        print("\n🎤 Sample Creator Package Voices:")
        for i, voice in enumerate(voice_list.voices[:5]):
            print(f"  {i+1}. {voice.name} ({voice.voice_id})")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection test failed: {e}")
        print("Check your API key and internet connection")
        return False

def show_next_steps():
    """Show next steps after successful setup"""
    print("\n" + "=" * 60)
    print("🎉 SETUP SUCCESSFUL!")
    print("=" * 60)
    
    print("\n🚀 Next Steps:")
    print("1. Run: python node_creator_voice.py")
    print("2. Test different voices for NODE")
    print("3. Create premium agent voicemails")
    print("4. Start Birmingham real estate outreach")
    
    print("\n📞 NODE Creator Voice System Ready!")
    print("🏢 Company: NODE")
    print("👤 Owner: Preston")
    print("📍 Location: Birmingham, AL")
    print("📱 Phone: +1205-307-9153")

if __name__ == "__main__":
    success = test_setup()
    
    if success:
        show_next_steps()
    else:
        print("\n🔧 Setup Issues Found:")
        print("1. Make sure you have ElevenLabs Creator package")
        print("2. Get your API key from https://elevenlabs.io/")
        print("3. Create .env file with your API key")
        print("4. Run this test again") 