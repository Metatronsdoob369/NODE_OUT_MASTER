#!/usr/bin/env python3
"""
Navigate to Nashville to see OSM buildings while Birmingham city loads
"""

import subprocess

def jump_to_nashville():
    """Navigate to Nashville for instant city view"""
    
    print("🎵 Jumping to Nashville for city view...")
    
    applescript = '''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 0.5
        
        -- Open console
        keystroke "`"
        delay 0.5
        
        -- Nashville coordinates (36.1627, -86.7816)
        keystroke "CesiumGeoreference.SetOriginLatitude 36.1627"
        key code 36
        delay 1
        
        keystroke "CesiumGeoreference.SetOriginLongitude -86.7816"
        key code 36
        delay 1
        
        -- Position camera above downtown Nashville
        keystroke "setpos 0 0 50000"
        key code 36
        delay 1
        
        -- Look down at city
        keystroke "camera pitch -60"
        key code 36
        delay 1
        
        -- Close console
        keystroke "`"
        
    end tell
end tell
'''
    
    try:
        subprocess.run(['osascript', '-e', applescript], check=True)
        print("✅ Jumped to Nashville")
        print("🏙️ You should see Nashville downtown with OSM buildings")
        print("🎯 Birmingham city continues building in background")
        
    except:
        print("❌ Navigation failed")

if __name__ == "__main__":
    jump_to_nashville()