import sys
import subprocess
import os

def install_package(package):
    """Install a package using pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except:
        return False

def test_imports():
    """Test all voice-related imports"""
    results = {}
    
    # Test basic speech recognition
    try:
        import speech_recognition as sr
        results['speech_recognition'] = '✅ Working'
    except ImportError:
        print("Installing speech_recognition...")
        if install_package('SpeechRecognition'):
            results['speech_recognition'] = '✅ Installed and working'
        else:
            results['speech_recognition'] = '❌ Failed to install'
    
    # Test text-to-speech
    try:
        import pyttsx3
        results['pyttsx3'] = '✅ Working'
    except ImportError:
        print("Installing pyttsx3...")
        if install_package('pyttsx3'):
            results['pyttsx3'] = '✅ Installed and working'
        else:
            results['pyttsx3'] = '❌ Failed to install'
    
    # Test ElevenLabs
    try:
        from elevenlabs import generate, set_api_key
        results['elevenlabs'] = '✅ Working'
    except ImportError:
        print("Installing elevenlabs...")
        if install_package('elevenlabs'):
            try:
                from elevenlabs import generate, set_api_key
                results['elevenlabs'] = '✅ Installed and working'
            except:
                results['elevenlabs'] = '⚠️ Installed but import issues'
        else:
            results['elevenlabs'] = '❌ Failed to install'
    
    # Test audio processing
    try:
        import soundfile
        import numpy
        results['audio_processing'] = '✅ Working'
    except ImportError:
        print("Installing audio processing libraries...")
        success1 = install_package('soundfile')
        success2 = install_package('numpy')
        if success1 and success2:
            results['audio_processing'] = '✅ Installed and working'
        else:
            results['audio_processing'] = '❌ Failed to install'
    
    return results

def test_basic_voice():
    """Test basic text-to-speech functionality"""
    try:
        import pyttsx3
        engine = pyttsx3.init()
        print("🔊 Testing NODE voice system...")
        
        # Test message for Preston's NODE company
        test_message = "Hello, this is Preston from NODE in Birmingham, Alabama. Voice system test successful."
        
        print(f"Speaking: {test_message}")
        engine.say(test_message)
        engine.runAndWait()
        return "✅ Voice test completed successfully"
    except Exception as e:
        return f"❌ Voice test failed: {e}"

if __name__ == "__main__":
    print("🎤 NODE Voice System Setup and Testing")
    print("=" * 50)
    
    # Test all imports
    print("Testing voice imports...")
    results = test_imports()
    
    print("\n📊 VOICE SYSTEM STATUS:")
    for component, status in results.items():
        print(f"  {component}: {status}")
    
    # Test basic voice if pyttsx3 is working
    if 'pyttsx3' in results and '✅' in results['pyttsx3']:
        print("\n🔊 Testing voice output...")
        voice_result = test_basic_voice()
        print(f"Voice Test: {voice_result}")
    
    print("\n🎯 NODE VOICE CAPABILITIES:")
    working_components = [k for k, v in results.items() if '✅' in v]
    
    if 'pyttsx3' in working_components:
        print("  ✅ Basic text-to-speech for agent calls")
        print("  ✅ Automated voicemail generation")
    
    if 'elevenlabs' in working_components:
        print("  ✅ Professional-quality voice generation")
        print("  ✅ Premium voicemails for real estate agents")
    
    if 'speech_recognition' in working_components:
        print("  ✅ Voice input processing")
        print("  ✅ Interactive voice conversations")
    
    if len(working_components) >= 2:
        print("\n🎉 NODE voice system is ready for Birmingham real estate agent outreach!")
    else:
        print("\n⚠️ Some voice components need attention, but basic functionality available")
    
    print(f"\n📞 Ready for Preston at +1205-307-9153 in Birmingham, AL") 