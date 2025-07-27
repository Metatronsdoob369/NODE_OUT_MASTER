#!/usr/bin/env python3
"""
Direct navigation using different method
"""

import subprocess

def direct_navigate():
    """Try direct navigation method"""
    
    print("🎯 Trying direct navigation...")
    
    applescript = '''
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 1
        
        -- Try different console approach
        keystroke "`"
        delay 1
        
        -- Clear any text
        keystroke "a" using command down
        key code 51
        delay 0.5
        
        -- Simple movement command
        keystroke "fly"
        key code 36
        delay 1
        
        keystroke "ghost"
        key code 36
        delay 1
        
        -- Try teleport to different coordinates
        keystroke "teleport 100000 100000 100000"
        key code 36
        delay 2
        
        keystroke "`"
        
    end tell
end tell
'''
    
    try:
        subprocess.run(['osascript', '-e', applescript], check=True)
        print("✅ Navigation commands sent")
        print("🔄 Try using WASD keys to move around manually")
        
    except:
        print("❌ Failed")

if __name__ == "__main__":
    direct_navigate()