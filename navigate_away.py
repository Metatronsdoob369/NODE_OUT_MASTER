#!/usr/bin/env python3
"""
Navigate to different location while city loads
"""

import subprocess

def navigate_to_safe_location():
    """Move camera to empty area while city generates"""
    
    print("🎯 Moving to safe viewing location...")
    
    applescript = '''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 0.5
        
        -- Open console
        keystroke "`"
        delay 0.5
        
        -- Move to high altitude above Birmingham but away from building area
        keystroke "setpos 100000 100000 200000"
        key code 36
        delay 1
        
        -- Look down
        keystroke "camera pitch -45"
        key code 36
        delay 1
        
        -- Close console
        keystroke "`"
        
    end tell
end tell
'''
    
    try:
        subprocess.run(['osascript', '-e', applescript], check=True)
        print("✅ Moved to safe viewing location")
        print("🌍 High altitude view - city loading in background")
        print("⏳ City generation continues without performance impact")
        
    except:
        print("❌ Navigation failed")

if __name__ == "__main__":
    navigate_to_safe_location()