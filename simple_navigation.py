#!/usr/bin/env python3
"""
Simple navigation with clean syntax
"""

import subprocess

def simple_navigate():
    """Simple navigation with proper syntax"""
    
    print("🎯 Simple navigation to Nashville...")
    
    # Much simpler AppleScript
    applescript = """
tell application "System Events"
    tell application process "UnrealEditor"
        set frontmost to true
        delay 1
        
        keystroke "`"
        delay 1
        
        keystroke "fly"
        key code 36
        delay 1
        
        keystroke "`"
        
    end tell
end tell
"""
    
    try:
        subprocess.run(['osascript', '-e', applescript], check=True)
        print("✅ Simple navigation sent")
        print("🔄 Should enable fly mode - try WASD keys now")
        
    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    simple_navigate()