#!/usr/bin/env python3
"""
ENVIRONMENT CONFIGURATION LOADER
Automatically loads all API keys from config.env
"""

import os
from pathlib import Path
from dotenv import load_dotenv

def load_all_apis():
    """Load all API keys from config.env"""
    
    # Get current directory
    current_dir = Path(__file__).parent
    config_path = current_dir / "config.env"
    
    # Load environment variables
    load_dotenv(config_path)
    
    # Track loaded APIs
    loaded_apis = []
    missing_apis = []
    
    # API configuration mapping
    api_mapping = {
        "ELEVENLABS_API_KEY": "ElevenLabs Voice Cloning",
        "FIREBASE_API_KEY": "Firebase Memory Federation", 
        "STRIPE_SECRET_KEY": "Stripe Payment Processing",
        "TWITTER_API_KEY": "Twitter Storm Responder",
        "YOUTUBE_API_KEY": "YouTube Content Extraction",
        "OPENAI_API_KEY": "OpenAI Agent Intelligence"
    }
    
    print("🚀 LOADING API CONFIGURATION")
    print("=" * 40)
    
    # Check each API
    for key, description in api_mapping.items():
        value = os.getenv(key)
        if value and value != f"your_{key.lower()}_here":
            loaded_apis.append(f"✅ {description}: {key[:8]}...")
        else:
            missing_apis.append(f"⚠️ {description}: {key}")
    
    # Display results
    if loaded_apis:
        print("\n🟢 ACTIVE APIS:")
        for api in loaded_apis:
            print(f"   {api}")
    
    if missing_apis:
        print("\n🔴 MISSING APIS:")
        for api in missing_apis:
            print(f"   {api}")
    
    # Create environment summary
    print(f"\n📊 CONFIGURATION SUMMARY:")
    print(f"   ✅ Loaded: {len(loaded_apis)} APIs")
    print(f"   ⚠️ Missing: {len(missing_apis)} APIs")
    print(f"   📁 Config file: {config_path}")
    
    return len(loaded_apis), len(missing_apis)

def setup_environment():
    """Complete environment setup"""
    
    print("🎯 NODE OUT ENVIRONMENT SETUP")
    print("=" * 50)
    
    # Load configuration
    loaded, missing = load_all_apis()
    
    if loaded > 0:
        print(f"\n🚀 {loaded} APIs ready for activation!")
        print("Run individual scripts to activate each system:")
        print("  python3 activate_elevenlabs.py")
        print("  python3 activate_firebase.py") 
        print("  python3 activate_stripe.py")
        print("  python3 activate_twitter.py")
        print("  python3 activate_youtube.py")
    
    if missing > 0:
        print(f"\n📋 {missing} APIs need configuration")
        print("Edit config.env with your actual API keys")
        print("File location: /Users/joewales/NODE_OUT_Master/config.env")
    
    return loaded, missing

if __name__ == "__main__":
    setup_environment()
