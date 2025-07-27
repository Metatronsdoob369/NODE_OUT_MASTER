#!/usr/bin/env python3
"""
Fix camera angle - look down at Birmingham instead of sideways
"""

import subprocess

def fix_camera_angle():
    """Fix camera to look down at Birmingham"""
    
    print("🎥 Fixing camera angle...")
    
    applescript = '''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 0.5
        
        -- Open console
        keystroke "`"
        delay 0.5
        
        -- Look down at Birmingham (pitch down 45 degrees)
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
        print("✅ Camera angle fixed - now looking down at Birmingham")
    except:
        print("❌ Camera fix failed")

if __name__ == "__main__":
    fix_camera_angle()